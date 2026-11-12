// verify-b: seeded defects for criterion 1, the invariants (OD-298). Independent of the gate's own tests.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { sandbox, drop, snap, withEdits, compare, row, failing, set, prim, themeToken } from "./verify-b-helpers.mjs";

const IDS = ["dense-data", "content-first", "brand-expressive"];
let root, base;
before(async () => { root = sandbox(); base = await snap(root, IDS); });
after(() => drop(root));

const val = (s, path, v) => set(s, [...path, "$value"], v);
const dd = (fn) => (s) => fn(s["dense-data"]);
async function caught(mutate, id, baseSnap = base) {
  const card = compare(baseSnap, await withEdits(root, IDS, mutate));
  const r = row(card, id);
  return { card, r, flagged: !r.pass && r.candidate > r.base && !card.pass };
}

// Focus ring
test("I1 focus ring equal to the default border (0 steps up) is caught", async () => {
  const { r, flagged } = await caught(dd((s) => val(s, ["tokens", "semantic", "border-width", "focus"], "{border-width.1}")), "invariants.focus-ring");
  assert.ok(flagged, JSON.stringify(r));
});
test("I2 focus ring two steps above the default border is caught", async () => {
  const { r, flagged } = await caught(dd((s) => {
    set(s, [...prim("border-width.4"), "$type"], "dimension");
    val(s, prim("border-width.4"), "4px");
    val(s, ["tokens", "semantic", "border-width", "focus"], "{border-width.4}");
  }), "invariants.focus-ring");
  assert.ok(flagged, JSON.stringify(r));
});

// Compact step
test("I3 compact control equal to the default (0 steps down) is caught", async () => {
  const { r, flagged } = await caught(dd((s) => val(s, ["tokens", "semantic", "size", "control", "compact"], "{size.32}")), "invariants.compact-step");
  assert.ok(flagged, JSON.stringify(r));
});
test("I4 compact control two steps below the default is caught", async () => {
  const { r, flagged } = await caught(dd((s) => val(s, ["tokens", "semantic", "size", "control", "compact"], "{size.16}")), "invariants.compact-step");
  assert.ok(flagged, JSON.stringify(r));
});

// Nested radius
test("I5 menu item corner larger than outer - padding - border is caught", async () => {
  const { r, flagged } = await caught(dd((s) => val(s, themeToken("base", "radius.option"), "{radius.2}")), "invariants.nested-radius");
  assert.ok(flagged, JSON.stringify(r));
});
test("I6 outer corner grows but the inner corner stays square is caught", async () => {
  const { r, flagged } = await caught(dd((s) => {
    set(s, [...prim("radius.12"), "$type"], "dimension");
    val(s, prim("radius.12"), "0.75rem");
    val(s, themeToken("base", "radius.surface"), "{radius.12}");
  }), "invariants.nested-radius");
  assert.ok(flagged, JSON.stringify(r));
});

// Dark ladder: the real schemes already fail it, so the base here is a fixed copy.
const fixLadder = (s) => {
  val(s, themeToken("dark", "color.surface.sunken"), "{color.neutral.0}");
  val(s, themeToken("dark", "color.surface.raised"), "{color.neutral.100}");
};
test("I7a precondition: the fixed dark ladder passes", async () => {
  const fixed = await withEdits(root, IDS, dd(fixLadder));
  const r = row(compare(base, fixed), "invariants.dark-ladder");
  assert.equal(r.perScheme.candidate["dense-data"], 0, JSON.stringify(r));
});
test("I7 dark raised surface equal to default (no lift) is caught", async () => {
  const fixed = await withEdits(root, IDS, dd(fixLadder));
  const { r, flagged } = await caught(dd((s) => { fixLadder(s); val(s, themeToken("dark", "color.surface.raised"), "{color.neutral.50}"); }), "invariants.dark-ladder", fixed);
  assert.ok(flagged, JSON.stringify(r));
});
test("I8 dark sunken surface lighter than default is caught", async () => {
  const fixed = await withEdits(root, IDS, dd(fixLadder));
  const { r, flagged } = await caught(dd((s) => { fixLadder(s); val(s, themeToken("dark", "color.surface.sunken"), "{color.neutral.200}"); }), "invariants.dark-ladder", fixed);
  assert.ok(flagged, JSON.stringify(r));
});

// Motion caps
test("I9 productive feedback at 200ms (cap 150ms) is caught", async () => {
  const { r, flagged } = await caught(dd((s) => val(s, prim("duration.fast"), "200ms")), "motion.duration-caps");
  assert.ok(flagged, JSON.stringify(r));
});
test("I10 panels at 350ms (cap 300ms) is caught", async () => {
  const { r, flagged } = await caught((s) => val(s["brand-expressive"], prim("duration.moderate"), "350ms"), "motion.duration-caps");
  assert.ok(flagged, JSON.stringify(r));
});
test("I11 expressive hero at 600ms (cap 500ms) is caught", async () => {
  const { r, flagged } = await caught((s) => val(s["brand-expressive"], prim("duration.relaxed"), "600ms"), "motion.duration-caps");
  assert.ok(flagged, JSON.stringify(r));
});
test("I11b expressive hero at 500ms (exactly the cap) is not flagged", async () => {
  const { r } = await caught((s) => val(s["brand-expressive"], prim("duration.relaxed"), "500ms"), "motion.duration-caps");
  assert.ok(r.pass && r.candidate === r.base, JSON.stringify(r));
});

// Hit area
test("I12 a 20px compact control (floor 24px) is caught", async () => {
  const { r, flagged } = await caught(dd((s) => {
    set(s, [...prim("size.20"), "$type"], "dimension");
    val(s, prim("size.20"), "1.25rem");
    val(s, ["tokens", "semantic", "size", "control", "compact"], "{size.20}");
  }), "accessibility.hit-area");
  assert.ok(flagged, JSON.stringify(r));
});
test("I13 a 40px default control in a touch-first scheme (floor 44px) is caught", async () => {
  const { r, flagged } = await caught((s) => val(s["content-first"], ["tokens", "semantic", "size", "control", "default"], "{size.40}"), "accessibility.hit-area");
  assert.ok(flagged, JSON.stringify(r));
});

// Clean change
test("I-clean feedback 120ms -> 140ms (under the cap) is not flagged anywhere", async () => {
  const card = compare(base, await withEdits(root, IDS, dd((s) => val(s, prim("duration.fast"), "140ms"))));
  assert.deepEqual(failing(card), []);
  assert.equal(card.pass, true);
});

// Known miss: the gate compares totals, so a new breach in one scheme hides behind a fix in another.
test("X1 a new motion breach in dense-data masked by a fix in accessible-first is caught", async () => {
  const ids = ["dense-data", "accessible-first"];
  const b = await snap(root, ids);
  const c = await withEdits(root, ids, (s) => {
    val(s["dense-data"], prim("duration.fast"), "200ms");
    val(s["accessible-first"], prim("duration.moderate"), "140ms");
  });
  const card = compare(b, c);
  const r = row(card, "motion.duration-caps");
  assert.equal(r.perScheme.candidate["dense-data"], 1, "the breach is measured per scheme");
  assert.ok(!card.pass, JSON.stringify([r.base, r.candidate, r.perScheme]));
});
