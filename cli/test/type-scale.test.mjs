// The type scale generator (OD-294).
import { test } from "node:test";
import assert from "node:assert/strict";
import { lineHeights, scaleTokens, sizes, specProblems } from "../src/type-scale.mjs";

const spec = {
  base: 16,
  ratio: 1.25,
  steps: { display: 3, heading: 1, body: 0, data: 0, caption: -1 },
  "line-height": {
    tight: { ratio: 1.2, roles: ["display", "heading"] },
    open: { ratio: 1.5, roles: ["body", "data", "caption"] },
  },
};

test("a size is base × ratio^step, rounded to whole px; roles can share a step", () => {
  assert.deepEqual(sizes(spec), { display: 31, heading: 20, body: 16, data: 16, caption: 13 });
});

test("a tight role takes the tight ratio, an open role the open one", () => {
  assert.deepEqual(lineHeights(spec), { display: 1.2, heading: 1.2, body: 1.5, data: 1.5, caption: 1.5 });
});

test("the tokens link to font primitives of their own size and ratio", () => {
  const { roles, primitives } = scaleTokens(spec);
  assert.deepEqual(roles.heading, { "font-size": "{font.size.20}", "line-height": "{font.line-height.1_2}" });
  assert.deepEqual(primitives.size, [13, 16, 20, 31]);
  assert.deepEqual(primitives["line-height"], [
    { name: "1_2", value: 1.2 },
    { name: "1_5", value: 1.5 },
  ]);
});

test("a role with no line height kind, in both kinds, or on a half step is a problem", () => {
  assert.deepEqual(specProblems(spec), []);
  const bad = structuredClone(spec);
  bad.steps.label = 0.5;
  bad["line-height"].tight.roles.push("body");
  const problems = specProblems(bad);
  assert.ok(problems.some((p) => p.startsWith("label: the step 0.5")));
  assert.ok(problems.some((p) => p.startsWith("label: it must be tight or open")));
  assert.ok(problems.some((p) => p.startsWith("body: it must be tight or open")));
});
