// The shape every criterion family returns (OD-298). A measure is one number computed from one
// snapshot; a direction says which way is better: "down" (fewer is better), "up" (more is better) or
// "report" (shown, never gated).

/**
 * One measure: { id, family, title, direction, gated, value, perScheme, details }. value is a number,
 * or null when the snapshot has nothing to measure ("not present").
 */
export function measureOf({ id, family, title, direction, value, perScheme = {}, details = [], gated = direction !== "report" }) {
  return { id, family, title, direction, gated, value, perScheme, details };
}

/** A share in [0, 1], to 4 decimals, so a rounding wobble never reads as a change. */
export const share = (part, whole) => (whole ? Math.round((part / whole) * 10000) / 10000 : null);

/** Sum per scheme: { id: n } from a function of each scheme snapshot. */
export function perSchemeOf(snapshot, fn) {
  return Object.fromEntries(Object.entries(snapshot.schemes).map(([id, s]) => [id, fn(s, id)]));
}

export const sum = (obj) => Object.values(obj).reduce((a, b) => a + (b ?? 0), 0);
