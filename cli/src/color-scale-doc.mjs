// The docs page "How the scale is built" (OD-299, OD-307), one per scheme, under Primitives › Color.
// It shows the scheme's key scale (the hue behind color.action.primary in the first brand, light
// theme), the curve its steps follow, the answers that chose that curve, three real uses with their
// contrast, and the same key built with other answers. Every number comes from the built scale. The
// page is written only while the graded curve is on (GRADED_STEPS), so it never describes a curve the
// scheme does not ship.
import { EASING_BY_STEPS, GRADED_STEPS, curveOf, stepsAnswer } from "./color-steps.mjs";
import { STEPS, contrast, gradedLightScale, lch } from "./ramps.mjs";
import { resolveScheme, themesOf } from "./quality/snapshot.mjs";
import { follow } from "./scale-map.mjs";
import { questions } from "./schemes.mjs";
import { themeTokens } from "./tokens.mjs";

/** The key step: the key color sits exact at this step of every scale. */
export const KEY_STEP = "600";
// The three uses the page shows: a fill and the text on it. "on" is the scheme's text on its action.
const USES = [
  { use: "button", fill: KEY_STEP, text: "on" },
  { use: "highlight", fill: "50", text: KEY_STEP },
  { use: "banner", fill: "100", text: "950" },
];
// The middle band: the steps where a smoothstep ease spreads the steps wider than a linear curve
// (u from 0.21 to 0.79 of the way from step 50 to step 950).
const MIDDLE = ["300", "400", "500", "600", "700"];

const hex7 = (v) => String(v ?? "").slice(0, 7).toUpperCase();
const round = (n, d) => Math.round(n * 10 ** d) / 10 ** d;
const answerOf = (scheme, q) => scheme.answers.find((a) => a.question === q);
const sentence = (s) => `${String(s ?? "").trim().replace(/[.\s]+$/, "")}.`;
// A label inside a sentence starts in lowercase, unless its first word is an acronym such as AAA.
const lowerFirst = (s) => (/^[A-Z](?![A-Z])/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);

/** The WCAG level of a text contrast: AAA, AA, AA-large (3:1, large text only) or fail. */
export const wcagLevel = (ratio) => (ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA-large" : "fail");

/**
 * The key scale: the hue behind color.action.primary in the first brand, light theme, as built.
 * { brand, hue, spec, row: { step: hex } }, or null.
 */
export function primaryScale(scheme) {
  const t = scheme.tokens;
  const brand = Object.keys(t.brands)[0];
  const end = follow(t, brand, "light", "color.action.primary.@")?.prim;
  const hue = end?.match(/^color\.([a-z0-9-]+)\.light\.\d+$/)?.[1];
  const group = hue && t.primitive.color[hue];
  if (!group?.light) return null;
  return {
    brand,
    hue,
    spec: group.$extensions?.["open-ds"]?.light ?? null,
    row: Object.fromEntries(STEPS.map((st) => [st, hex7(group.light[st]?.$value)])),
  };
}

// The first brand's light theme, resolved: token name → value.
function lightValues(scheme, brand) {
  const theme = themesOf(scheme).find((t) => t.mode === "light" && t.brand === brand);
  return resolveScheme(scheme, themeTokens).values[theme.id];
}

/**
 * The answers that lead to color.definition.steps, earliest first: each answer the step answer
 * names in its because list, ordered so that an answer comes after the answers it follows from.
 */
export function stepsChain(scheme, g) {
  const qs = questions(g);
  const direct = answerOf(scheme, "color.definition.steps")?.because ?? [];
  const before = (a, b) => (answerOf(scheme, b)?.because ?? []).includes(a);
  const ordered = [...direct].sort((a, b) => (before(a, b) ? -1 : before(b, a) ? 1 : direct.indexOf(a) - direct.indexOf(b)));
  return [...ordered, "color.definition.steps"].map((id) => {
    const a = answerOf(scheme, id);
    const q = qs[id];
    return {
      question: id,
      group: q.groupTitle,
      text: q.text,
      option: a.option,
      answer: q.options.find((o) => o.id === a.option)?.label ?? a.option,
      why: a.why,
    };
  });
}

// The lightness gap of each pair of neighbor steps.
const gaps = (L) => STEPS.slice(1).map((st, i) => L[STEPS[i]] - L[st]);

/**
 * The page's facts, every one from the built scale and the answers: the strip, the curve, the chain,
 * the three uses, the other answers and the reason's numbers. null when the scheme has no step answer
 * or no key scale.
 */
export function scaleFacts(scheme, g) {
  const steps = stepsAnswer(scheme);
  const primary = primaryScale(scheme);
  const curve = curveOf(scheme, true);
  if (!steps || !primary?.spec || !curve) return null;
  const { hue, row, spec } = primary;
  const key = spec.key.toUpperCase();
  const held = Object.keys(spec.held ?? {});
  const eased = gradedLightScale(key, steps.easing);
  const linear = gradedLightScale(key, 0);
  const L = (r) => Object.fromEntries(STEPS.map((st) => [st, lch(r[st])[0]]));
  const [Lrow, Leased, Llinear] = [L(row), L(eased), L(linear)];
  // How much wider (or closer) the eased curve sets the steps than a linear one, by lightness.
  const ratio = gaps(Leased).map((x, i) => x / gaps(Llinear)[i]);
  const middleIdx = MIDDLE.slice(1).map((st) => STEPS.indexOf(st) - 1);
  const middle = round(Math.max(...middleIdx.map((i) => ratio[i])), 1);
  const ends = round(Math.min(ratio[0], ratio.at(-1)), 1);
  const values = lightValues(scheme, primary.brand);
  const onColor = hex7(values["color.text.on-action"]) || "#FFFFFF";
  const color = (st) => (st === "on" ? onColor : row[st]);
  const smp = scheme.samples ?? {};
  const sampleOf = { button: smp.actions?.primary, highlight: smp.statuses?.[0]?.label, banner: smp.screen };
  const optionOf = (opt) => questions(g)["color.definition.steps"].options.find((o) => o.id === opt);
  const label = (opt) => optionOf(opt)?.label ?? opt;
  const other = steps.option === "strong-ease" ? "light-ease" : "strong-ease";
  const optionIds = [...new Set(["linear", steps.option, other, "even-ease"])].slice(0, 3).sort((a, b) => EASING_BY_STEPS[a] - EASING_BY_STEPS[b]);
  return {
    hue,
    brand: primary.brand,
    brands: Object.keys(scheme.tokens.brands).length,
    key,
    option: steps.option,
    optionLabel: label(steps.option),
    easing: steps.easing,
    middle,
    ends,
    strip: {
      hue,
      key: KEY_STEP,
      steps: STEPS.map((st) => ({ step: st, primitive: `${hue}.light.${st}`, hex: row[st] })),
    },
    curve: {
      hue,
      key: KEY_STEP,
      option: label(steps.option),
      easing: steps.easing,
      band: { from: MIDDLE[0], to: MIDDLE.at(-1), wider: middle },
      steps: STEPS.map((st) => ({
        step: st,
        hex: row[st],
        lightness: round(Lrow[st], 3),
        curve: round(Leased[st], 3),
        linear: round(Llinear[st], 3),
        // A held step keeps its earlier value; steps 50 and 950 are anchors, so the curve never moves them.
        ...(held.includes(st) && st !== "50" && st !== "950" && { held: spec.held[st], curveHex: eased[st] }),
      })),
    },
    chain: { steps: stepsChain(scheme, g) },
    uses: {
      hue,
      uses: USES.map((u) => {
        const ratioOf = round(contrast(color(u.fill), color(u.text)), 2);
        return {
          use: u.use,
          sample: sampleOf[u.use] ?? u.use,
          fill: { step: u.fill, hex: color(u.fill) },
          text: u.text === "on" ? { token: "text.on-action", hex: onColor } : { step: u.text, hex: color(u.text) },
          contrast: ratioOf,
          level: wcagLevel(ratioOf),
        };
      }),
    },
    options: {
      hue,
      key: KEY_STEP,
      options: optionIds.map((opt) => {
        const r = gradedLightScale(key, EASING_BY_STEPS[opt]);
        return {
          option: opt,
          label: label(opt),
          ...(optionOf(opt)?.description && { description: optionOf(opt).description }),
          easing: EASING_BY_STEPS[opt],
          own: opt === steps.option,
          steps: STEPS.map((st) => ({ step: st, hex: r[st] })),
        };
      }),
    },
  };
}

/** The reason, in the house form, from the step answer's own why and the answer it follows from. */
export function scaleReason(facts) {
  const chain = facts.chain.steps;
  const own = chain.at(-1);
  // The first answer outside Color is the cause; with none, the first answer in the chain.
  const cause = chain.find((x) => !x.question.startsWith("color.")) ?? chain[0];
  const option = lowerFirst(facts.optionLabel);
  const linear = facts.easing === 0;
  const goal = linear
    ? "keep the same contrast between any two steps the same distance apart"
    : "open the middle steps and keep the soft tints and the deep shades close together";
  const how = linear
    ? `giving each step the same share of the contrast on each side of step ${KEY_STEP}, where the key color sits`
    : `setting the middle steps up to ${facts.middle} times as far apart in lightness as a linear curve does, and the end steps ${facts.ends} times as far apart`;
  return (
    `We use **${option}** for the **${facts.hue} scale** in order to ${goal}. ` +
    `The curve does this by ${how}. ` +
    `So people get this: ${sentence(own.why)} ` +
    `This is because of the ${cause.group} answer: **${cause.answer}**. ${sentence(cause.why)}`
  );
}

/** The page's Markdown, or null when the flag is off or the scheme has no step answer. put(kind, id, data) stores composite data and returns its directive line. */
export function colorScalePage(scheme, grammar, { graded = GRADED_STEPS, frontMatter, put }) {
  const facts = graded ? scaleFacts(scheme, grammar) : null;
  if (!facts) return null;
  const id = "key";
  const many = facts.brands > 1 ? ` It shows the ${facts.brand} brand, the first of its ${facts.brands} brands.` : "";
  const curveTitle = facts.easing === 0 ? "The shape: the same rule from end to end" : "The shape: open in the middle, close at the ends";
  const held = facts.curve.steps.some((x) => x.held);
  return (
    frontMatter({ sidebar_position: 1, hide_table_of_contents: true, title: "How the scale is built", description: `How ${scheme.name} spaces the steps of its ${facts.hue} scale, and why.` }) +
    `# How the scale is built\n\n` +
    `${scheme.name} builds each color scale from one key color. The ${facts.hue} scale has eleven steps, from step 50 to step 950. This page shows how the steps are spaced, and why.${many}\n\n` +
    `${put("scale-strip", id, facts.strip)}\n\n` +
    `## ${curveTitle}\n\n` +
    `Each dot is one step, in its own color. Higher means lighter. The solid line is the curve that ${scheme.name} chose: ${lowerFirst(facts.optionLabel)}. ` +
    (facts.easing === 0 ? "This curve is the linear one, so the page draws no second line for comparison." : "The dashed line is a linear curve, for comparison.") +
    (held ? " A dashed ring is a held step: it keeps its earlier value for now. A thin line links it to where the curve puts it." : "") +
    `\n\n${put("scale-curve", id, facts.curve)}\n\n` +
    `## Why this shape\n\n` +
    `${put("scale-why", id, facts.chain).replace(/^::/, ":::")}\n${scaleReason(facts)}\n:::\n\n` +
    `## What it gives you\n\n` +
    `Three uses of the ${facts.hue} scale, with the contrast of the text on its fill. AA needs 4.5 to 1 for body text, and AAA needs 7 to 1.\n\n` +
    `${put("scale-uses", id, facts.uses)}\n\n` +
    `## If the answer were different\n\n` +
    `The same ${facts.hue} key color, built with other answers. Step ${KEY_STEP} never moves; the steps around it do. The strips show each curve alone, without held steps.\n\n` +
    `${put("scale-options", id, facts.options)}\n`
  );
}
