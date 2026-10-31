"use client";
// What moves (Figma 128:1261). Change one answer; every answer that follows from it, directly or
// through other answers, is traced. The "after" comes from the closest scheme that already gives
// the new answer, so every value shown is a real answer with a real reason.
import { Button } from "@open-ds/ui";
import { useMemo, useState } from "react";
import type { AnswerBook } from "@/lib/answers";
import { followers } from "@/lib/follow";

export function MovesView({
  book,
  schemeId,
  start,
  sample,
}: {
  book: AnswerBook;
  schemeId: string;
  start: { question: string; option: string };
  // The scheme's own action and two rows of its content, so the before and after show its words.
  sample: { action: string; rows: [string, string][] };
}) {
  const me = book.schemes.find((s) => s.id === schemeId)!;
  const [question, setQuestion] = useState(start.question);
  const qv = book.questions.find((q) => q.id === question)!;
  const firstOther = Object.keys(qv.options).find((o) => o !== me.answers[question].option)!;
  const [option, setOption] = useState(start.question === question ? start.option : firstOther);
  // The option state can belong to the previous question; fall back to a valid other answer.
  const chosen =
    option in qv.options && option !== me.answers[question].option ? option : firstOther;
  const q = Object.fromEntries(book.questions.map((x) => [x.id, x]));

  const result = useMemo(() => {
    const follows = new Set(followers(me.answers, question));
    const shared = (s: (typeof book.schemes)[number]) =>
      Object.keys(s.answers).filter((id) => s.answers[id].option === me.answers[id].option).length;
    const donor = book.schemes
      .filter((s) => s.id !== me.id && s.answers[question].option === chosen)
      .sort((x, y) => shared(y) - shared(x))[0];
    const moved = donor
      ? [...follows].filter((id) => donor.answers[id].option !== me.answers[id].option)
      : [];
    const scopes = book.scopes.filter((sc) => moved.some((id) => id.startsWith(`${sc.id}.`)));
    return {
      follows: [...follows],
      donor,
      moved,
      components: [...new Set(scopes.flatMap((sc) => sc.lands))],
      keys: [...new Set(scopes.flatMap((sc) => sc.keys))],
    };
  }, [book, me, question, chosen]);

  const stat = (n: number, label: string) => (
    <div className="flex flex-col">
      <span className="text-[40px] leading-none font-extrabold">{n}</span>
      <span className="font-mono text-[12px] text-line">{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <section className="inverse flex flex-col gap-6 rounded-[8px] bg-ink p-7 text-paper lg:flex-row lg:items-center">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="mv-q"
            className="font-mono text-[12px] uppercase tracking-[0.48px] text-line"
          >
            {question} · {qv.text}
          </label>
          <select
            id="mv-q"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="max-w-[420px] rounded-[4px] border border-muted bg-ink px-3 py-2 text-[15px]"
          >
            {book.questions.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id} · {x.text}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-[4px] border border-muted px-3 py-2 text-[20px] font-semibold text-line">
              {qv.options[me.answers[question].option]}
            </span>
            <span aria-hidden className="text-[22px] text-accent">
              →
            </span>
            <label htmlFor="mv-o" className="sr-only">
              New answer
            </label>
            <select
              id="mv-o"
              value={chosen}
              onChange={(e) => setOption(e.target.value)}
              className="max-w-full rounded-[4px] bg-accent px-3 py-2 text-[20px] font-semibold text-ink"
            >
              {Object.entries(qv.options)
                .filter(([id]) => id !== me.answers[question].option)
                .map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-8 lg:ml-auto">
          {stat(result.moved.length, "answers move")}
          {stat(result.follows.length, "answers follow from it")}
          {stat(result.components.length, "components change")}
          {stat(result.keys.length, "keys change")}
        </div>
      </section>

      <section className="flex flex-col gap-3" aria-label="Answers that move, and why">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[0.48px] text-accent-text">
          Answers that move, and why
        </p>
        {!result.donor && (
          <p className="rounded-[6px] border border-line bg-white p-5">
            No scheme answers {question} with “{qv.options[chosen]}” yet, so there is no real answer
            to move to. These {result.follows.length} answers follow from it and would need a new
            look: {result.follows.join(", ") || "none"}.
          </p>
        )}
        {result.donor && result.moved.length === 0 && (
          <p className="rounded-[6px] border border-line bg-white p-5">
            Nothing else moves: the answers that follow from it stay the same.
          </p>
        )}
        <ul className="flex flex-col gap-[10px]">
          {result.moved.map((id) => {
            const after = result.donor!.answers[id];
            return (
              <li
                key={id}
                className="grid gap-4 rounded-[6px] border border-line bg-white p-5 md:grid-cols-[300px_1fr] md:items-center"
              >
                <div className="flex flex-col gap-2">
                  <span className="self-start rounded-[3px] bg-tag px-2 py-[3px] font-mono text-[12px]">
                    {id}
                  </span>
                  <span className="text-[17px] font-semibold">{q[id].text}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-[3px] border border-line px-[10px] py-[5px] font-mono text-[13px] text-muted">
                    {q[id].options[me.answers[id].option]}
                  </span>
                  <span aria-hidden className="text-accent">
                    →
                  </span>
                  <span className="flex items-center gap-2 rounded-[3px] bg-ink px-[10px] py-[5px] font-mono text-[13px] text-paper">
                    <span aria-hidden className="size-[7px] bg-accent" />
                    {q[id].options[after.option]}
                  </span>
                  <span className="font-mono text-[12px] text-muted">because</span>
                  <span className="text-[15px]">{after.why}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {result.donor && (
        <section
          className="flex flex-col gap-4 rounded-[8px] border border-line bg-white p-7"
          aria-label="Where it lands, before and after"
        >
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.48px] text-accent-text">
            Where it lands · before → after
          </p>
          {[
            ["Button", () => <Button>{sample.action}</Button>],
            [
              "Table row",
              () => (
                <table className="border border-[var(--table-row-border)] text-[length:var(--table-font-size)]">
                  <tbody>
                    {sample.rows.map(([k, v]) => (
                      <tr
                        key={k}
                        className="h-[var(--table-row-height)] border-b border-[var(--table-row-border)]"
                      >
                        <td className="px-[var(--table-cell-padding-x)] [font-family:var(--type-data-font-family)]">
                          {k}
                        </td>
                        <td className="px-[var(--table-cell-padding-x)] text-right [font-family:var(--type-data-font-family)]">
                          {v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ),
            ],
          ].map(([name, draw]) => (
            <div
              key={name as string}
              className="flex flex-wrap items-center gap-6 rounded-[6px] bg-well p-4"
            >
              <span className="w-[140px] text-[17px] font-semibold">{name as string}</span>
              {[me.id, result.donor!.id].map((sid, i) => (
                <div key={sid} className="flex items-center gap-6">
                  {i === 1 && (
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                  )}
                  <div
                    data-scheme={sid}
                    className="text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)]"
                  >
                    {(draw as () => React.ReactNode)()}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <p className="font-mono text-[12px] text-muted">
            After: the answers of {result.donor.name}, the closest scheme that answers {question}{" "}
            with “{qv.options[chosen]}”. Components that change:{" "}
            {result.components.join(", ") || "none"}.
          </p>
        </section>
      )}
    </div>
  );
}
