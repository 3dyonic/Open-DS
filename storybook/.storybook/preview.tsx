// Every story renders inside a scheme, a brand and a mode chosen in the toolbar.
// The switches set data-scheme, data-brand and the dark class; the tokens do the rest.
import type { Decorator, Preview } from "@storybook/react-vite";
import { SchemeContext, THEMES } from "../src/scheme-context";
import "../src/storybook.css";

const withScheme: Decorator = (Story, context) => {
  const [scheme, brand] = String(context.globals.scheme ?? "dense-data").split("--");
  const mode = context.globals.mode === "dark" ? "dark" : "light";
  return (
    <SchemeContext.Provider value={{ scheme, brand, mode }}>
      <div
        data-scheme={scheme}
        data-brand={brand}
        className={`${mode === "dark" ? "dark " : ""}min-h-screen p-8 bg-[var(--color-surface-canvas)] text-[var(--color-text-primary)] [font-family:var(--type-body-font-family)]`}
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
  parameters: { layout: "fullscreen", controls: { expanded: true } },
};

export default preview;
