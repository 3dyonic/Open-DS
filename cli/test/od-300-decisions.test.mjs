// OD-300: the round 1 and 2 decisions the owner accepted, asserted per scheme on the values they set.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { aliasChain, tokenIndex } from "../src/lands.mjs";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { checkRelations, contrast, edgeRule } from "../src/shape-elevation.mjs";

const g = grammar();
const UI = new URL("../../ui/src/", import.meta.url);
const read = (path) => readFileSync(new URL(path, UI), "utf8");
const themes = (s) => Object.keys(s.tokens.brands).flatMap((brand) => ["light", "dark"].map((mode) => ({ brand, mode })));
const valueIn = (s, theme, path) => aliasChain(tokenIndex(s, theme), path).value;
const answerOf = (s, question) => s.answers.find((a) => a.question === question);
const keyOf = (id) => g.component_keys.find((k) => k.id === id);

// ---------- Item 5: Multi-brand makes two corner sizes ----------

test("Multi-brand answers two corner sizes, with a reason", () => {
  const a = answerOf(loadScheme("multi-brand"), "shape.count");
  assert.equal(a.option, "two");
  assert.match(a.why, /Two corner sizes/);
  assert.deepEqual(a.because, ["shape.roles", "shape.values"]);
});

test("Aster and Coral make the two corner sizes the answer names; Birch stays a finding for the owner", () => {
  const r = checkRelations(loadScheme("multi-brand"), g).results.filter((x) => x.token === "radius.surface");
  const broken = r.filter((x) => !x.holds).map((x) => `${x.brand}/${x.mode}`);
  // Birch's pill badge, 12px control and 16px surface make three sizes. The value is the owner's to change.
  assert.deepEqual(broken, ["birch/light"]);
});

// ---------- Item 1: the edge rule ----------

test("each only cue that you can click or type reads the strong border; the tabs list and a static item stay faint", () => {
  for (const id of [
    "combobox/input/border",
    "input/border/@",
    "sidebar/menu-button/outline/border/@",
    "button/secondary/border",
    "item/outline/clickable/border",
  ])
    assert.equal(keyOf(id).default, "color.border.strong", id);
  assert.equal(keyOf("tabs/list/border").default, "color.border.default");
  assert.equal(keyOf("item/outline/border").default, "color.border.default");
  const line = g.scopes.find((s) => s.id === "shape").relations.find((r) => r.id === "default-line");
  assert.ok(line.boundaries.includes("component.combobox.input.border"));
  assert.ok(line.boundaries.includes("component.item.outline.clickable.border"));
  assert.ok(!line.boundaries.includes("component.tabs.list.border"));
  assert.deepEqual(line.quiet.map((q) => q.token), ["component.tabs.list.border", "component.item.outline.border"]);
  for (const q of line.quiet) assert.ok(q.why.length > 20, q.token);
});

test("every boundary holds 3:1 on content in every scheme, brand and mode", () => {
  for (const id of schemeIds()) {
    const r = edgeRule(loadScheme(id), g);
    assert.deepEqual(r.gaps, [], id);
    assert.ok(r.checked > 0, id);
  }
});

test("a boundary on the faint line, or a quiet line on the strong one, breaks the edge rule", () => {
  const s = loadScheme("multi-brand");
  const broken = structuredClone(s);
  broken.tokens.component.combobox.input.border = { $value: "{color.border.default}", $description: "planted" };
  assert.ok(edgeRule(broken, g).gaps.some((x) => /combobox\.input\.border reads color\.border\.default/.test(x)));
  assert.ok(edgeRule(broken, g).gaps.some((x) => /combobox\.input\.border is 1\.\d+:1/.test(x)));
  const loud = structuredClone(s);
  loud.tokens.component.tabs.list.border = { $value: "{color.border.strong}", $description: "planted" };
  assert.ok(edgeRule(loud, g).gaps.some((x) => /tabs\.list\.border reads color\.border\.strong/.test(x)));
});

test("an outline item that is a link or a button takes the clickable edge", () => {
  assert.match(read("components/item.tsx"), /\[a\]:border-\[color:var\(--item-outline-clickable-border\)\]/);
  assert.match(read("components/item.tsx"), /\[button\]:border-\[color:var\(--item-outline-clickable-border\)\]/);
});

// ---------- Item 2: handles ----------

test("a scroll thumb and a resize handle are faint at rest and strong under the pointer and in keyboard focus", () => {
  for (const part of ["scroll-area/thumb/background", "resizable/handle/background"]) {
    assert.equal(keyOf(part).default, "color.border.default", part);
    assert.equal(keyOf(`${part}-hover`).default, "color.border.strong", `${part}-hover`);
    assert.equal(keyOf(`${part}-focus`).default, "color.border.strong", `${part}-focus`);
  }
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    for (const t of themes(s)) {
      const on = valueIn(s, t, "color.surface.default");
      const strong = contrast(valueIn(s, t, "component.scroll-area.thumb.background-hover"), on);
      assert.ok(strong >= 3, `${id}/${t.brand}/${t.mode}: the thumb under the pointer is ${strong}:1`);
      assert.equal(valueIn(s, t, "component.resizable.handle.background-focus"), valueIn(s, t, "color.border.strong"), id);
    }
  }
  const scroll = read("components/scroll-area.tsx");
  assert.match(scroll, /hover:bg-\[color:var\(--scroll-area-thumb-background-hover\)\]/);
  assert.match(scroll, /group-has-\[\[data-slot=scroll-area-viewport\]:focus-visible\]\/scroll-area:bg-\[color:var\(--scroll-area-thumb-background-focus\)\]/);
  assert.match(scroll, /focus-visible:ring-\[color:var\(--scroll-area-viewport-focus-ring-focus\)\]/);
  const resize = read("components/resizable.tsx");
  assert.match(resize, /hover:bg-\[color:var\(--resizable-handle-background-hover\)\]/);
  assert.match(resize, /focus-visible:bg-\[color:var\(--resizable-handle-background-focus\)\]/);
  assert.match(resize, /focus-visible:ring-\[color:var\(--resizable-handle-focus-ring-focus\)\]/);
});

// ---------- Item 8: the skeleton fills with neutral step 200 ----------

test("the skeleton reads neutral step 200 in every scheme, brand and mode, not the sunken well", () => {
  assert.equal(keyOf("skeleton/background").default, "color.neutral.200");
  assert.match(keyOf("skeleton/background").description, /nearest scale step/);
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    for (const t of themes(s)) {
      const fill = valueIn(s, t, "component.skeleton.background");
      assert.equal(fill, valueIn(s, t, "color.neutral.200"), `${id}/${t.brand}/${t.mode}`);
      assert.notEqual(fill, valueIn(s, t, "color.surface.sunken"), `${id}/${t.brand}/${t.mode}: not the well`);
    }
  }
  assert.match(read("components/skeleton.tsx"), /var\(--skeleton-background\)/);
});
