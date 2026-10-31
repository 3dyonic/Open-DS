// The open-ds command: list the schemes, explain their decisions, and deploy one into a project.

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { agentsMd, skillSection } from "./agents.mjs";
import { componentsFor, packagesFor, withImports } from "./components.mjs";
import { createProject } from "./create.mjs";
import { docsLlms, docsPages } from "./docs.mjs";
import {
  assetRoots,
  focusedSkills,
  grammar,
  keyInfo,
  loadScheme,
  schemeIds,
  when,
  why,
} from "./schemes.mjs";

const HELP = `open-ds: deploy an Open DS scheme as a full design system.

  open-ds list                         the schemes, one line each
  open-ds show <scheme>                what a scheme is for, its themes and its voice
  open-ds why <scheme> <id>            the answer and its reasons, for a question id
                                       (typography.definition) or a component key (button/primary/background)
  open-ds when <scheme> <situation>    what to use and why, for a situation id or plain words
  open-ds context <scheme> <target>    only the context for one target: a task (choose, build, write,
                                       change, review), a component, a component key, a semantic
                                       token (color.status.danger) or a situation
  open-ds create <dir> --scheme <id> [--brand <id>]
                                       write a full design system project: Style Dictionary tokens,
                                       components, Storybook, Docusaurus docs, agent files and CI
  open-ds init <scheme> [--dir .] [--brand <id>] [--docs]
                                       copy tokens, components, AGENTS.md and the agent skill;
                                       --docs also writes the design system's docs pages to docs/
  open-ds add <component> [--dir .]    copy one more component into an initialised project
  open-ds mcp [--http] [--port 8787] [--host 127.0.0.1]
                                       the Open DS MCP server: stdio for a local agent, or
                                       Streamable HTTP at /mcp (read-only, no authentication yet)

Add --json to list, show, why and when for machine-readable output.`;

function flag(args, name, fallback) {
  const i = args.indexOf(name);
  if (i < 0) return fallback;
  const value = args[i + 1];
  if (!value || value.startsWith("--"))
    throw new Error(`${name} needs a value.`);
  return value;
}

const sha = (text) =>
  createHash("sha256").update(text).digest("hex").slice(0, 16);

function write(dir, rel, text, files) {
  const path = join(dir, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  files[rel] = sha(text);
}

function componentNames(roots) {
  return readdirSync(join(roots.ui, "components"))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort();
}

function componentSource(roots, name) {
  const path = join(roots.ui, "components", `${name}.tsx`);
  if (!existsSync(path))
    throw new Error(
      `No component called "${name}". Components: ${componentNames(roots).join(", ")}.`,
    );
  return readFileSync(path, "utf8").replaceAll(
    `from "../lib/`,
    `from "../../lib/`,
  );
}

/** Copies a scheme into a project. Returns what it wrote. */
export function deploy(
  schemeId,
  dir,
  { brand, overwrite = false, docs = false, roots = assetRoots() } = {},
) {
  const scheme = loadScheme(schemeId, roots);
  const g = grammar(roots);
  const brands = Object.keys(scheme.tokens.brands);
  if (brand && !brands.includes(brand))
    throw new Error(
      `${scheme.name} has no brand "${brand}". Brands: ${brands.join(", ")}.`,
    );
  const existing = [
    "open-ds.json",
    "AGENTS.md",
    "src/styles/open-ds.css",
  ].filter((f) => existsSync(join(dir, f)));
  if (existing.length && !overwrite) {
    throw new Error(
      `${dir} already has ${existing.join(", ")}. Run init again with --yes to overwrite them.`,
    );
  }
  const tokenDir = join(roots.tokens, schemeId);
  if (!existsSync(join(tokenDir, "tokens.css")))
    throw new Error(
      `Tokens for ${schemeId} are not built. Run: pnpm --dir tokens build`,
    );
  const files = {};
  const css = [
    `/* ${scheme.name}: Open DS tokens, shadcn theme and base styles. Import after Tailwind. */`,
    readFileSync(join(tokenDir, "tokens.css"), "utf8"),
    readFileSync(join(tokenDir, "theme.css"), "utf8"),
    readFileSync(join(tokenDir, "shadcn.css"), "utf8"),
    readFileSync(join(roots.ui, "styles.css"), "utf8"),
  ].join("\n");
  write(dir, "src/styles/open-ds.css", css, files);
  for (const lib of readdirSync(join(roots.ui, "lib")))
    write(
      dir,
      `src/lib/${lib}`,
      readFileSync(join(roots.ui, "lib", lib), "utf8"),
      files,
    );
  // The scheme's inventory, plus the components those import.
  const components = componentsFor(scheme, roots);
  const packages = packagesFor(components, roots);
  for (const name of components)
    write(
      dir,
      `src/components/ui/${name}.tsx`,
      componentSource(roots, name),
      files,
    );
  write(
    dir,
    ".open-ds/scheme.json",
    JSON.stringify(scheme, null, 2) + "\n",
    files,
  );
  for (const t of scheme.themes) {
    write(
      dir,
      `.open-ds/tokens/${t.id}.tokens.json`,
      readFileSync(join(tokenDir, `${t.id}.tokens.json`), "utf8"),
      files,
    );
  }
  write(
    dir,
    ".open-ds/content.json",
    readFileSync(join(tokenDir, "content.json"), "utf8"),
    files,
  );
  write(
    dir,
    "AGENTS.md",
    agentsMd(scheme, g, {
      brand: brand ?? (brands.length > 1 ? brands[0] : null),
      components,
    }),
    files,
  );
  const skill =
    readFileSync(join(roots.skills, "open-ds", "SKILL.md"), "utf8") +
    skillSection(scheme);
  write(dir, ".claude/skills/open-ds/SKILL.md", skill, files);
  // The focused skills: choose, build, write, change, review.
  for (const name of focusedSkills(roots))
    write(
      dir,
      `.claude/skills/${name}/SKILL.md`,
      readFileSync(join(roots.skills, name, "SKILL.md"), "utf8"),
      files,
    );
  if (docs) {
    // The design system's docs, as Docusaurus pages: the same pages Open DS builds for this scheme.
    const pages = docsPages(scheme, g, roots);
    for (const [rel, text] of Object.entries(pages))
      write(dir, `docs/${rel}`, text, files);
    write(dir, "docs/llms.txt", docsLlms(scheme, pages), files);
  }
  const record = {
    $comment:
      "Written by open-ds init. Lists the scheme and every file it wrote, with a short hash.",
    scheme: scheme.id,
    version: scheme.version,
    brand: brand ?? (brands.length > 1 ? brands[0] : null),
    components,
    dependencies: Object.keys(packages),
    files,
  };
  writeFileSync(
    join(dir, "open-ds.json"),
    JSON.stringify(record, null, 2) + "\n",
  );
  return record;
}

export function addComponent(name, dir, roots = assetRoots()) {
  const recordPath = join(dir, "open-ds.json");
  if (!existsSync(recordPath))
    throw new Error(
      `No open-ds.json in ${dir}. Run "open-ds init <scheme>" first.`,
    );
  const record = JSON.parse(readFileSync(recordPath, "utf8"));
  if (!record.scheme)
    throw new Error(
      `${recordPath} has no scheme. Run "open-ds init <scheme>" first.`,
    );
  componentSource(roots, name); // fails with the list of components when the name is unknown
  // The component and every component it imports that the project does not have yet.
  const added = withImports([name], roots).filter(
    (c) => c === name || !record.components.includes(c),
  );
  for (const c of added)
    write(
      dir,
      `src/components/ui/${c}.tsx`,
      componentSource(roots, c),
      record.files,
    );
  for (const lib of readdirSync(join(roots.ui, "lib")))
    if (!existsSync(join(dir, "src/lib", lib)))
      write(
        dir,
        `src/lib/${lib}`,
        readFileSync(join(roots.ui, "lib", lib), "utf8"),
        record.files,
      );
  record.components = [...new Set([...record.components, ...added])].sort();
  const before = new Set(record.dependencies ?? []);
  record.dependencies = Object.keys(packagesFor(record.components, roots));
  record.added = {
    components: added,
    packages: record.dependencies.filter((d) => !before.has(d)),
  };
  writeFileSync(
    recordPath,
    JSON.stringify({ ...record, added: undefined }, null, 2) + "\n",
  );
  return record;
}

function printWhy(node, depth = 0) {
  const lead = depth === 0 ? "" : `${"  ".repeat(depth)}because: `;
  console.log(`${lead}${node.text} ${node.answer}. ${node.why}`);
  for (const b of node.because) printWhy(b, depth + 1);
}

export async function run(argv) {
  const [cmd, ...rest] = argv;
  const json = rest.includes("--json");
  const yes = rest.includes("--yes");
  const withDocs = rest.includes("--docs");
  const args = rest.filter(
    (a) => a !== "--json" && a !== "--yes" && a !== "--docs",
  );
  const out = (data, text) =>
    json ? console.log(JSON.stringify(data, null, 2)) : text();
  try {
    if (!cmd || cmd === "--help" || cmd === "-h" || cmd === "help") {
      console.log(HELP);
      return 0;
    }
    if (cmd === "mcp") {
      // Loaded on demand: the MCP server imports this module too.
      const { runHttp, runStdio } = await import("./mcp.mjs");
      if (rest.includes("--http")) {
        const port = Number(flag(args, "--port", process.env.PORT ?? "8787"));
        const host = flag(args, "--host", process.env.HOST ?? "127.0.0.1");
        runHttp({ port, host }).once("listening", () =>
          console.error(
            `Open DS MCP server on http://${host}:${port}/mcp (no authentication).`,
          ),
        );
        await new Promise(() => {});
      }
      await runStdio();
      await new Promise(() => {});
    }
    if (cmd === "list") {
      const data = schemeIds().map((id) => {
        const s = loadScheme(id);
        return {
          id,
          name: s.name,
          summary: s.summary,
          brands: Object.keys(s.tokens.brands),
          status: s.status,
        };
      });
      out(data, () =>
        data.forEach((s) => console.log(`${s.id.padEnd(18)} ${s.summary}`)),
      );
      return 0;
    }
    if (cmd === "show") {
      const s = loadScheme(args[0] ?? "");
      out(s, () => {
        console.log(
          `${s.name} (${s.id} ${s.version}, ${s.status})\n${s.summary}\n`,
        );
        console.log(
          `Use when: ${s.ai.use_when}\nAvoid when: ${s.ai.avoid_when}\n`,
        );
        console.log(`Themes: ${s.themes.map((t) => t.id).join(", ")}`);
        console.log(`Voice: ${s.voice.summary.text}`);
        if (s.inventory)
          console.log(
            `Inventory: ${s.inventory.in.length} of ${grammar().catalogue.items.length} components: ${s.inventory.in.map((i) => i.id).join(", ")}`,
          );
        console.log(
          `Scenarios:\n${s.scenarios.map((x) => `  - ${x.text}`).join("\n")}`,
        );
      });
      return 0;
    }
    if (cmd === "why") {
      const [id, target] = args;
      const s = loadScheme(id ?? "");
      if (!target)
        throw new Error(
          "why needs a question id (typography.definition) or a component key (button/primary/background).",
        );
      const answer = why(s, target);
      if (answer) {
        out(answer, () => printWhy(answer));
        return 0;
      }
      const key = keyInfo(id, target);
      if (key) {
        out(key, () => {
          console.log(
            `${key.key}: ${key.description}\n  reads ${key.semantic}`,
          );
          for (const [t, v] of Object.entries(key.values))
            console.log(`  ${t}: ${v}`);
        });
        return 0;
      }
      throw new Error(
        `"${target}" is not a question id or a component key in ${s.name}.`,
      );
    }
    if (cmd === "when") {
      const [id, ...words] = args;
      const s = loadScheme(id ?? "");
      const rule = when(s, words.join(" "));
      if (!rule)
        throw new Error(
          `No situation matches "${words.join(" ")}". Situations are listed in schemes/grammar.json.`,
        );
      out(rule, () =>
        console.log(
          `${rule.title}\n  Use: ${rule.use}\n  Not: ${rule.not}\n  Why: ${rule.why}`,
        ),
      );
      return 0;
    }
    if (cmd === "context") {
      const [id, target] = args;
      loadScheme(id ?? "");
      const { context, TASKS } = await import("./context.mjs");
      const c = target && context(id, target);
      if (!c)
        throw new Error(
          `context needs a target: a task (${TASKS.join(", ")}), a component, a component key, a semantic token or a situation id.`,
        );
      out(c, () => console.log(JSON.stringify(c, null, 2)));
      return 0;
    }
    if (cmd === "create") {
      if (!args[0] || args[0].startsWith("--"))
        throw new Error(
          "create needs a folder: open-ds create <dir> --scheme <id>.",
        );
      const scheme = flag(args, "--scheme");
      if (!scheme)
        throw new Error(
          'create needs a scheme: --scheme <id>. Run "open-ds list" to see them.',
        );
      const dir = resolve(args[0]);
      const record = createProject(scheme, dir, {
        brand: flag(args, "--brand"),
        openDs: flag(args, "--open-ds"),
        overwrite: yes,
      });
      out(record, () => {
        console.log(
          `Created the ${record.scheme} design system in ${dir}: ${record.files.length} files.`,
        );
        console.log(
          `Next:\n  cd ${args[0]}\n  npm install\n  npm run storybook   # components\n  npm run docs        # docs`,
        );
      });
      return 0;
    }
    if (cmd === "init") {
      if (!args[0])
        throw new Error('init needs a scheme. Run "open-ds list" to see them.');
      const dir = resolve(flag(args, "--dir", "."));
      const record = deploy(args[0], dir, {
        brand: flag(args, "--brand"),
        overwrite: yes,
        docs: withDocs,
      });
      out(record, () => {
        console.log(
          `Deployed ${record.scheme}${record.brand ? ` (${record.brand})` : ""} into ${dir}.`,
        );
        console.log(
          `Wrote ${Object.keys(record.files).length} files: tokens, ${record.components.length} components, AGENTS.md and the agent skill${withDocs ? ", and the docs pages in docs/" : ""}.`,
        );
        console.log(
          `Next: install the component packages: npm install ${record.dependencies.join(" ")}`,
        );
        console.log(`Then import src/styles/open-ds.css after Tailwind.`);
      });
      return 0;
    }
    if (cmd === "add") {
      const dir = resolve(flag(args, "--dir", "."));
      const record = addComponent(args[0] ?? "", dir);
      out(record, () => {
        console.log(`Added ${record.added.components.join(", ")} to ${dir}.`);
        if (record.added.packages.length)
          console.log(`Next: npm install ${record.added.packages.join(" ")}`);
      });
      return 0;
    }
    throw new Error(`Unknown command "${cmd}". Run "open-ds help".`);
  } catch (error) {
    if (json) console.log(JSON.stringify({ error: error.message }));
    else console.error(error.message);
    return 1;
  }
}
