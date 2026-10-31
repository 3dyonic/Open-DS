import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { readFileSync } from "node:fs";
import { themes as prismThemes } from "prism-react-renderer";

// These are the docs of one delivered design system: the scheme that scripts/generate.mjs wrote
// (OPEN_DS_SCHEME, or dense-data). No public URL yet, so the site is local only. The site wears the
// system: src/css/scheme.css holds its tokens, and static/logo*.svg the Open DS mark in its colours.
// The branding matches the docs the CLI's project template writes (cli/templates/project/docs).
const scheme = JSON.parse(readFileSync(new URL("./scheme.json", import.meta.url), "utf8")) as {
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
  baseUrl: "/",
  favicon: "logo.svg",
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
      title: `Open DS · ${scheme.name}`,
      logo: { src: "logo.svg", srcDark: "logo-dark.svg", alt: "Open DS" },
      items: [
        { type: "html", position: "left", value: '<span class="ods-docs-tag">Docs</span>' },
        { href: STORYBOOK, label: "Storybook", position: "right" },
        { href: "pathname:///llms.txt", label: "llms.txt", position: "right" },
      ],
    },
    footer: {
      style: "light",
      copyright: `Open DS · ${scheme.name} docs. ${scheme.name} is a design system built from the Open DS scheme ${scheme.id} ${scheme.version}. MIT.`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
