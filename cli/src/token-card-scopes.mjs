// The token map card for every scope but color: what one decision's card shows, from data only. Each
// card answers its scope's question with a picture and a measure against the scheme's own rule or
// floor. Type asks "Can you read it?" and "What do you read first?"; spacing "What belongs together?",
// "Does the content sit inside its box?" and "Can you hit it?"; shape "What kind of thing has this
// corner?", "Where does one region end?" and "Where is the keyboard?"; elevation "What sits on top?";
// motion "Is it fast enough to feel instant?" and "How does it arrive?"; icons "Can you tell what it
// is?" and "Does it match the text weight?".
//
// A card is { value, swatch, where, sections, hint, shared, pointsHere }: value is the token's value in the mode. A section is { ask, rows, specimen }:
// rows are numbers in pills with one phrase (facts), a meter against a floor, a note, cases side by
// side, or a missing fact. The specimen is the only thing drawn at the token's value. A fact the data
// lacks is a missing row, never filled in. Pure: the caller passes the scheme, the grammar and a
// context that resolves values in one mode.
import { allConnections } from "./decision-graph.mjs";
import { bezierAt, curveKind, familyOf, ms } from "./motion.mjs";
import { grammarRelations, px, shadeContrast, contrast } from "./shape-elevation.mjs";
import { matches } from "./trace.mjs";

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const sentence = (s) => capital(s.trim()) + (/[.!?]$/.test(s.trim()) ? "" : ".");
const fmt = (n) => String(Math.round(n * 100) / 100);
const pct = (x) => `${Math.round(x * 100)}%`;
const pxText = (n) => (n === Infinity ? "pill" : `${fmt(n)}px`);
const firstFamily = (stack) =>
  String(stack ?? "")
    .split(",")[0]
    .replace(/["']/g, "")
    .trim() || null;
const facts = (pills, say = null) => ({ type: "facts", pills, say });
const note = (text) => ({ type: "note", text });
const missing = (text) => ({ type: "missing", text });
const meter = (value, floor, max, text) => ({ type: "meter", value, floor, max: Math.max(max, value, floor), text });
// The clause a connection gives its reason in: "…, so groups read as separate." → "Groups read as separate."
const soClause = (says) => {
  const m = /, so (.+)$/.exec(says ?? "");
  return m ? sentence(m[1]) : null;
};

/** A line height in px: a length as it is, a ratio times the size. */
export function lineBoxPx(lineHeight, size) {
  const length = px(lineHeight);
  if (length !== null && /px|rem/.test(String(lineHeight))) return length;
  const ratio = Number(lineHeight);
  return Number.isFinite(ratio) && size ? Math.round(ratio * size * 10) / 10 : null;
}

/** A shadow as the map stores it ("0px 12px 32px, #1F1B1629"): { x, y, blur, spread, color, alpha }, or null. */
export function shadowParts(value) {
  const m = /^(-?[\d.]+)px (-?[\d.]+)px ([\d.]+)px(?: ([\d.]+)px)?,? (#[0-9a-f]{6}(?:[0-9a-f]{2})?)$/i.exec(
    String(value ?? "").trim(),
  );
  if (!m) return null;
  const color = m[5];
  const alpha = color.length === 9 ? Math.round((parseInt(color.slice(7), 16) / 255) * 100) : 100;
  return { x: +m[1], y: +m[2], blur: +m[3], spread: +(m[4] ?? 0), color, alpha };
}

/**
 * A place on a scale, as a hint: { ask, ticks, at, mark, n, of, say }. ticks and at are positions on the
 * track from 0 to 100; only this token's own value is labelled. Null when the token is not on the scale.
 */
export function scaleHint(values, value, { ask = "Where it sits", word, words = null, mark = null }) {
  const list = [...new Set(values.filter((v) => v !== null && v !== undefined))].sort((a, b) => a - b);
  const i = list.indexOf(value);
  if (i < 0) return null;
  if (list.length === 1) return { ask, ticks: [50], at: 50, mark, n: 1, of: 1, say: capital(`the only ${word}`) };
  const finite = list.every(Number.isFinite);
  const [lo, hi] = [list[0], list.at(-1)];
  const at = (v, j) => (finite ? ((v - lo) / (hi - lo)) * 100 : (j / (list.length - 1)) * 100);
  const [low, mid, high] = words ?? [`the smallest ${word}`, `a middle ${word}`, `the largest ${word}`];
  return {
    ask,
    ticks: list.map((v, j) => at(v, j)),
    at: at(value, i),
    mark,
    n: i + 1,
    of: list.length,
    say: capital(i === 0 ? low : i === list.length - 1 ? high : mid),
  };
}

// The answer a scheme gives a question: { option, label, why, question }, or null.
const answerOf = (ctx, id) => {
  const a = (ctx.scheme.answers ?? []).find((x) => x.question === id);
  const r = ctx.reasons[id];
  if (!a && !r) return null;
  return {
    option: a?.option ?? null,
    label: r?.answer ?? a?.option ?? null,
    why: r?.why ?? a?.why ?? null,
    question: r?.question ?? id,
  };
};
const usageOf = (ctx, situation) => (ctx.scheme.usage ?? []).find((u) => u.situation === situation) ?? null;
const connectionOf = (ctx, id) => ctx.connections.find((c) => c.id === id) ?? null;
const covers = (list, id) => [].concat(list ?? []).some((p) => matches(p, id));
// A decision's own measured connection: { holds, pairs, waits }.
const measured = (ctx, token, id) => ctx.decisions[token]?.graph?.connections?.find((c) => c.id === id) ?? null;

/**
 * The tokens with this token's value: the decisions on the same step that each land on it on their own
 * ("Shared with"), and the semantic tokens that point at it ("points here"). says is the connection that
 * ties the two, or the other token's own shorthand line or description.
 */
function sharesOf(ctx, id) {
  const step = ctx.families.flatMap((f) => f.steps).find((s) => s.decisions.includes(id));
  const says = (raw) => {
    const other = raw.replace(/\.@$/, "");
    const tie = ctx.connections.find(
      (c) => (covers(c.tokens, other) && covers(c.from, id)) || (covers(c.tokens, id) && covers(c.from, other)),
    );
    return tie?.says ?? ctx.decisions[other]?.shorthand?.line ?? ctx.decisions[other]?.description ?? null;
  };
  // A token that copies another is not a second decision: it shares nothing, and nothing shares with it.
  const shared = (ctx.decisions[id]?.via ? [] : (step?.decisions ?? []))
    .filter((o) => o !== id && !ctx.decisions[o]?.via)
    .map((token) => ({ token, says: says(token) }));
  const pointsHere = [...(ctx.index.readers.get(id) ?? []), ...(ctx.index.readers.get(`${id}.@`) ?? [])]
    .filter((r) => ctx.index.nodes.get(r)?.tier === "semantic" && !ctx.index.nodes.get(r)?.deprecated)
    .map((token) => ({ token: token.replace(/\.@$/, ""), says: says(token) }));
  return { shared, pointsHere };
}

// The values of the decisions whose id matches a pattern, in px.
const scaleOf = (ctx, re) =>
  Object.keys(ctx.decisions)
    .filter((k) => re.test(k))
    .map((k) => ctx.px(k));

// ---------- Type ----------

// The text a role is shown in: the scheme's own sentences, by what the role sets.
function textOf(samples = {}, role) {
  const messages = (samples.conversation?.messages ?? []).map((m) => m.text).filter(Boolean);
  const reading = [];
  for (const m of messages) {
    reading.push(m);
    if (reading.join(" ").length >= 90) break;
  }
  const byRole = {
    body: reading.join(" ") || null,
    data: (samples.metrics ?? []).map((m) => `${m.label} ${m.value}`).join(" · ") || null,
    label: samples.actions?.primary ?? null,
    caption: samples.field?.hint ?? null,
    heading: samples.conversation?.title ?? samples.screen ?? null,
    title: samples.screen ?? null,
    display: samples.screen ?? null,
  };
  return byRole[role] ?? null;
}

function typeCard(ctx, id) {
  const role = /^type\.([a-z]+)\.font-size$/.exec(id)?.[1];
  if (!role) return null;
  const size = ctx.px(id);
  const family = ctx.value(`type.${role}.font-family`);
  const weight = ctx.value(`type.${role}.font-weight`);
  const line = lineBoxPx(ctx.value(`type.${role}.line-height`), size);
  const d = ctx.decisions[id];
  const values = answerOf(ctx, "typography.values");
  // The grammar's smallest-text job names the desk floor; it holds where body text is small (dense data).
  const job = (ctx.grammar.mapping ?? [])
    .find((m) => m.property === "font-size")
    ?.jobs?.find((j) => j.id === "smallest-text");
  const floor =
    values?.option === "small" ? Number(/(\d+)px resolves at desk distance/.exec(job?.how ?? "")?.[1]) || null : null;
  const rows = [];
  if (floor) rows.push(meter(size, floor, 24, `${fmt(size)}px`), note(`Floor ${floor}px: readable at a desk.`));
  else if (values && d?.graph?.gets)
    rows.push(note(role === "body" ? `${values.label}, by your answer: ${d.graph.gets}.` : sentence(d.graph.gets)));
  const text = textOf(ctx.scheme.samples, role);
  if (!text) rows.push(missing(`The scheme has no sentence to set in the ${role} role.`));
  const specimen = text && {
    tag: `Specimen · set at ${fmt(size)}px`,
    as: `as ${role} text · ${firstFamily(family)} · ${weight} · on surface.canvas`,
    draw: { kind: "text", text, family, px: size, line, weight },
  };
  const sizes = ctx.families.find((f) => f.id === "font-size")?.steps.map((s) => px(s.value)) ?? [];
  const hint = scaleHint(sizes, size, { ask: "What do you read first?", word: "size", mark: fmt(size) });
  const { shared, pointsHere } = sharesOf(ctx, id);
  return {
    swatch: { kind: "type", family },
    where: null,
    sections: [{ ask: "Can you read it?", rows, specimen }],
    // The rank phrase is the role the size plays: "The body size", "A heading size".
    hint: hint && { ...hint, say: d?.graph?.role ? capital(d.graph.role) : hint.say },
    shared: shared.map((n) => ({ ...n, families: [family, ctx.value(n.token.replace(/font-size$/, "font-family"))] })),
    pointsHere,
  };
}

const BUILDERS = [typeCard];

/**
 * The card of one decision in one mode, or null for a token no scope card covers. ctx holds
 * { scheme, grammar, mode, reasons, decisions, families, index, chain, glyph }: decisions are this mode's,
 * by id; families the shared scales; index the mode's color index (nodes and readers); chain(path) the
 * alias chain in the mode's token index; glyph the icon the map draws, { name, nodes }, or null.
 */
const CONNECTIONS = new WeakMap();
export function scopeCard(context, id) {
  if (!CONNECTIONS.has(context.grammar)) CONNECTIONS.set(context.grammar, allConnections(context.grammar));
  const ctx = {
    connections: CONNECTIONS.get(context.grammar),
    ...context,
    value: (t) =>
      context.index.nodes.get(t)?.value ?? context.index.nodes.get(`${t}.@`)?.value ?? context.chain(t).value ?? null,
  };
  ctx.px = (t) => px(ctx.value(t));
  for (const build of BUILDERS) {
    const card = build(ctx, id);
    // The value in this mode: a shadow can differ in dark, while the map's step holds the light one.
    const value = ctx.value(id);
    if (card) return { value: typeof value === "string" ? value : JSON.stringify(value), ...card };
  }
  return null;
}
