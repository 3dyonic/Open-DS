import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { SHADCN } from "../build.mjs";
import { grammar, loadScheme } from "../../cli/src/schemes.mjs";
import { keysOf } from "../../cli/src/scheme-defaults.mjs";

const here = join(import.meta.dirname, "..");
const root = join(here, "..");
const read = (...p) => readFileSync(join(here, "dist", ...p), "utf8");
const index = JSON.parse(read("index.json"));
const g = grammar();
const cssName = (k) =>
  `--${k.id
    .split("/")
    .filter((p) => p !== "@")
    .join("-")}:`;
// The keys a scheme ships: every grammar key its answers create.
const keysIn = (id) => keysOf(g, loadScheme(id)).map(cssName);

test("all five schemes are built", () => {
  assert.deepEqual(index.schemes.map((s) => s.id).sort(), [
    "accessible-first",
    "brand-expressive",
    "content-first",
    "dense-data",
    "multi-brand",
  ]);
});

test("every scheme ships light and dark for every brand", () => {
  for (const s of index.schemes) {
    for (const b of s.brands) {
      for (const m of ["light", "dark"])
        assert.ok(
          s.themes.some((t) => t.brand === b.id && t.mode === m),
          `${s.id} ${b.id} ${m}`,
        );
    }
    const css = read(s.id, "tokens.css");
    assert.match(css, /:root/);
    assert.match(css, /\.dark/);
  }
});

test("every theme block defines every component key its answers create, and no other", () => {
  for (const s of index.schemes) {
    const keys = keysIn(s.id);
    const absent = g.component_keys.map(cssName).filter((k) => !keys.includes(k));
    const blocks = read(s.id, "tokens.css")
      .split(/\n}\n/)
      .filter((b) => b.includes("{"));
    assert.equal(blocks.length, s.themes.length, `${s.id} has one block per theme`);
    for (const block of blocks) {
      for (const k of keys) assert.ok(block.includes(k), `${s.id} misses ${k}`);
      for (const k of absent) assert.ok(!block.includes(k), `${s.id} ships ${k}, which its answers do not create`);
    }
  }
});

test("a key an answer creates ships only where the scheme gives that answer", () => {
  const created = g.component_keys.filter((k) => k.created_by);
  assert.ok(created.length, "the grammar has a key that an answer creates");
  for (const k of created) {
    const name = cssName(k);
    for (const s of index.schemes) {
      const answer = loadScheme(s.id).answers.find((a) => a.question === k.created_by.question)?.option;
      const css = read(s.id, "tokens.css");
      if (k.created_by.options.includes(answer)) assert.ok(css.includes(name), `${s.id} answers ${answer} but misses ${name}`);
      else assert.ok(!css.includes(name), `${s.id} answers ${answer} but ships ${name}`);
    }
  }
});

test("theme.css maps every shadcn variable onto a semantic", () => {
  for (const s of index.schemes) {
    const css = read(s.id, "theme.css");
    const tokens = read(s.id, "tokens.css");
    for (const [k, v] of Object.entries(SHADCN)) {
      assert.ok(css.includes(`--${k}: var(--${v});`), `${s.id} ${k}`);
      assert.ok(tokens.includes(`--${v}:`), `${s.id}: --${k} points at --${v}, which tokens.css does not define`);
    }
    for (const [, name] of css.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
      const own = css.includes(`${name}:`) && !css.includes(`${name}: var(${name})`);
      assert.ok(own || tokens.includes(`${name}:`), `${s.id}: theme.css reads undefined ${name}`);
    }
    assert.match(css, /@theme inline/);
  }
});

test("multi-brand is a real multi-brand setup", () => {
  const s = index.schemes.find((x) => x.id === "multi-brand");
  assert.deepEqual(
    s.brands.map((b) => b.id),
    ["aster", "birch", "coral"],
  );
  const css = read("multi-brand", "tokens.css");
  for (const b of ["aster", "birch", "coral"]) {
    assert.ok(css.includes(`[data-brand="${b}"]`), `${b} light selector`);
    assert.ok(css.includes(`.dark[data-brand="${b}"]`), `${b} dark selector`);
    assert.ok(css.includes(`[data-brand="${b}"] .dark`), `${b} brand above dark`);
  }
  const brandColor = (theme) => JSON.parse(read("multi-brand", `${theme}.tokens.json`)).color.action.primary["@"];
  assert.notEqual(brandColor("aster-light"), brandColor("birch-light"));
  assert.notEqual(brandColor("birch-light"), brandColor("coral-light"));
});

test("dark changes color decisions and keeps layout decisions", () => {
  const light = JSON.parse(read("dense-data", "light.tokens.json"));
  const dark = JSON.parse(read("dense-data", "dark.tokens.json"));
  assert.notEqual(light.color.surface.canvas, dark.color.surface.canvas);
  assert.equal(light.space.gap.default, dark.space.gap.default);
  assert.equal(light.type.body["font-size"], dark.type.body["font-size"]);
});

test("scoped CSS is scoped to the scheme", () => {
  for (const s of index.schemes) {
    const css = read(s.id, "tokens.scoped.css");
    assert.ok(css.includes(`[data-scheme="${s.id}"]`));
    assert.ok(!/^:root/m.test(css), `${s.id} scoped css must not set :root`);
  }
});

test("voice tokens ship as content.json and stay out of the CSS", () => {
  for (const s of index.schemes) {
    const content = JSON.parse(read(s.id, "content.json")).content;
    assert.equal(content.action.commit.$type, "string");
    // Voice words never become CSS variables (content-first's own theme tokens are a different thing).
    assert.ok(!/--content-(?!first-theme)/.test(read(s.id, "tokens.css")));
  }
});

test("only semantic and component keys ship as CSS variables, with primitives and themes resolved", () => {
  for (const s of index.schemes) {
    const css = read(s.id, "tokens.css");
    const name = s.brands.length > 1 ? s.brands[0].id : s.id;
    assert.ok(!new RegExp(`--${name}-theme-`).test(css), `${s.id}: no theme variables`);
    assert.ok(!/--color-[a-z]+-(light|dark)-\d+/.test(css), `${s.id}: no color primitive variables`);
    assert.ok(!/var\(--color-[a-z]+-(light|dark)-/.test(css), `${s.id}: no reference to a primitive`);
    assert.match(css, /--color-action-primary: #[0-9A-F]{6}/i, `${s.id}: a semantic resolves to its value`);
    assert.ok(
      css.includes("--button-primary-background: var(--color-action-primary)"),
      `${s.id}: a component reads a semantic`,
    );
    assert.ok(!/--[\w-]*@/.test(css), `${s.id}: no @ in names`);
  }
});

test("each theme decides its own base: primitives are steps only, themes and semantics share paths", () => {
  for (const s of index.schemes) {
    const scheme = loadScheme(s.id);
    for (const [hue, group] of Object.entries(scheme.tokens.primitive.color))
      assert.ok(!group["@"], `${s.id}: color.${hue} has a base; bases belong to themes`);
    for (const [id, b] of Object.entries(scheme.tokens.brands)) {
      const light = b.theme.light.color.action.primary;
      const dark = b.theme.dark.color.action.primary;
      assert.ok(light["@"] && light.hover, `${s.id} ${id}: light action.primary has @ and hover`);
      assert.ok(dark["@"] && dark.hover, `${s.id} ${id}: dark action.primary has @ and hover`);
    }
    assert.equal(scheme.tokens.semantic.color.action.primary["@"].$value, "{theme.color.action.primary.@}");
  }
});
