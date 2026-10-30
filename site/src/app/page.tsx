import Link from "next/link";
import { MiniSpecimen } from "@/components/specimen";
import { Chip, Command, Eyebrow } from "@/components/ui-bits";
import { answerOf, grammar, schemes } from "@/lib/schemes";

export default function Home() {
  const g = grammar();
  const all = schemes();
  const dense = all.find((s) => s.id === "dense-data")!;
  const proof = ["content.q1", "tasks.q1", "typography.q1"].map((id) => answerOf(dense, g, id));
  return (
    <div className="grid gap-20">
      <section className="grid gap-6">
        <Eyebrow>For makers, product teams and their AI</Eyebrow>
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] md:text-6xl">
          Every design system is a set of answers.
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Pick a ready-made design system scheme. Connect your AI and deploy it, or use the package
          and do it yourself. You get tokens, components, Storybook, docs and an AI layer, and every
          decision says why.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/schemes/" className="rounded-md bg-ink px-5 py-3 font-semibold text-paper">
            Pick a scheme
          </Link>
          <Link href="/take/" className="rounded-md border border-ink px-5 py-3 font-semibold">
            Connect your AI
          </Link>
        </div>
        <ol className="mt-4 grid gap-3 md:grid-cols-3" aria-label="One answer, traced">
          {proof.map(({ question, option, answer }, i) => (
            <li key={question.id} className="rounded-lg border border-line bg-white p-4">
              <Eyebrow>{i === 2 ? "So the scheme decides" : "Because"}</Eyebrow>
              <p className="mt-2 font-semibold">{question.text}</p>
              <p className="mt-1">
                <Chip tone="ink">{option.label}</Chip>
              </p>
              <p className="mt-2 text-sm text-muted">{answer.why}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6">
        <Eyebrow>How it works</Eyebrow>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["Pick a scheme", "Five schemes, each a full set of answers for one kind of product."],
            [
              "Deploy it",
              "One command or one AI call copies tokens, components, AGENTS.md and an agent skill.",
            ],
            [
              "Change what differs",
              "Every token traces back to an answer. Change the answer, and you know what moves.",
            ],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-lg border border-line p-5">
              <p className="font-mono text-sm text-accent-text">0{i + 1}</p>
              <p className="mt-2 text-xl font-extrabold">{t}</p>
              <p className="mt-1 text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6">
        <Eyebrow>Five schemes · the same components</Eyebrow>
        <h2 className="text-3xl font-extrabold">
          Same components. Different answers. Different systems.
        </h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {all.map((s) => (
            <Link
              key={s.id}
              href={`/schemes/${s.id}/`}
              className="group grid gap-3 rounded-xl border border-line bg-white p-4 hover:border-ink"
            >
              <MiniSpecimen
                scheme={s.id}
                brand={Object.keys(s.tokens.brands).length > 1 ? "birch" : undefined}
              />
              <div>
                <p className="text-xl font-extrabold group-hover:text-accent-text">{s.name}</p>
                <p className="text-sm text-muted">{s.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <Eyebrow>The grammar</Eyebrow>
        <h2 className="text-3xl font-extrabold">A finite set of questions, answered in order.</h2>
        <ol className="grid gap-3 md:grid-cols-4">
          {[
            [
              "Reasons",
              `${g.reasons.length} groups: business, people, content, tasks, human factors, outcomes, brand, voice and tone, team.`,
            ],
            [
              "Scopes",
              `${g.scopes.length} groups: typography to naming. Each answer points back to the reasons.`,
            ],
            [
              "Tokens",
              "Primitives are the options. Semantics are the decisions. Brands and modes are themes.",
            ],
            [
              "Component API",
              `${g.component_keys.length} keys. Every scheme fills every key; components read only keys.`,
            ],
          ].map(([t, d]) => (
            <li key={t} className="rounded-lg border border-line p-4">
              <p className="font-extrabold">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4">
        <Eyebrow>Take it</Eyebrow>
        <h2 className="text-3xl font-extrabold">Connect your AI, or use the package yourself.</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Command>
            {
              "claude mcp add --scope user open-ds -- uv run --directory /path/to/Open-DS open-ds-mcp"
            }
          </Command>
          <Command>{"node cli/bin/open-ds.js init dense-data --dir ./my-app"}</Command>
        </div>
      </section>
    </div>
  );
}
