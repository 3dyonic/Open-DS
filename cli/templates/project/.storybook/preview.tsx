// Every story renders in a brand and a mode chosen in the toolbar.
// The switches set data-brand and the dark class on <html>; the tokens do the rest.
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import themes from "../tokens/themes.json";
import "../src/styles/index.css";
import ComponentDocs from "./component-docs.mdx";

const brands = themes.brands;

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
    <div className={`${context.viewMode === "docs" ? "" : "min-h-screen "}p-8 bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)]`}>
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
  initialGlobals: { mode: "light", brand: brands[0].id },
  // Every component's docs page uses the same template; the stories only show the component.
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", controls: { expanded: true }, docs: { page: ComponentDocs } },
};

export default preview;
