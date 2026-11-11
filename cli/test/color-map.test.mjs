// The color token map (OD-274): from a color value to the decisions that read it, the components
// that show them, the chain of answers behind a decision, and what changes when the value changes.
// Run on the real Accessible first scheme, so the numbers are the ones the docs page shows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenMap } from "../src/token-graph.mjs";
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

test("the focus ring's reasons run from the business to the palette, without the text contrast floor", () => {
  const chain = reasonChain(light, map.reasons, "color.border.focus");
  // The palette answer rests on AAA, on everyone, and on color meaning links and actions first (OD-273).
  assert.deepEqual(chain.steps.map((s) => s.answer), [
    "Neutrals and one brand ramp",
    "AAA",
    "Everyone, including people with disabilities",
    "Serves the public",
    "Links and actions",
    "Completion without errors",
    "Complete a form",
    "Forms and tasks",
  ]);
  assert.deepEqual(chain.links.slice(0, 6), [
    { from: "color.definition", to: "decision" },
    { from: "people.q2", to: "color.definition" },
    { from: "people.q1", to: "people.q2" },
    { from: "business.q1", to: "people.q1" },
    { from: "people.q1", to: "color.definition" },
    { from: "color.lands", to: "color.definition" },
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

test("trying blue 400 fails the primary action and the focus ring; blue 500 passes everything", () => {
  const four = impactOf(light, BLUE_600, valueOf("color.blue.light.400"));
  const of = (impact, id) => impact.checks.find((c) => c.decision === id).check;
  assert.equal(of(four, "color.action.primary.@").met, false);
  assert.match(of(four, "color.action.primary.@").text, /2\.56:1, needs 4\.5:1/);
  assert.equal(of(four, "color.border.focus").met, false);
  assert.match(of(four, "color.border.focus").text, /2\.19:1 on sunken, needs 3:1/);
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
