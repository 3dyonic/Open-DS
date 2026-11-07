// The token map's graph (OD-274): every edge joins two nodes, every component key ends at a value, a
// known chain resolves from the decision to the component, and a decision's trace stays on its pick.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { componentSources, tokenGraph, tokenMap, TIERS } from "../src/token-graph.mjs";
import { trace } from "../src/token-trace.mjs";

const roots = assetRoots();
const g = grammar(roots);
const graphs = schemeIds(roots).flatMap((id) => {
  const scheme = loadScheme(id, roots);
  const sources = componentSources(scheme, roots);
  return Object.keys(scheme.tokens.brands).flatMap((brand) =>
    ["light", "dark"].map((mode) => ({
      name: `${id} ${brand} ${mode}`,
      graph: tokenGraph({ scheme, grammar: g, sources, brand, mode }),
    })),
  );
});
const hasEdge = (graph, from, to, kind = "reference") =>
  graph.edges.some((e) => e.from === from && e.to === to && e.kind === kind);

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
    assert.ok(graph.edges.some((e) => e.kind === "decision"), `${name}: no decision edges`);
  }
});

test("every component key reaches a primitive or a literal value", () => {
  for (const { name, graph } of graphs) {
    const byId = new Map(graph.nodes.map((n) => [n.id, n]));
    const into = new Map();
    for (const e of graph.edges)
      if (e.kind === "reference") into.set(e.to, [...(into.get(e.to) ?? []), e.from]);
    const keys = graph.nodes.filter((n) => n.tier === "component-key");
    assert.ok(keys.length > 1000, `${name}: only ${keys.length} component keys`);
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

test("accessibility.values (large) reaches the button's height through size.control.default", () => {
  const { graph } = graphs.find((x) => x.name === "accessible-first default light");
  const decision = graph.nodes.find((n) => n.id === "decision/accessibility.values");
  assert.equal(decision.value, "Large");
  assert.ok(
    graph.edges.some(
      (e) => e.from === decision.id && e.to === "size.52" && e.kind === "decision" && e.via === "size.control.default",
    ),
  );
  assert.ok(hasEdge(graph, "size.52", "size.control.default"));
  assert.ok(hasEdge(graph, "size.control.default", "component.button.height"));
  assert.ok(hasEdge(graph, "component.button.height", "ui/button"));
  assert.equal(graph.nodes.find((n) => n.id === "component.button.height").value, "3.25rem");

  const down = trace(graph, decision.id);
  for (const id of ["size.52", "size.control.default", "component.button.height", "ui/button"])
    assert.ok(down.nodes.has(id), `the decision's trace misses ${id}`);
  const up = trace(graph, "component.button.height");
  for (const id of ["size.control.default", "size.52", decision.id, "ui/button"])
    assert.ok(up.nodes.has(id), `the key's trace misses ${id}`);
  // Every edge of a trace joins two of its nodes.
  for (const t of [down, up])
    for (const i of t.edges) assert.ok(t.nodes.has(graph.edges[i].from) && t.nodes.has(graph.edges[i].to));
});

test("a decision's trace goes down through the token it picks, not every reader of the primitive", () => {
  const graph = {
    nodes: [
      { id: "decision/q", tier: "decision" },
      { id: "p", tier: "primitive" },
      { id: "theme.a", tier: "theme" },
      { id: "theme.b", tier: "theme" },
      { id: "a", tier: "semantic" },
      { id: "b", tier: "semantic" },
      { id: "component.k", tier: "component-key" },
      { id: "ui/c", tier: "component" },
    ],
    edges: [
      { from: "decision/q", to: "p", kind: "decision", via: "theme.a" },
      { from: "p", to: "theme.a", kind: "reference" },
      { from: "p", to: "theme.b", kind: "reference" },
      { from: "theme.a", to: "a", kind: "reference" },
      { from: "theme.b", to: "b", kind: "reference" },
      { from: "a", to: "component.k", kind: "reference" },
      { from: "component.k", to: "ui/c", kind: "reference" },
    ],
  };
  const t = trace(graph, "decision/q");
  assert.deepEqual([...t.nodes].sort(), ["a", "component.k", "decision/q", "p", "theme.a", "ui/c"]);
  // From b, the trace goes up to p and does not pick up the decision, which sets a, not b.
  assert.deepEqual([...trace(graph, "b").nodes].sort(), ["b", "p", "theme.b"]);
});

test("the map file holds each brand in light and dark, with the tiers in order", () => {
  const scheme = loadScheme("accessible-first", roots);
  const map = tokenMap({ scheme, grammar: g, sources: componentSources(scheme, roots) });
  assert.deepEqual(Object.keys(map.graphs), ["default/light", "default/dark"]);
  assert.deepEqual(
    map.tiers.map((t) => t.id),
    TIERS,
  );
  const light = map.graphs["default/light"].nodes.find((n) => n.id === "color.text.primary");
  const dark = map.graphs["default/dark"].nodes.find((n) => n.id === "color.text.primary");
  assert.equal(light.type, "color");
  assert.notEqual(light.value, dark.value);
});
