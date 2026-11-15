// The connections gate: today's gaps are listed by name, a new gap fails, a fixed gap that is still
// listed fails, and a strict scope fails on any gap, listed or not.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { connectionGaps, evaluateConnections, gapId, gapItem } from "../../cli/src/decision-graph.mjs";
import { grammar, loadScheme } from "../../cli/src/schemes.mjs";
import { SCHEMES, connectionsGate, gapScopes, inGrammarScope } from "../checks.mjs";

const g = grammar();
const listed = JSON.parse(readFileSync(new URL("../connections-baseline.json", import.meta.url), "utf8"));
// The grammar scope's items belong to grammar-defaults-hold (grammar-defaults.test.mjs).
const baseline = { ...listed, failures: listed.failures.filter((item) => !inGrammarScope(g, item)) };
const failuresOf = (id, scheme = loadScheme(id)) =>
  connectionGaps(evaluateConnections(scheme, g)).map((x) => {
    const item = gapItem(id, x);
    return { id: gapId(item), item, scopes: gapScopes(g, item), says: x.says };
  });
const gate = (failures, base = baseline) => connectionsGate(failures, base, (item) => gapScopes(g, item));
const today = () => SCHEMES.flatMap((id) => failuresOf(id));

test("the baseline lists exactly today's gaps, by name, and no strict scope has an entry", () => {
  const failures = today();
  assert.deepEqual(gate(failures), { added: [], fixed: [], strict: [] });
  assert.deepEqual(baseline.failures.map(gapId).sort(), failures.map((f) => f.id).sort());
  assert.deepEqual(baseline.strict, ["spacing", "component-spacing-map", "elevation", "motion", "accessibility"]);
});

test("a scope comes from the grammar's owns lists; a label takes its connection's scope", () => {
  assert.deepEqual(gapScopes(g, { scheme: "x", rule: "@", tokens: ["color.action.secondary"] }), ["color"]);
  assert.deepEqual(gapScopes(g, { scheme: "x", connection: "line-kinds-apart", tokens: ["tight lines", "snug lines"] }), ["typography"]);
  assert.deepEqual(gapScopes(g, { scheme: "x", connection: "icon-matches-label", tokens: ["size.icon", "type.label"] }), ["iconography", "typography"]);
  assert.deepEqual(gapScopes(g, { scheme: "x", connection: "map-from-rhythm", tokens: ["component-spacing-map.x2"] }), ["component-spacing-map"]);
  assert.deepEqual(gapScopes(g, { scheme: "x", rule: "focus-gap", tokens: ["focus.ring.offset"] }), ["accessibility"]);
});

test("a new gap fails, and a listed gap that holds now fails until it is taken out", () => {
  const failures = today();
  const planted = { id: "dense-data @ color.status.info", scopes: ["color"], says: "planted" };
  assert.deepEqual(gate([...failures, planted]).added.map((f) => f.id), [planted.id]);
  const [fixed, ...rest] = failures;
  assert.deepEqual(gate(rest).fixed, [fixed.id]);
});

test("a planted rule break in a strict scope fails, even when the baseline lists it", () => {
  // A 1px focus offset breaks the focus gap's fixed 2px rule: accessibility is strict.
  const scheme = structuredClone(loadScheme("dense-data"));
  scheme.tokens.semantic.focus.ring.offset.$value = "{border-width.1}";
  const failures = [...SCHEMES.filter((id) => id !== "dense-data").flatMap((id) => failuresOf(id)), ...failuresOf("dense-data", scheme)];
  const planted = failures.filter((f) => f.scopes.includes("accessibility"));
  assert.deepEqual(planted.map((f) => f.id), ["dense-data focus-gap focus.ring.offset"]);
  assert.deepEqual(gate(failures).strict, [planted[0].id]);
  assert.deepEqual(gate(failures).added, [], "a strict gap is reported as strict, not as new");
  const listed = { ...baseline, failures: [...baseline.failures, planted[0].item] };
  assert.deepEqual(gate(failures, listed).strict, [planted[0].id], "listing a strict gap does not pass it");
});
