// How to install, for people who take a scheme: connect the hosted MCP server to your AI, or run the
// published CLI with npx. They never clone the repository; setting up from the repository is
// internal and lives in TESTING.md.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { WithRobot } from "@/components/robot";
import { Command } from "@/components/copy";
import { schemes } from "@/lib/schemes";

export const metadata: Metadata = {
  title: "How to install",
  description:
    "Connect the Open DS MCP server to your AI, or run the CLI with npx, and take a scheme as a whole design system.",
};

// The hosted MCP server: the same app as the site, at /mcp (fly.toml).
const MCP_URL = "https://open-ds.dev/mcp";

// The files open-ds init writes into a project (cli/src/cli.mjs, deploy).
const FILES: [string, string][] = [
  [
    "src/styles/open-ds.css",
    "Every token as a CSS variable, light and dark, the shadcn variables and a Tailwind theme",
  ],
  ["src/components/ui/*", "The scheme’s components, copied in. They read only component keys"],
  ["src/lib/utils.ts", "The class helper the components use"],
  ["AGENTS.md", "What an agent needs: usage rules, voice and tone, key decisions"],
  [".claude/skills/open-ds/SKILL.md", "The agent skill, with this scheme’s rules"],
  [".open-ds/scheme.json", "The full scheme: every answer with its reason"],
  [".open-ds/tokens/*.tokens.json", "The resolved DTCG tokens for each theme"],
  [".open-ds/content.json", "The voice tokens: the words for common actions"],
  [
    "docs/ (with --docs)",
    "The design system’s docs: reasons, voice, a page per scope, components, themes",
  ],
  ["open-ds.json", "What was installed, with a hash for each file"],
];

const PROMPTS = [
  "Which Open DS scheme fits an order management tool, and why?",
  "Deploy it into this project.",
  "In this scheme, what do I use for a number in a table?",
  "Why does this scheme set line height that way?",
];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-5 rounded-[8px] border border-line bg-white p-6">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[3px] bg-ink text-[18px] font-extrabold text-paper">
        {n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <h3 className="text-[22px] font-extrabold">{title}</h3>
        {children}
      </div>
    </li>
  );
}

const code = (s: string) => <code className="font-mono">{s}</code>;

export default function InstallPage() {
  const ids = schemes().map((s) => s.id);
  const mcpJson = JSON.stringify(
    { mcpServers: { "open-ds": { type: "http", url: MCP_URL } } },
    null,
    2,
  );
  return (
    <div className="flex flex-col gap-12 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <WithRobot name="scroll" priority>
          <Eyebrow>How to install</Eyebrow>
          <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
            Install Open DS. Then take a scheme.
          </h1>
          <p className="max-w-[880px] text-[19px] leading-[1.45] text-body">
            Connect your AI through MCP and let it deploy a scheme, or run the CLI yourself. Both
            use the same engine, so you get the same design system either way.
          </p>
        </WithRobot>
        <p className="max-w-[880px] rounded-[6px] border border-line bg-white p-4 text-[15px] text-body">
          The MCP server is open now, with no key. The {code("open-ds")} package goes to npm with
          the first release; until then the {code("npx open-ds")} commands below will not run.
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="mcp">
        <Eyebrow>Path A</Eyebrow>
        <h2 id="mcp" className="text-[32px] font-extrabold">
          Connect your AI (MCP)
        </h2>
        <ol className="flex flex-col gap-3">
          <Step n={1} title="Add the server">
            <p className="text-[16px] text-body">In Claude Code:</p>
            <Command
              label="add the MCP server"
              code={`claude mcp add --transport http --scope user open-ds ${MCP_URL}`}
            />
            <p className="text-[15px] text-body">
              {code("--scope user")} makes the server available in every folder. Check it with{" "}
              {code("claude mcp list")}.
            </p>
            <p className="text-[16px] text-body">
              Other MCP clients take the same URL in their config:
            </p>
            <Command label="MCP config" code={mcpJson} />
          </Step>
          <Step n={2} title="Ask your AI">
            <p className="text-[16px] text-body">
              Open your AI in an empty project folder and ask, for example:
            </p>
            <ul className="flex flex-col gap-2">
              {PROMPTS.map((p) => (
                <li key={p} className="rounded-[4px] bg-paper px-3 py-2 font-mono text-[14px]">
                  “{p}”
                </li>
              ))}
            </ul>
            <p className="text-[15px] text-body">
              The server only reads: it answers with the schemes’ answers and reasons, and when you
              ask to set one up, it gives your AI the exact {code("npx open-ds")} command and the
              files it will write. Your AI runs the command in your project.
            </p>
          </Step>
        </ol>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="cli">
        <Eyebrow>Path B</Eyebrow>
        <h2 id="cli" className="text-[32px] font-extrabold">
          Run the CLI yourself
        </h2>
        <p className="max-w-[880px] text-[16px] text-body">The CLI needs Node.js 22 or later.</p>
        <ol className="flex flex-col gap-3">
          <Step n={1} title="See the schemes">
            <Command label="list" code="npx open-ds list" />
            <p className="text-[15px] text-body">Schemes: {ids.join(", ")}.</p>
          </Step>
          <Step n={2} title="Take a whole design system">
            <Command
              label="create"
              code="npx open-ds create my-design-system --scheme dense-data"
            />
            <Command
              label="run it"
              code={"cd my-design-system\nnpm install\nnpm run storybook\nnpm run docs"}
            />
            <p className="text-[15px] text-body">
              Its own components, tokens, Storybook and docs, built from the scheme’s answers. For
              Multi-brand, add {code("--brand aster")}, {code("birch")} or {code("coral")}.
            </p>
          </Step>
          <Step n={3} title="Or add a scheme to an app you have">
            <Command label="init" code="npx open-ds init dense-data" />
            <p className="text-[15px] text-body">
              Run it in your app’s folder. It lists the component packages to install with{" "}
              {code("npm install")}; then import {code("src/styles/open-ds.css")} after Tailwind.
              Add {code("--docs")} to also write the design system’s docs pages to {code("docs/")}.
            </p>
          </Step>
          <Step n={4} title="Ask why, and add more components">
            <Command label="why" code="npx open-ds why dense-data typography.definition" />
            <Command label="when" code={'npx open-ds when dense-data "a number in a table"'} />
            <Command label="add" code="npx open-ds add tooltip" />
          </Step>
        </ol>
      </section>

      <section
        className="inverse flex flex-col gap-4 rounded-[8px] bg-ink p-8 text-paper"
        aria-labelledby="get"
      >
        <Eyebrow tone="accent">What init writes</Eyebrow>
        <h2 id="get" className="text-[32px] font-extrabold">
          A whole design system in your repo.
        </h2>
        <dl className="grid gap-x-8 gap-y-3 md:grid-cols-[auto_1fr]">
          {FILES.map(([f, d]) => (
            <div key={f} className="contents">
              <dt className="font-mono text-[14px]">{f}</dt>
              <dd className="text-[15px] text-line">{d}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[15px] text-line">
          Not sure which scheme?{" "}
          <Link href="/schemes/" className="underline">
            Pick a scheme
          </Link>{" "}
          or{" "}
          <Link href="/compare/" className="underline">
            compare two
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
