// A scheme stores only the component values it decides (OD-291, ADR-002 step 2). Every other
// component key takes the grammar's default and description. withDefaults fills them in, in the
// grammar's order; withoutDefaults takes out each token that equals its fill exactly. No file access,
// so the loader, the build and the bundled apps (Storybook) share it.

/** A key's token path in a scheme: its id's segments; a key that is also a group keeps its token at "@". */
function pathsOf(g) {
  const ids = g.component_keys.map((k) => k.id);
  const groups = new Set(ids.flatMap((id) => id.split("/").slice(0, -1).map((_, i, a) => a.slice(0, i + 1).join("/"))));
  return new Map(ids.map((id) => [id, id.endsWith("/@") || !groups.has(id) ? id.split("/") : [...id.split("/"), "@"]]));
}

const fillOf = (key) => ({ $value: `{${key.default}}`, $description: key.description });
const isFill = (token, key) =>
  token &&
  Object.keys(token).length === 2 &&
  token.$value === `{${key.default}}` &&
  token.$description === key.description;
const at = (tree, path) => path.reduce((node, k) => node?.[k], tree);

/** The scheme with every component key present, in the grammar's order. Does not change its input. */
export function withDefaults(scheme, g) {
  const stored = scheme?.tokens?.component ?? {};
  const paths = pathsOf(g);
  const component = {};
  for (const key of g.component_keys) {
    const path = paths.get(key.id);
    let node = component;
    for (const k of path.slice(0, -1)) node = node[k] ??= {};
    node[path.at(-1)] = at(stored, path) ?? fillOf(key);
  }
  // A stored token the grammar does not name stays, after the grammar's keys.
  const known = new Set([...paths.values()].map((p) => p.join(".")));
  const extra = (node, path = []) => {
    for (const [k, v] of Object.entries(node)) {
      if (!v || typeof v !== "object") continue;
      const p = [...path, k];
      if ("$value" in v) {
        if (!known.has(p.join("."))) {
          let n = component;
          for (const x of p.slice(0, -1)) n = n[x] ??= {};
          n[p.at(-1)] = v;
        }
      } else extra(v, p);
    }
  };
  extra(stored);
  return { ...scheme, tokens: { ...scheme.tokens, component } };
}

/** The scheme as it is stored: each component token that equals the grammar's fill is left out. */
export function withoutDefaults(scheme, g) {
  const component = structuredClone(scheme?.tokens?.component ?? {});
  for (const [id, path] of pathsOf(g)) {
    const key = g.component_keys.find((k) => k.id === id);
    const parent = at(component, path.slice(0, -1));
    if (parent && isFill(parent[path.at(-1)], key)) delete parent[path.at(-1)];
  }
  const prune = (node) => {
    for (const [k, v] of Object.entries(node))
      if (v && typeof v === "object" && !("$value" in v)) {
        prune(v);
        if (!Object.keys(v).length) delete node[k];
      }
  };
  prune(component);
  return { ...scheme, tokens: { ...scheme.tokens, component } };
}
