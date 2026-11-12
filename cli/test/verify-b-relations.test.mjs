// verify-b: seeded defects for criterion 2, relations kept between base and candidate (OD-298).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { sandbox, drop, snap, withEdits, compare, row, failing, set, prim, themeToken, setTheme, ratio, dist, simDist, mergeUnder, grayAt, lab } from "./verify-b-helpers.mjs";

const IDS = ["dense-data"];
let root, base, L, D;
before(async () => {
  root = sandbox();
  base = await snap(root, IDS);
  L = base.schemes["dense-data"].values.light;
  D = base.schemes["dense-data"].values.dark;
});
after(() => drop(root));

const val = (s, path, v) => set(s, [...path, "$value"], v);
const dd = (fn) => (s) => fn(s["dense-data"]);
async function check(mutate, ids) {
  const card = compare(base, await withEdits(root, IDS, mutate));
  const rows = ids.map((id) => row(card, id));
  return { card, rows, flagged: rows.some((r) => !r.pass && r.candidate > r.base) && !card.pass };
}
const show = (rows) => JSON.stringify(rows.map((r) => [r.id, r.base, r.candidate, r.details?.slice(0, 4)]));

// WCAG level drop
test("R1 light text.secondary AAA -> AA (still >= 4.5:1) is caught as a level drop", async () => {
  assert.ok(ratio(L["color.text.secondary"], L["color.surface.canvas"]) >= 7);
  assert.ok(ratio(L["color.neutral.600"], L["color.surface.canvas"]) < 7 && ratio(L["color.neutral.600"], L["color.surface.canvas"]) >= 4.5);
  const { rows, flagged } = await check(dd((s) => setTheme(s, "light", "color.text.secondary", "{color.neutral.600}")), ["relations.wcag-level-drops"]);
  assert.ok(flagged, show(rows));
});
test("R2 dark text.muted AA -> AA-large is caught as a level drop", async () => {
  const { rows, flagged } = await check(dd((s) => setTheme(s, "dark", "color.text.muted", "{color.neutral.300}")), ["relations.wcag-level-drops"]);
  assert.ok(flagged, show(rows));
});

// Step order
test("R3 slate light 300 and 400 swapped is caught as a step order break", async () => {
  const { rows, flagged } = await check(dd((s) => {
    const a = s.tokens.primitive.color.slate.light;
    [a["300"].$value, a["400"].$value] = [a["400"].$value, a["300"].$value];
  }), ["relations.step-order"]);
  assert.ok(flagged, show(rows));
});
test("R4 slate dark 800 set darker than dark 700 is caught as a step order break", async () => {
  const { rows, flagged } = await check(dd((s) => val(s, prim("color.slate.dark.800"), "#D0D6E0")), ["relations.step-order"]);
  assert.ok(flagged, show(rows));
});

// Surface ladder order
test("R5 light sunken and default swapped is caught as a ladder order break", async () => {
  const { rows, flagged } = await check(dd((s) => {
    setTheme(s, "light", "color.surface.sunken", "{color.neutral.0}");
    setTheme(s, "light", "color.surface.default", "{color.neutral.100}");
  }), ["relations.ladder-order"]);
  assert.ok(flagged, show(rows));
});
test("R6 light raised dropped below default is caught as a ladder order break", async () => {
  const { rows, flagged } = await check(dd((s) => setTheme(s, "light", "color.surface.raised", "{color.neutral.100}")), ["relations.ladder-order"]);
  assert.ok(flagged, show(rows));
});

// Rest -> hover keeps sign and a 0.02 gap
test("R7 primary hover turns lighter than rest (sign flip) is caught", async () => {
  assert.ok(lab(L["color.action.primary.hover"])[0] < lab(L["color.action.primary"])[0]);
  const { rows, flagged } = await check(dd((s) => setTheme(s, "light", "color.action.primary.hover", "{color.violet.light.500}")), ["relations.state-sign", "relations.state-gap"]);
  assert.ok(flagged, show(rows));
});
test("R8 primary hover darker by under 0.02 OKLab is caught", async () => {
  const hover = "#4A3ED5";
  const d = dist(hover, L["color.action.primary"]);
  assert.ok(d < 0.02 && d > 0.002 && lab(hover)[0] < lab(L["color.action.primary"])[0], `d=${d}`);
  const { rows, flagged } = await check(dd((s) => setTheme(s, "light", "color.action.primary.hover", hover)), ["relations.state-sign", "relations.state-gap"]);
  assert.ok(flagged, show(rows));
});
test("R9 danger hover flips sign in dark mode is caught", async () => {
  // dark: danger #F28B8B, hover #FAA9A8 (lighter). Make hover darker.
  const { rows, flagged } = await check(dd((s) => setTheme(s, "dark", "color.action.danger.hover", "{color.red.dark.400}")), ["relations.state-sign", "relations.state-gap"]);
  assert.ok(flagged, show(rows));
});

// Distinct pairs stay distinct
const setBoth = (s, mode, tokens, hex) => { for (const t of tokens) setTheme(s, mode, t, hex); };
test("R10 warning moved onto danger (normal vision) is caught", async () => {
  const hex = "#C22D2D";
  assert.ok(dist(hex, L["color.status.danger"]) < 0.02 && dist(hex, L["color.status.danger"]) > 0);
  const { rows, flagged } = await check(dd((s) => setBoth(s, "light", ["color.status.warning", "color.category.4"], hex)), ["relations.distinct-lost.normal"]);
  assert.ok(flagged, show(rows));
});
test("R11 dark info moved onto dark category 1 (normal vision) is caught", async () => {
  const hex = "#ABA4F4";
  assert.ok(dist(hex, D["color.category.1"]) < 0.02);
  const { rows, flagged } = await check(dd((s) => setBoth(s, "dark", ["color.status.info", "color.category.2"], hex)), ["relations.distinct-lost.normal"]);
  assert.ok(flagged, show(rows));
});
for (const [n, vision, tokens, partner] of [
  ["R12", "deuteranopia", ["color.status.success", "color.category.3"], "color.status.danger"],
  ["R13", "protanopia", ["color.status.success", "color.category.3"], "color.status.danger"],
  ["R14", "tritanopia", ["color.status.info", "color.category.2"], "color.category.1"],
]) {
  test(`${n} a color that merges with ${partner} only under ${vision} is caught`, async () => {
    const hex = mergeUnder(L[partner], vision);
    const before = simDist(L[tokens[0]], L[partner], vision);
    const after = simDist(hex, L[partner], vision);
    assert.ok(before >= 0.02, `base pair not distinct under ${vision}: ${before}`);
    assert.ok(after < 0.02 && dist(hex, L[partner]) >= 0.1, `design: ${hex} sim ${after} normal ${dist(hex, L[partner])}`);
    const { rows, flagged, card } = await check(dd((s) => setBoth(s, "light", tokens, hex)), [`relations.distinct-lost.${vision}`]);
    assert.ok(flagged, `${hex} sim=${after.toFixed(4)} ` + show(rows));
    assert.ok(row(card, "relations.distinct-lost.normal").pass, "normal vision should still be distinct");
  });
}

// Shared colors stay shared
test("R15 action.danger split from status.danger by a tiny literal is caught", async () => {
  assert.equal(L["color.action.danger"], L["color.status.danger"]);
  const { rows, flagged, card } = await check(dd((s) => setTheme(s, "light", "color.action.danger", "#C52C2C")), ["relations.shared-split"]);
  assert.ok(flagged, show(rows));
  assert.ok(row(card, "shift.review-unreasoned").pass, "the move itself is under the pass tier");
});
test("R16 category.1 split from action.primary is caught", async () => {
  assert.equal(L["color.category.1"], L["color.action.primary"]);
  const { rows, flagged } = await check(dd((s) => setTheme(s, "light", "color.category.1", "{color.violet.light.500}")), ["relations.shared-split"]);
  assert.ok(flagged, show(rows));
});

// Clean change
test("R-clean slate light 700 nudged by under 0.01 OKLab is not flagged", async () => {
  const hex = grayAt(L["color.neutral.700"], 0.008, true);
  const near = "#3A4352";
  assert.ok(dist(near, L["color.neutral.700"]) < 0.015, `${hex} ${dist(near, L["color.neutral.700"])}`);
  const card = compare(base, await withEdits(root, IDS, dd((s) => val(s, prim("color.slate.light.700"), near))));
  assert.deepEqual(failing(card), []);
});

test("R-edits land: each seeded edit reaches the candidate snapshot", async () => {
  const c = await withEdits(root, IDS, dd((s) => { setTheme(s, "light", "color.status.warning", "#C22D2D"); setTheme(s, "light", "color.action.danger", "#C52C2C"); }));
  assert.equal(c.schemes["dense-data"].values.light["color.status.warning"], "#C22D2D");
  assert.equal(c.schemes["dense-data"].values.light["color.action.danger"], "#C52C2C");
});
