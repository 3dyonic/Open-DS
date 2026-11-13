// The color token map (OD-274): from a color value to the decisions that read it, the components
// that show them, the chain of answers behind a decision, and what changes when the value changes.
// Run on the real Accessible first scheme, so the numbers are the ones the docs page shows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenMap } from "../src/token-graph.mjs";
import { GRADED_STEPS } from "../src/color-steps.mjs";
import { loadScheme } from "../src/schemes.mjs";
import {
  colorIndex,
  componentsShowing,
  decisionsReading,
  groupsReading,
  impactOf,
  plainName,
  reasonChain,
  rowLabel,
  selectionFor,
} from "../src/color-map.mjs";

const scheme = loadScheme("accessible-first");
const map = tokenMap({ scheme });
const light = colorIndex(map.graphs["default/light"], "light");
const dark = colorIndex(map.graphs["default/dark"], "dark");
const BLUE_600 = "color.blue.light.600";
const valueOf = (id) => light.nodes.get(id).value;

test("a hue lists the steps of the current mode only, so no ramp shows as its own family", () => {
  const blue = light.hues.find((h) => h.id === "blue");
  assert.equal(blue.steps.length, 11);
  assert.ok(blue.steps.every((s) => s.id.startsWith("color.blue.light.")));
  assert.deepEqual(blue.steps.slice(0, 3).map((s) => s.step), ["50", "100", "200"]);
  assert.ok(dark.hues.every((h) => h.steps.every((s) => !s.id.includes(".light."))));
  assert.equal(plainName(BLUE_600), "blue 600");
});

test("blue 600 is read by four decisions in three semantic groups", () => {
  assert.deepEqual(
    groupsReading(light, BLUE_600).map((g) => [g.id, g.decisions]),
    [
      ["Action", ["color.action.primary.@"]],
      ["Border", ["color.border.focus", "color.border.selected"]],
      ["Category", ["color.category.1.@"]],
    ],
  );
});

test("a neutral rename is not a decision: gray 200 leads to the decisions that read color.neutral.200", () => {
  const decisions = decisionsReading(light, "color.gray.light.200");
  assert.ok(decisions.includes("color.border.default"));
  assert.ok(!decisions.some((d) => d.startsWith("color.neutral.")));
});

test("a decision shows in components, one row per component token", () => {
  const shown = componentsShowing(light, "color.border.focus");
  assert.equal(shown.length, 26);
  const button = shown.find((c) => c.component === "button");
  assert.deepEqual(button.rows, ["component.button.focus-ring"]);
  assert.equal(rowLabel("component.tabs.trigger.focus-ring"), "trigger focus ring");
});

// OD-303: the focus ring is decided by the states answer (accessibility.roles, the decision mapping), and its
// color comes from the palette; neither rests on the text contrast floor.
test("the focus ring's reasons run from the states answer and the palette to the business, without the text contrast floor", () => {
  const chain = reasonChain(light, map.reasons, "color.border.focus");
  assert.deepEqual(
    chain.steps.map((s) => s.id),
    // With the graded curve on (OD-299), the steps answer shapes the ring's step too.
    ["accessibility.roles", "people.q2", "people.q1", "business.q1", "color.definition", "color.lands", "outcomes.q1", "tasks.q1", "content.q1", ...(GRADED_STEPS ? ["color.definition.steps"] : [])],
  );
  assert.equal(chain.steps[0].answer, "All, including loading");
  assert.deepEqual(chain.links.slice(0, 5), [
    { from: "accessibility.roles", to: "decision" },
    { from: "people.q2", to: "accessibility.roles" },
    { from: "people.q1", to: "people.q2" },
    { from: "business.q1", to: "people.q1" },
    { from: "color.definition", to: "decision" },
  ]);
  assert.ok(!chain.steps.some((s) => s.id === "accessibility.definition"));
});

test("a fill keeps the text contrast floor among its reasons: its label is text", () => {
  const chain = reasonChain(light, map.reasons, "color.action.primary.@");
  assert.ok(chain.steps.some((s) => s.answer === "AAA for text"));
  const focus = reasonChain(light, map.reasons, "color.border.focus");
  assert.ok(!focus.steps.some((s) => s.answer === "AAA for text"));
});

test("changing blue 600 changes 4 decisions and 34 components, and all of its checks pass", () => {
  const impact = impactOf(light, BLUE_600);
  assert.equal(impact.decisions, 4);
  assert.equal(impact.components, 34); // 34 with Icon (OD-285): its solid container reads the primary action.
  assert.ok(impact.checks.every((c) => c.check.met));
});

test("trying blue 300 fails the primary action and the focus ring; blue 400 fails only the action; blue 500 passes everything", () => {
  const of = (impact, id) => impact.checks.find((c) => c.decision === id).check;
  const three = impactOf(light, BLUE_600, valueOf("color.blue.light.300"));
  assert.equal(of(three, "color.action.primary.@").met, false);
  assert.match(of(three, "color.action.primary.@").text, /2\.56:1, needs 4\.5:1/);
  assert.equal(of(three, "color.border.focus").met, false);
  assert.match(of(three, "color.border.focus").text, /2\.19:1 on sunken, needs 3:1/);
  // On the graded curve (OD-299, released in OD-308), steps 400 apart reach 3:1: enough for a ring, not for text.
  const four = impactOf(light, BLUE_600, valueOf("color.blue.light.400"));
  assert.equal(of(four, "color.action.primary.@").met, false);
  assert.match(of(four, "color.action.primary.@").text, /3\.61:1, needs 4\.5:1/);
  assert.equal(of(four, "color.border.focus").met, true);
  const five = impactOf(light, BLUE_600, valueOf("color.blue.light.500"));
  assert.ok(five.checks.every((c) => c.check.met));
});

test("?focus= opens the path to a decision, a component token or a primitive", () => {
  const path = { hue: "blue", step: BLUE_600, group: "Border", decision: "color.border.focus" };
  assert.deepEqual(selectionFor(light, "color.border.focus"), path);
  assert.deepEqual(selectionFor(light, "component.button.focus-ring"), path);
  assert.deepEqual(selectionFor(light, BLUE_600), { hue: "blue", step: BLUE_600, group: null, decision: null });
  assert.equal(selectionFor(light, "not.a.token"), null);
});
