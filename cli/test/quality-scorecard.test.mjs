// Quality gate, the scorecard and the baseline (OD-298): directions, the comparison, the gate against a
// recorded baseline and the Markdown people read.
import { test } from "node:test";
import assert from "node:assert/strict";
import { baselineOf, compareSnapshots, gateAgainstBaseline, measureAll, passes, scorecardMarkdown } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf } from "./quality-fixture.mjs";

test("a direction passes when the value holds or moves the right way; report and missing always pass", () => {
  assert.equal(passes("down", 3, 3), true);
  assert.equal(passes("down", 3, 2), true);
  assert.equal(passes("down", 3, 4), false);
  assert.equal(passes("up", 0.5, 0.6), true);
  assert.equal(passes("up", 0.5, 0.4), false);
  assert.equal(passes("report", 1, 100), true);
  assert.equal(passes("down", null, 4), true);
  assert.equal(passes("down", 4, null), true);
});

test("a snapshot against itself passes with every delta 0, and every criterion has the required shape", () => {
  const snap = snapshotOf(fixtureScheme());
  const card = compareSnapshots(snap, snap);
  assert.equal(card.pass, true);
  assert.deepEqual(card.failed, []);
  for (const r of card.criteria) {
    for (const k of ["id", "base", "candidate", "delta", "direction", "pass", "details"]) assert.ok(k in r, `${r.id} has ${k}`);
    if (r.base !== null) assert.equal(r.delta, 0, r.id);
  }
  // 12 families, each with at least one criterion
  assert.deepEqual(
    [...new Set(card.criteria.map((r) => r.family))],
    ["traceability", "derived", "invariants", "blast-radius", "accessibility", "motion", "repetition", "size", "relations", "curves", "shift", "component-pairs"],
  );
});

test("the gate fails a worse number against the baseline and lists a better one", () => {
  const clean = snapshotOf(fixtureScheme());
  const baseline = baselineOf(clean);
  assert.equal(baseline.criteria["invariants.failures"].value, 0);
  assert.equal(baseline.criteria["derived.share"].direction, "up");
  assert.deepEqual(gateAgainstBaseline(clean, baseline), { ok: true, worse: [], better: [], missing: [] });

  const broken = fixtureScheme();
  broken.tokens.semantic["component-spacing-map"].x2.$value = "{space.12}";
  const r = gateAgainstBaseline(snapshotOf(broken), baseline);
  assert.equal(r.ok, false);
  assert.deepEqual(r.worse, ["invariants.failures: 0 → 1", "invariants.spacing-map: 0 → 1"]);

  const before = baselineOf(snapshotOf(broken));
  const fixed = gateAgainstBaseline(clean, before);
  assert.equal(fixed.ok, true);
  assert.deepEqual(fixed.better, ["invariants.failures: 1 → 0", "invariants.spacing-map: 1 → 0"]);
});

test("a measure missing from the baseline is listed, not failed", () => {
  const clean = snapshotOf(fixtureScheme());
  const baseline = baselineOf(clean);
  delete baseline.criteria["size.unused-semantics"];
  const r = gateAgainstBaseline(clean, baseline);
  assert.equal(r.ok, true);
  assert.deepEqual(r.missing, ["size.unused-semantics"]);
});

test("the Markdown says the verdict, shows each criterion and each relation per scheme", () => {
  const broken = fixtureScheme();
  broken.tokens.semantic["border-width"].focus.$value = "{border-width.3}";
  const md = scorecardMarkdown(compareSnapshots(snapshotOf(fixtureScheme()), snapshotOf(broken)));
  assert.match(md, /\*\*Fail\.\*\* 2 gated criteria moved the wrong way: invariants\.failures, invariants\.focus-ring\./);
  assert.match(md, /\| `invariants\.focus-ring` \| 0 \| 1 \| \+1 \| ↓ lower is better \| \*\*fail\*\* \|/);
  assert.match(md, /\| fixture \| `focus-ring` \| minimum \| pass \| fail \(1 of 1\) \|/);
  assert.equal(measureAll(snapshotOf(fixtureScheme())).length, 37);
});
