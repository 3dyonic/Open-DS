// Traceability (OD-298): how many semantic values reach an answer, and how many reasons fail to
// explain their value, by the kind of reason they have (reasonOf in cli/src/trace.mjs).
import { measureOf, perSchemeOf, share, sum } from "./measure.mjs";

export const FAMILY = "traceability";
/** The kinds of reason a value can have, from reasonOf. */
export const REASON_KINDS = ["own", "exact-rule", "borrowed", "linked", "none"];

export function measure(snapshot) {
  const total = perSchemeOf(snapshot, (s) => s.trace.length);
  const traced = perSchemeOf(snapshot, (s) => s.trace.filter((t) => t.because.length).length);
  const untraced = perSchemeOf(snapshot, (s) => s.trace.filter((t) => !t.because.length).length);
  const weak = perSchemeOf(snapshot, (s) => s.trace.filter((t) => t.weak).length);
  const list = (pick) => Object.entries(snapshot.schemes).flatMap(([id, s]) => s.trace.filter(pick).map((t) => `${id}: ${t.token}${t.weak ? `, ${t.weak}` : ""}`));
  return [
    measureOf({
      id: "traceability.traced-share",
      family: FAMILY,
      title: "Share of semantic values that reach an answer",
      direction: "up",
      value: share(sum(traced), sum(total)),
      perScheme: Object.fromEntries(Object.keys(total).map((id) => [id, share(traced[id], total[id])])),
      details: [`${sum(traced)} of ${sum(total)} values traced`],
    }),
    measureOf({
      id: "traceability.untraced",
      family: FAMILY,
      title: "Semantic values that reach no answer",
      direction: "down",
      value: sum(untraced),
      perScheme: untraced,
      details: list((t) => !t.because.length),
    }),
    measureOf({
      id: "traceability.weak",
      family: FAMILY,
      title: "Values whose reason does not explain them (weakReasons)",
      direction: "down",
      value: sum(weak),
      perScheme: weak,
      details: list((t) => t.weak),
    }),
    ...REASON_KINDS.map((kind) => {
      const n = perSchemeOf(snapshot, (s) => s.trace.filter((t) => t.weak && t.reason === kind).length);
      return measureOf({
        id: `traceability.weak.${kind}`,
        family: FAMILY,
        title: `Weak reasons of kind "${kind}"`,
        direction: "down",
        value: sum(n),
        perScheme: n,
        details: list((t) => t.weak && t.reason === kind),
      });
    }),
  ];
}
