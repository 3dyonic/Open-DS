// Quality gate, the owner's approvals (OD-298): an approval clears one flag of one check, in one scheme
// and theme, on one token or pair. A file with a bad entry stops the run.
import { test } from "node:test";
import assert from "node:assert/strict";
import { approvalFor, approvalsFrom } from "../src/quality/approvals.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf } from "./quality-fixture.mjs";

const owner = { why: "Owner approved on purpose.", approved_by: "owner" };
const focusBroken = () => {
  const s = fixtureScheme();
  s.tokens.semantic["border-width"].focus.$value = "{border-width.3}";
  return s;
};
const row = (card, id) => card.criteria.find((r) => r.id === id);

test("an invariant check's flag is cleared only by an approval that names its scheme, theme, check and token", () => {
  const base = snapshotOf(fixtureScheme());
  const flag = { scheme: "fixture", check: "invariants.focus-ring", token: "border-width.focus", ...owner };
  const run = (approvals) => compareSnapshots(base, snapshotOf(focusBroken(), { approvals }));
  assert.ok(run([]).failed.includes("invariants.focus-ring"));
  // the check fails in both themes, so one theme does not cover it
  assert.ok(run([{ ...flag, theme: "light" }]).failed.includes("invariants.focus-ring"));
  assert.ok(run([{ ...flag, theme: "*", check: "invariants.compact-step" }]).failed.includes("invariants.focus-ring"));
  assert.ok(run([{ ...flag, theme: "*", token: "border-width.default" }]).failed.includes("invariants.focus-ring"));
  const card = run([{ ...flag, theme: "light" }, { ...flag, theme: "dark" }]);
  assert.equal(row(card, "invariants.focus-ring").candidate, 0);
  assert.ok(!card.failed.includes("invariants.focus-ring"));
  assert.ok(row(card, "invariants.focus-ring").details.some((d) => d.endsWith("(approved by owner: Owner approved on purpose.)")));
});

test("a relation flag on a pair is cleared by an approval of that pair, in either order", () => {
  // the dark ladder swaps: sunken lighter than raised
  const s = fixtureScheme();
  const dark = s.tokens.brands.default.theme.dark.color.surface;
  [dark.sunken.$value, dark.raised.$value] = [dark.raised.$value, dark.sunken.$value];
  const base = snapshotOf(fixtureScheme());
  const flagged = compareSnapshots(base, snapshotOf(s));
  const before = row(flagged, "relations.ladder-order");
  assert.ok(before.candidate > 0 && flagged.failed.includes("relations.ladder-order"), JSON.stringify(before.details));
  const pairs = before.details.map((d) => d.match(/: (\S+) and (\S+) swap/).slice(1, 3));
  const approvals = pairs.map(([a, b]) => ({ scheme: "fixture", theme: "dark", check: "relations.ladder-order", pair: [b, a], ...owner }));
  const card = compareSnapshots(base, snapshotOf(s, { approvals }));
  assert.equal(row(card, "relations.ladder-order").candidate, 0);
  assert.ok(!card.failed.includes("relations.ladder-order"));
});

test("approvalFor needs every theme a flag fails in", () => {
  const a = [{ scheme: "s", theme: "dark", check: "relations.state-sign", pair: ["x", "y"], ...owner }];
  assert.ok(approvalFor(a, { scheme: "s", themes: ["dark"], check: "relations.state-sign", tokens: ["y", "x"] }));
  assert.equal(approvalFor(a, { scheme: "s", themes: ["dark", "light"], check: "relations.state-sign", tokens: ["x", "y"] }), null);
  assert.equal(approvalFor(a, { scheme: "s", themes: ["dark"], check: "relations.shared-split", tokens: ["x", "y"] }), null);
});

test("a bad entry stops the run with a message that names it", () => {
  assert.deepEqual(approvalsFrom({ approvals: [] }), []);
  const ok = { scheme: "s", theme: "*", check: "relations.state-sign", pair: ["x", "y"], ...owner };
  assert.deepEqual(approvalsFrom({ approvals: [ok] }), [ok]);
  const bad = (entry, message) => assert.throws(() => approvalsFrom({ approvals: [entry] }), message);
  bad({ ...ok, approved_by: "" }, /approval 1 needs approved_by/);
  bad({ ...ok, theme: undefined }, /approval 1 needs theme/);
  const { check, ...unchecked } = ok;
  bad(unchecked, /names a pair, so it needs the check it approves/);
  bad({ ...ok, check: "" }, /check must name a criterion id/);
  bad({ ...ok, token: "x" }, /exactly one of token or pair/);
  bad({ ...ok, pair: ["x"] }, /pair must be two different token names/);
  bad({ ...ok, mode: "dark" }, /unknown field "mode"/);
});
