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

// ---------- Spacing ----------

// Plain words for where a space sits: the grammar's use case descriptions, up to the colon.
const useCaseWord = (ctx, axis, option) => {
  const uc = ctx.grammar.scopes.find((s) => s.id === "spacing")?.use_cases;
  if (!uc) return null;
  if (!option) return axis === "reach" ? "Along a line and between blocks" : null;
  const d = uc[axis]?.options?.find((o) => o.id === option)?.description;
  return d ? d.split(":")[0] : null;
};

// A stays-apart rule between two spaces: { connection, big, small, other }, or null.
function apartRule(ctx, id) {
  const rules = ctx.connections.filter(
    (c) => c.kind === "stays-apart" && c.by === "at-least" && (covers(c.tokens, id) || covers(c.from, id)),
  );
  const own = rules.find((c) => covers(c.tokens, id)) ?? rules.find((c) => covers(c.from, id));
  if (!own) return null;
  const other = covers(own.tokens, id) ? [].concat(own.from)[0] : [].concat(own.tokens)[0];
  const [big, small] = covers(own.tokens, id) ? [id, other] : [other, id];
  return { connection: own, big, small, other };
}

function spacingCard(ctx, id) {
  const kind = /^space\.gap\./.test(id)
    ? "gap"
    : /^space\.inset\./.test(id)
      ? "inset"
      : /^size\.(control\.|hit-area$)/.test(id)
        ? "target"
        : id === "size.row"
          ? "row"
          : null;
  if (!kind) return null;
  const value = ctx.px(id);
  const useCases = ctx.scheme.tokens.semantic.space?.$extensions?.["open-ds"]?.["use-cases"] ?? {};
  const uc = useCases[id.replace(/^space\./, "")] ?? null;
  const where = uc
    ? [
        useCaseWord(ctx, "level", uc.level),
        useCaseWord(ctx, "reach", uc.reach),
        `${fmt(uc.multiple)} × ${fmt(value / uc.multiple)}px base`,
      ].filter(Boolean)
    : null;
  const sections = [];
  let hint = null;
  if (kind === "gap" || kind === "inset") {
    const rule = apartRule(ctx, id);
    const rows = [];
    let draw;
    if (rule) {
      const [big, small] = [ctx.px(rule.big), ctx.px(rule.small)];
      const ratio = big / small;
      const floor = rule.connection.times ?? 1;
      const holds = ratio >= floor;
      rows.push(
        facts(
          [`${fmt(big)}px ÷ ${fmt(small)}px`, `${fmt(ratio)}×`],
          !holds
            ? "Under the floor: the two read as one."
            : ratio === floor
              ? `Holds at the floor: ${soClause(rule.connection.says)?.toLowerCase() ?? "no room to spare."}`
              : soClause(rule.connection.says),
        ),
        note(`Floor ${fmt(floor)}×, against ${rule.other} at ${fmt(ctx.px(rule.other))}px.`),
      );
      draw = kind === "inset" ? { kind: "inset", pad: value, next: ctx.px(rule.other) } : null;
      if (kind === "gap") draw = { kind: uc?.reach === "section" ? "sections" : "groups", inner: small, outer: big };
    } else {
      // No rule ties this space to another: the next larger space of its kind is shown beside it, unmeasured.
      const next = scaleOf(ctx, kind === "gap" ? /^space\.gap\./ : /^space\.inset\./)
        .filter((v) => v > value)
        .sort((a, b) => a - b)[0];
      if (kind === "gap" && next) {
        rows.push(
          facts([`${fmt(next)}px ÷ ${fmt(value)}px`, `${fmt(next / value)}×`], "The next gap out is wider."),
          note("No rule in the scheme sets a floor for this pair."),
        );
        draw = { kind: "groups", inner: value, outer: next };
      } else {
        rows.push(note("No rule in the scheme measures this space against another."));
        draw =
          kind === "inset" ? { kind: "inset", pad: value, next: null } : { kind: "groups", inner: value, outer: value };
      }
    }
    if (kind === "gap" && uc?.reach === "section") {
      const between = usageOf(ctx, "between-sections")?.use ?? "";
      draw = { ...draw, hairline: /hairline/.test(between) };
      if (between)
        rows.push(note(/hairline/.test(between) ? "A hairline marks the break." : "No line: space alone separates."));
    }
    const what = kind === "inset" ? "a box" : draw.kind === "sections" ? "two sections" : "two groups";
    sections.push({
      ask: kind === "gap" ? "What belongs together?" : "Does the content sit inside its box?",
      rows,
      specimen: {
        tag: `Specimen · ${fmt(value)}px ${kind === "gap" ? "gap" : "inset"}`,
        as: `${what} · drawn at ${fmt(value)}px · on surface.canvas`,
        draw,
      },
    });
    hint = scaleHint(scaleOf(ctx, kind === "gap" ? /^space\.gap\./ : /^space\.inset\./), value, {
      word: kind === "gap" ? "gap" : "padding",
    });
  } else if (kind === "target") {
    // WCAG 2.5.8, as the grammar's control height job states it.
    const job = ctx.grammar.scopes.find((s) => s.id === "spacing")?.jobs?.find((j) => j.id === "control-height");
    const floor = Number(/2\.5\.8: (\d+)px/.exec(job?.how ?? "")?.[1]) || null;
    const rows = floor
      ? [
          meter(value, floor, 56, `${fmt(value)}px`),
          facts(
            [`${fmt(value)}px ÷ ${floor}px`, `${fmt(value / floor)}×`],
            value >= floor ? "Above the WCAG floor: easy to hit." : "Under the WCAG floor: hard to hit.",
          ),
          note(`Floor ${floor}px: WCAG 2.5.8 hit area.`),
        ]
      : [missing("The grammar names no hit area floor.")];
    sections.push({
      ask: "Can you hit it?",
      rows,
      specimen: {
        tag: `Specimen · ${fmt(value)}px tall`,
        as: `a control · drawn ${fmt(value)}px tall · on surface.canvas`,
        draw: { kind: "target", px: value, floor },
      },
    });
    if (/^size\.control\./.test(id))
      hint = scaleHint(scaleOf(ctx, /^size\.control\./), value, { word: "control height" });
  } else {
    const rule = connectionOf(ctx, "row-holds-target");
    const target = rule ? [].concat(rule.from)[0] : null;
    const floor = target ? ctx.px(target) : null;
    const rows = floor
      ? [
          facts(
            [`${fmt(value)}px ÷ ${fmt(floor)}px`, `${fmt(value / floor)}×`],
            value >= floor ? soClause(rule.says) : "Under the target: hard to hit.",
          ),
          note(`Floor 1×, against ${target} at ${fmt(floor)}px.`),
        ]
      : [missing("The scheme names no smallest target for a row.")];
    sections.push({
      ask: "Can the eye follow the row?",
      rows,
      specimen: {
        tag: `Specimen · ${fmt(value)}px row`,
        as: `three rows · drawn ${fmt(value)}px tall · on surface.canvas`,
        draw: { kind: "rows", px: value },
      },
    });
  }
  const swatch = { kind: kind === "gap" ? (uc?.reach === "section" ? "section-gap" : "gap") : kind };
  return { swatch, where, sections, hint, ...sharesOf(ctx, id) };
}

// ---------- Shape ----------

function shapeCard(ctx, id) {
  if (/^radius\./.test(id)) return cornerCard(ctx, id);
  if (id === "border-width.default") return lineCard(ctx, id);
  if (/^focus\.ring\./.test(id)) return ringCard(ctx, id);
  return null;
}

const lineScale = (ctx) => [ctx.px("border-width.default"), ctx.px("focus.ring.width")];

function cornerCard(ctx, id) {
  const value = ctx.px(id);
  const relations = grammarRelations(ctx.grammar);
  // The corners the count answer names, in the order the roles answer lists their kinds.
  const kindsTokens = relations.get("surface-corner")?.count?.tokens ?? [];
  const roles = answerOf(ctx, "shape.roles");
  const words = (roles?.label ?? "")
    .split(/,\s*|\s+and\s+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
  const at = kindsTokens.indexOf(id);
  const kind = at >= 0 && words.length === kindsTokens.length ? words[at].replace(/s$/, "") : null;
  const d = ctx.decisions[id];
  const rows = [];
  if (kind) {
    rows.push({ type: "kinds", kinds: words.map((w, i) => ({ word: w, on: i === at })) });
    const things = (d?.description ?? "").replace(/^Corner of /, "").split(/[:.]/)[0];
    rows.push(facts([capital(kind)], things ? `${capital(things)} keep this corner.` : null));
  } else {
    const record = (ctx.scheme.relations ?? []).find((r) => r.token === id);
    const rel = record && relations.get(record.relation);
    if (d?.description) rows.push(facts([], sentence(d.description.split(":")[0])));
    if (rel?.says) rows.push(note(rel.says));
  }
  // An inner corner is the outer corner minus the padding: the scheme's own nesting record, or the
  // padding the usage puts inside a control.
  const nest = (ctx.scheme.relations ?? []).find((r) => r.from === id && r.minus);
  const pad = nest ? nest.minus : kind === "control" ? (usageOf(ctx, "inside-a-control")?.use ?? null) : null;
  if (pad && Number.isFinite(value) && ctx.px(pad) !== null) {
    const p = ctx.px(pad);
    const inner = Math.max(0, value - p);
    const inside = kind === "container" ? "Options inside" : "What sits inside";
    rows.push(
      facts(
        [`${fmt(value)} − ${fmt(p)} = ${fmt(inner)}px inside`],
        inner > 0
          ? `${inside} ${kind === "container" ? "keep" : "keeps"} a parallel curve.`
          : kind === "container"
            ? "Options inside meet the edge square."
            : "The content sits square; the padding is wider.",
      ),
      note(`Corner minus padding (${pad.replace(/^component\./, "")}), never under zero.`),
    );
  }
  const box = kind === "control" || kind === "badge" ? "control" : "container";
  const edge = ctx.value(box === "control" ? "color.border.strong" : "color.border.default");
  return {
    swatch: { kind: "corner", px: value },
    where: null,
    sections: [
      {
        ask: "What kind of thing has this corner?",
        rows,
        specimen: {
          tag: `Specimen · ${pxText(value)} corner`,
          as: `one ${kind ?? ""} box · on surface.canvas`.replace("  ", " "),
          draw: {
            kind: "corner",
            px: Number.isFinite(value) ? value : 9999,
            height: box === "control" ? 40 : 96,
            edge,
          },
        },
      },
    ],
    hint: scaleHint(
      kindsTokens.map((k) => ctx.px(k)),
      value,
      { word: "corner", mark: pxText(value) },
    ),
    ...sharesOf(ctx, id),
  };
}

function lineCard(ctx, id) {
  const value = ctx.px(id);
  const rel = grammarRelations(ctx.grammar).get("default-line");
  const definition = answerOf(ctx, "elevation.definition");
  const lines = /line/i.test(definition?.option ?? "");
  const quiet = ctx.decisions["color.border.default"]?.contrast ?? null;
  const strong = ctx.decisions["color.border.strong"]?.contrast ?? null;
  const why = definition?.why ? [note(definition.why)] : [];
  const cases = [
    {
      title: "A divider",
      here: lines,
      rows: [
        facts(quiet ? [`${fmt(quiet.ratio)}:1`] : [], "Decorates, so it needs no minimum."),
        ...(lines ? why : []),
      ],
    },
    {
      title: "A card edge",
      here: !lines,
      rows: [facts([], "Holds a group together; no minimum."), ...(lines ? [] : why)],
    },
    {
      title: "A control's only edge",
      here: false,
      rows: strong
        ? [
            meter(strong.ratio, rel?.floor ?? strong.floor, 7, `${fmt(strong.ratio)}:1`),
            facts(
              [`${fmt(rel?.floor ?? strong.floor)}:1 floor`],
              `Lowest on ${strong.on.replace(/^color\./, "")}; it ${strong.ratio >= (rel?.floor ?? strong.floor) ? "passes" : "misses"}.`,
            ),
            ...(rel?.boundaries ? [note(`${rel.boundaries.length} input and button edges.`)] : []),
          ]
        : [missing("No contrast is measured for color.border.strong.")],
    },
  ];
  return {
    swatch: { kind: "line", px: value },
    where: null,
    sections: [
      {
        ask: "Where does one region end?",
        rows: [
          { type: "cases", cases },
          note(`Contrast from color.border.default and color.border.strong, ${ctx.mode}.`),
        ],
        specimen: {
          tag: `Specimen · ${fmt(value)}px line`,
          as: "a divider in color.border.default · a field edge in color.border.strong",
          draw: {
            kind: "lines",
            px: value,
            divider: ctx.value("color.border.default"),
            edge: ctx.value("color.border.strong"),
            corner: ctx.px("radius.control"),
          },
        },
      },
    ],
    hint: scaleHint(lineScale(ctx), value, { word: "line", mark: pxText(value) }),
    ...sharesOf(ctx, id),
  };
}

function ringCard(ctx, id) {
  const width = ctx.px("focus.ring.width");
  const offset = ctx.px("focus.ring.offset");
  const line = ctx.px("border-width.default");
  const corner = ctx.px("radius.control");
  const value = ctx.px(id);
  const ring = Number.isFinite(corner) ? corner + offset : null;
  return {
    swatch: { kind: "ring", px: width, offset, color: ctx.value("color.border.focus") },
    where: null,
    sections: [
      {
        ask: "Where is the keyboard?",
        rows: [
          facts(
            [`${fmt(width)}px ring`, `${fmt(offset)}px gap`],
            width > line
              ? `One step heavier than the ${fmt(line)}px line.`
              : `No heavier than the ${fmt(line)}px line.`,
          ),
          ...(ring !== null
            ? [
                facts(
                  [`${fmt(corner)} + ${fmt(offset)} = ${fmt(ring)}px ring corner`],
                  "The ring runs parallel to the control.",
                ),
                note("Ring corner is the control corner plus the gap."),
              ]
            : []),
        ],
        specimen: {
          tag: `Specimen · ${fmt(width)}px ring, ${fmt(offset)}px gap`,
          as: "a control with keyboard focus · on surface.canvas",
          draw: {
            kind: "ring",
            px: width,
            offset,
            corner: Number.isFinite(corner) ? corner : 9999,
            color: ctx.value("color.border.focus"),
            edge: ctx.value("color.border.strong"),
          },
        },
      },
    ],
    hint: id === "focus.ring.width" ? scaleHint(lineScale(ctx), value, { word: "line", mark: pxText(value) }) : null,
    ...sharesOf(ctx, id),
  };
}

// ---------- Elevation ----------

// A layer's fill and edge: the component that casts the shadow, its background and its border.
function layerOf(ctx, id) {
  const caster = (ctx.index.readers.get(id) ?? []).find((r) =>
    /^component\.(card|overlay|popover\.content)\.shadow$/.test(r),
  );
  const base = caster?.replace(/\.shadow$/, "");
  const resolve = (part) => {
    for (const p of [`${base}.${part}`, `${base}.${part}.@`]) {
      const chain = ctx.chain(p);
      if (chain.value !== null)
        return { value: chain.value, token: chain.hops.find((h) => !h.startsWith("component.")) ?? null };
    }
    return null;
  };
  return base ? { fill: resolve("background"), border: resolve("border") } : { fill: null, border: null };
}

function elevationCard(ctx, id) {
  if (!/^elevation\./.test(id)) return null;
  const rel = grammarRelations(ctx.grammar).get("layer-step");
  const step = rel?.steps?.[id] ?? null;
  const n = rel?.steps ? Object.keys(rel.steps).length : null;
  const roles = answerOf(ctx, "elevation.roles");
  const values = answerOf(ctx, "elevation.values");
  const lands = answerOf(ctx, "elevation.lands");
  const definition = answerOf(ctx, "elevation.definition");
  const rises = (rel?.by_answer?.options?.[roles?.option] ?? []).includes(id);
  const sh = shadowParts(ctx.value(id));
  const canvas = ctx.value("color.surface.canvas");
  const layer = layerOf(ctx, id);
  const fill = layer.fill;
  // A floating layer with no edge of its own is drawn by the ring the dark-shade relation names.
  const ring = grammarRelations(ctx.grammar).get("dark-shade")?.depth?.ring ?? null;
  const border = layer.border ?? (rises && ring ? { value: ctx.value(ring), token: ring } : null);
  const rows = [];
  if (!sh) rows.push(missing("The shadow value does not read as one shadow."));
  else {
    const nums =
      sh.alpha === 0 ? ["No shadow"] : [`${fmt(sh.y)}px down`, `${fmt(sh.blur)}px blur`, `${sh.alpha}% shade`];
    const say = rises
      ? lands?.label
        ? `${lands.label} float at this height.`
        : "Floats at this height."
      : roles?.label
        ? `Cards stay on the page; ${roles.label.toLowerCase()} rises.`
        : null;
    rows.push(facts([...(step && n ? [`Step ${step} of ${n}`] : []), ...nums], say));
  }
  if (roles && values) rows.push(note(`${roles.question} ${roles.label}. ${values.question} ${values.label}.`));
  if (!rises && definition)
    rows.push({
      type: "cases",
      cases: [
        {
          title: "What separates cards instead",
          tag: definition.label,
          here: true,
          rows: definition.why ? [note(definition.why)] : [],
        },
      ],
    });
  const seen = [];
  const fillRatio = fill?.value && canvas ? contrast(fill.value.slice(0, 7), canvas.slice(0, 7)) : null;
  if (sh && sh.alpha === 0) {
    seen.push(
      facts(["No shade", ...(fillRatio ? [`fill ${fmt(fillRatio)}:1`] : [])], "Nothing lifts it; it sits on the page."),
      note(`Fill against color.surface.canvas, ${ctx.mode}.`),
    );
  } else if (sh) {
    const shade = canvas ? shadeContrast(sh.color, canvas.slice(0, 7)) : null;
    seen.push(
      facts(
        [...(shade ? [`shade ${fmt(shade)}:1`] : []), ...(fillRatio ? [`fill ${fmt(fillRatio)}:1`] : [])],
        fillRatio && shade && fillRatio > shade
          ? "The lighter fill sets it apart, more than the shade."
          : "The shade sets it apart; the fill matches the page.",
      ),
      note(`Deepest shade and fill against color.surface.canvas, ${ctx.mode}.`),
    );
  }
  if (!fill) seen.push(missing("No component fill is found for this layer."));
  const css = sh ? `${sh.x}px ${sh.y}px ${sh.blur}px ${sh.spread}px ${sh.color}` : "none";
  return {
    swatch: { kind: "layer", lift: rises && step ? step : 0 },
    where: null,
    sections: [
      { ask: "What sits on top, and how high?", rows },
      {
        ask: `Is it seen in ${ctx.mode}?`,
        rows: seen,
        specimen: {
          tag: sh && sh.alpha > 0 ? `Specimen · ${sh.x}px ${sh.y}px ${sh.blur}px shadow` : "Specimen · no shadow",
          as: `${rises ? "one floating panel" : "one card"}${fill?.token ? ` in ${fill.token}` : ""}${border?.token ? `, edge ${border.token}` : ""} · on color.surface.canvas`,
          draw: {
            kind: "layer",
            shadow: css,
            fill: fill?.value ?? null,
            border: border?.value ?? null,
            width: ctx.px("border-width.default"),
            corner: ctx.px("radius.surface"),
          },
        },
      },
    ],
    hint:
      step && n
        ? scaleHint(Object.values(rel.steps), step, {
            word: "layer",
            words: ["the lowest layer on the scale", "a middle layer on the scale", "the highest layer on the scale"],
            mark: `step ${step}`,
          })
        : null,
    ...sharesOf(ctx, id),
  };
}

// ---------- Motion ----------

// The time each move plays in, as the transition keys pair them: a state change on the feedback
// time, a closing layer on the exit time; a layer that appears opens on the panel time.
const MOVE_TIME = {
  transition: "motion.duration.feedback",
  emphasize: "motion.duration.feedback",
  enter: "motion.duration.panels",
  exit: "motion.duration.exit",
  "exit-offscreen": "motion.duration.exit",
};

// A move as a phrase: "A layer appears: a menu, …" → "a layer that appears".
const moveWords = (description) => {
  const head = description.split(":")[0].split(", such as")[0].replace(/\.$/, "");
  const m = /^An? (\w+) (.+)$/.exec(head);
  return m && !/^that\b/.test(m[2]) ? `a ${m[1]} that ${m[2]}` : head.charAt(0).toLowerCase() + head.slice(1);
};

function motionCard(ctx, id) {
  if (!/^motion\.(duration|easing)\./.test(id)) return null;
  const f = ctx.grammar.scopes.find((s) => s.id === "motion")?.families;
  const family = f?.items.find((x) => x.id === familyOf(ctx.scheme, ctx.grammar)) ?? null;
  const reduced = usageOf(ctx, "reduced-motion");
  const calm = {
    ask: "With less motion",
    rows: reduced
      ? [facts([], sentence(reduced.use)), ...(reduced.why ? [note(reduced.why)] : [])]
      : [missing("The scheme has no rule for reduced motion.")],
  };
  if (/^motion\.duration\./.test(id)) {
    const v = ms(ctx.value(id));
    const limit =
      family &&
      (Object.entries(family.max_ms).find(([p]) => p === id)?.[1] ??
        Object.entries(family.max_ms).find(([p]) => matches(p, id))?.[1]);
    const top = family ? Math.max(...Object.values(family.max_ms)) : null;
    const rows =
      v === null
        ? [missing("The value is not a duration.")]
        : limit
          ? [
              meter(v, limit, top, `${fmt(v)}ms`),
              facts(
                [`${fmt(v)}ms`, `limit ${limit}ms`],
                v <= limit ? "Ends before you notice a wait." : "Past the limit: it feels slow.",
              ),
              note(`Limit ${limit}ms in the ${family.title.toLowerCase()} family.`),
            ]
          : [missing("The motion family sets no limit for this duration.")];
    const steps = ctx.families.find((x) => x.id === "duration")?.steps.map((s) => ms(s.value)) ?? [];
    return {
      swatch: { kind: "duration" },
      where: null,
      sections: [
        {
          ask: "Is it fast enough to feel instant?",
          rows,
          specimen:
            v === null
              ? null
              : {
                  tag: `Specimen · ${fmt(v)}ms`,
                  as: `a bar that fills in exactly ${fmt(v)}ms, at an even pace · on surface.canvas`,
                  draw: { kind: "duration", ms: v },
                },
        },
        calm,
      ],
      hint: scaleHint(steps, v, {
        word: "speed",
        words: ["the shortest speed", "a middle speed", "the longest speed"],
      }),
      ...sharesOf(ctx, id),
    };
  }
  const raw = ctx.value(id);
  const points = Array.isArray(raw)
    ? raw
    : (() => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })();
  const move = f?.moves.find((m) => m.token === id) ?? null;
  const rows = [];
  let specimen = null;
  if (!Array.isArray(points) || points.length !== 4) rows.push(missing("The value is not a cubic Bézier."));
  else {
    const kind = curveKind(points);
    const words =
      kind === "overshoot"
        ? "Springs past and settles."
        : bezierAt(points, 0.5) > 0.5
          ? "Slows down as it arrives."
          : "Speeds up as it leaves.";
    const allowed = move && family ? (family.curves[move.id] ?? []) : [];
    // A family that allows only a strong ease-out measures at a third of the time; any other at half.
    const strong = allowed.length === 1 && allowed[0] === "strong-out";
    const m = strong
      ? { t: 1 / 3, floor: 0.8, when: "a third of the time" }
      : { t: 0.5, floor: 0.5, when: "half the time" };
    const got = bezierAt(points, m.t);
    if (move && family) {
      rows.push(
        facts(
          [`${pct(got)} done at ${m.when}`, `at least ${pct(m.floor)}`],
          allowed.includes(kind) ? words : `${words} Not a curve this move allows.`,
        ),
        note(
          `${kind === "overshoot" ? "It passes its target, then settles back." : "It never passes its target."} The ${family.title.toLowerCase()} family's rule for ${moveWords(move.description)}: at least ${pct(m.floor)} of the way at ${m.when}.`,
        ),
      );
    } else
      rows.push(
        facts([`${pct(got)} done at ${m.when}`], words),
        missing("The motion family names no move for this curve."),
      );
    const time = MOVE_TIME[move?.id] ?? "motion.duration.feedback";
    const playMs = ms(ctx.value(time));
    specimen = {
      tag: `Specimen · cubic-bezier(${points.join(", ")})`,
      as: `the dot runs ${fmt(playMs ?? 0)}ms, the ${time} time · dashed lines: ${m.when}, ${pct(m.floor)}`,
      draw: { kind: "curve", points, ms: playMs, guide: { t: m.t, floor: m.floor } },
    };
  }
  return {
    swatch: { kind: "curve", points: Array.isArray(points) ? points : null },
    where: null,
    sections: [{ ask: "How does it arrive?", rows, specimen }, calm],
    hint: null,
    ...sharesOf(ctx, id),
  };
}

// ---------- Icons and sizes ----------

function iconCard(ctx, id) {
  if (id !== "size.icon" && id !== "icon.stroke-width") return null;
  const body = {
    family: ctx.value("type.body.font-family"),
    size: ctx.px("type.body.font-size"),
    weight: ctx.value("type.body.font-weight"),
  };
  body.line = lineBoxPx(ctx.value("type.body.line-height"), body.size);
  const iconPx = ctx.px("size.icon");
  const stroke = Number(ctx.value("icon.stroke-width"));
  const text = ctx.scheme.samples?.icon_action ?? null;
  const glyph = ctx.glyph;
  const draw = glyph && text ? { nodes: glyph.nodes, px: iconPx, stroke, text, ...body } : null;
  const lack = [
    ...(glyph ? [] : [missing("No icon glyph is passed to the map.")]),
    ...(text ? [] : [missing("The scheme has no icon action text.")]),
  ];
  const familyName = firstFamily(body.family);
  if (id === "size.icon") {
    const fits = iconPx <= body.line;
    const vs =
      iconPx === body.size
        ? "the same size as the text"
        : iconPx < body.size
          ? `${fmt(body.size - iconPx)}px under the ${fmt(body.size)}px text`
          : `${fmt(iconPx - body.size)}px over the ${fmt(body.size)}px text`;
    const check = measured(ctx, id, "icon-matches-label");
    const said = check ? (check.pairs[0] ?? check.waits[0] ?? check.off[0] ?? "") : "";
    const labelLine = Number(/([\d.]+)px label line/.exec(said)?.[1]) || null;
    const rule = ctx.decisions[id]?.graph?.rules?.[0]?.says?.split(";")[0] ?? null;
    const rows = [
      facts(
        [`${fmt(iconPx)}px icon`, `${fmt(body.line)}px line`],
        fits ? "Lines up: the icon sits inside one line." : "Taller than the line: lines spread apart.",
      ),
      note(`Beside body text: ${vs}, centred on the line.`),
      labelLine
        ? facts(
            [`${fmt(labelLine)}px label line`],
            check.holds ? "Meets your rule: one label line tall." : "Misses your rule: under one label line.",
          )
        : missing("The label line check is not measured."),
      ...(rule ? [note(`Your rule: ${rule}.`)] : []),
      ...lack,
    ];
    const alone = usageOf(ctx, "icon-alone");
    const control = "size.control.default";
    const asButton = (alone?.uses ?? []).some((u) => u.component === "button" && u.variant === "icon");
    const aloneRows = !alone
      ? [missing("The scheme has no rule for an icon alone.")]
      : asButton
        ? [
            facts([`${fmt(ctx.px(control))}px hit area`], `From the control height, not the ${fmt(iconPx)}px icon.`),
            note(`${sentence(alone.use)} ${alone.why ?? ""}`.trim()),
          ]
        : [
            facts(["Never alone"], sentence(alone.use.replace(/^Not used: /, ""))),
            ...(alone.why ? [note(alone.why)] : []),
          ];
    const sizes = ctx.families.find((f) => f.id === "size")?.steps.map((s) => px(s.value)) ?? [];
    return {
      swatch: { kind: "icon", nodes: glyph?.nodes ?? null, px: iconPx, stroke },
      where: null,
      sections: [
        {
          ask: "Can you tell what it is?",
          rows,
          specimen: draw && {
            tag: `Specimen · ${fmt(iconPx)}px icon`,
            as: `Lucide ${glyph.name} · beside body text, ${familyName} ${fmt(body.size)}px on a ${fmt(body.line)}px line (dashed) · on surface.canvas`,
            draw: { kind: "icon", ...draw },
          },
        },
        { ask: "Alone as a button?", rows: aloneRows },
      ],
      hint: scaleHint(sizes, iconPx, { word: "size", mark: `${fmt(iconPx)}px` }),
      ...sharesOf(ctx, id),
    };
  }
  const renders = connectionOf(ctx, "stroke-renders");
  const grid = renders?.grid ?? 24;
  const floor = renders?.min_px ?? null;
  const drawn = Math.round(((stroke * iconPx) / grid) * 100) / 100;
  const definition = answerOf(ctx, "iconography.definition");
  const rows = [
    facts(
      [`${fmt(stroke)} on a ${grid}px grid`, `${fmt(drawn)}px at ${fmt(iconPx)}px`],
      floor === null
        ? null
        : drawn >= floor
          ? "Thin lines stay whole at this size."
          : "Thin lines break up at this size.",
    ),
    ...(floor === null
      ? [missing("The grammar names no drawn stroke floor.")]
      : [
          note(
            `${drawn >= floor ? "Floor" : "Floor missed"}: at least ${floor}px drawn. ${fmt(stroke)} × ${fmt(iconPx)} ÷ ${grid} = ${fmt(drawn)}px.`,
          ),
        ]),
    { type: "stem", drawn, family: body.family, size: body.size, weight: body.weight },
    ...(definition?.why ? [note(`Your answer: ${definition.why}`)] : []),
    ...lack,
  ];
  const strokes = ctx.families.find((f) => f.id === "stroke-width")?.steps.map((s) => Number(s.value)) ?? [];
  return {
    swatch: { kind: "icon", nodes: glyph?.nodes ?? null, px: 28, stroke },
    where: null,
    sections: [
      {
        ask: "Does it match the text weight?",
        rows,
        specimen: draw && {
          tag: `Specimen · ${fmt(stroke)} stroke`,
          as: `Lucide ${glyph.name} at ${fmt(iconPx)}px · beside body text, weight ${body.weight} · on surface.canvas`,
          draw: { kind: "stroke", ...draw, zoom: 4, grid },
        },
      },
    ],
    hint: scaleHint(strokes, stroke, { word: "stroke width", mark: fmt(stroke) }),
    ...sharesOf(ctx, id),
  };
}

const BUILDERS = [typeCard, spacingCard, shapeCard, elevationCard, motionCard, iconCard];

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
