// The neutral 150 step and the floating surface: menus, dialogs and sheets read color.surface.floating.
// In dark it sits one step above raised, so text, dividers and the ring on it keep their floors.
import { test } from "node:test";
import assert from "node:assert/strict";
import { contrast, lch, luminance, readableStepBetween, stepBetween } from "../src/ramps.mjs";
import { stepsAnswer } from "../src/color-steps.mjs";
import { aliasChain, tokenIndex } from "../src/lands.mjs";
import { floatingChecks, MUTED_FLOOR, LINE_FLOOR, textFloorOf } from "../src/quality/relations.mjs";
import { DEFAULT_PARAMS } from "../src/quality/params.mjs";
import { checkRelations } from "../src/shape-elevation.mjs";
import { assetRoots, grammar, loadScheme, schemeIds } from "../src/schemes.mjs";

const roots = assetRoots();
const g = grammar(roots);
const ids = schemeIds(roots);
const F = "color.surface.floating";
const z = (h) => Math.log(luminance(h) + 0.05);
const valuesOf = (row) => Object.fromEntries(Object.entries(row).map(([st, t]) => [st, t.$value]));
const hex = (index, path) => String(aliasChain(index, path).value).slice(0, 7);

test("a step between two steps sits between them, even in contrast at easing 0", () => {
  const row = { 100: "#222222", 200: "#333333" };
  const mid = stepBetween(row, "150", 0);
  assert.ok(luminance(mid) > luminance(row[100]) && luminance(mid) < luminance(row[200]));
  // Linear easing puts 150 halfway between its neighbours in ln(luminance + 0.05).
  assert.ok(Math.abs(z(mid) - (z(row[100]) + z(row[200])) / 2) < 0.01);
  assert.equal(contrast(mid, row[100]).toFixed(2), contrast(mid, row[200]).toFixed(2));
  // Between two pure grays the step stays pure.
  assert.equal(new Set([mid.slice(1, 3), mid.slice(3, 5), mid.slice(5, 7)]).size, 1);
  assert.deepEqual(row, { 100: "#222222", 200: "#333333" }, "the neighbours keep their values");
});

test("a stronger easing moves the step toward the lower neighbour", () => {
  const row = { 100: "#262D38", 200: "#3D4655" };
  assert.ok(luminance(stepBetween(row, "150", 0.6)) < luminance(stepBetween(row, "150", 0)));
});

test("a step with no neighbour above or below is refused", () => {
  assert.throws(() => stepBetween({ 100: "#222222" }, "150", 0), /needs a step below and a step above/);
});

test("a readable step moves only as far as its text needs", () => {
  const row = { 100: "#2E2A24", 200: "#4A4339" };
  const plain = stepBetween(row, "150", 0.25);
  const text = "#A39A8B";
  assert.ok(contrast(text, plain) < 4.5, "the plain step is too light for this text");
  const { value, adjust } = readableStepBetween(row, "150", 0.25, [{ color: text, need: 4.5 }]);
  assert.ok(contrast(text, value) >= 4.5);
  assert.ok(adjust.L < 0 && adjust.L >= -0.02, `a small darker move, got ${adjust.L}`);
  assert.deepEqual(readableStepBetween(row, "150", 0.25, []), { value: plain, adjust: null });
});

test("every neutral ramp stores the 150 step its curve gives, light and dark", () => {
  assert.ok(g.semantics.neutral.steps.includes("150"));
  for (const id of ids) {
    const s = loadScheme(id, roots);
    const { easing } = stepsAnswer(s);
    for (const [brand, b] of Object.entries(s.tokens.brands)) {
      const gray = b.theme.neutral.gray;
      const dark = tokenIndex(s, { brand, mode: "dark" });
      // Muted text must read on a dark floating layer that sits on 150.
      const onFloating = aliasChain(dark, F).hops.includes("color.neutral.150");
      for (const mode of ["light", "dark"]) {
        const row = valuesOf(s.tokens.primitive.color[gray][mode]);
        const texts = mode === "dark" && onFloating ? [{ color: hex(dark, "color.text.muted"), need: MUTED_FLOOR + DEFAULT_PARAMS.relations.contrastMargin }] : [];
        assert.equal(row["150"], readableStepBetween(row, "150", easing, texts).value, `${id} ${gray}.${mode}.150`);
        assert.ok(luminance(row[100]) !== luminance(row[200]) && (luminance(row["150"]) - luminance(row[100])) * (luminance(row[200]) - luminance(row["150"])) > 0, `${id} ${gray}.${mode}: 150 sits between 100 and 200`);
        assert.equal(b.theme[mode].color.neutral["150"].$value, `{color.${gray}.${mode}.150}`, `${id}/${brand} ${mode}: neutral.150`);
      }
    }
  }
});

test("every scheme defines the floating surface: white as raised in light, one step above raised in dark", () => {
  for (const id of ids) {
    const s = loadScheme(id, roots);
    assert.equal(s.tokens.semantic.color.surface.floating.$value, "{theme.color.surface.floating}", id);
    for (const brand of Object.keys(s.tokens.brands)) {
      const light = tokenIndex(s, { brand, mode: "light" });
      const dark = tokenIndex(s, { brand, mode: "dark" });
      assert.equal(hex(light, F), hex(light, "color.surface.raised"), `${id}/${brand} light`);
      assert.ok(lch(hex(dark, F))[0] > lch(hex(dark, "color.surface.raised"))[0], `${id}/${brand} dark: floating above raised`);
      for (const mode of ["light", "dark"]) {
        const why = s.tokens.brands[brand].theme[mode].color.surface.floating.$extensions["open-ds"].why;
        assert.ok(why.length > 40 && !/OD-\d+/.test(why), `${id}/${brand} ${mode}: a reason with no ticket key`);
      }
    }
  }
});

test("text, dividers and the ring on a dark floating layer keep the scheme's floors", () => {
  for (const id of ids) {
    const s = loadScheme(id, roots);
    const floor = textFloorOf(Object.fromEntries(s.answers.map((a) => [a.question, a.option])));
    for (const brand of Object.keys(s.tokens.brands)) {
      const dark = tokenIndex(s, { brand, mode: "dark" });
      const paths = [F, "color.text.primary", "color.text.secondary", "color.text.muted", "color.border.default", "color.border.raised"];
      const values = Object.fromEntries(paths.map((p) => [p, hex(dark, p)]));
      const checks = floatingChecks({ id: `${brand}-dark`, brand }, values, floor);
      assert.equal(checks.length, 5, `${id}/${brand}`);
      for (const c of checks) assert.ok(c.pass, `${id}/${brand}: ${c.says}`);
    }
  }
});

test("the floating checks fail a planted defect", () => {
  const values = {
    [F]: "#3D4655",
    "color.text.primary": "#FFFFFF",
    "color.text.secondary": "#C4CBD6",
    // Planted: muted text and the divider at the fill's own step, as on the next step without 150.
    "color.text.muted": "#969FAD",
    "color.border.default": "#3D4655",
    "color.border.raised": "#3D4655",
  };
  const failed = floatingChecks({ id: "dark", brand: "default" }, values, 4.5).filter((c) => !c.pass).map((c) => c.tokens[0]);
  assert.deepEqual(failed, ["color.text.muted", "color.border.default", "color.border.raised"]);
  // An AAA scheme holds primary text to 7:1.
  const aaa = floatingChecks({ id: "dark", brand: "default" }, { ...values, "color.text.primary": "#8A93A1" }, 7);
  assert.equal(aaa.find((c) => c.tokens[0] === "color.text.primary").pass, false);
  assert.equal(LINE_FLOOR, 1.15);
});

test("the dark depth check holds floating above raised, and fails when it is not", () => {
  for (const id of ids) {
    const s = loadScheme(id, roots);
    const depth = checkRelations(s, g).results.filter((r) => r.mode === "dark" && r.token === F);
    assert.ok(depth.length > 0 && depth.every((r) => r.holds), `${id}: ${depth.map((r) => r.says).join("; ")}`);
  }
  const s = loadScheme("dense-data", roots);
  // Planted: the floating surface on the raised step.
  s.tokens.brands.default.theme.dark.color.surface.floating.$value = s.tokens.brands.default.theme.dark.color.surface.raised.$value;
  const broken = checkRelations(s, g).results.filter((r) => r.mode === "dark" && r.token === F);
  assert.ok(broken.some((r) => !r.holds));
});

test("floating layers read the floating fill through their component keys", () => {
  const keys = [
    "overlay/background",
    "dialog/content/background",
    "alert-dialog/content/background",
    "popover/content/background",
    "hover-card/content/background",
    "context-menu/content/background",
    "context-menu/sub/content/background",
    "menubar/content/background",
    "menubar/sub/content/background",
    "navigation-menu/content/background",
    "navigation-menu/viewport/background",
    "combobox/content/background",
    "command/background",
    "sheet/content/background",
    "drawer/content/background",
    "toast/background",
  ];
  for (const id of keys) assert.equal(g.component_keys.find((k) => k.id === id)?.default, F, id);
});
