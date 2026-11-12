// A scheme stores only the component values it decides (OD-291).
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme, schemeIds, storedScheme } from "../src/schemes.mjs";
import { withDefaults, withoutDefaults } from "../src/scheme-defaults.mjs";
import { withTypeAndSpace, withoutTypeAndSpace } from "../src/type-space-generated.mjs";

const roots = assetRoots();
const g = grammar(roots);

test("a stored scheme holds no component value equal to the grammar's default", () => {
  for (const id of schemeIds(roots)) {
    const stored = storedScheme(id, roots);
    assert.equal(JSON.stringify(withoutDefaults(stored, g)), JSON.stringify(stored), id);
  }
});

test("loading fills every component key and generated value, and saving gives back the same file", () => {
  for (const id of schemeIds(roots)) {
    const full = loadScheme(id, roots);
    const stored = storedScheme(id, roots);
    assert.equal(JSON.stringify(withoutTypeAndSpace(withoutDefaults(full, g))), JSON.stringify(stored), id);
    assert.equal(JSON.stringify(withTypeAndSpace(withDefaults(stored, g))), JSON.stringify(full), id);
  }
});

test("a key the scheme decides stays in the file; a default comes from the grammar", () => {
  const key = g.component_keys.find((k) => k.id === "button/radius");
  const scheme = { id: "x", tokens: { component: { button: { radius: { $value: "{radius.pill}", $description: key.description } } } } };
  const stored = withoutDefaults(withDefaults(scheme, g), g);
  assert.deepEqual(stored.tokens.component.button.radius, { $value: "{radius.pill}", $description: key.description });
  assert.equal(stored.tokens.component.input, undefined);
  assert.equal(withDefaults(stored, g).tokens.component.input.radius.$value, `{${g.component_keys.find((k) => k.id === "input/radius").default}}`);
});
