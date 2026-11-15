// A scheme stores only the component values it decides (OD-291).
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme, schemeIds, storedScheme } from "../src/schemes.mjs";
import { withDefaults, withoutDefaults } from "../src/scheme-defaults.mjs";
import { withGenerated, withoutGenerated } from "../src/scheme-generated.mjs";
import { withTypeAndSpace, withoutTypeAndSpace } from "../src/type-space-generated.mjs";
import { pickByTone } from "../src/tokens.mjs";

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

test("the shared z-index steps join every scheme on load, and no scheme stores them", () => {
  const shared = g.shared_primitives.tokens["z-index"];
  for (const id of schemeIds(roots)) {
    assert.equal(storedScheme(id, roots).tokens.primitive["z-index"], undefined, id);
    assert.deepEqual(loadScheme(id, roots).tokens.primitive["z-index"], shared, id);
  }
  // A group the scheme stores stays, so a check can name it; saving leaves out only the shared copy.
  const own = { "100": { $type: "number", $value: 5 } };
  const scheme = { id: "x", tokens: { primitive: { "z-index": own }, component: {} } };
  assert.deepEqual(withDefaults(scheme, g).tokens.primitive["z-index"], own);
  const plain = { id: "x", tokens: { primitive: {}, component: {} } };
  assert.deepEqual(withoutDefaults(withDefaults(plain, g), g).tokens.primitive, {});
});

// A grammar default can name the fill it sits on (on), as a scheme's own token does. The fixture grammar
// gives one key a fill; the real grammar gives none.
test("a default that names its fill carries it: the build picks its text by the fill's tone, and a token equal to it is not stored", () => {
  const fixture = structuredClone(g);
  const key = fixture.component_keys.find((k) => k.id === "badge/success/label");
  Object.assign(key, { default: "color.text.success-on-light", on: "color.status.success.subtle" });
  const label = (s) => s.tokens.component.badge?.success?.label;
  const fill = { $value: "{color.text.success-on-light}", $description: key.description, $extensions: { "open-ds": { on: "color.status.success.subtle" } } };

  const filled = withDefaults({ id: "x", tokens: { component: {} } }, fixture);
  assert.deepEqual(label(filled), fill);
  assert.equal(label(withoutDefaults(filled, fixture)), undefined, "the fill is not stored");

  // On a dark fill, the build turns the default's -on-light into -on-dark.
  const theme = { light: { color: { status: { success: { subtle: { $value: "{x}", $extensions: { "open-ds": { tone: "dark" } } } } } } } };
  assert.equal(pickByTone(filled.tokens.component, theme, "light").badge.success.label.$value, "{color.text.success-on-dark}");

  // Every scheme stores this exact token today: with the fixture it equals the fill, so it leaves the file.
  for (const id of schemeIds(roots)) {
    const stored = storedScheme(id, roots);
    assert.deepEqual(label(stored), fill, id);
    assert.equal(label(withoutDefaults(stored, fixture)), undefined, id);
    assert.deepEqual(label(withoutDefaults(stored, g)), fill, `${id}: the real grammar keeps it`);
  }
  // The same value without the fill is another choice, so it stays.
  const plain = { $value: fill.$value, $description: fill.$description };
  const own = { id: "x", tokens: { component: { badge: { success: { label: plain } } } } };
  assert.deepEqual(label(withoutDefaults(own, fixture)), plain);
});
