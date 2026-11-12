// The trace engine: every semantic value reaches the answers that decide it, by one engine that the
// coverage check and the Token map share.
import { test } from "node:test";
import assert from "node:assert/strict";
import { decisionCoverage } from "../src/coverage.mjs";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { tokenMapView } from "../src/token-map-view.mjs";
import { matches, reasonOf, traceScheme, traceToken, untraced, weakReasons } from "../src/trace.mjs";

const g = grammar();

test("a trace rule pattern names a whole segment, never part of one", () => {
  assert.ok(matches("type.*.font-size", "type.body.font-size"));
  assert.ok(!matches("type.*.font-size", "type.body.strong.font-size"));
  assert.ok(!matches("size.control.*", "size.control"));
  assert.ok(matches("size.row", "size.row"));
});

test("every semantic value in every scheme reaches a decision", () => {
  for (const id of schemeIds()) {
    const gaps = untraced(traceScheme(loadScheme(id), g)).map((t) => t.token);
    assert.deepEqual(gaps, [], id);
  }
});

test("a value with no pick, rule or reason of its own takes the grammar's trace rule", () => {
  const s = loadScheme("dense-data");
  const t = traceToken(traceScheme(s, g), "type.display.line-height");
  const rule = t.links.find((l) => l.by === "grammar");
  assert.deepEqual(rule.because, ["typography.definition"]);
});

test("the component spacing map takes its group's reason", () => {
  const s = loadScheme("brand-expressive");
  const t = traceToken(traceScheme(s, g), "component-spacing-map.x3");
  const group = t.links.find((l) => l.by === "group");
  assert.equal(group.group, "component-spacing-map");
  assert.ok(group.because.includes("spacing.values"));
});

// A scheme with no usage rules and no reasons of its own on its semantic tokens: only picks, groups and
// the grammar's trace rules are left to reach a value.
const bareScheme = (id) => {
  const s = structuredClone(loadScheme(id));
  const strip = (node) => {
    if (!node || typeof node !== "object") return;
    if ("$value" in node && node.$extensions?.["open-ds"]) delete node.$extensions["open-ds"];
    else for (const [k, v] of Object.entries(node)) if (k !== "$extensions") strip(v);
  };
  strip(s.tokens.semantic);
  return { ...s, usage: [] };
};

test("the grammar's trace rules alone reach every value; without them, values have gaps", () => {
  for (const id of schemeIds()) {
    const s = bareScheme(id);
    assert.deepEqual(untraced(traceScheme(s, g)).map((t) => t.token), [], id);
    const gaps = untraced(traceScheme(s, { ...g, trace: [] })).map((t) => t.token);
    assert.ok(gaps.includes("motion.easing.standard") && gaps.includes("type.body.line-height"), `${id}: ${gaps.join(", ")}`);
  }
});

test("coverage and the Token map agree: no value without a reason in either", () => {
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    assert.equal(decisionCoverage(s, g).unlinked.length, 0, id);
    const v = tokenMapView({ scheme: s, grammar: g });
    const all = [v.shared, v.modes.light, v.modes.dark].flatMap((m) => Object.values(m.decisions));
    const none = all.filter((d) => !(d.why || d.answers.length || d.stepWhy)).map((d) => d.id);
    assert.deepEqual(none, [], id);
  }
});

test("a rule for a whole group is borrowed, not a reason of the value's own", () => {
  const t = { token: "type.body.line-height", value: "{font.line-height.1_5}", because: ["voice.values"], links: [{ by: "rule", because: ["voice.values"], why: "Short copy keeps the energy.", exact: false }] };
  assert.equal(reasonOf(t).kind, "borrowed");
});

test("two values with one sentence are weak, but the steps of one scale may share theirs", () => {
  const link = (why) => [{ by: "pick", because: ["shape.values"], why }];
  const trace = {
    tokens: [
      { token: "radius.control", value: "{theme.radius.control}", because: ["shape.values"], links: link("radius.24: Pill controls feel playful and bold.") },
      { token: "radius.surface", value: "{theme.radius.surface}", because: ["shape.values"], links: link("radius.24: Pill controls feel playful and bold.") },
      { token: "color.neutral.0", value: "{theme.color.neutral.0}", because: ["color.values"], links: link("taupe.0: the scheme's neutral is a warm taupe.") },
      { token: "color.neutral.50", value: "{theme.color.neutral.50}", because: ["color.values"], links: link("taupe.50: the scheme's neutral is a warm taupe.") },
    ],
  };
  assert.deepEqual(weakReasons(trace).map((w) => w.token), ["radius.control", "radius.surface"]);
});

test("every semantic value in every scheme has a reason that explains it", () => {
  for (const id of schemeIds()) assert.deepEqual(weakReasons(traceScheme(loadScheme(id), g)).map((w) => `${w.token}: ${w.problem}`), [], id);
});
