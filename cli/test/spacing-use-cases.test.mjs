// Spacing by use case and the control scale (OD-294, OD-301).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  controlHeights,
  controlProblems,
  controlTokens,
  spaceProblems,
  spaceTokens,
  spaceValues,
} from "../src/spacing-use-cases.mjs";

const vocabulary = {
  level: { options: [{ id: "component" }, { id: "layout" }] },
  relation: { options: [{ id: "inner" }, { id: "container" }] },
  reach: { options: [{ id: "inline" }, { id: "section" }] },
};
const useCase = (level, relation, reach, multiple) => ({
  level,
  relation,
  ...(reach && { reach }),
  multiple,
});
const space = {
  base: 8,
  "use-cases": {
    "gap.tight": useCase("component", "inner", "inline", 1),
    "gap.default": useCase("component", "inner", null, 2),
    "gap.group": useCase("layout", "inner", null, 4),
    "gap.section": useCase("layout", "inner", "section", 8),
    "inset.control-x": useCase("component", "container", "inline", 2.5),
    "inset.cell-x": useCase("component", "container", "inline", 2),
    "inset.container": useCase("layout", "container", null, 3),
  },
};

test("a space value is base × multiple; a half multiple stays on the grid", () => {
  assert.deepEqual(spaceValues(space), {
    "gap.tight": 8,
    "gap.default": 16,
    "gap.group": 32,
    "gap.section": 64,
    "inset.control-x": 20,
    "inset.cell-x": 16,
    "inset.container": 24,
  });
});

test("the definition answer sets the base; a word outside the grammar or a third of a step is a problem", () => {
  assert.deepEqual(
    spaceProblems(space, { vocabulary, definition: "coarse" }),
    [],
  );
  assert.ok(
    spaceProblems(space, { vocabulary, definition: "fine" })[0].startsWith(
      "the base is 8px",
    ),
  );
  const bad = structuredClone(space);
  bad["use-cases"]["gap.tight"].multiple = 1.25;
  bad["use-cases"]["gap.group"].level = "page";
  delete bad["use-cases"]["inset.container"];
  const problems = spaceProblems(bad, { vocabulary, definition: "coarse" });
  assert.ok(
    problems.some((p) => p.startsWith("space.gap.tight: the multiple 1.25")),
  );
  assert.ok(
    problems.some((p) => p.startsWith("space.gap.group: the level page")),
  );
  assert.ok(problems.includes("space.inset.container has no use case"));
});

const control = {
  default: 52,
  step: 8,
  steps: { compact: -1, large: 1 },
  follows: ["accessibility.values"],
};

test("a control height is default + step × its step; a row is one default control tall", () => {
  assert.deepEqual(controlHeights(control), {
    "control.compact": 44,
    "control.default": 52,
    "control.large": 60,
    row: 52,
  });
});

test("compact sits below default and large at or above it", () => {
  assert.deepEqual(controlProblems(control), []);
  assert.ok(controlProblems({ ...control, steps: { compact: 0, large: 0 } })[0].startsWith("the compact step 0"));
  assert.ok(controlProblems({ ...control, steps: { compact: -1, large: -1 } })[0].startsWith("the large step -1"));
});

test("each generated token links its option and states its rule, numbers and answers", () => {
  const spaced = spaceTokens({ ...space, follows: ["spacing.definition", "spacing.values"] });
  assert.equal(spaced["inset.control-x"].$value, "{space.20}");
  assert.equal(
    spaced["inset.control-x"].$extensions["open-ds"].why,
    "The control-x inset is 20px = 2.5 × the 8px base, for its component container inline use case (spacing.definition, spacing.values).",
  );
  const sized = controlTokens(control);
  assert.equal(sized.row.$value, "{size.52}");
  assert.equal(
    sized["control.compact"].$extensions["open-ds"].why,
    "A compact control is 44px = 52px − 1 × the 8px step on the control scale, so its hit area follows the default (accessibility.values).",
  );
  assert.deepEqual(sized.row.$extensions["open-ds"].because, ["accessibility.values"]);
});
