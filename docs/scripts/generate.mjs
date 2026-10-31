#!/usr/bin/env node
// Writes the docs of one delivered design system into docs/docs, from its scheme. The pages come
// from the open-ds CLI (cli/src/docs.mjs), so these docs match what `open-ds init --docs` writes.
//
//   node scripts/generate.mjs                      the scheme in OPEN_DS_SCHEME, or dense-data
//   node scripts/generate.mjs --scheme multi-brand
//   node scripts/generate.mjs --check              fail if docs/docs is out of date

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { docsLlms, docsPages } from "../../cli/src/docs.mjs";
import { assetRoots, grammar, loadScheme, schemeIds } from "../../cli/src/schemes.mjs";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const i = args.indexOf("--scheme");
const id = (i >= 0 ? args[i + 1] : process.env.OPEN_DS_SCHEME) || "dense-data";
const roots = assetRoots();
if (!schemeIds(roots).includes(id)) {
  console.error(`No scheme called "${id}". Schemes: ${schemeIds(roots).join(", ")}.`);
  process.exit(1);
}
if (!existsSync(join(roots.tokens, id, "tokens.css"))) {
  console.error(`Tokens for ${id} are not built. Run: pnpm --dir tokens build`);
  process.exit(1);
}
const scheme = loadScheme(id, roots);
const pages = docsPages(scheme, grammar(roots), roots, { storybook: process.env.STORYBOOK_URL });
// Maps the scheme's own tokens onto Docusaurus, so the docs look like the design system: the token
// variables (Docusaurus marks dark mode with data-theme="dark" on <html>, where the tokens expect the
// class dark), and Infima's variables pointed at them.
const tokenCss = readFileSync(join(roots.tokens, id, "tokens.css"), "utf8")
  .replace(/^\/\*.*?\*\/\n/s, "")
  .replaceAll(/(^|[\s,])\.dark\b/gm, '$1html[data-theme="dark"]');
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
const schemeCss =
  `/* Generated by scripts/generate.mjs from the ${scheme.name} tokens. Do not edit by hand. */\n` +
  tokenCss +
  `:root,\nhtml[data-theme="dark"] {\n${Object.entries(INFIMA)
    .map(([k, v]) => `  ${k}: var(--${v});`)
    .join("\n")}\n}\n`;

const files = {
  "src/css/scheme.css": schemeCss,
  ...Object.fromEntries(Object.entries(pages).map(([p, t]) => [`docs/${p}`, t])),
  "static/llms.txt": docsLlms(scheme, pages),
  "scheme.json": JSON.stringify({ id: scheme.id, name: scheme.name, summary: scheme.summary }, null, 2) + "\n",
};

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
    console.error(`Out of date for ${id}: ${[...stale, ...extra].join(", ")}. Run: pnpm --dir docs generate`);
    process.exit(1);
  }
  console.log(`Docs for ${id} are current.`);
} else {
  rmSync(join(docs, "docs"), { recursive: true, force: true });
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(docs, rel)), { recursive: true });
    writeFileSync(join(docs, rel), text);
  }
  console.log(`Wrote the ${scheme.name} docs: ${Object.keys(pages).length} files.`);
}
