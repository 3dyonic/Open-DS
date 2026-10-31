// Every story renders in a brand and a mode chosen in the toolbar.
// The switches set data-brand and the dark class on <html>; the tokens do the rest.
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { create } from "storybook/theming";
import brand from "../build/brand/storybook-theme.json";
import themes from "../tokens/themes.json";
import "../src/styles/index.css";
import ComponentDocs from "./component-docs.mdx";

const brands = themes.brands;

// Start in the device's mode; the Mode switch in the toolbar changes it. The docs pages wear the
// same theme as Storybook's frame (build/brand/storybook-theme.json).
const deviceDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const {
  brandName: _name,
  brandLogo: _logo,
  ...docsTheme
} = deviceDark ? brand.dark : brand.light;

const withTheme: Decorator = (Story, context) => {
  const brand = String(context.globals.brand ?? brands[0].id);
  const mode = context.globals.mode === "dark" ? "dark" : "light";
  // Dialogs, menus, selects and tooltips render in a portal on <body>, so the theme goes on <html>.
  useEffect(() => {
    const html = document.documentElement;
    if (brands.length > 1) html.dataset.brand = brand;
    html.classList.toggle("dark", mode === "dark");
  }, [brand, mode]);
  return (
    <div
      className={`${context.viewMode === "docs" ? "" : "min-h-screen "}p-8 bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)]`}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    mode: {
      description: "Light or dark",
      toolbar: {
        title: "Mode",
        icon: "mirror",
        dynamicTitle: true,
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
    ...(brands.length > 1
      ? {
          brand: {
            description: "Brand",
            toolbar: {
              title: "Brand",
              icon: "paintbrush",
              dynamicTitle: true,
              items: brands.map((b) => ({ value: b.id, title: b.label })),
            },
          },
        }
      : {}),
  },
  initialGlobals: { mode: deviceDark ? "dark" : "light", brand: brands[0].id },
  // Every component's docs page uses the same template; the stories only show the component.
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
    docs: {
      page: ComponentDocs,
      theme: create(docsTheme as Parameters<typeof create>[0]),
    },
  },
};

export default preview;
