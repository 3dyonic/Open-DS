// The token map card: what one semantic token shows on its card, from data only. Its stored
// shorthand, its contrast on the weakest surface it sits on against its floor, the real pairs it makes
// on real surfaces with the scheme's own sample texts, and the tokens whose value is the same or near.
// Pure: the scheme, a color index (color-map.mjs colorIndex) and the threshold are passed in.
import { jobFor, tokenName } from "./color-map.mjs";
import { oklabDistance } from "./quality/color.mjs";
import { MARK_GROUPS } from "./quality/difference.mjs";
import { BACKGROUNDS, contrastRatio } from "./token-measure.mjs";

/** The stored shorthand of a semantic token: { headline, line }, or null when the scheme has none. */
export function shorthandOf(scheme, id) {
  return scheme.shorthand?.tokens?.[tokenName(id)] ?? null;
}

/** The longest headline and line a shorthand may have. The schema holds the same limits. */
export const SHORTHAND_LIMITS = { headline: 40, line: 90 };

/** What is wrong with a shorthand: [] when it holds. */
export function shorthandProblems(shorthand) {
  if (!shorthand) return ["no shorthand"];
  const out = [];
  for (const [field, max] of Object.entries(SHORTHAND_LIMITS)) {
    const text = shorthand[field];
    if (typeof text !== "string" || !text.trim()) out.push(`no ${field}`);
    else if (text.length > max) out.push(`${field} is ${text.length} characters, over ${max}`);
  }
  return out;
}

// A status meaning in the token name: color.status.warning → warning; color.action.danger → danger.
const meaningOf = (name) => /^color\.(?:status|action|text)\.(info|success|warning|danger)\b/.exec(name)?.[1] ?? null;

/**
 * The scheme's sample texts for a meaning: { sentence, label }. sentence is a whole message; label is
 * the short word on a badge. Each is null when the samples hold none: nothing is invented.
 */
export function samplesFor(samples = {}, meaning) {
  const status = (samples.statuses ?? []).find((s) => s.meaning === meaning)?.label ?? null;
  // The samples keep a failed message under messages.error.
  const message = samples.messages?.[meaning === "danger" ? "error" : meaning];
  const sentence =
    (typeof message === "string" ? message : (message?.title ?? null)) ?? (meaning === "danger" ? (samples.field?.error ?? null) : null) ?? status;
  return { sentence, label: status ?? sentence };
}

/**
 * The sample text a token shows in its pairs: { text, label } from the scheme's samples, by the
 * token's job. Null fields when the samples hold no text for it.
 */
function textFor(samples = {}, name) {
  const meaning = meaningOf(name);
  if (meaning) return samplesFor(samples, meaning);
  const category = /^color\.category\.(\d+)(?:\.[a-z-]+)?$/.exec(name);
  if (category) {
    const n = Number(category[1]) - 1;
    // A tag needs a word on it: the scheme's own sample labels, reused in turn when there are fewer than categories.
    const words = samples.checkbox ?? samples.chart?.series ?? [];
    const label = samples.chart?.series?.[n] ?? samples.checkbox?.[n] ?? (words.length ? words[n % words.length] : null);
    return { text: label, label };
  }
  const fixed = {
    "color.text.primary": samples.card?.title,
    "color.text.secondary": samples.card?.description,
    "color.text.muted": samples.field?.hint,
    "color.text.link": samples.actions?.secondary,
    "color.disabled.text": samples.actions?.primary,
    "color.action.primary": samples.actions?.primary,
    "color.action.secondary": samples.actions?.secondary,
  };
  const text = fixed[name] ?? null;
  return { text, label: text };
}

/**
 * The weakest contrast a color token makes where it sits: { ratio, floor, kind, on, against }. sits is
 * the engine's pairs-with checks for the token ([{ key, on, floor }]): the surfaces it sits on, or the
 * text on it when it is a fill. The pair closest to its floor wins. With none, the job (jobFor) measures
 * the token on each background (the lowest wins), or a fill's label on it. Null for a token with no job or a value that is not hex.
 */
export function weakestContrast(index, id, sits = []) {
  const name = tokenName(id);
  const v = (t) => index.nodes.get(t)?.value ?? index.nodes.get(`${t}.@`)?.value ?? null;
  const measured = sits
    .map((s) => ({ ...s, ratio: contrastRatio(v(s.key), v(s.on)) }))
    .filter((s) => s.ratio != null);
  if (measured.length) {
    // The weakest pair is the one closest to its own floor.
    const low = measured.reduce((a, b) => (b.ratio / b.floor < a.ratio / a.floor ? b : a));
    const on = low.key === name ? low.on : name;
    return { ratio: +low.ratio.toFixed(2), floor: low.floor, kind: low.floor >= 4.5 ? "text" : "non-text", on, against: low.key === name ? null : low.key };
  }
  const job = jobFor(index, id);
  const value = index.nodes.get(id)?.value;
  if (!job || value == null) return null;
  if (job.kind === "fill") {
    const ratio = contrastRatio(index.nodes.get(job.against)?.value, value);
    return ratio == null ? null : { ratio: +ratio.toFixed(2), floor: job.needs, kind: "text", on: name, against: tokenName(job.against) };
  }
  let low = null;
  for (const on of BACKGROUNDS.filter((b) => index.nodes.has(b))) {
    const ratio = contrastRatio(value, index.nodes.get(on).value);
    if (ratio != null && (!low || ratio < low.ratio)) low = { ratio, on };
  }
  return low && { ratio: +low.ratio.toFixed(2), floor: job.needs, kind: job.kind, on: low.on, against: null };
}

/**
 * Where a color token is used, drawn with real values: [{ as, on, text, ink, ground }]. as is "text",
 * "icon", "edge" or "label" (a fill with its label); on is the surface token; ink and ground are hex
 * values of this mode. The text is the scheme's sample text; a pair with no sample text is left out.
 */
export function pairsOf(index, id, samples, sits = []) {
  const name = tokenName(id);
  const value = index.nodes.get(id)?.value;
  const v = (t) => index.nodes.get(t)?.value ?? index.nodes.get(`${t}.@`)?.value ?? null;
  const job = jobFor(index, id);
  const sample = textFor(samples, name);
  const out = [];
  const add = (pair) => pair.text && pair.ink && pair.ground && out.push(pair);
  const low = weakestContrast(index, id, sits);
  if (low?.against) {
    add({ as: "label", on: name, text: sample.label, ink: v(low.against), ground: value });
    return out;
  }
  if (job?.kind === "fill") {
    add({ as: "label", on: name, text: sample.label, ink: v(job.against), ground: value });
    return out;
  }
  if (job?.kind === "text") {
    add({ as: "text", on: low?.on ?? "color.surface.default", text: sample.sentence ?? sample.text, ink: value, ground: v(low?.on ?? "color.surface.default") });
    // A status mark is read as text and as an icon (its role's second cue): the icon sits beside normal text.
    if (meaningOf(name) && /^color\.status\./.test(name))
      add({ as: "icon", on: "color.surface.default", text: sample.label, ink: value, ground: v("color.surface.default"), label: v("color.text.primary") });
    return out;
  }
  if (job?.kind === "non-text") {
    const on = low?.on ?? "color.surface.default";
    if (/^color\.border\./.test(name))
      add({ as: "edge", on, text: samples.card?.title ?? null, ink: value, ground: v(on), label: v("color.text.primary") });
    else add({ as: "icon", on, text: sample.label, ink: value, ground: v(on), label: v("color.text.primary") });
    return out;
  }
  // A text made for one fill (color.text.on-action) shows on that fill, with the fill's own sample text.
  if (low && !/^color\.surface\./.test(low.on)) {
    const onFill = textFor(samples, low.on);
    add({ as: "text", on: low.on, text: onFill.label, ink: value, ground: v(low.on) });
    return out;
  }
  // A surface carries the scheme's primary text.
  if (/^color\.surface\./.test(name) && !/scrim|inverse/.test(name))
    add({ as: "text", on: name, text: samples.card?.title ?? null, ink: v("color.text.primary"), ground: value });
  return out;
}

// The tokens a clash is looked for among: the marks the difference check compares (MARK_GROUPS), the
// accent and status marks with the category marks too, as a category can be read as a status.
const MARKS = new RegExp(MARK_GROUPS.map((r) => r.source.slice(1, -1)).join("|").replace(/^/, "^(?:").replace(/$/, ")$"));
const HEX = /^#[0-9a-f]{6}$/i;

/**
 * The tokens with the same or a near value: [{ token, value, distance, same, note }]. Near is under the
 * scheme's difference threshold (color.values.difference) in OKLab, the difference check's measure
 * (quality/color.mjs). With no threshold, only the same value counts. [] for a token outside the marks.
 */
export function clashesOf(index, id, threshold) {
  const name = tokenName(id);
  const value = index.nodes.get(id)?.value;
  if (!MARKS.test(name) || !HEX.test(value ?? "")) return [];
  const out = [];
  for (const [other, node] of index.nodes) {
    const otherName = tokenName(other);
    if (otherName === name || node.tier !== "semantic" || !MARKS.test(otherName) || !HEX.test(node.value ?? "")) continue;
    const distance = oklabDistance(value, node.value);
    const same = value.toLowerCase() === node.value.toLowerCase();
    if (!same && !(threshold != null && distance < threshold)) continue;
    const note = same
      ? `${otherName} has the same value, so one can read as the other.`
      : `${otherName} is ${distance.toFixed(3)} apart, under the ${threshold} line, so one can read as the other.`;
    out.push({ token: otherName, value: node.value, distance: +distance.toFixed(3), same, note });
  }
  return out.sort((a, b) => a.distance - b.distance || a.token.localeCompare(b.token));
}
