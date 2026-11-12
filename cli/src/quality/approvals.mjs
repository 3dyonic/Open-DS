// The owner's approvals for the quality gate (OD-298), from harness/quality-approvals.json. An approval
// clears one flag: one check, in one scheme and mode, on one token or one pair. Only the owner adds an
// entry. Pure: the caller reads the file.
//
//   { scheme, theme, check, token | pair, why, approved_by }
//
// theme is the mode ("light", "dark"), a brand's theme ("aster-dark") or "*" for every theme. check is
// the criterion id that raised the flag ("relations.ladder-order", "invariants.spacing-map",
// "component-pairs.level-drops"); an entry with no check approves a color move (the shift criteria), as
// the first entries did. A component pair names its foreground and background CSS variables
// (["--menubar-item-label", "--menubar-content-background"]); a pair drawn on the page names the page
// token (color.surface.canvas). A token and its variable match either way.

const FIELDS = ["scheme", "theme", "check", "token", "pair", "why", "approved_by"];
const text = (v) => typeof v === "string" && v.trim().length > 0;

/** The problems of one entry, as plain lines; an empty list when it is valid. */
export function approvalProblems(a, i) {
  const at = `approval ${i + 1}`;
  if (!a || typeof a !== "object" || Array.isArray(a)) return [`${at} is not an object.`];
  const out = [];
  for (const k of Object.keys(a)) if (!FIELDS.includes(k)) out.push(`${at} has an unknown field "${k}"; the fields are ${FIELDS.join(", ")}.`);
  for (const k of ["scheme", "theme", "why", "approved_by"]) if (!text(a[k])) out.push(`${at} needs ${k}, as text.`);
  if ("check" in a && !text(a.check)) out.push(`${at}: check must name a criterion id, such as relations.ladder-order.`);
  const pair = Array.isArray(a.pair) && a.pair.length === 2 && a.pair.every(text) && a.pair[0] !== a.pair[1];
  if ("pair" in a && !pair) out.push(`${at}: pair must be two different token names.`);
  if ("token" in a && !text(a.token)) out.push(`${at}: token must be a token name.`);
  if (("token" in a) === ("pair" in a)) out.push(`${at} needs exactly one of token or pair.`);
  if ("pair" in a && !("check" in a)) out.push(`${at} names a pair, so it needs the check it approves.`);
  return out;
}

/**
 * The approvals of a file's content: the list, or an error that names each problem. A file with one bad
 * entry approves nothing, so a typo never clears a flag.
 */
export function approvalsFrom(doc) {
  const list = doc?.approvals ?? [];
  if (!Array.isArray(list)) throw new Error("harness/quality-approvals.json: approvals must be a list. Fix the file, then run open-ds compare again.");
  const problems = list.flatMap((a, i) => approvalProblems(a, i));
  if (problems.length) throw new Error(`harness/quality-approvals.json: ${problems.join(" ")} Fix the file, then run open-ds compare again.`);
  return list;
}

const covers = (a, theme) => a.theme === "*" || a.theme === theme;
// One name for a token and its CSS variable: "--menubar-content-background" and "color.surface.canvas"
// read as "menubar-content-background" and "color-surface-canvas".
export const nameKey = (name) => String(name).replace(/^--/, "").replaceAll(".", "-");
const sameTokens = (a, tokens) => {
  const named = a.pair ?? [a.token];
  return named.length === tokens.length && named.map(nameKey).sort().join("|") === tokens.map(nameKey).sort().join("|");
};

/**
 * The approval that clears a flag, or null. flag: { scheme, themes, check, tokens }; every theme the flag
 * fails in must be covered.
 */
export function approvalFor(approvals, { scheme, themes, check, tokens }) {
  const fits = (approvals ?? []).filter((a) => a.check === check && a.scheme === scheme && sameTokens(a, tokens));
  return themes.length && themes.every((t) => fits.some((a) => covers(a, t))) ? fits.find((a) => themes.some((t) => covers(a, t))) : null;
}

/** Whether the owner approved a color move: an entry with no check (or a shift check) for this scheme, token and theme. */
export const approvedMove = (approvals, scheme, token, theme) =>
  (approvals ?? []).some((a) => (!a.check || a.check.startsWith("shift.")) && a.scheme === scheme && a.token === token && covers(a, theme));
