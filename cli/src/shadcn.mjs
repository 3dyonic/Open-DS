// What shadcn/ui reads, and which of the scheme's tokens each one points at (OD-215). The token build
// writes theme.css and shadcn.css from these; the docs read them to show each component's tokens.
// A created project's tokens/build.mjs carries a copy (the harness keeps it equal).

// shadcn reads these variables. Each points at one of our semantic decisions.
export const SHADCN = {
  background: "color-surface-canvas",
  foreground: "color-text-primary",
  card: "color-surface-default",
  "card-foreground": "color-text-primary",
  popover: "color-surface-raised",
  "popover-foreground": "color-text-primary",
  primary: "color-action-primary",
  "primary-foreground": "color-text-on-action",
  secondary: "color-action-secondary",
  "secondary-foreground": "color-text-primary",
  muted: "color-surface-sunken",
  "muted-foreground": "color-text-muted",
  accent: "color-surface-sunken",
  "accent-foreground": "color-text-primary",
  destructive: "color-status-danger",
  border: "color-border-default",
  input: "color-border-strong",
  ring: "color-border-focus",
  radius: "radius-control",
  // The sidebar and charts from shadcn/ui.
  sidebar: "color-surface-default",
  "sidebar-foreground": "color-text-primary",
  "sidebar-primary": "color-action-primary",
  "sidebar-primary-foreground": "color-text-on-action",
  "sidebar-accent": "color-surface-sunken",
  "sidebar-accent-foreground": "color-text-primary",
  "sidebar-border": "color-border-default",
  "sidebar-ring": "color-border-focus",
  // Chart series use the category colors: distinct hues that carry no meaning, so no series reads as an error.
  "chart-1": "color-category-1",
  "chart-2": "color-category-2",
  "chart-3": "color-category-3",
  "chart-4": "color-category-4",
  "chart-5": "color-category-5",
};

// shadcn's radius, shadow and text classes, mapped onto the scheme's tokens. Written to shadcn.css,
// which apps and Storybook load and the Open DS site does not, so the site keeps its own scale.
export const SHADCN_SCALE = {
  "--radius-xs": "var(--radius-badge)",
  "--radius-sm": "var(--radius-badge)",
  "--radius-md": "var(--radius-control)",
  "--radius-lg": "var(--radius-container)",
  "--radius-xl": "var(--radius-container)",
  "--shadow-xs": "var(--elevation-card)",
  "--shadow-sm": "var(--elevation-card)",
  "--shadow-md": "var(--elevation-overlay)",
  "--shadow-lg": "var(--elevation-overlay)",
  "--shadow-xl": "var(--elevation-overlay)",
  "--text-xs": "var(--type-caption-font-size)",
  "--text-xs--line-height": "var(--type-caption-line-height)",
  "--text-sm": "var(--type-body-font-size)",
  "--text-sm--line-height": "var(--type-body-line-height)",
  "--text-base": "var(--type-body-font-size)",
  "--text-base--line-height": "var(--type-body-line-height)",
  "--text-lg": "var(--type-heading-font-size)",
  "--text-lg--line-height": "var(--type-heading-line-height)",
};

// OD-235: named spacing utilities from the scheme's spacing, so code writes gap-section or p-container
// and follows the scheme. Tailwind v4 makes p-*, m-*, gap-* and the rest from every --spacing-* theme
// variable. Layout roles take their last name (gap.section → section, inset.control-x → control); the
// component spacing map's steps take map-<step> (map-x6, map-hairline).
export function spacingUtilities(scheme) {
  const out = [];
  const walk = (o, path) => {
    for (const [k, v] of Object.entries(o ?? {})) {
      if (k.startsWith("$")) continue;
      const p = [...path, k];
      if (v && typeof v === "object" && "$value" in v) out.push(p);
      else if (v && typeof v === "object") walk(v, p);
    }
  };
  walk(scheme.tokens.semantic.space, ["space"]);
  walk(scheme.tokens.semantic["component-spacing-map"], [
    "component-spacing-map",
  ]);
  return out.map((p) => {
    const name =
      p[0] === "space" ? p.at(-1).replace(/-x$/, "") : `map-${p.at(-1)}`;
    return [`--spacing-${name}`, `var(--${p.join("-")})`];
  });
}
