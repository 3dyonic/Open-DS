// The token map's graph (OD-274): every edge joins two nodes, every component token ends at a value,
// the theme folds into the primitive, and the map file holds each pick's answers and the scheme's
// reasons. The navigation is tested in color-map.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { tokenGraph, tokenMap, TIERS } from "../src/token-graph.mjs";
import { GRADED_STEPS } from "../src/color-steps.mjs";

const roots = assetRoots();
const g = grammar(roots);
const graphs = schemeIds(roots).flatMap((id) => {
  const scheme = loadScheme(id, roots);
  return Object.keys(scheme.tokens.brands).flatMap((brand) =>
    ["light", "dark"].map((mode) => ({
      name: `${id} ${brand} ${mode}`,
      mode,
      graph: tokenGraph({ scheme, brand, mode, grammar: g }),
    })),
  );
});
const hasEdge = (graph, from, to) => graph.edges.some((e) => e.from === from && e.to === to);

test("every edge joins two nodes of the graph, and every node has a known tier", () => {
  for (const { name, graph } of graphs) {
    const ids = new Set(graph.nodes.map((n) => n.id));
    assert.equal(ids.size, graph.nodes.length, `${name}: node ids repeat`);
    const loose = graph.edges.filter((e) => !ids.has(e.from) || !ids.has(e.to));
    assert.deepEqual(loose, [], `${name}: edges with a missing end`);
    assert.deepEqual(
      graph.nodes.filter((n) => !TIERS.includes(n.tier)).map((n) => n.id),
      [],
      `${name}: nodes outside the tiers`,
    );
    assert.deepEqual(
      graph.edges.filter((e) => Object.keys(e).some((k) => k !== "from" && k !== "to")),
      [],
      `${name}: edges with more than a from and a to`,
    );
  }
});

test("every component token reaches a primitive or a literal value", () => {
  for (const { name, graph } of graphs) {
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    const into = new Map();
    for (const e of graph.edges) into.set(e.to, [...(into.get(e.to) ?? []), e.from]);
    const keys = graph.nodes.filter((n) => n.tier === "component-key");
    assert.ok(keys.length > 1000, `${name}: only ${keys.length} component tokens`);
    const bad = [];
    for (const key of keys) {
      // The roots of the key's chain: tokens that read no other token, so they hold the value.
      const seen = new Set();
      const stack = [key.id];
      const ends = [];
      while (stack.length) {
        const id = stack.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        const from = into.get(id) ?? [];
        if (!from.length) ends.push(byId.get(id));
        stack.push(...from);
      }
      const ok = ends.length > 0 && ends.every((n) => n.tier === "primitive" || n.value != null);
      if (!ok || key.value == null) bad.push(key.id);
    }
    assert.deepEqual(bad.slice(0, 5), [], `${name}: ${bad.length} keys end at no value`);
  }
});

test("the map file holds each brand in light and dark, the scopes, and each pick's answers", () => {
  const scheme = loadScheme("accessible-first", roots);
  const map = tokenMap({ scheme, grammar: g });
  assert.deepEqual(Object.keys(map.graphs), ["default/light", "default/dark"]);
  assert.deepEqual(
    map.tiers.map((t) => t.id),
    ["primitive", "semantic", "component-key"],
  );
  assert.ok(map.scopes.some((s) => s.id === "color" && s.title === "Color" && s.owns.includes("color")));
  const light = map.graphs["default/light"].nodes.find((n) => n.id === "color.text.primary");
  const dark = map.graphs["default/dark"].nodes.find((n) => n.id === "color.text.primary");
  assert.equal(light.type, "color");
  assert.notEqual(light.value, dark.value);
  assert.ok(!JSON.stringify(map).includes('"decision'), "the map file names a decision");

  const focus = map.graphs["default/light"].nodes.find((n) => n.id === "color.border.focus");
  // The description is the token's own; the builder's why stays out.
  assert.equal(focus.description, scheme.tokens.semantic.color.border.focus.$description);
  // OD-303: the states answer decides the focus ring (the decision mapping); the dark pick adds the floor and the palette.
  assert.deepEqual(
    focus.answers.map((a) => a.id),
    // With the graded curve on (OD-299), the steps answer shapes the ring's step too.
    ["accessibility.roles", "accessibility.definition", "color.definition", ...(GRADED_STEPS ? ["color.definition.steps"] : [])],
  );
  assert.deepEqual(focus.answers[0], { id: "accessibility.roles", question: "Which states get their own visible value?", answer: "All, including loading" });
  // The reasons: each answer in plain words with the answers it follows from.
  assert.deepEqual(map.reasons["color.definition"].because, ["people.q2", "people.q1", "color.lands"]);
  assert.equal(map.reasons["business.q1"].answer, "Serves the public");
  const primary = map.graphs["default/light"].nodes.find((n) => n.id === "color.action.primary.@");
  assert.equal(primary.tone, "dark");
  // What a decision box shows holds no ticket id.
  const shown = map.graphs["default/light"].nodes
    .filter((n) => n.tier === "semantic")
    .map((n) => JSON.stringify([n.description, n.answers]));
  assert.deepEqual(
    shown.filter((t) => /\bOD-\d+/.test(t)),
    [],
  );
});

const accessibleGraph = (mode) => graphs.find((x) => x.name === `accessible-first default ${mode}`).graph;

test("size.control.default runs from size.52 to the button's height", () => {
  const graph = accessibleGraph("light");
  assert.ok(hasEdge(graph, "size.52", "size.control.default"));
  assert.ok(hasEdge(graph, "size.control.default", "component.button.height"));
  assert.equal(graph.nodes.find((n) => n.id === "component.button.height").value, "3.25rem");
});

test("the brand theme folds into the primitive the theme picks, in each mode", () => {
  for (const [mode, primitive] of [
    ["light", "color.blue.light.600"],
    ["dark", "color.blue.dark.700"],
  ]) {
    const graph = accessibleGraph(mode);
    assert.ok(hasEdge(graph, primitive, "color.border.focus"), `${mode}: ${primitive} does not reach the focus color`);
    assert.equal(graph.nodes.find((n) => n.id === "color.border.focus").theme, true);
    assert.ok(!graph.nodes.some((n) => n.id.startsWith("theme.")), `${mode}: theme tokens are nodes`);
  }
  assert.equal(accessibleGraph("light").nodes.find((n) => n.id === "size.control.default").theme, undefined);
});
