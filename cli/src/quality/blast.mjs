// The blast radius of one scheme: change one answer or one anchor, load the scheme again with
// the ref's own loader, and compare what moved with what the scheme records as depending on it.
//
// "Expected" never comes from the reference chain the change travels along, or a hard-code would leave
// both sides together and never show:
//   an answer   the tokens whose trace cites it (the trace engine's links);
//   an anchor   the tokens the scheme records as derived from it (perturb.mjs, derives), and what the
//               relations tie to those. For the key color, the record is the generated scale: the key
//               gives every step the generator makes, and a token that points at one of those steps
//               (or copies its value, an orphan if it stays) is expected to move.
// An expected token that does not move is an orphan; a token that moves with no such record is a
// hidden coupling. An answer that moves no value at all is counted apart: answers do not generate
// values yet, and that is a finding about the loader, not an orphan per token. Pure: the caller passes
// the loader and the token builder.
import { anchorPerturbations, answerPerturbations } from "./perturb.mjs";
import { px } from "./values.mjs";

const isComponent = (token) => token.startsWith("component.");
const colorOf = (v) => (typeof v === "string" && /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(v) ? v.slice(0, 7).toUpperCase() : null);

/** The tokens that moved, per theme: { theme: Set }. Component keys are left out. */
export function movedBetween(before, after) {
  const out = {};
  for (const [theme, values] of Object.entries(before)) {
    out[theme] = new Set();
    for (const [token, v] of Object.entries(values))
      if (!isComponent(token) && JSON.stringify(v) !== JSON.stringify(after[theme]?.[token])) out[theme].add(token);
  }
  return out;
}

// What the relations tie to the seeds, until nothing new comes in.
function throughLinks(seeds, links) {
  const reached = new Set(seeds);
  const out = new Set();
  for (let grew = true; grew; ) {
    grew = false;
    for (const l of links)
      if (l.inputs.some((i) => reached.has(i)))
        for (const o of l.outputs)
          if (!reached.has(o)) {
            reached.add(o);
            out.add(o);
            grew = true;
          }
  }
  return out;
}

/**
 * The tokens an anchor should move in each theme, from what the scheme records as derived from it:
 * { theme: Set }. derives: { tokens, family, px, steps, stepPaths, inputs } (see anchorPerturbations).
 * chains: { theme: { token: { end } } }, to find the tokens that point at a generated step.
 */
export function expectedForAnchor(derives, values, links, chains = {}) {
  const steps = new Set(derives.steps ?? []);
  const stepPaths = new Set(derives.stepPaths ?? []);
  const out = {};
  for (const [theme, byToken] of Object.entries(values)) {
    const set = new Set();
    for (const [token, v] of Object.entries(byToken)) {
      if (isComponent(token) || v === null || v === undefined) continue;
      if (derives.tokens?.includes(token)) set.add(token);
      else if (derives.family && derives.family.some((f) => token.startsWith(f)) && px(v) === derives.px) set.add(token);
      else if (token.startsWith("color.") && (stepPaths.has(chains[theme]?.[token]?.end) || steps.has(colorOf(v)))) set.add(token);
    }
    for (const t of throughLinks([...(derives.inputs ?? []), ...set], links)) if (t in byToken) set.add(t);
    out[theme] = set;
  }
  return out;
}

// Orphans and hidden couplings, theme by theme, each token named once.
function compareSets(expected, moved) {
  const orphans = new Set();
  const hidden = new Set();
  for (const theme of Object.keys(moved)) {
    const [want, got] = [expected[theme] ?? new Set(), moved[theme]];
    for (const t of want) if (!got.has(t)) orphans.add(t);
    for (const t of got) if (!want.has(t)) hidden.add(t);
  }
  return { orphans: [...orphans].sort(), hidden: [...hidden].sort() };
}

const union = (byTheme) => [...new Set(Object.values(byTheme).flatMap((s) => [...s]))].sort();

/**
 * Every perturbation of one scheme and what it moved: [{ kind, id, change, expected, moved, orphans,
 * hidden, generates? }], or { kind, id, notPresent } / { kind, id, change, error }. reload(stored) loads
 * a changed file; resolve(scheme) gives { values } per theme. colorScales are the loaded scheme's steps
 * with the generator's output (snapshot facts); generateScale is the ref's own generator.
 */
export function blastRadius({ stored, grammar, trace, values, chains, links, primaryHue, darkCanvas, colorScales, generateScale, reload, resolve }) {
  const linkedTo = new Map();
  for (const t of trace.tokens) for (const id of t.because) linkedTo.set(id, [...(linkedTo.get(id) ?? []), t.token]);
  const out = [];
  for (const p of [...answerPerturbations(stored, grammar), ...anchorPerturbations(stored, { primaryHue, darkCanvas, colorScales, generateScale })]) {
    if (p.notPresent) {
      out.push({ kind: p.kind, id: p.id, notPresent: p.notPresent });
      continue;
    }
    let moved;
    try {
      moved = movedBetween(values, resolve(reload(p.apply(stored))).values);
    } catch (e) {
      out.push({ kind: p.kind, id: p.id, change: p.change, error: String(e.message ?? e).slice(0, 200) });
      continue;
    }
    if (p.kind === "answer") {
      const linked = new Set(linkedTo.get(p.id) ?? []);
      const any = union(moved);
      // An answer that moves nothing generates no value: its links are not orphans one by one.
      const generates = any.length > 0;
      out.push({
        kind: "answer",
        id: p.id,
        change: p.change,
        generates,
        expected: [...linked].sort(),
        moved: any,
        orphans: generates ? [...linked].filter((t) => !any.includes(t)).sort() : [],
        hidden: any.filter((t) => !linked.has(t)),
      });
      continue;
    }
    const expected = expectedForAnchor(p.derives, values, links, chains);
    out.push({ kind: "anchor", id: p.id, change: p.change, expected: union(expected), moved: union(moved), ...compareSets(expected, moved) });
  }
  return out;
}
