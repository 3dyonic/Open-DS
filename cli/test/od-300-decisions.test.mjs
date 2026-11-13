// OD-300: the round 1 and 2 decisions the owner accepted, asserted per scheme on the values they set.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { aliasChain, tokenIndex } from "../src/lands.mjs";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { checkRelations } from "../src/shape-elevation.mjs";

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
