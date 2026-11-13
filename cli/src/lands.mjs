// Where each scope lands (OD-233): every component whose source reads a token the scope owns, traced
// from the component's own code. A component reads its component keys (var(--button-padding-x)) and
// shadcn's utilities (bg-primary, rounded-md); each leads, through the keys and the semantics, to the
// tokens a scope owns. Copy is read by the stories from the scheme's samples, so the voice scope lands
// in every component whose story reads them. The grammar's lands_in is written from this, and the
// harness fails when the two differ.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SHADCN, SHADCN_SCALE } from "./shadcn.mjs";
import { componentsInMode, cssName, flatTokens } from "./tokens.mjs";

const REF = /\{([^}]+)\}/g;
const UTIL =
  /\b(?:bg|text|border|border-[tblrxy]|ring|ring-offset|fill|stroke|outline|divide|placeholder|caret|accent|decoration)-([a-z0-9-]+)/g;
const SCALE = /\b(rounded|shadow|text)-(xs|sm|md|lg|xl|base|2xl)\b/g;

/**
 * Every token of a scheme by its CSS name, and by its path, with the theme under "theme.". With a brand
 * and mode, the theme is that brand's base and mode only, so references resolve as in that theme.
 */
// One index per token tree and theme: building it reads every token, and the docs, the gap ledger and
// the anatomy traces ask for the same one thousands of times. A tree is not changed after it is
// indexed; code that edits a scheme loads it again (structuredClone gives a new tree).
const INDEX = new WeakMap();
export function tokenIndex(scheme, { brand, mode } = {}) {
  const k = `${brand ?? ""}|${mode ?? ""}`;
  let byTree = INDEX.get(scheme.tokens);
  if (!byTree) INDEX.set(scheme.tokens, (byTree = new Map()));
  if (!byTree.has(k)) byTree.set(k, buildIndex(scheme, { brand, mode }));
  return byTree.get(k);
}
function buildIndex(scheme, { brand, mode }) {
  const t = scheme.tokens;
  const byPath = new Map();
  const add = (tree, prefix = []) => {
    for (const [p, tok] of flatTokens(tree, prefix)) byPath.set(p, tok);
  };
  add(t.primitive);
  add(t.semantic);
  // A key that reads a palette step reads it from this mode's ramp, as the build does (OD-309).
  add({ component: mode ? componentsInMode(t.component, mode) : t.component });
  if (brand && mode) {
    const th = t.brands[brand].theme;
    add(th.base ?? {}, ["theme"]);
    add(th[mode] ?? {}, ["theme"]);
  } else
    for (const b of Object.values(t.brands ?? {}))
      for (const m of Object.keys(b.theme ?? {})) add(b.theme[m], ["theme"]);
  const byCss = new Map();
  for (const p of byPath.keys()) {
    byCss.set(cssName(p), p);
    if (p.startsWith("component.")) byCss.set(cssName(p.slice(10)), p);
  }
  return { byPath, byCss };
}

/** The token paths a component's source names directly: its component keys and shadcn's utilities. */
export function directReads(src, index) {
  const start = new Set();
  for (const m of src.matchAll(/var\(--([a-z0-9-]+)\)/g)) {
    const p = index.byCss.get(m[1]);
    if (p) start.add(p);
  }
  // utilities, read with every var(--…) taken out so a variable's own name never counts as a class
  const plain = src.replace(/var\(--[a-z0-9-]+\)/g, "");
  for (const m of plain.matchAll(UTIL)) {
    const css = SHADCN[m[1]];
    const p = css && index.byCss.get(css);
    if (p) start.add(p);
  }
  for (const m of plain.matchAll(SCALE)) {
    const v = SHADCN_SCALE[`--${m[1] === "rounded" ? "radius" : m[1]}-${m[2]}`];
    const css = v && v.match(/var\(--([a-z0-9-]+)\)/)?.[1];
    const p = css && index.byCss.get(css);
    if (p) start.add(p);
  }
  return start;
}

/** The token paths a component's source reads, followed through every reference. */
export function readsOfSource(src, index) {
  const start = directReads(src, index);
  const seen = new Set();
  const walk = (p) => {
    if (seen.has(p)) return;
    seen.add(p);
    const v = index.byPath.get(p)?.$value;
    for (const m of JSON.stringify(v ?? "").matchAll(REF)) {
      const r = m[1];
      if (index.byPath.has(r)) walk(r);
      else if (index.byPath.has(`theme.${r.replace(/^theme\./, "")}`))
        walk(`theme.${r.replace(/^theme\./, "")}`);
    }
  };
  for (const p of start) walk(p);
  return seen;
}

/** Whether a scope's owns entry (a token path or family) covers a token path. */
export const owns = (path, o) => {
  const p = path.replace(/^theme\./, "");
  return (
    path === o ||
    path.startsWith(`${o}.`) ||
    p === o ||
    p.startsWith(`${o}.`) ||
    (o === "theme" && path.startsWith("theme."))
  );
};

/**
 * { scopeId: [component, …] }: every component (by file name in ui/src/components) that reads a token
 * the scope owns, in any scheme; and for scopes that own copy (content), every component whose story
 * reads the scheme's samples.
 */
export function landsIn(schemes, grammar, roots) {
  const dir = join(roots.ui, "components");
  const names = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort();
  const reads = Object.fromEntries(names.map((n) => [n, new Set()]));
  for (const s of schemes) {
    const index = tokenIndex(s);
    for (const n of names)
      for (const p of readsOfSource(
        readFileSync(join(dir, `${n}.tsx`), "utf8"),
        index,
      ))
        reads[n].add(p);
  }
  const story = (n) => {
    const f = roots.stories && join(roots.stories, `${n}.stories.tsx`);
    return f && existsSync(f) ? readFileSync(f, "utf8") : "";
  };
  const out = {};
  for (const sc of grammar.scopes) {
    const list = names.filter((n) => {
      if ((sc.owns ?? []).some((o) => o === "content"))
        return /\bsamples\b|\bcontent\b/.test(story(n));
      return [...reads[n]].some((p) => (sc.owns ?? []).some((o) => owns(p, o)));
    });
    out[sc.id] = list;
  }
  return out;
}

/**
 * The index path a reference names ({color.neutral.900} inside a theme is theme.color.neutral.900).
 * A name the index does not hold comes back as written.
 */
export function refPath(index, ref) {
  if (index.byPath.has(ref)) return ref;
  const inTheme = `theme.${ref.replace(/^theme\./, "")}`;
  if (index.byPath.has(inTheme)) return inTheme;
  // A component key that aliases another (a deprecated key, OD-241) names it without "component.",
  // as the build sees the tree.
  if (index.byPath.has(`component.${ref}`)) return `component.${ref}`;
  return ref;
}

/**
 * A token's alias chain in one brand and mode, as a reader sees it: the named tokens it passes through
 * (the theme's internal hops left out), the neutral step if it goes through one, and the value it ends at.
 * { hops: [path, …], value }
 */
export function aliasChain(index, path) {
  const hops = [];
  let p = path;
  for (let i = 0; i < 16; i++) {
    const v = index.byPath.get(p)?.$value;
    const m = typeof v === "string" && v.match(/^\{([^}]+)\}$/);
    if (!m) return { hops, value: v ?? null, end: p };
    const r = refPath(index, m[1]);
    if (!r.startsWith("theme.")) hops.push(r);
    p = r;
  }
  return { hops, value: null, end: p };
}

/**
 * A component's token API (OD-234), for agents (get_component, get_context, open-ds component): every
 * token its code reads, the semantic each aliases, its CSS variable, and the primitive and value it ends
 * at in every theme, with whether it changes with the theme. The same data the docs' "Tokens it reads"
 * table shows.
 */
export function componentApi(scheme, comp, roots) {
  const file = join(roots.ui, "components", `${comp}.tsx`);
  if (!existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const all = tokenIndex(scheme);
  const brands = Object.keys(scheme.tokens.brands);
  const themes = (scheme.themes ?? []).map((t) => ({
    id: t.id,
    ix: tokenIndex(scheme, {
      brand: t.brand ?? brands[0],
      mode: t.mode ?? t.id,
    }),
  }));
  return [...directReads(src, all)]
    .sort(
      (a, b) =>
        Number(!a.startsWith("component.")) -
          Number(!b.startsWith("component.")) || a.localeCompare(b),
    )
    .map((p) => {
      const values = Object.fromEntries(
        themes.map((t) => {
          const ch = aliasChain(t.ix, p);
          return [t.id, { primitive: ch.end, value: ch.value }];
        }),
      );
      const first = themes[0] && aliasChain(themes[0].ix, p).hops[0];
      const vs = Object.values(values).map((v) => JSON.stringify(v.value));
      return {
        token: p.replace(/\.@$/, ""),
        own: p.startsWith("component."),
        aliases: first ? first.replace(/\.@$/, "") : null,
        css: `--${cssName(p.replace(/^component\./, ""))}`,
        changes_with_theme: new Set(vs).size > 1,
        values,
      };
    });
}
