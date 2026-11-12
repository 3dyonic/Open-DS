// The type scale (OD-294, OD-301). The loader generates every type size and line height from it.
//
// A scheme records its scale on the type group (semantic.type.$extensions["open-ds"]): the body size it
// grows from, a ratio, each role's step, a rounding rule, and the line height kinds. A role's size is
// base × ratio^step. The roles the rounding rule names snap to its grid; every other role rounds to
// whole px. A role's line height is the ratio of its kind. A kind with a grid sets a line box instead:
// size × ratio, snapped to that grid, as a length. No file access, so every reader shares it.

/** The line height kinds, in the order a scheme lists them. tight and open are required. */
export const KINDS = ["tight", "snug", "open"];

const SUPERSCRIPT = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const superscript = (n) => [...String(n)].map((c) => SUPERSCRIPT[c]).join("");
/** A number as a reason writes it: at most two decimals, no trailing zeros. */
export const plain = (n) => String(Math.round(n * 100) / 100);
const snap = (px, grid) => Math.round(px / grid) * grid;
const rem = (px) => `${px / 16}rem`;
// A line height primitive is named by its ratio: 1.45 is font.line-height.1_45.
const ratioName = (ratio) => String(ratio).replace(".", "_");
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Each role's size: { px, exact, snapped }. snapped is the grid in px, or null for whole px. */
export function sizeOf(spec, role) {
  const exact = spec.base * spec.ratio ** spec.steps[role];
  const grid = spec.rounding.roles.includes(role) ? spec.rounding.grid : null;
  return { px: grid ? snap(exact, grid) : Math.round(exact), exact, snapped: grid };
}

/** Each role's font size in px. */
export function sizes(spec) {
  return Object.fromEntries(Object.keys(spec.steps).map((role) => [role, sizeOf(spec, role).px]));
}

/** The kind a role's line height takes: tight, snug or open. */
const kindOf = (spec, role) => KINDS.find((k) => spec["line-height"][k]?.roles.includes(role));

/**
 * Each role's line height: { kind, ratio, grid, px }. With no grid the value is the ratio; with a grid
 * px is the line box, size × ratio snapped to the grid.
 */
export function lineHeights(spec) {
  const out = {};
  for (const role of Object.keys(spec.steps)) {
    const kind = kindOf(spec, role);
    const { ratio, grid = null } = spec["line-height"][kind];
    out[role] = { kind, ratio, grid, px: grid ? snap(sizeOf(spec, role).px * ratio, grid) : null };
  }
  return out;
}

/**
 * The problems in a spec, as plain sentences: a role with no step or no line height kind, a role in
 * two kinds, a step that is not a whole number, or a rounding role with no step. An empty list means
 * the spec is whole.
 */
export function specProblems(spec) {
  const roles = Object.keys(spec.steps ?? {});
  const kinds = KINDS.filter((k) => spec["line-height"]?.[k]);
  const problems = [];
  for (const role of roles) {
    if (!Number.isInteger(spec.steps[role])) problems.push(`${role}: the step ${spec.steps[role]} is not a whole number`);
    const n = kinds.filter((k) => spec["line-height"][k].roles.includes(role)).length;
    if (n !== 1) problems.push(`${role}: it must take one line height kind, once`);
  }
  for (const k of kinds)
    for (const role of spec["line-height"][k].roles)
      if (!roles.includes(role)) problems.push(`${role}: it has a line height but no step`);
  for (const role of spec.rounding?.roles ?? [])
    if (!roles.includes(role)) problems.push(`${role}: the rounding rule names it, but it has no step`);
  return problems;
}

const answersOf = (follows) => `(${follows.join(", ")})`;

/** The reason of a generated size: the rule and the numbers, then the answers it follows. */
function sizeWhy(spec, role) {
  const { px, exact, snapped } = sizeOf(spec, role);
  const step = spec.steps[role];
  const sum = `${spec.base} × ${spec.ratio}${superscript(step)}`;
  const how =
    px === exact
      ? `${sum}${step === 0 ? ", the base of the type scale" : ""}`
      : snapped
        ? `${sum} = ${plain(exact)}px, snapped to the ${snapped}px grid`
        : `${sum} = ${plain(exact)}px, rounded to whole px`;
  return `${capital(role)} text is ${px}px = ${how} ${answersOf(spec.follows)}.`;
}

const KIND_SAYS = {
  tight: "the tight ratio for text that stays on one short line",
  snug: "the snug ratio for dense text that wraps rarely",
  open: "the open ratio for text that wraps",
};

/** The reason of a generated line height. */
function lineWhy(spec, role) {
  const size = sizeOf(spec, role).px;
  const { kind, ratio, grid, px } = lineHeights(spec)[role];
  if (!grid) return `${capital(role)} lines are ${ratio} × the ${size}px size, ${KIND_SAYS[kind]} ${answersOf(spec.follows)}.`;
  return `${capital(role)} lines are ${px}px = ${size}px × ${ratio} = ${plain(size * ratio)}px, snapped to the ${grid}px grid, ${KIND_SAYS[kind]} ${answersOf(spec.follows)}.`;
}

/**
 * The tokens the scale generates. roles: { <role>: { "font-size", "line-height" } }, each a link with
 * its reason. primitives: the font.size, font.line-height and font.line-box options the links read.
 */
export function typeTokens(spec) {
  const px = sizes(spec);
  const lines = lineHeights(spec);
  const reason = (why) => ({ "open-ds": { why, because: spec.follows } });
  const roles = {};
  for (const role of Object.keys(spec.steps)) {
    const line = lines[role];
    roles[role] = {
      "font-size": { $type: "dimension", $value: `{font.size.${px[role]}}`, $extensions: reason(sizeWhy(spec, role)) },
      "line-height": line.grid
        ? { $type: "dimension", $value: `{font.line-box.${line.px}}`, $extensions: reason(lineWhy(spec, role)) }
        : { $type: "number", $value: `{font.line-height.${ratioName(line.ratio)}}`, $extensions: reason(lineWhy(spec, role)) },
    };
  }
  const byNumber = (values) => [...new Set(values)].sort((a, b) => a - b);
  const ratios = byNumber(Object.values(lines).filter((l) => !l.grid).map((l) => l.ratio));
  const boxes = byNumber(Object.values(lines).filter((l) => l.grid).map((l) => l.px));
  return {
    roles,
    primitives: {
      size: Object.fromEntries(byNumber(Object.values(px)).map((n) => [String(n), { $type: "dimension", $value: rem(n) }])),
      "line-height": Object.fromEntries(
        ratios.map((r) => [ratioName(r), { $type: "number", $value: r, $description: "A ratio of the text size." }]),
      ),
      "line-box": Object.fromEntries(
        boxes.map((n) => [String(n), { $type: "dimension", $value: rem(n), $description: "A line box: one line's height." }]),
      ),
    },
  };
}
