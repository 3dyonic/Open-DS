// The token map (OD-274): every token of one scheme, brand and mode as a graph, from the primitives
// through the semantics to the component tokens. An edge points the way a value flows: from the token
// a value comes from to the token that reads it. The brand theme is not a tier: a semantic whose value
// goes through the theme reads the primitive (or semantic) the theme picks, and says so (theme: true).
// The docs' Token map page reads the colors in it: a color value, the semantic tokens that read it
// and the component tokens that read those (color-map.mjs).
//
// Resolution is lands.mjs's (tokenIndex, refPath, aliasChain), so the map, the Anatomy reference and
// the agents' component API never disagree.
import { shown } from "./anatomy.mjs";
import { aliasChain, refPath, tokenIndex } from "./lands.mjs";
import { grammar as readGrammar, questions } from "./schemes.mjs";
import { flatTokens } from "./tokens.mjs";
import { traceScheme } from "./trace.mjs";

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

// The open-ds extension of a token: its why, the grammar questions it follows (because) and its tone.
const extOf = (token) => token?.$extensions?.["open-ds"] ?? {};

/**
 * The answers a semantic token's pick records, as { question, answer } in plain words: the grammar
 * questions its own because and its theme picks' because name, each with the option the scheme
 * chose. A question the scheme does not answer is left out.
 */
function answersOf({ index, path, scheme, asked, traced }) {
  const token = index.byPath.get(path);
  const picks = refsIn(token?.$value)
    .map((r) => refPath(index, r))
    .filter(isTheme)
    .map((p) => index.byPath.get(p));
  // This brand and mode's picks first, then every other link the trace engine finds.
  const ids = [
    ...new Set([...[token, ...picks].flatMap((t) => extOf(t).because ?? []), ...(traced.get(labelOf(path))?.because ?? [])]),
  ];
  return ids.flatMap((id) => {
    const q = asked[id];
    const chosen = scheme.answers?.find((a) => a.question === id);
    const option = q?.options?.find((o) => o.id === chosen?.option);
    return q && option ? [{ id, question: q.text, answer: option.label }] : [];
  });
}

/**
 * Every answer the scheme gives, keyed by question id, in plain words: { group, question, answer,
 * why, because }. because lists the question ids the answer follows from (a chain of reasons ends at
 * an answer with none). The Token map draws a decision's chain of reasons from it.
 */
export function reasonsOf(scheme, grammar = readGrammar()) {
  const asked = questions(grammar);
  const out = {};
  for (const a of scheme.answers ?? []) {
    const q = asked[a.question];
    const option = q?.options?.find((o) => o.id === a.option);
    if (!q || !option) continue;
    out[a.question] = {
      group: q.groupTitle,
      question: q.text,
      answer: option.label,
      why: a.why ?? null,
      because: (a.because ?? []).filter((id) => asked[id]),
    };
  }
  return out;
}

// The tone a theme pick records for a fill ("light" or "dark"): the text that sits on it follows it.
function toneOf(index, path) {
  const pick = refsIn(index.byPath.get(path)?.$value)
    .map((r) => refPath(index, r))
    .find(isTheme);
  return pick ? (extOf(index.byPath.get(pick)).tone ?? null) : null;
}

/**
 * The graph of one scheme in one brand and mode. { nodes: [{ id, tier, label, value, type,
 * description, theme?, answers?, tone?, deprecated? }], edges: [{ from, to }] }. An edge runs from the token a
 * value comes from to its reader. theme marks a token whose value goes through the brand theme.
 * description is the token's own $description. A semantic token holds answers, the grammar answers
 * its pick records and the trace engine finds ([{ question, answer }]), and tone, the tone its fill
 * records, when it has one. Pass trace (traceScheme) when building several graphs of one scheme.
 */
export function tokenGraph({ scheme, brand, mode, grammar = readGrammar(), trace = traceScheme(scheme, grammar) }) {
  const index = tokenIndex(scheme, { brand, mode });
  const asked = questions(grammar);
  const traced = new Map(trace.tokens.map((t) => [t.token, t]));
  const primitives = new Set(flatTokens(scheme.tokens.primitive).map(([p]) => p));
  const nodes = new Map();
  const edges = [];
  const edgeKeys = new Set();

  for (const [path, token] of index.byPath) {
    if (isTheme(path)) continue;
    const value = resolvedValue(index, path);
    const end = aliasChain(index, path).end;
    const type = token.$type ?? index.byPath.get(end)?.$type ?? (COLOR.test(value) ? "color" : null);
    const refs = refsIn(token.$value).map((r) => refPath(index, r));
    const tier = tierOf(path, primitives);
    const answers = tier === "semantic" ? answersOf({ index, path, scheme, asked, traced }) : [];
    const tone = tier === "semantic" ? toneOf(index, path) : null;
    nodes.set(path, {
      id: path,
      tier,
      label: labelOf(path),
      value,
      type,
      description: token.$description ?? null,
      ...(refs.some(isTheme) && { theme: true }),
      ...(answers.length && { answers }),
      ...(tone && { tone }),
      // A deprecated alias decides nothing of its own (OD-286); the Token map draws no decision for it.
      ...(token.$deprecated && { deprecated: true }),
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
 * "<brand>/<mode>", and the grammar's scopes that own tokens ([{ id, title, owns }]), in the
 * grammar's order. The docs generator writes it under static/token-map/.
 */
export function tokenMap({ scheme, brands = Object.keys(scheme.tokens.brands), grammar = readGrammar() }) {
  const graphs = {};
  const trace = traceScheme(scheme, grammar);
  for (const brand of brands)
    for (const mode of ["light", "dark"]) graphs[`${brand}/${mode}`] = tokenGraph({ scheme, brand, mode, grammar, trace });
  return {
    scheme: scheme.id,
    name: scheme.name,
    tiers: TIERS.map((id) => ({ id, label: TIER_LABELS[id] })),
    scopes: grammar.scopes
      .filter((s) => (s.owns ?? []).length)
      .map((s) => ({ id: s.id, title: s.title, owns: s.owns })),
    brands,
    graphs,
    reasons: reasonsOf(scheme, grammar),
  };
}
