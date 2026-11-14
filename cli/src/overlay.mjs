// The overlay: the user's layer on top of a source scheme (ADR-002 sections 4 and 5). It holds changed
// answers, then changed picks, usage rules and tokens, each with a why and a because. This module joins a
// source and an overlay, and lists what a changed answer asks the user to review. It reads no files.

import { flatTokens, tokenAt } from "./tokens.mjs";
import { planChange } from "./tools.mjs";
import { questions } from "./schemes.mjs";

/** The kinds of overlay entry, in the order the build applies them. */
export const ENTRY_KINDS = ["answers", "picks", "usage", "tokens"];

/** The theme modes a pick can name. */
export const MODES = ["base", "light", "dark"];

/** The why of an entry that an upgrade carried over from an older project's scheme.json. */
export const CARRIED_WHY = "carried over from scheme.json";

/** The overlay of a project that changes nothing: the scheme is its source. */
export function emptyOverlay(source) {
  return {
    $comment:
      "Your changes to the source scheme. Each entry has a why and a because. Edit this file, then run: open-ds build.",
    source: { scheme: source.id, version: source.version },
    answers: [],
    picks: [],
    usage: [],
    tokens: [],
    reviewed: [],
  };
}

/** The theme path of a pick: "theme.radius.control" is radius.control in the brand's theme. */
const pickPath = (token) => token.replace(/^theme\./, "");

/** The key of each overlay entry, the same id the review list uses: usage:card, pick:default/base/radius.control. */
export const entryKey = {
  answers: (e) => `answer:${e.question}`,
  picks: (e) => `pick:${e.brand}/${e.mode}/${pickPath(e.token)}`,
  usage: (e) => `usage:${e.situation}`,
  tokens: (e) => `token:${e.path}`,
};

/** The source's value under an overlay entry's key, or undefined when the source has none. */
export function sourceValue(source, kind, entry) {
  if (kind === "answers") {
    const a = source.answers.find((x) => x.question === entry.question);
    return a && { option: a.option, why: a.why };
  }
  if (kind === "usage") {
    const u = source.usage.find((x) => x.situation === entry.situation);
    return u && { use: u.use, not: u.not, why: u.why };
  }
  const t =
    kind === "picks"
      ? tokenAt(source.tokens.brands[entry.brand]?.theme?.[entry.mode] ?? {}, pickPath(entry.token))
      : tokenAt(source.tokens, entry.path);
  return t && { value: t.$value, why: t.$extensions?.["open-ds"]?.why };
}

/**
 * Every problem with an overlay against its source, one plain line each: a wrong source, an entry for a
 * question, situation, brand, mode or token the source does not have, or a because that cites a question
 * the joined scheme does not answer. [] when the overlay is fine. The JSON Schema checks the shape first.
 */
export function overlayProblems(source, overlay, g) {
  const problems = [];
  if (overlay.source?.scheme !== source.id)
    problems.push(`The overlay's source is "${overlay.source?.scheme}", not "${source.id}".`);
  const qs = questions(g);
  for (const a of overlay.answers ?? []) {
    const q = qs[a.question];
    if (!q) problems.push(`answers: "${a.question}" is not a grammar question.`);
    else if (!q.options.some((o) => o.id === a.option))
      problems.push(`answers: "${a.option}" is not an option of ${a.question}: ${q.options.map((o) => o.id).join(", ")}.`);
  }
  const situations = new Set(g.situations.map((s) => s.id));
  for (const u of overlay.usage ?? [])
    if (!situations.has(u.situation)) problems.push(`usage: "${u.situation}" is not a grammar situation.`);
  for (const p of overlay.picks ?? []) {
    if (!source.tokens.brands[p.brand])
      problems.push(`picks: ${source.id} has no brand "${p.brand}". Brands: ${Object.keys(source.tokens.brands).join(", ")}.`);
    else if (!sourceValue(source, "picks", p)) problems.push(`picks: ${p.brand}/${p.mode} has no theme token ${p.token}.`);
  }
  for (const t of overlay.tokens ?? [])
    if (!sourceValue(source, "tokens", t)) problems.push(`tokens: ${source.id} has no token ${t.path}.`);
  const answered = new Set([...source.answers.map((a) => a.question), ...(overlay.answers ?? []).map((a) => a.question)]);
  for (const kind of ENTRY_KINDS)
    for (const e of overlay[kind] ?? [])
      for (const b of e.because ?? [])
        if (!answered.has(b)) problems.push(`${entryKey[kind](e)} cites ${b}, which this scheme does not answer.`);
  return problems;
}

const setToken = (node, entry) => {
  node.$value = entry.value;
  node.$extensions = {
    ...node.$extensions,
    "open-ds": { ...node.$extensions?.["open-ds"], why: entry.why, because: entry.because },
  };
};

/**
 * The scheme a source and an overlay make: each overlay entry replaces the source's value at its key, and
 * the last entry for a key wins. With an empty overlay, the result equals the source. An overlay with its
 * own id makes a new scheme that keeps the source as a link (ADR-002 section 9).
 */
export function applyOverlay(source, overlay) {
  const scheme = structuredClone(source);
  if (overlay.id) scheme.id = overlay.id;
  if (overlay.name) scheme.name = overlay.name;
  if (overlay.id && overlay.version) scheme.version = overlay.version;
  for (const a of overlay.answers ?? []) {
    const at = scheme.answers.find((x) => x.question === a.question);
    const next = { question: a.question, option: a.option, why: a.why, because: a.because ?? at?.because ?? [] };
    if (at) Object.assign(at, next);
    else scheme.answers.push(next);
  }
  for (const u of overlay.usage ?? []) {
    const at = scheme.usage.find((x) => x.situation === u.situation);
    if (at) Object.assign(at, u);
    else scheme.usage.push({ ...u });
  }
  for (const p of overlay.picks ?? []) setToken(tokenAt(scheme.tokens.brands[p.brand].theme[p.mode], pickPath(p.token)), p);
  for (const t of overlay.tokens ?? []) setToken(tokenAt(scheme.tokens, t.path), t);
  return scheme;
}

/** The theme picks and semantic tokens whose because cites one of the moved answers, as review items. */
function citing(source, moved) {
  const items = [];
  const cites = (t) => (t.$extensions?.["open-ds"]?.because ?? []).some((b) => moved.has(b));
  for (const [brand, def] of Object.entries(source.tokens.brands))
    for (const mode of MODES)
      for (const [path, t] of flatTokens(def.theme?.[mode]))
        if (cites(t)) items.push({ id: `pick:${brand}/${mode}/${path}`, kind: "pick", what: `the ${brand} ${mode} pick for theme.${path}` });
  for (const [path, t] of flatTokens(source.tokens.semantic))
    if (cites(t)) items.push({ id: `token:semantic.${path}`, kind: "token", what: `the semantic token ${path}` });
  return items;
}

/**
 * The review list (ADR-002 section 5). For each overlay answer that differs from the source, planChange
 * names what cites it: the answers that follow from it, the usage rules, the variants, and the picks and
 * tokens. Each item stays open until the overlay edits it or lists it in reviewed. raised holds items a
 * tool put on the list, such as a new grammar question after an upgrade. Entries an upgrade carried over
 * stay open until the user confirms them. Grouped by answer.
 * Returns { groups: [{ answer, from, to, items: [{ id, kind, what, open }] }], open, total }.
 */
export function reviewList(source, overlay, g, raised = []) {
  const reviewed = new Set(overlay.reviewed ?? []);
  const edited = new Set(ENTRY_KINDS.flatMap((kind) => (overlay[kind] ?? []).map((e) => entryKey[kind](e))));
  const isOpen = (id) => !reviewed.has(id) && !edited.has(id);
  const groups = [];
  for (const a of overlay.answers ?? []) {
    const plan = planChange(source, g, { question: a.question, option: a.option });
    if (plan.same) continue;
    const moved = new Set([a.question, ...plan.follows.map((f) => f.question)]);
    const items = [
      ...plan.follows.map((f) => ({ id: `answer:${f.question}`, kind: "answer", what: `${f.text} (now ${f.answer})` })),
      ...plan.rules.map((r) => ({ id: `usage:${r.situation}`, kind: "usage", what: `the rule for ${r.situation} (now ${r.now})` })),
      ...plan.variants.map((v) => ({
        id: `variant:${v.component}/${v.axis}/${v.variant}`,
        kind: "variant",
        what: `${v.component} ${v.axis}=${v.variant}`,
      })),
      ...citing(source, moved),
    ];
    groups.push({
      answer: a.question,
      from: plan.from?.option,
      to: plan.to.option,
      items: items.map((i) => ({ ...i, open: isOpen(i.id) })),
    });
  }
  const carried = ENTRY_KINDS.flatMap((kind) =>
    (overlay[kind] ?? [])
      .filter((e) => e.why === CARRIED_WHY)
      .map((e) => ({ id: entryKey[kind](e), kind: "carried", what: `${entryKey[kind](e)}: write a real why` })),
  );
  if (carried.length) groups.push({ answer: "carried over", items: carried.map((i) => ({ ...i, open: !reviewed.has(i.id) })) });
  if (raised.length) groups.push({ answer: "raised by a tool", items: raised.map((i) => ({ ...i, open: isOpen(i.id) })) });
  const all = groups.flatMap((x) => x.items);
  return { groups, open: all.filter((i) => i.open).length, total: all.length };
}
