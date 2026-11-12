// The Token map page's data (OD-274): areas, scales, used steps, the decisions on each step with their
// recorded reasons, their components with readable names, and nothing invented. Run on the real
// schemes, so the numbers are the ones the docs page shows.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { betterName, plainWhy, tokenMapView } from "../src/token-map-view.mjs";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";

const roots = assetRoots();
const g = grammar(roots);
const view = (id, brand) => tokenMapView({ scheme: loadScheme(id, roots), grammar: g, brand, componentSource: SOURCE });
// The two component files these tests name: enough for betterName, without reading the whole folder.
const SOURCE = ["empty", "calendar"]
  .map((c) => readFileSync(new URL(`../../ui/src/components/${c}.tsx`, import.meta.url), "utf8"))
  .join("\n");
const af = view("accessible-first");
const light = af.modes.light;
const blue = light.families.find((f) => f.id === "blue");

test("every area of the scheme is a node, Color first", () => {
  assert.deepEqual(af.areas, ["Color", "Spacing", "Size", "Type", "Shape", "Elevation", "Motion", "Opacity"]);
});

test("a scale lists only the steps a decision uses", () => {
  assert.deepEqual(blue.steps.map((s) => s.step), ["100", "600", "700"]);
  for (const f of [...light.families, ...af.shared.families]) assert.ok(f.steps.every((s) => s.decisions.length > 0), f.id);
});

test("blue 600 is the brand hue, with the checks it passes and the decisions that use it", () => {
  const s = blue.steps.find((x) => x.step === "600");
  assert.equal(s.brand, true);
  assert.equal(s.otherMode, "#8AB4F8");
  assert.deepEqual(s.decisions, ["color.action.primary", "color.border.focus", "color.border.selected", "color.category.1"]);
  assert.deepEqual(s.checks.map((c) => c.what), ["White text on it is easy to read", "Visible on every surface"]);
});

test("a decision carries the scheme's recorded reason, without the pick's prefix or ratio", () => {
  const p = light.decisions["color.action.primary"];
  assert.equal(p.why, "brand blue marks the main action, with AAA white text.");
  assert.equal(p.stepWhy, "The lightest blue where white text reads at AAA.");
  assert.ok(p.answers.includes("color.definition"));
  assert.ok(af.answers["color.definition"].why.startsWith("True neutrals and blue 600 as the brand"));
});

test("a decision that copies another one is on the map, and says which", () => {
  assert.equal(light.decisions["color.text.on-action"].via, "color.text.on-dark");
  assert.ok(af.modes.light.families.find((f) => f.id === "gray").steps.find((s) => s.step === "0").decisions.includes("color.text.on-action"));
});

test("a decision lists its components, each with the token rows that read it", () => {
  const p = light.decisions["color.action.primary"];
  assert.equal(p.components.length, 15); // 15 with Icon (OD-285).
  assert.deepEqual(p.components.find((c) => c.component === "button").rows.map((r) => r.id), ["component.button.primary.background"]);
});

test("a numbered component token gets a name from how the component code reads it", () => {
  assert.deepEqual(betterName("component.empty.padding-2", SOURCE), { name: "padding on wide screens", read: true });
  assert.deepEqual(betterName("component.calendar.border-2", SOURCE), { name: "edge when focused", read: true });
  assert.deepEqual(betterName("component.calendar.background-4.@", SOURCE), { name: "fill", read: false });
  assert.equal(betterName("component.button.primary.background.@", SOURCE), null);
});

test("nothing on the map is invented: no sample data, and a why only where the scheme records one", () => {
  const text = JSON.stringify(af);
  assert.ok(!/sample/i.test(text));
  // space.gap.default has no theme pick: its why is the scheme's own words (the token's reason or a usage
  // rule's), and the grammar's trace rule adds answers, never a sentence.
  const gap = af.shared.decisions["space.gap.default"];
  const scheme = loadScheme("accessible-first");
  const own = scheme.tokens.semantic.space.gap.default.$extensions?.["open-ds"]?.why;
  assert.ok([own, ...scheme.usage.map((u) => u.why)].includes(gap.why), gap.why);
  assert.ok(gap.answers.includes("spacing.definition"));
  assert.equal(gap.description, "Between items in one group.");
});

test("the pick's why loses its prefix and its measured tail", () => {
  assert.equal(
    plainWhy("blue.light.600: the focus ring, so the keyboard's place is never lost, 7.26:1 on surface.default, above the 3:1 floor."),
    "the focus ring, so the keyboard's place is never lost",
  );
  assert.equal(plainWhy(null), null);
});

test("every scheme and brand builds a map with color and the other areas", () => {
  for (const id of ["brand-expressive", "content-first", "dense-data"]) {
    const v = view(id);
    assert.ok(v.modes.light.families.length > 0 && v.shared.families.length > 0, id);
  }
  const birch = view("multi-brand", "birch");
  assert.equal(birch.brand, "birch");
  assert.deepEqual(birch.brands, ["aster", "birch", "coral"]);
  // multi-brand's hue slate-deep has a hyphen in its name.
  assert.ok(birch.modes.light.families.some((f) => f.id === "slate-deep"));
});
