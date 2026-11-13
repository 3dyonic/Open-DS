// OD-300: the round 1 and 2 decisions the owner accepted, asserted per scheme on the values they set.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { howTypeIsBuilt } from "../src/docs.mjs";
import { aliasChain, tokenIndex } from "../src/lands.mjs";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { checkRelations, contrast, edgeRule, px } from "../src/shape-elevation.mjs";
import { readsHitArea } from "../src/style-rules.mjs";
import { BUTTON_LABEL_WORDS, checkCopy, checkUi } from "../src/tools.mjs";
import { reasonOf, traceScheme, traceToken } from "../src/trace.mjs";

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

// ---------- Item 3: rows match the control height ----------

test("a row is one default control tall in every scheme, and the trace states it as a decision", () => {
  const want = { "dense-data": 32, "content-first": 48, "accessible-first": 52, "brand-expressive": 52, "multi-brand": 44 };
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    for (const t of themes(s)) {
      const row = px(valueIn(s, t, "size.row"));
      assert.equal(row, px(valueIn(s, t, "size.control.default")), `${id}/${t.brand}/${t.mode}`);
      assert.equal(row, want[id], id);
    }
    const r = reasonOf(traceToken(traceScheme(s, g), "size.row"));
    assert.match(r.why, /one \d+px default control tall|size\.control\.default/, id);
  }
  const rule = g.trace.find((r) => r.tokens.join() === "size.row");
  assert.match(rule.says, /^Decided: a row is one default control tall in every scheme\. A row holds controls/);
});

// ---------- Item 4: the switch ----------

test("the switch track is the thumb plus its offset, twice as wide as it is tall, and the thumb slides one track height", () => {
  const src = read("components/switch.tsx");
  const track = "var(--switch-thumb-size)+2*var(--switch-thumb-offset)";
  assert.ok(src.includes(`h-[calc(${track})] w-[calc(2*(${track}))]`));
  assert.ok(src.includes(`data-[state=checked]:translate-x-[calc(${track})] data-[state=unchecked]:translate-x-0`));
  assert.ok(src.includes("p-[var(--switch-thumb-offset)]"));
  assert.match(src, /transition-transform/);
  assert.doesNotMatch(src, /var\(--switch-(width|height|padding|thumb-travel)\)/);
  for (const id of ["switch/width", "switch/height", "switch/thumb/travel"]) assert.equal(keyOf(id).replaced_by, "switch/thumb/size", id);
  assert.equal(keyOf("switch/padding").replaced_by, "switch/thumb/offset");
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    for (const t of themes(s)) {
      const thumb = px(valueIn(s, t, "component.switch.thumb.size"));
      const offset = px(valueIn(s, t, "component.switch.thumb.offset"));
      const height = thumb + 2 * offset;
      const width = 2 * height;
      // On, the thumb has slid one track height; its right edge sits one offset from the track's edge.
      assert.equal(offset + height + thumb + offset, width, `${id}: the thumb ends inside the track`);
    }
  }
  // The anatomy draws the same shape: an offset, the thumb, an offset, a thumb's width of travel, an offset.
  const track0 = g.catalogue.items.find((i) => i.id === "switch").anatomy.drawing.stage.children[0].children[0];
  assert.equal(track0.pad, "component.switch.thumb.offset");
  assert.deepEqual(track0.children.map((c) => c.w), ["component.switch.thumb.size", "component.switch.thumb.offset", "component.switch.thumb.size", "component.switch.thumb.offset"]);
});

// ---------- Item 6: the Accessible first promise and the muted exception ----------

test("Accessible first promises AAA for text you must read and AA for muted text, and records 6.54:1 as the exception", () => {
  const s = loadScheme("accessible-first");
  assert.match(answerOf(s, "accessibility.definition").why, /^AAA for text you must read; AA for muted text, which must look secondary\./);
  assert.match(s.summary, /AAA contrast for the text you must read/);
  assert.ok(s.description.endsWith(s.summary));
  const light = { brand: "default", mode: "light" };
  const ratio = (fg, bg) => contrast(valueIn(s, light, fg), valueIn(s, light, `color.surface.${bg}`));
  assert.equal(ratio("color.text.muted", "canvas"), 6.54);
  const pick = s.tokens.brands.default.theme.light.color.text.muted.$extensions["open-ds"];
  assert.equal(pick.generated, undefined, "the reason is the owner's, not generated");
  assert.match(pick.why, /6\.54:1 on the canvas/);
  assert.match(pick.why, /recorded exception/);
  for (const t of themes(s))
    for (const bg of ["canvas", "default", "raised"]) {
      const on = valueIn(s, t, `color.surface.${bg}`);
      for (const fg of ["color.text.primary", "color.text.secondary"]) assert.ok(contrast(valueIn(s, t, fg), on) >= 7, `${t.mode} ${fg} on ${bg}`);
      assert.ok(contrast(valueIn(s, t, "color.text.muted"), on) >= 4.5, `${t.mode} muted on ${bg}`);
    }
});

// ---------- Item 7: a button label never breaks onto two lines ----------

test("every scheme's voice says a button label stays on one line", () => {
  for (const id of schemeIds()) {
    const p = loadScheme(id).voice.principles.find((x) => /button label stays on one line/.test(x.text));
    assert.ok(p, id);
    assert.deepEqual(p.follows, ["voice.values", "voice.definition"], id);
  }
});

test("check_ui flags a button label too long for one line, and passes a short one", () => {
  const s = loadScheme("dense-data");
  const long = checkUi(s, g, [{ path: "src/app/page.tsx", content: '<Button variant="secondary">Export all of the records</Button>' }]);
  assert.equal(long.pass, false);
  assert.deepEqual(long.findings.map((f) => [f.rule, f.line, f.see]), [["long-label", 1, "context/tasks/write.md: Situations"]]);
  assert.match(long.findings[0].message, /5 words: "Export all of the records"/);
  const short = checkUi(s, g, [{ path: "src/app/page.tsx", content: '<Button variant="secondary">Export records</Button>' }]);
  assert.deepEqual(short.findings, []);
  // A label that is an expression is not read: only plain text is measured.
  assert.deepEqual(checkUi(s, g, [{ path: "src/a.tsx", content: "<Button>{t('a long label from a catalogue')}</Button>" }]).findings, []);
  assert.equal(BUTTON_LABEL_WORDS, 3);
  assert.match(checkCopy(s, g, { kind: "button", text: "Export all of the records" }).findings[0].message, /3 words at most, so it stays on one line/);
});

// ---------- Item 9: compact buttons on touch get a 44px hit area ----------

test("a compact button drawn under the touch hit area grows its hit area to 44px, and joined stacked buttons do not overlap", () => {
  assert.equal(keyOf("button/hit-area").default, "size.hit-area");
  const drawn = { "content-first": 44, "multi-brand": 36 };
  for (const [id, compact] of Object.entries(drawn)) {
    const s = loadScheme(id);
    for (const t of themes(s)) {
      assert.equal(px(valueIn(s, t, "component.button.compact.height")), compact, `${id} draws compact at ${compact}px`);
      assert.equal(px(valueIn(s, t, "component.button.hit-area")), 44, `${id}/${t.brand}/${t.mode}`);
    }
  }
  const button = read("components/button.tsx");
  assert.ok(readsHitArea(button, "--button-hit-area"));
  // The drawn box keeps its size: the compact height still reads its own key.
  assert.match(button, /compact: "h-\[var\(--button-compact-height\)\]/);
  assert.match(read("components/button-group.tsx"), /vertical:\n?\s*"flex-col[^"]*\[&>\[data-slot=button\]\]:after:hidden"/);
});

// ---------- Type items: Dense data's line boxes and the How type is built page ----------

test("Dense data sets body and help text 14/20, data cells 14/18 and captions 12/16, each reason naming its line kind", () => {
  const s = loadScheme("dense-data");
  const t = { brand: "default", mode: "light" };
  const want = { body: [14, 20, "open step, 1.45"], data: [14, 18, "snug step, 1.3"], caption: [12, 16, "snug step, 1.3"] };
  const trace = traceScheme(s, g);
  for (const [role, [size, line, kind]] of Object.entries(want)) {
    assert.equal(px(valueIn(s, t, `type.${role}.font-size`)), size, role);
    assert.equal(px(valueIn(s, t, `type.${role}.line-height`)), line, role);
    const r = reasonOf(traceToken(trace, `type.${role}.line-height`));
    assert.equal(r.kind, "own", role);
    assert.match(r.why, new RegExp(`^An? ${line}px line box`), role);
    assert.ok(r.why.includes(kind), role);
    assert.match(r.why, /snapped to the 2px grid/, role);
  }
});

test("each scheme's How type is built page states its base, ratio, grid and line kinds from the record", () => {
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    const rec = s.tokens.semantic.type.$extensions["open-ds"];
    const page = howTypeIsBuilt(s);
    assert.ok(page, id);
    assert.match(page.markdown, /^:::info\[Look closer, when you want to\]/, id);
    assert.ok(page.markdown.includes(`The base is **${rec.base}px** and the ratio is **${rec.ratio}**.`), id);
    for (const [kind, k] of Object.entries(rec["line-height"])) assert.ok(page.markdown.includes(`lines are ${k.ratio} × the size`), `${id} ${kind}`);
    assert.deepEqual(page.roles.map((r) => r.role).sort(), Object.keys(rec.steps).sort(), id);
    const body = page.roles.find((r) => r.role === "body");
    assert.equal(body.size, `${px(valueIn(s, { brand: Object.keys(s.tokens.brands)[0], mode: "light" }, "type.body.font-size"))}px`, id);
  }
  const dense = howTypeIsBuilt(loadScheme("dense-data")).markdown;
  assert.match(dense, /\| Data \| 0 \| 14px \| 18px \|/);
  assert.match(dense, /\| Caption \| -1 \| 12px \| 16px \|/);
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
