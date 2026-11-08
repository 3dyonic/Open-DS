// The token map's focused trace (OD-274): one semantic token, the primitive its value comes from (up)
// and the semantics and component tokens that read it (down). No Node imports, so the docs page runs
// the same code in the browser.

/**
 * The trace of one semantic token in a token graph (token-graph.mjs), as columns from left to right:
 * { role: "primitive" | "source" | "focus" | "reader" | "component-key", ids, groups? }.
 * "primitive" holds every primitive the value comes from; "source" columns hold the semantics on the
 * way, nearest last; "reader" columns hold the semantics that read it, nearest first; the last column
 * holds the component tokens, with groups [{ component, ids }] by component. A column with no ids is
 * left out. edges are the indexes of the graph edges the trace crosses. reads maps a component token
 * that reads another one (a deprecated key, OD-241) to the one it reads. Null for a token that is not
 * a semantic of the graph.
 */
export function trace(graph, focus) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  if (byId.get(focus)?.tier !== "semantic") return null;
  const into = new Map();
  const out = new Map();
  const push = (map, key, i) => {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(i);
  };
  graph.edges.forEach((e, i) => {
    push(into, e.to, i);
    push(out, e.from, i);
  });

  // A breadth-first walk: each node's distance from the focus, and every edge on the way.
  const edges = new Set();
  const walk = (links, next) => {
    const distance = new Map([[focus, 0]]);
    const queue = [focus];
    while (queue.length) {
      const id = queue.shift();
      for (const i of links.get(id) ?? []) {
        edges.add(i);
        const other = next(graph.edges[i]);
        if (distance.has(other)) continue;
        distance.set(other, distance.get(id) + 1);
        queue.push(other);
      }
    }
    distance.delete(focus);
    return distance;
  };
  const up = walk(into, (e) => e.from);
  const down = walk(out, (e) => e.to);

  const tier = (id) => byId.get(id)?.tier;
  const byLabel = (a, b) => byId.get(a).label.localeCompare(byId.get(b).label);
  const atDistance = (distances, d) =>
    [...distances]
      .filter(([id, x]) => x === d && tier(id) === "semantic")
      .map(([id]) => id)
      .sort(byLabel);
  const deepest = (distances) =>
    Math.max(0, ...[...distances].filter(([id]) => tier(id) === "semantic").map(([, d]) => d));

  const columns = [{ role: "primitive", ids: [...up.keys()].filter((id) => tier(id) === "primitive").sort(byLabel) }];
  for (let d = deepest(up); d >= 1; d--) columns.push({ role: "source", ids: atDistance(up, d) });
  columns.push({ role: "focus", ids: [focus] });
  for (let d = 1; d <= deepest(down); d++) columns.push({ role: "reader", ids: atDistance(down, d) });
  const keys = [...down.keys()].filter((id) => tier(id) === "component-key");
  const reads = keyReads(graph, keys);
  const groups = componentGroups(keys, reads, byId);
  columns.push({ role: "component-key", ids: groups.flatMap((g) => g.ids), groups });

  return { focus, columns: columns.filter((c) => c.ids.length), edges, reads: Object.fromEntries(reads) };
}

/** The component a component token belongs to: component.button.height is button's. */
export const componentOf = (id) => id.replace(/^component\./, "").split(".")[0];

/**
 * Component tokens grouped by component, in name order. Within a group, a token that reads another
 * token of the group (a deprecated key, OD-241) comes right after the one it reads.
 */
function componentGroups(keys, readsKey, byId) {
  const byLabel = (a, b) => byId.get(a).label.localeCompare(byId.get(b).label);
  const groups = new Map();
  for (const id of [...keys].sort(byLabel)) {
    const name = componentOf(id);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(id);
  }
  return [...groups.keys()].sort().map((component) => {
    const members = groups.get(component);
    const ordered = [];
    const place = (id) => {
      if (ordered.includes(id)) return;
      ordered.push(id);
      for (const alias of members) if (readsKey.get(alias) === id) place(alias);
    };
    for (const id of members) if (!readsKey.has(id) || !members.includes(readsKey.get(id))) place(id);
    for (const id of members) place(id);
    return { component, ids: ordered };
  });
}

// Each component token of the trace that reads another one of the trace, to the one it reads.
function keyReads(graph, keys) {
  const inSet = new Set(keys);
  const reads = new Map();
  for (const e of graph.edges) if (inSet.has(e.from) && inSet.has(e.to) && !reads.has(e.to)) reads.set(e.to, e.from);
  return reads;
}

/** The id of a component's group in a trace, for the expanded set: group:button. */
export const groupId = (component) => `group:${component}`;

/** How many readers a semantic can have and still start expanded. */
export const OPEN_LIMIT = 5;

// Each token of the trace, to the tokens of the trace that read it directly.
function readersIn(graph, t) {
  const readers = new Map();
  for (const i of t.edges) {
    const { from, to } = graph.edges[i];
    if (!readers.has(from)) readers.set(from, new Set());
    readers.get(from).add(to);
  }
  return readers;
}

/**
 * The tokens of a trace that start expanded: every semantic after the focus with OPEN_LIMIT readers
 * or fewer. Component groups start collapsed.
 */
export function defaultOpen(graph, t, limit = OPEN_LIMIT) {
  const readers = readersIn(graph, t);
  const ids = t.columns.filter((c) => c.role === "reader").flatMap((c) => c.ids);
  return new Set(ids.filter((id) => (readers.get(id)?.size ?? 0) <= limit));
}

/**
 * What the map draws of a trace (trace()) for an expanded set: semantic ids and groupId(component)s.
 * The primitive, the semantics on the way, the focus and the focus's direct readers always show. A
 * semantic reader shows its own readers only when it is expanded. A component group shows as one box
 * until it is expanded, then as its tokens. Returns { columns, toggles, edges }: columns as trace()'s,
 * with only the tokens that show and groups [{ component, id, ids, count, open }] (ids empty when
 * collapsed); toggles { [id]: { count, open } } for every semantic or group that has readers to show
 * or hide; edges [{ from, to }] to draw, where to is a groupId for a collapsed group.
 */
export function visibleTrace(graph, t, open) {
  const readers = readersIn(graph, t);
  const tier = new Map(graph.nodes.map((n) => [n.id, n.tier]));
  const shown = new Set(
    t.columns.filter((c) => c.role !== "reader" && c.role !== "component-key").flatMap((c) => c.ids),
  );
  const reached = new Set();
  // The semantics whose readers show, walked from the focus.
  const opened = new Set();
  const queue = [t.focus];
  while (queue.length) {
    const id = queue.shift();
    if (opened.has(id)) continue;
    opened.add(id);
    for (const r of readers.get(id) ?? []) {
      if (tier.get(r) === "component-key") reached.add(r);
      else {
        shown.add(r);
        if (open.has(r)) queue.push(r);
      }
    }
  }
  // A component token that reads a token of a group that shows (a deprecated key) shows with it.
  for (const id of [...reached]) for (const r of readers.get(id) ?? []) reached.add(r);

  const readerIds = new Set(t.columns.filter((c) => c.role === "reader").flatMap((c) => c.ids));
  const toggles = {};
  for (const id of shown) {
    const count = readers.get(id)?.size ?? 0;
    if (readerIds.has(id) && count) toggles[id] = { count, open: open.has(id) };
  }

  const keyColumn = t.columns.find((c) => c.role === "component-key");
  const groups = (keyColumn?.groups ?? [])
    .map((g) => {
      const ids = g.ids.filter((id) => reached.has(id));
      const id = groupId(g.component);
      return { component: g.component, id, ids: open.has(id) ? ids : [], count: ids.length, open: open.has(id) };
    })
    .filter((g) => g.count);
  for (const g of groups) {
    toggles[g.id] = { count: g.count, open: g.open };
    for (const id of g.ids) shown.add(id);
  }

  const columns = t.columns
    .map((c) =>
      c.role === "component-key"
        ? { ...c, ids: groups.flatMap((g) => g.ids), groups }
        : { ...c, ids: c.ids.filter((id) => shown.has(id)) },
    )
    .filter((c) => (c.groups ? c.groups.length : c.ids.length));

  // The lines: from a token that shows its readers to each reader that shows, or to its group's box.
  const closedGroup = new Map();
  for (const g of keyColumn?.groups ?? [])
    if (!open.has(groupId(g.component))) for (const id of g.ids) closedGroup.set(id, groupId(g.component));
  const edges = [];
  const seen = new Set();
  const add = (from, to) => {
    const key = `${from}>${to}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ from, to });
  };
  for (const i of t.edges) {
    const { from, to } = graph.edges[i];
    if (!shown.has(from) || tier.get(from) === "component-key") continue;
    // A semantic on the way to the focus always shows its line to the next one.
    if (readerIds.has(from) && !opened.has(from)) continue;
    if (tier.get(to) === "component-key") {
      if (!reached.has(to)) continue;
      add(from, closedGroup.get(to) ?? to);
    } else if (shown.has(to)) add(from, to);
  }
  return { columns, toggles, edges };
}

/**
 * The three linked picks that name a semantic token: its family (color), its role (border) and the
 * rest of its name (focus, or primary.hover). picked is [family?, role?]. Returns { families, roles,
 * names }: families are strings; roles are [{ value, id? }], where id is the token a two-part name
 * (size.row) already picks; names are [{ value, id }] for the family and role picked.
 */
export function nameOptions(nodes, picked = []) {
  const [family, role] = picked;
  const parts = nodes.filter((n) => n.tier === "semantic").map((n) => ({ id: n.id, part: n.label.split(".") }));
  const unique = (xs) => [...new Set(xs)].sort((a, b) => a.localeCompare(b));
  const families = unique(parts.map((p) => p.part[0]));
  const inFamily = parts.filter((p) => p.part[0] === family);
  const roles = unique(inFamily.map((p) => p.part[1]).filter(Boolean)).map((value) => {
    const exact = inFamily.find((p) => p.part[1] === value && p.part.length === 2);
    const deeper = inFamily.some((p) => p.part[1] === value && p.part.length > 2);
    return exact && !deeper ? { value, id: exact.id } : { value };
  });
  const names = inFamily
    .filter((p) => role != null && p.part[1] === role && p.part.length > 2)
    .map((p) => ({ value: p.part.slice(2).join("."), id: p.id }))
    .sort((a, b) => a.value.localeCompare(b.value));
  // A two-part name that also has longer names under it is the role's own token.
  const itself = inFamily.find((p) => role != null && p.part[1] === role && p.part.length === 2);
  if (itself && names.length) names.unshift({ value: "", id: itself.id });
  return { families, roles, names };
}

/** The picks that name one semantic token: [family, role, name?]. Empty for any other token. */
export function namePicks(nodes, id) {
  const node = nodes.find((n) => n.id === id && n.tier === "semantic");
  if (!node) return [];
  const [family, role, ...rest] = node.label.split(".");
  const { roles } = nameOptions(nodes, [family]);
  return roles.find((r) => r.value === role)?.id === id ? [family, role] : [family, role, rest.join(".")];
}

/**
 * The boxes the map draws for a visible trace (visibleTrace()), left to right: every token that
 * shows, and one box per component group, followed by its tokens when it is expanded.
 */
export function renderedIds(visible) {
  return visible.columns.flatMap((c) => (c.groups ? c.groups.flatMap((g) => [g.id, ...g.ids]) : c.ids));
}

/** Every semantic and group of a trace that can be expanded, for "Expand all". */
export function allOpen(t) {
  const readers = t.columns.filter((c) => c.role === "reader").flatMap((c) => c.ids);
  const groups = (t.columns.find((c) => c.role === "component-key")?.groups ?? []).map((g) => groupId(g.component));
  return new Set([...readers, ...groups]);
}
