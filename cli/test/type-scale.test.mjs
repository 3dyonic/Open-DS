// The type scale generator (OD-294, OD-301).
import { test } from "node:test";
import assert from "node:assert/strict";
import { lineHeights, sizes, specProblems, typeTokens } from "../src/type-scale.mjs";

const spec = {
  base: 16,
  ratio: 1.25,
  steps: { display: 3, heading: 1, body: 0, data: 0, caption: -1 },
  rounding: { grid: 4, roles: ["display", "heading"] },
  "line-height": {
    tight: { ratio: 1.2, roles: ["display", "heading"] },
    snug: { ratio: 1.3, roles: ["data"], grid: 2 },
    open: { ratio: 1.5, roles: ["body", "caption"] },
  },
  follows: ["typography.values"],
};

test("a size is base × ratio^step; the rounding roles snap to the grid, the others round to whole px", () => {
  // display 31.25 snaps to 32, heading 20 stays, caption 12.8 rounds to 13.
  assert.deepEqual(sizes(spec), { display: 32, heading: 20, body: 16, data: 16, caption: 13 });
});

test("the owner's rounding rule moves only the four listed sizes", () => {
  const dense = { base: 14, ratio: 1.2, steps: { heading: 1, data: 0 }, rounding: { grid: 4, roles: ["heading"] } };
  const accessible = { base: 19, ratio: 1.22, steps: { heading: 1, label: 0 }, rounding: { grid: 4, roles: ["heading"] } };
  const multi = { base: 16, ratio: 1.26, steps: { title: 2, label: -1 }, rounding: { grid: 4, roles: ["title"] } };
  assert.deepEqual(sizes(dense), { heading: 16, data: 14 });
  assert.deepEqual(sizes(accessible), { heading: 24, label: 19 });
  assert.deepEqual(sizes(multi), { title: 24, label: 13 });
});

test("a role takes its kind's ratio; a kind with a grid sets a line box on that grid", () => {
  const lines = lineHeights(spec);
  assert.deepEqual(lines.heading, { kind: "tight", ratio: 1.2, grid: null, px: null });
  // 16 × 1.3 = 20.8, on the 2px grid: 20.
  assert.deepEqual(lines.data, { kind: "snug", ratio: 1.3, grid: 2, px: 20 });
});

test("the tokens link to the options they generate, and each reason states its rule and numbers", () => {
  const { roles, primitives } = typeTokens(spec);
  assert.equal(roles.heading["font-size"].$value, "{font.size.20}");
  assert.equal(roles.display["font-size"].$extensions["open-ds"].why, "Display text is 32px = 16 × 1.25³ = 31.25px, snapped to the 4px grid (typography.values).");
  assert.equal(roles.data["line-height"].$value, "{font.line-box.20}");
  assert.equal(roles.data["line-height"].$type, "dimension");
  assert.equal(roles.body["line-height"].$value, "{font.line-height.1_5}");
  assert.deepEqual(roles.body["line-height"].$extensions["open-ds"].because, ["typography.values"]);
  assert.deepEqual(Object.keys(primitives.size), ["13", "16", "20", "32"]);
  assert.equal(primitives.size["13"].$value, "0.8125rem");
  assert.deepEqual(Object.keys(primitives["line-height"]), ["1_2", "1_5"]);
  assert.deepEqual(primitives["line-box"], { 20: { $type: "dimension", $value: "1.25rem", $description: "A line box: one line's height." } });
});

test("a role with no kind, in two kinds, on a half step, or rounded with no step is a problem", () => {
  assert.deepEqual(specProblems(spec), []);
  const bad = structuredClone(spec);
  bad.steps.label = 0.5;
  bad["line-height"].tight.roles.push("body");
  bad.rounding.roles.push("title");
  const problems = specProblems(bad);
  assert.ok(problems.some((p) => p.startsWith("label: the step 0.5")));
  assert.ok(problems.some((p) => p.startsWith("label: it must take one line height kind")));
  assert.ok(problems.some((p) => p.startsWith("body: it must take one line height kind")));
  assert.ok(problems.some((p) => p.startsWith("title: the rounding rule names it")));
});
