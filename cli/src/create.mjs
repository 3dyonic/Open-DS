// Writes a full design system project for one scheme: its own Style Dictionary token build,
// the components, Storybook, Docusaurus docs, the answer map, the agent files and CI.
// The project depends on the open-ds package for why, when and add.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { agentsMd, skillSection } from "./agents.mjs";
import { componentsFor, packagesFor } from "./components.mjs";
import { docsLlms, docsPages } from "./docs.mjs";
import { assetRoots, grammar, loadScheme } from "./schemes.mjs";

const VERSION = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "package.json"), "utf8")).version;

const DEV_DEPENDENCIES = {
  "@docusaurus/core": "^3.10.2",
  "@docusaurus/preset-classic": "^3.10.2",
  "@docusaurus/types": "^3.10.2",
  "@mdx-js/react": "^3.1.0",
  "@storybook/addon-docs": "^10.6.5",
  "@storybook/react-vite": "^10.6.5",
  "@tailwindcss/vite": "^4.3.3",
  "@types/react": "^19.1.13",
  "@types/react-dom": "^19.1.9",
  "@vitejs/plugin-react": "^6.1.2",
  "prism-react-renderer": "^2.4.1",
  storybook: "^10.6.5",
  "style-dictionary": "^5.7.1",
  tailwindcss: "^4.3.3",
  typescript: "^5.9.2",
  vite: "^8.3.5",
};

const json = (data) => JSON.stringify(data, null, 2) + "\n";

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

function readme(scheme, name, brands) {
  return [
    `# ${name}`,
    "",
    `A design system built from the Open DS scheme **${scheme.name}** (${scheme.id} ${scheme.version}). ${scheme.summary}`,
    "",
    "## Run it",
    "",
    "```bash",
    "npm install",
    "npm run storybook   # the components, at http://localhost:6006",
    "npm run docs        # the docs, at http://localhost:3000",
    "```",
    "",
    "`npm run build` builds the tokens, type-checks the components and builds Storybook and the docs.",
    "",
    "## What is here",
    "",
    "| Folder | What it holds |",
    "| --- | --- |",
    "| `tokens/src/` | The DTCG token source: primitives, brands, semantics for light and dark, component keys, content. |",
    "| `tokens/build.mjs` | The Style Dictionary build. `npm run tokens` writes CSS, the shadcn and Tailwind theme and JSON to `build/`. |",
    "| `src/components/ui/` | The components. Each reads only component keys such as `--button-primary-background`. |",
    "| `src/styles/index.css` | Tailwind, the built tokens, the theme and the base styles. |",
    "| `stories/` | Storybook stories, with the usage rules next to each component. |",
    "| `docs/` | The Docusaurus docs: reasons, voice, foundations, components, themes. |",
    "| `scheme.json` | The answer map: every decision with why and because, every usage rule, the voice. |",
    "| `AGENTS.md`, `.claude/skills/` | What a coding agent reads before it writes UI. |",
    "",
    `Themes: ${scheme.themes.map((t) => t.id).join(", ")}.${brands.length > 1 ? ` Set \`data-brand\` on \`<html>\` to pick a brand.` : ""} Add the class \`dark\` for dark mode.`,
    "",
    "## Ask why",
    "",
    "```bash",
    "npm run why -- typography.definition",
    "npm run when -- destructive action",
    "```",
    "",
  ].join("\n");
}

/** Writes a design system project for a scheme into dir. Returns what it wrote. */
export function createProject(schemeId, dir, { brand, openDs = `^${VERSION}`, overwrite = false, roots = assetRoots() } = {}) {
  const scheme = loadScheme(schemeId, roots);
  const g = grammar(roots);
  const brands = Object.keys(scheme.tokens.brands);
  if (brand && !brands.includes(brand)) throw new Error(`${scheme.name} has no brand "${brand}". Brands: ${brands.join(", ")}.`);
  if (!existsSync(join(roots.tokens, schemeId, "tokens.css")))
    throw new Error(`Tokens for ${schemeId} are not built. Run: pnpm --dir tokens build`);
  // A fresh git folder, a vendored package and npm's leftovers do not count as content.
  const SETUP = new Set([".git", ".DS_Store", "vendor", "node_modules", "package-lock.json"]);
  const taken = existsSync(dir) ? readdirSync(dir).filter((f) => !SETUP.has(f)) : [];
  if (taken.length && !overwrite) {
    throw new Error(`${dir} is not empty (${taken.slice(0, 5).join(", ")}). Run create again with --yes to write into it.`);
  }
  const name = basename(dir);
  const files = [];
  const write = (rel, text) => {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), text);
    files.push(rel);
  };

  // The fixed parts: token build, Storybook, Docusaurus config, CI. "gitignore" becomes .gitignore,
  // because npm drops .gitignore files from packages.
  const template = join(roots.templates, "project");
  for (const path of walk(template)) {
    const rel = relative(template, path);
    write(rel === "gitignore" ? ".gitignore" : rel, readFileSync(path, "utf8"));
  }

  // The token source, as DTCG files the team owns and edits.
  const t = scheme.tokens;
  write("tokens/src/primitive.tokens.json", json(t.primitive));
  for (const b of brands) write(`tokens/src/brands/${b}.tokens.json`, json(t.brands[b].primitive ?? {}));
  for (const part of ["base", "light", "dark"]) write(`tokens/src/semantic/${part}.tokens.json`, json(t.semantic[part] ?? {}));
  write("tokens/src/component.tokens.json", json(t.component));
  if (t.content) write("tokens/src/content.tokens.json", json({ content: t.content }));
  // The default brand goes first, so it is the one on :root.
  const order = brand ? [brand, ...brands.filter((b) => b !== brand)] : brands;
  write(
    "tokens/themes.json",
    json({
      description: "The brands and themes tokens/build.mjs builds. The first brand is the default, on :root.",
      name: scheme.name,
      brands: order.map((b) => ({ id: b, label: t.brands[b].label ?? b })),
      themes: order.flatMap((b) => scheme.themes.filter((x) => x.brand === b)),
    }),
  );

  // The scheme's inventory, plus the components those import, and their styles.
  const components = componentsFor(scheme, roots);
  for (const c of components) {
    write(
      `src/components/ui/${c}.tsx`,
      readFileSync(join(roots.ui, "components", `${c}.tsx`), "utf8").replaceAll(`from "../lib/`, `from "../../lib/`),
    );
  }
  for (const lib of readdirSync(join(roots.ui, "lib"))) write(`src/lib/${lib}`, readFileSync(join(roots.ui, "lib", lib), "utf8"));
  write("src/styles/base.css", readFileSync(join(roots.ui, "styles.css"), "utf8"));
  write(
    "src/index.ts",
    `// ${scheme.name} components. Import "./styles/index.css" once in an app.\n` +
      components.map((c) => `export * from "./components/ui/${c}";`).join("\n") +
      "\n",
  );

  // Storybook stories, with this scheme's usage rules.
  // A story is copied only when everything it imports from the components is installed here.
  const exported = new Set(
    components.flatMap((c) => {
      const src = readFileSync(join(roots.ui, "components", `${c}.tsx`), "utf8");
      const names = [...src.matchAll(/^export (?:function|const|interface|type) ([A-Za-z]+)/gm)].map((m) => m[1]);
      for (const m of src.matchAll(/^export \{([^}]+)\}/gm))
        names.push(
          ...m[1]
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        );
      return names;
    }),
  );
  const storyFits = (text) => {
    const m = text.match(/import \{([^}]+)\} from "@open-ds\/ui"/);
    return (
      !m ||
      m[1]
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .every((n) => exported.has(n))
    );
  };
  for (const f of readdirSync(roots.stories).filter(
    (x) => x.endsWith(".stories.tsx") && storyFits(readFileSync(join(roots.stories, x), "utf8")),
  )) {
    write(
      `stories/${f}`,
      readFileSync(join(roots.stories, f), "utf8")
        .replaceAll(`from "@open-ds/ui"`, `from "../src"`)
        .replaceAll(`from "../src/usage"`, `from "./usage"`)
        .replaceAll(`from "../src/samples"`, `from "./samples"`)
        .replaceAll(`from "../src/docs-blocks"`, `from "./docs-blocks"`),
    );
  }

  // The answer map and the situations the usage rules name.
  write("scheme.json", json(scheme));
  write(".open-ds/grammar.json", json({ situations: g.situations, catalogue: g.catalogue, component_keys: g.component_keys }));
  write(".open-ds/situations.json", json(g.situations.map((s) => ({ id: s.id, title: s.title, description: s.description }))));

  // The docs pages.
  const pages = docsPages(scheme, g, roots);
  for (const [rel, text] of Object.entries(pages)) write(`docs/docs/${rel}`, text);
  write("docs/static/llms.txt", docsLlms(scheme, pages));

  // The agent files.
  const defaultBrand = brands.length > 1 ? order[0] : null;
  write("AGENTS.md", agentsMd(scheme, g, { brand: defaultBrand, components, project: true }));
  write(
    ".claude/skills/open-ds/SKILL.md",
    readFileSync(join(roots.skills, "open-ds", "SKILL.md"), "utf8") + skillSection(scheme, { project: true }),
  );

  write(
    "package.json",
    json({
      name,
      version: "0.1.0",
      private: true,
      description: `${scheme.name}: a design system built from the Open DS scheme ${scheme.id}.`,
      main: "src/index.ts",
      scripts: {
        tokens: "node tokens/build.mjs",
        typecheck: "npm run tokens && tsc --noEmit",
        storybook: "npm run tokens && storybook dev -p 6006",
        "build-storybook": "npm run tokens && storybook build -o storybook-static --quiet",
        docs: "npm run tokens && docusaurus start docs",
        "build-docs": "npm run tokens && docusaurus build docs",
        build: "npm run typecheck && npm run build-storybook && npm run build-docs",
        why: `open-ds why ${scheme.id}`,
        when: `open-ds when ${scheme.id}`,
      },
      dependencies: { react: "^19.1.1", "react-dom": "^19.1.1", ...packagesFor(components, roots) },
      devDependencies: { "open-ds": openDs, ...DEV_DEPENDENCIES },
    }),
  );
  write("README.md", readme(scheme, name, brands));

  const record = {
    $comment: "Written by open-ds create. The scheme this design system was built from.",
    kind: "project",
    scheme: scheme.id,
    version: scheme.version,
    brand: defaultBrand,
    components,
    files: files.sort(),
  };
  writeFileSync(join(dir, "open-ds.json"), json(record));
  return record;
}
