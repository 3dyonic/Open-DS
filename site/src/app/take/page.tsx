// Take a scheme, built from the Figma frame S09 Take (129:900).
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { answerOf, grammar, scheme } from "@/lib/schemes";

export const metadata: Metadata = {
  title: "Take a scheme",
  description:
    "Connect your AI through MCP, or run the CLI yourself. Either way you get the whole design system with its reasons.",
};

const GET: [string, string, string[]][] = [
  [
    "The answer map",
    "Every question, its answer and its because. The source the rest is built from.",
    ["scheme.json", "AGENTS.md"],
  ],
  [
    "Tokens",
    "Generated from the answers. Primitive, semantic and component API tiers, light and dark.",
    ["Style Dictionary", "DTCG JSON", "CSS variables", "Tailwind theme", "content.json"],
  ],
  [
    "Components",
    "Built on the component API keys. Every variant exists because an answer made it.",
    ["shadcn registry", "React", "Radix"],
  ],
  [
    "Storybook",
    "Every component in every scheme, brand and mode.",
    ["stories", "scheme switch", "mode switch"],
  ],
  [
    "Docs",
    "The design system’s own docs, generated from its answers: reasons, voice, a page per scope, components, themes.",
    ["Docusaurus", "init --docs", "llms.txt"],
  ],
  [
    "Checks",
    "The harness checks every layer against the instructions and the specs.",
    ["harness", "JSON Schema", "token resolve"],
  ],
];

// The tools the MCP server ships (mcp/src/open_ds_mcp/server.py).
const TOOLS: [string, string][] = [
  ["list_schemes()", "the schemes and what each is for"],
  ["get_scheme(id, part)", "one scheme, or one part of it"],
  ["get_answer(id, question)", "this scheme’s answer and its because"],
  ["why(id, question | key)", "trace a value back to its question and reason"],
  ["when_to_use(id, situation)", "what to use, what not, and why"],
  ["deploy(id, project_dir)", "runs the CLI to deploy the scheme"],
];

export default function TakePage() {
  const id = "dense-data";
  const s = scheme(id);
  const g = grammar();
  const chain = (q: string) => {
    const a = answerOf(s, g, q);
    const because = a.answer.because
      .map((b) => `${b} ${answerOf(s, g, b).option.label.toLowerCase()}`)
      .join(" and ");
    return `${q} → ${a.option.label}, because ${because}. ${a.answer.why}`;
  };
  const rule = s.usage.find((u) => u.situation === "confirm-words")!;
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
          <span className="text-accent-text">Take it</span>
        </nav>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          Take a scheme. Deploy it your way.
        </h1>
        <p className="max-w-[880px] text-[19px] leading-[1.45] text-[#3e3a31]">
          Pick a ready-made scheme. Connect your AI and let it deploy the scheme, or use the package
          and do it yourself. Either way you get a whole working design system, and every piece
          carries the product reason behind it.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          [
            "Connect your AI",
            "Connect your AI through MCP. It runs the same CLI to deploy the scheme, and keeps every answer and reason, so it builds the way the system would.",
            `"Deploy the ${s.name} scheme\n  in this project."`,
          ],
          [
            "Use the package yourself",
            "The CLI, like shadcn/ui. One command copies the scheme’s components and tokens into your repo. You own the code. It is the same engine the MCP uses.",
            `open-ds init ${id}`,
          ],
        ].map(([t, p, code]) => (
          <section
            key={t}
            className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-6"
          >
            <h2 className="text-[26px] font-extrabold">{t}</h2>
            <p className="text-[16px] leading-[1.45] text-[#3e3a31]">{p}</p>
            <pre className="rounded-[6px] bg-ink p-4 font-mono text-[14px] whitespace-pre-wrap text-paper">
              {code}
            </pre>
          </section>
        ))}
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="get">
        <Eyebrow>
          <span id="get">What you get · a fully fledged design system</span>
        </Eyebrow>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GET.map(([t, p, chips]) => (
            <li
              key={t}
              className="flex flex-col gap-3 rounded-[8px] border border-line bg-white p-6"
            >
              <h3 className="flex items-center gap-2 text-[22px] font-extrabold">
                <span aria-hidden className="size-[10px] bg-accent" />
                {t}
              </h3>
              <p className="text-[15px] leading-[1.45] text-[#3e3a31]">{p}</p>
              <ul className="flex flex-wrap gap-[6px]">
                {chips.map((c) => (
                  <li key={c} className="rounded-[3px] bg-tag px-2 py-1 font-mono text-[12px]">
                    {c}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6 rounded-[8px] bg-ink p-10 text-paper">
        <Eyebrow tone="accent">The AI layer · optimized for agents</Eyebrow>
        <h2 className="text-[36px] font-extrabold md:text-[44px]">
          Your agent gets the reasons, not just the values.
        </h2>
        <p className="max-w-[1100px] text-[18px] leading-[1.45] text-line">
          Tokens tell an agent what to use. A scheme tells it why, so it can build a new screen the
          way the system would, and explain itself. Every scheme ships an MCP server and agent
          files.
        </p>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[6px] border border-muted p-5">
            <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.48px] text-line">
              MCP tools
            </p>
            <dl className="grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-x-10">
              {TOOLS.map(([t, d]) => (
                <div key={t} className="contents">
                  <dt className="font-mono text-[15px]">{t}</dt>
                  <dd className="text-[14px] text-line">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-3 rounded-[6px] bg-[#2c2821] p-5">
            <p className="font-mono text-[12px] uppercase tracking-[0.48px] text-line">
              An agent, asking why
            </p>
            <p className="rounded-[4px] bg-[#3e3a31] p-3 text-[14px]">
              <span className="block font-mono text-[11px] text-line">Agent</span>
              Why does {s.name} have two densities?
            </p>
            <p className="rounded-[4px] bg-paper p-3 font-mono text-[13px] text-ink">
              <span className="block text-[11px] text-accent-text">why()</span>
              {chain("spacing.count")}
            </p>
            <p className="rounded-[4px] bg-[#3e3a31] p-3 text-[14px]">
              <span className="block font-mono text-[11px] text-line">Agent</span>
              Building a delete dialog. What does it say?
            </p>
            <p className="rounded-[4px] bg-paper p-3 font-mono text-[13px] text-ink">
              <span className="block text-[11px] text-accent-text">when_to_use()</span>
              {rule.use}. Example: “{rule.example}”
            </p>
          </div>
        </div>
        <p className="flex flex-wrap items-center gap-2 font-mono text-[12px] text-line">
          Also ships:
          {["AGENTS.md", "llms.txt", "Claude skill"].map((x) => (
            <span key={x} className="rounded-[3px] bg-[#2c2821] px-2 py-1 text-paper">
              {x}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
