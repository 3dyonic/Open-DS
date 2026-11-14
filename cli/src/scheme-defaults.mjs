// A scheme stores only the component values it decides (ADR-002 step 2). Every other
// component key takes the grammar's default and description. withDefaults fills them in, in the
// grammar's order; withoutDefaults takes out each token that equals its fill exactly. A key with
// created_by exists only in a scheme whose answer creates it, so no scheme ships a choice it did not
// make. No file access, so the loader, the build and the bundled apps (Storybook) share it.

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

/** True when the scheme has the key: the key has no created_by, or the scheme's answer is one of its options. */
export function keyCreated(key, scheme) {
  if (!key.created_by) return true;
  const answer = (scheme?.answers ?? []).find((a) => a.question === key.created_by.question);
  return key.created_by.options.includes(answer?.option);
}

/** The grammar's component keys the scheme has, in the grammar's order. */
export const keysOf = (g, scheme) => g.component_keys.filter((key) => keyCreated(key, scheme));

/** The scheme with every component key present, in the grammar's order. Does not change its input. */
export function withDefaults(scheme, g) {
  const stored = scheme?.tokens?.component ?? {};
  const paths = pathsOf(g);
  const component = {};
  for (const key of g.component_keys) {
    const path = paths.get(key.id);
    // A key the answers do not create gets no fill. A stored token stays, so the checks can name it.
    const token = at(stored, path) ?? (keyCreated(key, scheme) ? fillOf(key) : undefined);
    if (!token) continue;
    let node = component;
    for (const k of path.slice(0, -1)) node = node[k] ??= {};
    node[path.at(-1)] = token;
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
    if (!keyCreated(key, scheme)) continue;
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
