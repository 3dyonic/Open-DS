// Derived against literal: where each semantic value comes from. A value is derived when a
// recorded relation, another semantic, a color scale step or a scale step named for its value gives
// it; a literal is a raw value someone typed (a hex in place of a step, a font stack, "120ms"). Also
// the raw hex, px and ms literals in component code that bypass the tokens.
import { countBy, measureOf, perSchemeOf, perThemeOf, share, sum } from "./measure.mjs";

export const FAMILY = "derived";
export const ORIGINS = ["relation", "alias", "scale", "literal"];

// Each scheme's literal tokens: a token that is literal in any theme.
const literalTokens = (s) => new Set(Object.values(s.origin).flatMap((byToken) => Object.entries(byToken).filter(([, o]) => o === "literal").map(([t]) => t)));

export function measure(snapshot) {
  const all = perSchemeOf(snapshot, (s) => Object.values(s.origin).reduce((n, byToken) => n + Object.keys(byToken).length, 0));
  const literal = perSchemeOf(snapshot, (s) => Object.values(s.origin).reduce((n, byToken) => n + Object.values(byToken).filter((o) => o === "literal").length, 0));
  const derived = Object.fromEntries(Object.keys(all).map((id) => [id, all[id] - literal[id]]));
  const byOrigin = Object.fromEntries(
    ORIGINS.map((o) => [o, sum(perSchemeOf(snapshot, (s) => Object.values(s.origin).reduce((n, byToken) => n + Object.values(byToken).filter((x) => x === o).length, 0)))]),
  );
  const ui = snapshot.ui?.literals ?? [];
  const kinds = ui.reduce((acc, l) => ({ ...acc, [l.kind]: (acc[l.kind] ?? 0) + 1 }), {});
  return [
    measureOf({
      id: "derived.share",
      family: FAMILY,
      title: "Share of semantic values (per brand and mode) derived from a scale, relation or alias",
      direction: "up",
      value: share(sum(derived), sum(all)),
      perScheme: Object.fromEntries(Object.keys(all).map((id) => [id, share(derived[id], all[id])])),
      details: ORIGINS.map((o) => `${o}: ${byOrigin[o]}`),
    }),
    measureOf({
      id: "derived.literal-values",
      family: FAMILY,
      title: "Semantic values (per brand and mode) that end on a raw literal",
      direction: "down",
      value: sum(literal),
      perScheme: literal,
      parts: perThemeOf(snapshot, (s, theme) => Object.values(s.origin[theme] ?? {}).filter((o) => o === "literal").length),
      details: Object.entries(snapshot.schemes).map(([id, s]) => `${id}: ${[...literalTokens(s)].join(", ")}`),
    }),
    measureOf({
      id: "derived.component-literals",
      family: FAMILY,
      title: "Raw hex, px and ms literals in component code and CSS that bypass the tokens",
      direction: "down",
      value: snapshot.ui ? ui.length : null,
      parts: countBy(ui, (l) => l.file),
      details: [`${Object.entries(kinds).map(([k, n]) => `${k}: ${n}`).join(", ") || "none"}`, ...ui.map((l) => `${l.file}:${l.line} ${l.text}`)],
    }),
  ];
}

/**
 * New literals against the base: tokens literal in the candidate that were not literal (or did not
 * exist) in the base. Each must carry a reason recorded for it: the token's own why, or its theme
 * pick's why. A usage rule's text is about a situation, not this value, so it does not count.
 */
export function relative(base, candidate) {
  const fresh = [];
  for (const [id, s] of Object.entries(candidate.schemes)) {
    const before = base.schemes[id] ? literalTokens(base.schemes[id]) : new Set();
    const reasons = new Map(s.trace.map((t) => [t.token, t.ownWhy ?? null]));
    for (const token of literalTokens(s))
      if (!before.has(token)) {
        const why = reasons.get(token) ?? null;
        fresh.push({ scheme: id, token, reasoned: !!why, why });
      }
  }
  const unreasoned = fresh.filter((f) => !f.reasoned);
  return [
    measureOf({
      id: "derived.new-literals",
      family: FAMILY,
      title: "Literals new in the candidate",
      direction: "report",
      value: fresh.length,
      details: fresh.map((f) => `${f.scheme}: ${f.token}${f.reasoned ? ` (why: ${f.why})` : " (no recorded reason)"}`),
    }),
    measureOf({
      id: "derived.new-literals-unreasoned",
      family: FAMILY,
      title: "Literals new in the candidate with no recorded reason",
      direction: "down",
      value: unreasoned.length,
      perScheme: countBy(unreasoned, (f) => f.scheme),
      details: unreasoned.map((f) => `${f.scheme}: ${f.token}`),
    }),
  ];
}
