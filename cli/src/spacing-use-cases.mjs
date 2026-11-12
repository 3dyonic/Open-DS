// Spacing by use case and the control scale (OD-294). Shared by the scheme writer and the harness.
//
// A scheme records its spacing on the space group (semantic.space.$extensions["open-ds"]): one base in
// px and, for each space token, its use case (level, relation, reach) and a multiple. The value is
// base × multiple. The spacing definition answer sets the base: small steps on a 4px grid take 4px,
// big even steps take 8px. A multiple is whole or a half, so every value stays on the 4px grid.
//
// A scheme records its control scale on the size group (semantic.size.$extensions["open-ds"]): the
// default control height, the step between heights, and the step of compact and large. A row is the
// default control height plus a number of px; a scheme with no row role adds nothing.
// The math runs here, once, when the scheme is written; every reader gets the stored values.

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

/** The control heights a control scale covers, by their path under size, and the row. */
export const CONTROL_TOKENS = [
  "control.compact",
  "control.default",
  "control.large",
];

/** Each space token's px value: base × multiple. */
export function spaceValues(spec) {
  return Object.fromEntries(
    Object.entries(spec["use-cases"]).map(([path, useCase]) => [
      path,
      spec.base * useCase.multiple,
    ]),
  );
}

/**
 * The problems in a spacing record, as plain sentences. `vocabulary` is the grammar's spacing
 * use_cases: the words each axis may use. `definition` is the scheme's spacing.definition option.
 * An empty list means the record is whole.
 */
export function spaceProblems(spec, { vocabulary, definition }) {
  const problems = [];
  const wantBase = BASE_BY_DEFINITION[definition];
  if (wantBase === undefined)
    problems.push(`the spacing definition ${definition} has no base`);
  else if (spec.base !== wantBase)
    problems.push(
      `the base is ${spec.base}px, but the definition ${definition} sets ${wantBase}px`,
    );
  const useCases = spec["use-cases"] ?? {};
  for (const path of SPACE_TOKENS)
    if (!(path in useCases)) problems.push(`space.${path} has no use case`);
  for (const [path, useCase] of Object.entries(useCases)) {
    if (!SPACE_TOKENS.includes(path))
      problems.push(`space.${path} is not a space token`);
    if (!Number.isInteger(useCase.multiple * 2))
      problems.push(
        `space.${path}: the multiple ${useCase.multiple} is not whole or a half`,
      );
    for (const axis of ["level", "relation", "reach"]) {
      const word = useCase[axis];
      if (word === undefined && axis === "reach") continue;
      const words = (vocabulary?.[axis]?.options ?? []).map((o) => o.id);
      if (!words.includes(word))
        problems.push(
          `space.${path}: the ${axis} ${word} is not a word of the grammar`,
        );
    }
  }
  return problems;
}

/** Each control height and the row in px: default + step × the role's step; the row adds its px. */
export function controlHeights(spec) {
  const steps = { default: 0, ...spec.steps };
  const out = {};
  for (const role of ["compact", "default", "large"])
    out[`control.${role}`] = spec.default + spec.step * steps[role];
  out.row = spec.default + spec.row.plus;
  return out;
}

/**
 * The problems in a control scale, as plain sentences. `rowRole` is true when the scheme's
 * spacing.roles answer names row heights. A scheme with no row role takes the default as its row.
 */
export function controlProblems(spec, { rowRole }) {
  const problems = [];
  const { compact, large } = spec.steps ?? {};
  if (!Number.isInteger(compact) || compact >= 0)
    problems.push(
      `the compact step ${compact} is not a whole step below default`,
    );
  if (!Number.isInteger(large) || large < 0)
    problems.push(
      `the large step ${large} is not a whole step at or above default`,
    );
  if (!rowRole && spec.row?.plus !== 0)
    problems.push(
      `the row adds ${spec.row?.plus}px, but the scheme has no row role, so the row takes the default`,
    );
  return problems;
}

/** The token link for a px value: a space or size primitive of that size. */
export const linkOf = (group, px) => `{${group}.${px}}`;
