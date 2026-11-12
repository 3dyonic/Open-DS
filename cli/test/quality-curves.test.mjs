// Quality gate, curve checks (OD-298): the lightness gap between neighbouring steps, and the contrast
// grades of steps 400, 500 and 700 apart (reported until OD-299).
import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeMisses, measure, tightSteps } from "../src/quality/criteria/curves.mjs";
import { DEFAULT_PARAMS, paramsFrom } from "../src/quality/params.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

const P = DEFAULT_PARAMS;

test("the clean fixture: 3 gray steps under the 0.03 gap, and 2 violet grade misses, reported", () => {
  const snap = snapshotOf(fixtureScheme());
  const m = measure(snap, P);
  assert.equal(valueOf(m, "curves.min-gap"), 3);
  assert.deepEqual(
    tightSteps(snap, 0.03).map((t) => `${t.hue}.${t.mode} ${t.from}→${t.to}`),
    ["gray.light 0→50", "gray.light 50→100", "gray.dark 0→50"],
  );
  assert.equal(valueOf(m, "curves.grades"), 2);
  assert.equal(m.find((x) => x.id === "curves.grades").direction, "report");
  assert.deepEqual(m.find((x) => x.id === "curves.grades").details, [
    "fixture: violet.dark 400 and 900 are 4.11:1, need 4.5:1",
    "fixture: violet.dark 500 and 900 are 2.76:1, need 3:1",
  ]);
});

test("a step that copies its neighbour closes the gap and fails the scorecard", () => {
  const s = fixtureScheme();
  const row = s.tokens.primitive.color.violet.light;
  row["300"].$value = row["200"].$value;
  const snap = snapshotOf(s);
  assert.equal(valueOf(measure(snap, P), "curves.min-gap"), 4);
  assert.ok(tightSteps(snap, 0.03).some((t) => t.hue === "violet" && t.from === "200" && t.to === "300" && t.gap === 0));
  assert.ok(compareSnapshots(snapshotOf(fixtureScheme()), snap).failed.includes("curves.min-gap"));
  assert.equal(valueOf(measure(snap, paramsFrom({ curves: { minGap: 0.001 } })), "curves.min-gap"), 1);
});

test("the grades follow the distance between steps, and gate once switched on", () => {
  const s = fixtureScheme();
  s.tokens.primitive.color.violet.light["900"].$value = "#5F60E9";
  const snap = snapshotOf(s);
  const misses = gradeMisses(snap, P.curves.grades).filter((g) => g.hue === "violet" && g.mode === "light");
  assert.deepEqual(misses.map((g) => `${g.from}-${g.to} ${g.need}`), ["50-900 7", "100-900 7", "200-900 7", "300-900 4.5", "400-900 4.5", "500-900 3"]);
  const gated = paramsFrom({ curves: { gradesGated: true } });
  assert.equal(measure(snap, gated).find((x) => x.id === "curves.grades").direction, "down");
  assert.ok(compareSnapshots(snapshotOf(fixtureScheme()), snap, gated).failed.includes("curves.grades"));
  assert.ok(!compareSnapshots(snapshotOf(fixtureScheme()), snap).failed.includes("curves.grades"));
});
