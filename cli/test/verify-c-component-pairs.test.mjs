// Independent verifier: seeded component-pair defects against the OD-298 gate.
import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { componentPairsSheet } from "../src/quality/criteria/component-pairs.mjs";
import { paramsFrom } from "../src/quality/params.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { editScheme, row, seeded, setToken } from "./verify-c-fixture.mjs";

// My own OKLab distance and WCAG ratio, so the flags are checked against an independent formula.
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const rgb = (hex) => [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
function oklab(hex) {
  const [r, g, b] = rgb(hex);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
const dist = (x, y) => Math.hypot(...oklab(x).map((v, i) => v - oklab(y)[i]));
const lum = (hex) => { const [r, g, b] = rgb(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const level = (r) => (r >= 7 ? 3 : r >= 4.5 ? 2 : r >= 3 ? 1 : 0);

describe("seeded component-pair defects", () => {
  let base;
  before(async () => {
    base = await seeded(() => {});
  });
  const dd = (fn) => (root) => editScheme(root, "dense-data", fn);

  test("level-drop defect 1: alert destructive label re-pointed to neutral 300 in the component layer", async () => {
    const cand = await seeded(dd((s) => setToken(s, "component.alert.destructive.label", "{color.neutral.300}")));
    const card = compareSnapshots(base, cand);
    const r = row(card, "component-pairs.level-drops");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
    const p = card.componentPairs.flagged.find((x) => x.fg === "alert-destructive-label" && x.theme === "light");
    assert.ok(p?.levelDrop, "the alert label pair is flagged as a level drop");
    // Independent check of the flagged numbers.
    assert.ok(Math.abs(ratio(p.after.fg, p.after.bg) - p.after.ratio) < 0.01);
    assert.ok(level(ratio(p.after.fg, p.after.bg)) < level(ratio(p.before.fg, p.before.bg)));
  });

  test("level-drop defect 2: dark raised surface lifted to neutral 200 (menus and popovers lose contrast)", async () => {
    const cand = await seeded(dd((s) => setToken(s, "brands.default.theme.dark.color.surface.raised", "{color.neutral.200}")));
    const card = compareSnapshots(base, cand);
    const r = row(card, "component-pairs.level-drops");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
    for (const p of card.componentPairs.flagged.filter((x) => x.levelDrop)) {
      assert.ok(level(ratio(p.after.fg, p.after.bg)) < level(ratio(p.before.fg, p.before.bg)), `false level drop ${p.fg} on ${p.bg}`);
    }
  });

  test("difference-shrink defect 1: light default border moved toward the canvas, shrink follows the parameter", async () => {
    const cand = await seeded(dd((s) => setToken(s, "brands.default.theme.light.color.border.default", "{color.neutral.100}")));
    const loose = compareSnapshots(base, cand, paramsFrom({ componentPairs: { minDifference: 0.001 } }));
    assert.equal(row(loose, "component-pairs.difference-shrunk").candidate, 0, "nothing shrinks below 0.001");
    const borders = loose.componentPairs.flagged.filter((p) => p.role === "border" && p.theme === "light");
    assert.ok(borders.length > 0, "border pairs moved");
    const { before: b, after: a } = borders[0];
    // My own distances, then a threshold between them.
    const db = dist(b.fg, b.bg), da = dist(a.fg, a.bg);
    assert.ok(da < db, `my distances ${db} -> ${da}`);
    const tight = compareSnapshots(base, cand, paramsFrom({ componentPairs: { minDifference: (da + db) / 2 } }));
    const r = row(tight, "component-pairs.difference-shrunk");
    assert.ok(r.candidate > 0 && !r.pass, JSON.stringify(r));
  });

  test("difference-shrink defect 2: alert destructive label to neutral 50 on white (default 0.1)", async () => {
    const cand = await seeded(dd((s) => setToken(s, "component.alert.destructive.label", "{color.neutral.50}")));
    const card = compareSnapshots(base, cand);
    const r = row(card, "component-pairs.difference-shrunk");
    assert.ok(r.candidate > r.base && !r.pass, JSON.stringify(r));
  });

  test("move defect 1: light link text swapped to a same-lightness blue moves above the review tier", async () => {
    const cand = await seeded(dd((s) => setToken(s, "brands.default.theme.light.color.text.link", "{color.blue.light.700}")));
    const card = compareSnapshots(base, cand);
    const moved = card.componentPairs.flagged.filter((p) => p.tier === "approval");
    assert.ok(moved.length > 0, "a move above review is flagged");
    for (const p of moved) assert.ok(Math.max(dist(p.before.fg, p.after.fg), dist(p.before.bg, p.after.bg)) > 0.05, "my distance agrees");
  });

  test("move defect 2: dark focus border pushed to another hue", async () => {
    const cand = await seeded(dd((s) => setToken(s, "brands.default.theme.dark.color.border.focus", "{color.green.dark.600}")));
    const card = compareSnapshots(base, cand);
    const focus = card.componentPairs.flagged.filter((p) => p.theme === "dark" && p.tier === "approval" && /focus/.test(p.fg));
    assert.ok(focus.length > 0, `focus-ring pairs flagged: ${card.componentPairs.flagged.length} total`);
  });

  test("review sheet lists exactly the flagged pairs", async () => {
    const cand = await seeded(dd((s) => setToken(s, "component.alert.destructive.label", "{color.neutral.300}")));
    const card = compareSnapshots(base, cand);
    assert.ok(card.componentPairs.flagged.every((p) => p.flagged));
    const sheet = componentPairsSheet(card.componentPairs.flagged, { base: "b", candidate: "c", compared: card.componentPairs.compared });
    for (const p of card.componentPairs.flagged) assert.ok(sheet.includes(`--${p.fg}`));
    assert.ok(!sheet.includes("--button-label"), "an unchanged pair is not on the sheet");
    const tableRows = sheet.split("\n").filter((l) => l.startsWith("| dense-data"));
    assert.equal(tableRows.length, card.componentPairs.flagged.length);
  });

  test("clean: a one-unit change to a dark neutral flags no pair", async () => {
    const cand = await seeded(dd((s) => setToken(s, "primitive.color.slate.light.900", "#161B24")));
    const card = compareSnapshots(base, cand);
    assert.equal(card.componentPairs.flagged.length, 0, JSON.stringify(card.componentPairs.flagged.slice(0, 2)));
    for (const id of ["component-pairs.level-drops", "component-pairs.difference-shrunk"]) assert.ok(row(card, id).pass);
  });
});
