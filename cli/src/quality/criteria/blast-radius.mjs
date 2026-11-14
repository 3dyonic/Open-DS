// Blast radius: one answer or one anchor changes, the scheme is loaded again with its own
// loader, and the tokens that move are compared with what the scheme records as depending on the
// change (cli/src/quality/blast.mjs). An expected token that does not move is an orphan hard-code; a
// token that moves with no record is a hidden coupling. An answer that moves no value at all is counted
// apart, as "answers do not generate values", so it never hides what the anchors find. The generation
// criteria count what answers do drive: the traced tokens that move when an answer they cite changes.
import { measureOf, perSchemeOf, share, sum } from "./measure.mjs";

export const FAMILY = "blast-radius";

const count = (s, kind, field) => s.blast.filter((b) => b.kind === kind).reduce((n, b) => n + (b[field]?.length ?? 0), 0);
const answers = (s) => s.blast.filter((b) => b.kind === "answer" && !b.notPresent && !b.error);
const generating = (s) => answers(s).filter((b) => b.generates);

/** The tokens of one scheme that move when an answer their trace cites changes, sorted. */
export function answerDriven(s) {
  return [...new Set(answers(s).flatMap((b) => b.moved.filter((t) => b.expected.includes(t))))].sort();
}

export function measure(snapshot) {
  const ran = Object.values(snapshot.schemes).some((s) => s.blast.length);
  const driven = perSchemeOf(snapshot, (s) => answerDriven(s));
  const traced = perSchemeOf(snapshot, (s) => s.trace.filter((t) => t.because.length).length);
  const drivenCount = Object.fromEntries(Object.entries(driven).map(([id, l]) => [id, l.length]));
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
      id: "generation.answer-driven",
      family: "generation",
      title: "Semantic tokens whose value changes when an answer their trace cites changes (may only rise, per scheme)",
      direction: "up",
      value: ran ? sum(drivenCount) : null,
      perScheme: drivenCount,
      details: Object.entries(driven).map(([id, l]) => `${id}: ${l.length} of ${traced[id]} traced tokens${l.length ? ` — ${l.join(", ")}` : ""}`),
    }),
    measureOf({
      id: "generation.answer-driven-share",
      family: "generation",
      title: "Share of traced semantic tokens that an answer they cite drives (may only rise, per scheme)",
      direction: "up",
      value: ran ? share(sum(drivenCount), sum(traced)) : null,
      perScheme: Object.fromEntries(Object.keys(traced).map((id) => [id, share(drivenCount[id], traced[id])])),
      details: [`${sum(drivenCount)} of ${sum(traced)} traced tokens move with an answer they cite`],
    }),
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
      title:
        "Only answers that move at least one value: tokens citing such an answer that do not move. Answers that move nothing are not counted, so 0 does not mean answers drive values; see generation.answer-driven",
      direction: "down",
      value: ran ? sum(answerOrphans) : null,
      perScheme: answerOrphans,
      notes:
        ran && !sum(perSchemeOf(snapshot, (s) => generating(s).length))
          ? ["Counts only answers that move a value. No answer moves one, so it is 0 by construction, not a clean result."]
          : [],
      details: lines("answer", "orphans"),
    }),
    measureOf({
      id: "blast-radius.answer-orphan-share",
      family: FAMILY,
      title: "Only answers that move at least one value: the share of their trace links that do not move (not present when no answer moves a value)",
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
