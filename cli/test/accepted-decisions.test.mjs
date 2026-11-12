// OD-297: the ten design decisions the owner accepted, asserted per scheme on the values they set.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { aliasChain, tokenIndex } from "../src/lands.mjs";
import { bezierAt, checkMotion, curveKind, familyOf, ms } from "../src/motion.mjs";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { checkRelations, contrast, px } from "../src/shape-elevation.mjs";
import { disabledOpacity, readsHitArea, reducedMotion, trackingOutOfRange, uppercaseLabels } from "../src/style-rules.mjs";
import { reasonOf, traceScheme, traceToken } from "../src/trace.mjs";

const g = grammar();
const UI = new URL("../../ui/src/", import.meta.url);
const read = (path) => readFileSync(new URL(path, UI), "utf8");
const themes = (s) => Object.keys(s.tokens.brands).flatMap((brand) => ["light", "dark"].map((mode) => ({ brand, mode })));
const valueIn = (s, theme, path) => aliasChain(tokenIndex(s, theme), path).value;
const light = (s, path) => valueIn(s, { brand: Object.keys(s.tokens.brands)[0], mode: "light" }, path);
const pick = (s, brand, mode, path) => path.split(".").reduce((n, k) => n?.[k], s.tokens.brands[brand].theme[mode])?.$value;

// ---------- Decisions 2, 3 and 6: motion families, durations and easing per move ----------

const MOTION = {
  "dense-data": { family: "productive", feedback: 120, panels: 120, exit: 120, offscreen: "strong-out", emphasize: "ease-out" },
  "content-first": { family: "productive", feedback: 150, panels: 300, exit: 150, offscreen: "strong-out", emphasize: "ease-out" },
  "accessible-first": { family: "productive", feedback: 150, panels: 150, exit: 150, offscreen: "strong-out", emphasize: "ease-out" },
  "brand-expressive": { family: "expressive", feedback: 120, panels: 200, exit: 120, hero: 320, offscreen: "accelerate", emphasize: "overshoot" },
  "multi-brand": { family: "productive", feedback: 150, panels: 300, exit: 150, offscreen: "strong-out", emphasize: "ease-out" },
};

test("a curve's kind is measured from its control points", () => {
  assert.equal(curveKind([0.2, 0, 0, 1]), "ease-out");
  assert.equal(curveKind([0.23, 1, 0.32, 1]), "strong-out");
  assert.equal(curveKind([0.4, 0, 1, 1]), "accelerate");
  assert.equal(curveKind([0.34, 1.56, 0.64, 1]), "overshoot");
  assert.equal(curveKind([0, 0, 1, 1]), "linear");
  assert.ok(Math.abs(bezierAt([0, 0, 1, 1], 0.25) - 0.25) < 1e-6);
  assert.equal(ms("150ms"), 150);
  assert.equal(ms("0.3s"), 300);
});

test("each scheme's family, durations and move easings are the accepted ones", () => {
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    const want = MOTION[id];
    assert.equal(familyOf(s, g), want.family, id);
    for (const kind of ["feedback", "panels", "exit", "hero"])
      if (want[kind] !== undefined) assert.equal(ms(light(s, `motion.duration.${kind}`)), want[kind], `${id} ${kind}`);
    assert.equal(curveKind(light(s, "motion.easing.standard")), "ease-out", `${id} transition`);
    assert.equal(curveKind(light(s, "motion.easing.enter")), "ease-out", `${id} enter`);
    assert.equal(curveKind(light(s, "motion.easing.exit")), "strong-out", `${id} exit`);
    assert.equal(curveKind(light(s, "motion.easing.exit-offscreen")), want.offscreen, `${id} exit-offscreen`);
    assert.equal(curveKind(light(s, "motion.easing.emphasize")), want.emphasize, `${id} emphasize`);
  }
});

test("every scheme keeps its family's limits", () => {
  for (const id of schemeIds()) {
    const r = checkMotion(loadScheme(id), g);
    assert.deepEqual(r.errors, [], id);
    assert.deepEqual(r.results.filter((x) => !x.holds), [], id);
  }
});

test("a productive feedback of 200ms, or a spring on any move but emphasis, breaks the family", () => {
  const slow = structuredClone(loadScheme("multi-brand"));
  slow.tokens.primitive.duration.moderate.$value = "200ms";
  assert.ok(checkMotion(slow, g).results.some((x) => x.token === "motion.duration.feedback" && !x.holds));
  const bouncy = structuredClone(loadScheme("brand-expressive"));
  bouncy.tokens.semantic.motion.easing.standard.$value = "{easing.spring}";
  assert.ok(checkMotion(bouncy, g).results.some((x) => x.token === "motion.easing.standard" && !x.holds));
  const accelerates = structuredClone(loadScheme("dense-data"));
  accelerates.tokens.primitive.easing.accelerate = { $type: "cubicBezier", $value: [0.4, 0, 1, 1] };
  accelerates.tokens.semantic.motion.easing["exit-offscreen"].$value = "{easing.accelerate}";
  assert.ok(checkMotion(accelerates, g).results.some((x) => x.token === "motion.easing.exit-offscreen" && !x.holds));
});

test("panels close on the exit easing at the exit duration, and a sheet on the off-screen exit", () => {
  for (const f of ["popover", "dialog", "alert-dialog", "hover-card", "tooltip", "context-menu", "menubar", "navigation-menu", "combobox", "drawer", "sheet"]) {
    const text = read(`components/${f}.tsx`);
    if (!text.includes(":animate-out")) continue;
    assert.match(text, /:ease-\[var\(--transition-(exit|offscreen-exit)-easing\)\]/, f);
    assert.match(text, /:duration-\[var\(--transition-exit-duration\)\]/, f);
  }
  assert.match(read("components/sheet.tsx"), /data-\[state=closed\]:ease-\[var\(--transition-offscreen-exit-easing\)\]/);
  assert.doesNotMatch(read("components/sheet.tsx"), /ease-in-out/);
});

// ---------- Decision 4: reduced motion ----------

test("reduced motion stops movement and keeps fades and color changes", () => {
  const r = reducedMotion(read("styles.css"));
  assert.deepEqual(r, { found: true, instant: false, movesTransform: false, keepsFade: true, stopsSlides: true });
  const old = "@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }";
  assert.equal(reducedMotion(old).instant, true);
  assert.equal(reducedMotion(old).movesTransform, true);
});

// ---------- Decision 1: disabled reads colors, never opacity ----------

test("no component dims a disabled state with opacity", () => {
  const dir = new URL("components/", UI);
  const hits = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .flatMap((f) => disabledOpacity(readFileSync(new URL(f, dir), "utf8")).map((h) => `${f}:${h.line} ${h.cls}`));
  assert.deepEqual(hits, []);
  assert.equal(disabledOpacity('"disabled:opacity-[var(--x)] aria-disabled:opacity-50"').length, 2);
});

test("checkbox, switch and textarea read the disabled colors", () => {
  assert.match(read("components/checkbox.tsx"), /disabled:bg-\[var\(--checkbox-disabled-background\)\] disabled:border-\[var\(--checkbox-disabled-border\)\]/);
  assert.match(read("components/checkbox.tsx"), /data-\[disabled\]:text-\[var\(--checkbox-disabled-indicator\)\]/);
  assert.match(read("components/switch.tsx"), /disabled:bg-\[var\(--switch-disabled-track\)\]/);
  assert.match(read("components/textarea.tsx"), /disabled:text-\[color:var\(--textarea-disabled-text\)\]/);
  const key = (id) => g.component_keys.find((k) => k.id === id);
  assert.equal(key("checkbox/disabled-background").default, "color.disabled.surface");
  assert.equal(key("checkbox/disabled-border").default, "color.disabled.border");
  assert.equal(key("switch/disabled-track").default, "color.disabled.border");
  assert.equal(key("field/label/disabled/text").default, "color.disabled.text");
  assert.equal(key("checkbox/disabled").replaced_by, "checkbox/disabled-background");
});

test("opacity.disabled is a deprecated alias in every scheme, and no live key reads it", () => {
  for (const id of schemeIds()) assert.ok(loadScheme(id).tokens.semantic.opacity.disabled.$deprecated, id);
  assert.deepEqual(g.component_keys.filter((k) => !k.replaced_by && k.default === "opacity.disabled").map((k) => k.id), []);
});

test("a disabled field's label stays readable: 4.5:1 on content in every theme", () => {
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    for (const t of themes(s)) {
      const r = contrast(valueIn(s, t, "color.disabled.text"), valueIn(s, t, "color.surface.default"));
      assert.ok(r >= 4.5, `${id}/${t.brand}/${t.mode}: ${r}:1`);
    }
  }
});

// ---------- Decision 5: dark depth ----------

const DARK = {
  "dense-data": { default: 50, raised: 100, sunken: 0, highlight: 0, pressed: 0, ring: 200 },
  "content-first": { default: 50, raised: 100, sunken: 0, highlight: 0, pressed: 200, ring: 200 },
  "accessible-first": { default: 100, raised: 200, sunken: 50, highlight: 50, pressed: 0, ring: 300 },
  "brand-expressive": { default: 50, raised: 100, sunken: 0, highlight: 0, pressed: 200, ring: 200 },
  "multi-brand": { default: 50, raised: 100, sunken: 0, highlight: 0, pressed: 200, ring: 200 },
};

test("in dark, raised is a step lighter than content, sunken a step darker, and the ring a lighter solid step", () => {
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    const want = DARK[id];
    for (const brand of Object.keys(s.tokens.brands)) {
      for (const k of ["default", "raised", "sunken", "highlight", "pressed"])
        assert.equal(pick(s, brand, "dark", `color.surface.${k}`), `{color.neutral.${want[k]}}`, `${id}/${brand} ${k}`);
      assert.equal(pick(s, brand, "dark", "color.border.raised"), `{color.neutral.${want.ring}}`, `${id}/${brand} ring`);
      const t = { brand, mode: "dark" };
      const ring = valueIn(s, t, "color.border.raised");
      assert.match(ring, /^#[0-9A-F]{6}$/i, `${id}/${brand}: the ring is solid`);
      assert.ok(contrast(ring, valueIn(s, t, "color.surface.raised")) > 1, `${id}/${brand}: the ring shows`);
    }
    const r = checkRelations(s, g);
    assert.deepEqual(r.results.filter((x) => ["color.surface.raised", "color.border.raised"].includes(x.token) && !x.holds), [], id);
  }
});

test("in dark only floating layers cast a shade", () => {
  for (const id of ["brand-expressive", "multi-brand"]) {
    const s = loadScheme(id);
    for (const brand of Object.keys(s.tokens.brands)) {
      assert.equal(pick(s, brand, "dark", "elevation.card"), "{shadow.none}", `${id}/${brand}`);
      assert.notEqual(pick(s, brand, "light", "elevation.card"), "{shadow.none}", `${id}/${brand} keeps its light shadow`);
    }
    assert.equal(s.tokens.component.card.background.$value, "{color.surface.raised}", id);
    assert.equal(s.tokens.component.card.border.$value, "{color.border.raised}", id);
  }
  const cast = structuredClone(loadScheme("multi-brand"));
  cast.tokens.brands.aster.theme.dark.elevation.card.$value = "{shadow.card}";
  assert.ok(checkRelations(cast, g).results.some((x) => x.token === "elevation.card" && x.mode === "dark" && !x.holds));
});

test("the two known dark defects are findings again if they come back", () => {
  const flat = structuredClone(loadScheme("dense-data"));
  flat.tokens.brands.default.theme.dark.color.surface.raised.$value = "{color.neutral.50}";
  assert.ok(checkRelations(flat, g).results.some((x) => x.token === "color.surface.raised" && !x.holds));
  const alpha = structuredClone(loadScheme("dense-data"));
  alpha.tokens.brands.default.theme.dark.color.border.raised.$value = "#FFFFFF1A";
  assert.ok(checkRelations(alpha, g).results.some((x) => x.token === "color.border.raised" && !x.holds));
});

test("floating layers draw their edge with the raised ring", () => {
  for (const id of ["popover/content/border", "dropdown-menu/content/border", "dialog/content/border", "toast/neutral/border"])
    assert.equal(g.component_keys.find((k) => k.id === id).default, "color.border.raised", id);
});

// ---------- Decision 8: hit area ----------

test("the hit area is 24px for a pointer and 44px for touch", () => {
  const want = { "dense-data": 24, "content-first": 44, "accessible-first": 44, "brand-expressive": 44, "multi-brand": 44 };
  for (const id of schemeIds()) assert.equal(px(light(loadScheme(id), "size.hit-area")), want[id], id);
});

test("controls drawn under 24px grow their hit area, and groups keep two hit areas apart", () => {
  assert.ok(readsHitArea(read("components/checkbox.tsx"), "--checkbox-hit-area"));
  assert.ok(readsHitArea(read("components/radio-group.tsx"), "--radio-group-item-hit-area"));
  assert.ok(readsHitArea(read("components/switch.tsx"), "--switch-hit-area"));
  assert.ok(readsHitArea(read("components/slider.tsx"), "--slider-thumb-hit-area"));
  assert.ok(!readsHitArea(read("components/button.tsx"), "--checkbox-hit-area"));
  assert.match(read("components/radio-group.tsx"), /gap-\[max\(var\(--radio-group-gap\),calc\(var\(--radio-group-item-hit-area\)-var\(--radio-group-item-icon-size\)\)\)\]/);
  assert.match(read("components/field.tsx"), /data-\[slot=checkbox-group\]:\[&>\[data-slot=field\]\]:min-h-\[var\(--field-group-hit-area\)\]/);
  // The drawn box keeps its size: the checkbox still reads its own size key.
  assert.match(read("components/checkbox.tsx"), /size-\[var\(--checkbox-size\)\]/);
});

// ---------- Decision 9: the focus ring is its own token ----------

test("the focus ring is focus.ring.width, one step heavier than the default line", () => {
  const want = { "dense-data": [1, 2], "content-first": [1, 2], "accessible-first": [2, 3], "brand-expressive": [2, 3], "multi-brand": [1, 2] };
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    assert.deepEqual([px(light(s, "border-width.default")), px(light(s, "focus.ring.width"))], want[id], id);
    assert.equal(px(light(s, "focus.ring.offset")), 2, id);
    assert.equal(s.tokens.semantic["border-width"].focus.$value, "{focus.ring.width}", id);
    assert.ok(s.tokens.semantic["border-width"].focus.$deprecated, id);
  }
  assert.deepEqual(g.component_keys.filter((k) => !k.replaced_by && /^border-width\.focus/.test(k.default)).map((k) => k.id), []);
});

// ---------- Decision 10: uppercase tracking ----------

test("uppercase tracking is measured in CSS and in class lists", () => {
  assert.deepEqual(uppercaseLabels(".a { text-transform: uppercase; letter-spacing: 0.08em; }").map((x) => x.em), [0.08]);
  assert.deepEqual(trackingOutOfRange(".a { text-transform: uppercase; letter-spacing: 0.02em; }").map((x) => x.em), [0.02]);
  assert.deepEqual(trackingOutOfRange(".a { text-transform: uppercase; }").map((x) => x.em), [0]);
  assert.deepEqual(trackingOutOfRange('<b className="uppercase tracking-wide" />').map((x) => x.em), [0.025]);
  assert.deepEqual(trackingOutOfRange('<b className="uppercase tracking-wider" />'), []);
  assert.deepEqual(trackingOutOfRange('<b className="uppercase tracking-[0.5px]" />').map((x) => x.em), [null]);
});

test("every uppercase label where a scheme is drawn tracks 0.05 to 0.12em", () => {
  const ROOT = new URL("../../", import.meta.url);
  const walk = (dir) =>
    readdirSync(new URL(dir, ROOT), { withFileTypes: true }).flatMap((e) =>
      e.name === "node_modules" ? [] : e.isDirectory() ? walk(`${dir}${e.name}/`) : /\.(tsx?|css)$/.test(e.name) ? [`${dir}${e.name}`] : [],
    );
  const files = ["ui/src/", "doc-composites/src/", "docs/src/", "storybook/stories/", "cli/templates/"].flatMap(walk);
  const out = files.flatMap((f) => trackingOutOfRange(readFileSync(new URL(f, ROOT), "utf8")).map((x) => `${f}:${x.line} ${x.em}`));
  assert.deepEqual(out, []);
});

// ---------- Decision 7: dense data keeps 12px text ----------

test("dense data keeps 12px labels and captions, the smallest step, and the reasons say why", () => {
  const s = loadScheme("dense-data");
  const sizes = Object.keys(s.tokens.semantic.type).map((role) => px(light(s, `type.${role}.font-size`)));
  assert.equal(Math.min(...sizes), 12);
  assert.equal(px(light(s, "type.label.font-size")), 12);
  assert.equal(px(light(s, "type.caption.font-size")), 12);
  // The face's x-height, recorded from its metrics: 12px keeps it over 6px, 11px would not.
  const ratio = s.tokens.primitive.font.family["ibm-plex-sans"].$extensions["open-ds"].x_height;
  assert.equal(ratio, 0.516);
  assert.ok(12 * ratio >= 6 && 11 * ratio < 6);
  const trace = traceScheme(s, g);
  for (const t of ["type.label.font-size", "type.caption.font-size"]) {
    const r = reasonOf(traceToken(trace, t));
    assert.equal(r.kind, "own", t);
    assert.match(r.why, /x-height/, t);
    assert.match(r.why, /12px/, t);
  }
  assert.match(reasonOf(traceToken(trace, "type.label.font-size")).why, /many records at a short reading distance/);
});
