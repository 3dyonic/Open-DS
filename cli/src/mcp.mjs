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
import { TASKS } from "./context.mjs";
import { brief, briefForFile, READ_ONCE } from "./brief.mjs";
import { componentGuide, followers } from "./component.mjs";
import { createProject } from "./create.mjs";
import {
  checkCopy,
  checkUi,
  COPY_KINDS,
  findToken,
  fitScheme,
  planChange,
} from "./tools.mjs";
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

// Sent once when an agent connects. Ends with the read-once text that AGENTS.md and context/README.md
// carry too (OD-205).
const INSTRUCTIONS = `Open DS: design systems as answered questions. Every scheme answers the same questions and gives the reason for each answer; tokens, components, usage rules and voice follow from them.
Choose: describe the product to fit_scheme, compare the top ones with compare_schemes, then plan_create (a new design system project) or plan_init (an existing app). They return the exact npx command; run it yourself.
Build: call get_context build first, or get_context file=<path> for the file you edit. Before a component or variant, call get_component; before a token, find_token or when_to_use. Before you finish, run check_ui on the files you changed and fix each finding.
Write: get_context write holds the voice; get_scheme returns any part of a scheme in full. Check each label or message with check_copy. Change: call plan_change before you change an answer or a primitive. Review: run check_ui, then the review prompt.
Explain any decision with why; get_answer shows one answer with every option, and what_moves shows what follows from an answer. The prompts open-ds-choose, open-ds-build, open-ds-write, open-ds-change and open-ds-review hold the step-by-step skills.
The questions and answers are a starting point, not a standard.

${READ_ONCE}`;

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
      const follows = new Set(followers(s, question_id));
      const moved = new Set([question_id, ...follows]);
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
        // The outputs that cite the answer or anything that follows from it (OD-185): each variant
        // decision in the component scheme, and each usage rule.
        variants: s.inventory.in.flatMap((c) =>
          Object.entries(c.variants ?? {}).flatMap(([axis, vs]) =>
            Object.entries(vs)
              .filter(([, d]) => (d.because ?? []).some((b) => moved.has(b)))
              .map(([variant, d]) => ({
                component: c.id,
                axis,
                variant,
                ...d,
              })),
          ),
        ),
        rules: s.usage
          .filter((u) => (u.because ?? []).some((b) => moved.has(b)))
          .map((u) => ({ situation: u.situation, use: u.use })),
      });
    },
  );

  server.registerTool(
    "get_key",
    {
      title: "Component key",
      description:
        "A component key (button/primary/background): what it is for, the semantic token it reads, its resolved value in every theme of the scheme, and the guidance for that semantic (intent, not_for with what to use instead, the fills it may sit on).",
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
    "get_context",
    {
      title: "Context",
      description:
        "Short context for one target, as Markdown: what it is for, how this scheme uses it, its rules and its keys by name. A target is a task (choose, build, write, change, review), a component (badge), a component key (button/primary/background), a semantic token (color.status.danger) or a situation (status-label). Or pass file, a path in a created project, for the booklets its context/index.json lists. Each answer ends with its sections, their size and the exact call: pass section for one (values, keyboard, rules…), page for the next page of a long one, and section all for the full answer as JSON.",
      inputSchema: {
        scheme_id: SchemeId,
        target: z
          .string()
          .optional()
          .describe(
            `A task (${TASKS.join(", ")}), a component, a component key, a semantic token or a situation id.`,
          ),
        file: z
          .string()
          .max(300)
          .optional()
          .describe(
            "A file path in a created project, for example src/components/ui/card.tsx. Returns what context/index.json lists for it.",
          ),
        section: z
          .string()
          .max(40)
          .optional()
          .describe(
            "One section, as the answer's hints name it, or all for the full answer as JSON.",
          ),
        page: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("The page of a long section. Starts at 1."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, target, file, section, page }) => {
      const s = scheme(scheme_id);
      const text = (t) => ({ content: [{ type: "text", text: t }] });
      if (file)
        return text(briefForFile(s, g, componentsFor(s, roots), file, roots));
      const out = target && brief(scheme_id, target, { section, page, roots, g });
      if (!out)
        throw new Error(
          `Nothing called "${target ?? ""}". Give a task (${TASKS.join(", ")}), a component (${g.components.map((c) => c.id).join(", ")}), a component key, a semantic token such as color.status.danger, a situation id, or file.`,
        );
      return text(out);
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Component",
      description:
        "One component in one scheme: the reference (what the component and each of its variants are for, the same in every design system, and what to use instead) next to this scheme's decisions (whether it carries the component and why, how it uses each variant or that it does not, and its usage rules). Read this before you build with a component or pick a variant.",
      inputSchema: {
        scheme_id: SchemeId,
        component: z
          .string()
          .describe(
            "A catalogue component id, for example button, badge or dialog.",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, component }) => {
      scheme(scheme_id);
      const out = componentGuide(scheme_id, component, roots, g);
      if (!out)
        throw new Error(
          `"${component}" is not in the catalogue. Components: ${g.catalogue.items.map((i) => i.id).join(", ")}.`,
        );
      return json(out);
    },
  );

  // The tools behind the skills (OD-202): each does a step a skill would otherwise judge by eye.
  server.registerTool(
    "check_ui",
    {
      title: "Check UI",
      description:
        "Checks UI code against a scheme and lists each problem with its file, line, rule, fix and see (the booklet section in a created project that answers it): raw colours and sizes instead of tokens, components the scheme does not carry, and variants it decided not to use (for example the large Button size in Dense data). Pass the contents of the files; this server never reads your disk. A review passes only when this returns no findings. The CLI runs the same check on a folder: open-ds check.",
      inputSchema: {
        scheme_id: SchemeId,
        files: z
          .array(
            z.object({
              path: z
                .string()
                .describe(
                  "The file's path in the project, for example src/app/page.tsx.",
                ),
              content: z.string().max(400000).describe("The file's full text."),
            }),
          )
          .min(1)
          .max(200)
          .describe(
            "The files to check: .tsx, .jsx, .ts, .js, .css, .html, .vue or .svelte.",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, files }) => json(checkUi(scheme(scheme_id), g, files)),
  );

  server.registerTool(
    "check_copy",
    {
      title: "Check copy",
      description:
        "Checks one label or message against a scheme's voice: words on its avoid list, exclamation marks where the voice forbids them, a button as one short verb with no end punctuation, and at most two sentences. Returns the findings and the rule for the text's situation, with its example.",
      inputSchema: {
        scheme_id: SchemeId,
        kind: z
          .enum(Object.keys(COPY_KINDS))
          .describe(
            "What the text is: button, error, success, empty, confirm or hint.",
          ),
        text: z.string().min(1).max(2000).describe("The text to check."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, kind, text }) =>
      json(checkCopy(scheme(scheme_id), g, { kind, text })),
  );

  server.registerTool(
    "plan_change",
    {
      title: "Plan a change",
      description:
        "Plans a change without making it. For a new answer (question_id and option): the edits, the answers that follow, and the variant decisions and rules it reopens. For a new primitive value (token and value): the semantic tokens and component keys it reaches in each theme, and the contrast of every colour pair before and after, with the pairs that would fail.",
      inputSchema: {
        scheme_id: SchemeId,
        question_id: z
          .string()
          .optional()
          .describe(
            "The question whose answer would change, for example content.q2.",
          ),
        option: z
          .string()
          .optional()
          .describe("The new option id for that question."),
        token: z
          .string()
          .optional()
          .describe(
            "A primitive token path, for example color.violet.light.600.",
          ),
        value: z
          .string()
          .optional()
          .describe("The new value for that primitive, for example #5B4FE8."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, question_id, option, token, value }) => {
      if (question_id && !option)
        throw new Error("option is needed with question_id.");
      if (token && !value) throw new Error("value is needed with token.");
      return json(
        planChange(
          scheme(scheme_id),
          g,
          question_id ? { question: question_id, option } : { token, value },
        ),
      );
    },
  );

  server.registerTool(
    "find_token",
    {
      title: "Find a token",
      description:
        "Finds the semantic tokens and component keys that fit an intent in plain words, best first, with what each is for, what not to use it for and the fills it may sit on, plus the matching situation rule. Use it before you pick a colour or a key.",
      inputSchema: {
        scheme_id: SchemeId,
        query: z
          .string()
          .min(2)
          .max(200)
          .describe(
            'What the token is for, for example "border of a field with an error".',
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ scheme_id, query }) =>
      json(findToken(scheme(scheme_id), g, query)),
  );

  server.registerTool(
    "fit_scheme",
    {
      title: "Fit a scheme",
      description:
        "Ranks the schemes against a description of a product, its people, content and main task, with the words that matched each scheme's use_when and the ones that match its avoid_when. Read the reasons before you pick.",
      inputSchema: {
        product: z
          .string()
          .min(3)
          .max(1000)
          .describe(
            "The product in plain words: who uses it, what they see and their main task.",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ product }) =>
      json(
        fitScheme(
          ids.map((id) => scheme(id)),
          product,
        ),
      ),
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
