import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { consentScript } from "../../scripts/consent.mjs";

// Google Tag Manager, only with consent, the same choice as the website's (scripts/consent.mjs).
// Empty without NEXT_PUBLIC_GTM_ID at build time: no banner, nothing loads from Google.
const consent = consentScript();

const config: StorybookConfig = {
  stories: [
    "../stories/guide/introduction.stories.tsx",
    "../stories/guide/primitives.stories.tsx",
    "../stories/guide/foundations.stories.tsx",
    "../stories/*.stories.tsx",
  ],
  framework: { name: "@storybook/react-vite", options: {} },
  addons: ["@storybook/addon-docs"],
  core: { disableTelemetry: true },
  managerHead: (head) => (consent ? `${head}\n<script>${consent}</script>` : head),
  // The Open DS mark, for the sidebar brand (manager.ts).
  staticDirs: ["../static"],
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    // Smaller chunks: each scheme's JSON on its own (the toolbar loads every scheme), and the
    // component libraries in pieces under 400 kB, so no chunk passes Vite's 500 kB warning.
    config.build ??= {};
    // The one chunk left above 500 kB is Storybook's own pre-bundled runtime (about 800 kB), a single
    // file no splitting can break up. The limit sits just above it, so anything of ours that grows
    // past it still warns.
    config.build.chunkSizeWarningLimit = 850;
    config.build.rolldownOptions ??= {};
    // "use client" marks React Server Components boundaries. Storybook only runs in the browser, so
    // the note that bundling drops it says nothing here. Every other message still shows.
    const onLog = config.build.rolldownOptions.onLog;
    config.build.rolldownOptions.onLog = (level, log, handler) => {
      if (log.code === "MODULE_LEVEL_DIRECTIVE" && /use client/.test(log.message)) return;
      if (onLog) onLog(level, log, handler);
      else handler(level, log);
    };
    const output = config.build.rolldownOptions.output;
    config.build.rolldownOptions.output = {
      ...(Array.isArray(output) ? output[0] : output),
      codeSplitting: {
        groups: [
          {
            name: (id: string) => id.match(/schemes\/([a-z-]+)\.json$/)?.[1] ?? null,
            debugName: "schemes",
            test: /schemes\/[a-z-]+\.json$/,
            priority: 20,
          },
          { name: "libs", test: /node_modules/, maxSize: 400 * 1024, priority: 10 },
        ],
      },
    };
    return config;
  },
};

export default config;
