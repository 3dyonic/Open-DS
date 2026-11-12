// Quality gate, accessibility (OD-298): WCAG pairs, APCA Lc warnings, hit areas and text in rem.
import { test } from "node:test";
import assert from "node:assert/strict";
import { apcaContrast, apcaFloor } from "../src/quality/apca.mjs";
import { measure, measuredPairs } from "../src/quality/criteria/accessibility.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

test("APCA 0.0.98G-4g gives the published reference values", () => {
  const lc = (t, b) => Math.round(apcaContrast(t, b) * 1000) / 1000;
  assert.equal(lc("#888888", "#FFFFFF"), 63.056);
  assert.equal(lc("#FFFFFF", "#888888"), -68.541);
  assert.equal(lc("#000000", "#FFFFFF"), 106.041);
  assert.equal(lc("#FFFFFF", "#000000"), -107.885);
  assert.equal(lc("#000000", "#AAAAAA"), 58.146);
  assert.equal(lc("#AAAAAA", "#000000"), -56.241);
  assert.equal(apcaContrast("#777777", "#777777"), 0);
  assert.deepEqual([7, 4.5, 3, 1.5].map(apcaFloor), [75, 60, 45, 30]);
});

test("the clean fixture: 4 pairs, all above WCAG 4.5:1 and APCA Lc 60", () => {
  const snap = snapshotOf(fixtureScheme());
  assert.equal(measuredPairs(snap.schemes.fixture).length, 4);
  const m = measure(snap);
  assert.equal(valueOf(m, "accessibility.wcag-failures"), 0);
  assert.equal(valueOf(m, "accessibility.apca-warnings"), 0);
  assert.equal(valueOf(m, "accessibility.hit-area"), 0);
  assert.equal(valueOf(m, "accessibility.text-not-rem"), 0);
});

test("a contrast failure: dark text too dim fails both its pairs in WCAG and APCA", () => {
  const s = fixtureScheme();
  s.tokens.brands.default.theme.dark.color.text.primary.$value = "{color.gray.dark.300}";
  const cand = snapshotOf(s);
  const m = measure(cand);
  assert.equal(valueOf(m, "accessibility.wcag-failures"), 2);
  assert.equal(valueOf(m, "accessibility.apca-warnings"), 2);
  assert.deepEqual(m.find((x) => x.id === "accessibility.wcag-failures").details, [
    "4 pairs measured",
    "fixture/dark: color.text.primary on color.surface.default 1.66:1, needs 4.5:1",
    "fixture/dark: color.text.primary on color.surface.sunken 1.84:1, needs 4.5:1",
  ]);
  const card = compareSnapshots(snapshotOf(fixtureScheme()), cand);
  assert.ok(card.failed.includes("accessibility.wcag-failures"));
  // APCA warns and never gates (the owner's decision): the rise is shown, the gate does not fail on it
  const apca = card.criteria.find((r) => r.id === "accessibility.apca-warnings");
  assert.deepEqual([apca.base, apca.candidate, apca.gated], [0, 2, false]);
  assert.ok(!card.failed.includes("accessibility.apca-warnings"));
});

test("a control under 24px and a text size in px are counted", () => {
  const s = fixtureScheme();
  s.tokens.semantic.size.control.compact.$value = "{size.16}";
  s.tokens.primitive.font.size["15"] = { $type: "dimension", $value: "15px" };
  s.tokens.semantic.type.body["font-size"].$value = "{font.size.15}";
  const m = measure(snapshotOf(s));
  assert.equal(valueOf(m, "accessibility.hit-area"), 1);
  assert.equal(valueOf(m, "accessibility.text-not-rem"), 1);
  assert.deepEqual(m.find((x) => x.id === "accessibility.text-not-rem").details, ['fixture: type.body.font-size = "15px"']);
});
