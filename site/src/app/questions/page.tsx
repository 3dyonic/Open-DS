// The grammar index, built from the Figma frame G Grammar index (130:900).
import type { Metadata } from "next";
import { Eyebrow } from "@/components/chrome";
import { DemoNote } from "@/components/demo-note";
import { Options } from "@/components/options";
import { grammar, pickedBy, type Group } from "@/lib/schemes";

export const metadata: Metadata = {
  title: "Every question, once",
  description:
    "The master list every scheme answers: reason questions and scope questions, each with a stable id.",
};

function GroupCard({ grp }: { grp: Group }) {
  return (
    <li className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-5">
      <h3 className="text-[20px] font-extrabold">
        {grp.title}{" "}
        <span className="font-mono text-[12px] font-normal text-muted">{grp.questions.length}</span>
      </h3>
      <ul className="flex flex-col">
        {grp.questions.map((q, i) => (
          <li
            key={q.id}
            id={q.id}
            className="flex flex-col gap-[8px] border-t border-tag py-[12px]"
          >
            <span className="text-[13px] text-muted">
              Question {i + 1} of {grp.questions.length} · {q.options.length} possible answers
            </span>
            <span className="text-[16px] font-semibold">{q.text}</span>
            <Options
              options={q.options}
              pickedBy={pickedBy(q.id)}
              label={`The options for: ${q.text}`}
            />
          </li>
        ))}
      </ul>
    </li>
  );
}

export default function QuestionsPage() {
  const g = grammar();
  const reasonCount = g.reasons.reduce((n, r) => n + r.questions.length, 0);
  const scopeCount = g.scopes.reduce((n, r) => n + r.questions.length, 0);
  const layers: [string, string, boolean][] = [
    ["Reasons", String(reasonCount), true],
    ["Scopes", String(scopeCount), true],
    ["Tokens", "reference", false],
    ["Component API", "keys", false],
  ];
  return (
    <div className="flex flex-col gap-10 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <Eyebrow>The grammar</Eyebrow>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          Every question, once.
        </h1>
        <p className="max-w-[880px] text-[19px] leading-[1.45] text-[#3e3a31]">
          The master list every scheme answers. {reasonCount} reason questions and {scopeCount}{" "}
          scope questions, each with a stable id. Every scope answers the same five questions:{" "}
          {g.methods.map((m) => m.title.toLowerCase()).join(", ")}. The answers make each design
          system.
        </p>
        <ol className="flex flex-wrap items-center gap-3">
          {layers.map(([t, n, on], i) => (
            <li key={t} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden className="text-accent">
                  →
                </span>
              )}
              <span
                className={`flex items-center gap-2 rounded-[4px] border px-3 py-[7px] text-[15px] font-semibold ${on ? "border-ink bg-ink text-paper" : "border-ink bg-white"}`}
              >
                <span aria-hidden className={`size-[7px] ${on ? "bg-accent" : "bg-tag"}`} />
                {t} <span className="font-mono text-[11px] font-normal opacity-70">{n}</span>
              </span>
            </li>
          ))}
        </ol>
      </header>
      <DemoNote />
      <section className="flex flex-col gap-4" aria-labelledby="reasons">
        <Eyebrow>
          <span id="reasons">Reasons · {reasonCount} questions</span>
        </Eyebrow>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {g.reasons.map((r) => (
            <GroupCard key={r.id} grp={r} />
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-4" aria-labelledby="scopes">
        <Eyebrow>
          <span id="scopes">Scopes · {scopeCount} questions</span>
        </Eyebrow>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {g.scopes.map((r) => (
            <GroupCard key={r.id} grp={r} />
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-3 rounded-[8px] bg-ink p-7 text-paper">
        <Eyebrow tone="accent">Rules of the grammar</Eyebrow>
        <ul className="flex flex-col gap-2 text-[16px]">
          {[
            "A question is never asked about a component. Components receive the answers.",
            "Every scope answers the same five questions: roles, how many, how defined, values, lands in.",
            "Every scope answer has a because: a reason id, or another answer’s id.",
            "Written text, such as voice and scenarios, is an output. It lists the answers it follows.",
            "Ids never change. Options are finite. A new option is proposed like a new question.",
            "Tokens and component keys follow from answers and are reference, not questions.",
          ].map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
