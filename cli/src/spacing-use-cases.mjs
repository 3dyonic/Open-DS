// Spacing by use case and the control scale (OD-294, OD-301). The loader generates the space tokens,
// the control heights and the row from them.
//
// A scheme records its spacing on the space group (semantic.space.$extensions["open-ds"]): for each
// space token, its use case (level, relation, reach) and a multiple. The value is base × multiple. The
// spacing.definition answer sets the base: small steps on a 4px grid take 4px, big even steps take 8px,
// so changing that answer moves every gap and inset. A multiple is whole or a half, so every value
// stays on the 4px grid.
//
// A scheme records its control scale on the size group (semantic.size.$extensions["open-ds"]): the
// default control height, the step between heights, and the step of compact and large. A row is one
// default control tall in every scheme. No file access, so every reader shares it.

/** The base in px for each spacing.definition option. */
export const BASE_BY_DEFINITION = { fine: 4, coarse: 8 };

/** The space tokens a spacing record covers, by their path under space. */
export const SPACE_TOKENS = [
  "gap.tight",
  "gap.default",
  "gap.group",
  "gap.section",
  "inset.control-x",
  "inset.cell-x",
  "inset.container",
];

/** The tokens a control scale covers, by their path under size. */
export const CONTROL_TOKENS = ["control.compact", "control.default", "control.large", "row"];

/** The base in px that a spacing.definition answer sets, or undefined for an option with none. */
export const baseOf = (definition) => BASE_BY_DEFINITION[definition];

/** Each space token's px value: base × multiple. */
export function spaceValues(spec, base) {
  return Object.fromEntries(Object.entries(spec["use-cases"]).map(([path, useCase]) => [path, base * useCase.multiple]));
}

/**
 * The problems in a spacing record, as plain sentences. `vocabulary` is the grammar's spacing
 * use_cases: the words each axis may use. `definition` is the scheme's spacing.definition option.
 * An empty list means the record is whole.
 */
export function spaceProblems(spec, { vocabulary, definition }) {
  const problems = [];
  if (baseOf(definition) === undefined) problems.push(`the spacing definition ${definition} has no base`);
  const useCases = spec["use-cases"] ?? {};
  for (const path of SPACE_TOKENS) if (!(path in useCases)) problems.push(`space.${path} has no use case`);
  for (const [path, useCase] of Object.entries(useCases)) {
    if (!SPACE_TOKENS.includes(path)) problems.push(`space.${path} is not a space token`);
    if (!Number.isInteger(useCase.multiple * 2))
      problems.push(`space.${path}: the multiple ${useCase.multiple} is not whole or a half`);
    for (const axis of ["level", "relation", "reach"]) {
      const word = useCase[axis];
      if (word === undefined && axis === "reach") continue;
      const words = (vocabulary?.[axis]?.options ?? []).map((o) => o.id);
      if (!words.includes(word)) problems.push(`space.${path}: the ${axis} ${word} is not a word of the grammar`);
    }
  }
  return problems;
}

/** Each control height and the row in px: default + step × the role's step; the row is the default. */
export function controlHeights(spec) {
  const steps = { default: 0, ...spec.steps };
  const out = {};
  for (const role of ["compact", "default", "large"]) out[`control.${role}`] = spec.default + spec.step * steps[role];
  out.row = spec.default;
  return out;
}

/** The problems in a control scale, as plain sentences. An empty list means the scale is whole. */
export function controlProblems(spec) {
  const problems = [];
  const { compact, large } = spec.steps ?? {};
  if (!Number.isInteger(compact) || compact >= 0) problems.push(`the compact step ${compact} is not a whole step below default`);
  if (!Number.isInteger(large) || large < 0) problems.push(`the large step ${large} is not a whole step at or above default`);
  return problems;
}

/** The token link for a px value: a space or size primitive of that size. */
export const linkOf = (group, px) => `{${group}.${px}}`;

const answersOf = (follows) => `(${follows.join(", ")})`;
const plain = (n) => String(Math.round(n * 100) / 100);

/** The reason of a generated space token: the use case, the multiple of the base, the answers. */
function spaceWhy(spec, path, base) {
  const u = spec["use-cases"][path];
  const useCase = [u.level, u.relation, u.reach].filter(Boolean).join(" ");
  const [group, name] = path.split(".");
  return `The ${name} ${group} is ${base * u.multiple}px = ${plain(u.multiple)} × the ${base}px base, for its ${useCase} use case ${answersOf(spec.follows)}.`;
}

/** The reason of a generated control height or row. */
function controlWhy(spec, path) {
  const px = controlHeights(spec)[path];
  const answers = answersOf(spec.follows);
  if (path === "row") return `A table row is ${px}px, one default control tall, so a row holds a control and its hit area ${answers}.`;
  const role = path.split(".")[1];
  if (role === "default") return `The default control is ${px}px, the start of the control scale and the hit area of a control ${answers}.`;
  const step = spec.steps[role];
  const how = step === 0 ? "the default, step 0 on the control scale" : `${spec.default}px ${step < 0 ? "−" : "+"} ${Math.abs(step)} × the ${spec.step}px step on the control scale`;
  return `A ${role} control is ${px}px = ${how}, so its hit area follows the default ${answers}.`;
}

/** The space tokens a spacing record generates on a base, by path under space: { $type, $value, $extensions }. */
export function spaceTokens(spec, base) {
  return Object.fromEntries(
    Object.entries(spaceValues(spec, base)).map(([path, px]) => [
      path,
      { $type: "dimension", $value: linkOf("space", px), $extensions: { "open-ds": { why: spaceWhy(spec, path, base), because: spec.follows } } },
    ]),
  );
}

/** The control heights and the row a control scale generates, by path under size. */
export function controlTokens(spec) {
  return Object.fromEntries(
    Object.entries(controlHeights(spec)).map(([path, px]) => [
      path,
      { $type: "dimension", $value: linkOf("size", px), $extensions: { "open-ds": { why: controlWhy(spec, path), because: spec.follows } } },
    ]),
  );
}
