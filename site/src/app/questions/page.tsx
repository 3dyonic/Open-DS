// The grammar index, built from the Figma frame G Grammar index (130:900).
import type { Metadata } from "next";
import { Eyebrow } from "@/components/chrome";
import { DemoNote } from "@/components/demo-note";
import { WithRobot } from "@/components/robot";
import Link from "next/link";
import { grammar, type Group } from "@/lib/schemes";

export const metadata: Metadata = {
  title: "Every question, once",
  description:
    "The master list every scheme answers: reason questions and scope questions, each with a stable id.",
};

function GroupLinks({ groups }: { groups: Group[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((grp) => (
        <li key={grp.id}>
          <Link
            href={`/questions/${grp.id}/`}
            className="flex h-full flex-col gap-2 rounded-[8px] border border-line bg-white p-5 hover:border-ink"
          >
            <span className="flex flex-col gap-[2px]">
              <span className="text-[19px] font-extrabold">{grp.title}</span>
              <span className="font-mono text-[12px] text-muted">
                {grp.questions.length} questions
              </span>
            </span>
            <span className="text-[14px] leading-[1.45] text-body">{grp.description}</span>
          </Link>
        </li>
      ))}
    </ul>
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
    <>
      <header className="flex flex-col gap-4">
        <WithRobot name="enquire" priority>
          <Eyebrow>The grammar</Eyebrow>
          <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
            Every question, once.
          </h1>
          <p className="max-w-[880px] text-[19px] leading-[1.45] text-body">
            The master list every scheme answers. {reasonCount} reason questions and {scopeCount}{" "}
            scope questions, each with a stable id. Every scope answers the same five questions:{" "}
            {g.methods.map((m) => m.title.toLowerCase()).join(", ")}. The answers make each design
            system.
          </p>
        </WithRobot>
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
        <GroupLinks groups={g.reasons} />
      </section>
      <section className="flex flex-col gap-4" aria-labelledby="scopes">
        <Eyebrow>
          <span id="scopes">Scopes · {scopeCount} questions</span>
        </Eyebrow>
        <GroupLinks groups={g.scopes} />
      </section>
      <section className="inverse flex flex-col gap-3 rounded-[8px] bg-ink p-7 text-paper">
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
    </>
  );
}
