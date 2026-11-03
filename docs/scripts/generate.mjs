#!/usr/bin/env node
// Writes the repo's docs site into docs/: every scheme, one folder each (OD-207). The pages come from
// the open-ds CLI (cli/src/docs.mjs), so they match what `open-ds init --docs` writes for one scheme.
// A switcher in the navbar keeps the page and swaps the scheme; each scheme's tokens apply only on
// its own pages (html[data-scheme]). A created project's docs stay one scheme.
//
//   node scripts/generate.mjs           write docs/docs/<scheme>/, the scheme CSS, logos and llms.txt
//   node scripts/generate.mjs --check   fail if any of it is out of date
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { docsLlms, docsPages } from "../../cli/src/docs.mjs";
import { assetRoots, grammar, loadScheme, schemeIds } from "../../cli/src/schemes.mjs";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
// The site's base URL (OD-210): "/" locally, "/docs/" on open-ds.dev. Raw HTML in the pages needs it.
const BASE = process.env.DOCS_BASE_URL ?? "/";
const roots = assetRoots();
const g = grammar(roots);
// The order the switcher lists them in: the same as the repo Storybook's toolbar.
const ORDER = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const ids = [
  ...ORDER.filter((id) => schemeIds(roots).includes(id)),
  ...schemeIds(roots).filter((id) => !ORDER.includes(id)),
];
for (const id of ids)
  if (!existsSync(join(roots.tokens, id, "tokens.css"))) {
    console.error(`Tokens for ${id} are not built. Run: pnpm --dir tokens build`);
    process.exit(1);
  }

// Infima's variables, pointed at the scheme's tokens, so Docusaurus wears the design system.
const INFIMA = {
  "--ifm-color-primary": "color-action-primary",
  "--ifm-color-primary-dark": "color-action-primary-hover",
  "--ifm-color-primary-darker": "color-action-primary-hover",
  "--ifm-color-primary-darkest": "color-action-primary-hover",
  "--ifm-color-primary-light": "color-text-link",
  "--ifm-color-primary-lighter": "color-text-link",
  "--ifm-color-primary-lightest": "color-text-link",
  "--ifm-background-color": "color-surface-canvas",
  "--ifm-background-surface-color": "color-surface-default",
  "--ifm-navbar-background-color": "color-surface-default",
  "--ifm-footer-background-color": "color-surface-sunken",
  "--ifm-font-color-base": "color-text-primary",
  "--ifm-font-color-secondary": "color-text-secondary",
  "--ifm-heading-color": "color-text-primary",
  "--ifm-link-color": "color-text-link",
  "--ifm-menu-color": "color-text-secondary",
  "--ifm-menu-color-active": "color-text-link",
  "--ifm-menu-color-background-active": "color-surface-selected",
  "--ifm-menu-color-background-hover": "color-surface-sunken",
  "--ifm-code-background": "color-surface-sunken",
  "--ifm-table-border-color": "color-border-default",
  "--ifm-table-stripe-background": "color-surface-sunken",
  "--ifm-toc-border-color": "color-border-default",
  "--ifm-hr-background-color": "color-border-default",
  "--ifm-color-emphasis-300": "color-border-default",
  "--ifm-font-family-base": "type-body-font-family",
  "--ifm-heading-font-family": "type-heading-font-family",
  "--ifm-font-family-monospace": "type-data-font-family",
  "--ifm-heading-font-weight": "type-heading-font-weight",
  "--ifm-font-weight-bold": "type-label-font-weight",
  "--ifm-global-radius": "radius-container",
  "--ifm-button-border-radius": "button-radius",
  "--ifm-code-border-radius": "radius-control",
  "--ifm-global-border-width": "border-width-default",
  "--ifm-global-shadow-lw": "elevation-card",
  "--ifm-global-shadow-md": "elevation-overlay",
  "--ifm-global-shadow-tl": "elevation-overlay",
  // The type scale: display, title and heading for h1 to h3, label below. Body size is set on body
  // in custom.css, because Infima puts --ifm-font-size-base on html and that would shrink every rem.
  "--ifm-line-height-base": "type-body-line-height",
  "--ifm-h1-font-size": "type-display-font-size",
  "--ifm-h2-font-size": "type-title-font-size",
  "--ifm-h3-font-size": "type-heading-font-size",
  "--ifm-h4-font-size": "type-heading-font-size",
  "--ifm-h5-font-size": "type-label-font-size",
  "--ifm-h6-font-size": "type-label-font-size",
  "--ifm-code-font-size": "type-data-font-size",
  // Spacing and density.
  "--ifm-spacing-vertical": "space-gap-group",
  "--ifm-spacing-horizontal": "space-inset-container",
  "--ifm-leading": "space-gap-group",
  "--ifm-paragraph-margin-bottom": "space-gap-group",
  "--ifm-list-item-margin": "space-gap-tight",
  "--ifm-menu-link-padding-vertical": "space-gap-tight",
  "--ifm-menu-link-padding-horizontal": "space-inset-control-x",
  "--ifm-navbar-item-padding-horizontal": "space-inset-control-x",
  "--ifm-table-cell-padding": "space-inset-cell-x",
  "--ifm-card-vertical-spacing": "card-padding",
  "--ifm-card-horizontal-spacing": "card-padding",
  "--ifm-button-padding-horizontal": "button-padding-x",
  "--ifm-badge-border-radius": "badge-radius",
  // Callouts use the status colours.
  "--ifm-color-success": "color-status-success",
  "--ifm-color-success-dark": "color-status-success",
  "--ifm-color-success-contrast-background": "color-status-success-subtle",
  "--ifm-color-success-contrast-foreground": "color-text-primary",
  "--ifm-color-warning": "color-status-warning",
  "--ifm-color-warning-dark": "color-status-warning",
  "--ifm-color-warning-contrast-background": "color-status-warning-subtle",
  "--ifm-color-warning-contrast-foreground": "color-text-primary",
  "--ifm-color-danger": "color-status-danger",
  "--ifm-color-danger-dark": "color-status-danger",
  "--ifm-color-danger-contrast-background": "color-status-danger-subtle",
  "--ifm-color-danger-contrast-foreground": "color-text-primary",
  "--ifm-color-info": "color-action-primary",
  "--ifm-color-info-dark": "color-action-primary",
  "--ifm-color-info-contrast-background": "color-surface-selected",
  "--ifm-color-info-contrast-foreground": "color-text-primary",
};

// The Open DS mark (a 6 by 5 pixel grid, one cell lit) in a scheme's ink and primary colour. The same
// mark the CLI's project template draws (cli/templates/project/tokens/build.mjs).
const MARK = ["110111", "101010", "1l1011", "101001", "110111"];
const logo = (t) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.2 26.6" role="img" aria-label="Open DS">${MARK.flatMap(
    (row, r) =>
      [...row].map((c, i) =>
        c === "0"
          ? ""
          : `<rect x="${+(i * 5.6).toFixed(1)}" y="${+(r * 5.6).toFixed(1)}" width="4.2" height="4.2" fill="${c === "l" ? t.color.action.primary["@"] : t.color.text.primary}"/>`,
      ),
  ).join("")}</svg>\n`;

const files = {};
const index = [];
for (const id of ids) {
  const scheme = loadScheme(id, roots);
  const pages = docsPages(scheme, g, roots, {
    storybook: process.env.STORYBOOK_URL,
    all: true,
    robots: true,
    base: BASE,
  });
  // The tokens, scoped to this scheme's pages: :root becomes html[data-scheme="<id>"], and the dark
  // class becomes Docusaurus's data-theme="dark" on the same element.
  const scope = `html[data-scheme="${id}"]`;
  const tokenCss = readFileSync(join(roots.tokens, id, "tokens.css"), "utf8")
    .replace(/^\/\*.*?\*\/\n/s, "")
    .replaceAll(/(^|[\s,]):root\b/gm, `$1${scope}`)
    .replaceAll(/(^|[\s,])\.dark\b/gm, `$1${scope}[data-theme="dark"]`);
  const built = readdirSync(join(roots.tokens, id))
    .filter((f) => f.endsWith(".tokens.json"))
    .sort();
  const modeFile = (mode) => built.find((f) => f === `${mode}.tokens.json` || f.endsWith(`-${mode}.tokens.json`));
  const modeTokens = (mode) => JSON.parse(readFileSync(join(roots.tokens, id, modeFile(mode)), "utf8"));
  files[`src/css/schemes/${id}.css`] =
    `/* Generated by scripts/generate.mjs from the ${scheme.name} tokens. Do not edit by hand. */\n` +
    tokenCss +
    `${scope} {\n${Object.entries(INFIMA)
      .map(([k, v]) => `  ${k}: var(--${v});`)
      .join("\n")}\n}\n` +
    `${scope} .navbar__logo img { content: url("/logo-${id}.svg"); }\n` +
    // OD-209: the scheme's robot, small and quiet at the foot of its sidebar.
    `${scope} .theme-doc-sidebar-container .menu::after { background-image: url("/robots/${id}.webp"); }\n` +
    `${scope}[data-theme="dark"] .theme-doc-sidebar-container .menu::after { background-image: url("/robots/${id}-dark.webp"); }\n` +
    `${scope}[data-theme="dark"] .navbar__logo img { content: url("/logo-${id}-dark.svg"); }\n`;
  files[`static/logo-${id}.svg`] = logo(modeTokens("light"));
  files[`static/logo-${id}-dark.svg`] = logo(modeTokens("dark"));
  files[`static/${id}/llms.txt`] = docsLlms(scheme, pages);
  for (const [p, text] of Object.entries(pages))
    files[`docs/${id}/${p}`] = p.endsWith("_category_.json")
      ? // A category's link names a doc by id; ids now start with the scheme's folder.
        text.replaceAll(/("id": ")/g, `$1${id}/`)
      : // The home page's slug is the site root; here it is the scheme's root.
        text.replace(/^slug: "\/"$/m, `slug: "/${id}/"`);
  // What the home page shows per scheme (OD-209): its answers, read from its built tokens.
  const light = readFileSync(join(roots.tokens, id, "tokens.css"), "utf8");
  const token = (name) => light.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim() ?? null;
  const brandIds = Object.keys(scheme.tokens.brands ?? {});
  index.push({
    id,
    name: scheme.name,
    version: scheme.version,
    summary: scheme.summary,
    brands: brandIds,
    useWhen: scheme.ai.use_when,
    examples: scheme.ai.example_products ?? [],
    components: scheme.inventory?.in.length ?? 0,
    answers: scheme.answers.length,
    themes: scheme.themes.length,
    primary: token("color-action-primary"),
    corners: token("radius-control"),
    font: token("type-display-font-family"),
    motion: token("motion-duration-feedback"),
  });
}
files["src/css/schemes.css"] =
  "/* Generated by scripts/generate.mjs: every scheme's tokens, each scoped to its own pages. */\n" +
  ids.map((id) => `@import "./schemes/${id}.css";`).join("\n") +
  "\n";
files["static/logo.svg"] = logo(JSON.parse(readFileSync(join(roots.tokens, ids[0], "light.tokens.json"), "utf8")));
files["schemes.json"] = JSON.stringify(index, null, 2) + "\n";

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
      )
    : [];

if (check) {
  const stale = Object.entries(files)
    .filter(([rel, text]) => !existsSync(join(docs, rel)) || readFileSync(join(docs, rel), "utf8") !== text)
    .map(([rel]) => rel);
  const extra = walk(join(docs, "docs"))
    .map((f) => f.slice(docs.length + 1))
    .filter((rel) => !(rel in files));
  if (stale.length || extra.length) {
    console.error(`Out of date: ${[...stale, ...extra].slice(0, 12).join(", ")}. Run: pnpm --dir docs generate`);
    process.exit(1);
  }
  console.log(`Docs for ${ids.length} schemes are current.`);
} else {
  rmSync(join(docs, "docs"), { recursive: true, force: true });
  rmSync(join(docs, "src/css/schemes"), { recursive: true, force: true });
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(docs, rel)), { recursive: true });
    writeFileSync(join(docs, rel), text);
  }
  console.log(`Wrote the docs for ${ids.length} schemes: ${Object.keys(files).length} files.`);
}
