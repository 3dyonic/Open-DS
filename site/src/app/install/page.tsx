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
    "The semantic and component keys as CSS variables, light and dark, the shadcn variables and a Tailwind theme",
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

// The site's primary and secondary buttons (the home page's), as links.
const PRIMARY =
  "inline-flex items-center gap-[10px] rounded-[4px] bg-ink px-5 py-[14px] text-[17px] font-semibold text-paper";
const SECONDARY =
  "inline-flex items-center rounded-[4px] border border-ink px-5 py-[14px] text-[17px] font-semibold";

function GetKeyButton() {
  return (
    <Link href="/key/" className={PRIMARY}>
      <span aria-hidden className="size-[8px] bg-accent" />
      Get a key
    </Link>
  );
}

export default function InstallPage() {
  const ids = schemes().map((s) => s.id);
  const j = (o: object) => JSON.stringify(o, null, 2);
  // The same server on your computer: the client starts `npx -y open-ds mcp` and talks to it over
  // stdio. It answers from the data in the npm package, so it needs no key and sends us nothing.
  const LOCAL = { command: "npx", args: ["-y", "open-ds", "mcp"] };
  const local: { name: string; where: string; code: string }[] = [
    {
      name: "Claude Code",
      where: "In a terminal. --scope user makes it available in every folder.",
      code: "claude mcp add --scope user open-ds -- npx -y open-ds mcp",
    },
    {
      name: "Claude desktop, Cursor, Windsurf and others",
      where:
        "Claude desktop: Settings, Developer, Edit Config (claude_desktop_config.json), then restart Claude. Cursor: ~/.cursor/mcp.json or .cursor/mcp.json. Windsurf: ~/.codeium/windsurf/mcp_config.json. Any other client: add a local (stdio) server with this command.",
      code: j({ mcpServers: { "open-ds": LOCAL } }),
    },
    {
      name: "VS Code",
      where: "In .vscode/mcp.json in your project:",
      code: j({ servers: { "open-ds": { type: "stdio", ...LOCAL } } }),
    },
  ];
  // How each client connects to the hosted server, with the key as a bearer token. The hosted
  // server needs a key (open-ds-ops); without one, people run it locally.
  const KEY = "<your key>";
  const auth = { Authorization: `Bearer ${KEY}` };
  const keyed: { name: string; code: string }[] = [
    {
      name: "Claude Code",
      code: `claude mcp add --transport http --scope user open-ds ${MCP_URL} --header "Authorization: Bearer ${KEY}"`,
    },
    { name: "Cursor", code: j({ mcpServers: { "open-ds": { url: MCP_URL, headers: auth } } }) },
    {
      name: "VS Code",
      code: j({ servers: { "open-ds": { type: "http", url: MCP_URL, headers: auth } } }),
    },
    {
      name: "Windsurf",
      code: j({ mcpServers: { "open-ds": { serverUrl: MCP_URL, headers: auth } } }),
    },
  ];
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
        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section
            aria-labelledby="beta"
            className="flex flex-col gap-4 rounded-[8px] border border-line bg-white p-6 md:p-8"
          >
            <Eyebrow>Beta · Limited invitations</Eyebrow>
            <h2 id="beta" className="text-[28px] leading-[1.15] font-extrabold md:text-[32px]">
              Get early access.
            </h2>
            <p className="text-[17px] leading-[1.5] text-body">
              The hosted MCP server: one URL, always up to date.
            </p>
            <div className="pt-1">
              <GetKeyButton />
            </div>
          </section>
          <section
            aria-labelledby="no-key"
            className="flex flex-col gap-4 rounded-[8px] border border-line bg-paper p-6 md:p-8"
          >
            <Eyebrow>No key? Start now</Eyebrow>
            <h2 id="no-key" className="text-[24px] leading-[1.2] font-extrabold">
              Run it on your computer.
            </h2>
            <p className="text-[16px] leading-[1.5] text-body">The same engine, no key needed.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a href="#local" className={SECONDARY}>
                Run it locally
              </a>
              <a href="#cli" className={SECONDARY}>
                Use the CLI
              </a>
            </div>
          </section>
        </div>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="mcp">
        <Eyebrow>Path A</Eyebrow>
        <h2 id="mcp" className="text-[32px] font-extrabold">
          Connect your AI (MCP)
        </h2>
        <ol className="flex flex-col gap-3">
          <Step n={1} title="Get a key (Beta)">
            <p className="text-[16px] text-body">
              The hosted server answers only calls with a key. If you are approved, the email has a
              one-time link that shows your key once, with the setup below filled in.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <GetKeyButton />
              <a
                href="#local"
                className="text-[15px] font-semibold text-accent-text hover:underline"
              >
                No key yet? Run it locally
              </a>
            </div>
          </Step>
          <Step n={2} title="Add the server to your AI, with your key">
            <p className="text-[16px] text-body">
              The server is at {code(MCP_URL)}. Your key goes with every call as a bearer token.
              Replace {code(KEY)} with it:
            </p>
            <div className="flex flex-col gap-4">
              {keyed.map((c) => (
                <div key={c.name} className="flex flex-col gap-2">
                  <h4 className="text-[17px] font-bold">{c.name}</h4>
                  <Command label={`${c.name} with a key`} code={c.code} />
                </div>
              ))}
            </div>
            <p className="text-[15px] text-body">
              Any other client: add the header {code("Authorization: Bearer <your key>")} to the
              server {code(MCP_URL)}. Claude desktop and claude.ai connectors cannot send a key yet,
              so in Claude desktop{" "}
              <a href="#local" className="font-semibold text-accent-text hover:underline">
                run it on your computer
              </a>
              . Keep the key private. If it leaks, ask for a fresh one.
            </p>
          </Step>
          <Step n={3} title="Ask your AI">
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

      <section
        className="flex scroll-mt-24 flex-col gap-4"
        id="local"
        aria-labelledby="local-title"
      >
        <Eyebrow>Path A, on your computer, no key</Eyebrow>
        <h2 id="local-title" className="text-[32px] font-extrabold">
          Or run the MCP server locally
        </h2>
        <p className="max-w-[880px] text-[16px] text-body">
          The same server, from the {code("open-ds")} package on npm. Your AI client starts it on
          your computer with {code("npx -y open-ds mcp")} and talks to it directly. It answers from
          the schemes inside the package, so it needs no key and sends us nothing. It needs Node.js
          22 or later, and it serves the version you have: the hosted server always has the latest.
        </p>
        <div className="flex flex-col gap-4 rounded-[8px] border border-line bg-white p-6">
          {local.map((c) => (
            <div key={c.name} className="flex flex-col gap-2">
              <h3 className="text-[17px] font-bold">{c.name}</h3>
              <p className="text-[15px] text-body">{c.where}</p>
              <Command label={`${c.name}, local`} code={c.code} />
            </div>
          ))}
        </div>
        <p className="max-w-[880px] text-[15px] text-body">
          Then ask your AI the same way as in step 3 above.
        </p>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="cli">
        <Eyebrow>Path B</Eyebrow>
        <h2 id="cli" className="text-[32px] font-extrabold">
          Run the CLI yourself
        </h2>
        <p className="max-w-[880px] text-[16px] text-body">The CLI needs Node.js 22 or later.</p>
        <ol className="flex flex-col gap-3">
          <Step n={1} title="Install the CLI">
            <Command label="install" code="npm install -g open-ds" />
            <Command label="check" code="open-ds --help" />
            <p className="text-[15px] text-body">
              Or skip installing: <code className="font-mono">npx open-ds</code> runs the latest
              version each time, which is what the commands below use. Installed? Drop the{" "}
              <code className="font-mono">npx</code>. In a project, add it as a dev dependency with{" "}
              <code className="font-mono">npm install -D open-ds</code>.
            </p>
          </Step>
          <Step n={2} title="See the schemes">
            <Command label="list" code="npx open-ds list" />
            <p className="text-[15px] text-body">Schemes: {ids.join(", ")}.</p>
          </Step>
          <Step n={3} title="Take a whole design system">
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
          <Step n={4} title="Or add a scheme to an app you have">
            <Command label="init" code="npx open-ds init dense-data" />
            <p className="text-[15px] text-body">
              Run it in your app’s folder. It lists the component packages to install with{" "}
              {code("npm install")}; then import {code("src/styles/open-ds.css")} after Tailwind.
              Add {code("--docs")} to also write the design system’s docs pages to {code("docs/")}.
            </p>
          </Step>
          <Step n={5} title="Ask why, and add more components">
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
