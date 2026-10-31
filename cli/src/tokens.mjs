// How a scheme's tokens fit together, shared by the token build, the CLI, the docs and the site.
//
//   primitive   raw options: color.<hue>.light.<step>, color.<hue>.dark.<step>, color.<hue>.$root,
//               then space, size, radius, border-width, font, shadow, duration, easing, opacity
//   theme       per brand: base (mode-free picks such as fonts and corners), light and dark.
//               Each key picks a primitive. Built as <theme>.theme.<mode>.<key>,
//               so CSS reads --<theme>-theme-light-color-action-primary.
//   semantic    the plain keys components read. A brand-dependent one says {theme.<key>}, and the
//               build points it at the active brand and mode's theme token.
//   component   component keys, which read semantics.

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

/** Deep-merges token trees. A token (an object with $value) replaces, it is never merged. */
export function mergeTokens(...trees) {
  const out = {};
  for (const tree of trees) {
    for (const [k, v] of Object.entries(tree ?? {})) {
      out[k] =
        isObject(v) && !("$value" in v) && isObject(out[k])
          ? mergeTokens(out[k], v)
          : v;
    }
  }
  return out;
}

/** The name a brand's theme tokens carry: the brand id, or the scheme id for a single brand called "default". */
export const themeName = (schemeId, brand) =>
  brand === "default" ? schemeId : brand;

/** Rewrites {theme.<key>} in a token tree to the theme token of one brand and mode. */
function pointAtTheme(tree, name, theme, mode) {
  const out = {};
  for (const [k, v] of Object.entries(tree ?? {})) {
    if (isObject(v) && "$value" in v) {
      const m =
        typeof v.$value === "string" && v.$value.match(/^\{theme\.([^}]+)\}$/);
      if (!m) out[k] = v;
      else {
        const key = m[1];
        const part = theme.base && key in theme.base ? "base" : mode;
        if (!theme[part] || !(key in theme[part]))
          throw new Error(`No theme key "${key}" in ${name} ${part}.`);
        out[k] = { ...v, $value: `{${name}.theme.${part}.${key}}` };
      }
    } else out[k] = isObject(v) ? pointAtTheme(v, name, theme, mode) : v;
  }
  return out;
}

/** The full token tree for one brand and mode: primitives, that brand's theme, semantics pointed at it, components. */
export function themeTokens(scheme, brand, mode) {
  const t = scheme.tokens;
  const theme = t.brands[brand].theme;
  const name = themeName(scheme.id, brand);
  const themeTree = {
    [name]: {
      theme: { ...(theme.base && { base: theme.base }), [mode]: theme[mode] },
    },
  };
  return mergeTokens(
    t.primitive,
    themeTree,
    pointAtTheme(t.semantic, name, theme, mode),
    t.component,
  );
}

/** The semantic tree in one mode, each {theme.key} replaced by what a brand's theme picks (the first brand by default). */
export function semanticView(
  scheme,
  mode = "light",
  brand = Object.keys(scheme.tokens.brands)[0],
) {
  const theme = scheme.tokens.brands[brand].theme;
  const walk = (node) =>
    Object.fromEntries(
      Object.entries(node ?? {}).map(([k, v]) => {
        if (isObject(v) && "$value" in v) {
          const m =
            typeof v.$value === "string" &&
            v.$value.match(/^\{theme\.([^}]+)\}$/);
          const pick = m && (theme.base?.[m[1]] ?? theme[mode]?.[m[1]]);
          return [k, pick ? { ...v, $value: pick.$value } : v];
        }
        return [k, isObject(v) ? walk(v) : v];
      }),
    );
  return walk(scheme.tokens.semantic);
}
