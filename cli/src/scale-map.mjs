// Which semantic tokens land on each primitive color step. The scale view in the docs and the
// Storybook guide reads this: for a brand and mode, every color semantic followed through the theme and
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

/** Follow one semantic color to its primitive in a brand and mode: { prim, via } or null. */
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
 * Every color semantic in one brand and mode, by the primitive step it ends at:
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

/**
 * The scales of a scheme, for the CLI (`open-ds scales`) and the MCP (`get_scales`): for a brand and
 * mode, each hue's steps with their values and the tokens that land on each, by lane, plus the tokens
 * whose color is fixed from the other mode's scale. Filter by hue to get one.
 */
export function scales(
  scheme,
  { brand, mode = "light", hue, hints = [] } = {},
) {
  const t = scheme.tokens;
  const brandKey = brand ?? Object.keys(t.brands)[0];
  if (!t.brands[brandKey])
    throw new Error(
      `No brand ${brandKey} in ${scheme.id}. Brands: ${Object.keys(t.brands).join(", ")}.`,
    );
  if (mode !== "light" && mode !== "dark")
    throw new Error("mode is light or dark.");
  const map = scaleMap(t, brandKey, mode);
  const value = (p) => get(t.primitive, p)?.$value ?? null;
  const hues = Object.keys(t.primitive?.color ?? {}).filter(
    (h) => !h.startsWith("$") && (!hue || h === hue),
  );
  if (hue && !hues.length) throw new Error(`No hue ${hue} in ${scheme.id}.`);
  const land = (list) =>
    list.map((x) => ({ token: x.token, lane: laneOf(x.token), via: x.via }));
  return {
    scheme: scheme.id,
    brand: brandKey,
    mode,
    neutral: t.brands[brandKey].theme.neutral ?? null,
    lanes: LANES,
    hints,
    hues: hues
      .filter((h) => t.primitive.color[h][mode])
      .map((h) => {
        const ramp = t.primitive.color[h][mode];
        const steps = Object.keys(ramp)
          .filter((k) => !k.startsWith("$"))
          .map((st) => {
            const prim = `color.${h}.${mode}.${st}`;
            return {
              step: st,
              primitive: prim,
              value: value(prim),
              tokens: land(map[prim] ?? []),
            };
          });
        const other = mode === "light" ? "dark" : "light";
        const fixed = Object.entries(map)
          .filter(([p]) => p.startsWith(`color.${h}.${other}.`))
          .flatMap(([p, list]) =>
            land(list).map((x) => ({ ...x, primitive: p, value: value(p) })),
          );
        return {
          hue: h,
          used: steps.filter((s) => s.tokens.length).length,
          steps,
          fixed,
        };
      }),
  };
}
