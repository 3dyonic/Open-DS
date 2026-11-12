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
    ["traceability", "derived", "invariants", "generation", "blast-radius", "accessibility", "motion", "repetition", "size", "relations", "curves", "shift", "component-pairs"],
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
  assert.equal(measureAll(snapshotOf(fixtureScheme())).length, 41);
});

// Two schemes in one snapshot: the fixture, and a copy named "other", each with its own scheme file.
const twoSchemes = (fixture, other) => {
  const a = snapshotOf(fixture);
  const b = snapshotOf(other);
  return { ...a, schemes: { fixture: a.schemes.fixture, other: { ...b.schemes.fixture, id: "other" } } };
};
const focusBroken = () => {
  const s = fixtureScheme();
  s.tokens.semantic["border-width"].focus.$value = "{border-width.3}";
  return s;
};

test("a count is gated per scheme: a new breach in one scheme fails though a fix in another keeps the total", () => {
  const base = twoSchemes(fixtureScheme(), focusBroken());
  const cand = twoSchemes(focusBroken(), fixtureScheme());
  const card = compareSnapshots(base, cand);
  const r = card.criteria.find((x) => x.id === "invariants.focus-ring");
  assert.deepEqual([r.base, r.candidate, r.pass], [1, 1, false]);
  assert.deepEqual(r.regressions, [{ part: "fixture", base: 0, candidate: 1 }]);
  assert.ok(card.failed.includes("invariants.focus-ring"));
  assert.match(scorecardMarkdown(card), /\| `invariants\.focus-ring` \| 1 \| 1 \| 0 \| ↓ lower is better \| \*\*fail\*\* in a part \|/);
  assert.match(scorecardMarkdown(card), /Worse in: fixture 0 → 1\./);
  // the baseline keeps the parts, so the harness gate catches it too
  const gate = gateAgainstBaseline(cand, baselineOf(base));
  assert.equal(gate.ok, false);
  assert.ok(gate.worse.includes("invariants.focus-ring in fixture 0 → 1"), gate.worse.join("; "));
  // a baseline with no parts recorded gates the totals only
  const old = baselineOf(base);
  for (const c of Object.values(old.criteria)) delete c.parts;
  assert.deepEqual(gateAgainstBaseline(cand, old).worse, []);
});

test("a count is gated per scheme and theme where the mode applies", () => {
  const base = fixtureScheme();
  base.tokens.brands.default.theme.light.color.text.primary.$value = "{color.gray.light.300}";
  const cand = fixtureScheme();
  cand.tokens.brands.default.theme.dark.color.text.primary.$value = "{color.gray.dark.300}";
  const card = compareSnapshots(snapshotOf(base), snapshotOf(cand));
  const r = card.criteria.find((x) => x.id === "accessibility.wcag-failures");
  assert.deepEqual([r.base, r.candidate], [2, 2]);
  assert.deepEqual(r.regressions, [{ part: "fixture/dark", base: 0, candidate: 2 }]);
  assert.ok(card.failed.includes("accessibility.wcag-failures"));
});

test("the Markdown states what is shown and not gated: APCA, the contrast grades and the floating surface", () => {
  const md = scorecardMarkdown(compareSnapshots(snapshotOf(fixtureScheme()), snapshotOf(fixtureScheme())));
  assert.match(md, /## Notes/);
  assert.match(md, /- `accessibility\.apca-warnings`: APCA Lc is a warning only, by the owner's decision: shown, never gated\./);
  assert.match(md, /- `curves\.grades`: Contrast grades are reported, not gated \(gradesGated: false\), by the owner's decision\. They gate once OD-299 lands\./);
  assert.match(md, /- `invariants\.floating-not-defined`: Floating not defined in fixture: no color\.surface\.floating/);
  assert.match(md, /\| `accessibility\.apca-warnings` \| 0 \| 0 \| 0 \| ↓ lower is better, not gated \| — \|/);
});

test("the Markdown shows 10 detail lines and a count of the rest; scorecard.json keeps every one", () => {
  const s = fixtureScheme();
  const ext = (node, why) => (node.$extensions = { "open-ds": { why, because: ["people.q1"] } });
  const words = ["amber", "birch", "cedar", "delta", "ember", "fjord", "grove", "heron", "inlet", "juniper", "kestrel", "lagoon"];
  const tokens = ["space.gap.tight", "size.control.default", "size.control.compact", "radius.control", "border-width.default", "border-width.focus", "component-spacing-map.x1", "component-spacing-map.x2", "component-spacing-map.x3", "type.body.font-size", "motion.duration.feedback", "motion.duration.panels"];
  // each of 12 sentences twice: on its token, and on the next token
  const at = (path) => path.split(".").reduce((n, k) => n[k], s.tokens.semantic);
  tokens.forEach((t, i) => ext(at(t), `The ${words[i]} rule keeps this value steady. The ${words[(i + 11) % 12]} rule keeps this value steady.`));
  const card = compareSnapshots(snapshotOf(fixtureScheme()), snapshotOf(s));
  const r = card.criteria.find((x) => x.id === "repetition.repeated-sentences");
  assert.equal(r.details.length, 12);
  const md = scorecardMarkdown(card);
  const section = md.slice(md.indexOf("### `repetition.repeated-sentences`"));
  assert.equal((section.slice(0, section.indexOf("### ", 4)).match(/^- fixture: ×2 /gm) ?? []).length, 10);
  assert.match(section, /- … 2 more in scorecard\.json/);
});
