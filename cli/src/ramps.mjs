// Whole color scales, generated in OKLCH (OD-223). Shared by the scheme writer and the harness.
//
// Every colored hue has a light scale and a dark scale, steps 50 to 950. Each is generated from one
// key color, kept exact at 600: the light scale on a shared lightness curve around it, the dark scale
// on its own curve, from just above the dark canvas to near white. A step can carry an adjustment, a
// small recorded move in lightness or hue, for a step whose text must pass or two fills that must stay
// apart. Grays are not generated: they are the neutral scale's options (OD-228).

export const STEPS = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
];
const LIGHT_CURVE = {
  50: 0.98,
  100: 0.945,
  200: 0.9,
  300: 0.865,
  400: 0.72,
  500: 0.56,
  600: 0.48,
  700: 0.39,
  800: 0.3,
  900: 0.22,
  950: 0.14,
};
const DARK_DOWN = {
  50: 0.1,
  100: 0.2,
  200: 0.33,
  300: 0.47,
  400: 0.63,
  500: 0.8,
};
const DARK_UP = { 700: 0.3, 800: 0.55, 900: 0.78, 950: 1 };

const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (v) =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const hex = (c) =>
  "#" +
  c
    .map((v) =>
      Math.round(Math.min(1, Math.max(0, v)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase();
function toLab(h) {
  const [r, g, b] = rgb(h).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function fromLab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gam);
}
/** OKLCH of a hex color: [L, C, H in degrees]. */
export function lch(h) {
  const [L, a, b] = toLab(h);
  return [
    L,
    Math.hypot(a, b),
    ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
  ];
}
/** The hex color of an OKLCH point, chroma reduced until it fits sRGB. */
export function fromLch(L, C, H) {
  const t = (H * Math.PI) / 180;
  for (let c = C; c >= 0; c -= 0.002) {
    const v = fromLab([L, c * Math.cos(t), c * Math.sin(t)]);
    if (v.every((x) => x >= -0.0005 && x <= 1.0005)) return hex(v);
  }
  return hex(fromLab([L, 0, 0]));
}
/** WCAG contrast of two hex colors. */
export function contrast(a, b) {
  const y = (h) => {
    const [r, g, bb] = rgb(h).map(lin);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bb;
  };
  const [x, z] = [y(a), y(b)].sort((p, q) => q - p);
  return (x + 0.05) / (z + 0.05);
}
/** Color difference, ΔE in OKLab ×100. */
export function deltaE(a, b) {
  const p = toLab(a),
    q = toLab(b);
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) * 100;
}

/** The light scale of a key color, the key exact at 600. */
export function lightScale(key) {
  const [Lk, Ck, H] = lch(key);
  return Object.fromEntries(
    STEPS.map((st) => {
      if (st === "600") return [st, key.toUpperCase()];
      const L =
        +st < 600
          ? 1 - ((1 - LIGHT_CURVE[st]) * (1 - Lk)) / (1 - LIGHT_CURVE[600])
          : (LIGHT_CURVE[st] * Lk) / LIGHT_CURVE[600];
      const C =
        L > Lk
          ? Ck * Math.min(1, ((1 - L) / (1 - Lk)) ** 0.6)
          : Ck * Math.min(1, (L / Lk) ** 0.7);
      return [st, fromLch(L, C, H)];
    }),
  );
}
/** The dark scale of a key color over a dark canvas, the key exact at 600. */
export function darkScale(key, canvas) {
  const [Lk, Ck, H] = lch(key);
  const Lc = lch(canvas)[0];
  return Object.fromEntries(
    STEPS.map((st) => {
      if (st === "600") return [st, key.toUpperCase()];
      if (DARK_DOWN[st] != null) {
        const f = DARK_DOWN[st];
        return [st, fromLch(Lc + (Lk - Lc) * f, Ck * (0.55 + 0.45 * f), H)];
      }
      const g = DARK_UP[st];
      return [st, fromLch(Lk + (0.97 - Lk) * g, Ck * (1 - 0.8 * g), H)];
    }),
  );
}
/** A step moved by a recorded adjustment: { L, C, H } in OKLCH lightness, chroma and degrees. */
export function adjusted(h, adj) {
  const [L, C, H] = lch(h);
  return fromLch(
    L + (adj.L ?? 0),
    Math.max(0, C + (adj.C ?? 0)),
    (H + (adj.H ?? 0) + 360) % 360,
  );
}
/** A hue's scale for one mode, with its recorded adjustments. */
export function scale(spec, mode, canvas) {
  const row =
    mode === "light" ? lightScale(spec.key) : darkScale(spec.key, canvas);
  for (const [st, adj] of Object.entries(spec.adjust ?? {}))
    row[st] = adjusted(row[st], adj);
  return row;
}
/** The smallest lightness move that makes text pass on a fill, or null. */
export function nudgeFor(fill, text, need = 4.5) {
  if (contrast(text, fill) >= need) return null;
  const dir =
    contrast("#000000", fill) > contrast("#FFFFFF", fill) ===
    contrast(text, "#000000") > contrast(text, "#FFFFFF")
      ? 1
      : -1;
  for (let d = 0.005; d <= 0.12; d += 0.005) {
    const [L, C, H] = lch(fill);
    for (const s of [dir, -dir]) {
      const h = fromLch(L + s * d, C, H);
      if (contrast(text, h) >= need) return { L: +(s * d).toFixed(3) };
    }
  }
  return null;
}
