// Motion families and move types (OD-297). The grammar's motion scope names two families, productive
// and expressive, picked by one answer; each family limits each duration and allows curve kinds per
// move type (enter, exit, exit-offscreen, transition, emphasize). This module measures each easing's
// curve and checks every scheme against its family. No file access: the caller passes the scheme and
// the grammar.
import { aliasChain, tokenIndex } from "./lands.mjs";
import { matches } from "./trace.mjs";

/** A cubic Bézier's progress at time t (0..1), for control points [x1, y1, x2, y2]. */
export function bezierAt([x1, y1, x2, y2], t) {
  const axis = (a, b, s) => 3 * a * (1 - s) ** 2 * s + 3 * b * (1 - s) * s ** 2 + s ** 3;
  // x is monotonic in s for x1, x2 in [0, 1]: find s for time t by bisection.
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (axis(x1, x2, mid) < t) lo = mid;
    else hi = mid;
  }
  return axis(y1, y2, (lo + hi) / 2);
}

/**
 * The kind of a curve: "overshoot" when it passes its target (a control point above 1 or under 0),
 * "strong-out" when it covers 80% or more of the way in a third of its time, "ease-out" when it is past
 * half the way at half its time, "accelerate" when it is short of half, or "linear".
 */
export function curveKind(points) {
  const [, y1, , y2] = points;
  if (y1 > 1 || y1 < 0 || y2 > 1 || y2 < 0) return "overshoot";
  if (bezierAt(points, 1 / 3) >= 0.8) return "strong-out";
  const half = bezierAt(points, 0.5);
  if (half > 0.52) return "ease-out";
  if (half < 0.48) return "accelerate";
  return "linear";
}

/** A duration value in milliseconds: "150ms" is 150, "0.3s" is 300; null when it is not a duration. */
export function ms(value) {
  const m = /^(\d+(?:\.\d+)?)(ms|s)$/.exec(String(value ?? "").trim());
  if (!m) return null;
  return m[2] === "s" ? Number(m[1]) * 1000 : Number(m[1]);
}

/** The scheme's motion family id, from the answer the grammar's families follow; null when none. */
export function familyOf(scheme, g) {
  const f = g.scopes.find((s) => s.id === "motion")?.families;
  if (!f) return null;
  const option = (scheme.answers ?? []).find((a) => a.question === f.question)?.option;
  return f.by_option[option] ?? null;
}

/**
 * Check one scheme's motion tokens against its family. Returns { scheme, family, results, errors }:
 *   results: [{ token, holds, says }], one per duration and per move's easing;
 *   errors: what cannot be checked (no family, a move with no easing token, a value that does not
 *     resolve). An error is a defect in the scheme, as is a result that does not hold.
 */
export function checkMotion(scheme, g) {
  const f = g.scopes.find((s) => s.id === "motion")?.families;
  const errors = [];
  const results = [];
  if (!f) return { scheme: scheme.id, family: null, results, errors: ["the grammar's motion scope has no families"] };
  const id = familyOf(scheme, g);
  const family = f.items.find((x) => x.id === id);
  if (!family) return { scheme: scheme.id, family: id, results, errors: [`${scheme.id}: ${f.question} picks no family`] };
  // Motion is the same in every brand and mode; the first theme resolves it.
  const brand = Object.keys(scheme.tokens.brands ?? {})[0];
  const ix = tokenIndex(scheme, { brand, mode: "light" });
  const value = (path) => aliasChain(ix, path).value;

  for (const name of Object.keys(scheme.tokens.semantic.motion?.duration ?? {})) {
    const token = `motion.duration.${name}`;
    const got = ms(value(token));
    const limit = Object.entries(family.max_ms).find(([pattern]) => matches(pattern, token))?.[1];
    if (got === null) errors.push(`${scheme.id}: ${token} is not a duration`);
    else if (limit === undefined) errors.push(`${scheme.id}: the ${family.id} family sets no limit for ${token}`);
    else results.push({ token, holds: got <= limit, says: `${got}ms; the ${family.id} limit is ${limit}ms` });
  }
  for (const move of f.moves) {
    const points = value(move.token);
    if (!Array.isArray(points) || points.length !== 4) {
      errors.push(`${scheme.id}: ${move.token} (the ${move.id} move) is not a cubic Bézier`);
      continue;
    }
    const kind = curveKind(points);
    const allowed = family.curves[move.id] ?? [];
    results.push({
      token: move.token,
      holds: allowed.includes(kind),
      says: `the ${move.id} move is ${kind} (${points.join(", ")}); the ${family.id} family allows ${allowed.join(" or ") || "nothing"}`,
    });
  }
  return { scheme: scheme.id, family: family.id, results, errors };
}
