// Shape and elevation relations. Two corners are decisions (control, surface); option,
// element and badge follow them by a relation. The focus ring follows the default line, and the
// shadows form one scale by layer. The grammar's shape and elevation scopes define each relation;
// each scheme records which relation each token follows, with its inputs (scheme.relations). This
// module checks every record against the scheme's values in every brand and mode. No file access:
// the caller passes the scheme and the grammar.
import { aliasChain, tokenIndex } from "./lands.mjs";

/** A dimension in px: "0.25rem" is 4, "2px" is 2, a pill ("calc(infinity * 1px)") is Infinity. */
export function px(value) {
  const v = String(value ?? "").trim();
  if (/infinity/i.test(v)) return Infinity;
  const m = /^(-?[\d.]+)(px|rem)?$/.exec(v);
  if (!m) return null;
  return m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1]);
}

/** How a px value reads in a sentence: 4px, or "pill". */
export const pxText = (n) => (n === Infinity ? "pill" : n === null ? "?" : `${n}px`);

const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const alphaOf = (hex) => (hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1);
const luminance = (rgb) =>
  rgb
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);

/** The WCAG contrast ratio of two opaque colors, to two decimals. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(channels(a)), luminance(channels(b))].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/**
 * How visible a cast shade is on the surface it falls on: the contrast ratio between the surface and
 * the surface under the shade's core (the shadow color at its alpha, blended over the surface). 1 means
 * the shade cannot be seen.
 */
export function shadeContrast(shadowColor, surface) {
  const a = alphaOf(shadowColor);
  const s = channels(surface);
  const under = channels(shadowColor).map((c, i) => s[i] * (1 - a) + c * a);
  const [hi, lo] = [luminance(s), luminance(under)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/** A shadow value as numbers: { alpha, x, y, blur, spread, color }. No shadow has alpha 0. */
export function shadowOf(value) {
  const v = Array.isArray(value) ? value.at(-1) : value;
  if (!v || typeof v !== "object") return null;
  return { color: v.color, alpha: alphaOf(v.color ?? "#00000000"), x: px(v.offsetX), y: px(v.offsetY), blur: px(v.blur), spread: px(v.spread) };
}
const casts = (s) => !!s && s.alpha > 0 && (s.blur > 0 || s.y > 0 || s.x > 0);
const sameShape = (a, b) => a.x === b.x && a.y === b.y && a.blur === b.blur && a.spread === b.spread;
const shapeText = (s) => `${s.y}px offset, ${s.blur}px blur`;

/** The grammar's relation definitions, by id, from every scope that has them. */
export function grammarRelations(g) {
  return new Map(g.scopes.flatMap((s) => (s.relations ?? []).map((r) => [r.id, { ...r, scope: s.id }])));
}

/** Every brand and mode the scheme ships, as tokenIndex takes them. */
function themesOf(scheme) {
  const brands = Object.keys(scheme.tokens.brands ?? {});
  return (scheme.themes ?? []).map((t) => ({ brand: t.brand ?? brands[0], mode: t.mode ?? t.id }));
}

/**
 * Check one scheme's relation records. Returns { scheme, results, errors }:
 *   results: [{ token, relation, brand, mode, holds, says }], one per record, brand and mode, where
 *     holds is false when today's values break the relation (a finding for the user to decide);
 *   errors: records that cannot be checked (no record, an unknown relation, a token the relation does
 *     not name, an input that does not resolve). An error is a defect in the record, not a finding.
 */
export function checkRelations(scheme, g) {
  const defs = grammarRelations(g);
  const records = scheme.relations ?? [];
  const errors = [];
  const results = [];
  if (!records.length) errors.push(`${scheme.id} records no relations; add scheme.relations`);
  // Every token a relation names must have a record, so a new corner cannot skip its relation.
  for (const def of defs.values())
    for (const token of def.tokens)
      if (!records.some((r) => r.token === token)) errors.push(`${scheme.id} has no record for ${token} (${def.id})`);
  for (const theme of themesOf(scheme)) {
    const one = relationResults(scheme, g, { ...theme, index: tokenIndex(scheme, theme) });
    results.push(...one.results);
    errors.push(...one.errors);
  }
  // A corner or width is the same in light and dark; list one result per brand when the modes agree.
  const seen = new Set();
  const unique = results.filter((r) => {
    const k = `${r.token}|${r.relation}|${r.brand}|${r.holds}|${r.says}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  return { scheme: scheme.id, results: unique, errors };
}

/**
 * The relation results of one brand and mode, for the given records (all of the scheme's by default):
 * { results, errors }, as checkRelations gives them. index is the scheme's token index for this brand
 * and mode. The decision graph reads a relation through this, one token at a time.
 */
export function relationResults(scheme, g, { brand, mode, index, records = scheme.relations ?? [] }) {
  const defs = grammarRelations(g);
  const answer = Object.fromEntries((scheme.answers ?? []).map((a) => [a.question, a.option]));
  const theme = { brand, mode };
  const results = [];
  const errors = [];
  const value = (path) => aliasChain(index, path).value;
  const dim = (path) => px(value(path));
  // The light index, built only when a dark check compares with light.
  let lightIndex = mode === "light" ? index : null;
  const light = () => (lightIndex ??= tokenIndex(scheme, { brand, mode: "light" }));
  for (const rec of records) {
    const def = defs.get(rec.relation);
    const where = `${scheme.id}/${theme.brand}/${theme.mode} ${rec.token}`;
    if (!def) {
      errors.push(`${where}: no grammar relation "${rec.relation}"`);
      continue;
    }
    if (!def.tokens.includes(rec.token)) {
      errors.push(`${where}: the relation "${rec.relation}" names ${def.tokens.join(", ")}, not this token`);
      continue;
    }
    const inputs = [rec.token, rec.from, rec.minus, rec.box, rec.on].filter(Boolean);
    const missing = inputs.filter((p) => value(p) === null);
    if (missing.length) {
      errors.push(`${where}: ${missing.join(", ")} does not resolve`);
      continue;
    }
    const out = (holds, says, token = rec.token) => results.push({ token, relation: rec.relation, brand: theme.brand, mode: theme.mode, holds, says });
    const own = dim(rec.token);
    // A line that is a control's only edge must be seen: its color against the surface it sits on.
    for (const b of def.boundaries ?? []) {
      const color = value(b);
      const surface = value("color.surface.default");
      if (typeof color !== "string" || typeof surface !== "string") {
        errors.push(`${where}: the boundary ${b} does not resolve to a color`);
        continue;
      }
      const r = contrast(color, surface);
      out(r >= def.floor, `${b} is the control's only edge: ${r}:1 on color.surface.default, against the ${def.floor}:1 floor (WCAG 1.4.11)`, b);
    }
    switch (def.check) {
      case "decided": {
        // A decided value holds by its answers. Where a count answer names how many sizes a set of
        // tokens makes, the count is checked too.
        const count = def.count;
        if (!count) {
          out(true, `${pxText(own)}, decided by ${def.follows.join(", ")}`);
          break;
        }
        const sizes = new Set(count.tokens.map(dim));
        const want = count.options[answer[count.question]];
        out(sizes.size === want, `${pxText(own)}; ${count.tokens.join(", ")} make ${sizes.size} sizes; ${count.question} answers ${answer[count.question]}`);
        break;
      }
      case "minus": {
        const want = dim(rec.from) - dim(rec.minus);
        out(own === Math.max(0, want), `${pxText(own)}; ${rec.from} ${pxText(dim(rec.from))} − ${rec.minus} ${pxText(dim(rec.minus))} = ${pxText(Math.max(0, want))}`);
        break;
      }
      case "equal-unless-pill": {
        const from = dim(rec.from);
        if (from !== Infinity) out(own === from, `${pxText(own)}; ${rec.from} is ${pxText(from)}, so it equals it`);
        else if (!rec.box) out(false, `${rec.from} is a pill and the record names no box corner`);
        else out(own === dim(rec.box) && own !== Infinity, `${pxText(own)}; ${rec.from} is a pill, so it takes the box corner ${rec.box} ${pxText(dim(rec.box))}`);
        break;
      }
      case "equal-or-own": {
        const from = dim(rec.from);
        const ownAllowed = def.own_when?.options?.includes(answer[def.own_when.question]);
        if (own === from) out(true, `${pxText(own)}; equals ${rec.from}`);
        else out(!!ownAllowed, `${pxText(own)}; ${rec.from} is ${pxText(from)}; ${def.own_when.question} ${ownAllowed ? "gives it its own corner" : "gives it no corner of its own"}`);
        break;
      }
      case "next-step": {
        // The steps of the scale the relation steps along: the primitive group of the token it follows.
        const steps = Object.values(scheme.tokens.primitive[rec.from.split(".")[0]] ?? {})
          .map((t) => px(t.$value))
          .filter((n) => n !== null)
          .sort((a, b) => a - b);
        const from = dim(rec.from);
        const next = steps.find((n) => n > from) ?? null;
        out(own === next, `${pxText(own)}; ${rec.from} is ${pxText(from)} and the next step is ${pxText(next)}`);
        break;
      }
      case "fixed": {
        out(own === px(def.equals), `${pxText(own)}; fixed at ${def.equals}`);
        break;
      }
      case "layer-step": {
        // The scale is set in light. In dark, dark-same-shape decides: floating layers keep the light
        // shape and every other layer casts none.
        if (theme.mode === "dark") break;
        const s = shadowOf(value(rec.token));
        const named = def.by_answer.options[answer[def.by_answer.question]] ?? [];
        const rises = named.includes(rec.token);
        if (!rises) {
          out(!casts(s), `${def.by_answer.question} leaves it out, so ${casts(s) ? `it should cast no shadow, yet casts ${shapeText(s)}` : "it casts no shadow"}`);
          break;
        }
        if (!casts(s)) {
          out(false, `${def.by_answer.question} names it, yet it casts no shadow`);
          break;
        }
        // A higher step sits higher: never a smaller offset or blur than any lower step that casts.
        const step = def.steps[rec.token];
        const lower = Object.entries(def.steps)
          .filter(([, n]) => n < step)
          .map(([t]) => shadowOf(value(t)))
          .filter(casts);
        const under = lower.find((l) => s.y < l.y || s.blur < l.blur);
        out(!under, `step ${step}: ${shapeText(s)}${under ? `, lower than the step below (${shapeText(under)})` : ""}`);
        break;
      }
      case "dark-same-shape": {
        if (theme.mode !== "dark") break;
        // In dark, height reads by tone: a raised surface lighter than the base, a sunken one
        // darker, and the raised layer's ring a solid color lighter than the raised surface.
        if (def.depth) {
          const [raised, base, sunken] = [def.depth.raised, def.depth.base, def.depth.sunken].map((p) => value(p));
          const lum = (c) => luminance(channels(c));
          const up = lum(raised) > lum(base);
          const down = lum(sunken) < lum(base);
          out(
            up && down,
            `dark depth by tone: ${def.depth.raised} ${raised} is ${up ? "lighter than" : lum(raised) === lum(base) ? "the same as" : "darker than"} ${def.depth.base} ${base}; ${def.depth.sunken} ${sunken} is ${down ? "darker" : "lighter"}`,
            def.depth.raised,
          );
          // A floating layer sits one rung above raised, so it is lighter still.
          const floating = def.depth.floating ? value(def.depth.floating) : null;
          if (floating !== null) {
            const above = lum(floating) > lum(raised);
            out(above, `dark depth by tone: ${def.depth.floating} ${floating} is ${above ? "lighter than" : "not lighter than"} ${def.depth.raised} ${raised}`, def.depth.floating);
          }
          if (def.depth.ring) {
            const ring = value(def.depth.ring);
            const solid = typeof ring === "string" && /^#[0-9a-f]{6}$/i.test(ring);
            // The ring draws the edge of raised and floating layers, so it is lighter than both.
            for (const [path, fill] of [[def.depth.raised, raised], ...(floating !== null ? [[def.depth.floating, floating]] : [])]) {
              const lighter = solid && lum(ring) > lum(fill);
              out(
                lighter,
                solid
                  ? `dark ring: ${def.depth.ring} ${ring} is ${lighter ? "lighter than" : "not lighter than"} ${path} ${fill}, ${contrast(ring, fill)}:1`
                  : `dark ring: ${def.depth.ring} is ${JSON.stringify(ring)}, not a solid color, so its contrast cannot be checked`,
                def.depth.ring,
              );
            }
          }
        }
        const layer = rec.token;
        const d = shadowOf(value(layer));
        const l = shadowOf(aliasChain(light(), layer).value);
        // Only floating layers cast a shade in dark; every other layer shows height by tone.
        if (def.floating && !def.floating.includes(layer)) {
          out(!casts(d), `${layer} is not a floating layer, so it ${casts(d) ? `should cast no shade in dark, yet casts ${shapeText(d)}` : "casts no shade in dark"}`);
          break;
        }
        if (!casts(d) && !casts(l)) {
          out(true, `${layer} casts no shadow in either mode`);
          break;
        }
        if (!casts(d) || !casts(l) || !sameShape(d, l)) {
          out(false, `${layer} changes shape in dark: light ${casts(l) ? shapeText(l) : "none"}, dark ${casts(d) ? shapeText(d) : "none"}`);
          break;
        }
        const lightSeen = shadeContrast(l.color, aliasChain(light(), rec.on).value);
        const darkSeen = shadeContrast(d.color, value(rec.on));
        out(d.alpha >= l.alpha, `${layer}: the same ${shapeText(d)}; alpha ${Math.round(l.alpha * 100)}% → ${Math.round(d.alpha * 100)}%; the shade's core reads ${lightSeen}:1 on ${rec.on} in light, ${darkSeen}:1 in dark`);
        break;
      }
      default:
        errors.push(`${where}: the grammar relation "${def.id}" has no check "${def.check}"`);
    }
  }
  return { results, errors };
}

/**
 * The elevation scale across schemes: for each elevation.values answer and step, the shadow shape each
 * scheme gives it in light. One answer and step should give one shape; a second shape is a finding.
 * [{ values, step, token, shapes: [{ scheme, brand, shape }], same }]
 */
export function elevationScale(schemes, g) {
  const def = grammarRelations(g).get("layer-step");
  if (!def) return [];
  const rows = new Map();
  for (const scheme of schemes) {
    const answer = Object.fromEntries((scheme.answers ?? []).map((a) => [a.question, a.option]));
    for (const rec of (scheme.relations ?? []).filter((r) => r.relation === "layer-step")) {
      for (const brand of Object.keys(scheme.tokens.brands ?? {})) {
        const s = shadowOf(aliasChain(tokenIndex(scheme, { brand, mode: "light" }), rec.token).value);
        if (!casts(s)) continue;
        const k = `${answer["elevation.values"]}|${def.steps[rec.token]}`;
        const row = rows.get(k) ?? { values: answer["elevation.values"], step: def.steps[rec.token], token: rec.token, shapes: [] };
        const shape = shapeText(s);
        if (!row.shapes.some((x) => x.scheme === scheme.id && x.shape === shape)) row.shapes.push({ scheme: scheme.id, brand, shape });
        rows.set(k, row);
      }
    }
  }
  return [...rows.values()].map((r) => ({ ...r, same: new Set(r.shapes.map((x) => x.shape)).size === 1 }));
}

/**
 * The edge rule: a line that is the only cue that you can click or type (a boundary of the
 * default-line relation) reads the strong border and meets the floor's contrast on surface.default in
 * every brand and mode. The same importance gets the same line, so every boundary reads one semantic.
 * A quiet line reads the faint border. Returns { checked, gaps }, a gap per break, in words.
 */
export function edgeRule(scheme, g, { strong = "color.border.strong", faint = "color.border.default" } = {}) {
  const def = grammarRelations(g).get("default-line");
  const gaps = [];
  let checked = 0;
  if (!def?.boundaries?.length) return { checked, gaps: ["the default-line relation lists no boundaries"] };
  for (const theme of themesOf(scheme)) {
    const ix = tokenIndex(scheme, theme);
    const where = `${scheme.id}/${theme.brand}/${theme.mode}`;
    const surface = aliasChain(ix, "color.surface.default").value;
    for (const b of def.boundaries) {
      checked++;
      const chain = aliasChain(ix, b);
      if (chain.hops[0] !== strong) gaps.push(`${where}: ${b} reads ${chain.hops[0] ?? "nothing"}, not ${strong}`);
      const r = typeof chain.value === "string" && typeof surface === "string" ? contrast(chain.value, surface) : null;
      if (r === null || r < def.floor) gaps.push(`${where}: ${b} is ${r ?? "?"}:1 on color.surface.default, under the ${def.floor}:1 floor`);
    }
    for (const q of def.quiet ?? []) {
      checked++;
      const first = aliasChain(ix, q.token).hops[0];
      if (first !== faint) gaps.push(`${where}: ${q.token} reads ${first ?? "nothing"}, not ${faint}`);
    }
  }
  return { checked, gaps: [...new Set(gaps)] };
}
