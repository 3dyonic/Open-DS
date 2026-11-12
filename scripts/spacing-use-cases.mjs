// OD-294: writes each scheme's space tokens from its spacing record, and its control heights and row
// from its control scale. Run after changing a base, a multiple or a control step:
// node scripts/spacing-use-cases.mjs
import {
  controlHeights,
  controlProblems,
  linkOf,
  spaceProblems,
  spaceValues,
} from "../cli/src/spacing-use-cases.mjs";
import { grammar, loadScheme, saveScheme } from "../cli/src/schemes.mjs";

// Each scheme's records live in the scheme (the space and size groups' $extensions). These seed a
// scheme that has none yet; after that, change the scheme and rerun.
const useCases = (
  tight,
  groupDefault,
  group,
  section,
  controlX,
  cellX,
  container,
) => ({
  "gap.tight": {
    level: "component",
    relation: "inner",
    reach: "inline",
    multiple: tight,
  },
  "gap.default": {
    level: "component",
    relation: "inner",
    multiple: groupDefault,
  },
  "gap.group": { level: "layout", relation: "inner", multiple: group },
  "gap.section": {
    level: "layout",
    relation: "inner",
    reach: "section",
    multiple: section,
  },
  "inset.control-x": {
    level: "component",
    relation: "container",
    reach: "inline",
    multiple: controlX,
  },
  "inset.cell-x": {
    level: "component",
    relation: "container",
    reach: "inline",
    multiple: cellX,
  },
  "inset.container": {
    level: "layout",
    relation: "container",
    multiple: container,
  },
});
const SPACE_FOLLOWS = ["spacing.definition", "spacing.values"];
const CONTROL_FOLLOWS = ["accessibility.values", "spacing.roles"];

export const SEED = {
  "dense-data": {
    space: {
      base: 4,
      "use-cases": useCases(1, 2, 4, 6, 3, 3, 4),
      follows: SPACE_FOLLOWS,
      why: "Small steps on a 4px grid give a 4px base. Compact density keeps the multiples low: parts of one item sit one step apart, groups four and sections six.",
    },
    size: {
      default: 32,
      step: 8,
      steps: { compact: -1, large: 0 },
      row: { plus: 0 },
      follows: CONTROL_FOLLOWS,
      why: "A pointer target sets the 32px default. Compact is one 8px step below it; large equals the default, as the scheme has no hero action. Rows are a decision of their own and stay one control tall.",
    },
  },
  "content-first": {
    space: {
      base: 8,
      "use-cases": useCases(1, 2, 4, 8, 2.5, 2, 3),
      follows: SPACE_FOLLOWS,
      why: "Big, even steps give an 8px base. Spacious density doubles each gap: tight, default, group and section are 1, 2, 4 and 8 steps.",
    },
    size: {
      default: 48,
      step: 8,
      steps: { compact: -1, large: 0 },
      row: { plus: 0 },
      follows: CONTROL_FOLLOWS,
      why: "A touch target sets the 48px default. Compact is one 8px step below it; large equals the default, as actions are rare and calm. The scheme has no row role, so a row takes the default.",
    },
  },
  "accessible-first": {
    space: {
      base: 8,
      "use-cases": useCases(1.5, 2, 4, 6, 3, 2, 3),
      follows: SPACE_FOLLOWS,
      why: "Big, even steps give an 8px base. Spacious density starts the tight gap at one and a half steps, so even close parts stay apart at high zoom.",
    },
    size: {
      default: 52,
      step: 4,
      steps: { compact: -1, large: 0 },
      row: { plus: 4 },
      follows: CONTROL_FOLLOWS,
      why: "A large target sets the 52px default. The step is 4px, so compact stays at the 48px large target size; large equals the default, as every control is already large. Rows are a decision of their own, one step taller than a control.",
    },
  },
  "brand-expressive": {
    space: {
      base: 8,
      "use-cases": useCases(1, 2, 5, 8, 3.5, 2, 4),
      follows: SPACE_FOLLOWS,
      why: "Big, even steps give an 8px base. Spacious density opens the layout gaps wide, five and eight steps, so big moments have room.",
    },
    size: {
      default: 52,
      step: 8,
      steps: { compact: -1, large: 1 },
      row: { plus: 0 },
      follows: CONTROL_FOLLOWS,
      why: "A touch target sets the 52px default. Compact is one 8px step below it; large is one step above it, for the one loud sign-up action. The scheme has no row role, so a row takes the default.",
    },
  },
  "multi-brand": {
    space: {
      base: 4,
      "use-cases": useCases(2, 3, 6, 12, 4, 4, 6),
      follows: SPACE_FOLLOWS,
      why: "Every brand shares small steps on a 4px grid, so the base is 4px. Comfortable density sets each multiple, with big steps for product pages.",
    },
    size: {
      default: 44,
      step: 8,
      steps: { compact: -1, large: 0 },
      row: { plus: 4 },
      follows: CONTROL_FOLLOWS,
      why: "A touch target sets the 44px default. Compact is one 8px step below it; large equals the default, as brand color marks the main action. Rows are a decision of their own, 4px taller than a control.",
    },
  },
};

// The group with its $description first, then the record, then its tokens.
const withRecord = (group, spec) => {
  const { $description, $extensions, ...rest } = group;
  return {
    ...($description && { $description }),
    $extensions: { ...$extensions, "open-ds": spec },
    ...rest,
  };
};
const at = (tree, path) => path.split(".").reduce((n, k) => n?.[k], tree);

const g = grammar();
const vocabulary = g.scopes.find((s) => s.id === "spacing").use_cases;
for (const id of Object.keys(SEED)) {
  const s = loadScheme(id);
  const semantic = s.tokens.semantic;
  const answer = (q) => s.answers.find((a) => a.question === q)?.option;
  const space = semantic.space.$extensions?.["open-ds"] ?? SEED[id].space;
  const size = semantic.size.$extensions?.["open-ds"] ?? SEED[id].size;
  const problems = [
    ...spaceProblems(space, {
      vocabulary,
      definition: answer("spacing.definition"),
    }),
    ...controlProblems(size, {
      rowRole: answer("spacing.roles") === "gap-inset-row",
    }),
  ];
  if (problems.length)
    throw new Error(
      `${id}: the spacing records are not whole. ${problems.join("; ")}. Fix the record in the scheme and rerun.`,
    );
  const write = (group, values) => {
    for (const [path, px] of Object.entries(values)) {
      const token = at(semantic[group], path);
      if (!token)
        throw new Error(
          `${id}: the record has ${group}.${path}, but the scheme has no such token. Add the token or remove it from the record.`,
        );
      if (!(String(px) in s.tokens.primitive[group]))
        throw new Error(
          `${id}: ${group}.${path} needs the primitive ${group}.${px}, which the scheme lacks. Add the primitive and rerun.`,
        );
      token.$value = linkOf(group, px);
    }
  };
  write("space", spaceValues(space));
  write("size", controlHeights(size));
  semantic.space = withRecord(semantic.space, space);
  semantic.size = withRecord(semantic.size, size);
  saveScheme(s);
}
console.log(
  `Wrote the spacing records and control scales in ${Object.keys(SEED).length} schemes.`,
);
