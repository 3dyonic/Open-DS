// The token map's graph and trace (OD-274): every edge joins two nodes, every component token ends at
// a value, the theme folds into the primitive, and a semantic's trace runs from its primitive to the
// component tokens that read it, grouped by component, with no decisions and no components. The map
// draws only the trace, with what an expanded set shows, and the selects name every semantic token.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, loadScheme, schemeIds } from "../src/schemes.mjs";
import { tokenGraph, tokenMap, TIERS } from "../src/token-graph.mjs";
import {
  allOpen,
  defaultOpen,
  groupId,
  nameOptions,
  namePicks,
  renderedIds,
  trace,
  visibleTrace,
} from "../src/token-trace.mjs";

const roots = assetRoots();
const graphs = schemeIds(roots).flatMap((id) => {
  const scheme = loadScheme(id, roots);
  return Object.keys(scheme.tokens.brands).flatMap((brand) =>
    ["light", "dark"].map((mode) => ({ name: `${id} ${brand} ${mode}`, graph: tokenGraph({ scheme, brand, mode }) })),
  );
});
const hasEdge = (graph, from, to) => graph.edges.some((e) => e.from === from && e.to === to);
const column = (t, role) => t.columns.find((c) => c.role === role);

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

test("every semantic token's trace starts at one primitive", () => {
  for (const { name, graph } of graphs) {
    const bad = graph.nodes
      .filter((n) => n.tier === "semantic")
      .filter((n) => column(trace(graph, n.id), "primitive")?.ids.length !== 1)
      .map((n) => n.id);
    assert.deepEqual(bad.slice(0, 5), [], `${name}: ${bad.length} semantics with no single primitive`);
  }
});

test("size.control.default runs from size.52 to the button's and the input's height", () => {
  const { graph } = graphs.find((x) => x.name === "accessible-first default light");
  assert.ok(hasEdge(graph, "size.52", "size.control.default"));
  assert.ok(hasEdge(graph, "size.control.default", "component.button.height"));
  assert.equal(graph.nodes.find((n) => n.id === "component.button.height").value, "3.25rem");

  const t = trace(graph, "size.control.default");
  assert.deepEqual(
    t.columns.map((c) => c.role),
    ["primitive", "focus", "component-key"],
  );
  assert.deepEqual(column(t, "primitive").ids, ["size.52"]);
  const groups = Object.fromEntries(column(t, "component-key").groups.map((g) => [g.component, g.ids]));
  assert.ok(groups.button.includes("component.button.height"));
  assert.ok(groups.input.includes("component.input.height"));
  // Component tokens are the last layer: nothing in the graph is a decision or a component.
  assert.deepEqual(
    graph.nodes.filter((n) => n.id.startsWith("decision/") || n.id.startsWith("ui/")).map((n) => n.id),
    [],
  );
  // Every edge of a trace joins two of its tokens.
  const ids = new Set(t.columns.flatMap((c) => c.ids));
  for (const i of t.edges) assert.ok(ids.has(graph.edges[i].from) && ids.has(graph.edges[i].to));
});

test("the brand theme folds into the primitive the theme picks, in each mode", () => {
  for (const [mode, primitive] of [
    ["light", "color.blue.light.600"],
    ["dark", "color.blue.dark.600"],
  ]) {
    const { graph } = graphs.find((x) => x.name === `accessible-first default ${mode}`);
    assert.ok(hasEdge(graph, primitive, "color.border.focus"), `${mode}: ${primitive} does not reach the focus color`);
    assert.equal(graph.nodes.find((n) => n.id === "color.border.focus").theme, true);
    assert.ok(!graph.nodes.some((n) => n.id.startsWith("theme.")), `${mode}: theme tokens are nodes`);
    assert.deepEqual(column(trace(graph, "color.border.focus"), "primitive").ids, [primitive]);
  }
  const { graph } = graphs.find((x) => x.name === "accessible-first default light");
  assert.equal(graph.nodes.find((n) => n.id === "size.control.default").theme, undefined);
});

test("a trace puts the semantics on the way and the readers in their own columns", () => {
  const graph = {
    nodes: [
      { id: "p", tier: "primitive", label: "p" },
      { id: "q", tier: "primitive", label: "q" },
      { id: "s", tier: "semantic", label: "s" },
      { id: "f", tier: "semantic", label: "f" },
      { id: "r", tier: "semantic", label: "r" },
      { id: "other", tier: "semantic", label: "other" },
      { id: "component.b.size", tier: "component-key", label: "b.size" },
      { id: "component.a.width", tier: "component-key", label: "a.width" },
      { id: "component.a.old-width", tier: "component-key", label: "a.old-width" },
      { id: "component.c.x", tier: "component-key", label: "c.x" },
    ],
    edges: [
      { from: "p", to: "s" },
      { from: "s", to: "f" },
      { from: "p", to: "other" },
      { from: "q", to: "other" },
      { from: "f", to: "r" },
      { from: "f", to: "component.b.size" },
      { from: "r", to: "component.a.width" },
      { from: "component.a.width", to: "component.a.old-width" },
      { from: "other", to: "component.c.x" },
    ],
  };
  const t = trace(graph, "f");
  assert.deepEqual(
    t.columns.map((c) => [c.role, c.ids]),
    [
      ["primitive", ["p"]],
      ["source", ["s"]],
      ["focus", ["f"]],
      ["reader", ["r"]],
      ["component-key", ["component.a.width", "component.a.old-width", "component.b.size"]],
    ],
  );
  assert.deepEqual(
    column(t, "component-key").groups.map((g) => g.component),
    ["a", "b"],
  );
  assert.deepEqual(t.reads, { "component.a.old-width": "component.a.width" });
  // The trace keeps off the primitive's other readers.
  assert.ok(![...t.edges].some((i) => graph.edges[i].to === "other" || graph.edges[i].from === "other"));
  assert.equal(trace(graph, "p"), null, "a primitive is not a starting point");
  assert.equal(trace(graph, "component.b.size"), null, "a component token is not a starting point");
});

test("the map file holds each brand in light and dark, with the three tiers in order", () => {
  const scheme = loadScheme("accessible-first", roots);
  const map = tokenMap({ scheme });
  assert.deepEqual(Object.keys(map.graphs), ["default/light", "default/dark"]);
  assert.deepEqual(
    map.tiers.map((t) => t.id),
    ["primitive", "semantic", "component-key"],
  );
  const light = map.graphs["default/light"].nodes.find((n) => n.id === "color.text.primary");
  const dark = map.graphs["default/dark"].nodes.find((n) => n.id === "color.text.primary");
  assert.equal(light.type, "color");
  assert.notEqual(light.value, dark.value);
  assert.ok(!JSON.stringify(map).includes('"decision'), "the map file names a decision");
});

test("the map draws the trace of size.control.default and nothing else, with groups collapsed", () => {
  const { graph } = graphs.find((x) => x.name === "accessible-first default light");
  const t = trace(graph, "size.control.default");
  const keys = column(t, "component-key");
  const groups = keys.groups.map((g) => groupId(g.component));

  const closed = visibleTrace(graph, t, defaultOpen(graph, t));
  assert.deepEqual(renderedIds(closed), ["size.52", "size.control.default", ...groups]);
  assert.equal(closed.toggles[groupId("button")].count, keys.groups.find((g) => g.component === "button").ids.length);
  assert.equal(closed.toggles[groupId("button")].open, false);
  // A collapsed group draws one line from the token it reads, to its box.
  assert.ok(closed.edges.some((e) => e.from === "size.control.default" && e.to === groupId("button")));
  assert.ok(!closed.edges.some((e) => e.to === "component.button.height"));

  const button = visibleTrace(graph, t, new Set([groupId("button")]));
  const buttonIds = keys.groups.find((g) => g.component === "button").ids;
  assert.ok(buttonIds.includes("component.button.height"));
  assert.deepEqual(renderedIds(button), [
    "size.52",
    "size.control.default",
    ...groups.flatMap((g) => (g === groupId("button") ? [g, ...buttonIds] : [g])),
  ]);
  assert.ok(button.edges.some((e) => e.from === "size.control.default" && e.to === "component.button.height"));

  // Expanded, the drawing is the whole trace and no other token of the scheme's graph.
  const all = renderedIds(visibleTrace(graph, t, allOpen(t)));
  const traceIds = t.columns.flatMap((c) => c.ids);
  assert.deepEqual(all.filter((id) => !id.startsWith("group:")).sort(), [...traceIds].sort());
  assert.ok(all.length < graph.nodes.length / 10);
});

test("a reader with many readers starts collapsed and shows them once expanded", () => {
  const graph = {
    nodes: [
      { id: "p", tier: "primitive", label: "p" },
      { id: "f", tier: "semantic", label: "f" },
      { id: "small", tier: "semantic", label: "small" },
      { id: "big", tier: "semantic", label: "big" },
      { id: "deep", tier: "semantic", label: "deep" },
      ...["a", "b", "c", "d", "e", "g"].map((c) => ({
        id: `component.${c}.x`,
        tier: "component-key",
        label: `${c}.x`,
      })),
      { id: "component.s.x", tier: "component-key", label: "s.x" },
    ],
    edges: [
      { from: "p", to: "f" },
      { from: "f", to: "small" },
      { from: "f", to: "big" },
      { from: "small", to: "component.s.x" },
      { from: "big", to: "deep" },
      ...["a", "b", "c", "d", "e"].map((c) => ({ from: "big", to: `component.${c}.x` })),
      { from: "deep", to: "component.g.x" },
    ],
  };
  const t = trace(graph, "f");
  const open = defaultOpen(graph, t);
  assert.deepEqual([...open].sort(), ["deep", "small"]);
  const v = visibleTrace(graph, t, open);
  // The focus always shows its direct readers; big's six readers wait behind its toggle.
  assert.deepEqual(renderedIds(v), ["p", "f", "big", "small", groupId("s")]);
  assert.deepEqual(v.toggles.big, { count: 6, open: false });
  assert.deepEqual(v.toggles.small, { count: 1, open: true });
  assert.equal(v.toggles.f, undefined, "the focus has no toggle");

  const wide = visibleTrace(graph, t, new Set([...open, "big"]));
  assert.deepEqual(renderedIds(wide), [
    "p",
    "f",
    "big",
    "small",
    "deep",
    ...["a", "b", "c", "d", "e", "g", "s"].map(groupId),
  ]);
  assert.ok(wide.edges.some((e) => e.from === "deep" && e.to === groupId("g")));
  assert.deepEqual(renderedIds(visibleTrace(graph, t, new Set())), ["p", "f", "big", "small"]);
});

test("the three selects name every semantic token, and a two-part name resolves at the second", () => {
  const { graph } = graphs.find((x) => x.name === "accessible-first default light");
  const { families } = nameOptions(graph.nodes);
  assert.ok(families.includes("color") && families.includes("size"));
  assert.ok(nameOptions(graph.nodes, ["color"]).roles.some((r) => r.value === "border" && !r.id));
  const names = nameOptions(graph.nodes, ["color", "border"]).names;
  assert.deepEqual(
    names.map((n) => n.value),
    ["default", "focus", "selected", "strong"],
  );
  assert.equal(names.find((n) => n.value === "focus").id, "color.border.focus");
  const action = nameOptions(graph.nodes, ["color", "action"]).names.map((n) => n.value);
  assert.ok(action.includes("primary") && action.includes("primary.hover"));
  assert.deepEqual(
    nameOptions(graph.nodes, ["size"]).roles.find((r) => r.value === "row"),
    { value: "row", id: "size.row" },
  );
  assert.deepEqual(namePicks(graph.nodes, "size.row"), ["size", "row"]);
  assert.deepEqual(namePicks(graph.nodes, "color.action.primary.@"), ["color", "action", "primary"]);
  assert.deepEqual(namePicks(graph.nodes, "component.button.height"), []);
  // Every semantic token is reachable through the selects, and only semantic tokens are.
  for (const { name, graph: g } of graphs) {
    const reached = new Set();
    for (const f of nameOptions(g.nodes).families)
      for (const r of nameOptions(g.nodes, [f]).roles)
        if (r.id) reached.add(r.id);
        else for (const n of nameOptions(g.nodes, [f, r.value]).names) reached.add(n.id);
    const semantics = g.nodes.filter((n) => n.tier === "semantic").map((n) => n.id);
    assert.deepEqual([...reached].sort(), semantics.sort(), name);
  }
});
