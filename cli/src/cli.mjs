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
  open-ds context <scheme> <target> [--section <name>] [--page <n>]
                                       the short context for one target, as Markdown: a task (choose,
                                       build, write, change, review), a component, a component key, a
                                       semantic token (color.status.danger) or a situation; it ends with
                                       its sections; --json prints the full answer
  open-ds context --file <path>        in a project: the booklets context/index.json lists for a file
  open-ds context --write              in a project: regenerate context/ from the scheme
  open-ds component <scheme> <id>      what a component and each variant are for, and how this scheme
                                       uses each one (or does not), with its rules
  open-ds check [dir] [--scheme <id>]  check UI code against the scheme: raw colours and sizes, components it
                                       does not carry, variants it does not use, and a context/ that no
                                       longer matches the scheme; exits 1 when it finds any
  open-ds copy <scheme> <kind> <text>  check a label or message against the voice; kind: button, error,
                                       success, empty, confirm or hint
  open-ds change <scheme> <question-id> <option>
  open-ds change <scheme> --token <path> <value>
                                       plan a change: what it reopens, or the contrast it keeps; changes nothing
  open-ds scales <scheme> [--brand <b>] [--mode light|dark] [--hue <h>]
                                       which tokens land on each colour step, by lane
  open-ds token <scheme> <words>       the tokens and component keys that fit an intent
  open-ds fit <words>                  rank the schemes against a product description
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

Add --json to list, show, why, when, context, component, scales, check, copy, change, token and fit for machine-readable output.`;

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
    // Which tokens land on each colour step (OD-223), the map the docs and Storybook draw.
    if (cmd === "scales") {
      const { scales } = await import("./scale-map.mjs");
      const [id] = args;
      const data = scales(loadScheme(id ?? ""), {
        brand: flag(args, "--brand", undefined),
        mode: flag(args, "--mode", "light"),
        hue: flag(args, "--hue", undefined),
      });
      out(data, () => {
        console.log(
          `${data.scheme}, ${data.brand}, ${data.mode}${data.neutral ? `. Neutral: ${data.neutral.gray}` : ""}`,
        );
        for (const h of data.hues) {
          console.log(`\n${h.hue}: ${h.used} of ${h.steps.length} steps used`);
          for (const st of h.steps)
            for (const x of st.tokens)
              console.log(
                `  ${st.step.padEnd(6)} ${st.value}  ${x.token} (${x.lane})${x.via ? ` via ${x.via}` : ""}`,
              );
          for (const x of h.fixed)
            console.log(`  fixed  ${x.value}  ${x.token} (${x.primitive})`);
        }
      });
      return 0;
    }
    if (cmd === "component") {
      const [id, comp] = args;
      loadScheme(id ?? "");
      const { componentGuide, componentText } = await import("./component.mjs");
      const c = comp && componentGuide(id, comp);
      if (!c)
        throw new Error(
          `component needs a catalogue component id, for example: open-ds component ${id} button.`,
        );
      out(c, () => console.log(componentText(c)));
      return 0;
    }
    if (cmd === "context") {
      // Short Markdown by default (OD-205); --section for one part, --json for the full answer.
      const brief = await import("./brief.mjs");
      const { context, TASKS } = await import("./context.mjs");
      const g = grammar();
      const project = () => {
        const dir = resolve(flag(args, "--dir", "."));
        const rec = existsSync(join(dir, "open-ds.json"))
          ? JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8"))
          : null;
        const id = flag(args, "--scheme") ?? rec?.scheme;
        if (!id)
          throw new Error(
            "Run this in a project with open-ds.json, or add --scheme <id>.",
          );
        return { dir, scheme: loadScheme(id) };
      };
      if (args.includes("--write")) {
        const { dir, scheme } = project();
        const files = brief.writeContext(
          dir,
          scheme,
          g,
          brief.projectComponents(dir),
        );
        out({ files }, () =>
          console.log(`Wrote ${files.length} files to context/.`),
        );
        return 0;
      }
      if (args.includes("--file")) {
        const { dir, scheme } = project();
        const text = brief.briefForFile(
          scheme,
          g,
          brief.projectComponents(dir),
          flag(args, "--file"),
        );
        out({ text }, () => process.stdout.write(text));
        return 0;
      }
      const [id, target] = args.filter(
        (a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"),
      );
      loadScheme(id ?? "");
      const missing = () =>
        new Error(
          `context needs a target: a task (${TASKS.join(", ")}), a component, a component key, a semantic token or a situation id.`,
        );
      if (json) {
        const c = target && context(id, target);
        if (!c) throw missing();
        console.log(JSON.stringify(c, null, 2));
        return 0;
      }
      const text =
        target &&
        brief.brief(id, target, {
          section: flag(args, "--section"),
          page: flag(args, "--page", "1"),
          g,
        });
      if (!text) throw missing();
      process.stdout.write(text.endsWith("\n") ? text : `${text}\n`);
      return 0;
    }
    // The tools behind the skills (OD-202), one engine with the MCP server.
    if (["check", "copy", "change", "token", "fit"].includes(cmd)) {
      const tools = await import("./tools.mjs");
      const g = grammar();
      if (cmd === "check") {
        const dir = resolve(
          args[0] && !args[0].startsWith("--") ? args[0] : ".",
        );
        const read = (f) =>
          existsSync(join(dir, f))
            ? JSON.parse(readFileSync(join(dir, f), "utf8"))
            : null;
        const id =
          flag(args, "--scheme") ??
          read("open-ds.json")?.scheme ??
          read("scheme.json")?.id;
        if (!id)
          throw new Error(
            "check needs a scheme: run it in a project with open-ds.json, or add --scheme <id>.",
          );
        const files = [];
        const walk = (rel) => {
          for (const e of readdirSync(join(dir, rel), {
            withFileTypes: true,
          })) {
            const p = rel ? `${rel}/${e.name}` : e.name;
            if (e.isDirectory()) {
              if (
                !/^(node_modules|\.git|dist|build|storybook-static|\.next|\.open-ds)$/.test(
                  e.name,
                )
              )
                walk(p);
            } else if (/\.(tsx|jsx|ts|js|css|html|vue|svelte)$/.test(e.name))
              files.push({
                path: p,
                content: readFileSync(join(dir, p), "utf8"),
              });
          }
        };
        walk("");
        const result = tools.checkUi(loadScheme(id), g, files);
        // context/ must match what the engine prints for this scheme (OD-205).
        const { contextDrift, projectComponents } = await import("./brief.mjs");
        for (const d of contextDrift(
          dir,
          loadScheme(id),
          g,
          projectComponents(dir),
        ))
          result.findings.push({
            file: d.file,
            line: 1,
            rule: "context-drift",
            message: `${d.file} is ${d.problem}: it does not match the scheme.`,
            fix: "Run npx open-ds context --write. Do not edit context/ by hand.",
            see: tools.SEE["context-drift"],
          });
        result.pass = result.findings.length === 0;
        out(result, () => {
          for (const f of result.findings)
            console.log(
              `${f.file}:${f.line}  ${f.rule}  ${f.message}\n    fix: ${f.fix}${f.see ? `\n    see: ${f.see}` : ""}`,
            );
          console.log(
            result.pass
              ? `Clean: ${files.length} files follow ${id}.`
              : `${result.findings.length} findings in ${files.length} files.`,
          );
        });
        return result.pass ? 0 : 1;
      }
      if (cmd === "copy") {
        const [id, kind, ...text] = args;
        const result = tools.checkCopy(loadScheme(id ?? ""), g, {
          kind,
          text: text.join(" "),
        });
        out(result, () => {
          for (const f of result.findings)
            console.log(`${f.rule}: ${f.message}`);
          if (result.rule)
            console.log(
              `Rule for ${result.situation}: use ${result.rule.use}. Not: ${result.rule.not}.${result.rule.example ? ` Example: "${result.rule.example}"` : ""}`,
            );
          console.log(
            result.pass
              ? "Passes the voice."
              : `${result.findings.length} findings.`,
          );
        });
        return result.pass ? 0 : 1;
      }
      if (cmd === "change") {
        const [id, ...more] = args;
        const s = loadScheme(id ?? "");
        const token = flag(more, "--token");
        const change = token
          ? { token, value: more[more.indexOf("--token") + 2] }
          : { question: more[0], option: more[1] };
        if (token ? !change.value : !change.question || !change.option)
          throw new Error(
            "change needs <question-id> <option>, or --token <path> <value>.",
          );
        const plan = tools.planChange(s, g, change);
        out(plan, () => {
          console.log(
            plan.kind === "answer"
              ? `${plan.text} ${plan.from?.label} → ${plan.to.label}`
              : `${plan.token}: ${plan.from} → ${plan.to}`,
          );
          for (const e of plan.edits) console.log(`  - ${e}`);
          if (plan.kind === "token")
            console.log(
              plan.pass
                ? "Every colour pair keeps its contrast."
                : "Some colour pairs would fail.",
            );
        });
        return 0;
      }
      if (cmd === "token") {
        const [id, ...q] = args;
        const found = tools.findToken(loadScheme(id ?? ""), g, q.join(" "));
        out(found, () => {
          for (const r of found.results)
            console.log(`${r.token}  (${r.kind}) ${r.intent}`);
          if (found.situation)
            console.log(
              `Situation ${found.situation.id}: use ${found.situation.use}. Not: ${found.situation.not}.`,
            );
        });
        return 0;
      }
      if (cmd === "fit") {
        const ranked = tools.fitScheme(
          schemeIds().map((x) => loadScheme(x)),
          args.join(" "),
        );
        out(ranked, () =>
          ranked.forEach((r) =>
            console.log(
              `${String(r.score).padStart(3)}  ${r.scheme.padEnd(18)} matched: ${r.matched.join(", ") || "-"}${r.against.length ? `; against: ${r.against.join(", ")}` : ""}`,
            ),
          ),
        );
        return 0;
      }
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
