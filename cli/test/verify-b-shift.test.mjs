// verify-b: seeded defects for criterion 3, the shift tiers (OD-298).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sandbox, drop, snap, withEdits, compare, row, failing, set, get, prim, themeToken, setTheme, dist, lch, hexOfLch, grayAt } from "./verify-b-helpers.mjs";

const IDS = ["dense-data"];
let root, base, L, D;
before(async () => {
  root = sandbox();
  base = await snap(root, IDS);
  L = base.schemes["dense-data"].values.light;
  D = base.schemes["dense-data"].values.dark;
});
after(() => drop(root));

const val = (s, path, v) => set(s, [...path, "$value"], v);
const dd = (fn) => (s, r) => fn(s["dense-data"], r);
const run = async (mutate) => compare(base, await withEdits(root, IDS, mutate));
const show = (card, ids) => JSON.stringify(ids.map((id) => { const r = row(card, id); return [id, r.base, r.candidate, r.details?.slice(0, 6)]; }));
const flagged = (card, id) => { const r = row(card, id); return !r.pass && r.candidate > r.base && !card.pass; };
const why = (s, mode, token, text) => {
  const node = get(s, themeToken(mode, token));
  const t = node["@"] ?? node;
  t.$extensions ??= {};
  t.$extensions["open-ds"] ??= {};
  t.$extensions["open-ds"].why = text;
};
function approve(root, entries) {
  const file = join(root, "harness", "quality-approvals.json");
  const doc = JSON.parse(readFileSync(file, "utf8"));
  doc.approvals.push(...entries.map((e) => ({ scheme: "dense-data", theme: "light", why: "Owner approved for verify-b.", approved_by: "owner", ...e })));
  writeFileSync(file, JSON.stringify(doc, null, 2));
}
const rotate = (hex, deg) => { const c = lch(hex); return hexOfLch({ ...c, H: c.H + deg }); };

// Review tier: 0.02 to 0.05 needs a reason
const MUTED = "#4A5463";
test("S1 a 0.033 move with no new reason is caught (review tier)", async () => {
  const d = dist(MUTED, L["color.text.muted"]);
  assert.ok(d > 0.02 && d < 0.05, `d=${d}`);
  const card = await run(dd((s) => val(s, prim("color.slate.light.600"), MUTED)));
  assert.ok(flagged(card, "shift.review-unreasoned"), show(card, ["shift.review-unreasoned"]));
});
test("S1-clean the same 0.033 move with a new reason on each token passes", async () => {
  const card = await run(dd((s) => {
    val(s, prim("color.slate.light.600"), MUTED);
    why(s, "light", "color.text.muted", "Muted text moved darker to keep 7:1 on sunken table rows.");
    why(s, "light", "color.neutral.600", "neutral.600 follows the darker slate.light.600 step.");
  }));
  assert.deepEqual(failing(card), [], show(card, failing(card)));
});

// Approval tier: over 0.05 needs approval
const WARN = "#A06A23"; // same hue, lightness +0.07
test("S2 a move over 0.05 with no approval is caught", async () => {
  const d = dist(WARN, L["color.status.warning"]);
  assert.ok(d > 0.05, `d=${d}`);
  const card = await run(dd((s) => { for (const t of ["color.status.warning", "color.category.4"]) setTheme(s, "light", t, WARN); }));
  assert.ok(flagged(card, "shift.approval-unapproved"), show(card, ["shift.approval-unapproved"]));
});
test("S2-clean the same move with owner approvals passes the shift tiers", async () => {
  const card = await run(dd((s, r) => {
    for (const t of ["color.status.warning", "color.category.4"]) setTheme(s, "light", t, WARN);
    approve(r, [{ token: "color.status.warning" }, { token: "color.category.4" }]);
  }));
  const shiftFails = failing(card).filter((id) => id.startsWith("shift."));
  assert.deepEqual(shiftFails, [], show(card, shiftFails));
});
test("S3 an approval for a different theme does not cover the move", async () => {
  const card = await run(dd((s, r) => {
    for (const t of ["color.status.warning", "color.category.4"]) setTheme(s, "light", t, WARN);
    approve(r, [{ token: "color.status.warning", theme: "dark" }, { token: "color.category.4", theme: "dark" }]);
  }));
  assert.ok(flagged(card, "shift.approval-unapproved"), show(card, ["shift.approval-unapproved"]));
});

// Surfaces have the tightest limit
test("S4 white surfaces moved 0.015 (under the general 0.02, over the surface 0.01) are caught, only on surfaces", async () => {
  const g = grayAt("#FFFFFF", 0.015, true);
  const d = dist(g, "#FFFFFF");
  assert.ok(d > 0.01 && d < 0.02, `${g} d=${d}`);
  const card = await run(dd((s) => val(s, prim("color.slate.light.0"), g)));
  assert.ok(flagged(card, "shift.review-unreasoned"), show(card, ["shift.review-unreasoned"]));
  const listed = row(card, "shift.review-unreasoned").details.join("\n");
  assert.match(listed, /color\.surface\.default/);
  assert.doesNotMatch(listed, /color\.text\.inverse|color\.neutral\.0\b/, "non-surface tokens at 0.015 should pass");
});
test("S5 dark sunken surfaces moved 0.03 (surface approval tier) are caught as needing approval", async () => {
  const g = "#2F3642";
  const d = dist(g, D["color.surface.sunken"]);
  assert.ok(d > 0.02 && d < 0.05, `d=${d}`);
  const card = await run(dd((s) => val(s, prim("color.slate.dark.100"), g)));
  assert.ok(flagged(card, "shift.approval-unapproved"), show(card, ["shift.approval-unapproved"]));
  assert.match(row(card, "shift.approval-unapproved").details.join("\n"), /color\.surface\.sunken/);
});

// Brand key colors stay exact
test("S6 violet light key nudged by one unit (with its 600 step) is caught", async () => {
  const card = await run(dd((s) => {
    set(s, ["tokens", "primitive", "color", "violet", "$extensions", "open-ds", "light", "key"], "#4C3FD9");
    val(s, prim("color.violet.light.600"), "#4C3FD9");
  }));
  assert.ok(flagged(card, "shift.key-colors"), show(card, ["shift.key-colors"]));
});
test("S7 green dark key changed in the record only is caught", async () => {
  const card = await run(dd((s) => set(s, ["tokens", "primitive", "color", "green", "$extensions", "open-ds", "dark", "key"], "#5DC283")));
  assert.ok(flagged(card, "shift.key-colors"), show(card, ["shift.key-colors"]));
});

// Hue on chromatic tokens
test("S8 warning hue turned 8 degrees (distance under 0.02) is caught", async () => {
  const hex = rotate(L["color.status.warning"], 8);
  const d = dist(hex, L["color.status.warning"]);
  assert.ok(d < 0.02, `${hex} d=${d}`);
  const card = await run(dd((s) => { for (const t of ["color.status.warning", "color.category.4"]) setTheme(s, "light", t, hex); }));
  assert.ok(flagged(card, "shift.hue"), `${hex} ` + show(card, ["shift.hue"]));
  assert.ok(row(card, "shift.review-unreasoned").pass);
});
test("S9 dark info hue turned 9 degrees (distance under 0.02) is caught", async () => {
  const hex = rotate(D["color.status.info"], -9);
  const d = dist(hex, D["color.status.info"]);
  assert.ok(d < 0.02, `${hex} d=${d}`);
  const card = await run(dd((s) => { for (const t of ["color.status.info", "color.category.2"]) setTheme(s, "dark", t, hex); }));
  assert.ok(flagged(card, "shift.hue"), `${hex} ` + show(card, ["shift.hue"]));
});

// Clean changes
test("S-clean a 2 degree hue turn and a 0.01 move on a chromatic token pass", async () => {
  const hex = rotate(L["color.status.warning"], 2);
  assert.ok(dist(hex, L["color.status.warning"]) < 0.01);
  const card = await run(dd((s) => { for (const t of ["color.status.warning", "color.category.4"]) setTheme(s, "light", t, hex); }));
  // A raw hex in place of a reference is a derived-share regression by design; only shift and relations must stay quiet.
  const fails = failing(card).filter((id) => /^(shift|relations)\./.test(id));
  assert.deepEqual(fails, [], show(card, fails));
});
test("S-clean a 30 degree hue turn on a near-neutral (chroma < 0.05) under 0.02 passes", async () => {
  const hex = rotate(L["color.neutral.500"], 30);
  const d = dist(hex, L["color.neutral.500"]);
  assert.ok(d < 0.02 && lch(L["color.neutral.500"]).C < 0.05, `${hex} d=${d}`);
  const cand = await withEdits(root, IDS, dd((s) => val(s, prim("color.slate.light.500"), hex)));
  assert.equal(cand.schemes["dense-data"].values.light["color.neutral.500"], hex);
  const card = compare(base, cand);
  assert.deepEqual(failing(card), [], show(card, failing(card)));
});
