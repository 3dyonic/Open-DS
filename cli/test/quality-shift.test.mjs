// Quality gate, shift per token (OD-298): how far each color moved, by tier, with the role limits, the
// hue limit and exact brand key colors.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fromLch, lch } from "../src/ramps.mjs";
import { colorMoves, relative, tierOf, tiersFor } from "../src/quality/criteria/shift.mjs";
import { DEFAULT_PARAMS, paramsFrom } from "../src/quality/params.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

const P = DEFAULT_PARAMS;
const light = (s) => s.tokens.brands.default.theme.light.color;
// A new gray step and the light primary text pointed at it.
const textTo = (s, hex) => {
  s.tokens.primitive.color.gray.light["850"] = { $type: "color", $value: hex };
  light(s).text.primary.$value = "{color.gray.light.850}";
};
const base = () => snapshotOf(fixtureScheme());

test("tiers: under 0.02 passes, to 0.05 needs a reason, above needs approval; surfaces are tighter", () => {
  assert.deepEqual(tiersFor("color.text.primary", P.shift), { role: "default", pass: 0.02, review: 0.05 });
  assert.deepEqual(tiersFor("color.surface.sunken", P.shift), { role: "surface", pass: 0.01, review: 0.02 });
  assert.equal(tierOf(0, tiersFor("color.text.primary", P.shift)), "none");
  assert.equal(tierOf(0.019, tiersFor("color.text.primary", P.shift)), "pass");
  assert.equal(tierOf(0.03, tiersFor("color.text.primary", P.shift)), "review");
  assert.equal(tierOf(0.03, tiersFor("color.surface.raised", P.shift)), "approval");
});

test("a review-tier move with no new reason fails; a new reason clears it", () => {
  const s = fixtureScheme();
  textTo(s, "#1E242E");
  const r = relative(base(), snapshotOf(s), P);
  assert.equal(valueOf(r, "shift.review-unreasoned"), 1);
  assert.deepEqual(r.find((m) => m.id === "shift.review-unreasoned").details, ["fixture/light color.text.primary: #161B23 → #1E242E, ΔE 0.038 (review)"]);
  assert.ok(compareSnapshots(base(), snapshotOf(s)).failed.includes("shift.review-unreasoned"));
  light(s).text.primary.$extensions["open-ds"].why = "gray.850: primary text, a touch softer for long reading.";
  assert.equal(valueOf(relative(base(), snapshotOf(s), P), "shift.review-unreasoned"), 0);
});

test("a surface moving 0.022 is over the surface limit and needs approval; an approval clears it", () => {
  const s = fixtureScheme();
  light(s).surface.sunken.$value = "{color.gray.light.50}";
  const moves = colorMoves(base(), snapshotOf(s), P);
  assert.deepEqual(moves.map((m) => [m.token, m.tier, m.role]), [["color.surface.sunken", "approval", "surface"]]);
  assert.equal(valueOf(relative(base(), snapshotOf(s), P), "shift.approval-unapproved"), 1);
  // The approval names the value it approves: it clears that move, and no other.
  const to = moves[0].to.toLowerCase();
  const approvals = [{ scheme: "fixture", token: "color.surface.sunken", theme: "light", to, why: "Wells lighter on purpose.", approved_by: "owner" }];
  assert.equal(valueOf(relative(base(), snapshotOf(s, { approvals }), P), "shift.approval-unapproved"), 0);
  const stale = [{ ...approvals[0], to: "#000000" }];
  assert.equal(valueOf(relative(base(), snapshotOf(s, { approvals: stale }), P), "shift.approval-unapproved"), 1);
  // the same move under default limits is only a review
  const loose = paramsFrom({ shift: { roles: [] } });
  assert.equal(valueOf(relative(base(), snapshotOf(s), loose), "shift.approval-unapproved"), 0);
});

test("a chromatic token whose hue turns 8° fails the hue limit, 3° does not", () => {
  const turned = (deg) => {
    const s = fixtureScheme();
    const [L, C, H] = lch("#4B3FD9");
    s.tokens.primitive.color.violet.light["600"].$value = fromLch(L, C, (H + deg) % 360);
    return snapshotOf(s);
  };
  const r8 = relative(base(), turned(8), P);
  assert.equal(valueOf(r8, "shift.hue"), 1);
  assert.match(r8.find((m) => m.id === "shift.hue").details[0], /color\.action\.primary: #4B3FD9 → #5D37D5, ΔE 0\.031 \(review\), hue turned 8\.0°/);
  assert.equal(valueOf(relative(base(), turned(3), P), "shift.hue"), 0);
});

test("a brand key color is exact: a token on the key step that moves fails, unless an adjustment is recorded", () => {
  const s = fixtureScheme();
  light(s).action.primary["@"].$value = "{color.violet.light.500}";
  const r = relative(base(), snapshotOf(s), P);
  assert.equal(valueOf(r, "shift.key-colors"), 1);
  assert.equal(valueOf(r, "shift.approval-unapproved"), 1);
  s.tokens.primitive.color.violet.$extensions["open-ds"].light.adjust = { 500: { L: 0.01 } };
  assert.equal(valueOf(relative(base(), snapshotOf(s), P), "shift.key-colors"), 0);
});

test("a recorded key color that changes with no adjustment fails once", () => {
  const s = fixtureScheme();
  s.tokens.primitive.color.violet.$extensions["open-ds"].light.key = "#5040E0";
  const r = relative(base(), snapshotOf(s), P);
  assert.equal(valueOf(r, "shift.key-colors"), 1);
  assert.deepEqual(r.find((m) => m.id === "shift.key-colors").details, ["fixture: the violet light key #4B3FD9 → #5040E0"]);
});

test("every move is listed by tier", () => {
  const s = fixtureScheme();
  textTo(s, "#1E242E");
  light(s).surface.sunken.$value = "{color.gray.light.50}";
  const details = relative(base(), snapshotOf(s), P).find((m) => m.id === "shift.moves").details;
  assert.deepEqual(details, [
    "approval: 1",
    "  fixture/light color.surface.sunken: #EEF1F5 → #F7F8FA, ΔE 0.022 (approval, surface limits)",
    "review: 1",
    "  fixture/light color.text.primary: #161B23 → #1E242E, ΔE 0.038 (review)",
    "pass: 0",
  ]);
});
