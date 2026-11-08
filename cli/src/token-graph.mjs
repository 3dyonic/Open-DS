// The token map (OD-274): every token of one scheme, brand and mode as a graph, from the primitives
// through the semantics to the component tokens. An edge points the way a value flows: from the token
// a value comes from to the token that reads it. The brand theme is not a tier: a semantic whose value
// goes through the theme reads the primitive (or semantic) the theme picks, and says so (theme: true).
// The docs' Token map page draws a focused trace of it from one semantic token.
//
// Resolution is lands.mjs's (tokenIndex, refPath, aliasChain), so the map, the Anatomy reference and
// the agents' component API never disagree.
import { shown } from "./anatomy.mjs";
import { aliasChain, refPath, tokenIndex } from "./lands.mjs";
import { flatTokens } from "./tokens.mjs";

export { trace } from "./token-trace.mjs";

/** The tiers, left to right, as the map lays them out. */
export const TIERS = ["primitive", "semantic", "component-key"];

/** Plain labels for the tiers. */
export const TIER_LABELS = {
  primitive: "Primitive",
  semantic: "Semantic",
  "component-key": "Component token",
};

const REF = /\{([^{}]+)\}/g;
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color\()/i;

// Every reference a value names, in a string or anywhere inside a composite value (a shadow's color).
const refsIn = (v) =>
  typeof v === "string"
    ? [...v.matchAll(REF)].map((m) => m[1])
    : v && typeof v === "object"
      ? Object.values(v).flatMap(refsIn)
      : [];

// A value as a reader sees it: every reference inside a composite value (a shadow's color) resolved.
function resolvedValue(index, path) {
  const { value } = aliasChain(index, path);
  const deep = (v) =>
    typeof v === "string"
      ? v.replace(REF, (whole, r) => {
          const end = aliasChain(index, refPath(index, r)).value;
          return end == null ? whole : String(shown(deep(end)));
        })
      : Array.isArray(v)
        ? v.map(deep)
        : v && typeof v === "object"
          ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)]))
          : v;
  return shown(deep(value));
}

const isTheme = (path) => path.startsWith("theme.");

const tierOf = (path, primitives) =>
  path.startsWith("component.") ? "component-key" : primitives.has(path) ? "primitive" : "semantic";

const labelOf = (path) => path.replace(/^component\./, "").replace(/\.@$/, "");

/**
 * The tokens a reference reads once the brand theme's hops are folded away: the reference itself, or
 * for a theme token every primitive or semantic its own value names. A theme token that holds its
 * value itself reads nothing.
 */
function throughTheme(index, path, seen = new Set()) {
  if (!isTheme(path)) return index.byPath.has(path) ? [path] : [];
  if (seen.has(path)) return [];
  seen.add(path);
  return refsIn(index.byPath.get(path)?.$value).flatMap((r) => throughTheme(index, refPath(index, r), seen));
}

/**
 * The graph of one scheme in one brand and mode. { nodes: [{ id, tier, label, value, type,
 * description, theme? }], edges: [{ from, to }] }. An edge runs from the token a value comes from to
 * its reader. theme marks a token whose value goes through the brand theme.
 */
export function tokenGraph({ scheme, brand, mode }) {
  const index = tokenIndex(scheme, { brand, mode });
  const primitives = new Set(flatTokens(scheme.tokens.primitive).map(([p]) => p));
  const nodes = new Map();
  const edges = [];
  const edgeKeys = new Set();

  for (const [path, token] of index.byPath) {
    if (isTheme(path)) continue;
    const value = resolvedValue(index, path);
    const end = aliasChain(index, path).end;
    const type = token.$type ?? index.byPath.get(end)?.$type ?? (COLOR.test(value) ? "color" : null);
    const why = token.$extensions?.["open-ds"]?.why;
    const refs = refsIn(token.$value).map((r) => refPath(index, r));
    nodes.set(path, {
      id: path,
      tier: tierOf(path, primitives),
      label: labelOf(path),
      value,
      type,
      description: why ?? token.$description ?? null,
      ...(refs.some(isTheme) && { theme: true }),
    });
    for (const from of refs.flatMap((r) => throughTheme(index, r))) {
      const key = `${from}>${path}`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ from, to: path });
    }
  }

  const rank = (n) => TIERS.indexOf(n.tier);
  return {
    nodes: [...nodes.values()].sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id)),
    edges,
  };
}

/**
 * The map file for one scheme: each brand asked for (every brand by default) in light and dark, keyed
 * "<brand>/<mode>". The docs generator writes it under static/token-map/.
 */
export function tokenMap({ scheme, brands = Object.keys(scheme.tokens.brands) }) {
  const graphs = {};
  for (const brand of brands)
    for (const mode of ["light", "dark"]) graphs[`${brand}/${mode}`] = tokenGraph({ scheme, brand, mode });
  return {
    scheme: scheme.id,
    name: scheme.name,
    tiers: TIERS.map((id) => ({ id, label: TIER_LABELS[id] })),
    brands,
    graphs,
  };
}
