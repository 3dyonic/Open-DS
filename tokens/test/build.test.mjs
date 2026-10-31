import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { SHADCN } from "../build.mjs";

const here = join(import.meta.dirname, "..");
const root = join(here, "..");
const read = (...p) => readFileSync(join(here, "dist", ...p), "utf8");
const index = JSON.parse(read("index.json"));
const keys = JSON.parse(readFileSync(join(root, "schemes", "grammar.json"), "utf8")).component_keys.map(
  (k) => `--${k.id.replaceAll("/", "-")}:`,
);

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

test("every theme block defines every component key", () => {
  for (const s of index.schemes) {
    const blocks = read(s.id, "tokens.css")
      .split(/\n}\n/)
      .filter((b) => b.includes("{"));
    assert.equal(blocks.length, s.themes.length, `${s.id} has one block per theme`);
    for (const block of blocks) for (const k of keys) assert.ok(block.includes(k), `${s.id} misses ${k}`);
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
  const brandColor = (theme) => JSON.parse(read("multi-brand", `${theme}.tokens.json`)).color.action.primary;
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

test("colour primitives are hue, mode and step, and semantics reach them through the brand's theme", () => {
  for (const s of index.schemes) {
    const css = read(s.id, "tokens.css");
    assert.match(css, /--color-[a-z]+-light-\d+: #[0-9A-F]{6}/i, `${s.id}: a light ramp step`);
    assert.match(css, /--color-[a-z]+-dark-\d+: #[0-9A-F]{6}/i, `${s.id}: a dark ramp step`);
    assert.match(css, /--color-[a-z]+: var\(--color-[a-z]+-light-\d+\)/, `${s.id}: an @ base value`);
    const name = s.brands.length > 1 ? s.brands[0].id : s.id;
    assert.ok(
      css.includes(`--color-action-primary: var(--${name}-theme-light-color-action-primary)`),
      `${s.id}: light semantic → theme`,
    );
    assert.ok(
      css.includes(`--color-action-primary: var(--${name}-theme-dark-color-action-primary)`),
      `${s.id}: dark semantic → theme`,
    );
    assert.ok(!/--[\w-]*@/.test(css), `${s.id}: no @ in names`);
  }
});

test("every hue's @ base value is picked by a brand theme", () => {
  for (const s of index.schemes) {
    const scheme = JSON.parse(readFileSync(new URL(`../../schemes/${s.id}.json`, import.meta.url), "utf8"));
    const picks = new Set(
      Object.values(scheme.tokens.brands).flatMap((b) =>
        ["base", "light", "dark"].flatMap((part) => Object.values(b.theme[part] ?? {}).map((t) => t.$value)),
      ),
    );
    for (const [hue, group] of Object.entries(scheme.tokens.primitive.color)) {
      if (!group["@"]) continue;
      assert.ok(picks.has(`{color.${hue}.@}`), `${s.id}: color.${hue}.@ is defined but no theme picks it`);
      assert.ok(
        ![...picks].includes(group["@"].$value),
        `${s.id}: a theme picks ${group["@"].$value}; pick {color.${hue}.@} instead`,
      );
    }
  }
});
