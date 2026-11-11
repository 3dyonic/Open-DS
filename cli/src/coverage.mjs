// Decision coverage (OD-273): every semantic value a scheme designs rests on a decision, an answer to a
// grammar question. The trace engine (trace.mjs) finds the links: a theme pick, the token's own reason,
// its group's reason, a usage rule or a grammar trace rule. The owning scope's answers alone do not
// count: that fallback once tied the button's height to the contrast answer. The harness counts what
// is left per scheme, and the count may only go down.
import { owns } from "./lands.mjs";
import { traceScheme } from "./trace.mjs";

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
 * (pick, own, group, rule, grammar), with the answers it cites; `unlinked` gives each token with no
 * decision, its value, and the scope that owns it (null: no question decides it yet).
 * { scheme, total, linked: [{ token, by, because }], unlinked: [{ token, value, scope, owns }] }
 */
export function decisionCoverage(scheme, g) {
  const trace = traceScheme(scheme, g);
  const linked = [];
  const unlinked = [];
  for (const t of trace.tokens) {
    if (t.because.length) linked.push({ token: t.token, by: [...new Set(t.links.map((l) => l.by))], because: t.because });
    else {
      const owner = ownerOf(t.token, g);
      unlinked.push({ token: t.token, value: t.value, scope: owner?.scope ?? null, owns: owner?.owns ?? null });
    }
  }
  return { scheme: scheme.id, total: trace.total, linked, unlinked };
}
