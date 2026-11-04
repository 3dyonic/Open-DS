// The component spacing map (OD-235). Shared by the scheme writer and the harness.
//
// Inside a component, spacing is a step of the map: space.unit (4px, the same in every scheme) ×
// the step's multiplier × the scheme's rhythm, rounded to a multiple of 4px and at most 64px. The
// scheme decides its rhythm and which steps hold still (fixed: x1 and x2 are the fine spacing inside
// rows, so a roomy scheme does not fatten its lists). The hairline is a fixed 2px optical nudge.
// The math runs here, once, when the scheme is written; every reader gets the stored values.

export const UNIT_PX = 4;
export const CAP_PX = 64;
export const HAIRLINE_PX = 2;
export const MULTIPLIERS = [1, 2, 3, 4, 6, 8, 12];
export const STEP_IDS = ["hairline", ...MULTIPLIERS.map((m) => `x${m}`)];

const rem = (px) => `${px / 16}rem`;

/** The px value of every step, from a scheme's spec: { rhythm, fixed: ["x1", "x2"] }. */
export function steps(spec) {
  const out = { hairline: HAIRLINE_PX };
  for (const m of MULTIPLIERS) {
    const id = `x${m}`;
    const r = (spec.fixed ?? []).includes(id) ? 1 : spec.rhythm;
    // to the nearest multiple of the unit; a tie rounds up
    out[id] = Math.min(CAP_PX, Math.floor(m * r + 0.5) * UNIT_PX);
  }
  return out;
}

/** The step for a hard-coded px value: 2px is the hairline; else the nearest multiplier, a tie up. */
export function stepFor(px) {
  if (Math.abs(px - HAIRLINE_PX) < 1e-6) return "hairline";
  const want = px / UNIT_PX;
  let best = MULTIPLIERS[0];
  for (const m of MULTIPLIERS)
    if (Math.abs(m - want) <= Math.abs(best - want)) best = m;
  return `x${best}`;
}

/**
 * The map's tokens, ready to sit in a scheme at semantic["component-spacing-map"]. Each step links
 * to the scheme's space primitive of its size (space.20), so semantics stay links; `primitives`
 * lists the space primitives the map needs, by px.
 */
export function mapTokens(spec) {
  const px = steps(spec);
  const fixed = spec.fixed ?? [];
  const group = {
    $description:
      "The steps components space by: 4px × a multiplier × this scheme's rhythm, rounded to a multiple of 4px, at most 64px. Steps the scheme holds still stay at 4px × their multiplier. The hairline is a fixed 2px.",
    $extensions: { "open-ds": spec },
    hairline: {
      $type: "dimension",
      $value: `{space.${px.hairline}}`,
      $description: "A fixed 2px optical nudge, the same in every scheme.",
    },
  };
  for (const m of MULTIPLIERS) {
    const id = `x${m}`;
    group[id] = {
      $type: "dimension",
      $value: `{space.${px[id]}}`,
      $extensions: {
        "open-ds": {
          multiplier: m,
          ...(fixed.includes(id) && { fixed: true }),
        },
      },
    };
  }
  return { group, primitives: [...new Set(Object.values(px))].sort((a, b) => a - b) };
}

export const remOf = rem;
