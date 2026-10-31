// Storybook's own frame wears this design system: the Open DS mark in its colours, its name and a
// "Storybook" tag in the sidebar, its colours, radius and type, light or dark like the device.
// The theme comes from the tokens (build/brand/storybook-theme.json, written by npm run tokens).
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import brand from "../build/brand/storybook-theme.json";

const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const { brandName, brandLogo, ...colours } = dark ? brand.dark : brand.light;
const name = `${brandName} Storybook`;

// brandTitle may hold HTML; with no brandImage, Storybook shows it as the sidebar brand.
const tag = `font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:2px 6px;border-radius:${colours.inputBorderRadius}px;color:${colours.colorPrimary};border:1px solid ${colours.colorPrimary}`;
const brandTitle = `<span style="display:flex;align-items:center;gap:8px;font-family:${colours.fontBase.replaceAll('"', "'")}"><img src="${brandLogo}" alt="" style="height:16px;width:auto"/><span style="font-size:14px;font-weight:600;white-space:nowrap">${brandName}</span><span style="${tag}">Storybook</span></span>`;

addons.setConfig({
  theme: create({ ...colours, brandTitle, brandImage: undefined } as Parameters<
    typeof create
  >[0]),
});

// Browser tabs read "Components / Button - Docs · Open DS · Dense data Storybook".
const retitle = () => {
  const t = document.title;
  if (!t || t.endsWith(name)) return;
  const page = t.replace(/\s*[⋅·-]?\s*Storybook$/, "");
  document.title = page ? `${page} · ${name}` : name;
};
new MutationObserver(retitle).observe(
  document.querySelector("title") ?? document.head,
  {
    childList: true,
    subtree: true,
    characterData: true,
  },
);
retitle();
