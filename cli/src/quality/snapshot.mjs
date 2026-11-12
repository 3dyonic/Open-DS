// A snapshot of one scheme for the quality gate (OD-298): its decisions, the resolved value of every
// semantic token in every brand and mode, where each value comes from, its trace and reason, the
// relations it keeps, and what moves when one answer or one anchor changes. Pure: the caller passes
// the ref's own token builder (themeTokens) and loader (reload), so a snapshot of any ref reads the
// same way.
import { scale as rampScale } from "../ramps.mjs";
import { pairsIn } from "../tones.mjs";
import { reasonOf, traceScheme, weakReasons } from "../trace.mjs";
import { blastRadius } from "./blast.mjs";
import { RELATION_TOKENS, evaluateRelations, relationLinks } from "./relations.mjs";
import { flatMap, hex6, namedStep, px, resolveTree, shortName } from "./values.mjs";

const REF = /\{([^}]+)\}/g;
const cssOf = (path) => shortName(path).split(".").join("-");
const extOf = (node) => node?.$extensions?.["open-ds"] ?? {};
const at = (tree, path) => path.split(".").reduce((n, k) => (n && typeof n === "object" ? n[k] : undefined), tree);

/** The scheme's themes: its own list, or each brand in light and dark. */
export function themesOf(scheme) {
  const brands = Object.keys(scheme.tokens?.brands ?? {});
  if (scheme.themes?.length) return scheme.themes.map((t) => ({ id: t.id, brand: t.brand ?? brands[0], mode: t.mode ?? t.id }));
  return brands.flatMap((b) => ["light", "dark"].map((m) => ({ id: brands.length > 1 ? `${b}-${m}` : m, brand: b, mode: m })));
}

/** The semantic token paths, deprecated aliases left out (they decide nothing of their own). */
export function semanticPaths(scheme) {
  return [...flatMap(scheme.tokens?.semantic)].filter(([, t]) => !t.$deprecated).map(([p]) => p);
}

// Tree paths to resolve, and the snapshot name of each: semantics by their short name, the relations'
// component keys as component.<path>.
function pathsToResolve(scheme) {
  const comp = flatMap(scheme.tokens?.component);
  const extra = RELATION_TOKENS.map((n) => n.slice("component.".length)).filter((p) => comp.has(p) || comp.has(`${p}.@`));
  const semantics = semanticPaths(scheme);
  const isSemantic = new Set(semantics);
  return {
    paths: [...semantics, ...extra.map((p) => (comp.has(p) ? p : `${p}.@`))],
    name: (p) => (isSemantic.has(p) ? shortName(p) : `component.${shortName(p)}`),
  };
}

/** Every theme's resolved values and chains: { values: { theme: {…} }, chains: { theme: {…} }, errors }. */
export function resolveScheme(scheme, themeTokens) {
  const { paths, name } = pathsToResolve(scheme);
  const values = {};
  const chains = {};
  const errors = [];
  for (const t of themesOf(scheme)) {
    const r = resolveTree(themeTokens(scheme, t.brand, t.mode), paths, name);
    values[t.id] = r.values;
    chains[t.id] = r.chains;
    errors.push(...r.errors.map((e) => `${t.id}: ${e}`));
  }
  return { values, chains, errors };
}

// The facts the relations read.
function factsOf(scheme, themes, values, generateScale) {
  const prim = scheme.tokens?.primitive ?? {};
  const scaleOf = (group) =>
    [...flatMap(at(prim, group))].map(([p, t]) => ({ path: `${group}.${p}`, px: px(t.$value) })).filter((s) => s.px !== null && Number.isFinite(s.px));
  const map = scheme.tokens?.semantic?.["component-spacing-map"];
  const mapExt = extOf(map);
  const steps = [...flatMap(map)]
    .filter(([, t]) => extOf(t).multiplier !== undefined)
    .map(([p, t]) => ({ token: `component-spacing-map.${p}`, multiplier: extOf(t).multiplier, fixed: !!extOf(t).fixed }));
  const base = Object.entries(prim.space ?? {}).find(([k, v]) => !k.startsWith("$") && px(v?.$value) === 4);
  // The dark canvas the dark scales are generated over, as the scale check reads it (first brand).
  const darkTheme = themes.find((t) => t.mode === "dark");
  const canvas = String(values[darkTheme?.id]?.["color.surface.canvas"] ?? "").slice(0, 7);
  const colorScales = [];
  for (const [hue, group] of Object.entries(prim.color ?? {})) {
    const spec = extOf(group);
    if (!spec.light?.key && !spec.dark?.key) continue;
    for (const mode of ["light", "dark"]) {
      if (!spec[mode]?.key || (mode === "dark" && !/^#[0-9a-f]{6}$/i.test(canvas))) continue;
      const want = generateScale(spec[mode], mode, canvas);
      for (const [step, generated] of Object.entries(want))
        colorScales.push({ hue, mode, step, key: spec[mode].key, stored: group[mode]?.[step]?.$value ?? null, generated });
    }
  }
  return {
    themes,
    values,
    answers: Object.fromEntries((scheme.answers ?? []).map((a) => [a.question, a.option])),
    scales: Object.fromEntries(["space", "size", "radius", "border-width"].map((g) => [g, scaleOf(g)])),
    spacingMap: steps.length ? { rhythm: mapExt.rhythm ?? 1, fixed: mapExt.fixed ?? [], steps } : null,
    baseStep: base ? { path: `space.${base[0]}`, px: 4 } : null,
    colorScales,
    darkCanvas: /^#[0-9a-f]{6}$/i.test(canvas) ? canvas : null,
  };
}

/**
 * Where a value comes from: "relation" (a recorded relation gives it and holds), "alias" (it names
 * another semantic), "scale" (it ends on a step of a color scale or the easing set, or on a scale step whose value is its
 * name) or "literal" (a raw value someone typed, such as a hex in place of a step).
 */
export function originOf({ token, chain, semantics, heldRelations, primitives }) {
  if (heldRelations.has(token)) return "relation";
  const first = chain.hops[0];
  if (first && semantics.has(shortName(first))) return "alias";
  if (!chain.hops.length || !primitives.has(chain.end)) return "literal";
  if (chain.end.startsWith("color.")) return "scale";
  // An easing curve has no number to name it by: a named step of the easing set is a scale step, not a typed value.
  if (chain.end.startsWith("easing.")) return "scale";
  return namedStep(chain.end, primitives.get(chain.end).$value) ? "scale" : "literal";
}

// Every reason a scheme writes, with where it is: answers, usage rules, token and pick reasons.
function reasonsOf(scheme) {
  const out = [];
  for (const a of scheme.answers ?? []) if (a.why) out.push({ where: `answer ${a.question}`, text: a.why });
  for (const u of scheme.usage ?? []) if (u.why) out.push({ where: `usage ${u.situation}`, text: u.why });
  for (const [p, t] of flatMap(scheme.tokens?.semantic)) if (extOf(t).why) out.push({ where: `token ${shortName(p)}`, text: extOf(t).why });
  for (const [brand, def] of Object.entries(scheme.tokens?.brands ?? {}))
    for (const part of ["base", "light", "dark"])
      for (const [p, t] of flatMap(def.theme?.[part])) if (extOf(t).why) out.push({ where: `pick ${brand}/${part} ${shortName(p)}`, text: extOf(t).why });
  return out;
}

/**
 * The hue of the primary action's color scale: the first theme whose chain ends on a scale step, else
 * the step a raw hex copies, so a hard-coded primary still finds its anchor. null when neither does.
 */
export function primaryHueOf(scheme, themes, chains, values) {
  for (const t of themes) {
    const hue = chains[t.id]?.["color.action.primary"]?.end?.match(/^color\.([a-z0-9-]+)\.(light|dark)\.[^.]+$/)?.[1];
    if (hue) return hue;
  }
  const palette = paletteOf(scheme);
  for (const t of themes) {
    const hex = hex6(values[t.id]?.["color.action.primary"]);
    const hue = hex && Object.keys(palette).find((h) => Object.values(palette[h]).some((row) => Object.values(row).includes(hex)));
    if (hue) return hue;
  }
  return null;
}

/**
 * The reason recorded for each semantic value itself: the token's own why, else its theme pick's why in
 * any brand and mode. Map(name → why). A group's or a usage rule's text is about many values, so it is
 * not one.
 */
export function ownReasons(scheme) {
  const out = new Map();
  for (const [p, t] of flatMap(scheme.tokens?.semantic)) {
    let why = extOf(t).why ?? null;
    const pick = typeof t.$value === "string" && t.$value.match(/^\{theme\.([^}]+)\}$/)?.[1];
    for (const def of Object.values(scheme.tokens?.brands ?? {}))
      for (const part of ["base", "light", "dark"]) {
        const node = pick && at(def.theme?.[part], pick);
        why ??= extOf(node?.["@"] ?? node).why ?? null;
      }
    if (why) out.set(shortName(p), why);
  }
  return out;
}

// Every {reference} the scheme's own tokens make, by short name. A {theme.…} reference points at the
// theme layer, never at another semantic, so it does not count.
function referencedNames(scheme) {
  const names = new Set();
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if ("$value" in node) {
      for (const m of JSON.stringify(node.$value).matchAll(REF)) {
        if (m[1].startsWith("theme.")) continue;
        names.add(shortName(m[1]));
        // A key that names the fill it sits on reads the text pair its fill's tone picks: both of them.
        if (extOf(node).on) names.add(shortName(m[1]).replace(/-on-(light|dark)$/, (x, t) => `-on-${t === "light" ? "dark" : "light"}`));
      }
      return;
    }
    for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v);
  };
  walk(scheme.tokens?.semantic);
  walk(scheme.tokens?.component);
  for (const b of Object.values(scheme.tokens?.brands ?? {})) walk(b.theme);
  return names;
}

/**
 * The snapshot of one scheme. scheme is the scheme as the ref's loader gives it; stored is its file;
 * themeTokens(scheme, brand, mode) is the ref's token builder; reload(stored) loads a changed file with
 * the ref's loader (omit it to skip the blast radius); generateScale(spec, mode, canvas) is the ref's
 * color scale generator; css is { tokens, theme, shadcn } text or null.
 */
export function snapshotScheme({ scheme, stored, grammar, themeTokens, reload, generateScale = rampScale, css = null, uiPairs = [] }) {
  const themes = themesOf(scheme);
  const { values, chains, errors } = resolveScheme(scheme, themeTokens);
  const facts = factsOf(scheme, themes, values, generateScale);
  const relations = evaluateRelations(facts);
  const links = relationLinks(facts);

  const semantics = new Set(semanticPaths(scheme).map(shortName));
  const primitives = flatMap(scheme.tokens?.primitive);
  const spacing = relations.find((r) => r.id === "spacing-map");
  const heldRelations = new Set((spacing?.checks ?? []).filter((c) => c.pass).map((c) => c.subject));
  const origin = {};
  for (const t of themes) {
    origin[t.id] = {};
    for (const [token, chain] of Object.entries(chains[t.id]))
      if (!token.startsWith("component."))
        origin[t.id][token] = originOf({ token, chain, semantics, heldRelations, primitives });
  }

  const trace = traceScheme(scheme, grammar);
  const weak = new Map(weakReasons(trace).map((w) => [w.token, w.problem]));
  const own = ownReasons(scheme);
  const traced = trace.tokens.map((t) => {
    const r = reasonOf(t);
    return { token: t.token, because: t.because, reason: r.kind, why: r.why ?? null, ownWhy: own.get(t.token) ?? null, weak: weak.get(t.token) ?? null };
  });

  const pairs = {};
  for (const t of themes) {
    let list = [];
    try {
      list = pairsIn(grammar, scheme, t.brand, t.mode);
    } catch {
      list = [];
    }
    pairs[t.id] = list.map((p) => ({ key: shortName(p.key), on: shortName(p.on), contrast: p.contrast, ...(p.waits && { waits: true }) }));
  }

  const blast = reload
    ? blastRadius({
        stored,
        grammar,
        trace,
        values,
        chains,
        links,
        primaryHue: primaryHueOf(scheme, themes, chains, values),
        darkCanvas: facts.darkCanvas,
        colorScales: facts.colorScales,
        generateScale,
        reload,
        resolve: (changed) => resolveScheme(changed, themeTokens),
      })
    : [];

  const referenced = referencedNames(scheme);
  const cssName = (name) => name.replace(/\.@$/, "").split(".").join("-");
  return {
    id: scheme.id,
    themes,
    decisions: {
      answers: (scheme.answers ?? []).map((a) => ({ question: a.question, option: a.option, why: a.why ?? null, because: a.because ?? [] })),
      usage: (scheme.usage ?? []).map((u) => ({ situation: u.situation, use: u.use ?? null, why: u.why ?? null, because: u.because ?? [] })),
    },
    values,
    chains,
    origin,
    errors,
    trace: traced,
    pairs,
    relations,
    blast,
    reasons: reasonsOf(scheme),
    tokens: {
      semantic: semantics.size,
      component: flatMap(scheme.tokens?.component).size,
      referenced: [...semantics].filter((n) => referenced.has(n)),
      css: Object.fromEntries([...semantics].map((n) => [n, cssName(n)])),
    },
    css: css && {
      bytes: Buffer.byteLength(css.tokens ?? "", "utf8"),
      properties: new Set([...(css.tokens ?? "").matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1])).size,
      reads: [...new Set([...`${css.theme ?? ""}\n${css.shadcn ?? ""}`.matchAll(/var\(--([a-z0-9-]+)/g)].map((m) => m[1]))].sort(),
    },
    palette: paletteOf(scheme),
    keys: keysOf(scheme),
    componentPairs: { pairs: uiPairs, values: componentPairValues(scheme, themeTokens, uiPairs) },
  };
}

/** Every color step of the scheme's scales: { hue: { mode: { step: "#RRGGBB" } } }, 6-digit hex only. */
export function paletteOf(scheme) {
  const out = {};
  for (const [hue, group] of Object.entries(scheme.tokens?.primitive?.color ?? {})) {
    if (hue.startsWith("$") || !group || typeof group !== "object") continue;
    for (const mode of ["light", "dark"])
      for (const [step, t] of Object.entries(group[mode] ?? {}))
        if (!step.startsWith("$") && hex6(t?.$value)) ((out[hue] ??= {})[mode] ??= {})[step] = hex6(t.$value);
  }
  return out;
}

/** The key color each generated hue records, and its adjustments: { hue: { mode: { key, adjust } } }. */
export function keysOf(scheme) {
  const out = {};
  for (const [hue, group] of Object.entries(scheme.tokens?.primitive?.color ?? {})) {
    const spec = extOf(group);
    for (const mode of ["light", "dark"])
      if (spec[mode]?.key) (out[hue] ??= {})[mode] = { key: String(spec[mode].key).toUpperCase(), adjust: spec[mode].adjust ?? null };
  }
  return out;
}

/**
 * The values of the variables the component pairs name, in every theme: { theme: { variable: value } }.
 * A component key's variable drops the base "@", as the build names it.
 */
export function componentPairValues(scheme, themeTokens, pairs) {
  const wanted = new Set(pairs.flatMap((p) => [p.fg, p.bg].filter(Boolean)));
  if (!wanted.size) return {};
  const byCss = new Map();
  for (const p of flatMap(scheme.tokens?.component).keys()) byCss.set(cssOf(p), p);
  for (const p of semanticPaths(scheme)) if (!byCss.has(cssOf(p))) byCss.set(cssOf(p), p);
  const paths = [...wanted].filter((c) => byCss.has(c)).map((c) => byCss.get(c));
  const out = {};
  for (const t of themesOf(scheme)) out[t.id] = resolveTree(themeTokens(scheme, t.brand, t.mode), paths, cssOf).values;
  return out;
}
