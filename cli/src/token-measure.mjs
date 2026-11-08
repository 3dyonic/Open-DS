// The token map's measured effect (OD-274): what a primitive's value does, computed from the value
// itself, in plain words. No Node imports, so the docs page runs the same code in the browser.
//
// Color: the WCAG 2.x contrast ratio against the scheme's backgrounds in one mode. Size: the target
// sizes of WCAG 2.5.8 and 2.5.5. Border width: the focus ring thickness of WCAG 2.4.13. Every other
// kind gets no lines yet.

/** The px in one rem, as the browser default sets it. */
export const PX_PER_REM = 16;

/** The contrast levels a color is checked against, lowest first. */
export const CONTRAST_LEVELS = [
  { ratio: 3, text: "Easy to spot (3:1)", rule: "WCAG 1.4.11 Non-text Contrast" },
  { ratio: 4.5, text: "Readable text (4.5:1)", rule: "WCAG 1.4.3 Contrast (Minimum)" },
  { ratio: 7, text: "Readable text, strict (7:1)", rule: "WCAG 1.4.6 Contrast (Enhanced)" },
];

/** The target sizes a size is checked against, in px. */
export const TARGET_LEVELS = [
  { px: 24, text: "Big enough to tap, basic (24px)", rule: "WCAG 2.5.8 Target Size (Minimum)" },
  { px: 44, text: "Big enough to tap (44px)", rule: "WCAG 2.5.5 Target Size (Enhanced)" },
];

/** The focus ring thickness a border width is checked against, in px. */
export const FOCUS_RING_LEVELS = [
  { px: 2, text: "Thick enough for a focus ring (2px)", rule: "WCAG 2.4.13 Focus Appearance" },
];

/** The semantic tokens whose values are the scheme's backgrounds, for the contrast lines. */
export const BACKGROUNDS = [
  "color.surface.default",
  "color.surface.canvas",
  "color.surface.raised",
  "color.surface.sunken",
];

const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** A hex color (#RGB, #RGBA, #RRGGBB or #RRGGBBAA) as { r, g, b, a }, channels 0 to 255 and a 0 to 1. Else null. */
export function parseHex(value) {
  const m = String(value ?? "")
    .trim()
    .match(HEX);
  if (!m) return null;
  const digits = m[1].length <= 4 ? [...m[1]].map((d) => d + d).join("") : m[1];
  const channel = (i) => parseInt(digits.slice(i * 2, i * 2 + 2), 16);
  return { r: channel(0), g: channel(1), b: channel(2), a: digits.length === 8 ? channel(3) / 255 : 1 };
}

// A see-through color as it shows on an opaque background.
const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});

// WCAG 2.x relative luminance of an opaque color.
function luminance({ r, g, b }) {
  const linear = (c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/**
 * The WCAG 2.x contrast ratio of a foreground on a background, both hex strings, from 1 to 21. A
 * see-through foreground counts as it shows on the background. Null when either is not a hex color.
 */
export function contrastRatio(foreground, background) {
  const fg = parseHex(foreground);
  const bg = parseHex(background);
  if (!fg || !bg) return null;
  const a = luminance(over(fg, bg));
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** A px or rem length in px, at PX_PER_REM px per rem. Null for any other value. */
export function toPx(value) {
  const m = String(value ?? "")
    .trim()
    .match(/^(-?\d*\.?\d+)(px|rem)$/);
  if (!m) return null;
  return Number(m[1]) * (m[2] === "rem" ? PX_PER_REM : 1);
}

/**
 * A ratio as the page writes it: two decimals, rounded. A ratio just under a level is cut instead,
 * so 4.497 shows as 4.49 and never as a 4.50 that the level lines say it misses.
 */
export function ratioText(ratio) {
  const rounded = Math.round(ratio * 100) / 100;
  const crosses = CONTRAST_LEVELS.some((l) => ratio < l.ratio && rounded >= l.ratio);
  return (crosses ? Math.floor(ratio * 100) / 100 : rounded).toFixed(2);
}
const pxText = (px) => `${Number(px.toFixed(2))}px`;

const levelLines = (levels, reached) => levels.map((l) => ({ text: l.text, rule: l.rule, met: reached(l) }));

function colorLines(value, backgrounds) {
  if (!parseHex(value)) return [{ text: "Contrast not measured: the value is not a hex color." }];
  const ratios = backgrounds.map((b) => contrastRatio(value, b.value)).filter((r) => r != null);
  if (!ratios.length) return [{ text: "Contrast not measured: the scheme's backgrounds are not hex colors." }];
  const low = Math.min(...ratios);
  const high = Math.max(...ratios);
  const range = ratioText(low) === ratioText(high) ? ratioText(low) : `${ratioText(low)} to ${ratioText(high)}`;
  return [
    {
      text: `${range} on this scheme's backgrounds`,
      rule: `WCAG 2.x contrast ratio on ${backgrounds.map((b) => b.id).join(", ")}`,
    },
    { text: "On all of them:" },
    ...levelLines(CONTRAST_LEVELS, (l) => low >= l.ratio),
  ];
}

function lengthLines(value, levels) {
  const px = toPx(value);
  if (px == null) return [{ text: "Not measured: the value is not in px or rem." }];
  const lines = String(value).trim().endsWith("rem") ? [{ text: `${pxText(px)} at ${PX_PER_REM}px per rem` }] : [];
  return [...lines, ...levelLines(levels, (l) => px >= l.px)];
}

/**
 * The measured effect of a token's value, as lines for the map: { text, rule?, met? }. rule names the
 * guideline a line checks; met says whether the value reaches it. The kind comes from the token's
 * family (color, size, border-width). backgrounds is [{ id, value }], the scheme's resolved
 * backgrounds in the same mode. Every other family gets no lines.
 */
export function measure({ id, value, type }, { backgrounds = [] } = {}) {
  const family = String(id).split(".")[0];
  if (value == null || value === "") return [];
  if (family === "color" || type === "color") return colorLines(value, backgrounds);
  if (family === "size") return lengthLines(value, TARGET_LEVELS);
  if (family === "border-width") return lengthLines(value, FOCUS_RING_LEVELS);
  return [];
}
