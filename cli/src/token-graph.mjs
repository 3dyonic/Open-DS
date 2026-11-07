// The token map (OD-274): every token of one scheme, brand and mode as a graph, from the decisions
// through the primitives, the brand theme, the semantics and the component keys to the components
// whose code reads them. An edge points the way a value flows: from the token a value comes from to
// the token (or component) that reads it. The docs' Token map page draws a focused trace of it.
//
// Resolution is lands.mjs's (tokenIndex, refPath, aliasChain, directReads), and a decision's reach is
// the anatomy's (a theme pick's because, else the owning scope's values and definition answers), so the
// map, the Anatomy reference and the agents' component API never disagree.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ownerScope, shown } from "./anatomy.mjs";
import { componentsFor } from "./components.mjs";
import { aliasChain, directReads, refPath, tokenIndex } from "./lands.mjs";
import { questions } from "./schemes.mjs";
import { flatTokens } from "./tokens.mjs";

export { trace } from "./token-trace.mjs";

/** The tiers, left to right, as the map lays them out. */
export const TIERS = ["decision", "primitive", "theme", "semantic", "component-key", "component"];

/** Plain labels for the tiers, for the map's column heads. */
export const TIER_LABELS = {
  decision: "Decision",
  primitive: "Primitive",
  theme: "Brand theme",
  semantic: "Semantic",
  "component-key": "Component key",
  component: "Component",
};

const REF = /\{([^{}]+)\}/g;
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color\()/i;
const decisionId = (question) => `decision/${question}`;
const componentId = (name) => `ui/${name}`;

/** The source of each component a scheme gets, by name: the one file read the graph needs. */
export function componentSources(scheme, roots) {
  return Object.fromEntries(
    componentsFor(scheme, roots).map((name) => [
      name,
      readFileSync(join(roots.ui, "components", `${name}.tsx`), "utf8"),
    ]),
  );
}

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

const tierOf = (path, primitives) =>
  path.startsWith("theme.")
    ? "theme"
    : path.startsWith("component.")
      ? "component-key"
      : primitives.has(path)
        ? "primitive"
        : "semantic";

const labelOf = (path) => path.replace(/^(theme|component)\./, "").replace(/\.@$/, "");

/**
 * The graph of one scheme in one brand and mode. { nodes: [{ id, tier, label, value, type,
 * description }], edges: [{ from, to, kind, via? }] }. A reference edge runs from the token a value
 * comes from to its reader; a decision edge runs from an answered question to the primitive its pick
 * lands on, with via naming the token whose pick it is. sources is componentSources(scheme, roots).
 */
export function tokenGraph({ scheme, grammar, sources, brand, mode }) {
  const index = tokenIndex(scheme, { brand, mode });
  const primitives = new Set(flatTokens(scheme.tokens.primitive).map(([p]) => p));
  const nodes = new Map();
  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (edge) => {
    const key = `${edge.from}>${edge.to}>${edge.kind}>${edge.via ?? ""}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push(edge);
  };

  for (const [path, token] of index.byPath) {
    const tier = tierOf(path, primitives);
    const value = resolvedValue(index, path);
    const end = aliasChain(index, path).end;
    const type = token.$type ?? index.byPath.get(end)?.$type ?? (COLOR.test(value) ? "color" : null);
    const why = token.$extensions?.["open-ds"]?.why;
    nodes.set(path, {
      id: path,
      tier,
      label: labelOf(path),
      value,
      type,
      description: why ?? token.$description ?? null,
    });
  }
  for (const [path, token] of index.byPath)
    for (const ref of refsIn(token.$value)) addEdge({ from: refPath(index, ref), to: path, kind: "reference" });

  for (const [name, src] of Object.entries(sources)) {
    const item = grammar.catalogue?.items?.find((x) => x.id === name);
    nodes.set(componentId(name), {
      id: componentId(name),
      tier: "component",
      label: name,
      value: null,
      type: null,
      description: item?.description ?? null,
    });
    for (const path of directReads(src, index))
      addEdge({ from: path, to: componentId(name), kind: "reference" });
  }

  // Decisions: a theme pick names the answers it follows (because). A semantic with no theme pick is
  // set by the answers of the scope that owns it (its values and definition), as the anatomy reads it.
  const qs = questions(grammar);
  const answers = new Map(scheme.answers.map((a) => [a.question, a]));
  const decide = (question, via) => {
    const a = answers.get(question);
    const q = qs[question];
    if (!a || !q) return;
    const id = decisionId(question);
    if (!nodes.has(id))
      nodes.set(id, {
        id,
        tier: "decision",
        label: q.text,
        value: q.options?.find((o) => o.id === a.option)?.label ?? a.option,
        type: null,
        description: a.why ?? null,
        question,
      });
    const end = aliasChain(index, via).end;
    const lands = end !== via && primitives.has(end);
    addEdge({ from: id, to: lands ? end : via, kind: "decision", ...(lands && { via }) });
  };
  for (const [path, token] of index.byPath) {
    if (path.startsWith("theme."))
      for (const q of token.$extensions?.["open-ds"]?.because ?? []) decide(q, path);
    else if (nodes.get(path).tier === "semantic") {
      const raw = typeof token.$value === "string" ? token.$value : "";
      if (/^\{theme\./.test(raw)) continue;
      const scope = ownerScope(grammar, labelOf(path));
      for (const q of scope?.questions ?? []) if (/\.(values|definition)$/.test(q.id)) decide(q.id, path);
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
export function tokenMap({ scheme, grammar, sources, brands = Object.keys(scheme.tokens.brands) }) {
  const graphs = {};
  for (const brand of brands)
    for (const mode of ["light", "dark"])
      graphs[`${brand}/${mode}`] = tokenGraph({ scheme, grammar, sources, brand, mode });
  return {
    scheme: scheme.id,
    name: scheme.name,
    tiers: TIERS.map((id) => ({ id, label: TIER_LABELS[id] })),
    brands,
    graphs,
  };
}
