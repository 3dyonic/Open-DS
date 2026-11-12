// The trace engine: every semantic value of a scheme, traced to the answers that decide it. One source
// for the decision coverage check, the Token map, the CLI and the agents, so they never disagree.
//
// A value is traced when one of these links reaches an answer the scheme gives, in this order:
//   pick   its theme pick cites answers (because) and says why;
//   own    the token itself cites answers;
//   group  a group above it cites answers (the component spacing map's rhythm);
//   rule   a usage rule names it and cites answers;
//   grammar a trace rule in the grammar names which questions decide this kind of token.
// A grammar trace rule names one kind of token, never a whole scope: a scope-wide fallback once tied
// the button's height to the contrast answer (OD-273). No file access: the caller passes the scheme
// and the grammar.
import { tokenIndex } from "./lands.mjs";
import { questions } from "./schemes.mjs";
import { flatTokens } from "./tokens.mjs";

/** The order the links are read in, and their plain names. */
export const LINKS = [
  { id: "pick", title: "Theme pick" },
  { id: "own", title: "The token's own reason" },
  { id: "group", title: "The group's reason" },
  { id: "rule", title: "Usage rule" },
  { id: "grammar", title: "Grammar trace rule" },
];

// A token name in a rule's text: two or more dotted segments ("type.body", "size.control.default").
const TOKEN_NAME = /[a-z][a-z0-9-]*(?:\.[a-z0-9_@-]+)+/g;
const THEME_REF = /\{theme\.([^}]+)\}/g;
const shortName = (path) => path.replace(/\.@$/, "");
const extOf = (node) => node?.$extensions?.["open-ds"] ?? {};
const stop = (s) => String(s ?? "").trim().replace(/[.\s]+$/, "");

/** True when a trace rule pattern names this token: "*" stands for one segment of the name. */
export function matches(pattern, name) {
  const p = pattern.split(".");
  const n = name.split(".");
  return p.length === n.length && p.every((seg, i) => seg === "*" || seg === n[i]);
}

/**
 * Every semantic value of the scheme with its links. { scheme, total, tokens: [{ token, value, links:
 * [{ by, because, why }], because }] }, in the scheme's token order. because is every answer the links
 * cite, first link first; an empty list means the value rests on no decision.
 */
export function traceScheme(scheme, g) {
  const asked = questions(g);
  const answered = new Set((scheme.answers ?? []).map((a) => a.question));
  // An id that the grammar does not ask, or this scheme does not answer, links nothing.
  const cited = (because) => [...new Set((because ?? []).filter((id) => id in asked && answered.has(id)))];

  // A deprecated alias decides nothing of its own: it points at the token that does (OD-286).
  const semantics = flatTokens(scheme.tokens.semantic).filter(([, t]) => !t.$deprecated);
  const names = new Set(semantics.map(([p]) => shortName(p)));

  // A rule names a token ("color.status.danger") or a group of tokens ("type.body"), never a part of a
  // name: "type.body" does not name "type.body-strong".
  const byRule = new Map();
  for (const rule of scheme.usage ?? []) {
    const ids = cited(rule.because);
    if (!ids.length) continue;
    for (const [name] of String(rule.use ?? "").matchAll(TOKEN_NAME)) {
      const hits = names.has(name) ? [name] : [...names].filter((n) => n.startsWith(`${name}.`));
      for (const n of hits) {
        const list = byRule.get(n) ?? [];
        if (!list.some((l) => l.situation === rule.situation))
          list.push({ situation: rule.situation, because: ids, why: rule.why ?? null, exact: name === n });
        byRule.set(n, list);
      }
    }
  }

  const brands = Object.keys(scheme.tokens.brands ?? {});
  const themes = (scheme.themes ?? []).map((t) => tokenIndex(scheme, { brand: t.brand ?? brands[0], mode: t.mode ?? t.id }));
  // The answers the theme picks of a value cite, in any brand and mode, with the first pick's why.
  const pickLink = (value) => {
    const ids = [];
    let why = null;
    for (const [, pick] of JSON.stringify(value ?? "").matchAll(THEME_REF))
      for (const ix of themes) {
        const ext = extOf(ix.byPath.get(`theme.${pick}`));
        ids.push(...cited(ext.because));
        why ??= ext.why ?? null;
      }
    return ids.length ? { by: "pick", because: [...new Set(ids)], why } : null;
  };

  // A step the group generates (the component spacing map) says how the group's rule makes it, then the
  // rule's reason: a computed fact, never a new claim.
  const stepWhy = (path, groupExt) => {
    let node = scheme.tokens.semantic;
    for (const k of path.split(".")) node = node?.[k];
    const ext = extOf(node);
    const step = path.split(".").at(-1);
    const ref = String(node?.$value ?? "").replace(/[{}]/g, "");
    if (!groupExt.why) return null;
    if (ext.multiplier === undefined) return node?.$description ? `${step}: ${stop(node.$description)}. ${groupExt.why}` : null;
    const held = (groupExt.fixed ?? []).includes(step) || ext.fixed;
    return `${step}: ${ext.multiplier} × the base step${held ? ", held at every rhythm" : `, times the rhythm ${groupExt.rhythm}`}, so it is ${ref}. ${groupExt.why}`;
  };

  // The nearest group above a token that cites answers.
  const groupLink = (path) => {
    const parts = path.split(".");
    for (let i = parts.length - 1; i > 0; i--) {
      let node = scheme.tokens.semantic;
      for (const k of parts.slice(0, i)) node = node?.[k];
      const ext = extOf(node);
      const ids = cited(ext.because);
      if (!ids.length) continue;
      const group = parts.slice(0, i).join(".");
      return { by: "group", because: ids, why: stepWhy(path, ext) ?? ext.why ?? null, group };
    }
    return null;
  };

  const traceRules = g.trace ?? [];
  const grammarLink = (name) => {
    const rule = traceRules.find((r) => r.tokens.some((p) => matches(p, name)));
    const ids = cited(rule?.follows);
    return ids.length ? { by: "grammar", because: ids, why: null, says: rule.says } : null;
  };

  const tokens = semantics.map(([path, token]) => {
    const name = shortName(path);
    const own = cited(extOf(token).because);
    const links = [
      pickLink(token.$value),
      own.length ? { by: "own", because: own, why: extOf(token).why ?? null } : null,
      groupLink(path),
      ...(byRule.get(name) ?? []).map((r) => ({ by: "rule", because: r.because, why: r.why, situation: r.situation, exact: r.exact })),
      grammarLink(name),
    ].filter(Boolean);
    return { token: name, value: token.$value, links, because: [...new Set(links.flatMap((l) => l.because))] };
  });
  return { scheme: scheme.id, total: tokens.length, tokens };
}

/** The scheme's values that rest on no decision, as traceScheme gives them. */
export const untraced = (trace) => trace.tokens.filter((t) => !t.because.length);

/** One token's trace, or null when the scheme has no such semantic. */
export function traceToken(trace, name) {
  return trace.tokens.find((t) => t.token === shortName(name)) ?? null;
}

/**
 * A token's chain in plain text for people at a terminal: the value, each link and the answers it
 * reaches, then each answer's own why and the answers it follows from.
 */
export function traceText(scheme, g, t) {
  const asked = questions(g);
  const answers = new Map((scheme.answers ?? []).map((a) => [a.question, a]));
  const say = (id) => {
    const a = answers.get(id);
    const option = asked[id]?.options?.find((o) => o.id === a?.option);
    return `${id}: ${asked[id]?.text ?? id} ${option?.label ?? "?"}.${a?.why ? ` ${a.why}` : ""}`;
  };
  const lines = [`${t.token} = ${typeof t.value === "string" ? t.value : JSON.stringify(t.value)}`];
  if (!t.links.length) return [...lines, "  No decision reaches this value yet."].join("\n");
  const title = Object.fromEntries(LINKS.map((l) => [l.id, l.title]));
  for (const l of t.links) {
    const where = l.situation ? ` (${l.situation})` : l.group ? ` (${l.group})` : "";
    lines.push(`  ${title[l.by]}${where}: ${l.why ?? l.says ?? ""}`.trimEnd());
    for (const id of l.because) lines.push(`    ← ${say(id)}`);
  }
  // The answers behind those answers, once each.
  const seen = new Set(t.because);
  const queue = [...t.because];
  const deeper = [];
  while (queue.length) {
    const id = queue.shift();
    for (const b of answers.get(id)?.because ?? [])
      if (!seen.has(b) && asked[b]) {
        seen.add(b);
        queue.push(b);
        deeper.push(`    ← ${say(b)}`);
      }
  }
  if (deeper.length) lines.push("  Behind those answers:", ...deeper);
  return lines.join("\n");
}

/**
 * How well a value's reason explains it. A reason is the value's own when its theme pick, the token
 * itself or the group that generates it says why, or a usage rule names exactly this token. A rule
 * that names a whole group (type.body) explains the group, not this value: it is borrowed. Returns
 * { kind: "own" | "exact-rule" | "borrowed" | "linked" | "none", why, because }.
 */
export function reasonOf(t) {
  const own = t.links.find((l) => ["pick", "own", "group"].includes(l.by) && l.why);
  if (own) return { kind: "own", why: own.why, because: own.because, by: own.by };
  const exact = t.links.find((l) => l.by === "rule" && l.exact && l.why);
  if (exact) return { kind: "exact-rule", why: exact.why, because: exact.because, by: "rule" };
  if (t.links.some((l) => l.by === "rule")) return { kind: "borrowed", why: null, because: t.because };
  return { kind: t.links.length ? "linked" : "none", why: null, because: t.because };
}

// The words a reason must use to be about this value: a part of its name (heading, gap, control) or
// its value's step (1_1 → 1.1, space.6 → 6).
function namesOf(t) {
  const segs = t.token.split(".").slice(1).flatMap((s) => [s, s.replace(/-/g, " ")]);
  const ref = /^\{([^}]+)\}$/.exec(typeof t.value === "string" ? t.value : "")?.[1] ?? "";
  const step = ref.split(".").at(-1)?.replace(/_/g, ".");
  return [...new Set([...segs, ...(step ? [step, ref] : [])])].filter((w) => w && w !== "@" && w.length > 1);
}

// A reason without the step a pick names at its start ("radius.2: …"), to compare reasons as sentences.
const sentenceOf = (why) => String(why ?? "").replace(/^[a-z0-9.-]+(\.[a-z0-9_-]+)+:\s*/i, "").trim();

/**
 * The values whose reason does not explain them, with what is wrong: no reason of its own; a reason
 * under 6 words; a reason that cites no answer; a token's own reason that names neither its job nor its
 * step; or the same sentence as another value's, so it cannot say why the two differ.
 * [{ token, kind, problem }]
 */
export function weakReasons(trace) {
  const reasons = trace.tokens.map((t) => ({ t, r: reasonOf(t) }));
  const seen = new Map();
  for (const { t, r } of reasons) if (r.why) seen.set(sentenceOf(r.why), [...(seen.get(sentenceOf(r.why)) ?? []), t.token]);
  const weak = [];
  for (const { t, r } of reasons) {
    // Steps of one scale (color.neutral.0 … 950) share the decision that picks the scale: one reason.
    const scaleOf = (name) => (/\.\d+$/.test(name) ? name.replace(/\.\d+$/, "") : null);
    const twins = r.why
      ? seen.get(sentenceOf(r.why)).filter((x) => x !== t.token && !(scaleOf(x) && scaleOf(x) === scaleOf(t.token)))
      : [];
    const problem =
      r.kind !== "own" && r.kind !== "exact-rule"
        ? r.kind === "borrowed"
          ? "only a rule for its whole group explains it"
          : "no reason of its own"
        : sentenceOf(r.why).split(/\s+/).length < 6
          ? "the reason is under 6 words"
          : !r.because?.length
            ? "the reason cites no answer"
            : r.by === "own" && !namesOf(t).some((w) => r.why.toLowerCase().includes(w.toLowerCase()))
              ? `the reason names neither its job nor its step (${namesOf(t).slice(0, 4).join(", ")})`
              : twins.length
                ? `the same reason as ${twins.slice(0, 3).join(", ")}`
                : null;
    if (problem) weak.push({ token: t.token, kind: r.kind, why: r.why, problem });
  }
  return weak;
}
