#!/usr/bin/env node
// Builds every scheme in schemes/ with Style Dictionary.
//
// For each scheme it writes tokens/dist/<scheme>/:
//   tokens.css         the semantic and component keys as CSS variables, one block per brand and mode,
//                      on :root. Primitives and themes are resolved to values and never ship.
//   tokens.scoped.css  the same, scoped to [data-scheme="<scheme>"] so many schemes can share a page
//   theme.css          shadcn's variables and a Tailwind v4 @theme, mapped onto our semantics
//   shadcn.css         shadcn's radius, shadow and text scale, mapped onto the scheme's tokens
//   <theme>.tokens.json  the resolved DTCG tokens for one brand and mode
//   tokens.json        the default theme (first brand, light) as DTCG
//   content.json       the voice scope's tokens: words for common actions, as DTCG strings
// and tokens/dist/index.json, a list of schemes, brands and themes.

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import { outputReferencesFilter } from "style-dictionary/utils";
import { publicPaths, themeTokens } from "../cli/src/tokens.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(here, "dist");

// The values in the schemes are already valid CSS, so only naming and composite transforms run.
const TRANSFORMS = ["attribute/cti", "name/kebab", "fontFamily/css", "cubicBezier/css", "shadow/css/shorthand"];

// shadcn reads these variables. Each points at one of our semantic decisions.
export const SHADCN = {
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

// shadcn's radius, shadow and text classes, mapped onto the scheme's tokens. Written to shadcn.css,
// which apps and Storybook load and the Open DS site does not, so the site keeps its own scale.
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

export const shadcnCss = (name) =>
  [
    `/* ${name}: shadcn/ui's radius, shadow and text scale, mapped onto the scheme's tokens. Generated. */`,
    "@theme inline {",
    ...Object.entries(SHADCN_SCALE).map(([k, v]) => `  ${k}: ${v};`),
    "}",
    "",
  ].join("\n");

// One engine with the CLI and the site: primitives, the brand's theme, semantics, components.
export { themeTokens } from "../cli/src/tokens.mjs";

function selectors(schemeId, brands, brand, mode, scoped) {
  const first = brands[0] === brand;
  const multi = brands.length > 1;
  const base = scoped ? `[data-scheme="${schemeId}"]` : ":root";
  const b = multi ? `[data-brand="${brand}"]` : "";
  if (mode === "light") {
    if (!multi) return [base];
    return first ? [base, `${base}${b}`, `${base} ${b}`] : [`${base}${b}`, `${base} ${b}`];
  }
  const dark = scoped ? [`.dark ${base}`, `${base}.dark`, `${base} .dark`] : [".dark"];
  if (!multi) return dark;
  const withBrand = dark.flatMap((d) => [`${d}${b}`, `${d} ${b}`, `${b} ${d}`]);
  return first ? [...dark, ...withBrand] : withBrand;
}

// Only what consumers use ships: semantic and component keys. A reference to another public key
// stays a var(); a reference to a primitive or theme token is resolved to its value.
async function cssBlock(tokens, selector, ship) {
  const sd = new StyleDictionary({
    tokens,
    usesDtcg: true,
    log: { verbosity: "silent", warnings: "disabled" },
    platforms: {
      css: {
        transforms: TRANSFORMS,
        files: [
          {
            destination: "x.css",
            format: "css/variables",
            filter: (token) => ship.has(token.path.join(".")),
            options: { selector, outputReferences: outputReferencesFilter },
          },
        ],
      },
    },
  });
  const [file] = await sd.formatPlatform("css");
  return file.output.replace(/^\/\*\*[\s\S]*?\*\/\n/, "");
}

async function resolvedJson(tokens) {
  const sd = new StyleDictionary({
    tokens,
    usesDtcg: true,
    log: { verbosity: "silent", warnings: "disabled" },
    platforms: {
      json: { transforms: TRANSFORMS, files: [{ destination: "x.json", format: "json/nested" }] },
    },
  });
  const [file] = await sd.formatPlatform("json");
  return JSON.parse(file.output);
}

function themeCss(scheme) {
  const lines = [
    `/* ${scheme.name}: shadcn variables and a Tailwind v4 theme, mapped onto Open DS semantics. Generated. */`,
    "/* Set on every element that can change brand, mode or scheme, so var() resolves there. */",
    ":root,\n[data-scheme],\n[data-brand],\n.dark {",
    ...Object.entries(SHADCN).map(([k, v]) => `  --${k}: var(--${v});`),
    "}",
    "",
    "@theme inline {",
    ...Object.keys(SHADCN)
      .filter((k) => k !== "radius")
      .map((k) => `  --color-${k}: var(--${k});`),
    ...["display", "title", "heading", "body", "label", "caption", "data"].map(
      (r) =>
        `  --font-${r}: var(--type-${r}-font-family);\n  --text-${r}: var(--type-${r}-font-size);\n  --text-${r}--line-height: var(--type-${r}-line-height);\n  --text-${r}--font-weight: var(--type-${r}-font-weight);`,
    ),
    "}",
    "",
  ];
  return lines.join("\n");
}

export async function buildScheme(scheme) {
  const out = join(dist, scheme.id);
  mkdirSync(out, { recursive: true });
  const brands = Object.keys(scheme.tokens.brands);
  const header = (scoped) =>
    `/* ${scheme.name} (${scheme.id}) tokens. Generated by tokens/build.mjs from schemes/${scheme.id}.json. Brands: ${brands.join(", ")}. Modes: light, dark (add class "dark").${scoped ? ` Scoped to [data-scheme="${scheme.id}"].` : ""} */\n`;
  let css = header(false);
  let scopedCss = header(true);
  const ship = publicPaths(scheme);
  for (const theme of scheme.themes) {
    const tokens = themeTokens(scheme, theme.brand, theme.mode);
    css += await cssBlock(tokens, selectors(scheme.id, brands, theme.brand, theme.mode, false).join(",\n"), ship);
    scopedCss += await cssBlock(tokens, selectors(scheme.id, brands, theme.brand, theme.mode, true).join(",\n"), ship);
    writeFileSync(join(out, `${theme.id}.tokens.json`), JSON.stringify(await resolvedJson(tokens), null, 2) + "\n");
  }
  writeFileSync(join(out, "tokens.css"), css);
  writeFileSync(join(out, "tokens.scoped.css"), scopedCss);
  writeFileSync(join(out, "theme.css"), themeCss(scheme));
  writeFileSync(join(out, "shadcn.css"), shadcnCss(scheme.name));
  const first = scheme.themes[0];
  writeFileSync(join(out, "tokens.json"), JSON.stringify(themeTokens(scheme, first.brand, first.mode), null, 2) + "\n");
  writeFileSync(join(out, "content.json"), JSON.stringify({ content: scheme.tokens.content }, null, 2) + "\n");
  return {
    id: scheme.id,
    name: scheme.name,
    brands: brands.map((b) => ({ id: b, label: scheme.tokens.brands[b].label })),
    themes: scheme.themes,
  };
}

export async function buildAll() {
  rmSync(dist, { recursive: true, force: true });
  const ids = readdirSync(join(root, "schemes"))
    .filter((f) => f.endsWith(".json") && f !== "grammar.json")
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  const index = [];
  for (const id of ids)
    index.push(await buildScheme(JSON.parse(readFileSync(join(root, "schemes", `${id}.json`), "utf8"))));
  writeFileSync(join(dist, "shadcn-map.json"), JSON.stringify(SHADCN, null, 2) + "\n");
  writeFileSync(
    join(dist, "index.json"),
    JSON.stringify(
      {
        description:
          "Built Open DS schemes. Each has tokens.css, tokens.scoped.css, theme.css and DTCG JSON per theme.",
        schemes: index,
      },
      null,
      2,
    ) + "\n",
  );
  return index;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const index = await buildAll();
  console.log(`Built ${index.length} schemes: ${index.map((s) => `${s.id} (${s.themes.length} themes)`).join(", ")}`);
}
