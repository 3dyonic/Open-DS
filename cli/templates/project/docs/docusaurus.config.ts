import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { readFileSync } from "node:fs";
import { themes as prismThemes } from "prism-react-renderer";
import { decisionMenu } from "./src/decisionMenu";
import composites from "./src/remark/composites.mjs";

// The docs of this design system. The pages in docs/docs come from its scheme (scheme.json).
// The site wears the system: build/docusaurus.css holds its tokens, and build/brand/ (npm run
// tokens) holds the Open DS mark in the system's own colors, served as the logo and favicon.
const scheme = JSON.parse(
  readFileSync(new URL("../scheme.json", import.meta.url), "utf8"),
) as {
  id: string;
  name: string;
  version: string;
  summary: string;
};
const STORYBOOK = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

const config: Config = {
  // Browser tabs read "Page · Dense data docs · Open DS".
  title: `${scheme.name} docs · Open DS`,
  titleDelimiter: "·",
  tagline: scheme.summary,
  url: "http://localhost",
  baseUrl: process.env.DOCS_BASE_URL ?? "/",
  favicon: "logo.svg",
  staticDirectories: ["static", "../build/brand"],
  onBrokenLinks: "throw",
  markdown: { format: "detect", hooks: { onBrokenMarkdownLinks: "throw" } },
  i18n: { defaultLocale: "en", locales: ["en"] },
  // Lightning CSS minifies the scheme's CSS: the default minifier cannot read radius.pill's
  // calc(infinity * 1px) and warns on it (OD-286). The Open DS docs use the same minifier.
  future: { faster: { lightningCssMinimizer: true } },
  // The live Storybook embeds follow the docs theme (OD-213).
  clientModules: [
    "./src/clientModules/embed-mode.ts",
    "./src/clientModules/scales.ts",
  ],
  plugins: [
    // Tailwind 4 compiles the classes the pages' composites use (src/css/tailwind.css).
    () => ({
      name: "tailwind",
      configurePostCss(options) {
        options.plugins.push(require("@tailwindcss/postcss"));
        return options;
      },
    }),
  ],
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          sidebarItemsGenerator: decisionMenu(process.env.DOCS_BASE_URL ?? "/"),
          // A directive in a page (::token-table{component="field"}) becomes the composite it names.
          remarkPlugins: [composites],
        },
        blog: false,
        theme: { customCss: ["./src/css/tailwind.css", "./src/css/custom.css"] },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    // The top bar wears the design system (OD-182): its name and version, with Storybook and Open DS
    // on the right. Its sections live in the sidebar, so the top bar does not repeat them (OD-216).
    navbar: {
      title: scheme.name,
      logo: { src: "logo.svg", srcDark: "logo-dark.svg", alt: scheme.name },
      items: [
        {
          type: "html",
          position: "left",
          value: `<span class="ods-docs-tag">v${scheme.version}</span>`,
        },
        { href: STORYBOOK, label: "Storybook", position: "right" },
        { href: "pathname:///llms.txt", label: "llms.txt", position: "right" },
        {
          type: "html",
          position: "right",
          value: '<span class="ods-built">Built with Open DS</span>',
        },
      ],
    },
    footer: {
      style: "light",
      copyright: `Open DS · ${scheme.name} docs. ${scheme.name} is a design system built from the Open DS scheme ${scheme.id} ${scheme.version}.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
