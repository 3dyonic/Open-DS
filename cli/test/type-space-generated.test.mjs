// The loader generates type and spacing values from their records (OD-301). A change to a record moves
// exactly the values that record generates, and the tokens that read them: nothing else.
import { test } from "node:test";
import assert from "node:assert/strict";
import { flatten, resolve } from "../src/scheme-checks.mjs";
import { assetRoots, grammar, storedScheme } from "../src/schemes.mjs";
import { withDefaults } from "../src/scheme-defaults.mjs";
import { themeTokens } from "../src/tokens.mjs";
import { generatedProblems, withTypeAndSpace, withoutTypeAndSpace } from "../src/type-space-generated.mjs";

const roots = assetRoots();
const g = grammar(roots);
const load = (stored) => withTypeAndSpace(withDefaults(stored, g));
const GENERATED = /^(type\.[a-z-]+\.(font-size|line-height)|space\.(gap|inset)\.[a-z-]+|size\.(control\.[a-z]+|row))$/;
const PRIMITIVE = /^(font\.(size|line-height|line-box)|space|size)\.[0-9_]+$/;

/** Every token of every brand and mode: { "<brand>/<mode> <path>": { value, chain } }. */
function resolvedAll(scheme) {
  const out = {};
  for (const brand of Object.keys(scheme.tokens.brands))
    for (const mode of ["light", "dark"]) {
      const all = flatten(themeTokens({ id: scheme.id, tokens: scheme.tokens }, brand, mode));
      for (const path of Object.keys(all)) {
        const chain = [];
        for (let p = path, hops = 0; p && hops < 20; hops++) {
          chain.push(p);
          p = /^\{([^}]+)\}$/.exec(String(all[p]?.$value ?? ""))?.[1];
        }
        out[`${brand}/${mode} ${path}`] = { value: resolve(all, path).value, chain };
      }
    }
  return out;
}

/**
 * Change one record or answer of a scheme and return what moves: the generated values whose resolved
 * value changed, by path, and every other token that changed. change gets the semantic tokens and the
 * scheme.
 */
function moves(id, change) {
  const stored = storedScheme(id, roots);
  const changed = structuredClone(stored);
  change(changed.tokens.semantic, changed);
  const before = resolvedAll(load(stored));
  const after = resolvedAll(load(changed));
  const generated = new Set();
  const others = [];
  for (const [key, b] of Object.entries(before)) {
    const a = after[key];
    if (!a || JSON.stringify(a.value) === JSON.stringify(b.value)) continue;
    const path = key.split(" ")[1];
    if (GENERATED.test(path)) generated.add(path);
    else others.push({ path, chain: a.chain });
  }
  return { generated: [...generated].sort(), others };
}

/** Every other token that moved reads a moved generated value, and no option changed its value. */
function onlyReaders({ generated, others }) {
  for (const o of others) {
    assert.ok(!PRIMITIVE.test(o.path), `the option ${o.path} changed its value`);
    assert.ok(
      o.chain.some((p) => generated.includes(p)),
      `${o.path} moved, but it reads none of ${generated.join(", ")} (it reads ${o.chain.join(" → ")})`,
    );
  }
}

const type = (s) => s.type.$extensions["open-ds"];
const space = (s) => s.space.$extensions["open-ds"];
const size = (s) => s.size.$extensions["open-ds"];

test("a new type base moves every size and the line boxes it changes, and nothing else", () => {
  const m = moves("dense-data", (s) => (type(s).base = 16));
  // caption: 16 / 1.2 = 13.3 → 13px, 13 × 1.3 = 16.9 → 16px on the 2px grid: its line box stays.
  assert.deepEqual(m.generated, [
    "type.body.font-size",
    "type.body.line-height",
    "type.caption.font-size",
    "type.data.font-size",
    "type.data.line-height",
    "type.display.font-size",
    "type.heading.font-size",
    "type.label.font-size",
    "type.title.font-size",
  ]);
  onlyReaders(m);
});

test("a new ratio moves every size off step 0, and no line height ratio", () => {
  const m = moves("content-first", (s) => (type(s).ratio = 1.2));
  assert.deepEqual(m.generated, [
    "type.caption.font-size",
    "type.display.font-size",
    "type.heading.font-size",
    "type.label.font-size",
    "type.title.font-size",
  ]);
  onlyReaders(m);
});

test("a new step moves that role's size only", () => {
  const m = moves("accessible-first", (s) => (type(s).steps.heading = 2));
  assert.deepEqual(m.generated, ["type.heading.font-size"]);
  onlyReaders(m);
});

test("a new multiple moves that space token only", () => {
  const m = moves("multi-brand", (s) => (space(s)["use-cases"]["gap.default"].multiple = 4));
  assert.deepEqual(m.generated, ["space.gap.default"]);
  assert.ok(m.others.length > 0, "components read space.gap.default, so some of them move");
  onlyReaders(m);
});

test("a new spacing.definition answer sets a new base and moves every gap and inset", () => {
  const m = moves("multi-brand", (_, scheme) => (scheme.answers.find((a) => a.question === "spacing.definition").option = "coarse"));
  assert.deepEqual(m.generated, [
    "space.gap.default",
    "space.gap.group",
    "space.gap.section",
    "space.gap.tight",
    "space.inset.cell-x",
    "space.inset.container",
    "space.inset.control-x",
  ]);
  onlyReaders(m);
});

test("a new control step moves compact and large; a new default moves every control height and the row", () => {
  const step = moves("brand-expressive", (s) => (size(s).step = 4));
  assert.deepEqual(step.generated, ["size.control.compact", "size.control.large"]);
  onlyReaders(step);
  const base = moves("dense-data", (s) => (size(s).default = 40));
  assert.deepEqual(base.generated, ["size.control.compact", "size.control.default", "size.control.large", "size.row"]);
  onlyReaders(base);
});

test("a value a record needs gets its option; saving leaves every generated value out", () => {
  const stored = storedScheme("brand-expressive", roots);
  const changed = structuredClone(stored);
  size(changed.tokens.semantic).step = 4;
  const loaded = load(changed);
  assert.equal(loaded.tokens.semantic.size.control.compact.$value, "{size.48}");
  assert.equal(loaded.tokens.primitive.size["48"].$value, "3rem");
  // The file as saveScheme writes it holds the records and descriptions, not the values.
  assert.deepEqual(withoutTypeAndSpace(load(stored)).tokens.semantic, withDefaults(stored, g).tokens.semantic);
});

test("a value set by hand next to its record is a problem; a stored file with none has none", () => {
  for (const id of ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"]) {
    const stored = storedScheme(id, roots);
    assert.deepEqual(generatedProblems(load(stored), stored), [], id);
  }
  const stored = storedScheme("dense-data", roots);
  stored.tokens.semantic.type.body["font-size"] = { $type: "dimension", $value: "{font.size.14}" };
  stored.tokens.semantic.space.gap.tight.$value = "{space.8}";
  const problems = generatedProblems(load(stored), stored);
  assert.ok(problems.some((p) => p.startsWith("dense-data: type.body.font-size is set by hand")), problems.join("; "));
  assert.ok(problems.some((p) => p === "dense-data: space.gap.tight is {space.8}, and its record gives {space.4}"), problems.join("; "));
});
