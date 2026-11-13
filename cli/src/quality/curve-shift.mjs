// The shift report of OD-299: every color token of every scheme, brand and mode, built on the shared
// curve (old) and on the contrast-graded curve (new), side by side in one process. Each move gets its
// tier: under 0.02 OKLab passes; 0.02 to 0.05 needs a recorded reason that names the method; over 0.05
// keeps its current value (the step is held) and goes on the owner's list. Surfaces take the tighter
// limits of params.shift.roles. The relation gates of OD-298 must hold between old and new.
import { curveOf, differenceThreshold, stepsAnswer } from "../color-steps.mjs";
import { differenceFailures } from "./difference.mjs";
import { scale } from "../ramps.mjs";
import { colorMoves, keyChanges, tierOf, tiersFor } from "./criteria/shift.mjs";
import { relationFlags, stateFamilies } from "./criteria/color-relations.mjs";
import { hex6 } from "./values.mjs";
import { gradeMisses } from "./criteria/curves.mjs";
import { oklabDistance } from "./color.mjs";
import { DEFAULT_PARAMS } from "./params.mjs";
import { snapshotScheme } from "./snapshot.mjs";

/**
 * The snapshots of both curves: { old, new }, each shaped as extractRef returns it. load(id, graded)
 * loads a scheme; themeTokens builds its token tree. No approvals: every flag counts.
 */
export function curveSnapshots({ ids, load, stored, grammar, themeTokens }) {
  const side = (graded) => {
    const schemes = {};
    for (const id of ids) {
      const scheme = load(id, graded);
      const curve = curveOf(scheme, graded);
      const generateScale = (spec, mode, canvas) => scale(spec, mode, canvas, curve);
      schemes[id] = snapshotScheme({ scheme, stored: stored(id), grammar, themeTokens, reload: null, generateScale });
    }
    return { ref: graded ? "graded curve" : "shared curve", schemes, approvals: [] };
  };
  return { old: side(false), new: side(true) };
}

/** Moves of the scale steps themselves: [{ scheme, hue, mode, step, from, to, distance, tier }]. */
export function stepMoves(base, candidate, params = DEFAULT_PARAMS) {
  const out = [];
  for (const [id, c] of Object.entries(candidate.schemes))
    for (const [hue, modes] of Object.entries(c.palette ?? {}))
      for (const [mode, row] of Object.entries(modes))
        for (const [step, to] of Object.entries(row)) {
          const from = base.schemes[id]?.palette?.[hue]?.[mode]?.[step];
          if (!from) continue;
          const distance = oklabDistance(from, to);
          const tier = tierOf(distance, tiersFor(`color.${hue}.${mode}.${step}`, params.shift));
          if (tier !== "none") out.push({ scheme: id, hue, mode, step, from, to, distance, tier });
        }
  return out;
}

/**
 * The relation gates between old and new, with the flags each raises, only the gates that fire:
 * [{ id, title, flags }]. The gates of OD-298, and the state gap: a rest → hover → pressed step that
 * was at least params.relations.stateGap apart on old and is closer now.
 */
export function gates(base, candidate, params = DEFAULT_PARAMS) {
  const gap = params.relations.stateGap;
  const close = [];
  for (const [id, c] of Object.entries(candidate.schemes)) {
    const b = base.schemes[id];
    for (const t of c.themes) {
      const [vb, vc] = [b?.values[t.id] ?? {}, c.values[t.id] ?? {}];
      for (const f of stateFamilies(Object.keys(vc).filter((n) => hex6(vc[n]) && hex6(vb[n]))))
        for (let i = 1; i < f.length; i++) {
          const [was, now] = [oklabDistance(hex6(vb[f[i - 1]]), hex6(vb[f[i]])), oklabDistance(hex6(vc[f[i - 1]]), hex6(vc[f[i]]))];
          if (was >= gap && now < gap) close.push({ scheme: id, themes: [t.id], tokens: [f[i - 1], f[i]], says: `${id}/${t.id}: ${f[i - 1]} → ${f[i]} was ${was.toFixed(3)} apart, now ${now.toFixed(3)}` });
        }
    }
  }
  // The difference check (OD-299): no pair may fail on new that passes on old.
  const threshold = (s) => (id) => differenceThreshold({ answers: s.schemes[id].decisions.answers });
  const failedBefore = new Set(differenceFailures(base, threshold(base)).map((f) => f.id));
  const different = differenceFailures(candidate, threshold(candidate))
    .filter((f) => !failedBefore.has(f.id))
    .map((f) => ({ scheme: f.scheme, themes: [f.theme], tokens: f.tokens, says: `${f.id}: now ${f.distance.toFixed(3)} apart, under the scheme's difference threshold` }));
  return [
    ...relationFlags(base, candidate, params),
    { id: "relations.state-gap-lost", title: `State steps that fall under a visible gap (${gap})`, flags: close },
    { id: "difference.new-failures", title: "Pairs that fail the difference check on the graded curve and pass on the shared one", flags: different },
  ].filter((r) => r.flags.length);
}

// The scale step a semantic token resolves to, from its chain: { hue, mode, step } or null.
function stepOf(snapshot, scheme, theme, token) {
  const end = snapshot.schemes[scheme]?.chains?.[theme]?.[token]?.end;
  const m = end?.match(/^color\.([a-z0-9-]+)\.(light|dark)\.(\d+)$/);
  return m ? { hue: m[1], mode: m[2], step: m[3] } : null;
}

const PALETTE = /^color\.([a-z0-9-]+)\.(light|dark)\.(\d+)$/;

/**
 * The steps to hold, each keeping its shared-curve value: { scheme: { hue: { mode: { step: why } } } }.
 * why is "over-limit" (a scale step, or a semantic token on it, moves over its tier limit; surfaces
 * take their tighter limit), "relation" (a token on it is in a relation gate that fires), or "order"
 * (a held run reaches from a held step to its end of the scale, so held and graded steps never swap).
 */
export function stepsToHold(base, candidate, params = DEFAULT_PARAMS) {
  const out = {};
  const add = (scheme, s, why) => {
    // Only a generated hue (one with a recorded key) has a curve to hold.
    if (!candidate.schemes[scheme]?.keys?.[s.hue]?.[s.mode]) return;
    const row = (((out[scheme] ??= {})[s.hue] ??= {})[s.mode] ??= {});
    row[s.step] ??= why;
  };
  for (const m of stepMoves(base, candidate, params)) if (m.tier === "approval") add(m.scheme, m, "over-limit");
  for (const m of colorMoves(base, candidate, params))
    if (m.tier === "approval") {
      const s = stepOf(candidate, m.scheme, m.theme, m.token);
      if (s) add(m.scheme, s, "over-limit");
    }
  for (const r of gates(base, candidate, params))
    for (const flag of r.flags)
      for (const token of flag.tokens) {
        const p = token.match(PALETTE);
        if (p) add(flag.scheme, { hue: p[1], mode: p[2], step: p[3] }, "relation");
        else for (const theme of flag.themes) {
          const s = stepOf(candidate, flag.scheme, theme, token);
          if (s) add(flag.scheme, s, "relation");
        }
      }
  // A held step above the key holds every step from it up to 50; one below, every step down to 950.
  for (const hues of Object.values(out))
    for (const modes of Object.values(hues))
      for (const row of Object.values(modes))
        for (const st of Object.keys(row))
          for (const other of ["50", "100", "200", "300", "400", "500", "700", "800", "900", "950"])
            if ((+st < 600 && +other < +st) || (+st > 600 && +other > +st)) row[other] ??= "order";
  return out;
}

/**
 * The whole report: { moves, steps, relations, keys, grades, perScheme }. moves are the semantic token
 * moves; steps the scale step moves; relations the gate flags that fire; keys the brand key changes;
 * grades the step pairs under their contrast grade, old and new.
 */
export function shiftReport(base, candidate, params = DEFAULT_PARAMS) {
  const moves = colorMoves(base, candidate, params);
  const steps = stepMoves(base, candidate, params);
  const relations = gates(base, candidate, params).map((r) => ({ id: r.id, title: r.title, value: r.flags.length, details: r.flags.map((f) => f.says) }));
  const keys = keyChanges(base, candidate);
  const grades = { old: gradeMisses(base, params.curves.grades), new: gradeMisses(candidate, params.curves.grades) };
  const perScheme = {};
  for (const id of Object.keys(candidate.schemes)) {
    const tally = (list) => Object.fromEntries(["pass", "review", "approval"].map((t) => [t, list.filter((m) => m.scheme === id && m.tier === t).length]));
    perScheme[id] = { tokens: tally(moves), steps: tally(steps), gradesOld: grades.old.filter((g) => g.scheme === id).length, gradesNew: grades.new.filter((g) => g.scheme === id).length };
  }
  return { moves, steps, relations, keys, grades, perScheme };
}

/** The easing of each scheme's step answer, for the report's header: { scheme: { option, easing } }. */
export const answersOf = (schemes) => Object.fromEntries(Object.entries(schemes).map(([id, s]) => [id, stepsAnswer(s)]));
