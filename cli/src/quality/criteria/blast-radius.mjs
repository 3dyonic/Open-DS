// Blast radius (OD-298): one answer or one anchor changes, the scheme is loaded again with its own
// loader, and the tokens that move are compared with what the trace says depends on the change. An
// expected token that does not move is an orphan hard-code; a token that moves with no trace link is a
// hidden coupling.
import { measureOf, perSchemeOf, share, sum } from "./measure.mjs";

export const FAMILY = "blast-radius";

const count = (s, kind, field) => s.blast.filter((b) => b.kind === kind).reduce((n, b) => n + (b[field]?.length ?? 0), 0);

export function measure(snapshot) {
  const ran = Object.values(snapshot.schemes).some((s) => s.blast.length);
  const answers = perSchemeOf(snapshot, (s) => count(s, "answer", "orphans"));
  const anchors = perSchemeOf(snapshot, (s) => count(s, "anchor", "orphans"));
  const hidden = perSchemeOf(snapshot, (s) => count(s, "answer", "hidden") + count(s, "anchor", "hidden"));
  const lines = (kind, field) =>
    Object.entries(snapshot.schemes).flatMap(([id, s]) =>
      s.blast
        .filter((b) => (kind ? b.kind === kind : true) && (b[field]?.length || b.notPresent || b.error))
        .map((b) =>
          b.notPresent
            ? `${id} ${b.id}: not present (${b.notPresent})`
            : b.error
              ? `${id} ${b.id}: could not reload (${b.error})`
              : `${id} ${b.id} (${b.change}): ${b[field].length} — ${b[field].slice(0, 8).join(", ")}${b[field].length > 8 ? ", …" : ""}`,
        ),
    );
  return [
    measureOf({
      id: "blast-radius.answer-orphans",
      family: FAMILY,
      title: "Tokens the trace ties to an answer that do not move when the answer changes",
      direction: "down",
      value: ran ? sum(answers) : null,
      perScheme: answers,
      details: lines("answer", "orphans"),
    }),
    measureOf({
      id: "blast-radius.answer-orphan-share",
      family: FAMILY,
      title: "Share of the answer links the trace claims that a changed answer does not move",
      direction: "report",
      value: ran ? share(sum(answers), sum(perSchemeOf(snapshot, (s) => count(s, "answer", "expected")))) : null,
      details: [`${sum(answers)} of ${sum(perSchemeOf(snapshot, (s) => count(s, "answer", "expected")))} answer links do not move`],
    }),
    measureOf({
      id: "blast-radius.anchor-orphans",
      family: FAMILY,
      title: "Tokens an anchor's chain or relations tie to it that do not move when it changes",
      direction: "down",
      value: ran ? sum(anchors) : null,
      perScheme: anchors,
      details: lines("anchor", "orphans"),
    }),
    measureOf({
      id: "blast-radius.hidden-couplings",
      family: FAMILY,
      title: "Tokens that move when an answer or anchor changes, with no trace link to it",
      direction: "down",
      value: ran ? sum(hidden) : null,
      perScheme: hidden,
      details: lines(null, "hidden"),
    }),
  ];
}
