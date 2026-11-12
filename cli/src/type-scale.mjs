// The type scale (OD-294). Shared by the scheme writer and the harness.
//
// A scheme records its scale on the type group (semantic.type.$extensions["open-ds"]): the body size
// it grows from, a ratio, each role's step, and two line heights. A role's size is base × ratio^step,
// rounded to whole px. A role is tight (one short line: headings, labels) or open (text that wraps).
// The math runs here, once, when the scheme is written; every reader gets the stored values.

const rem = (px) => `${px / 16}rem`;
// A line height primitive is named by its ratio: 1.45 is font.line-height.1_45.
const lineHeightName = (ratio) => String(ratio).replace(".", "_");

/** Each role's font size in whole px, from a scale spec: base × ratio^step. */
export function sizes(spec) {
  return Object.fromEntries(
    Object.entries(spec.steps).map(([role, step]) => [role, Math.round(spec.base * spec.ratio ** step)]),
  );
}

/** Each role's line height ratio: the tight ratio for a tight role, the open ratio for an open one. */
export function lineHeights(spec) {
  const out = {};
  for (const kind of ["tight", "open"])
    for (const role of spec["line-height"][kind].roles) out[role] = spec["line-height"][kind].ratio;
  return out;
}

/**
 * The problems in a spec, as plain sentences: a role with no step or no line height kind, a role in
 * both kinds, or a step that is not a whole number. An empty list means the spec is whole.
 */
export function specProblems(spec) {
  const roles = Object.keys(spec.steps ?? {});
  const tight = spec["line-height"]?.tight?.roles ?? [];
  const open = spec["line-height"]?.open?.roles ?? [];
  const problems = [];
  for (const role of roles) {
    if (!Number.isInteger(spec.steps[role])) problems.push(`${role}: the step ${spec.steps[role]} is not a whole number`);
    const kinds = [tight.includes(role), open.includes(role)].filter(Boolean).length;
    if (kinds !== 1) problems.push(`${role}: it must be tight or open, once`);
  }
  for (const role of [...tight, ...open]) if (!roles.includes(role)) problems.push(`${role}: it has a line height but no step`);
  return problems;
}

/**
 * The scale as token links, ready for a scheme: { roles: { <role>: { "font-size", "line-height" } },
 * primitives: { size: [px], "line-height": [{ name, value }] } }. Each value links to a font primitive
 * of its own size or ratio, so semantics stay links.
 */
export function scaleTokens(spec) {
  const px = sizes(spec);
  const lh = lineHeights(spec);
  const roles = {};
  for (const role of Object.keys(spec.steps))
    roles[role] = {
      "font-size": `{font.size.${px[role]}}`,
      "line-height": `{font.line-height.${lineHeightName(lh[role])}}`,
    };
  return {
    roles,
    primitives: {
      size: [...new Set(Object.values(px))].sort((a, b) => a - b),
      "line-height": [spec["line-height"].tight.ratio, spec["line-height"].open.ratio].map((value) => ({
        name: lineHeightName(value),
        value,
      })),
    },
  };
}

export const remOf = rem;
