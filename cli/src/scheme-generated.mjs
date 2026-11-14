// A scheme stores the decisions behind its generated values, not the values (ADR-002 step 3b).
// A colored hue stores its key colors and adjustments; withGenerated fills its light and dark scales
//. The component spacing map stores its rhythm and fixed steps; withGenerated fills its steps
//. withoutGenerated takes out each part that equals the generator's output exactly. No file
// access, so the loader, the build and the bundled apps (Storybook, the site) share it.
import { curveOf } from "./color-steps.mjs";
import { scale, STEPS } from "./ramps.mjs";
import { mapTokens } from "./spacing-map.mjs";
import { themeTokens } from "./tokens.mjs";

const MODES = ["light", "dark"];
const spec = (node) => node?.$extensions?.["open-ds"];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** A hex color as the scales store it: #RRGGBB, upper case. */
const asHex = (v) => String(v ?? "").slice(0, 7).toUpperCase();

/** Follow {references} through flat DTCG tokens to a value. */
function valueAt(tree, path) {
  let node = path.split(".").reduce((n, k) => n?.[k], tree);
  for (let hops = 0; hops < 20; hops++) {
    const m = typeof node?.$value === "string" && node.$value.match(/^\{([^}]+)\}$/);
    if (!m) return node?.$value;
    node = m[1].split(".").reduce((n, k) => n?.[k], tree);
  }
  return undefined;
}

/** The dark canvas the dark scales start from: color.surface.canvas in the first brand's dark theme. */
export function darkCanvas(scheme) {
  const brand = Object.keys(scheme.tokens.brands)[0];
  const value = valueAt(themeTokens({ id: scheme.id, tokens: scheme.tokens }, brand, "dark"), "color.surface.canvas");
  if (!/^#[0-9a-f]{6}/i.test(String(value ?? "")))
    throw new Error(
      `${scheme.id}: color.surface.canvas in ${brand}/dark is not a color, so the dark scales cannot be generated. Point it at a neutral step.`,
    );
  return asHex(value);
}

/** One mode of a hue as the scheme holds it: { 50: { $type, $value }, … }. */
function scaleTokens(hueSpec, mode, canvas, curve = null) {
  const row = scale(hueSpec[mode], mode, canvas, curve);
  return Object.fromEntries(STEPS.map((st) => [st, { $type: "color", $value: row[st] }]));
}

/** The hue with its scales in place: light and dark sit before $extensions, as the scheme lists them. */
function hueWith(hue, scales) {
  const out = {};
  for (const [k, v] of Object.entries(hue)) {
    if (k === "$extensions") Object.assign(out, scales);
    out[k] = v;
  }
  return out;
}

/** The scheme with every generated part present. A part the file stores stays as stored. Does not change its input. */
export function withGenerated(scheme, { graded } = {}) {
  const t = scheme?.tokens;
  if (!t) return scheme;
  const colors = t.primitive?.color ?? {};
  const hues = Object.entries(colors).filter(([, g]) => spec(g) && MODES.some((m) => !g[m]));
  let color = colors;
  if (hues.length) {
    const canvas = darkCanvas(scheme);
    const curve = curveOf(scheme, graded);
    color = { ...colors };
    for (const [id, g] of hues) {
      const scales = Object.fromEntries(MODES.map((m) => [m, g[m] ?? scaleTokens(spec(g), m, canvas, curve)]));
      color[id] = hueWith(g, scales);
    }
  }
  const map = t.semantic?.["component-spacing-map"];
  const fillMap = spec(map) && !Object.keys(map).some((k) => !k.startsWith("$"));
  if (!hues.length && !fillMap) return scheme;
  return {
    ...scheme,
    tokens: {
      ...t,
      primitive: { ...t.primitive, color },
      semantic: fillMap ? { ...t.semantic, "component-spacing-map": { ...mapTokens(spec(map)).group, ...map } } : t.semantic,
    },
  };
}

/** The scheme as it is stored: each scale and spacing map that equals the generator's output is left out. */
export function withoutGenerated(scheme, { graded } = {}) {
  const t = scheme?.tokens;
  if (!t) return scheme;
  const primitive = { ...t.primitive };
  const hues = Object.entries(t.primitive?.color ?? {}).filter(([, g]) => spec(g));
  if (hues.length) {
    const canvas = darkCanvas(scheme);
    const curve = curveOf(scheme, graded);
    primitive.color = { ...t.primitive.color };
    for (const [id, g] of hues) {
      const hue = { ...g };
      for (const m of MODES) if (hue[m] && same(hue[m], scaleTokens(spec(g), m, canvas, curve))) delete hue[m];
      primitive.color[id] = hue;
    }
  }
  const semantic = { ...t.semantic };
  const map = t.semantic?.["component-spacing-map"];
  if (spec(map) && same(map, mapTokens(spec(map)).group)) semantic["component-spacing-map"] = { $extensions: map.$extensions };
  return { ...scheme, tokens: { ...t, primitive, semantic } };
}
