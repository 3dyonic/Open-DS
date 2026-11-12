// Invariants (OD-298): each relation a scheme records, and each minimum relation the owner decided,
// holds per scheme. Counted as failing checks; a relation a scheme does not have yet is "not present".
// A failing check the owner approved (harness/quality-approvals.json) is listed, not counted. The dark
// surface ladder reports, per scheme, a rung the scheme does not define (the floating surface).
import { RELATION_LIST } from "../relations.mjs";
import { measureOf, perSchemeOf, splitApproved, sum } from "./measure.mjs";

export const FAMILY = "invariants";

// The failing checks of one relation in one scheme, as flags the owner can approve one by one.
const flagsOf = (sid, r) =>
  r.checks
    .filter((c) => !c.pass)
    .map((c) => ({ scheme: sid, themes: c.themes ?? (c.theme ? [c.theme] : []), tokens: c.tokens ?? [c.subject], says: `  ${c.says}` }));

/** Failing checks of one relation per scheme, approved ones left out, with the lines that say why. */
export function relationMeasure(snapshot, { id, family, title }) {
  const check = `${family}.${id}`;
  const split = perSchemeOf(snapshot, (s, sid) => {
    const r = s.relations.find((x) => x.id === id);
    return r && r.status !== "not present" ? splitApproved(flagsOf(sid, r), snapshot.approvals, check) : { open: [], cleared: [] };
  });
  const failing = Object.fromEntries(Object.entries(split).map(([sid, x]) => [sid, x.open.length]));
  const present = Object.values(snapshot.schemes).some((s) => s.relations.find((x) => x.id === id)?.status !== "not present");
  const details = Object.entries(snapshot.schemes).flatMap(([sid, s]) => {
    const r = s.relations.find((x) => x.id === id);
    if (!r) return [`${sid}: not present`];
    const head = `${sid}: ${r.status}${r.notPresent?.length ? ` (not present: ${r.notPresent.join(", ")})` : ""}`;
    return [head, ...split[sid].open.map((f) => f.says), ...split[sid].cleared];
  });
  return measureOf({ id: check, family, title, direction: "down", value: present ? sum(failing) : null, perScheme: failing, details });
}

const FLOATING = "color.surface.floating";

export function measure(snapshot) {
  const own = RELATION_LIST.filter((r) => r.family === FAMILY);
  const each = own.map((r) => relationMeasure(snapshot, r));
  const failures = perSchemeOf(snapshot, () => 0);
  for (const m of each) for (const [sid, n] of Object.entries(m.perScheme)) failures[sid] += n;
  // No floating surface: the dark ladder stops at the rung below it, so floating is never checked.
  const floating = perSchemeOf(snapshot, (s) => (s.themes.some((t) => s.values[t.id]?.[FLOATING] !== undefined) ? 0 : 1));
  const missing = Object.keys(floating).filter((sid) => floating[sid]);
  return [
    measureOf({
      id: "invariants.failures",
      family: FAMILY,
      title: "Failing relation checks, all invariants",
      direction: "down",
      value: sum(failures),
      perScheme: failures,
      details: Object.entries(snapshot.schemes).map(([sid, s]) => `${sid}: ${s.relations.map((r) => `${r.id} ${r.status}`).join(", ")}`),
    }),
    ...each,
    measureOf({
      id: "invariants.floating-not-defined",
      family: FAMILY,
      title: `Schemes that define no ${FLOATING}, so the dark ladder never checks it (shown, not gated)`,
      direction: "report",
      value: missing.length,
      perScheme: floating,
      notes: missing.length ? [`Floating not defined in ${missing.join(", ")}: no ${FLOATING}, so the dark surface ladder is not checked above the raised surface. Not gated.`] : [],
      details: Object.keys(floating).map((sid) => `${sid}: ${floating[sid] ? "floating not defined" : "floating defined"}`),
    }),
  ];
}
