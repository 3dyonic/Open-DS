// Contribute, built from the Figma frame S10 Contribute (129:1050).
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { grammar } from "@/lib/schemes";

export const metadata: Metadata = {
  title: "Contribute",
  description:
    "Publish your design system as a scheme: the same questions, your answers, your reasons.",
};

export default function ContributePage() {
  const g = grammar();
  const reasonQs = g.reasons.flatMap((r) => r.questions);
  const scopeQs = g.scopes.flatMap((r) => r.questions);
  const steps: [string, string, string[]][] = [
    [
      "Answer the reasons",
      `${g.reasons.map((r) => r.title.split(" ")[0].toLowerCase()).join(", ")}. The same questions every scheme answers.`,
      [...reasonQs.slice(0, 3).map((q) => q.id), `… ${reasonQs.length} questions`],
    ],
    [
      "Answer the scopes",
      `${g.scopes[0].title} to ${g.scopes[g.scopes.length - 1].title.toLowerCase()}. Every scope answers the same five questions, and each answer points to the reasons that chose it.`,
      [...scopeQs.slice(0, 3).map((q) => q.id), `… ${scopeQs.length} questions`],
    ],
    [
      "Check it",
      "Every answer has a because. Every token resolves in light and dark. Every situation has a usage rule.",
      ["pnpm harness", "every answer has a because", "tokens resolve"],
    ],
    [
      "Publish",
      "Open a pull request. Your scheme gets its own pages, its compare view and its full design system.",
      ["pull request", "compare", "take it"],
    ],
  ];
  return (
    <div className="flex flex-col gap-12 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex gap-[10px] font-mono text-[12px] font-medium uppercase tracking-[0.48px]"
        >
          <Link href="/schemes/" className="text-muted">
            Schemes
          </Link>
          <span className="text-muted">/</span>
          <span className="text-accent-text">Contribute</span>
        </nav>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          Add your answers.
        </h1>
        <p className="max-w-[880px] text-[19px] leading-[1.45] text-body">
          Publish your design system as a scheme: the same questions, your answers, your reasons. It
          joins the gallery, and anyone can compare it, take it, or learn from it.
        </p>
      </header>
      <ol className="flex flex-col gap-3">
        {steps.map(([t, p, chips], i) => (
          <li key={t} className="flex gap-6 rounded-[8px] border border-line bg-white p-6">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[3px] bg-ink text-[18px] font-extrabold text-paper">
              {i + 1}
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-[24px] font-extrabold">{t}</h2>
              <p className="text-[16px] text-body">{p}</p>
              <ul className="flex flex-wrap gap-[6px]">
                {chips.map((c) => (
                  <li key={c} className="rounded-[3px] bg-tag px-2 py-1 font-mono text-[12px]">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="inverse flex flex-col gap-3 rounded-[8px] bg-ink p-7 text-paper">
          <Eyebrow tone="accent">Propose a question</Eyebrow>
          <h2 className="text-[30px] font-extrabold">Missing a question?</h2>
          <p className="text-[16px] leading-[1.45] text-line">
            If your design system made a decision the grammar cannot express, propose the question
            and its answer options. Questions are added carefully, so every scheme stays comparable.
          </p>
          <pre className="rounded-[6px] bg-ink-raised p-4 font-mono text-[13px] whitespace-pre-wrap">{`spacing.<method> · one of: ${g.methods.map((m) => m.id).join(", ")}\n  every scope keeps the same five methods`}</pre>
        </section>
        <section className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-7">
          <Eyebrow>Or start from a scheme</Eyebrow>
          <h2 className="text-[30px] font-extrabold">Change a few answers.</h2>
          <p className="text-[16px] leading-[1.45] text-body">
            Take an existing scheme, change the answers that differ for you, and see what moves
            before you publish it.
          </p>
          <p className="flex flex-wrap items-center gap-2 font-mono text-[12px]">
            <span className="rounded-[3px] bg-tag px-2 py-1">Dense data</span>+
            <span className="rounded-[3px] bg-accent-soft px-2 py-1 text-accent-text">
              accessibility.values → Touch
            </span>
            =
            <Link
              href="/schemes/dense-data/moves/"
              className="rounded-[3px] bg-ink px-2 py-1 text-paper"
            >
              See what moves
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
