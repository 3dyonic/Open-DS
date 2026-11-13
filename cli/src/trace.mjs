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
import { graphNodes, roleOf } from "./decision-graph.mjs";
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

  // The grammar's rules for this kind of token: the decision mapping and the trace rules, as one (OD-303).
  const grammarLink = (name) => {
    const ids = cited(decidersOf(g, name));
    const rule = (g.trace ?? []).find((r) => r.tokens.some((p) => matches(p, name)));
    const entry = mappingOf(g, name);
    return ids.length ? { by: "grammar", because: ids, why: null, says: rule?.says ?? null, property: entry?.title ?? null } : null;
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

// ---------- The reason form (OD-294) ----------

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const markerOf = (marker) => new RegExp(`(^|[^a-z])${escapeRe(marker)}([^a-z]|$)`, "i");

/** The grammar property (corner, line width, focus ring, shadow) whose tokens include this one, or null. */
/** The decision mapping entry that covers a token (OD-303): { property, title, question, jobs }, or null. */
export function mappingOf(g, name) {
  // A short name ("color.action.primary") also names its default member ("color.action.primary.@"). The
  // most specific pattern wins: "motion.duration.feedback" over "motion.duration.*".
  const wild = (pattern) => pattern.split(".").filter((seg) => seg === "*").length;
  let best = null;
  for (const entry of g.mapping ?? [])
    for (const pattern of entry.tokens)
      if ((matches(pattern, name) || matches(pattern, `${name}.@`)) && (!best || wild(pattern) < best.wild)) best = { entry, wild: wild(pattern) };
  return best?.entry ?? null;
}

/** The grammar question that decides a token, from the decision mapping (OD-303); null when no entry covers it. */
export function decidingQuestion(g, name) {
  return mappingOf(g, name)?.question ?? null;
}

/**
 * The questions that decide a token: the decision mapping's question first, then the grammar trace
 * rule's questions. One rule set for every scope (OD-303). [] when neither covers the token.
 */
export function decidersOf(g, name) {
  const rule = (g.trace ?? []).find((r) => r.tokens.some((p) => matches(p, name) || matches(p, `${name}.@`)));
  const question = decidingQuestion(g, name);
  return [...new Set([...(question ? [question] : []), ...(rule?.follows ?? [])])];
}

/** The answers a scheme's answer follows from, and theirs, to the root: the scheme's own reason graph. */
export function answerClosure(scheme, ids) {
  const byId = new Map((scheme.answers ?? []).map((a) => [a.question, a]));
  const seen = new Set();
  const stack = [...ids];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    stack.push(...(byId.get(id)?.because ?? []));
  }
  return seen;
}

/** The answer ids a reason's text names in brackets: "(spacing.values)". */
export const namedAnswers = (why) => [...String(why ?? "").matchAll(/\(([a-z]+\.[a-z0-9]+)\)/g)].map((m) => m[1]);

/**
 * What a reason may cite: the token's deciders and the other questions of their scope, the contrast floor's
 * answer, the answers they follow from, and the context answers (business, people, tasks and the other reasons) that say why the answer applies.
 * A scope answer that decides another kind of token is not allowed: it is a wrong link.
 */
export function allowedCitations(scheme, g, deciders) {
  const context = (g.reasons ?? []).flatMap((group) => group.questions.map((q) => q.id));
  // The other questions of a decider's own scope shape the same tokens ("Which text roles?" for a weight).
  const scopes = new Set(deciders.map((id) => id.split(".")[0]));
  const sameScope = (g.scopes ?? []).filter((s) => scopes.has(s.id)).flatMap((s) => s.questions.map((q) => q.id));
  return new Set([...answerClosure(scheme, [...deciders, "accessibility.definition"]), ...context, ...sameScope]);
}

/**
 * A reason's citations as the engine allows them (OD-303): the allowed ids (allowedCitations), and any
 * other answer only when the reason's text names it in brackets, so a link across scopes is explicit. When none of the token's deciders
 * is cited, the deciders the scheme answers come first. The writers use this; citationGaps checks it.
 */
export function citationsOf(scheme, g, token, because, why = "") {
  const deciders = decidersOf(g, token);
  const answered = new Set((scheme.answers ?? []).map((a) => a.question));
  const allowed = allowedCitations(scheme, g, deciders);
  // A link to another scope's answer stays only when the text names it and says why.
  const named = namedAnswers(why).filter((id) => answered.has(id));
  const kept = [...(because ?? []), ...named].filter((id) => allowed.has(id) || named.includes(id));
  const lead = kept.some((id) => deciders.includes(id)) ? [] : deciders.filter((id) => answered.has(id));
  return [...new Set([...lead, ...kept])];
}

/**
 * The reasons whose citations do not follow the engine (OD-303). A reason must cite a question that
 * decides its token (missing), may cite only what allowedCitations allows or its text names (stray), and
 * must cite every answer its text names (uncited). [{ token, where, because, deciders, missing, stray }]
 */
export function citationGaps(scheme, g) {
  const out = [];
  for (const r of writtenReasons(scheme)) {
    if (!r.because.length) continue;
    const deciders = decidersOf(g, r.token);
    const allowed = allowedCitations(scheme, g, deciders);
    const missing = deciders.length ? !r.because.some((id) => deciders.includes(id)) : true;
    const named = namedAnswers(r.why);
    const stray = r.because.filter((id) => !allowed.has(id) && !named.includes(id));
    // An answer the text names in brackets is cited, so the words and the links agree.
    const uncited = named.filter((id) => id in questions(g) && !r.because.includes(id));
    if (missing || stray.length || uncited.length) out.push({ token: r.token, where: r.where, because: r.because, deciders, missing, stray, uncited });
  }
  return out;
}

export function propertyOf(g, name) {
  for (const scope of g.scopes ?? [])
    for (const p of scope.properties ?? []) if (p.tokens.some((pattern) => matches(pattern, name))) return p;
  return null;
}

/**
 * What a reason misses of the grammar's reason form: the id of each part whose marker it lacks (job:
 * "in order to", how: "does this by", effect: "so", decision: "because"), "answer" when it cites no
 * answer, and "job name" when the token's property lists jobs and the reason names none of them.
 * [] when the reason has every part.
 */
export function formGaps(g, name, why, because) {
  const parts = g.reason_form?.parts ?? [];
  const text = sentenceOf(why);
  if (!text) return [...parts.map((p) => p.id), "answer"];
  const gaps = parts.filter((p) => !markerOf(p.marker).test(text)).map((p) => p.id);
  if (!because?.length) gaps.push("answer");
  const jobs = propertyOf(g, name)?.jobs ?? [];
  if (jobs.length && !jobs.some((j) => markerOf(j.id).test(text))) gaps.push("job name");
  return gaps;
}

/**
 * The values whose reason (the one reasonOf finds) is not in the reason form, with the parts it
 * misses. A value with no reason of its own misses every part. [{ token, missing }]
 */
export function formReasons(trace, g) {
  return trace.tokens
    .map((t) => {
      const r = reasonOf(t);
      return { token: t.token, missing: formGaps(g, t.token, r.why, r.because) };
    })
    .filter((x) => x.missing.length);
}

/**
 * Every reason a scheme writes on its semantic tokens and its theme picks, in every brand and mode.
 * [{ token, where, why, because }]; where is "own" or "<brand>/<mode>".
 */
export function writtenReasons(scheme) {
  const out = [];
  for (const [path, node] of flatTokens(scheme.tokens.semantic)) {
    const ext = extOf(node);
    if (ext.why) out.push({ token: shortName(path), where: "own", why: ext.why, because: ext.because ?? [] });
  }
  for (const [brand, def] of Object.entries(scheme.tokens.brands ?? {}))
    for (const [mode, theme] of Object.entries(def.theme ?? {})) {
      if (mode.startsWith("$")) continue;
      for (const [path, node] of flatTokens(theme)) {
        const ext = extOf(node);
        if (ext.why) out.push({ token: shortName(path), where: `${brand}/${mode}`, why: ext.why, because: ext.because ?? [] });
      }
    }
  return out;
}

/**
 * A token's decision tree (OD-303): one node per part of its name and per step of its value, each with what
 * the grammar and the scheme record for it. Nothing is typed per token: the walk reads the grammar's
 * dictionary (semantics.groups, semantics.variants, semantics.keys), the decision mapping and trace rules
 * (the property and the answers that decide it), the theme pick, and the primitive hue and step.
 * Levels, in order: group (each group of the name), variant (the name's last part), role (a color or type token's
 * role and jobs, OD-304), property (what kind of value, decided_by and jobs), rule (the slot and its step),
 * connection (each with its checks), value, reason (the sentence written from the grammar's fields),
 * token, pick, hue, step. [{ level, name, says, ... }]. index is the scheme's token index for this brand
 * and mode, when the caller has one.
 */
export function decisionTree(scheme, g, name, { brand = Object.keys(scheme.tokens.brands)[0], mode = "light", index } = {}) {
  const at = (tree, path) => path.split(".").reduce((n, k) => n?.[k], tree);
  const od = (node) => node?.$extensions?.["open-ds"] ?? {};
  const answerOf = (q) => {
    const a = (scheme.answers ?? []).find((x) => x.question === q);
    const question = questions(g)[q];
    const option = question?.options?.find((o) => o.id === a?.option);
    return a ? { id: q, question: question?.text ?? q, answer: option?.label ?? a.option, why: a.why ?? null } : null;
  };
  const nodes = [];
  // The groups of the name, outermost first: the scheme's own description, else the grammar's dictionary.
  const parts = name.split(".");
  const dictionary = new Map((g.semantics?.groups?.items ?? []).map((x) => [x.id, x.says]));
  for (let i = 1; i < parts.length; i++) {
    const path = parts.slice(0, i).join(".");
    const says = at(scheme.tokens.semantic, path)?.$description ?? dictionary.get(path);
    if (says) nodes.push({ level: "group", name: path, says });
  }
  // The variant: what the name's last part means, from the grammar's vocabulary.
  const variant = (g.semantics?.variants?.items ?? []).find((v) => v.id === parts.at(-1));
  if (variant) nodes.push({ level: "variant", name: variant.id, says: variant.says });
  // The property: what kind of value this is, the answers that decide it (decidersOf) and the jobs it does.
  const short = name.replace(/\.@$/, "");
  const entry = mappingOf(g, short);
  // A role's token (color, type) has its role, rule, connections, value and reason (OD-304): the role sits before its property.
  const graph = roleOf(g, short) ? graphNodes(scheme, g, name, { brand, mode, ...(index && { index }) }) : [];
  // A role is decided by the answers that create or shape it (madeBy), the same ones its reason cites.
  const role = graph.find((n) => n.level === "role");
  const decided = (role ? [...role.creates, ...role.shapes] : decidersOf(g, short)).map(answerOf).filter(Boolean);
  nodes.push(...graph.filter((n) => n.level === "role"));
  if (entry || decided.length)
    nodes.push({
      level: "property",
      name: entry?.title ?? null,
      says: (g.trace ?? []).find((r) => r.tokens.some((p) => matches(p, short)))?.says ?? null,
      decided_by: decided,
      jobs: (entry?.jobs ?? []).map((j) => ({ title: j.title, how: j.how })),
    });
  nodes.push(...graph.filter((n) => n.level !== "role"));
  // The token itself: its intent and uses from the grammar's semantics.
  const key = (g.semantics?.keys ?? []).find((k) => k.id === name || k.id === short);
  const token = at(scheme.tokens.semantic, name);
  nodes.push({ level: "token", name, says: key?.intent ?? token?.$description ?? null, use_for: key?.use_for ?? [], not_for: key?.not_for ?? [] });
  // The theme pick: the step this brand and mode picks, and why.
  const themePath = (token?.$value ?? "").match(/^\{theme\.(.+)\}$/)?.[1];
  const theme = scheme.tokens.brands[brand]?.theme ?? {};
  const pick = themePath && (at(theme[mode], themePath) ?? at(theme.base, themePath));
  if (pick) nodes.push({ level: "pick", name: `${brand}/${mode}`, value: pick.$value, says: od(pick).why ?? null });
  // The primitive hue and step the value ends on: the hue's record and the step's own adjustment, if any.
  const ref = (pick?.$value ?? token?.$value ?? "").match(/^\{(color\.([a-z-]+)\.(light|dark)\.([0-9a-z]+))\}$/);
  if (ref) {
    const [, , hue, side, step] = ref;
    const group = at(scheme.tokens.primitive, `color.${hue}`);
    const rec = od(group)[side];
    nodes.push({ level: "hue", name: hue, says: group?.$description ?? null, key: rec?.key ?? null });
    const adjust = rec?.adjust?.[step];
    nodes.push({ level: "step", name: `${hue}.${side}.${step}`, says: adjust?.why ?? (rec?.key ? `Generated from the ${hue} key color ${rec.key} by the scheme's step curve.` : null) });
  }
  return nodes;
}
