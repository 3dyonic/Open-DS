// Blast radius (OD-298): one answer or one anchor changes, the scheme is loaded again with its own
// loader, and the tokens that move are compared with what the scheme records as depending on the
// change (cli/src/quality/blast.mjs). An expected token that does not move is an orphan hard-code; a
// token that moves with no record is a hidden coupling. An answer that moves no value at all is counted
// apart, as "answers do not generate values", so it never hides what the anchors find.
import { measureOf, perSchemeOf, share, sum } from "./measure.mjs";

export const FAMILY = "blast-radius";

const count = (s, kind, field) => s.blast.filter((b) => b.kind === kind).reduce((n, b) => n + (b[field]?.length ?? 0), 0);
const answers = (s) => s.blast.filter((b) => b.kind === "answer" && !b.notPresent && !b.error);
const generating = (s) => answers(s).filter((b) => b.generates);

export function measure(snapshot) {
  const ran = Object.values(snapshot.schemes).some((s) => s.blast.length);
  const answerOrphans = perSchemeOf(snapshot, (s) => count(s, "answer", "orphans"));
  const anchors = perSchemeOf(snapshot, (s) => count(s, "anchor", "orphans"));
  const hidden = perSchemeOf(snapshot, (s) => count(s, "answer", "hidden") + count(s, "anchor", "hidden"));
  const silent = perSchemeOf(snapshot, (s) => answers(s).length - generating(s).length);
  const lines = (kind, field) =>
    Object.entries(snapshot.schemes).flatMap(([id, s]) =>
      s.blast
        .filter((b) => (kind ? b.kind === kind : true) && (b[field]?.length || b.notPresent || b.error))
        .map((b) =>
          b.notPresent
            ? `${id} ${b.id}: not present (${b.notPresent})`
            : b.error
              ? `${id} ${b.id}: could not reload (${b.error})`
              : `${id} ${b.id} (${b.change}): ${b[field].length} — ${b[field].join(", ")}`,
        ),
    );
  const silentLine = ([id, n]) => `${id}: ${n} of ${answers(snapshot.schemes[id]).length} answer changes move no value`;
  const linked = sum(perSchemeOf(snapshot, (s) => generating(s).reduce((n, b) => n + b.expected.length, 0)));
  return [
    measureOf({
      id: "blast-radius.answers-generate-nothing",
      family: FAMILY,
      title: "Answers that move no value when they change: answers do not generate values",
      direction: "report",
      value: ran ? sum(silent) : null,
      perScheme: silent,
      notes: ran && sum(silent) ? [`Answers do not generate values. ${Object.entries(silent).map(silentLine).join("; ")}. Their trace links are not counted as orphans.`] : [],
      details: Object.entries(silent).map(silentLine),
    }),
    measureOf({
      id: "blast-radius.answer-orphans",
      family: FAMILY,
      title: "Tokens the trace ties to an answer that do not move when that answer changes, among answers that move a value",
      direction: "down",
      value: ran ? sum(answerOrphans) : null,
      perScheme: answerOrphans,
      details: lines("answer", "orphans"),
    }),
    measureOf({
      id: "blast-radius.answer-orphan-share",
      family: FAMILY,
      title: "Share of the answer links the trace claims that a changed answer does not move, among answers that move a value",
      direction: "report",
      value: ran ? share(sum(answerOrphans), linked) : null,
      details: [`${sum(answerOrphans)} of ${linked} answer links do not move`],
    }),
    measureOf({
      id: "blast-radius.anchor-orphans",
      family: FAMILY,
      title: "Tokens recorded as derived from an anchor (its scale, relation or formula) that do not move when it changes",
      direction: "down",
      value: ran ? sum(anchors) : null,
      perScheme: anchors,
      details: lines("anchor", "orphans"),
    }),
    measureOf({
      id: "blast-radius.hidden-couplings",
      family: FAMILY,
      title: "Tokens that move when an answer or anchor changes, with no trace link or recorded derivation to it",
      direction: "down",
      value: ran ? sum(hidden) : null,
      perScheme: hidden,
      details: lines(null, "hidden"),
    }),
  ];
}
