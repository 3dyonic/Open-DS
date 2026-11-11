// Decision coverage (OD-273): every semantic value a scheme designs rests on a decision, an answer to a
// grammar question. A semantic is linked when its theme pick cites an answer (because), or when a usage
// rule that cites an answer names it. The owning scope's answers do not count: that fallback once tied
// the button's height to the contrast answer. The harness counts what is left per scheme, and the
// count may only go down.
import { owns, tokenIndex } from "./lands.mjs";
import { questions } from "./schemes.mjs";
import { flatTokens } from "./tokens.mjs";

// A token name in a rule's text: two or more dotted segments ("type.body", "size.control.default").
const TOKEN_NAME = /[a-z][a-z0-9-]*(?:\.[a-z0-9_@-]+)+/g;
const THEME_REF = /\{theme\.([^}]+)\}/g;
const shortName = (path) => path.replace(/\.@$/, "");

/** The grammar scope that owns a semantic, the most specific owns entry first; null when none does. */
function ownerOf(path, g) {
  let best = null;
  for (const scope of g.scopes)
    for (const o of scope.owns ?? [])
      if (owns(path, o) && (!best || o.length > best.owns.length)) best = { scope: scope.id, owns: o };
  return best;
}

/**
 * Which semantic tokens of a scheme rest on a decision. `linked` gives each linked token and how
 * (pick, rule), with the answers it cites; `unlinked` gives each token with no decision, its value, and
 * the scope that owns it (null: no question decides it yet).
 * { scheme, total, linked: [{ token, by, because }], unlinked: [{ token, value, scope, owns }] }
 */
export function decisionCoverage(scheme, g) {
  const asked = questions(g);
  const answered = new Set((scheme.answers ?? []).map((a) => a.question));
  // An id that the grammar does not ask, or this scheme does not answer, links nothing.
  const cited = (because) => (because ?? []).filter((id) => id in asked && answered.has(id));

  const semantics = flatTokens(scheme.tokens.semantic);
  const names = new Set(semantics.map(([p]) => shortName(p)));

  // A rule names a token ("color.status.danger") or a group of tokens ("type.body"), never a part of
  // a name: "type.body" does not name "type.body-strong".
  const byRule = new Map();
  for (const rule of scheme.usage ?? []) {
    const ids = cited(rule.because);
    if (!ids.length) continue;
    for (const [name] of String(rule.use ?? "").matchAll(TOKEN_NAME)) {
      const hits = names.has(name) ? [name] : [...names].filter((n) => n.startsWith(`${name}.`));
      for (const n of hits) byRule.set(n, [...new Set([...(byRule.get(n) ?? []), ...ids])]);
    }
  }

  const brands = Object.keys(scheme.tokens.brands ?? {});
  const themes = (scheme.themes ?? []).map((t) =>
    tokenIndex(scheme, { brand: t.brand ?? brands[0], mode: t.mode ?? t.id }),
  );
  // The answers the theme picks of a value cite, in any brand and mode.
  const pickAnswers = (value) => {
    const ids = new Set();
    for (const [, pick] of JSON.stringify(value ?? "").matchAll(THEME_REF))
      for (const ix of themes)
        for (const id of cited(ix.byPath.get(`theme.${pick}`)?.$extensions?.["open-ds"]?.because)) ids.add(id);
    return [...ids];
  };

  const linked = [];
  const unlinked = [];
  for (const [path, token] of semantics) {
    const name = shortName(path);
    const byPick = pickAnswers(token.$value);
    const ruled = byRule.get(name) ?? [];
    if (byPick.length || ruled.length)
      linked.push({
        token: name,
        by: [...(byPick.length ? ["pick"] : []), ...(ruled.length ? ["rule"] : [])],
        because: [...new Set([...byPick, ...ruled])],
      });
    else {
      const owner = ownerOf(path, g);
      unlinked.push({ token: name, value: token.$value, scope: owner?.scope ?? null, owns: owner?.owns ?? null });
    }
  }
  return { scheme: scheme.id, total: semantics.length, linked, unlinked };
}
