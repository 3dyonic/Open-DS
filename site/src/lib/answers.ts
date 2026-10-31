// A compact view of every scheme's answers, for the pages that compare schemes or trace what
// moves when one answer changes. It runs at build time and is passed to client components.
import { followers, type AnswerView } from "./follow";
import { grammar, schemes } from "./schemes";

export type { AnswerView };
export interface QuestionView {
  id: string;
  text: string;
  group: string;
  groupTitle: string;
  kind: "reason" | "scope";
  options: Record<string, string>;
}

export function answerBook() {
  const g = grammar();
  const questions: QuestionView[] = [...g.reasons, ...g.scopes].flatMap((grp) =>
    grp.questions.map((q) => ({
      id: q.id,
      text: q.text,
      group: grp.id,
      groupTitle: grp.title,
      kind: grp.kind,
      options: Object.fromEntries(q.options.map((o) => [o.id, o.label])),
    })),
  );
  const book = schemes().map((s) => ({
    id: s.id,
    name: s.name,
    answers: Object.fromEntries(
      s.answers.map((a) => [a.question, { option: a.option, why: a.why, because: a.because }]),
    ) as Record<string, AnswerView>,
  }));
  const scopes = g.scopes.map((sc) => ({
    id: sc.id,
    title: sc.title,
    lands: sc.lands_in ?? [],
    keys: g.component_keys
      .filter((k) => (sc.owns ?? []).some((o) => k.default.startsWith(o)))
      .map((k) => k.id),
  }));
  return { questions, schemes: book, scopes };
}
export type AnswerBook = ReturnType<typeof answerBook>;

/** A focused example: a reason answer another scheme gives differently, moving about five answers. */
export function bestStart(book: AnswerBook, schemeId: string) {
  const me = book.schemes.find((s) => s.id === schemeId)!;
  let best = { question: "", option: "", moved: -1, score: Infinity };
  for (const q of book.questions.filter((x) => x.kind === "reason")) {
    const follows = followers(me.answers, q.id);
    for (const other of book.schemes) {
      const option = other.answers[q.id].option;
      if (other.id === me.id || option === me.answers[q.id].option) continue;
      const moved = follows.filter(
        (id) => other.answers[id].option !== me.answers[id].option,
      ).length;
      const score = moved === 0 ? Infinity : Math.abs(moved - 5);
      if (score < best.score) best = { question: q.id, option, moved, score };
    }
  }
  return { question: best.question, option: best.option };
}
