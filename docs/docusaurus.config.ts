import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { readFileSync } from "node:fs";
import { themes as prismThemes } from "prism-react-renderer";

// These are the docs of one delivered design system: the scheme that scripts/generate.mjs wrote
// (OPEN_DS_SCHEME, or dense-data). No public URL yet, so the site is local only.
const scheme = JSON.parse(readFileSync(new URL("./scheme.json", import.meta.url), "utf8")) as {
  id: string;
  name: string;
  summary: string;
};
const STORYBOOK = process.env.STORYBOOK_URL ?? "http://localhost:6006";

const config: Config = {
  title: scheme.name,
  tagline: scheme.summary,
  url: "http://localhost",
  baseUrl: "/",
  favicon: undefined,
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
    navbar: {
      title: scheme.name,
      items: [
        { type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" },
        { href: STORYBOOK, label: "Storybook", position: "right" },
        { href: "pathname:///llms.txt", label: "llms.txt", position: "right" },
      ],
    },
    footer: { style: "light", copyright: `${scheme.name}: a design system built from an Open DS scheme. MIT.` },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
