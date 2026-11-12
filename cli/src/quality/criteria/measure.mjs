// The shape every criterion family returns (OD-298). A measure is one number computed from one
// snapshot; a direction says which way is better: "down" (fewer is better), "up" (more is better) or
// "report" (shown, never gated).
import { approvalFor } from "../approvals.mjs";

/**
 * One measure: { id, family, title, direction, gated, value, perScheme, parts, notes, details }. value
 * is a number, or null when the snapshot has nothing to measure ("not present"). parts are the units the
 * gate checks one by one, so a regression in one cannot hide behind a fix in another: each scheme by
 * default, or each scheme and theme ("dense-data/dark"), or each file. notes are short lines the
 * scorecard shows above its table.
 */
export function measureOf({ id, family, title, direction, value, perScheme = {}, parts = perScheme, notes = [], details = [], gated = direction !== "report" }) {
  return { id, family, title, direction, gated, value, perScheme, parts, notes, details };
}

/** A share in [0, 1], to 4 decimals, so a rounding wobble never reads as a change. */
export const share = (part, whole) => (whole ? Math.round((part / whole) * 10000) / 10000 : null);

/** Sum per scheme: { id: n } from a function of each scheme snapshot. */
export function perSchemeOf(snapshot, fn) {
  return Object.fromEntries(Object.entries(snapshot.schemes).map(([id, s]) => [id, fn(s, id)]));
}

/** Count per scheme and theme: { "scheme/theme": n }, every theme listed, from a function of (scheme, theme id). */
export function perThemeOf(snapshot, fn) {
  return Object.fromEntries(Object.entries(snapshot.schemes).flatMap(([id, s]) => s.themes.map((t) => [`${id}/${t.id}`, fn(s, t.id, id)])));
}

/** Count per key: { key: n } from a list and a function that names each item's key. */
export function countBy(list, keyOf) {
  const out = {};
  for (const item of list) out[keyOf(item)] = (out[keyOf(item)] ?? 0) + 1;
  return out;
}

export const sum = (obj) => Object.values(obj).reduce((a, b) => a + (b ?? 0), 0);

/**
 * Flags split by the owner's approvals (harness/quality-approvals.json): { open, cleared }. flags:
 * [{ scheme, themes, tokens, says }]; check is the criterion id that raised them. cleared holds the
 * approved flags' lines, with who approved each and why.
 */
export function splitApproved(flags, approvals, check) {
  const open = [];
  const cleared = [];
  for (const f of flags) {
    const a = approvalFor(approvals, { ...f, check });
    if (a) cleared.push(`${f.says} (approved by ${a.approved_by}: ${a.why})`);
    else open.push(f);
  }
  return { open, cleared };
}

/** A count of the flags the owner has not approved, gated per scheme and theme. */
export function flagMeasure({ id, family, title, flags, approvals }) {
  const { open, cleared } = splitApproved(flags, approvals, id);
  return measureOf({
    id,
    family,
    title,
    direction: "down",
    value: open.length,
    perScheme: countBy(open, (f) => f.scheme),
    parts: countBy(open, (f) => `${f.scheme}/${f.themes.join("+")}`),
    details: [...open.map((f) => f.says), ...cleared],
  });
}
