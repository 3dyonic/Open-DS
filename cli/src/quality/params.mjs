// The quality gate's parameters (OD-298), in one place. Each has the owner's starting value; a run
// passes its own with open-ds compare --params <file.json>, and only the keys it names change.

export const DEFAULT_PARAMS = {
  shift: {
    // OKLab distance tiers: under pass is fine; up to review needs a recorded reason; above needs approval.
    pass: 0.02,
    review: 0.05,
    // Tighter tiers for some roles, matched on the token name; the first match wins.
    roles: [{ id: "surface", match: "surface|background|canvas", pass: 0.01, review: 0.02 }],
    // A chromatic token (chroma above this) may turn its hue by at most hueDegrees.
    chroma: 0.05,
    hueDegrees: 5,
  },
  relations: {
    // A contrast pair keeps this much ratio above the floor the grammar asks of it.
    contrastMargin: 0.1,
    // Rest, hover and pressed stay at least this far apart (OKLab distance).
    stateGap: 0.02,
    // Two colors are distinct when they are at least this far apart (OKLab distance).
    distinct: 0.02,
  },
  curves: {
    // Neighbouring steps of a color scale differ by at least this much OKLab lightness.
    minGap: 0.03,
    // Steps this far apart reach this WCAG contrast. Reported only, until OD-299 lands.
    grades: [
      { apart: 400, ratio: 3 },
      { apart: 500, ratio: 4.5 },
      { apart: 700, ratio: 7 },
    ],
    gradesGated: false,
  },
  componentPairs: {
    // A pair is flagged when its difference (OKLab distance of foreground against background) falls
    // below this, having been at or above it on the base.
    minDifference: 0.1,
    // What a foreground with no fill of its own sits on, and what borders and focus rings sit on.
    page: "color.surface.canvas",
  },
};

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

/** The defaults with the given overrides merged in, key by key. A list replaces the default list. */
export function paramsFrom(overrides = {}, defaults = DEFAULT_PARAMS) {
  const out = structuredClone(defaults);
  for (const [k, v] of Object.entries(overrides ?? {})) out[k] = isObject(v) && isObject(out[k]) ? paramsFrom(v, out[k]) : v;
  return out;
}
