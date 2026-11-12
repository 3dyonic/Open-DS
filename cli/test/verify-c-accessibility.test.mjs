// Independent verifier: seeded accessibility defects against the OD-298 gate.
import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { apcaContrast } from "../src/quality/apca.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { editScheme, row, seeded, setToken } from "./verify-c-fixture.mjs";

// Published APCA 0.0.98G-4g reference values (apca-w3 README / test suite, text on background).
const APCA_REFERENCE = [
  ["#888888", "#FFFFFF", 63.056469930209424],
  ["#FFFFFF", "#888888", -68.54146436644962],
  ["#000000", "#AAAAAA", 58.146262578561334],
  ["#AAAAAA", "#000000", -56.24113336839742],
  ["#112233", "#DDEEFF", 91.66830811481631],
  ["#DDEEFF", "#112233", -93.06770049484275],
  ["#000000", "#FFFFFF", 106.04067321268862],
  ["#FFFFFF", "#000000", -107.88473318309848],
];

describe("APCA 0.0.98G-4g matches its published reference values", () => {
  for (const [text, bg, lc] of APCA_REFERENCE) {
    test(`${text} on ${bg} is Lc ${lc.toFixed(3)}`, () => {
      assert.ok(Math.abs(apcaContrast(text, bg) - lc) < 1e-6, `got ${apcaContrast(text, bg)}`);
    });
  }
  test("near-equal colors clamp to Lc 0", () => assert.equal(apcaContrast("#123456", "#654321"), 0));
});

describe("seeded accessibility defects", () => {
  let base;
  before(async () => {
    base = await seeded(() => {});
  });
  const run = async (mutate) => compareSnapshots(base, await seeded(mutate));
  const dd = (fn) => (root) => editScheme(root, "dense-data", fn);

  test("WCAG defect 1: dark muted text on the neutral 100 surface fails", async () => {
    const card = await run(dd((s) => setToken(s, "brands.default.theme.dark.color.text.muted", "{color.neutral.100}")));
    const r = row(card, "accessibility.wcag-failures");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("WCAG defect 2: light primary text set to neutral 300 fails", async () => {
    const card = await run(dd((s) => setToken(s, "brands.default.theme.light.color.text.primary", "{color.neutral.300}")));
    const r = row(card, "accessibility.wcag-failures");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("hit-area defect 1: the compact control drops to 16px", async () => {
    const card = await run(dd((s) => setToken(s, "semantic.size.control.compact", "{size.16}")));
    const r = row(card, "accessibility.hit-area");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("hit-area defect 2: the 24 step shrinks to 1.25rem (20px) under every control that uses it", async () => {
    const card = await run(dd((s) => setToken(s, "primitive.size.24", "1.25rem")));
    const r = row(card, "accessibility.hit-area");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("rem defect 1: a font-size primitive written in px", async () => {
    const card = await run(dd((s) => setToken(s, "primitive.font.size.14", "14px")));
    const r = row(card, "accessibility.text-not-rem");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("rem defect 2: a semantic caption font-size as a px literal", async () => {
    const card = await run(dd((s) => setToken(s, "semantic.type.caption.font-size", "12px")));
    const r = row(card, "accessibility.text-not-rem");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("APCA defect: dark secondary text dimmed to neutral 400 (WCAG >= 4.5, |Lc| ~45) raises the warnings", async () => {
    const card = await run(dd((s) => setToken(s, "brands.default.theme.dark.color.text.secondary", "{color.neutral.400}")));
    const apca = row(card, "accessibility.apca-warnings");
    assert.ok(apca.candidate > apca.base, JSON.stringify(apca));
    // Recorded, not asserted: whether APCA is a hard gate or a warning.
    console.log(`apca-warnings gated=${apca.gated} pass=${apca.pass}; wcag-failures ${row(card, "accessibility.wcag-failures").base}->${row(card, "accessibility.wcag-failures").candidate}`);
  });

  test("clean: darker muted text in light is not flagged", async () => {
    const card = await run(dd((s) => setToken(s, "brands.default.theme.light.color.text.muted", "{color.neutral.700}")));
    for (const id of ["accessibility.wcag-failures", "accessibility.apca-warnings", "accessibility.hit-area", "accessibility.text-not-rem"]) {
      const r = row(card, id);
      assert.ok(r.pass && r.candidate <= r.base, `${id}: ${JSON.stringify(r)}`);
    }
  });
});
