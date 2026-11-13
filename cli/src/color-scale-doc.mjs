// The docs page "How the scale is built" (OD-299), one per scheme, under Primitives > Color. Built from
// the scheme's two color answers and its own scale values. It is written only while the graded curve
// is on (GRADED_STEPS), so it never describes a curve the scheme does not ship.
import { DISTANCE_BY_DIFFERENCE, GRADED_STEPS, GRADES, stepsAnswer } from "./color-steps.mjs";
import { STEPS, contrast, luminance } from "./ramps.mjs";
import { follow } from "./scale-map.mjs";
import { differenceOf } from "./quality/difference.mjs";
import { themeTokens } from "./tokens.mjs";

const hex2 = (v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0");
const gam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
/** The grey with the same relative luminance as a color. */
export const greyOf = (hex) => `#${hex2(gam(luminance(hex))).repeat(3)}`.toUpperCase();

/** The hue and its light scale behind color.action.primary: { hue, row: { step: hex } }, or null. */
export function primaryScale(scheme) {
  const t = scheme.tokens;
  const brand = Object.keys(t.brands)[0];
  const end = follow(t, brand, "light", "color.action.primary.@")?.prim;
  const hue = end?.match(/^color\.([a-z0-9-]+)\.light\.\d+$/)?.[1];
  const group = hue && t.primitive.color[hue]?.light;
  if (!group) return null;
  return { hue, row: Object.fromEntries(STEPS.map((st) => [st, String(group[st]?.$value ?? "").slice(0, 7).toUpperCase()])) };
}

/** The grey strip as inline SVG: one swatch per step, its step under it. */
export function greyStrip(row) {
  const w = 56;
  const cells = STEPS.map((st, i) => {
    const grey = greyOf(row[st]);
    const ink = contrast(grey, "#000000") >= contrast(grey, "#FFFFFF") ? "#000000" : "#FFFFFF";
    return `<rect x="${i * w}" y="0" width="${w}" height="56" fill="${grey}"/><text x="${i * w + w / 2}" y="34" text-anchor="middle" font-size="13" fill="${ink}">${st}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${STEPS.length * w} 56" width="100%" role="img" aria-label="The steps 50 to 950 as greys of the same lightness">${cells}</svg>`;
}

const answerOf = (scheme, q) => scheme.answers.find((a) => a.question === q);

/** The step pairs of the scheme's generated scales that miss their contrast grade. */
export function gradeMissCount(scheme) {
  let n = 0;
  for (const g of Object.values(scheme.tokens.primitive.color)) {
    const spec = g?.$extensions?.["open-ds"];
    for (const mode of ["light", "dark"]) {
      if (!spec?.[mode]?.key || !g[mode]) continue;
      const v = (st) => String(g[mode][st]?.$value ?? "").slice(0, 7);
      for (const a of STEPS)
        for (const b of STEPS) {
          const grade = GRADES.filter((x) => +b - +a >= x.apart).at(-1);
          if (grade && contrast(v(a), v(b)) < grade.ratio) n++;
        }
    }
  }
  return n;
}

/** The page's Markdown, or null when the flag is off or the scheme has no step answer. */
export function colorScalePage(scheme, grammar, { graded = GRADED_STEPS, frontMatter }) {
  const steps = stepsAnswer(scheme);
  const primary = primaryScale(scheme);
  if (!graded || !steps || !primary) return null;
  const color = grammar.scopes.find((s) => s.id === "color");
  const label = (q, option) => color.questions.find((x) => x.id === q)?.options.find((o) => o.id === option)?.label ?? option;
  const stepsWhy = answerOf(scheme, "color.definition.steps").why;
  const diff = answerOf(scheme, "color.values.difference");
  const held = Object.values(scheme.tokens.primitive.color).reduce(
    (n, g) => n + ["light", "dark"].reduce((m, mode) => m + Object.keys(g?.$extensions?.["open-ds"]?.[mode]?.held ?? {}).length, 0),
    0,
  );
  const grades = GRADES.map((g) => `${g.apart} apart reach ${g.ratio}:1`).join(", ");
  const close = diff ? differenceOf({ [scheme.id]: scheme }, themeTokens).length : 0;
  const misses = gradeMissCount(scheme);
  const curve = steps.easing === 0 ? "a linear curve" : label("color.definition.steps", steps.option).toLowerCase();
  const sentences = [
    `The steps aim at contrast grades: two steps ${grades.replace(/, ([^,]*)$/, " and $1")}; ${misses ? `${misses} step pairs of the generated scales miss their grade today` : "every step pair reaches its grade"}.`,
    `The lightness follows ${curve} (easing ${steps.easing}). ${stepsWhy}`,
    diff
      ? `Colors that mean different things must be at least ${DISTANCE_BY_DIFFERENCE[diff.option]} apart in OKLab, also for red-weak, green-weak and blue-weak vision; ${close ? `${close} pairs are closer today and need a second cue, such as an icon or a label` : "every pair is"}.`
      : null,
  ].filter(Boolean);
  const kept = held ? ` Steps 50 and 950 keep the earlier curve, and so do ${held} steps that would move more than their limit.` : " Steps 50 and 950 keep the earlier curve.";
  return (
    frontMatter({ sidebar_position: 1.5, title: "How the scale is built", description: `How ${scheme.name} spaces the steps of a color scale.` }) +
    `# How the scale is built\n\nPart of [Primitives › Color](./color.md). Every color scale in ${scheme.name} runs from step 50 to step 950, with its key color exact at step 600.${kept}\n\n` +
    `${greyStrip(primary.row)}\n\n` +
    `The strip is the ${primary.hue} scale with its color taken out. Each swatch keeps only the lightness of its step.\n\n` +
    `${sentences.join(" ")}\n`
  );
}
