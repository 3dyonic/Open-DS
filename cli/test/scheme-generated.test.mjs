// A scheme stores key colors and the spacing rhythm; the loader generates the scales and the steps (OD-292).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { scale } from "../src/ramps.mjs";
import { mapTokens } from "../src/spacing-map.mjs";
import { darkCanvas, withGenerated, withoutGenerated } from "../src/scheme-generated.mjs";
import { withTypeAndSpace } from "../src/type-space-generated.mjs";
import { withDefaults } from "../src/scheme-defaults.mjs";
import { assetRoots, grammar, loadScheme, schemeIds, storedScheme } from "../src/schemes.mjs";

const roots = assetRoots();
const g = grammar(roots);
// The scales and spacing maps as the schemes stored them before OD-292, with their inputs.
const before = JSON.parse(readFileSync(new URL("./fixtures/generated-before-od292.json", import.meta.url), "utf8"));
const ids = schemeIds(roots);
const MODES = ["light", "dark"];
const valuesOf = (row) => Object.fromEntries(Object.entries(row).map(([st, t]) => [st, t.$value]));
const inputsOf = (m) => ({
  key: m.key,
  ...(m.adjust && { adjust: Object.fromEntries(Object.entries(m.adjust).map(([st, { why, ...move }]) => [st, move])) }),
});
const withoutExtensions = ({ $extensions, ...rest }) => rest;

test("the scale generator gives the scales the schemes stored before", () => {
  for (const id of ids)
    for (const [hue, modes] of Object.entries(before[id].hues))
      for (const mode of MODES)
        assert.deepEqual(scale(modes[mode].from, mode, before[id].canvas), modes[mode].steps, `${id} ${hue} ${mode}`);
});

test("every loaded scheme has the scales it stored before, where its inputs are unchanged", () => {
  for (const id of ids) {
    // The shared curve: OD-292 moved its stored scales out. The graded curve (OD-299) has its own check.
    const s = loadScheme(id, roots, { graded: false });
    const sameCanvas = darkCanvas(s) === before[id].canvas;
    for (const [hue, modes] of Object.entries(before[id].hues)) {
      const grp = s.tokens.primitive.color[hue];
      if (!grp?.$extensions?.["open-ds"]) continue;
      for (const mode of MODES) {
        if (mode === "dark" && !sameCanvas) continue;
        if (JSON.stringify(inputsOf(grp.$extensions["open-ds"][mode])) !== JSON.stringify(modes[mode].from)) continue;
        assert.deepEqual(valuesOf(grp[mode]), modes[mode].steps, `${id} ${hue} ${mode}`);
      }
    }
  }
});

test("the spacing map generator gives the maps the schemes stored before", () => {
  for (const id of ids) {
    const { from, group } = before[id].spacingMap;
    assert.deepEqual(withoutExtensions(mapTokens(from).group), group, id);
    const loaded = loadScheme(id, roots).tokens.semantic["component-spacing-map"];
    const { why, because, ...rule } = loaded.$extensions["open-ds"];
    if (JSON.stringify(rule) === JSON.stringify(from)) assert.deepEqual(withoutExtensions(loaded), group, id);
  }
});

test("a stored scheme holds no generated scale or spacing step, and loading gives them back", () => {
  for (const id of ids) {
    const stored = storedScheme(id, roots);
    assert.equal(JSON.stringify(withoutGenerated(stored)), JSON.stringify(stored), id);
    for (const [hue, grp] of Object.entries(stored.tokens.primitive.color))
      if (grp?.$extensions?.["open-ds"]) assert.deepEqual([grp.light, grp.dark], [undefined, undefined], `${id} ${hue}`);
    assert.deepEqual(Object.keys(stored.tokens.semantic["component-spacing-map"]), ["$extensions"], id);
    assert.equal(JSON.stringify(withTypeAndSpace(withGenerated(withDefaults(stored, g)))), JSON.stringify(loadScheme(id, roots)), id);
  }
});

test("a stored step that differs from the generator stays in the file", () => {
  const s = loadScheme("dense-data", roots);
  const [hue] = Object.entries(s.tokens.primitive.color).find(([, grp]) => grp?.$extensions?.["open-ds"]);
  s.tokens.primitive.color[hue].light["50"].$value = "#FFFFFF";
  s.tokens.semantic["component-spacing-map"].x3.$value = "{space.16}";
  const stored = withoutGenerated(s);
  assert.equal(stored.tokens.primitive.color[hue].light["50"].$value, "#FFFFFF");
  assert.equal(stored.tokens.primitive.color[hue].dark, undefined);
  assert.equal(stored.tokens.semantic["component-spacing-map"].x3.$value, "{space.16}");
  assert.equal(withGenerated(stored).tokens.primitive.color[hue].light["50"].$value, "#FFFFFF");
});
