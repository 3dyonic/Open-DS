// Quality gate, traceability (OD-298): traced share, untraced values and weak reasons, on a made-up
// scheme with one seeded defect at a time.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure } from "../src/quality/criteria/traceability.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

test("the clean fixture traces all 20 values and has no weak reason", () => {
  const m = measure(snapshotOf(fixtureScheme()));
  assert.equal(valueOf(m, "traceability.traced-share"), 1);
  assert.equal(valueOf(m, "traceability.untraced"), 0);
  assert.equal(valueOf(m, "traceability.weak"), 0);
  for (const kind of ["own", "exact-rule", "borrowed", "linked", "none"]) assert.equal(valueOf(m, `traceability.weak.${kind}`), 0);
});

test("a weak reason (under 6 words) counts once, under its kind", () => {
  const s = fixtureScheme();
  s.tokens.semantic.radius.surface.$extensions["open-ds"].why = "Surface corner.";
  const m = measure(snapshotOf(s));
  assert.equal(valueOf(m, "traceability.weak"), 1);
  assert.equal(valueOf(m, "traceability.weak.own"), 1);
  assert.deepEqual(m.find((x) => x.id === "traceability.weak").details, ["fixture: radius.surface, the reason is under 6 words"]);
});

test("a value with no reason and no answer is untraced, and the scorecard fails it", () => {
  const s = fixtureScheme();
  delete s.tokens.semantic.type.body["font-size"].$extensions;
  const base = snapshotOf(fixtureScheme());
  const cand = snapshotOf(s);
  const m = measure(cand);
  assert.equal(valueOf(m, "traceability.untraced"), 1);
  assert.equal(valueOf(m, "traceability.traced-share"), 0.95);
  assert.equal(valueOf(m, "traceability.weak.none"), 1);
  const card = compareSnapshots(base, cand);
  assert.equal(card.pass, false);
  for (const id of ["traceability.traced-share", "traceability.untraced", "traceability.weak", "traceability.weak.none"]) assert.ok(card.failed.includes(id), id);
});
