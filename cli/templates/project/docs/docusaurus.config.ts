import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { readFileSync } from "node:fs";
import { themes as prismThemes } from "prism-react-renderer";

// The docs of this design system. The pages in docs/docs come from its scheme (scheme.json).
// The site wears the system: build/docusaurus.css holds its tokens, and build/brand/ (npm run
// tokens) holds the Open DS mark in the system's own colours, served as the logo and favicon.
const scheme = JSON.parse(
  readFileSync(new URL("../scheme.json", import.meta.url), "utf8"),
) as {
  id: string;
  name: string;
  version: string;
  summary: string;
};
const STORYBOOK = process.env.STORYBOOK_URL ?? "http://localhost:6006";

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
  presets: [
    [
      "classic",
      {
        docs: { routeBasePath: "/", sidebarPath: "./sidebars.ts" },
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    // The top bar wears the design system (OD-182): its name, then its sections, with Open DS as
    // the maker on the right.
    navbar: {
      title: scheme.name,
      logo: { src: "logo.svg", srcDark: "logo-dark.svg", alt: scheme.name },
      items: [
        {
          type: "html",
          position: "left",
          value: `<span class="ods-docs-tag">v${scheme.version}</span>`,
        },
        {
          type: "doc",
          docId: "foundations/index",
          label: "Foundations",
          position: "left",
        },
        {
          type: "doc",
          docId: "primitives/index",
          label: "Primitives",
          position: "left",
        },
        {
          type: "doc",
          docId: "components/inventory",
          label: "Components",
          position: "left",
        },
        { type: "doc", docId: "voice", label: "Voice", position: "left" },
        { type: "doc", docId: "themes", label: "Themes", position: "left" },
        { type: "doc", docId: "agents", label: "For agents", position: "left" },
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
