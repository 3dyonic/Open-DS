// The Open DS MCP server. One engine with the CLI and the site: it imports the same modules.
//
//   open-ds mcp                          stdio, for a local agent
//   open-ds mcp --http [--port 8787]     Streamable HTTP at /mcp, the shape of the hosted server
//
// Every tool is read-only. Taking, initialising and adding return the exact `npx open-ds …` command
// and the files it writes; the agent runs it. The five skills are served as prompts.
// No authentication yet: the hosted server will add a key (OD-145).

import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer as createHttpServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import { deploy } from "./cli.mjs";
import {
  builtComponents,
  componentsFor,
  packagesFor,
  withImports,
} from "./components.mjs";
import { createProject } from "./create.mjs";
import {
  assetRoots,
  focusedSkills,
  grammar,
  keyInfo,
  loadScheme,
  questions,
  schemeIds,
  when,
  why,
} from "./schemes.mjs";

const VERSION = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;

const INSTRUCTIONS = `Open DS: design systems as answered questions. Every scheme answers the same questions and gives the reason for each answer; tokens, components, usage rules and voice follow from them.
Start with list_schemes and pick the scheme whose use_when fits the product. plan_create (a new design system project) and plan_init (an existing app) return the exact npx command and the files it writes; run it yourself. While building UI, call when_to_use before you choose a component or token, and why to explain a decision. The prompts open-ds-choose, open-ds-build, open-ds-write, open-ds-change and open-ds-review hold the step-by-step skills.
The questions and answers are a starting point, not a standard.`;

const json = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});

const frontmatter = (text) => {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  const get = (k) => m?.[1].match(new RegExp(`^${k}: (.*)$`, "m"))?.[1] ?? "";
  return {
    name: get("name"),
    description: get("description"),
    body: m ? text.slice(m[0].length) : text,
  };
};

// A folder or component name that is safe to put in a shell command: letters, digits, dot, dash,
// underscore and slash, not starting with a dash. Anything else is refused, never quoted.
const SAFE = /^(?!-)[A-Za-z0-9._/-]+$/;
function safeName(value, what) {
  if (!SAFE.test(value))
    throw new Error(
      `${what} "${value}" is not allowed. Use letters, digits, dot, dash, underscore and slash only.`,
    );
  return value;
}

/** The files a CLI command would write, found by running it in a throwaway folder on the server. */
function filesOf(run) {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-plan-"));
  try {
    return run(join(dir, "project"));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Builds the server with every tool and prompt. */
export function createMcpServer({ roots = assetRoots() } = {}) {
  const g = grammar(roots);
  const ids = schemeIds(roots);
  const qs = questions(g);
  const scheme = (id) => {
    if (!ids.includes(id))
      throw new Error(`Unknown scheme "${id}". Schemes: ${ids.join(", ")}.`);
    return loadScheme(id, roots);
  };
  const label = (s, q) =>
    qs[q].options.find(
      (o) => o.id === s.answers.find((a) => a.question === q)?.option,
    )?.label;
  const SchemeId = z.string().describe(`Scheme id: ${ids.join(", ")}.`);
  const server = new McpServer(
    { name: "open-ds", version: VERSION },
    { instructions: INSTRUCTIONS },
  );

  server.registerTool(
    "list_schemes",
    {
      title: "List the schemes",
      description:
        "Every Open DS scheme with what it is for: id, name, summary, use_when, avoid_when, example products, brands and version. Read use_when and avoid_when to pick one.",
      annotations: { readOnlyHint: true },
    },
    async () =>
      json(
        ids.map((id) => {
          const s = loadScheme(id, roots);
          return {
            id: s.id,
            name: s.name,
            version: s.version,
            summary: s.summary,
            use_when: s.ai.use_when,
            avoid_when: s.ai.avoid_when,
            example_products: s.ai.example_products,
            brands: Object.keys(s.tokens.brands),
          };
        }),
      ),
  );

  server.registerTool(
    "get_scheme",
    {
      title: "Read a scheme",
      description:
        "One scheme, or one part of it. summary: what it is for, scenarios, themes, voice summary. answers: every question with its answer, why and because. usage: the rule for every situation. voice: summary, principles and words. inventory: the components it carries and why. tokens: the DTCG tokens. all: the whole file.",
      inputSchema: {
        scheme_id: SchemeId,
        part: z
          .enum([
            "summary",
            "answers",
            "usage",
            "voice",
            "inventory",
            "tokens",
            "all",
          ])
          .default("summary")
          .describe(
            "Which part to return. summary is small; tokens and all are large (all is the whole scheme file).",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, part }) => {
      const s = scheme(scheme_id);
      if (part === "all") return json(s);
      if (part === "summary")
        return json({
          id: s.id,
          name: s.name,
          version: s.version,
          summary: s.summary,
          ai: s.ai,
          scenarios: s.scenarios,
          themes: s.themes,
          voice: s.voice.summary,
        });
      return json({ id: s.id, version: s.version, [part]: s[part] });
    },
  );

  server.registerTool(
    "get_answer",
    {
      title: "One answer",
      description:
        "How a scheme answers one question: the question, every option, the chosen option, the reason (why) and the earlier answers it follows from (because).",
      inputSchema: {
        scheme_id: SchemeId,
        question_id: z
          .string()
          .describe(
            "A question id, for example typography.definition or people.q1.",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, question_id }) => {
      const s = scheme(scheme_id);
      const q = qs[question_id];
      if (!q)
        throw new Error(
          `Unknown question "${question_id}". Ids look like typography.definition or people.q1.`,
        );
      const a = s.answers.find((x) => x.question === question_id);
      return json({
        question: question_id,
        text: q.text,
        options: q.options.map((o) => ({
          id: o.id,
          label: o.label,
          description: o.description,
          chosen: o.id === a.option,
        })),
        answer: label(s, question_id),
        why: a.why,
        because: a.because.map((b) => ({
          question: b,
          text: qs[b]?.text,
          answer: qs[b] ? label(s, b) : undefined,
        })),
      });
    },
  );

  server.registerTool(
    "why",
    {
      title: "Why",
      description:
        "Explain a decision with its chain of reasons. A question id gives the answer, its why and the because chain back to the reasons. A component key (button/primary/background) gives the semantic it reads and its value in every theme.",
      inputSchema: {
        scheme_id: SchemeId,
        target: z
          .string()
          .describe(
            "A question id (typography.definition) or a component key (button/primary/background).",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, target }) => {
      const s = scheme(scheme_id);
      const out = target.includes("/")
        ? keyInfo(scheme_id, target, roots, g)
        : why(s, target, g);
      if (!out)
        throw new Error(
          `Nothing called "${target}" in ${s.name}. Give a question id (typography.definition) or a full component key (button/primary/background).`,
        );
      return json(out);
    },
  );

  server.registerTool(
    "when_to_use",
    {
      title: "When to use",
      description:
        "What to use, what not to use, and why, for a situation. Call it before you choose a component, variant or token. Takes a situation id (number-in-table, destructive-action) or plain words.",
      inputSchema: {
        scheme_id: SchemeId,
        situation: z
          .string()
          .describe(
            "A situation id or plain words, for example 'a number in a table'.",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, situation }) => {
      const out = when(scheme(scheme_id), situation, g);
      if (!out)
        throw new Error(
          `No situation matches "${situation}". Situations: ${g.situations.map((x) => x.id).join(", ")}.`,
        );
      return json({
        match: out.situation === situation ? "exact" : "best guess",
        ...(out.situation !== situation && {
          note: `Matched "${situation}" to the situation "${out.situation}". If that is not what you meant, call again with one of: ${g.situations.map((x) => x.id).join(", ")}.`,
        }),
        ...out,
      });
    },
  );

  server.registerTool(
    "compare_schemes",
    {
      title: "Compare two schemes",
      description:
        "The same questions, side by side: which answers two schemes share and which differ, each with its reason.",
      inputSchema: {
        a: SchemeId,
        b: SchemeId,
        only_differences: z
          .boolean()
          .default(true)
          .describe(
            "true returns only the questions the two schemes answer differently; false returns every question.",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ a, b, only_differences }) => {
      const sa = scheme(a);
      const sb = scheme(b);
      const rows = Object.keys(qs).map((q) => {
        const x = sa.answers.find((v) => v.question === q);
        const y = sb.answers.find((v) => v.question === q);
        return {
          question: q,
          text: qs[q].text,
          same: x?.option === y?.option,
          a: { answer: label(sa, q), why: x?.why },
          b: { answer: label(sb, q), why: y?.why },
        };
      });
      return json({
        a: { id: sa.id, name: sa.name },
        b: { id: sb.id, name: sb.name },
        same: rows.filter((r) => r.same).length,
        different: rows.filter((r) => !r.same).length,
        answers: only_differences ? rows.filter((r) => !r.same) : rows,
      });
    },
  );

  server.registerTool(
    "get_inventory",
    {
      title: "Inventory",
      description:
        "The components a scheme carries, each with its family and the reason it is in, plus the components it leaves out and why. Use only these components.",
      inputSchema: { scheme_id: SchemeId },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id }) => {
      const s = scheme(scheme_id);
      const family = Object.fromEntries(
        g.catalogue.items.map((i) => [i.id, i.family]),
      );
      return json({
        scheme: s.id,
        count: s.inventory.in.length,
        in: s.inventory.in.map((i) => ({ ...i, family: family[i.id] })),
        out: s.inventory.out,
        installable: componentsFor(s, roots),
      });
    },
  );

  server.registerTool(
    "what_moves",
    {
      title: "What moves",
      description:
        "Before changing an answer: the answers that follow from it (directly or through others) and the token groups its scope owns, so you see what a change would move.",
      inputSchema: {
        scheme_id: SchemeId,
        question_id: z
          .string()
          .describe("The question id whose answer would change."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, question_id }) => {
      const s = scheme(scheme_id);
      if (!qs[question_id])
        throw new Error(`Unknown question "${question_id}".`);
      const follows = new Set([question_id]);
      for (let grew = true; grew; ) {
        grew = false;
        for (const a of s.answers)
          if (
            !follows.has(a.question) &&
            a.because.some((b) => follows.has(b))
          ) {
            follows.add(a.question);
            grew = true;
          }
      }
      follows.delete(question_id);
      const scope = g.scopes.find((x) =>
        x.questions.some((q) => q.id === question_id),
      );
      return json({
        question: question_id,
        answer: label(s, question_id),
        follows: [...follows].map((q) => ({
          question: q,
          text: qs[q].text,
          answer: label(s, q),
        })),
        tokens: scope?.owns ?? [],
        lands_in: scope?.lands_in ?? [],
      });
    },
  );

  server.registerTool(
    "get_key",
    {
      title: "Component key",
      description:
        "A component key (button/primary/background): what it is for, the semantic token it reads, and its resolved value in every theme of the scheme.",
      inputSchema: {
        scheme_id: SchemeId,
        key: z
          .string()
          .describe("A component key, for example button/primary/background."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, key }) => {
      scheme(scheme_id);
      const out = keyInfo(scheme_id, key, roots, g);
      if (!out) throw new Error(`Unknown component key "${key}".`);
      return json(out);
    },
  );

  server.registerTool(
    "plan_create",
    {
      title: "Plan: create a design system project",
      description:
        "The exact command that writes a full design system project for a scheme (Style Dictionary tokens, components, Storybook, Docusaurus docs, agent files and CI), and the files it writes. Nothing is written to your disk: run the command yourself.",
      inputSchema: {
        scheme_id: SchemeId,
        dir: z.string().default("my-ds").describe("The folder to create."),
        brand: z
          .string()
          .optional()
          .describe("The default brand, for a multi-brand scheme."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, dir, brand }) => {
      scheme(scheme_id);
      safeName(dir, "Folder");
      const record = filesOf((d) =>
        createProject(scheme_id, d, { brand, roots }),
      );
      return json({
        command: `npx open-ds create ${dir} --scheme ${scheme_id}${brand ? ` --brand ${brand}` : ""}`,
        then: [`cd ${dir}`, "npm install", "npm run storybook", "npm run docs"],
        components: record.components,
        files: [...record.files, "open-ds.json"].sort(),
      });
    },
  );

  server.registerTool(
    "plan_init",
    {
      title: "Plan: add a scheme to an app",
      description:
        "The exact command that copies a scheme into an existing app (tokens, components, AGENTS.md, skills), the files it writes and the packages to install. Nothing is written to your disk: run the command yourself.",
      inputSchema: {
        scheme_id: SchemeId,
        brand: z
          .string()
          .optional()
          .describe("Brand id, for a multi-brand scheme."),
        docs: z
          .boolean()
          .default(false)
          .describe("Also write the design system's docs pages."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, brand, docs }) => {
      scheme(scheme_id);
      const record = filesOf((d) =>
        deploy(scheme_id, d, { brand, docs, roots }),
      );
      return json({
        command: `npx open-ds init ${scheme_id} --dir .${brand ? ` --brand ${brand}` : ""}${docs ? " --docs" : ""}`,
        components: record.components,
        packages: record.dependencies,
        files: [...Object.keys(record.files ?? {}), "open-ds.json"].sort(),
        record,
      });
    },
  );

  server.registerTool(
    "plan_add",
    {
      title: "Plan: add a component",
      description:
        "The exact command that adds one component to a project that already has a scheme, with the components and packages it brings along. Nothing is written to your disk: run the command yourself.",
      inputSchema: {
        component: z
          .string()
          .describe("A component id, for example dialog or data-table."),
        scheme_id: SchemeId.optional().describe(
          "The project's scheme. When given, the result says whether the component is in its inventory.",
        ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ component, scheme_id }) => {
      safeName(component, "Component");
      const built = builtComponents(roots);
      if (!built.includes(component))
        throw new Error(
          `No component called "${component}". Components: ${built.join(", ")}.`,
        );
      const brings = withImports([component], roots);
      const inInventory = scheme_id
        ? scheme(scheme_id).inventory.in.some((i) => i.id === component)
        : undefined;
      return json({
        command: `npx open-ds add ${component} --dir .`,
        components: brings,
        packages: packagesFor(brings, roots),
        ...(scheme_id && {
          in_inventory: inInventory,
          note: inInventory
            ? undefined
            : `${component} is not in ${scheme_id}'s inventory; say why before adding it.`,
        }),
      });
    },
  );

  // The five skills, and the overview, as prompts.
  for (const name of ["open-ds", ...focusedSkills(roots)]) {
    const skill = frontmatter(
      readFileSync(join(roots.skills, name, "SKILL.md"), "utf8"),
    );
    server.registerPrompt(
      name,
      { title: skill.name, description: skill.description },
      async () => ({
        description: skill.description,
        messages: [
          { role: "user", content: { type: "text", text: skill.body } },
        ],
      }),
    );
  }

  return server;
}

/** Serves over stdio, for a local agent. */
export async function runStdio(options) {
  await createMcpServer(options).connect(new StdioServerTransport());
}

/**
 * The request handler behind runHttp: Streamable HTTP at /mcp, health at / and /health. A host can
 * mount it next to other routes (the hosted server also serves the site).
 */
export function mcpHandler({ roots } = {}) {
  return async (req, res) => {
    const path = new URL(req.url, "http://x").pathname;
    if (path === "/" || path === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          name: "open-ds",
          version: VERSION,
          mcp: "/mcp",
          schemes: schemeIds(roots),
        }),
      );
    }
    if (path !== "/mcp") return res.writeHead(404).end();
    if (req.method !== "POST") {
      res.writeHead(405, { allow: "POST", "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Use POST." },
          id: null,
        }),
      );
    }
    let body;
    try {
      const chunks = [];
      let size = 0;
      for await (const c of req) {
        size += c.length;
        if (size > 1_000_000) throw new Error("too large");
        chunks.push(c);
      }
      body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "null");
    } catch {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32700, message: "Parse error." },
          id: null,
        }),
      );
    }
    if (
      body === null ||
      (Array.isArray(body) && body.length === 0) ||
      typeof body !== "object"
    ) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32600, message: "Invalid Request." },
          id: null,
        }),
      );
    }
    // Stateless: a fresh server and transport per request.
    const server = createMcpServer({ roots });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  };
}

/** Serves Streamable HTTP at /mcp, without sessions or authentication. Returns the Node server. */
export function runHttp({ port = 8787, host = "127.0.0.1", roots } = {}) {
  const http = createHttpServer(mcpHandler({ roots }));
  http.on("error", (e) => {
    console.error(
      e.code === "EADDRINUSE"
        ? `Port ${port} is already in use. Pick another with --port.`
        : e.message,
    );
    process.exitCode = 1;
  });
  return http.listen(port, host);
}
