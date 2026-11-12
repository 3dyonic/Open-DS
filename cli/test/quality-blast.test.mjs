// Quality gate, blast radius (OD-298): change one answer or one anchor, load the scheme again, and
// compare what moved with what the trace and the relations say depends on it.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure } from "../src/quality/criteria/blast-radius.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { px } from "../src/quality/values.mjs";
import { fixtureScheme, snapshotOf, valueOf, violet } from "./quality-fixture.mjs";

const DERIVE = { "open-ds": { derive: "size.control.default" } };

// A loader that generates values from what a person decided, as a generating loader does: the motion
// durations from the motion answer, the spacing map from the base step, the violet scale from its keys,
// and a token marked "derive" one step below (compact) or equal to (row) the default control height.
function generate(stored) {
  const s = structuredClone(stored);
  const sem = s.tokens.semantic;
  const fast = s.answers.find((a) => a.question === "motion.values").option === "fast";
  sem.motion.duration.feedback.$value = fast ? "{duration.fast}" : "{duration.moderate}";
  sem.motion.duration.panels.$value = fast ? "{duration.moderate}" : "{duration.slow}";
  const base = px(s.tokens.primitive.space["4"].$value);
  const map = sem["component-spacing-map"];
  for (const [k, t] of Object.entries(map)) {
    const m = t?.$extensions?.["open-ds"]?.multiplier;
    if (m === undefined) continue;
    const r = t.$extensions["open-ds"].fixed ? 1 : map.$extensions["open-ds"].rhythm;
    map[k].$value = `${(Math.floor(m * r + 0.5) * base) / 16}rem`;
  }
  const v = s.tokens.primitive.color.violet;
  const keys = v.$extensions["open-ds"];
  for (const mode of ["light", "dark"]) for (const [st, hex] of Object.entries(violet(mode, keys))) v[mode][st].$value = hex;
  const sizes = Object.keys(s.tokens.primitive.size).sort((a, b) => a - b);
  const def = sem.size.control.default.$value.match(/size\.(\d+)/)[1];
  const derived = (t) => t?.$extensions?.["open-ds"]?.derive === "size.control.default";
  if (derived(sem.size.control.compact)) sem.size.control.compact.$value = `{size.${sizes[sizes.indexOf(def) - 1]}}`;
  if (derived(sem.size.row)) sem.size.row.$value = `{size.${def}}`;
  return s;
}

const generating = () => {
  const s = fixtureScheme();
  s.tokens.semantic.size.control.compact.$extensions["open-ds"].derive = "size.control.default";
  return s;
};
const blastOf = (snap, id) => snap.schemes.fixture.blast.find((b) => b.id === id);

test("with a loader that only reads the file, every answer link is an orphan", () => {
  const snap = snapshotOf(fixtureScheme());
  const m = measure(snap);
  assert.equal(valueOf(m, "blast-radius.answer-orphans"), 20);
  assert.equal(valueOf(m, "blast-radius.answer-orphan-share"), 1);
  assert.equal(valueOf(m, "blast-radius.anchor-orphans"), 4);
  assert.equal(valueOf(m, "blast-radius.hidden-couplings"), 0);
  assert.deepEqual(blastOf(snap, "base-step").orphans, ["component-spacing-map.x2", "component-spacing-map.x3"]);
  assert.deepEqual(blastOf(snap, "key-color").orphans, ["color.action.primary"]);
  assert.deepEqual(blastOf(snap, "control-height").orphans, ["size.control.compact"]);
  assert.deepEqual(blastOf(snap, "default-radius").orphans, []);
});

test("with a generating loader, only the answers it does not read leave orphans", () => {
  const snap = snapshotOf(generating(), { load: generate });
  const m = measure(snap);
  // people.q1 3, spacing.values 4, color.values 6, shape.values 3, accessibility.values 2; motion.values 0
  assert.equal(valueOf(m, "blast-radius.answer-orphans"), 18);
  assert.deepEqual(blastOf(snap, "motion.values").moved, ["motion.duration.feedback", "motion.duration.panels"]);
  assert.equal(valueOf(m, "blast-radius.anchor-orphans"), 0);
  assert.equal(valueOf(m, "blast-radius.hidden-couplings"), 0);
  assert.deepEqual(blastOf(snap, "control-height").moved, ["size.control.compact", "size.control.default"]);
});

test("an orphan hard-code: a compact height stored by hand does not follow the default", () => {
  const base = snapshotOf(generating(), { load: generate });
  const cand = snapshotOf(fixtureScheme(), { load: generate });
  assert.equal(valueOf(measure(cand), "blast-radius.anchor-orphans"), 1);
  assert.deepEqual(blastOf(cand, "control-height").orphans, ["size.control.compact"]);
  assert.ok(compareSnapshots(base, cand).failed.includes("blast-radius.anchor-orphans"));
});

test("a hidden coupling: a row the loader ties to the control height, with no trace of it", () => {
  const s = generating();
  s.tokens.semantic.size.row = {
    $value: "{size.32}",
    $extensions: { "open-ds": { ...DERIVE["open-ds"], why: "Row height: 32px holds one line of table data.", because: ["people.q1"] } },
  };
  const cand = snapshotOf(s, { load: generate });
  const m = measure(cand);
  assert.equal(valueOf(m, "blast-radius.hidden-couplings"), 1);
  assert.deepEqual(blastOf(cand, "control-height").hidden, ["size.row"]);
  // the row also cites people.q1, which moves nothing: one more answer orphan
  assert.equal(valueOf(m, "blast-radius.answer-orphans"), 19);
  assert.ok(compareSnapshots(snapshotOf(generating(), { load: generate }), cand).failed.includes("blast-radius.hidden-couplings"));
});

test("an anchor the file does not store is not present", () => {
  const s = fixtureScheme();
  delete s.tokens.primitive.color.violet.$extensions;
  const snap = snapshotOf(s);
  assert.deepEqual(blastOf(snap, "key-color"), { kind: "anchor", id: "key-color", notPresent: "the violet hue records no key color" });
});
