// How to install: connect the MCP server to your AI, or run the CLI yourself. Every command here
// is the one TESTING.md uses; nothing is published yet, so both run from a local checkout.
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/chrome";
import { Command } from "@/components/copy";
import { schemes } from "@/lib/schemes";

export const metadata: Metadata = {
  title: "How to install",
  description:
    "Connect the Open DS MCP server to your AI, or use the CLI yourself, and deploy a scheme into your project.",
};

// The packages open-ds init asks for (cli/src/cli.mjs).
const PACKAGES = "radix-ui lucide-react class-variance-authority clsx tailwind-merge";

// The files open-ds init writes into a project (cli/src/cli.mjs, deploy).
const FILES: [string, string][] = [
  [
    "src/styles/open-ds.css",
    "Every token as a CSS variable, light and dark, the shadcn variables and a Tailwind theme",
  ],
  ["src/components/ui/*", "The 14 components, copied in. They read only component keys"],
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

export default function InstallPage() {
  const ids = schemes().map((s) => s.id);
  const mcpJson = JSON.stringify(
    {
      mcpServers: {
        "open-ds": {
          command: "uv",
          args: ["run", "--directory", "/path/to/Open-DS", "open-ds-mcp"],
        },
      },
    },
    null,
    2,
  );
  return (
    <div className="flex flex-col gap-12 px-5 pb-20 lg:px-20">
      <header className="flex flex-col gap-4">
        <Eyebrow>How to install</Eyebrow>
        <h1 className="text-[44px] leading-[1.05] font-extrabold md:text-[56px]">
          Install Open DS. Then take a scheme.
        </h1>
        <p className="max-w-[880px] text-[19px] leading-[1.45] text-[#3e3a31]">
          Connect your AI through MCP and let it deploy a scheme, or run the CLI yourself. Both use
          the same engine, so you get the same design system either way.
        </p>
        <p className="max-w-[880px] rounded-[6px] border border-line bg-white p-4 text-[15px] text-[#3e3a31]">
          Open DS is not published yet. For now both paths run from a copy of the repository on your
          machine. Access keys for the MCP server are coming; you will request one here.
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="start">
        <h2 id="start" className="text-[32px] font-extrabold">
          Before you start
        </h2>
        <ol className="flex flex-col gap-3">
          <Step n={1} title="Have the tools">
            <p className="text-[16px] text-[#3e3a31]">
              Node.js 22 or later, pnpm 10 (corepack enable gives it to you), uv for Python, and an
              AI client with MCP, such as Claude Code.
            </p>
          </Step>
          <Step n={2} title="Get Open DS">
            <Command label="clone" code="git clone https://github.com/3dyonic/Open-DS.git" />
            <Command label="branch" code="cd Open-DS && git checkout RC1" />
            <Command label="install" code="pnpm install && uv sync --all-packages --group dev" />
            <Command label="build the tokens" code="pnpm --dir tokens build" />
          </Step>
        </ol>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="mcp">
        <Eyebrow>Path A</Eyebrow>
        <h2 id="mcp" className="text-[32px] font-extrabold">
          Connect your AI (MCP)
        </h2>
        <ol className="flex flex-col gap-3">
          <Step n={1} title="Add the server">
            <p className="text-[16px] text-[#3e3a31]">In Claude Code, from the Open-DS folder:</p>
            <Command
              label="add the MCP server"
              code={
                'claude mcp add --scope user open-ds -- uv run --directory "$(pwd)" open-ds-mcp'
              }
            />
            <p className="text-[15px] text-[#3e3a31]">
              <code className="font-mono">--scope user</code> makes the server available in every
              folder. Check it with <code className="font-mono">claude mcp list</code>.
            </p>
            <p className="text-[16px] text-[#3e3a31]">
              Other MCP clients take the same server in their config file. Replace the path with
              your Open-DS folder:
            </p>
            <Command label="MCP config" code={mcpJson} />
          </Step>
          <Step n={2} title="Ask your AI">
            <p className="text-[16px] text-[#3e3a31]">
              Open your AI in an empty project folder and ask, for example:
            </p>
            <ul className="flex flex-col gap-2">
              {PROMPTS.map((p) => (
                <li key={p} className="rounded-[4px] bg-paper px-3 py-2 font-mono text-[14px]">
                  “{p}”
                </li>
              ))}
            </ul>
            <p className="text-[15px] text-[#3e3a31]">
              The server’s tools: list_schemes, get_scheme, get_answer, why, when_to_use and deploy.
              Deploy runs the same CLI as Path B.
            </p>
          </Step>
        </ol>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="cli">
        <Eyebrow>Path B</Eyebrow>
        <h2 id="cli" className="text-[32px] font-extrabold">
          Use the CLI yourself
        </h2>
        <ol className="flex flex-col gap-3">
          <Step n={1} title="See the schemes">
            <Command label="list" code="node cli/bin/open-ds.js list" />
            <p className="text-[15px] text-[#3e3a31]">Schemes: {ids.join(", ")}.</p>
          </Step>
          <Step n={2} title="Deploy one into your project">
            <Command
              label="init"
              code="node cli/bin/open-ds.js init dense-data --dir /path/to/your-app"
            />
            <p className="text-[15px] text-[#3e3a31]">
              For Multi-brand, add <code className="font-mono">--brand aster</code>,{" "}
              <code className="font-mono">birch</code> or <code className="font-mono">coral</code>.
              Add <code className="font-mono">--yes</code> to run it again over the same folder. Add{" "}
              <code className="font-mono">--docs</code> to also write the design system’s docs pages
              (Docusaurus) to <code className="font-mono">docs/</code>.
            </p>
          </Step>
          <Step n={3} title="Install the component packages and import the styles">
            <Command label="packages" code={`npm install ${PACKAGES}`} />
            <p className="text-[15px] text-[#3e3a31]">
              Then import <code className="font-mono">src/styles/open-ds.css</code> after Tailwind.
            </p>
          </Step>
          <Step n={4} title="Ask why, and add more components">
            <Command
              label="why"
              code="node cli/bin/open-ds.js why dense-data typography.definition"
            />
            <Command
              label="when"
              code={'node cli/bin/open-ds.js when dense-data "a number in a table"'}
            />
            <Command
              label="add"
              code="node cli/bin/open-ds.js add tooltip --dir /path/to/your-app"
            />
          </Step>
        </ol>
      </section>

      <section
        className="flex flex-col gap-4 rounded-[8px] bg-ink p-8 text-paper"
        aria-labelledby="get"
      >
        <Eyebrow tone="accent">What you get</Eyebrow>
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
