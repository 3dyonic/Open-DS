// verify-b: seeded defects for criterion 4, the curve checks (OD-298).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { sandbox, drop, snap, withEdits, compare, row, failing, set, prim, lab, lch, hexOfLch, ratio } from "./verify-b-helpers.mjs";

const IDS = ["dense-data"];
let root, base, P;
before(async () => {
  root = sandbox();
  base = await snap(root, IDS);
  P = base.schemes["dense-data"].palette.slate;
});
after(() => drop(root));

const val = (s, path, v) => set(s, [...path, "$value"], v);
const dd = (fn) => (s) => fn(s["dense-data"]);
const show = (card, ids) => JSON.stringify(ids.map((id) => { const r = row(card, id); return [id, r.base, r.candidate, r.pass, r.gated, r.direction, r.details?.slice(0, 5)]; }));
const withL = (hex, L) => hexOfLch({ ...lch(hex), L });
/** The slate color, in the hue of `hex`, whose WCAG ratio against `other` is `target` (bisection on OKLab L). */
function atRatio(hex, other, target, lo, hi) {
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const r = ratio(withL(hex, mid), other);
    // the further mid moves from `other`, the higher the ratio
    if ((r > target) === (lab(other)[0] > mid)) lo = mid; else hi = mid;
  }
  return withL(hex, (lo + hi) / 2);
}
const flaggedGap = (card) => { const r = row(card, "curves.min-gap"); return !r.pass && r.candidate > r.base && !card.pass; };

// Minimum lightness gap 0.03
test("C1 light 400 pulled to 0.02 below 300 is caught", async () => {
  const hex = withL(P.light["400"], lab(P.light["300"])[0] - 0.02);
  const card = compare(base, await withEdits(root, IDS, dd((s) => val(s, prim("color.slate.light.400"), hex))));
  assert.ok(flaggedGap(card), `${hex} ` + show(card, ["curves.min-gap"]));
});
test("C2 dark 300 pushed to 0.015 below dark 400 is caught", async () => {
  const hex = withL(P.dark["300"], lab(P.dark["400"])[0] - 0.015);
  const card = compare(base, await withEdits(root, IDS, dd((s) => val(s, prim("color.slate.dark.300"), hex))));
  assert.ok(flaggedGap(card), `${hex} ` + show(card, ["curves.min-gap"]));
});

// Contrast grades: 400 apart 3:1, 500 apart 4.5:1, 700 apart 7:1
const GRADES = [
  ["G1", "500 apart: light 500 at 4.2:1 on light 0", "light", "500", "0", 4.2, 4.5],
  ["G2", "400 apart: dark 300 at 2.8:1 on dark 700", "dark", "300", "700", 2.8, 3],
  ["G3", "700 apart: light 700 at 6.8:1 on light 0", "light", "700", "0", 6.8, 7],
];
for (const [n, label, mode, step, other, target, need] of GRADES) {
  const design = () => {
    const before = ratio(P[mode][step], P[mode][other]);
    const hex = atRatio(P[mode][step], P[mode][other], target, 0.3, 0.99);
    return { before, hex, after: ratio(hex, P[mode][other]) };
  };
  // Known miss: with DEFAULT_PARAMS (gradesGated: false) curves.grades is report-only, so the gate passes.
  test(`${n} ${label} is caught with the default parameters`, { todo: "The owner decided curves.grades stays report-only (gradesGated: false) until OD-299 lands; the gated variant below passes." }, async () => {
    const { before, hex, after } = design();
    assert.ok(before >= need, `precondition: base ${before}`);
    assert.ok(Math.abs(after - target) < 0.1, `design ${hex} ${after}`);
    const card = compare(base, await withEdits(root, IDS, dd((s) => val(s, prim(`color.slate.${mode}.${step}`), hex))));
    const r = row(card, "curves.grades");
    assert.ok(r.candidate > r.base, "the miss is measured: " + show(card, ["curves.grades"]));
    assert.ok(!r.pass && !card.pass, "the miss fails the gate: " + show(card, ["curves.grades"]));
  });
  test(`${n} ${label} is caught with gradesGated: true`, async () => {
    const { hex } = design();
    const card = compare(base, await withEdits(root, IDS, dd((s) => val(s, prim(`color.slate.${mode}.${step}`), hex))), { curves: { gradesGated: true } });
    const r = row(card, "curves.grades");
    assert.ok(!r.pass && !card.pass && r.candidate > r.base, show(card, ["curves.grades"]));
  });
}

// Clean change
test("Cu-clean dark 400 nudged lighter by 0.008 OKLab is not flagged", async () => {
  const hex = withL(P.dark["400"], lab(P.dark["400"])[0] + 0.008);
  const cand = await withEdits(root, IDS, dd((s) => val(s, prim("color.slate.dark.400"), hex)));
  assert.equal(cand.schemes["dense-data"].palette.slate.dark["400"], hex);
  const card = compare(base, cand, { curves: { gradesGated: true } });
  assert.deepEqual(failing(card), [], show(card, failing(card)));
});
