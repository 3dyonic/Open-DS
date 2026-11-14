// The color token map: one scheme's colors, from the value (the primitive, its meaning) to
// the decisions that read it (semantic tokens), the component tokens that show them, the chain of
// answers behind each decision, and what changes when the value changes. No Node imports, so the docs
// page runs the same code in the browser.
//
// It reads a graph from token-graph.mjs (one brand, one mode) and the scheme's reasons (reasonsOf).
import { BACKGROUNDS, contrasts, jobCheck, jobOf } from "./token-measure.mjs";

const PRIMITIVE = /^color\.([a-z][a-z-]*)\.(light|dark)\.([a-z0-9]+)$/;

// A primitive color's hue, mode and step, or null for any other token.
export function primitiveParts(id) {
  const m = PRIMITIVE.exec(id);
  return m ? { hue: m[1], mode: m[2], step: m[3] } : null;
}

// Steps sort by number; named steps (black's "scrim") come after.
const stepOrder = (a, b) => {
  const [x, y] = [Number(a), Number(b)];
  if (Number.isNaN(x) || Number.isNaN(y)) return Number.isNaN(x) - Number.isNaN(y) || a.localeCompare(b);
  return x - y;
};

// A neutral semantic (color.neutral.*) only renames a gray step: it is not a decision. Its readers are.
const isPassThrough = (id) => id.startsWith("color.neutral.");

/**
 * The color index of one graph in one mode: { mode, nodes (id → node), readers (id → reader ids),
 * hues: [{ id, steps: [{ id, step, value }] }] }. A hue lists its steps of this mode only: a ramp
 * never shows as its own family.
 */
export function colorIndex(graph, mode) {
  const nodes = new Map(graph.nodes.map((n) => [n.id, n]));
  const readers = new Map();
  for (const e of graph.edges) {
    if (!readers.has(e.from)) readers.set(e.from, []);
    readers.get(e.from).push(e.to);
  }
  const byHue = new Map();
  for (const n of graph.nodes) {
    const p = n.tier === "primitive" && primitiveParts(n.id);
    if (!p || p.mode !== mode) continue;
    if (!byHue.has(p.hue)) byHue.set(p.hue, []);
    byHue.get(p.hue).push({ id: n.id, step: p.step, value: n.value });
  }
  const hues = [...byHue]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, steps]) => ({ id, steps: steps.sort((a, b) => stepOrder(a.step, b.step)) }));
  return { mode, nodes, readers, hues };
}

/** The plain name of a primitive color: "blue 600". */
export function plainName(id) {
  const p = primitiveParts(id);
  return p ? `${p.hue} ${p.step}` : id;
}

/** A semantic token's name without the "@" of its base value: color.action.primary.@ → color.action.primary. */
export const tokenName = (id) => id.replace(/\.@$/, "");

/** The semantic group a color decision sits in: color.border.focus → "Border". */
export function groupOf(id) {
  const g = id.split(".")[1] ?? "";
  return g.charAt(0).toUpperCase() + g.slice(1);
}

/**
 * The decisions that read a value: the color semantic tokens it reaches, directly or through a neutral
 * rename (gray 200 → color.neutral.200 → color.border.default). Sorted by group, then name.
 */
export function decisionsReading(index, id) {
  const out = new Set();
  const seen = new Set();
  const walk = (from) => {
    for (const to of index.readers.get(from) ?? []) {
      if (seen.has(to)) continue;
      seen.add(to);
      const n = index.nodes.get(to);
      if (n?.tier !== "semantic" || !to.startsWith("color.")) continue;
      if (isPassThrough(to)) walk(to);
      else out.add(to);
    }
  };
  walk(id);
  return [...out].sort((a, b) => groupOf(a).localeCompare(groupOf(b)) || a.localeCompare(b));
}

/** The semantic groups of a value's decisions: [{ id, decisions: [ids] }], in group order. */
export function groupsReading(index, id) {
  const groups = new Map();
  for (const d of decisionsReading(index, id)) {
    const g = groupOf(d);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(d);
  }
  return [...groups].map(([g, decisions]) => ({ id: g, decisions }));
}

/** A component token's component: component.button.focus-ring → "button". */
export const componentOf = (id) => id.replace(/^component\./, "").split(".")[0];

/** A component token's row label: component.tabs.trigger.focus-ring → "trigger focus ring". */
export const rowLabel = (id) =>
  id
    .replace(/^component\.[^.]+\.?/, "")
    .replace(/\.@$/, "")
    .replace(/[.-]/g, " ") || "base";

/**
 * The components that show a decision: [{ component, rows: [component token ids] }], the component
 * tokens that read it directly or through another component token. Sorted by component name.
 */
export function componentsShowing(index, decision) {
  const byComponent = new Map();
  const seen = new Set();
  const walk = (from) => {
    for (const to of index.readers.get(from) ?? []) {
      if (seen.has(to) || index.nodes.get(to)?.tier !== "component-key") continue;
      seen.add(to);
      const c = componentOf(to);
      if (!byComponent.has(c)) byComponent.set(c, []);
      byComponent.get(c).push(to);
      walk(to);
    }
  };
  walk(decision);
  return [...byComponent]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([component, rows]) => ({ component, rows: rows.sort() }));
}

// The answer about the text contrast floor holds for text and for a fill's text, not for a border,
// a focus ring, a selected edge or a category: it stays out of their reasons.
const TEXT_FLOOR = "accessibility.definition";

/** The job a decision does (token-measure's jobOf), with the scheme's own values to find its pair. */
export function jobFor(index, decision) {
  const n = index.nodes.get(decision);
  return jobOf(decision, { tone: n?.tone ?? null, has: (t) => index.nodes.has(t) });
}

/**
 * The chain of reasons behind a decision: the answers its pick records, then each answer's own
 * because, until an answer follows from none. Returns { steps: [{ id, group, question, answer, why }],
 * links: [{ from, to }] } where to is a step id or "decision". A step appears once even when two
 * chains share it. The text contrast floor stays out for a job that is not text (see TEXT_FLOOR).
 */
export function reasonChain(index, reasons, decision) {
  const n = index.nodes.get(decision);
  const job = jobFor(index, decision);
  const textJob = job && (job.kind === "text" || job.kind === "fill");
  const first = (n?.answers ?? [])
    .map((a) => a.id)
    .filter((id) => id && reasons[id] && (textJob || id !== TEXT_FLOOR));
  const steps = new Map();
  const links = [];
  const linkKeys = new Set();
  const link = (from, to) => {
    const k = `${from}>${to}`;
    if (!linkKeys.has(k)) {
      linkKeys.add(k);
      links.push({ from, to });
    }
  };
  const visit = (id, to) => {
    link(id, to);
    if (steps.has(id)) return;
    const r = reasons[id];
    steps.set(id, { id, group: r.group, question: r.question, answer: r.answer, why: r.why });
    for (const b of r.because ?? []) if (reasons[b]) visit(b, id);
  };
  for (const id of first) visit(id, "decision");
  return { steps: [...steps.values()], links };
}

/** The scheme's backgrounds in this index's mode: [{ id, value }]. */
export function backgroundsOf(index) {
  return BACKGROUNDS.filter((id) => index.nodes.has(id)).map((id) => ({ id, value: index.nodes.get(id).value }));
}

/** A value's contrast on the scheme's backgrounds: [{ label, ratio }] (token-measure's contrasts). */
export const contrastsOf = (index, value) => contrasts(value, backgroundsOf(index));

/**
 * What changes when a value changes: { decisions, components } counts, and for each decision its
 * check with the value given (the current value, or a step being tried): [{ decision, check }] where
 * check is token-measure's jobCheck ({ met, text }) or null when the decision has no check.
 */
export function impactOf(index, id, value = index.nodes.get(id)?.value) {
  const decisions = decisionsReading(index, id);
  const components = new Set(decisions.flatMap((d) => componentsShowing(index, d).map((c) => c.component)));
  const backgrounds = backgroundsOf(index);
  const valueOf = (t) => index.nodes.get(t)?.value ?? null;
  const checks = decisions.map((d) => ({
    decision: d,
    check: jobCheck({ id: d, value, tone: index.nodes.get(d)?.tone ?? null }, { backgrounds, valueOf }),
  }));
  return { decisions: decisions.length, components: components.size, checks };
}

/**
 * The selection a ?focus= id opens: { hue, step, group, decision } (any may be null). A primitive id
 * opens its hue and step. A decision opens the first step of this mode that reads it, its group and
 * itself. A component token opens the decision it reads. Null when the id is not on the map.
 */
export function selectionFor(index, id) {
  const asStep = (pid) => {
    const p = primitiveParts(pid);
    return p && p.mode === index.mode ? { hue: p.hue, step: pid } : null;
  };
  if (primitiveParts(id)) {
    const s = asStep(id);
    return s && { ...s, group: null, decision: null };
  }
  let decision = id;
  if (index.nodes.get(id)?.tier === "component-key") {
    // Walk back through component tokens to the color decision this one reads.
    const sources = new Map();
    for (const [from, tos] of index.readers) for (const to of tos) sources.set(to, [...(sources.get(to) ?? []), from]);
    const seen = new Set();
    const back = (t) => {
      for (const from of sources.get(t) ?? []) {
        if (seen.has(from)) continue;
        seen.add(from);
        const n = index.nodes.get(from);
        if (n?.tier === "semantic" && from.startsWith("color.") && !isPassThrough(from)) return from;
        if (n?.tier === "component-key") {
          const found = back(from);
          if (found) return found;
        }
      }
      return null;
    };
    decision = back(id);
  }
  if (!decision || !index.nodes.has(decision)) return null;
  for (const hue of index.hues)
    for (const s of hue.steps)
      if (decisionsReading(index, s.id).includes(decision))
        return { hue: hue.id, step: s.id, group: groupOf(decision), decision };
  return null;
}
