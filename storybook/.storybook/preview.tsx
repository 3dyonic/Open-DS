// Every story renders inside a scheme, a brand and a mode chosen in the toolbar.
// The switches set data-scheme, data-brand and the dark class; the tokens do the rest.
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";
import { SchemeContext, THEMES } from "../src/scheme-context";
import "../src/storybook.css";
import ComponentDocs from "./component-docs.mdx";

const KNOWN = new Set(THEMES.map((t) => t.value.split("--")[0]));

const withScheme: Decorator = (Story, context) => {
  const [chosen, brand] = String(context.globals.scheme ?? "dense-data").split("--");
  const scheme = KNOWN.has(chosen) ? chosen : "dense-data";
  const mode = context.globals.mode === "dark" ? "dark" : "light";
  // Dialogs, menus, selects and tooltips render in a portal on <body>, outside the wrapper.
  // Setting the scheme on <html> as well gives them the same tokens.
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.scheme = scheme;
    if (brand) html.dataset.brand = brand;
    else delete html.dataset.brand;
    html.classList.toggle("dark", mode === "dark");
  }, [scheme, brand, mode]);
  return (
    <SchemeContext.Provider value={{ scheme, brand, mode }}>
      <div
        data-scheme={scheme}
        data-brand={brand}
        className={`${mode === "dark" ? "dark " : ""}${context.viewMode === "docs" ? "" : "min-h-screen "}p-8 bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)]`}
      >
        <Story />
      </div>
    </SchemeContext.Provider>
  );
};

const preview: Preview = {
  decorators: [withScheme],
  globalTypes: {
    scheme: {
      description: "Open DS scheme (and brand)",
      toolbar: { title: "Scheme", icon: "paintbrush", dynamicTitle: true, items: THEMES },
    },
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
  },
  initialGlobals: { scheme: "dense-data", mode: "light" },
  // Every component's docs page uses the same template; the stories only show the component.
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", controls: { expanded: true }, docs: { page: ComponentDocs } },
};

export default preview;
