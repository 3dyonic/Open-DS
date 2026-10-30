import type { Metadata } from "next";
import { ThemeSwitch } from "@/components/theme-switch";
import { Chip, Command, Eyebrow } from "@/components/ui-bits";
import {
  answerOf,
  grammar,
  scheme,
  schemeIds,
  tokenRows,
  type Group,
  type Scheme,
} from "@/lib/schemes";

export function generateStaticParams() {
  return schemeIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const s = scheme(id);
  return { title: s.name, description: s.summary };
}

function Decisions({ s, groups }: { s: Scheme; groups: Group[] }) {
  const g = grammar();
  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <details
          key={group.id}
          className="rounded-lg border border-line bg-white p-4"
          open={group.kind === "scope" && group.id === "typography"}
        >
          <summary className="cursor-pointer text-lg font-extrabold">
            {group.title} <span className="font-normal text-muted">· {group.description}</span>
          </summary>
          <ul className="mt-4 grid gap-4">
            {group.questions.map((q) => {
              const { option, answer } = answerOf(s, g, q.id);
              return (
                <li key={q.id} className="grid gap-2 border-t border-line pt-4">
                  <p className="font-semibold">{q.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((o) => (
                      <Chip key={o.id} tone={o.id === option.id ? "ink" : "plain"}>
                        {o.label}
                      </Chip>
                    ))}
                  </div>
                  <p className="text-sm">{answer.why}</p>
                  {answer.because.length > 0 && (
                    <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
                      <span className="font-mono text-xs">because</span>
                      {answer.because.map((b) => {
                        const r = answerOf(s, g, b);
                        return (
                          <Chip key={b} tone="accent">
                            {r.question.text} {r.option.label}
                          </Chip>
                        );
                      })}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </div>
  );
}

export default async function SchemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = scheme(id);
  const g = grammar();
  const sit = Object.fromEntries(g.situations.map((x) => [x.id, x]));
  const brands = Object.entries(s.tokens.brands).map(([bid, b]) => ({ id: bid, label: b.label }));
  const semantic = s.tokens.semantic as { light: unknown; base: unknown };
  return (
    <article className="grid gap-16">
      <header className="grid gap-4">
        <Eyebrow>Scheme · {s.status}</Eyebrow>
        <h1 className="text-5xl font-extrabold">{s.name}</h1>
        <p className="max-w-3xl text-lg">{s.summary}</p>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="font-semibold">Use when:</span> {s.ai.use_when}
          </p>
          <p className="text-muted">
            <span className="font-semibold">Avoid when:</span> {s.ai.avoid_when}
          </p>
        </div>
      </header>

      <section className="grid gap-4" aria-labelledby="live">
        <Eyebrow>Live components</Eyebrow>
        <h2 id="live" className="text-3xl font-extrabold">
          {brands.length > 1 ? `${brands.length} brands, light and dark` : "Light and dark"}
        </h2>
        <ThemeSwitch scheme={s.id} brands={brands} />
      </section>

      <section className="grid gap-4" aria-labelledby="before">
        <Eyebrow>Before any token</Eyebrow>
        <h2 id="before" className="text-3xl font-extrabold">
          The work it serves
        </h2>
        <ul className="grid gap-3 md:grid-cols-2">
          {s.scenarios.map((x) => (
            <li key={x} className="rounded-lg border border-line bg-white p-4">
              {x}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4" aria-labelledby="voice">
        <Eyebrow>Voice and tone</Eyebrow>
        <h2 id="voice" className="text-3xl font-extrabold">
          {s.voice.summary}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid content-start gap-3">
            <ul className="grid gap-2">
              {s.voice.principles.map((p) => (
                <li key={p}>— {p}</li>
              ))}
            </ul>
            <dl className="grid gap-2 text-sm">
              {Object.entries(s.voice.tone).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-2">
                  <dt className="font-mono text-xs uppercase text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            {s.voice.brands && (
              <p className="text-sm">
                {Object.entries(s.voice.brands)
                  .map(([b, t]) => `${b[0].toUpperCase() + b.slice(1)}: ${t}`)
                  .join(" · ")}
              </p>
            )}
          </div>
          <ul className="grid content-start gap-2">
            {s.voice.examples.map((e) => (
              <li key={e.context} className="rounded-lg border border-line bg-white p-3">
                <span className="font-mono text-xs uppercase text-muted">{e.context}</span>
                <p className="mt-1 text-lg">“{e.text}”</p>
              </li>
            ))}
            <li className="text-sm text-muted">
              Use: {s.voice.words.use.join(", ")}. Avoid: {s.voice.words.avoid.join(", ")}.
            </li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4" aria-labelledby="reasons">
        <Eyebrow>1 · Reasons</Eyebrow>
        <h2 id="reasons" className="text-3xl font-extrabold">
          Why this system exists
        </h2>
        <Decisions s={s} groups={g.reasons} />
      </section>

      <section className="grid gap-4" aria-labelledby="scopes">
        <Eyebrow>2 · Scopes</Eyebrow>
        <h2 id="scopes" className="text-3xl font-extrabold">
          The design decisions, and what pulled them
        </h2>
        <Decisions s={s} groups={g.scopes} />
      </section>

      <section className="grid gap-4" aria-labelledby="usage">
        <Eyebrow>3 · When to use</Eyebrow>
        <h2 id="usage" className="text-3xl font-extrabold">
          What to use, what not to use, and why
        </h2>
        <div className="overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-xs uppercase text-muted">
              <tr>
                <th className="p-3">Situation</th>
                <th className="p-3">Use</th>
                <th className="p-3">Not</th>
                <th className="p-3">Why</th>
              </tr>
            </thead>
            <tbody>
              {s.usage.map((u) => (
                <tr key={u.situation} className="border-t border-line align-top">
                  <td className="p-3 font-semibold">{sit[u.situation].title}</td>
                  <td className="p-3 font-mono text-xs">{u.use}</td>
                  <td className="p-3 font-mono text-xs text-muted">{u.not}</td>
                  <td className="p-3">{u.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4" aria-labelledby="tokens">
        <Eyebrow>4 · Tokens, for reference</Eyebrow>
        <h2 id="tokens" className="text-3xl font-extrabold">
          The decisions as tokens
        </h2>
        <details className="rounded-lg border border-line bg-white p-4">
          <summary className="cursor-pointer font-semibold">
            Semantic decisions (light mode and layout)
          </summary>
          <table className="mt-3 w-full text-left font-mono text-xs">
            <tbody>
              {[...tokenRows(semantic.base), ...tokenRows(semantic.light)].map((r) => (
                <tr key={r.name} className="border-t border-line align-top">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2 text-accent-text">{r.value}</td>
                  <td className="p-2 font-sans text-muted">{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <section className="grid gap-4" aria-labelledby="take">
        <Eyebrow>Take it</Eyebrow>
        <h2 id="take" className="text-3xl font-extrabold">
          Deploy {s.name}
        </h2>
        <Command>{`node cli/bin/open-ds.js init ${s.id} --dir ./my-app${brands.length > 1 ? ` --brand ${brands[0].id}` : ""}`}</Command>
        <p className="text-muted">
          Or ask your AI: “Deploy the {s.name} scheme into this project.” The MCP tool{" "}
          <code>deploy</code> runs the same command.
        </p>
      </section>
    </article>
  );
}
