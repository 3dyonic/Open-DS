// Which semantic tokens land on each primitive colour step (OD-223). The scale view in the docs and the
// Storybook guide reads this: for a brand and mode, every colour semantic followed through the theme and
// the neutral scale to the primitive step it ends at.

const REF = /^\{([^}]+)\}$/;
const PRIM = /^color\.([a-z-]+)\.(light|dark)\.([a-z0-9-]+)$/;
const get = (o, p) => p.split(".").reduce((n, k) => n && n[k], o);
const refOf = (v) => (typeof v === "string" && v.match(REF)?.[1]) || null;

function leaves(node, path = []) {
  if (!node || typeof node !== "object") return [];
  if ("$value" in node) return [{ path: path.join("."), value: node.$value }];
  return Object.entries(node)
    .filter(([k]) => !k.startsWith("$"))
    .flatMap(([k, v]) => leaves(v, [...path, k]));
}

/** The lane a token sits in on the scale view: what it paints. */
export function laneOf(token) {
  const parts = token.split(".");
  if (parts.includes("text")) return "text";
  if (parts.includes("border") || /^status\.[a-z]+$/.test(token)) return "edge";
  return "fill";
}
export const LANES = [
  { id: "fill", title: "Backgrounds" },
  { id: "edge", title: "Edges and rings" },
  { id: "text", title: "Text" },
];

/** Follow one semantic colour to its primitive in a brand and mode: { prim, via } or null. */
export function follow(tokens, brandKey, mode, path) {
  const th = tokens.brands[brandKey].theme;
  const inTheme = (p) => (get(th[mode], p) ?? get(th.base ?? {}, p))?.$value;
  let r = refOf(get(tokens.semantic, path)?.$value);
  let via = null;
  for (let i = 0; r && i < 10; i++) {
    if (PRIM.test(r) && !r.startsWith("color.neutral."))
      return { prim: r, via };
    if (r.startsWith("theme.")) r = refOf(inTheme(r.slice(6)));
    else if (/^color\.neutral\.\d+$/.test(r)) {
      via ??= r;
      r = refOf(get(tokens.semantic, r)?.$value);
    } else r = refOf(get(tokens.semantic, r)?.$value);
  }
  return null;
}

/**
 * Every colour semantic in one brand and mode, by the primitive step it ends at:
 * { "color.violet.light.600": [{ token, via }] }. The neutral steps themselves are left out: they show as
 * the "via" of the roles that read them.
 */
export function scaleMap(tokens, brandKey, mode) {
  const out = {};
  for (const { path } of leaves(tokens.semantic)) {
    if (!path.startsWith("color.") || path.startsWith("color.neutral."))
      continue;
    const f = follow(tokens, brandKey, mode, path);
    if (!f) continue;
    (out[f.prim] ??= []).push({
      token: path.replace(/^color\./, "").replace(/\.@$/, ""),
      path,
      via: f.via && f.via.replace(/^color\./, ""),
    });
  }
  return out;
}
