// Storybook's own frame wears the Open DS brand (the site's paper, ink and orange, Bricolage
// Grotesque and DM Mono), light or dark like the device. This Storybook shows every scheme; each
// delivered design system's Storybook wears its own scheme (cli/templates/project/.storybook).
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const c = dark
  ? { paper: "#1b1914", surface: "#24211b", ink: "#f1ebdd", muted: "#a59c89", line: "#3d382f", accent: "#ff9a70" }
  : { paper: "#f6f2e9", surface: "#ffffff", ink: "#16140f", muted: "#645e50", line: "#cfc6b4", accent: "#b93a00" };
const name = "Open DS Storybook";
const tag = `font:500 11px 'DM Mono',monospace;letter-spacing:.04em;text-transform:uppercase;padding:2px 6px;border-radius:3px;color:${c.accent};border:1px solid ${c.accent}`;

addons.setConfig({
  theme: create({
    base: dark ? "dark" : "light",
    // brandTitle may hold HTML; with no brandImage, Storybook shows it as the sidebar brand.
    brandTitle: `<span style="display:flex;align-items:center;gap:8px"><img src="${dark ? "logo-dark.svg" : "logo.svg"}" alt="" style="height:16px;width:auto"/><span style="font:800 15px 'Bricolage Grotesque',sans-serif;white-space:nowrap">Open DS</span><span style="${tag}">All schemes</span></span>`,
    brandImage: undefined,
    colorPrimary: "#ff5a1f",
    colorSecondary: c.accent,
    appBg: c.paper,
    appContentBg: c.surface,
    appPreviewBg: c.paper,
    appBorderColor: c.line,
    appBorderRadius: 6,
    barBg: c.surface,
    barTextColor: c.muted,
    barSelectedColor: c.accent,
    textColor: c.ink,
    textMutedColor: c.muted,
    inputBg: c.surface,
    inputBorder: c.line,
    inputTextColor: c.ink,
    inputBorderRadius: 4,
    fontBase: "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
    fontCode: "'DM Mono', ui-monospace, monospace",
  }),
});

// Browser tabs read "Components / Button - Docs · Open DS Storybook".
const retitle = () => {
  const t = document.title;
  if (!t || t.endsWith(name)) return;
  const page = t.replace(/\s*[⋅·-]?\s*Storybook$/, "");
  document.title = page ? `${page} · ${name}` : name;
};
new MutationObserver(retitle).observe(document.querySelector("title") ?? document.head, {
  childList: true,
  subtree: true,
  characterData: true,
});
retitle();
