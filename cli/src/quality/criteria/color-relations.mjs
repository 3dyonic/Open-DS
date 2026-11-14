// Relations hold: what the colors of a scheme keep between base and candidate. No contrast
// pair drops a WCAG level, and each keeps a margin above its floor; scale steps and the surface ladder
// keep their order; rest → hover → pressed keep their sign and stay apart; colors that were distinct
// stay distinct, also under deuteranopia, protanopia and tritanopia; colors that were shared stay
// shared. Each flag names its scheme, theme and tokens, so an approval can clear that one flag.
import { VISIONS, oklab, oklabDistance, simulate, wcagLevel } from "../color.mjs";
import { hex6 } from "../values.mjs";
import { measuredPairs } from "./accessibility.mjs";
import { flagMeasure } from "./measure.mjs";

export const FAMILY = "relations";
const L = (hex) => oklab(hex)[0];
const fmt = (n) => n.toFixed(3);

/** Rest, hover and pressed of each color that has a hover: [[rest, hover, pressed?]]. */
export function stateFamilies(names) {
  const set = new Set(names);
  return names
    .filter((n) => n.endsWith(".hover") && set.has(n.slice(0, -".hover".length)))
    .map((h) => {
      const rest = h.slice(0, -".hover".length);
      const pressed = [`${rest}.pressed`, `${rest}.active`].find((p) => set.has(p));
      return [rest, h, ...(pressed ? [pressed] : [])];
    });
}

/** The color pairs that must stay apart: each grammar pair, each pair of siblings, each state step. */
export function distinctPairs(s, theme) {
  const v = s.values[theme] ?? {};
  const colors = Object.keys(v).filter((t) => t.startsWith("color.") && !t.startsWith("color.neutral.") && hex6(v[t]));
  const out = new Map();
  const add = (a, b) => a !== b && hex6(v[a]) && hex6(v[b]) && out.set([a, b].sort().join(" | "), [a, b].sort());
  for (const p of s.pairs[theme] ?? []) add(p.key, p.on);
  const parent = (t) => t.split(".").slice(0, -1).join(".");
  const groups = new Map();
  for (const t of colors) groups.set(parent(t), [...(groups.get(parent(t)) ?? []), t]);
  for (const list of groups.values()) for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) add(list[i], list[j]);
  for (const f of stateFamilies(colors)) for (let i = 1; i < f.length; i++) add(f[i - 1], f[i]);
  return [...out.values()];
}

export function measure(snapshot, params) {
  const margin = params.relations.contrastMargin;
  const thin = [];
  const close = [];
  for (const [id, s] of Object.entries(snapshot.schemes)) {
    for (const p of measuredPairs(s))
      if (!p.waits && p.ratio < p.need + margin)
        thin.push({ scheme: id, themes: [p.theme], tokens: [p.key, p.on], says: `${id}/${p.theme}: ${p.key} on ${p.on} is ${p.ratio.toFixed(2)}:1, floor ${p.need}:1 + ${margin}` });
    for (const t of s.themes) {
      const v = s.values[t.id] ?? {};
      for (const f of stateFamilies(Object.keys(v).filter((n) => hex6(v[n]))))
        for (let i = 1; i < f.length; i++) {
          const d = oklabDistance(hex6(v[f[i - 1]]), hex6(v[f[i]]));
          if (d < params.relations.stateGap)
            close.push({ scheme: id, themes: [t.id], tokens: [f[i - 1], f[i]], says: `${id}/${t.id}: ${f[i - 1]} → ${f[i]} is ΔE ${fmt(d)}, under ${params.relations.stateGap}` });
        }
    }
  }
  const approvals = snapshot.approvals;
  return [
    flagMeasure({ id: "relations.contrast-margin", family: FAMILY, title: `Contrast pairs less than ${margin} above their floor`, flags: thin, approvals }),
    flagMeasure({ id: "relations.state-gap", family: FAMILY, title: `State steps (rest → hover → pressed) closer than ΔE ${params.relations.stateGap}`, flags: close, approvals }),
  ];
}

// The pairs of names whose lightness order flips: [a, b] with a lighter than b on base, darker on candidate.
function flips(names, lb, lc) {
  const out = [];
  for (let i = 0; i < names.length; i++)
    for (let j = i + 1; j < names.length; j++) {
      const [a, b] = [names[i], names[j]];
      const before = lb[a] - lb[b];
      const after = lc[a] - lc[b];
      if (Math.abs(before) > 1e-4 && Math.sign(after) !== Math.sign(before)) out.push([a, b]);
    }
  return out;
}

/** The relation gates and every flag each raises, before approvals: [{ id, title, flags }]. */
export function relationFlags(base, candidate, params) {
  const drops = [];
  const steps = [];
  const ladder = [];
  const signs = [];
  const lost = Object.fromEntries(Object.keys(VISIONS).map((v) => [v, []]));
  const split = [];
  const gap = params.relations.distinct;
  for (const [id, c] of Object.entries(candidate.schemes)) {
    const b = base.schemes[id];
    if (!b) continue;
    // WCAG levels, pair by pair.
    const before = new Map(measuredPairs(b).map((p) => [`${p.theme}|${p.key}|${p.on}`, p]));
    for (const p of measuredPairs(c)) {
      const q = before.get(`${p.theme}|${p.key}|${p.on}`);
      if (q && wcagLevel(p.ratio) < wcagLevel(q.ratio))
        drops.push({ scheme: id, themes: [p.theme], tokens: [p.key, p.on], says: `${id}/${p.theme}: ${p.key} on ${p.on} ${q.ratio.toFixed(2)}:1 → ${p.ratio.toFixed(2)}:1` });
    }
    // Scale steps keep their lightness order.
    for (const [hue, modes] of Object.entries(c.palette ?? {}))
      for (const [mode, row] of Object.entries(modes)) {
        const was = b.palette?.[hue]?.[mode];
        if (!was) continue;
        const names = Object.keys(row).filter((st) => was[st]);
        const lb = Object.fromEntries(names.map((n) => [n, L(was[n])]));
        const lc = Object.fromEntries(names.map((n) => [n, L(row[n])]));
        // A scale belongs to a mode: its flag counts in each theme of that mode.
        const themes = c.themes.filter((t) => t.mode === mode).map((t) => t.id);
        for (const [x, y] of flips(names, lb, lc))
          steps.push({ scheme: id, themes: themes.length ? themes : [mode], tokens: [`color.${hue}.${mode}.${x}`, `color.${hue}.${mode}.${y}`], says: `${id}: ${hue}.${mode} steps ${x} and ${y} swap lightness order` });
      }
    for (const t of c.themes.map((x) => x.id).filter((x) => b.values[x])) {
      const [vb, vc] = [b.values[t], c.values[t] ?? {}];
      const both = (n) => hex6(vb[n]) && hex6(vc[n]);
      // The surface ladder keeps its order.
      // The rungs come from the candidate's grammar; a base built by older code may not record them.
      const rungs = (c.ladder ?? b.ladder ?? []).filter(both);
      const lb = Object.fromEntries(rungs.map((n) => [n, L(vb[n])]));
      const lc = Object.fromEntries(rungs.map((n) => [n, L(vc[n])]));
      for (const [x, y] of flips(rungs, lb, lc)) ladder.push({ scheme: id, themes: [t], tokens: [x, y], says: `${id}/${t}: ${x} and ${y} swap lightness order` });
      // State steps keep the sign of their lightness change.
      for (const f of stateFamilies(Object.keys(vb).filter(both)))
        for (let i = 1; i < f.length; i++) {
          const db = L(vb[f[i]]) - L(vb[f[i - 1]]);
          const dc = L(vc[f[i]]) - L(vc[f[i - 1]]);
          if (Math.abs(db) > 1e-4 && Math.sign(dc) !== Math.sign(db))
            signs.push({
              scheme: id,
              themes: [t],
              tokens: [f[i - 1], f[i]],
              says: `${id}/${t}: ${f[i - 1]} → ${f[i]} ${db > 0 ? "lightened" : "darkened"} on base, ${dc > 0 ? "lightens" : dc < 0 ? "darkens" : "holds"} now`,
            });
        }
      // Distinct colors stay distinct, under each vision.
      for (const [x, y] of distinctPairs(b, t)) {
        if (!both(x) || !both(y)) continue;
        for (const vision of Object.keys(VISIONS)) {
          const db = oklabDistance(simulate(hex6(vb[x]), vision), simulate(hex6(vb[y]), vision));
          const dc = oklabDistance(simulate(hex6(vc[x]), vision), simulate(hex6(vc[y]), vision));
          if (db >= gap && dc < gap) lost[vision].push({ scheme: id, themes: [t], tokens: [x, y], says: `${id}/${t}: ${x} and ${y} were ΔE ${fmt(db)} apart, now ${fmt(dc)}` });
        }
      }
      // Colors that were one color stay one color. The neutral scale's steps are options, not roles: a
      // role that picks another step is a shift, not a split.
      const groups = new Map();
      for (const n of Object.keys(vb).filter((n) => n.startsWith("color.") && !n.startsWith("color.neutral.") && both(n))) groups.set(hex6(vb[n]), [...(groups.get(hex6(vb[n])) ?? []), n]);
      for (const list of groups.values())
        for (const n of list.slice(1))
          if (hex6(vc[n]) !== hex6(vc[list[0]]))
            split.push({ scheme: id, themes: [t], tokens: [n, list[0]], says: `${id}/${t}: ${n} no longer shares ${list[0]}'s color (${hex6(vc[n])} vs ${hex6(vc[list[0]])})` });
    }
  }
  const g = (id, title, flags) => ({ id, title, flags });
  return [
    g("relations.wcag-level-drops", "Contrast pairs that drop a WCAG level (under 3, 3, 4.5, 7)", drops),
    g("relations.step-order", "Scale steps that swap their lightness order", steps),
    g("relations.ladder-order", "Surface ladder rungs that swap their lightness order", ladder),
    g("relations.state-sign", "State steps (rest → hover → pressed) whose lightness change flips sign", signs),
    ...Object.entries(lost).map(([vision, list]) => g(`relations.distinct-lost.${vision}`, `Pairs distinct on base that are no longer distinct (ΔE ${gap}), ${vision === "normal" ? "normal vision" : `${vision} simulated`}`, list)),
    g("relations.shared-split", "Colors that were one color on base and are split now", split),
  ];
}

export function relative(base, candidate, params) {
  return relationFlags(base, candidate, params).map((r) => flagMeasure({ ...r, family: FAMILY, approvals: candidate.approvals }));
}
