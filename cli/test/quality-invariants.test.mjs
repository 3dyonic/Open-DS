// Quality gate, invariants (OD-298): the relations the data records (spacing map, generated color
// scales) and the owner's minimum relations, each seeded broken once.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure as accessibility } from "../src/quality/criteria/accessibility.mjs";
import { measure } from "../src/quality/criteria/invariants.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

const relation = (snap, id) => snap.schemes.fixture.relations.find((r) => r.id === id);

test("the clean fixture keeps every relation", () => {
  const snap = snapshotOf(fixtureScheme());
  const m = measure(snap);
  assert.equal(valueOf(m, "invariants.failures"), 0);
  assert.deepEqual(
    snap.schemes.fixture.relations.map((r) => [r.id, r.status, r.checks.length]),
    [
      ["spacing-map", "pass", 3],
      ["color-scale", "pass", 22],
      ["focus-ring", "pass", 1],
      ["compact-step", "pass", 1],
      ["nested-radius", "pass", 1],
      ["dark-ladder", "pass", 2],
      ["duration-caps", "pass", 2],
      ["hit-area", "pass", 2],
    ],
  );
  assert.deepEqual(relation(snap, "dark-ladder").notPresent, ["color.surface.floating"]);
});

test("a broken spacing formula fails the spacing map once", () => {
  const s = fixtureScheme();
  s.tokens.semantic["component-spacing-map"].x2.$value = "{space.12}";
  const snap = snapshotOf(s);
  const m = measure(snap);
  assert.equal(valueOf(m, "invariants.spacing-map"), 1);
  assert.equal(valueOf(m, "invariants.failures"), 1);
  assert.deepEqual(relation(snap, "spacing-map").checks.filter((c) => !c.pass).map((c) => c.says), [
    "component-spacing-map.x2 is 12px; 2 × 4px × rhythm 1 gives 8px",
  ]);
  assert.ok(compareSnapshots(snapshotOf(fixtureScheme()), snap).failed.includes("invariants.spacing-map"));
});

test("a hand-edited step of a generated scale fails the color scale", () => {
  const s = fixtureScheme();
  s.tokens.primitive.color.violet.light["400"].$value = "#123456";
  assert.equal(valueOf(measure(snapshotOf(s)), "invariants.color-scale"), 1);
});

test("each minimum relation fails when its value breaks it", () => {
  const cases = [
    ["invariants.focus-ring", (s) => (s.tokens.semantic["border-width"].focus.$value = "{border-width.3}")],
    ["invariants.compact-step", (s) => (s.tokens.semantic.size.control.compact.$value = "{size.16}")],
    ["invariants.nested-radius", (s) => (s.tokens.semantic.radius.option.$value = "{radius.2}")],
    ["invariants.dark-ladder", (s) => (s.tokens.brands.default.theme.dark.color.surface.raised.$value = "{color.gray.dark.50}")],
  ];
  for (const [id, seed] of cases) {
    const s = fixtureScheme();
    seed(s);
    const m = measure(snapshotOf(s));
    assert.equal(valueOf(m, id), 1, id);
    assert.equal(valueOf(m, "invariants.failures"), 1, id);
  }
});

test("a relation a scheme does not have is not present, never failed", () => {
  const s = fixtureScheme();
  delete s.tokens.semantic["border-width"].focus;
  const snap = snapshotOf(s);
  assert.equal(relation(snap, "focus-ring").status, "not present");
  assert.equal(valueOf(measure(snap), "invariants.focus-ring"), null);
  const row = compareSnapshots(snapshotOf(fixtureScheme()), snap).criteria.find((r) => r.id === "invariants.focus-ring");
  assert.equal(row.pass, true);
  assert.equal(row.candidate, null);
});

test("a touch-first scheme needs a 44px default control", () => {
  const s = fixtureScheme();
  s.answers.find((a) => a.question === "accessibility.values").option = "touch";
  const snap = snapshotOf(s);
  assert.equal(valueOf(accessibility(snap), "accessibility.hit-area"), 1);
  assert.deepEqual(relation(snap, "hit-area").checks.filter((c) => !c.pass).map((c) => c.says), [
    "size.control.default is 32px; the floor is 44px (touch-first)",
  ]);
});
