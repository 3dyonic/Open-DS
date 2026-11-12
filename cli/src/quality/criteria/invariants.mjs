// Invariants (OD-298): each relation a scheme records, and each minimum relation the owner decided,
// holds per scheme. Counted as failing checks; a relation a scheme does not have yet is "not present".
import { RELATION_LIST } from "../relations.mjs";
import { measureOf, perSchemeOf, sum } from "./measure.mjs";

export const FAMILY = "invariants";

/** Failing checks of one relation per scheme, with the lines that say why. */
export function relationMeasure(snapshot, { id, family, title }) {
  const failing = perSchemeOf(snapshot, (s) => {
    const r = s.relations.find((x) => x.id === id);
    return r && r.status !== "not present" ? r.checks.filter((c) => !c.pass).length : 0;
  });
  const present = Object.values(snapshot.schemes).some((s) => s.relations.find((x) => x.id === id)?.status !== "not present");
  const details = Object.entries(snapshot.schemes).flatMap(([sid, s]) => {
    const r = s.relations.find((x) => x.id === id);
    if (!r) return [`${sid}: not present`];
    const head = `${sid}: ${r.status}${r.notPresent?.length ? ` (not present: ${r.notPresent.join(", ")})` : ""}`;
    return [head, ...r.checks.filter((c) => !c.pass).map((c) => `  ${c.says}`)];
  });
  return measureOf({ id: `${family}.${id}`, family, title, direction: "down", value: present ? sum(failing) : null, perScheme: failing, details });
}

export function measure(snapshot) {
  const own = RELATION_LIST.filter((r) => r.family === FAMILY);
  const each = own.map((r) => relationMeasure(snapshot, r));
  return [
    measureOf({
      id: "invariants.failures",
      family: FAMILY,
      title: "Failing relation checks, all invariants",
      direction: "down",
      value: sum(Object.fromEntries(each.map((m) => [m.id, m.value ?? 0]))),
      perScheme: perSchemeOf(snapshot, (s) => s.relations.filter((r) => r.family === FAMILY).reduce((n, r) => n + r.checks.filter((c) => !c.pass).length, 0)),
      details: Object.entries(snapshot.schemes).map(([sid, s]) => `${sid}: ${s.relations.map((r) => `${r.id} ${r.status}`).join(", ")}`),
    }),
    ...each,
  ];
}
