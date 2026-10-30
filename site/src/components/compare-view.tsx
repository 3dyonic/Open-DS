"use client";
// Compare two schemes (Figma 128:900): every question where they differ, with each because.
import { useState } from "react";
import type { AnswerBook } from "@/lib/answers";

export function CompareView({ book }: { book: AnswerBook }) {
  const [a, setA] = useState(book.schemes.find((s) => s.id === "dense-data")!.id);
  const [b, setB] = useState(book.schemes.find((s) => s.id === "content-first")!.id);
  const A = book.schemes.find((s) => s.id === a)!;
  const B = book.schemes.find((s) => s.id === b)!;
  const q = Object.fromEntries(book.questions.map((x) => [x.id, x]));
  const differ = book.questions.filter((x) => A.answers[x.id].option !== B.answers[x.id].option);
  const same = book.questions.filter((x) => A.answers[x.id].option === B.answers[x.id].option);
  const select = "rounded-[4px] border px-3 py-[7px] text-[15px] font-semibold";

  const side = (s: typeof A, lead: boolean, id: string) => {
    const ans = s.answers[id];
    return (
      <div className="flex flex-col gap-2">
        <span
          className={`flex items-center gap-2 self-start rounded-[4px] border border-ink px-[9px] py-[5px] text-[15px] font-semibold ${lead ? "bg-ink text-paper" : "bg-white"}`}
        >
          <span aria-hidden className={`size-[7px] ${lead ? "bg-accent" : "bg-ink"}`} />
          {q[id].options[ans.option]}
        </span>
        <span className="flex flex-wrap items-center gap-[6px]">
          <span className="font-mono text-[12px] text-muted">because</span>
          {ans.because.length ? (
            ans.because.map((c) => (
              <span
                key={c}
                className="rounded-[3px] bg-accent-soft px-[6px] py-[3px] font-mono text-[12px] text-accent-text"
              >
                {c} {q[c].options[s.answers[c].option]}
              </span>
            ))
          ) : (
            <span className="font-mono text-[12px] text-accent-text">{ans.why}</span>
          )}
        </span>
      </div>
    );
  };

  const block = (title: string, rows: typeof differ) => (
    <section className="flex flex-col gap-2" aria-label={title}>
      <p className="font-mono text-[12px] font-medium uppercase tracking-[0.48px] text-accent-text">
        {title}
      </p>
      <div className="hidden grid-cols-[1fr_1fr_1fr] gap-6 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.44px] text-muted md:grid">
        <span>Question</span>
        <span>{A.name}</span>
        <span>{B.name}</span>
      </div>
      <ul className="flex flex-col gap-[10px]">
        {rows.map((x) => (
          <li
            key={x.id}
            className="grid gap-4 rounded-[6px] border border-line bg-white p-6 md:grid-cols-[1fr_1fr_1fr] md:gap-6"
          >
            <div className="flex flex-col gap-2">
              <span className="self-start rounded-[3px] bg-tag px-2 py-[3px] font-mono text-[12px]">
                {x.id}
              </span>
              <span className="text-[19px] font-semibold">{x.text}</span>
            </div>
            {side(A, true, x.id)}
            {side(B, false, x.id)}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="cmp-a">
          First scheme
        </label>
        <select
          id="cmp-a"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className={`${select} border-ink bg-ink text-paper`}
        >
          {book.schemes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <span className="text-muted">vs</span>
        <label className="sr-only" htmlFor="cmp-b">
          Second scheme
        </label>
        <select
          id="cmp-b"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className={`${select} border-ink bg-white`}
        >
          {book.schemes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <span className="font-mono text-[12px] text-muted">
          {differ.length} differences · {same.length} answers the same
        </span>
      </div>
      {block(
        "Reasons that differ",
        differ.filter((x) => x.kind === "reason"),
      )}
      {block(
        "Design answers that differ",
        differ.filter((x) => x.kind === "scope"),
      )}
      <details className="rounded-[6px] border border-line bg-white px-5 py-4">
        <summary className="cursor-pointer text-[17px] font-semibold">
          Answers that are the same ({same.length})
        </summary>
        <ul className="mt-3 flex flex-wrap gap-2">
          {same.map((x) => (
            <li
              key={x.id}
              title={x.text}
              className="rounded-[3px] bg-tag px-2 py-[3px] font-mono text-[12px]"
            >
              {x.id}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
