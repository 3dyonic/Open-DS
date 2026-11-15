// The grammar's component defaults, built as each scheme, keep the component rules the real schemes keep.
// Today's gaps are listed by name in the grammar scope: a new one fails, and a listed one that holds fails.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { gapId } from "../../cli/src/decision-graph.mjs";
import { grammar, loadScheme } from "../../cli/src/schemes.mjs";
import { SCHEMES, connectionsGate, gapScopes, grammarDefaultGaps, inGrammarScope } from "../checks.mjs";

const g = grammar();
const schemes = SCHEMES.map((id) => loadScheme(id));
const listed = JSON.parse(readFileSync(new URL("../connections-baseline.json", import.meta.url), "utf8"));
const baseline = { ...listed, failures: listed.failures.filter((item) => inGrammarScope(g, item)) };
const failuresOf = (grammarFixture) =>
  grammarDefaultGaps(grammarFixture, schemes).gaps.map((x) => ({ id: gapId(x.item), item: x.item, scopes: gapScopes(grammarFixture, x.item), says: x.says }));
const gate = (failures) => connectionsGate(failures, baseline, (item) => gapScopes(g, item));
const fixtureWith = (id, fields) => {
  const fixture = structuredClone(g);
  Object.assign(fixture.component_keys.find((k) => k.id === id), fields);
  return fixture;
};

test("the baseline lists exactly today's default gaps, in the grammar scope, which is not strict", () => {
  const failures = failuresOf(g);
  assert.deepEqual(gate(failures), { added: [], fixed: [], strict: [] });
  assert.deepEqual(baseline.failures.map(gapId).sort(), failures.map((f) => f.id).sort());
  assert.equal(failures.length, 14);
  assert.ok(failures.every((f) => f.item.scheme === "grammar" && f.item.rule === "default-taken-by-no-scheme"));
  assert.ok(failures.every((f) => f.scopes.length === 1 && f.scopes[0] === "grammar"));
  assert.ok(!listed.strict.includes("grammar"));
  const kinds = (re) => failures.filter((f) => re.test(f.item.tokens[0])).length;
  assert.deepEqual([kinds(/^badge\/.*\/label$/), kinds(/destructive-highlight$/), kinds(/focus-ring-invalid$/), kinds(/radius$/)], [4, 2, 5, 3]);
});

test("a default no scheme takes that a scheme now takes is a listed gap that holds: take it out", () => {
  // Every scheme stores this exact label today, so with this default each scheme takes it.
  const fixture = fixtureWith("badge/success/label", { default: "color.text.success-on-light", on: "color.status.success.subtle" });
  const result = gate(failuresOf(fixture));
  assert.deepEqual(result.fixed, ["grammar default-taken-by-no-scheme badge/success/label"]);
  assert.deepEqual(result.added, []);
});

test("a default that names its fill keeps the contrast of its grammar pair, and a new failing default fails", () => {
  // A floor no colour pair reaches: the label's pair on its fill fails in every scheme.
  const fixture = fixtureWith("badge/success/label", { default: "color.text.success-on-light", on: "color.status.success.subtle" });
  fixture.semantics.keys.find((k) => k.id === "color.text.success-on-light").pairs.contrast = 22;
  const added = gate(failuresOf(fixture)).added;
  assert.deepEqual(added.map((f) => f.id), SCHEMES.map((id) => `${id} default-keeps-contrast badge/success/label`));
  assert.match(added[0].says, /on color\.status\.success\.subtle is [\d.]+:1, needs 22:1$/);
});

test("a default that names a fill its value has no grammar pair on fails", () => {
  // The badge's own mark on its tint is not a pair the grammar names.
  const fixture = fixtureWith("badge/success/label", { on: "color.status.success.subtle" });
  const added = gate(failuresOf(fixture)).added;
  assert.deepEqual(added.map((f) => f.id), SCHEMES.map((id) => `${id} default-keeps-contrast badge/success/label`));
  assert.equal(added[0].says, "reads color.status.success.@ on color.status.success.subtle, and the grammar pairs no contrast for them");
});

test("a default that reads a primitive fails; the circle and capsule shapes may", () => {
  // radius.4 is a primitive step in some schemes only; no scheme stores it as its button corner.
  const reads = (added) => added.filter((f) => f.item.rule === "default-reads-a-decision").map((f) => f.id);
  const added = gate(failuresOf(fixtureWith("button/radius", { default: "radius.4" }))).added;
  const withStep = schemes.filter((s) => "4" in s.tokens.primitive.radius).map((s) => s.id);
  assert.ok(withStep.length > 0);
  assert.deepEqual(reads(added), withStep.map((id) => `${id} default-reads-a-decision button/radius`));
  assert.deepEqual(reads(gate(failuresOf(fixtureWith("button/radius", { default: "radius.pill" }))).added), []);
});

test("a default that does not resolve in a scheme fails there, by name, in the grammar scope", () => {
  // radius.4 is a primitive step in some schemes only: where a scheme lacks it, the default resolves to nothing.
  const fails = (added) => added.filter((f) => f.item.rule === "default-resolves");
  const added = fails(gate(failuresOf(fixtureWith("button/radius", { default: "radius.4" }))).added);
  const without = schemes.filter((s) => !("4" in s.tokens.primitive.radius)).map((s) => s.id);
  assert.ok(without.length > 0);
  assert.deepEqual(added.map((f) => f.id), without.map((id) => `${id} default-resolves button/radius`));
  assert.match(added[0].says, /^[a-z-]+\/[a-z-]+\/light: button\.radius → radius\.4 does not exist$/);
  assert.ok(added.every((f) => f.scopes.length === 1 && f.scopes[0] === "grammar"));
  // Today every default resolves in every scheme.
  assert.deepEqual(fails(failuresOf(g)), []);
});
