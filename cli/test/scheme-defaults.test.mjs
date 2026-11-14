// A scheme stores only the component values it decides (OD-291).
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme, schemeIds, storedScheme } from "../src/schemes.mjs";
import { withDefaults, withoutDefaults } from "../src/scheme-defaults.mjs";
import { withGenerated, withoutGenerated } from "../src/scheme-generated.mjs";
import { withTypeAndSpace, withoutTypeAndSpace } from "../src/type-space-generated.mjs";

const roots = assetRoots();
const g = grammar(roots);
const questionOptions = (id) =>
  g.scopes.flatMap((s) => s.questions).find((q) => q.id === id).options.map((o) => o.id);

test("a stored scheme holds no component value equal to the grammar's default", () => {
  for (const id of schemeIds(roots)) {
    const stored = storedScheme(id, roots);
    assert.equal(JSON.stringify(withoutDefaults(stored, g)), JSON.stringify(stored), id);
  }
});

test("loading fills every component key, and saving gives back the same file", () => {
  for (const id of schemeIds(roots)) {
    const full = loadScheme(id, roots);
    const stored = storedScheme(id, roots);
    // The file also leaves out the generated scales and spacing steps (OD-292).
    assert.equal(JSON.stringify(withoutTypeAndSpace(withoutGenerated(withoutDefaults(full, g)))), JSON.stringify(stored), id);
    assert.equal(JSON.stringify(withTypeAndSpace(withGenerated(withDefaults(stored, g)))), JSON.stringify(full), id);
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

test("a key an answer creates is filled only where the scheme gives that answer", () => {
  const key = g.component_keys.find((k) => k.created_by);
  const path = key.id.split("/");
  const scheme = (option) => ({ id: "x", answers: [{ question: key.created_by.question, option }], tokens: { component: {} } });
  const at = (s) => path.reduce((node, k) => node?.[k], s.tokens.component);
  const [made] = key.created_by.options;
  const other = questionOptions(key.created_by.question).find((o) => !key.created_by.options.includes(o));
  assert.deepEqual(at(withDefaults(scheme(made), g)), { $value: `{${key.default}}`, $description: key.description });
  assert.equal(at(withDefaults(scheme(other), g)), undefined);
  assert.equal(at(withDefaults({ id: "x", tokens: { component: {} } }, g)), undefined, "no answer creates nothing");
  // Saving leaves out the fill, as it does for any key.
  assert.equal(at(withoutDefaults(withDefaults(scheme(made), g), g)), undefined);
});
