// The token map card (OD-310): the shorthand limits, the weakest contrast, the real pairs with the
// scheme's sample texts, the clashes, and the stored shorthand that saveScheme keeps.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { clashesOf, pairsOf, samplesFor, shorthandOf, shorthandProblems, weakestContrast } from "../src/token-card.mjs";
import { tokenMapView } from "../src/token-map-view.mjs";
import { assetRoots, grammar, loadScheme, saveScheme } from "../src/schemes.mjs";

// A color index with only the nodes a test names.
const indexOf = (values) => ({
  nodes: new Map(Object.entries(values).map(([id, value]) => [id, { id, value, tier: "semantic" }])),
});
const SAMPLES = {
  statuses: [{ label: "Out of date", meaning: "warning", why: "x" }],
  messages: { success: "You're in.", error: { title: "We could not save that." } },
  field: { error: "Check it and try again." },
  actions: { primary: "Keep reading", secondary: "Save for later" },
  card: { title: "Planting a winter garden" },
};

test("a shorthand holds a headline of 40 characters and a line of 90", () => {
  assert.deepEqual(shorthandProblems({ headline: "Careful.", line: "People see it before they read the word." }), []);
  assert.deepEqual(shorthandProblems(null), ["no shorthand"]);
  assert.deepEqual(shorthandProblems({ headline: "x".repeat(41), line: "" }), ["headline is 41 characters, over 40", "no line"]);
  assert.deepEqual(shorthandProblems({ headline: "ok", line: "y".repeat(91) }), ["line is 91 characters, over 90"]);
});

test("the shorthand is read by token name, without the .@ of a group token", () => {
  const scheme = { shorthand: { tokens: { "color.status.warning": { headline: "Careful.", line: "One line." } } } };
  assert.equal(shorthandOf(scheme, "color.status.warning.@").headline, "Careful.");
  assert.equal(shorthandOf({}, "color.status.warning"), null);
});

test("sample texts come from the scheme, and a meaning with none gets none", () => {
  assert.deepEqual(samplesFor(SAMPLES, "warning"), { sentence: "Out of date", label: "Out of date" });
  assert.deepEqual(samplesFor(SAMPLES, "success"), { sentence: "You're in.", label: "You're in." });
  assert.deepEqual(samplesFor(SAMPLES, "danger"), { sentence: "We could not save that.", label: "We could not save that." });
  assert.deepEqual(samplesFor(SAMPLES, "info"), { sentence: null, label: null });
});

test("the weakest contrast is the engine's pair closest to its floor", () => {
  const index = indexOf({ "color.status.warning.@": "#8A5600", "color.surface.canvas": "#FFFDF8", "color.surface.default": "#FFFFFF" });
  const sits = [
    { key: "color.status.warning", on: "color.surface.canvas", floor: 4.5 },
    { key: "color.status.warning", on: "color.surface.default", floor: 4.5 },
  ];
  assert.deepEqual(weakestContrast(index, "color.status.warning.@", sits), {
    ratio: 6.05,
    floor: 4.5,
    kind: "text",
    on: "color.surface.canvas",
    against: null,
  });
});

test("a fill's weakest contrast is its label on it", () => {
  const index = indexOf({ "color.action.primary.@": "#1E3A5F", "color.text.on-dark": "#FFFFFF", "color.surface.canvas": "#FFFDF8" });
  const sits = [
    { key: "color.action.primary", on: "color.surface.canvas", floor: 3 },
    { key: "color.text.on-dark", on: "color.action.primary", floor: 4.5 },
  ];
  const c = weakestContrast(index, "color.action.primary.@", sits);
  assert.equal(c.against, "color.text.on-dark");
  assert.equal(c.on, "color.action.primary");
  assert.equal(c.floor, 4.5);
});

test("a status shows a sentence in its color on its weakest surface and an icon beside normal text", () => {
  const index = indexOf({
    "color.status.warning.@": "#8A5600",
    "color.surface.canvas": "#FFFDF8",
    "color.surface.default": "#FFFFFF",
    "color.text.primary": "#1F1B16",
  });
  const sits = [{ key: "color.status.warning", on: "color.surface.canvas", floor: 4.5 }];
  assert.deepEqual(pairsOf(index, "color.status.warning.@", SAMPLES, sits), [
    { as: "text", on: "color.surface.canvas", text: "Out of date", ink: "#8A5600", ground: "#FFFDF8" },
    { as: "icon", on: "color.surface.default", text: "Out of date", ink: "#8A5600", ground: "#FFFFFF", label: "#1F1B16" },
  ]);
});

test("a pair with no sample text is left out, never invented", () => {
  const index = indexOf({ "color.status.info.@": "#1F5FAD", "color.surface.default": "#FFFFFF", "color.text.primary": "#1F1B16" });
  assert.deepEqual(pairsOf(index, "color.status.info.@", SAMPLES, [{ key: "color.status.info", on: "color.surface.default", floor: 4.5 }]), []);
});

test("a clash is a mark with the same value, or one under the difference threshold", () => {
  const index = indexOf({
    "color.status.warning.@": "#8A5600",
    "color.category.4": "#8A5600",
    "color.category.2": "#8B5701",
    "color.category.1": "#1E3A5F",
    "color.surface.default": "#8A5600",
  });
  const clashes = clashesOf(index, "color.status.warning.@", 0.02);
  assert.deepEqual(clashes.map((c) => [c.token, c.same]), [["color.category.4", true], ["color.category.2", false]]);
  assert.match(clashes[0].note, /^color\.category\.4 has the same value/);
  assert.deepEqual(clashesOf(index, "color.status.warning.@", null).map((c) => c.token), ["color.category.4"]);
  assert.deepEqual(clashesOf(index, "color.surface.default", 0.02), []);
});

test("the Content first warning card measures 6.05:1 on the page and clashes with category 4", () => {
  const view = tokenMapView({ scheme: loadScheme("content-first"), grammar: grammar() });
  const light = view.modes.light.decisions["color.status.warning"];
  assert.deepEqual(light.resolves, { name: "amber 600", value: "#8A5600" });
  assert.deepEqual(light.contrast, { ratio: 6.05, floor: 4.5, kind: "text", on: "color.surface.canvas", against: null });
  assert.deepEqual(light.clashes.map((c) => c.token), ["color.category.4"]);
  assert.deepEqual(light.pairs.map((p) => `${p.as} ${p.on}`), ["text color.surface.canvas", "icon color.surface.default"]);
  assert.equal(view.modes.dark.decisions["color.status.warning"].contrast.ratio, 9.57);
});

test("saveScheme keeps the stored shorthand", () => {
  const roots = assetRoots();
  const dir = mkdtempSync(join(tmpdir(), "od-310-"));
  try {
    const copy = { ...roots, schemes: join(dir, "schemes") };
    cpSync(roots.schemes, copy.schemes, { recursive: true });
    const scheme = loadScheme("content-first", copy);
    scheme.shorthand = { description: "Test.", tokens: { "color.status.warning": { headline: "Careful.", line: "One line." } } };
    saveScheme(scheme, copy);
    const stored = JSON.parse(readFileSync(join(copy.schemes, "content-first.json"), "utf8"));
    assert.deepEqual(stored.shorthand, scheme.shorthand);
    assert.deepEqual(loadScheme("content-first", copy).shorthand, scheme.shorthand);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
