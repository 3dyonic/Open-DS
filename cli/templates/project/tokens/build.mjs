#!/usr/bin/env node
// Builds this design system's tokens with Style Dictionary.
//
// Reads the DTCG source in tokens/src and tokens/themes.json, and writes build/:
//   tokens.css               the semantic and component keys as CSS variables: light on :root, dark on .dark,
//                            one block per brand. Primitives and themes resolve to values and never ship.
//   theme.css                shadcn's variables and a Tailwind v4 @theme, mapped onto the semantics
//   shadcn.css               shadcn's radius, shadow and text scale, mapped onto the tokens
//   json/<theme>.tokens.json the resolved tokens for one brand and mode
//   content.json             the voice tokens: words for common actions
//   docusaurus.css           the docs site in the same tokens: Infima's variables point at them
//
// Edit a file in tokens/src, then run: npm run tokens

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import { outputReferencesFilter } from "style-dictionary/utils";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "src");
const out = join(here, "..", "build");
const read = (...p) => JSON.parse(readFileSync(join(src, ...p), "utf8"));
const { name, brands, themes } = JSON.parse(
  readFileSync(join(here, "themes.json"), "utf8"),
);

// The values are already valid CSS, so only naming and composite transforms run.
const TRANSFORMS = [
  "attribute/cti",
  "name/kebab",
  "fontFamily/css",
  "cubicBezier/css",
  "shadow/css/shorthand",
];

// shadcn reads these variables. Each points at one semantic decision.
const SHADCN = {
  background: "color-surface-canvas",
  foreground: "color-text-primary",
  card: "color-surface-default",
  "card-foreground": "color-text-primary",
  popover: "color-surface-raised",
  "popover-foreground": "color-text-primary",
  primary: "color-action-primary",
  "primary-foreground": "color-text-on-action",
  secondary: "color-action-secondary",
  "secondary-foreground": "color-text-primary",
  muted: "color-surface-sunken",
  "muted-foreground": "color-text-muted",
  accent: "color-surface-sunken",
  "accent-foreground": "color-text-primary",
  destructive: "color-status-danger",
  border: "color-border-default",
  input: "color-border-strong",
  ring: "color-border-focus",
  radius: "radius-control",
  // The sidebar and charts from shadcn/ui.
  sidebar: "color-surface-default",
  "sidebar-foreground": "color-text-primary",
  "sidebar-primary": "color-action-primary",
  "sidebar-primary-foreground": "color-text-on-action",
  "sidebar-accent": "color-surface-sunken",
  "sidebar-accent-foreground": "color-text-primary",
  "sidebar-border": "color-border-default",
  "sidebar-ring": "color-border-focus",
  // Chart series use the category colours: distinct hues that carry no meaning, so no series reads as an error.
  "chart-1": "color-category-1",
  "chart-2": "color-category-2",
  "chart-3": "color-category-3",
  "chart-4": "color-category-4",
  "chart-5": "color-category-5",
};

// shadcn's radius, shadow and text classes, mapped onto the scheme's tokens. Written to build/shadcn.css.
const SHADCN_SCALE = {
  "--radius-xs": "var(--radius-badge)",
  "--radius-sm": "var(--radius-badge)",
  "--radius-md": "var(--radius-control)",
  "--radius-lg": "var(--radius-container)",
  "--radius-xl": "var(--radius-container)",
  "--shadow-xs": "var(--elevation-card)",
  "--shadow-sm": "var(--elevation-card)",
  "--shadow-md": "var(--elevation-overlay)",
  "--shadow-lg": "var(--elevation-overlay)",
  "--shadow-xl": "var(--elevation-overlay)",
  "--text-xs": "var(--type-caption-font-size)",
  "--text-xs--line-height": "var(--type-caption-line-height)",
  "--text-sm": "var(--type-body-font-size)",
  "--text-sm--line-height": "var(--type-body-line-height)",
  "--text-base": "var(--type-body-font-size)",
  "--text-base--line-height": "var(--type-body-line-height)",
  "--text-lg": "var(--type-heading-font-size)",
  "--text-lg--line-height": "var(--type-heading-line-height)",
};
const ROLES = [
  "display",
  "title",
  "heading",
  "body",
  "label",
  "caption",
  "data",
];

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);
function merge(...trees) {
  const tree = {};
  for (const t of trees) {
    for (const [k, v] of Object.entries(t ?? {})) {
      tree[k] =
        isObject(v) && !("$value" in v) && isObject(tree[k])
          ? merge(tree[k], v)
          : v;
    }
  }
  return tree;
}

// Every *.tokens.json under a folder of tokens/src, merged.
const readDir = (dir) => {
  const at = join(src, dir);
  if (!existsSync(at)) return {};
  return merge(
    ...readdirSync(at, { recursive: true })
      .filter((f) => String(f).endsWith(".tokens.json"))
      .sort()
      .map((f) => JSON.parse(readFileSync(join(at, String(f)), "utf8"))),
  );
};
const primitives = readDir("primitive");
const semantics = readDir("semantic");
const components = readDir("component");

// The token at a dotted path, or undefined.
const tokenAt = (tree, path) => {
  const node = path
    .split(".")
    .reduce((n, p) => (isObject(n) ? n[p] : undefined), tree);
  return isObject(node) && "$value" in node ? node : undefined;
};
const paths = (tree, prefix = []) =>
  Object.entries(tree ?? {}).flatMap(([k, v]) =>
    k.startsWith("$") || !isObject(v)
      ? []
      : "$value" in v
        ? [[...prefix, k].join(".")]
        : paths(v, [...prefix, k]),
  );
// Only the semantic and component keys ship as CSS variables.
const ship = new Set([...paths(semantics), ...paths(components)]);

// A semantic key that depends on the brand or mode says {theme.<its path>}. The theme has the same
// paths, with a base (@) per concept that each mode decides. Point it at this brand and mode.
function pointAtTheme(tree, name, theme, mode) {
  const out = {};
  for (const [k, v] of Object.entries(tree)) {
    if (isObject(v) && "$value" in v) {
      const m =
        typeof v.$value === "string" && v.$value.match(/^\{theme\.([^}]+)\}$/);
      if (!m) out[k] = v;
      else {
        const part = tokenAt(theme.base, m[1]) ? "base" : mode;
        if (!tokenAt(theme[part], m[1]))
          throw new Error(
            `No theme key "${m[1]}" in tokens/src/theme for ${name} ${part}.`,
          );
        out[k] = { ...v, $value: `{${name}.theme.${part}.${m[1]}}` };
      }
    } else out[k] = isObject(v) ? pointAtTheme(v, name, theme, mode) : v;
  }
  return out;
}

// One theme: the primitives, this brand's theme for the mode, the semantics pointed at it, the component keys.
const themeTokens = (brand, mode) => {
  const { theme: name } = brands.find((b) => b.id === brand);
  const theme = read("theme", `${brand}.tokens.json`)[name].theme;
  const picked = {
    [name]: {
      theme: { ...(theme.base && { base: theme.base }), [mode]: theme[mode] },
    },
  };
  return merge(
    primitives,
    picked,
    pointAtTheme(semantics, name, theme, mode),
    components,
  );
};

function selectors(brand, mode) {
  const multi = brands.length > 1;
  const first = brands[0].id === brand;
  const b = `[data-brand="${brand}"]`;
  const base = mode === "light" ? [":root"] : [".dark"];
  if (!multi) return base;
  const withBrand =
    mode === "light"
      ? [`:root${b}`, b]
      : [`.dark${b}`, `.dark ${b}`, `${b} .dark`];
  return first ? [...base, ...withBrand] : withBrand;
}

async function format(tokens, platform) {
  const sd = new StyleDictionary({
    tokens,
    usesDtcg: true,
    log: { verbosity: "silent", warnings: "disabled" },
    platforms: {
      [platform.name]: { transforms: TRANSFORMS, files: [platform.file] },
    },
  });
  const [file] = await sd.formatPlatform(platform.name);
  return file.output;
}

const cssBlock = async (tokens, selector) =>
  (
    await format(tokens, {
      name: "css",
      file: {
        destination: "x.css",
        format: "css/variables",
        filter: (token) => ship.has(token.path.join(".")),
        options: { selector, outputReferences: outputReferencesFilter },
      },
    })
  ).replace(/^\/\*\*[\s\S]*?\*\/\n/, "");

const resolved = async (tokens) =>
  JSON.parse(
    await format(tokens, {
      name: "json",
      file: { destination: "x.json", format: "json/nested" },
    }),
  );

const themeCss = () =>
  [
    `/* ${name}: shadcn variables and a Tailwind v4 theme, mapped onto the semantics. Generated by tokens/build.mjs. */`,
    ":root,\n[data-brand],\n.dark {",
    ...Object.entries(SHADCN).map(([k, v]) => `  --${k}: var(--${v});`),
    "}",
    "",
    "@theme inline {",
    ...Object.keys(SHADCN)
      .filter((k) => k !== "radius")
      .map((k) => `  --color-${k}: var(--${k});`),
    ...ROLES.map(
      (r) =>
        `  --font-${r}: var(--type-${r}-font-family);\n  --text-${r}: var(--type-${r}-font-size);\n  --text-${r}--line-height: var(--type-${r}-line-height);\n  --text-${r}--font-weight: var(--type-${r}-font-weight);`,
    ),
    "}",
    "",
  ].join("\n");

// Docusaurus wears the design system: the default brand's tokens, light on :root and dark where
// Docusaurus sets data-theme="dark", and Infima's variables pointed at those tokens.
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

async function docusaurusCss(brand) {
  const light = await cssBlock(themeTokens(brand, "light"), ":root");
  const dark = await cssBlock(
    themeTokens(brand, "dark"),
    'html[data-theme="dark"]',
  );
  const infima = `:root,\nhtml[data-theme="dark"] {\n${Object.entries(INFIMA)
    .map(([k, v]) => `  ${k}: var(--${v});`)
    .join("\n")}\n}\n`;
  return `/* ${name}: the docs site in the design system's tokens. Generated by tokens/build.mjs. */\n${light}${dark}${infima}`;
}

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "json"), { recursive: true });
let css = `/* ${name} tokens. Generated by tokens/build.mjs from tokens/src. Brands: ${brands.map((b) => b.id).join(", ")}. Modes: light, dark (add the class "dark"). */\n`;
const json = {};
for (const theme of themes) {
  const tokens = themeTokens(theme.brand, theme.mode);
  css += await cssBlock(tokens, selectors(theme.brand, theme.mode).join(",\n"));
  json[theme.id] = await resolved(tokens);
  writeFileSync(
    join(out, "json", `${theme.id}.tokens.json`),
    JSON.stringify(json[theme.id], null, 2) + "\n",
  );
}
writeFileSync(join(out, "tokens.css"), css);
writeFileSync(join(out, "theme.css"), themeCss());
writeFileSync(
  join(out, "shadcn.css"),
  [
    `/* ${name}: shadcn/ui's radius, shadow and text scale, mapped onto the tokens. Generated by tokens/build.mjs. */`,
    "@theme inline {",
    ...Object.entries(SHADCN_SCALE).map(([k, v]) => `  ${k}: ${v};`),
    "}",
    "",
  ].join("\n"),
);
if (existsSync(join(src, "content.tokens.json")))
  writeFileSync(
    join(out, "content.json"),
    JSON.stringify(read("content.tokens.json"), null, 2) + "\n",
  );
writeFileSync(join(out, "docusaurus.css"), await docusaurusCss(brands[0].id));
console.log(
  `Built ${name}: ${themes.length} themes into build/ (${readdirSync(out).join(", ")}).`,
);
