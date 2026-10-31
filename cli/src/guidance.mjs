// What each semantic key is for, read from the grammar's "semantics" list. Pure functions: no files.

const ids = (g) => new Map((g.semantics?.keys ?? []).map((k) => [k.id, k]));

/** The guidance id for a token path; a concept with a base resolves to its @ (color.status.danger → .@). */
export function guidanceId(g, path) {
  const all = ids(g);
  if (all.has(path)) return path;
  if (all.has(`${path}.@`)) return `${path}.@`;
  return null;
}

/**
 * Guidance for one semantic key: its intent, uses, misuses with what to use instead, the fills it may
 * sit on, the keys that may sit on it, and its place on the urgency order. Null when there is none.
 */
export function guidanceFor(g, path) {
  const id = guidanceId(g, path);
  if (!id) return null;
  const k = ids(g).get(id);
  const takes = (g.semantics.keys ?? [])
    .filter((x) => x.pairs?.on.includes(id))
    .map((x) => ({ key: x.id, contrast: x.pairs.contrast }));
  const order = g.semantics.urgency?.order ?? [];
  return {
    id,
    intent: k.intent,
    use_for: k.use_for,
    not_for: k.not_for,
    ...(k.pairs && { sits_on: k.pairs.on, contrast: k.pairs.contrast }),
    ...(k.exempt && { exempt: k.exempt }),
    ...(takes.length && { takes }),
    ...(order.includes(id) && {
      urgency: {
        level: order.indexOf(id) + 1,
        of: order,
        rule: g.semantics.urgency.description,
      },
    }),
  };
}

/** A copy of a scheme whose semantic tokens carry the grammar's intent as their $description. */
export function withGuidance(scheme, g) {
  const all = ids(g);
  const walk = (node, path) =>
    Object.fromEntries(
      Object.entries(node).map(([k, v]) => {
        if (k.startsWith("$") || !v || typeof v !== "object") return [k, v];
        const p = path ? `${path}.${k}` : k;
        if ("$value" in v)
          return [
            k,
            all.has(p) ? { ...v, $description: all.get(p).intent } : v,
          ];
        return [k, walk(v, p)];
      }),
    );
  return {
    ...scheme,
    tokens: { ...scheme.tokens, semantic: walk(scheme.tokens.semantic, "") },
  };
}
