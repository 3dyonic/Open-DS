// The difference check: colors that mean different things must look different. Two colors
// are told apart by their OKLab distance, under normal vision and under simulated protanopia,
// deuteranopia and tritanopia. A pair under the scheme's threshold needs a second cue (an icon, a
// label, a pattern). The check reads the accent, status and category marks on each surface of the
// ladder. Pure.
import { differenceThreshold } from "../color-steps.mjs";
import { VISIONS, oklabDistance, simulate } from "./color.mjs";
import { resolveScheme, themesOf } from "./snapshot.mjs";
import { hex6 } from "./values.mjs";

/** Where the known failing pairs are kept. The count may only go down. */
export const DIFFERENCE_BASELINE = "harness/color-difference-baseline.json";

/**
 * The difference check over loaded schemes: [{ id, scheme, theme, vision, tokens, distance, surfaces }].
 * schemes: { id: scheme }; themeTokens builds a brand and mode's token tree.
 */
export function differenceOf(schemes, themeTokens) {
  const snapshot = { schemes: {} };
  for (const [id, s] of Object.entries(schemes)) snapshot.schemes[id] = { themes: themesOf(s), values: resolveScheme(s, themeTokens).values };
  return differenceFailures(snapshot, (id) => differenceThreshold(schemes[id]));
}

/** The baseline record of a list of failures: { description, failures: [id] }. */
export const baselineRecord = (failures) => ({
  description:
    "The color pairs that fail the difference check today (closer than the scheme's color.values.difference threshold, in OKLab, under one vision), kept as a baseline. Each needs a second cue or a new color. The list may only go down: the color-difference check fails a pair that is not here, and a pair here that passes now. Written by node scripts/od-299-difference.mjs --write-baseline.",
  failures: [...new Set(failures.map((f) => f.id))].sort(),
});

/** New failures and fixed ones against a baseline: { added: [failure], fixed: [id] }. */
export function againstBaseline(failures, baseline) {
  const known = new Set(baseline.failures ?? []);
  const now = new Set(failures.map((f) => f.id));
  return { added: failures.filter((f) => !known.has(f.id)), fixed: [...known].filter((id) => !now.has(id)) };
}

/**
 * The groups of marks the check compares, pair by pair inside each group: the accent with the four
 * status marks (they sit side by side in forms and alerts), and the category marks (side by side in
 * charts and tags). A category may share a status color on purpose, so the groups do not mix.
 */
export const MARK_GROUPS = [/^color\.(action\.primary|status\.(info|success|warning|danger))$/, /^color\.category\.\d+$/];
/** The surfaces the marks sit on. */
export const SURFACES = ["color.surface.canvas", "color.surface.default", "color.surface.raised", "color.surface.sunken"];

const channel = (hex, i) => parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);
const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`.toUpperCase();

/** A color as it shows on a surface: an #RRGGBBAA color is laid over the surface; an opaque one stays. */
export function onSurface(color, surface) {
  const c = String(color ?? "");
  if (!/^#[0-9a-f]{8}$/i.test(c)) return hex6(c);
  const a = parseInt(c.slice(7, 9), 16) / 255;
  return toHex([0, 1, 2].map((i) => channel(c, i) * a + channel(surface, i) * (1 - a)));
}

/** The smallest distance in a set of named colors, under one vision: { distance, pair }. */
export function smallestDistance(colors, vision = "normal") {
  const list = Object.entries(colors);
  let best = { distance: Infinity, pair: null };
  for (let i = 0; i < list.length; i++)
    for (let j = i + 1; j < list.length; j++) {
      const d = oklabDistance(simulate(list[i][1], vision), simulate(list[j][1], vision));
      if (d < best.distance) best = { distance: d, pair: [list[i][0], list[j][0]] };
    }
  return best;
}

/** The pairs of one theme under the threshold: [{ surface, vision, tokens, distance }]. */
export function closePairs(values, threshold) {
  const out = [];
  for (const group of MARK_GROUPS) {
    const marks = Object.keys(values).filter((t) => group.test(t) && hex6(values[t]));
    for (const surface of SURFACES.filter((s) => hex6(values[s]))) {
      const ground = hex6(values[surface]);
      const seen = Object.fromEntries(marks.map((t) => [t, onSurface(values[t], ground)]));
      for (const vision of Object.keys(VISIONS))
        for (let i = 0; i < marks.length; i++)
          for (let j = i + 1; j < marks.length; j++) {
            const d = oklabDistance(simulate(seen[marks[i]], vision), simulate(seen[marks[j]], vision));
            if (d < threshold) out.push({ surface, vision, tokens: [marks[i], marks[j]], distance: d });
          }
    }
  }
  return out;
}

/**
 * Every pair under its scheme's threshold, one entry per pair, theme and vision, the surfaces folded in:
 * [{ id, scheme, theme, vision, tokens, distance, surfaces }]. id is stable, for the baseline.
 */
export function differenceFailures(snapshot, thresholdOf) {
  const out = [];
  for (const [scheme, s] of Object.entries(snapshot.schemes)) {
    const threshold = thresholdOf(scheme);
    if (threshold == null) continue;
    for (const t of s.themes) {
      const merged = new Map();
      for (const p of closePairs(s.values[t.id] ?? {}, threshold)) {
        const id = `${scheme}/${t.id} ${p.vision} ${p.tokens.join(" | ")}`;
        const prev = merged.get(id);
        if (prev) {
          prev.surfaces.push(p.surface);
          prev.distance = Math.min(prev.distance, p.distance);
        } else merged.set(id, { id, scheme, theme: t.id, vision: p.vision, tokens: p.tokens, distance: p.distance, surfaces: [p.surface] });
      }
      out.push(...merged.values());
    }
  }
  return out;
}
