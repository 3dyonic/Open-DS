// The two color answers that shape a scale, as the generator and the checks read them. No file access, so the
// loader, the build and the bundled apps (Storybook, the site) share it.
//
// color.definition.steps: how a scale spaces its steps. Every option is contrast-graded (steps 400
// apart reach 3:1, 500 apart 4.5:1, 700 apart 7:1). The option sets the easing strength: the blend of
// a linear lightness curve with smoothstep.
// color.values.difference: how far apart, in OKLab distance, two colors that mean different things
// must be, under normal vision and three simulated color vision deficiencies.

/**
 * The flag for the contrast-graded curve. Off: every scale uses the shared lightness curve.
 * On: each scheme's scales follow its color.definition.steps answer. The docs page "How the scale is
 * built" shows only when it is on.
 */
export const GRADED_STEPS = true;

/** The easing strength of each color.definition.steps option: 0 is linear, 1 is full smoothstep. */
export const EASING_BY_STEPS = {
  linear: 0,
  "light-ease": 0.25,
  "medium-ease": 0.4,
  "even-ease": 0.5,
  "strong-ease": 0.6,
};

/** The smallest OKLab distance of each color.values.difference option. */
export const DISTANCE_BY_DIFFERENCE = {
  distinct: 0.05,
  clear: 0.08,
  strong: 0.12,
};

/** The contrast grades every option keeps: steps this far apart reach this WCAG ratio. */
export const GRADES = [
  { apart: 400, ratio: 3 },
  { apart: 500, ratio: 4.5 },
  { apart: 700, ratio: 7 },
];

const answerOf = (scheme, question) => (scheme?.answers ?? []).find((a) => a.question === question)?.option;

/** The scheme's step answer: { option, easing }, or null when it has none or the option is unknown. */
export function stepsAnswer(scheme) {
  const option = answerOf(scheme, "color.definition.steps");
  return option in EASING_BY_STEPS ? { option, easing: EASING_BY_STEPS[option] } : null;
}

/** The scheme's difference threshold in OKLab distance, or null. */
export function differenceThreshold(scheme) {
  const option = answerOf(scheme, "color.values.difference");
  return DISTANCE_BY_DIFFERENCE[option] ?? null;
}

/**
 * The curve a scheme's scales use: { easing } for the contrast-graded curve, or null for the shared
 * curve. graded is the flag; a test or a report passes its own.
 */
export function curveOf(scheme, graded = GRADED_STEPS) {
  if (!graded) return null;
  const steps = stepsAnswer(scheme);
  return steps ? { easing: steps.easing } : null;
}
