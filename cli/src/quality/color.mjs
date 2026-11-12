// Color math for the quality gate (OD-298): OKLab, the distance between two colors, color vision
// deficiency simulation and WCAG levels. Pure.
import { contrast } from "../ramps.mjs";

const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const clamp = (v) => Math.min(1, Math.max(0, v));

/** Linear sRGB of a #RRGGBB color, each channel 0 to 1. */
export const linearRgb = (hex) => [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));

/** OKLab of linear sRGB: [L, a, b]. */
export function oklabOfLinear([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

/** OKLab of a #RRGGBB color: [L, a, b], L from 0 to 1. */
export const oklab = (hex) => oklabOfLinear(linearRgb(hex));

/** The OKLab distance between two colors (0 to about 1; 0.02 is a just-visible step). */
export function oklabDistance(x, y) {
  const [p, q] = [oklab(x), oklab(y)];
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
}

/** Chroma and hue in degrees of a color, from OKLab. */
export function chromaHue(hex) {
  const [, a, b] = oklab(hex);
  return { C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}

/** The smaller angle between two hues, in degrees. */
export const hueDifference = (h1, h2) => {
  const d = Math.abs(h1 - h2) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * Color vision deficiency at full severity, Machado, Oliveira and Fernandes (2009), applied to linear
 * sRGB. Normal vision is the identity.
 */
export const VISIONS = {
  normal: null,
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
};

/** A color as a person with the given vision sees it, as #RRGGBB. */
export function simulate(hex, vision) {
  const m = VISIONS[vision];
  if (!m) return hex.toUpperCase();
  const rgb = linearRgb(hex);
  const out = m.map((row) => clamp(row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2]));
  return `#${out.map((v) => Math.round(gam(v) * 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** The WCAG level a contrast ratio reaches: 0 under 3:1, 1 at 3:1, 2 at 4.5:1, 3 at 7:1. */
export const wcagLevel = (ratio) => (ratio >= 7 ? 3 : ratio >= 4.5 ? 2 : ratio >= 3 ? 1 : 0);

export { contrast };
