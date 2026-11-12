// Quality gate, relations hold (OD-298): WCAG levels and margins, step and ladder order, state deltas,
// distinct colors under three color vision deficiencies, and shared colors.
import { test } from "node:test";
import assert from "node:assert/strict";
import { oklabDistance, simulate } from "../src/quality/color.mjs";
import { distinctPairs, measure, relative, stateFamilies } from "../src/quality/criteria/color-relations.mjs";
import { DEFAULT_PARAMS, paramsFrom } from "../src/quality/params.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

const P = DEFAULT_PARAMS;
const theme = (s, mode) => s.tokens.brands.default.theme[mode].color;
const sem = (s) => s.tokens.semantic.color;
const pick = (v) => ({ $value: v, $extensions: { "open-ds": { why: `${v}: a pick made for this relations test only.`, because: ["color.values"] } } });

// The fixture with a hover and a pressed step on the primary action, and two status colors.
function withStates({ hover = "{color.violet.light.700}", pressed = "{color.violet.light.800}", success = "{color.status-blue.light.600}" } = {}) {
  const s = fixtureScheme();
  s.tokens.primitive.color["status-red"] = { light: { 600: { $value: "#C62828" } }, dark: { 600: { $value: "#C62828" } } };
  s.tokens.primitive.color["status-blue"] = { light: { 600: { $value: "#1565C0" } }, dark: { 600: { $value: "#1565C0" } } };
  s.tokens.primitive.color["status-green"] = { light: { 600: { $value: "#488410" } }, dark: { 600: { $value: "#488410" } } };
  for (const mode of ["light", "dark"]) {
    const t = theme(s, mode);
    t.action.primary.hover = pick(hover.replace("light", mode));
    t.action.primary.pressed = pick(pressed.replace("light", mode));
    t.status = { danger: pick(`{color.status-red.${mode}.600}`), success: pick(success.replace("light", mode)) };
  }
  sem(s).action.primary.hover = { $value: "{theme.color.action.primary.hover}" };
  sem(s).action.primary.pressed = { $value: "{theme.color.action.primary.pressed}" };
  sem(s).status = { danger: { $value: "{theme.color.status.danger}" }, success: { $value: "{theme.color.status.success}" } };
  return s;
}

test("the clean fixture keeps its margin and its state gaps", () => {
  const m = measure(snapshotOf(withStates()), P);
  assert.equal(valueOf(m, "relations.contrast-margin"), 0);
  assert.equal(valueOf(m, "relations.state-gap"), 0);
  for (const r of relative(snapshotOf(withStates()), snapshotOf(withStates()), P)) assert.equal(r.value, 0, r.id);
  assert.deepEqual(stateFamilies(["color.a", "color.a.hover", "color.a.pressed", "color.b.hover"]), [["color.a", "color.a.hover", "color.a.pressed"]]);
});

test("a contrast pair that drops a WCAG level fails; the margin is a parameter", () => {
  const s = withStates();
  theme(s, "dark").text.primary.$value = "{color.gray.dark.300}";
  const r = relative(snapshotOf(withStates()), snapshotOf(s), P);
  assert.equal(valueOf(r, "relations.wcag-level-drops"), 2);
  assert.ok(compareSnapshots(snapshotOf(withStates()), snapshotOf(s)).failed.includes("relations.wcag-level-drops"));
  assert.equal(valueOf(measure(snapshotOf(s), P), "relations.contrast-margin"), 2);
  // every clean pair is under 4.5 + 20
  assert.equal(valueOf(measure(snapshotOf(withStates()), paramsFrom({ relations: { contrastMargin: 20 } })), "relations.contrast-margin"), 4);
});

test("two scale steps that swap lightness order fail once", () => {
  const s = withStates();
  const row = s.tokens.primitive.color.violet.light;
  [row["400"].$value, row["500"].$value] = [row["500"].$value, row["400"].$value];
  const r = relative(snapshotOf(withStates()), snapshotOf(s), P);
  assert.equal(valueOf(r, "relations.step-order"), 1);
  assert.deepEqual(r.find((m) => m.id === "relations.step-order").details, ["fixture: violet.light steps 400 and 500 swap lightness order"]);
});

test("a raised surface darker than the default breaks the ladder order", () => {
  const s = withStates();
  theme(s, "dark").surface.raised.$value = "{color.gray.dark.50}";
  const r = relative(snapshotOf(withStates()), snapshotOf(s), P);
  // raised drops below default, and to sunken's level
  assert.deepEqual(r.find((m) => m.id === "relations.ladder-order").details, [
    "fixture/dark: color.surface.sunken and color.surface.raised swap lightness order",
    "fixture/dark: color.surface.default and color.surface.raised swap lightness order",
  ]);
});

test("a hover that lightens where it darkened flips the sign; a hover equal to rest is too close", () => {
  const flipped = withStates({ hover: "{color.violet.light.500}" });
  const r = relative(snapshotOf(withStates()), snapshotOf(flipped), P);
  // rest → hover flips in both modes (the dark scale runs the other way); hover → pressed keeps its sign
  assert.deepEqual(r.find((m) => m.id === "relations.state-sign").details, [
    "fixture/light: color.action.primary → color.action.primary.hover darkened on base, lightens now",
    "fixture/dark: color.action.primary → color.action.primary.hover lightened on base, darkens now",
  ]);
  // hover equal to rest, in light and in dark
  const same = withStates({ hover: "{color.violet.light.600}" });
  assert.equal(valueOf(measure(snapshotOf(same), P), "relations.state-gap"), 2);
});

test("a success color that only deuteranopes confuse with danger is lost under deuteranopia only", () => {
  assert.equal(oklabDistance(simulate("#488410", "deuteranopia"), simulate("#C62828", "deuteranopia")) < 0.001, true);
  const s = withStates({ success: "{color.status-green.light.600}" });
  const r = relative(snapshotOf(withStates()), snapshotOf(s), P);
  assert.equal(valueOf(r, "relations.distinct-lost.normal"), 0);
  assert.equal(valueOf(r, "relations.distinct-lost.deuteranopia"), 2);
  assert.equal(valueOf(r, "relations.distinct-lost.protanopia"), 0);
  assert.equal(valueOf(r, "relations.distinct-lost.tritanopia"), 0);
  assert.ok(distinctPairs(snapshotOf(s).schemes.fixture, "light").some(([a, b]) => a === "color.status.danger" && b === "color.status.success"));
});

test("two surfaces made one color are no longer distinct, under every vision", () => {
  const s = withStates();
  theme(s, "dark").surface.raised.$value = "{color.gray.dark.100}";
  const r = relative(snapshotOf(withStates()), snapshotOf(s), P);
  for (const v of ["normal", "deuteranopia", "protanopia", "tritanopia"]) assert.equal(valueOf(r, `relations.distinct-lost.${v}`), 1, v);
});

test("a color that was shared and is split now fails", () => {
  const s = withStates();
  theme(s, "light").surface.raised.$value = "{color.gray.light.50}";
  const r = relative(snapshotOf(withStates()), snapshotOf(s), P);
  assert.deepEqual(r.find((m) => m.id === "relations.shared-split").details, [
    "fixture/light: color.surface.raised no longer shares color.surface.default's color (#F7F8FA vs #FFFFFF)",
  ]);
});
