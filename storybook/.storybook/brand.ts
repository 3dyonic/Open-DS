// The Open DS brand, once: the site's paper, ink and orange, light and dark. Storybook's frame
// (manager.ts) and the Open DS introduction (storybook.css, through --od-* variables that preview.tsx
// writes) both read it, so a color changes in one place.
export const BRAND = {
  light: { paper: "#f6f2e9", surface: "#ffffff", ink: "#16140f", muted: "#645e50", line: "#cfc6b4", accent: "#b93a00" },
  dark: { paper: "#1b1914", surface: "#24211b", ink: "#f1ebdd", muted: "#a59c89", line: "#3d382f", accent: "#ff9a70" },
};

/** The brand as CSS variables: --od-paper and the rest, light on :root and dark under .dark. */
export const brandCss = () =>
  (["light", "dark"] as const)
    .map(
      (mode) =>
        `${mode === "light" ? ":root" : ".dark"}{${Object.entries(BRAND[mode])
          .map(([k, v]) => `--od-${k}:${v}`)
          .join(";")}}`,
    )
    .join("\n");
