// The token map's focused trace (OD-274): one item, everything its value comes from (up) and
// everything that reads it (down). No Node imports, so the docs page runs the same code in the browser.

/**
 * The trace of one node in a token graph (token-graph.mjs). Up follows reference edges back and adds
 * the decisions that set each token on the way. Down follows reference edges to the components. A
 * decision reaches down through the token its pick sets (via), not through every reader of the
 * primitive it lands on. Returns { nodes: Set<id>, edges: Set<edge index> }.
 */
export function trace(graph, focus) {
  const into = new Map();
  const out = new Map();
  const setBy = new Map();
  const push = (map, key, i) => {
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(i);
  };
  graph.edges.forEach((e, i) => {
    push(into, e.to, i);
    push(out, e.from, i);
    if (e.kind === "decision") push(setBy, e.via ?? e.to, i);
  });
  const nodes = new Set([focus]);
  const edges = new Set();
  const take = (i) => {
    edges.add(i);
    nodes.add(graph.edges[i].from);
    nodes.add(graph.edges[i].to);
  };
  // Every node a walk reaches over reference edges; onEdge sees each edge it crosses.
  const walk = (start, links, next, onEdge = () => {}) => {
    const seen = new Set();
    const stack = [start];
    while (stack.length) {
      const id = stack.pop();
      if (seen.has(id)) continue;
      seen.add(id);
      for (const i of links.get(id) ?? []) {
        if (graph.edges[i].kind !== "reference") continue;
        onEdge(i);
        stack.push(next(graph.edges[i]));
      }
    }
    return seen;
  };
  const down = (start) => walk(start, out, (e) => e.to, take);
  const up = (start) => {
    for (const id of walk(start, into, (e) => e.from, take)) for (const i of setBy.get(id) ?? []) take(i);
  };

  const tier = graph.nodes.find((n) => n.id === focus)?.tier;
  if (tier === "decision") {
    for (const i of out.get(focus) ?? []) {
      const e = graph.edges[i];
      take(i);
      if (!e.via) {
        down(e.to);
        continue;
      }
      // The hops from the primitive up to the token the pick sets: what the primitive reaches and the
      // token comes from.
      const reach = walk(e.to, out, (x) => x.to);
      walk(e.via, into, (x) => x.from, (j) => reach.has(graph.edges[j].from) && take(j));
      nodes.add(e.via);
      down(e.via);
    }
    return { nodes, edges };
  }
  up(focus);
  if (tier === "primitive") for (const i of into.get(focus) ?? []) if (graph.edges[i].kind === "decision") take(i);
  down(focus);
  return { nodes, edges };
}
