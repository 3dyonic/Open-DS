// The open-ds command. Scheme commands live here. Recipe commands from the first preview
// (check, catalog, diff, init <recipe.json | fingerprint>) still run through main.mjs.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { agentsMd, skillSection } from "./agents.mjs";
import { run as runRecipe } from "./main.mjs";
import { assetRoots, grammar, keyInfo, loadScheme, schemeIds, when, why } from "./schemes.mjs";

const HELP = `open-ds: deploy an Open DS scheme as a full design system.

  open-ds list                         the schemes, one line each
  open-ds show <scheme>                what a scheme is for, its themes and its voice
  open-ds why <scheme> <id>            the answer and its reasons, for a question id
                                       (typography.q3) or a component key (button/primary/background)
  open-ds when <scheme> <situation>    what to use and why, for a situation id or plain words
  open-ds init <scheme> [--dir .] [--brand <id>]
                                       copy tokens, components, AGENTS.md and the agent skill
  open-ds add <component> [--dir .]    copy one more component into an initialised project

Add --json to list, show, why and when for machine-readable output.
Recipe commands from the first preview still work: check, catalog, diff, init <recipe.json>.`;

const NPM = ["radix-ui", "lucide-react", "class-variance-authority", "clsx", "tailwind-merge"];

function flag(args, name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
}

const sha = (text) => createHash("sha256").update(text).digest("hex").slice(0, 16);

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
  if (!existsSync(path)) throw new Error(`No component called "${name}". Components: ${componentNames(roots).join(", ")}.`);
  return readFileSync(path, "utf8").replace(`from "../lib/utils"`, `from "../../lib/utils"`);
}

/** Copies a scheme into a project. Returns what it wrote. */
export function deploy(schemeId, dir, { brand, roots = assetRoots() } = {}) {
  const scheme = loadScheme(schemeId, roots);
  const g = grammar(roots);
  const brands = Object.keys(scheme.tokens.brands);
  if (brand && !brands.includes(brand)) throw new Error(`${scheme.name} has no brand "${brand}". Brands: ${brands.join(", ")}.`);
  const tokenDir = join(roots.tokens, schemeId);
  if (!existsSync(join(tokenDir, "tokens.css"))) throw new Error(`Tokens for ${schemeId} are not built. Run: pnpm --dir tokens build`);
  const files = {};
  const css = [
    `/* ${scheme.name}: Open DS tokens, shadcn theme and base styles. Import after Tailwind. */`,
    readFileSync(join(tokenDir, "tokens.css"), "utf8"),
    readFileSync(join(tokenDir, "theme.css"), "utf8"),
    readFileSync(join(roots.ui, "styles.css"), "utf8"),
  ].join("\n");
  write(dir, "src/styles/open-ds.css", css, files);
  write(dir, "src/lib/utils.ts", readFileSync(join(roots.ui, "lib", "utils.ts"), "utf8"), files);
  const components = componentNames(roots);
  for (const name of components) write(dir, `src/components/ui/${name}.tsx`, componentSource(roots, name), files);
  write(dir, ".open-ds/scheme.json", JSON.stringify(scheme, null, 2) + "\n", files);
  for (const t of scheme.themes) {
    write(dir, `.open-ds/tokens/${t.id}.tokens.json`, readFileSync(join(tokenDir, `${t.id}.tokens.json`), "utf8"), files);
  }
  write(dir, "AGENTS.md", agentsMd(scheme, g, { brand: brand ?? (brands.length > 1 ? brands[0] : null), components }), files);
  const skill = readFileSync(join(roots.skills, "open-ds", "SKILL.md"), "utf8") + skillSection(scheme);
  write(dir, ".claude/skills/open-ds/SKILL.md", skill, files);
  const record = {
    $comment: "Written by open-ds init. Lists the scheme and every file it wrote, with a short hash.",
    scheme: scheme.id,
    version: scheme.version,
    brand: brand ?? (brands.length > 1 ? brands[0] : null),
    components,
    dependencies: NPM,
    files,
  };
  writeFileSync(join(dir, "open-ds.json"), JSON.stringify(record, null, 2) + "\n");
  return record;
}

export function addComponent(name, dir, roots = assetRoots()) {
  const recordPath = join(dir, "open-ds.json");
  if (!existsSync(recordPath)) throw new Error(`No open-ds.json in ${dir}. Run "open-ds init <scheme>" first.`);
  const record = JSON.parse(readFileSync(recordPath, "utf8"));
  if (!record.scheme) throw new Error(`${recordPath} was written by a recipe init. Run "open-ds init <scheme>".`);
  const text = componentSource(roots, name);
  write(dir, `src/components/ui/${name}.tsx`, text, record.files);
  if (!record.components.includes(name)) record.components = [...record.components, name].sort();
  writeFileSync(recordPath, JSON.stringify(record, null, 2) + "\n");
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
  const args = rest.filter((a) => a !== "--json" && a !== "--yes");
  const out = (data, text) => (json ? console.log(JSON.stringify(data, null, 2)) : text());
  try {
    if (!cmd || cmd === "--help" || cmd === "-h" || cmd === "help") {
      console.log(HELP);
      return 0;
    }
    if (cmd === "list") {
      const data = schemeIds().map((id) => {
        const s = loadScheme(id);
        return { id, name: s.name, summary: s.summary, brands: Object.keys(s.tokens.brands), status: s.status };
      });
      out(data, () => data.forEach((s) => console.log(`${s.id.padEnd(18)} ${s.summary}`)));
      return 0;
    }
    if (cmd === "show") {
      const s = loadScheme(args[0] ?? "");
      out(s, () => {
        console.log(`${s.name} (${s.id} ${s.version}, ${s.status})\n${s.summary}\n`);
        console.log(`Use when: ${s.ai.use_when}\nAvoid when: ${s.ai.avoid_when}\n`);
        console.log(`Themes: ${s.themes.map((t) => t.id).join(", ")}`);
        console.log(`Voice: ${s.voice.summary}`);
        console.log(`Scenarios:\n${s.scenarios.map((x) => `  - ${x}`).join("\n")}`);
      });
      return 0;
    }
    if (cmd === "why") {
      const [id, target] = args;
      const s = loadScheme(id ?? "");
      if (!target) throw new Error("why needs a question id (typography.q3) or a component key (button/primary/background).");
      const answer = why(s, target);
      if (answer) {
        out(answer, () => printWhy(answer));
        return 0;
      }
      const key = keyInfo(id, target);
      if (key) {
        out(key, () => {
          console.log(`${key.key}: ${key.description}\n  reads ${key.semantic}`);
          for (const [t, v] of Object.entries(key.values)) console.log(`  ${t}: ${v}`);
        });
        return 0;
      }
      throw new Error(`"${target}" is not a question id or a component key in ${s.name}.`);
    }
    if (cmd === "when") {
      const [id, ...words] = args;
      const s = loadScheme(id ?? "");
      const rule = when(s, words.join(" "));
      if (!rule) throw new Error(`No situation matches "${words.join(" ")}". Situations are listed in schemes/grammar.json.`);
      out(rule, () => console.log(`${rule.title}\n  Use: ${rule.use}\n  Not: ${rule.not}\n  Why: ${rule.why}`));
      return 0;
    }
    if (cmd === "init" && args[0] && schemeIds().includes(args[0])) {
      const dir = resolve(flag(args, "--dir", "."));
      const record = deploy(args[0], dir, { brand: flag(args, "--brand") });
      out(record, () => {
        console.log(`Deployed ${record.scheme}${record.brand ? ` (${record.brand})` : ""} into ${dir}.`);
        console.log(`Wrote ${Object.keys(record.files).length} files: tokens, ${record.components.length} components, AGENTS.md and the agent skill.`);
        console.log(`Next: install the component packages: npm install ${record.dependencies.join(" ")}`);
        console.log(`Then import src/styles/open-ds.css after Tailwind.`);
      });
      return 0;
    }
    if (cmd === "add") {
      const dir = resolve(flag(args, "--dir", "."));
      const record = addComponent(args[0] ?? "", dir);
      out(record, () => console.log(`Added ${args[0]} to ${dir}.`));
      return 0;
    }
    return runRecipe(argv);
  } catch (error) {
    console.log(error.message);
    return 1;
  }
}

