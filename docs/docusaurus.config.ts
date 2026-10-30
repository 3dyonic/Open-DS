import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { themes as prismThemes } from "prism-react-renderer";

// The product name is pending (see brand.json). No public URL yet, so the site is local only.
const config: Config = {
  title: "Open DS",
  tagline: "Every design system is a set of answers.",
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
      title: "Open DS",
      items: [
        { type: "docSidebar", sidebarId: "docs", position: "left", label: "Docs" },
        { href: "pathname:///llms.txt", label: "llms.txt", position: "right" },
        { href: "https://github.com/3dyonic/Open-DS", label: "GitHub", position: "right" },
      ],
    },
    footer: { style: "light", copyright: "Open DS. MIT. All scheme answers are drafts until curated." },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
