// The token map's graph and navigation (OD-274): every edge joins two nodes, every component token
// ends at a value, the theme folds into the primitive, and the map opens from a grammar scope to a
// primitive, the semantic tokens that read it and the components that read those. Every semantic
// token can be opened from ?focus=, and the search finds values, tokens and component tokens.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { tokenGraph, tokenMap, TIERS } from "../src/token-graph.mjs";
import {
  cleanPath,
  columnsFor,
  componentsReading,
  COMPONENT_LIMIT,
  familiesIn,
  groupsOf,
  mapIndex,
  pathTo,
  rowLabel,
  search,
  searchEntries,
  UNUSED,
  wordKey,
} from "../src/token-trace.mjs";

const roots = assetRoots();
const g = grammar(roots);
const scopes = tokenMap({ scheme: loadScheme("accessible-first", roots), grammar: g }).scopes;
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
const accessible = (mode) => {
  const { graph } = graphs.find((x) => x.name === `accessible-first default ${mode}`);
  return { graph, index: mapIndex(graph, { scopes, mode }) };
};
const levels = (columns) => columns.map((c) => c.level);

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

test("every semantic token opens from ?focus=, through a primitive, in every scheme and mode", () => {
  for (const { name, graph, mode } of graphs) {
    const index = mapIndex(graph, { scopes, mode });
    const bad = graph.nodes
      .filter((n) => n.tier === "semantic")
      .filter((n) => {
        const opened = pathTo(index, n.id);
        if (!opened || opened.path.decision !== n.id) return true;
        // The path holds as it is: no part of it is cut.
        return JSON.stringify(cleanPath(index, opened.path)) !== JSON.stringify(opened.path);
      })
      .map((n) => n.id);
    assert.deepEqual(bad.slice(0, 5), [], `${name}: ${bad.length} semantics the map cannot open`);
  }
});

test("size.control.default runs from size.52 to the button's and the input's height", () => {
  const { graph, index } = accessible("light");
  assert.ok(hasEdge(graph, "size.52", "size.control.default"));
  assert.ok(hasEdge(graph, "size.control.default", "component.button.height"));
  assert.equal(graph.nodes.find((n) => n.id === "component.button.height").value, "3.25rem");

  const opened = pathTo(index, "size.control.default");
  assert.equal(opened.path.step, "size.52");
  const readers = Object.fromEntries(componentsReading(index, "size.control.default").map((c) => [c.component, c.rows]));
  assert.ok(readers.button.some((r) => r.id === "component.button.height" && r.label === "height"));
  assert.ok(readers.input.some((r) => r.id === "component.input.height"));
  // Component tokens are the last layer: nothing in the graph is a decision or a component.
  assert.deepEqual(
    graph.nodes.filter((n) => n.id.startsWith("decision/") || n.id.startsWith("ui/")).map((n) => n.id),
    [],
  );
});

test("the brand theme folds into the primitive the theme picks, in each mode", () => {
  for (const [mode, primitive] of [
    ["light", "color.blue.light.600"],
    ["dark", "color.blue.dark.600"],
  ]) {
    const { graph, index } = accessible(mode);
    assert.ok(hasEdge(graph, primitive, "color.border.focus"), `${mode}: ${primitive} does not reach the focus color`);
    assert.equal(graph.nodes.find((n) => n.id === "color.border.focus").theme, true);
    assert.ok(!graph.nodes.some((n) => n.id.startsWith("theme.")), `${mode}: theme tokens are nodes`);
    // The word is the same in both modes; the mode picks its primitive.
    assert.equal(pathTo(index, "color.border.focus").path.step, "color.blue.600");
    assert.equal(index.words.get("color.blue.600").id, primitive);
  }
  const { graph } = accessible("light");
  assert.equal(graph.nodes.find((n) => n.id === "size.control.default").theme, undefined);
});

test("a primitive's id loses its mode, and the other mode's ramp is not a word", () => {
  assert.equal(wordKey("color.blue.light.600", "light"), "color.blue.600");
  assert.equal(wordKey("color.blue.dark.600", "light"), null);
  assert.equal(wordKey("color.blue.dark.600", "dark"), "color.blue.600");
  assert.equal(wordKey("size.52", "light"), "size.52");
  assert.equal(rowLabel("component.button.focus-ring-color"), "focus ring color");
  assert.equal(rowLabel("component.sidebar.menu.sub-button.@"), "menu sub button");
});

test("a word belongs to the scopes that own its readers; one nobody reads is not used yet", () => {
  const graph = {
    nodes: [
      { id: "color.blue.light.600", tier: "primitive", type: "color", value: "#0B4FC0" },
      { id: "color.blue.light.100", tier: "primitive", type: "color", value: "#E2EDFF" },
      { id: "color.blue.dark.600", tier: "primitive", type: "color", value: "#8AB4F8" },
      { id: "color.red.light.700", tier: "primitive", type: "color", value: "#981519" },
      { id: "size.52", tier: "primitive", type: "dimension", value: "3.25rem" },
      { id: "space.2", tier: "primitive", type: "dimension", value: "0.125rem" },
      { id: "color.neutral.0", tier: "semantic" },
      { id: "color.border.focus", tier: "semantic" },
      { id: "color.border.selected", tier: "semantic" },
      { id: "color.action.primary.@", tier: "semantic" },
      { id: "color.text.on-action", tier: "semantic" },
      { id: "size.control.default", tier: "semantic" },
      { id: "spacing-map.x1", tier: "semantic" },
      { id: "component.button.focus-ring", tier: "component-key" },
      { id: "component.button.old-ring", tier: "component-key" },
      { id: "component.input.border-focus", tier: "component-key" },
    ],
    edges: [
      { from: "color.blue.light.600", to: "color.border.focus" },
      { from: "color.blue.light.600", to: "color.border.selected" },
      { from: "color.blue.light.600", to: "color.action.primary.@" },
      { from: "color.red.light.700", to: "color.neutral.0" },
      { from: "color.neutral.0", to: "color.text.on-action" },
      { from: "size.52", to: "size.control.default" },
      { from: "space.2", to: "spacing-map.x1" },
      { from: "color.border.focus", to: "component.input.border-focus" },
      { from: "color.border.focus", to: "component.button.focus-ring" },
      { from: "component.button.focus-ring", to: "component.button.old-ring" },
    ],
  };
  const own = [
    { id: "color", title: "Color", owns: ["color"] },
    { id: "spacing", title: "Spacing", owns: ["space"] },
    { id: "accessibility", title: "Accessibility", owns: ["size.control", "color.border.focus"] },
    { id: "theming", title: "Theming", owns: ["theme"] },
  ];
  const index = mapIndex(graph, { scopes: own, mode: "light" });
  // Theming holds no word, so it shows no box; space.2 goes where its own name belongs.
  assert.deepEqual(
    index.scopes.map((s) => [s.id, s.keys]),
    [
      ["color", ["color.blue.600", "color.red.700"]],
      ["spacing", ["space.2"]],
      ["accessibility", ["color.blue.600", "size.52"]],
      [UNUSED.id, ["color.blue.100"]],
    ],
  );
  assert.deepEqual(
    familiesIn(index, "color").map((f) => [f.label, f.swatch]),
    [
      ["blue", "color.blue.600"],
      ["red", "color.red.700"],
    ],
  );
  // The dark ramp is not a word in light mode, unless a semantic reads it there.
  assert.ok(!index.words.has("color.blue.dark.600"));
  const read = mapIndex(
    { ...graph, edges: [...graph.edges, { from: "color.blue.dark.600", to: "color.text.on-action" }] },
    { scopes: own, mode: "light" },
  );
  assert.deepEqual(read.words.get("color.blue.dark.600"), {
    key: "color.blue.dark.600",
    id: "color.blue.dark.600",
    family: "color.blue.dark",
    familyLabel: "blue dark",
    step: "600",
  });
  assert.equal(familiesIn(index, "spacing"), null, "two-part keys form no families");
  assert.deepEqual(
    familiesIn(index, "accessibility").map((f) => f.label),
    ["blue", "size"],
  );
  // A reader through another semantic counts: red.700 is read by text.on-action through neutral.0.
  assert.deepEqual(
    groupsOf(index, "color.red.700").map((x) => [x.label, x.decisions]),
    [
      ["Neutral", ["color.neutral.0"]],
      ["Text", ["color.text.on-action"]],
    ],
  );
  assert.deepEqual(
    groupsOf(index, "color.blue.600").map((x) => [x.label, x.decisions.length]),
    [
      ["Action", 1],
      ["Border", 2],
    ],
  );
  // A deprecated key that reads a component token shows as a row of its component.
  assert.deepEqual(
    componentsReading(index, "color.border.focus").map((c) => [c.label, c.rows.map((r) => r.label)]),
    [
      ["Button", ["focus ring", "old ring"]],
      ["Input", ["border focus"]],
    ],
  );
  // The decision opens through Color, the first scope in the grammar's order that holds its word.
  assert.deepEqual(pathTo(index, "color.border.focus").path, {
    scope: "color",
    family: "color.blue",
    step: "color.blue.600",
    group: "color.border",
    decision: "color.border.focus",
  });
  // A dark primitive opens the same word, and a component token selects the decision it reads.
  assert.deepEqual(pathTo(index, "color.blue.dark.600").path, { scope: "color", family: "color.blue", step: "color.blue.600" });
  const fromKey = pathTo(index, "component.button.old-ring");
  assert.equal(fromKey.path.decision, "color.border.focus");
  assert.equal(fromKey.row, "component.button.old-ring");
  assert.equal(pathTo(index, "nothing.here"), null);
});

test("Color › blue › 600 › Border › color.border.focus opens one column per level", () => {
  const { index } = accessible("light");
  const opened = pathTo(index, "color.border.focus");
  const columns = columnsFor(index, opened.path);
  assert.deepEqual(levels(columns), ["scope", "scale", "step", "word", "group", "decision", "where"]);
  const at = (level) => columns.find((c) => c.level === level);
  assert.equal(at("scope").open, "color");
  assert.equal(at("scope").ids.at(-1), UNUSED.id, "Not used yet comes last");
  assert.ok(at("scale").ids.includes("color.blue"));
  assert.deepEqual(at("group").ids, ["color.action", "color.border", "color.category"]);
  assert.deepEqual(at("decision").ids, ["color.border.focus", "color.border.selected"]);
  const where = at("where");
  const all = componentsReading(index, "color.border.focus");
  assert.equal(where.ids.length, COMPONENT_LIMIT);
  assert.equal(where.hidden, all.length - COMPONENT_LIMIT);
  assert.equal(columnsFor(index, opened.path, { more: true }).at(-1).ids.length, all.length);
  assert.ok(all.some((c) => c.component === "button" && c.rows.some((r) => r.label === "focus ring")));

  // A scope with no families goes straight to its steps; the empty map is the scope column only.
  assert.deepEqual(levels(columnsFor(index, {})), ["scope"]);
  assert.deepEqual(levels(columnsFor(index, { scope: "spacing" })), ["scope", "step"]);
  // Size steps serve Accessibility, Iconography and Spacing.
  const sizes = (id) => index.scopes.find((s) => s.id === id).keys.filter((k) => k.startsWith("size."));
  assert.ok(sizes("accessibility").length && sizes("iconography").length && sizes("spacing").length);
});

test("a path that no longer holds is cut at the first part that is gone", () => {
  const { index } = accessible("light");
  const path = { scope: "color", family: "color.blue", step: "color.blue.600", group: "color.border", decision: "color.text.primary" };
  assert.deepEqual(cleanPath(index, path), { scope: "color", family: "color.blue", step: "color.blue.600", group: "color.border" });
  assert.deepEqual(cleanPath(index, { scope: "nope", step: "color.blue.600" }), {});
  // The same path holds in dark mode, where blue.600 is the dark ramp's step.
  const dark = accessible("dark").index;
  const focus = pathTo(index, "color.border.focus").path;
  assert.deepEqual(cleanPath(dark, focus), focus);
});

test("the search finds a value, a token and a component token, best match first", () => {
  const { index } = accessible("light");
  const entries = searchEntries(index);
  assert.deepEqual(
    search(entries, "blue 600").matches.map((m) => [m.kind, m.label]),
    [["Value", "color.blue.600"]],
  );
  assert.equal(search(entries, "#0b4fc0").matches[0].id, "color.blue.light.600");
  assert.equal(search(entries, "color.border.focus").matches[0].id, "color.border.focus");
  const button = search(entries, "button focus ring", 50).matches.find((m) => m.id === "component.button.focus-ring");
  assert.equal(button?.kind, "Component");
  assert.equal(pathTo(index, button.id).path.decision, "color.border.focus");
  const many = search(entries, "color", 8);
  assert.equal(many.matches.length, 8);
  assert.ok(many.total > 8, "the total counts every match, past the ones shown");
  assert.deepEqual(search(entries, "   "), { matches: [], total: 0 });
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
  assert.deepEqual(focus.answers, [
    { question: "What contrast floor do we hold?", answer: "AAA for text" },
    { question: "How is the palette defined?", answer: "Neutrals and one brand ramp" },
  ]);
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
