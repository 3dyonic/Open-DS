import type { Config } from "@docusaurus/types";
import composites from "./src/remark/composites.mjs";
import type * as Preset from "@docusaurus/preset-classic";
import { readFileSync } from "node:fs";
import { themes as prismThemes } from "prism-react-renderer";
import { consentScript } from "../scripts/consent.mjs";
import { decisionMenu } from "./src/decisionMenu";

// The repo's docs: every Open DS scheme in one site (OD-207), the way the repo Storybook shows every
// scheme. scripts/generate.mjs writes docs/<scheme>/ for each one, its tokens scoped to its own pages
// (src/css/schemes/), and schemes.json, which the switcher and the landing page read. No public URL
// A created project's docs stay one scheme.
type Scheme = { id: string; name: string; version: string; summary: string; brands: string[] };
const schemes = JSON.parse(readFileSync(new URL("./schemes.json", import.meta.url), "utf8")) as Scheme[];
const STORYBOOK = process.env.STORYBOOK_URL ?? "http://localhost:6006";
// Where the site lives (OD-210): "/" locally, "/docs/" on open-ds.dev, next to /storybook/.
const BASE = process.env.DOCS_BASE_URL ?? "/";
// The generated pages write images from docs/static as root paths (/anatomy/…), and Docusaurus does
// not rewrite paths in raw HTML. Under a base URL (open-ds.dev serves the docs at /docs/) those would
// miss, so every root-relative image gets the base in front: as an element, as a JSX element, or
// still as raw HTML. Paths that already start with the base are left alone.
function rehypeBaseUrlImages({ base }: { base: string }) {
  const prefix = base.replace(/\/$/, "");
  const fix = (src: unknown) =>
    typeof src === "string" && prefix && src.startsWith("/") && !src.startsWith("//") && !src.startsWith(`${prefix}/`)
      ? prefix + src
      : src;
  type Node = {
    type: string;
    tagName?: string;
    name?: string;
    value?: string;
    properties?: Record<string, unknown>;
    attributes?: { name?: string; value?: unknown }[];
    children?: Node[];
  };
  return (tree: Node) => {
    const walk = (n: Node) => {
      if (n.type === "element" && n.tagName === "img" && n.properties) n.properties.src = fix(n.properties.src);
      if ((n.type === "mdxJsxFlowElement" || n.type === "mdxJsxTextElement") && n.name === "img")
        for (const a of n.attributes ?? []) if (a.name === "src") a.value = fix(a.value);
      if (n.type === "raw" && typeof n.value === "string" && prefix)
        n.value = n.value.replace(/(<img\b[^>]*?\bsrc=")(\/[^"]*)/g, (m, a: string, src: string) => `${a}${fix(src)}`);
      for (const c of n.children ?? []) walk(c);
    };
    walk(tree);
  };
}
const ids = JSON.stringify(schemes.map((s) => s.id));
// Google Tag Manager, only with consent, the same choice as the website's (scripts/consent.mjs).
// Empty without NEXT_PUBLIC_GTM_ID at build time: no banner, nothing loads from Google.
const consent = consentScript();

const config: Config = {
  title: "Open DS docs",
  titleDelimiter: "·",
  tagline: "Every design system is a set of answers.",
  url: process.env.DOCS_URL ?? "http://localhost",
  baseUrl: BASE,
  favicon: "logo.svg",
  onBrokenLinks: "throw",
  markdown: { format: "detect", hooks: { onBrokenMarkdownLinks: "throw" } },
  // Docusaurus Faster (OD-250): Rspack, SWC and Lightning CSS in place of webpack, Babel and Terser,
  // and each MDX page compiled once for the client and the server. The ~800 generated pages ran
  // the webpack build out of memory. Static pages render on the main thread: worker threads were
  // slower here and used more memory, and they need a v4 flag. The v4 flags stay off, and git
  // history is read the way it was before (no last-update dates are shown).
  future: {
    faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
      rspackBundler: true,
      rspackPersistentCache: true,
      ssgWorkerThreads: false,
      gitEagerVcs: false,
    },
  },
  i18n: { defaultLocale: "en", locales: ["en"] },
  customFields: { schemes, storybook: STORYBOOK },
  // Sets the scheme (and the multi-brand brand) on <html> before the first paint, so a page never
  // flashes in another scheme's colors. clientModules/scheme.ts keeps it right as you navigate.
  headTags: [
    {
      tagName: "script",
      attributes: {},
      innerHTML: `(function(){var s=${ids},p=location.pathname.slice(${BASE.length}).split("/")[0],h=document.documentElement;if(s.indexOf(p)>=0)h.setAttribute("data-scheme",p);try{h.setAttribute("data-brand",localStorage.getItem("open-ds-brand")||"aster")}catch(e){h.setAttribute("data-brand","aster")}})();`,
    },
    ...(consent ? [{ tagName: "script", attributes: {}, innerHTML: consent }] : []),
  ],
  clientModules: [
    "./src/clientModules/scheme.ts",
    "./src/clientModules/embed-mode.ts",
    "./src/clientModules/scales.ts",
  ],
  // OD-284 step 0: Tailwind 4 for the design system components the docs render (no reset; see tailwind.css).
  plugins: [
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
          sidebarItemsGenerator: decisionMenu(BASE),
          rehypePlugins: [[rehypeBaseUrlImages, { base: BASE }]],
          remarkPlugins: [composites],
        },
        blog: false,
        theme: { customCss: ["./src/css/tailwind.css", "./src/css/custom.css"] },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    colorMode: { respectPrefersColorScheme: true },
    // The top bar: the brand, then the switcher on the right. A scheme's sections live in its sidebar (OD-216).
    navbar: {
      title: "Open DS docs",
      logo: { src: "logo.svg", alt: "Open DS" },
      items: [
        { type: "custom-schemeSwitcher", position: "right" },
        { href: STORYBOOK, label: "Storybook", position: "right" },
      ],
    },
    footer: {
      style: "light",
      copyright: `Open DS docs: every scheme, each as the design system it builds. MIT.${consent ? ' <a href="#cookie-settings">Cookie settings</a>' : ""}`,
    },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;
