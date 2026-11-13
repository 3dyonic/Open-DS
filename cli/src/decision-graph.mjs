// The decision graph (OD-304), one engine for every scope that records roles. A token inherits its
// explanation down a chain, so nothing here is typed per token: its role (from its mapping entry), the
// role's jobs, its rule, the connections it takes part in and its value. Color is a hue scale, a slot on
// it, a pair and the connections between colors. Type is one base and one ratio, a step per text role and
// a line kind. Spacing is one base and a multiple per use case, and the component map's rhythm. Shape
// keeps its connections as the scope's relations (shape-elevation.mjs). The grammar holds the data: each
// mapping entry's roles and rule, semantics.variants (a color slot and its step), semantics.connections
// (comes-from, pairs-with, stays-apart) and each scope relation with a kind. This module reads them,
// measures what they promise, and writes the reason sentence in the grammar's reason form.
// No file access: the caller passes the scheme and the grammar.
import { aliasChain, owns, tokenIndex } from "./lands.mjs";
import { oklab, oklabDistance } from "./quality/color.mjs";
import { questions } from "./schemes.mjs";
import { grammarRelations, relationResults } from "./shape-elevation.mjs";
import { MULTIPLIERS, steps as mapSteps } from "./spacing-map.mjs";
import { baseOf } from "./spacing-use-cases.mjs";
import { contrastRatio } from "./token-measure.mjs";
import { flatTokens } from "./tokens.mjs";
import { pairsIn, toneOf, toneRole } from "./tones.mjs";
import { decidersOf, mappingOf, matches, writtenReasons } from "./trace.mjs";
import { KINDS, lineHeights, plain, sizeOf } from "./type-scale.mjs";
import { recordsOf } from "./type-space-generated.mjs";

const MODES = ["light", "dark"];
// A primitive step: color.<hue>.<light|dark>.<step>.
const PRIMITIVE = /^color\.([a-z-]+)\.(light|dark)\.([0-9a-z]+)$/;
const short = (name) => name.replace(/\.@$/, "");
const covers = (patterns, name) => (patterns ?? []).some((p) => matches(p, short(name)) || matches(p, `${short(name)}.@`));
const r2 = (n) => `${n.toFixed(2).replace(/0$/, "")}:1`;

/** The color role a token plays, from its mapping entry: { property, title, role, jobs: [{ id, title, how }] }, or null. */
export function roleOf(g, name) {
  const entry = mappingOf(g, short(name));
  const role = (entry?.roles ?? []).find((r) => covers(r.tokens, name));
  if (!role) return null;
  const jobs = role.jobs.map((id) => entry.jobs.find((j) => j.id === id)).filter(Boolean);
  return { property: entry.property, title: entry.title, role, jobs };
}

/** A type token's place in its scheme's type record: { spec, role, part, kind }, or null for any other token. */
export function typePlace(scheme, name) {
  const [scope, role, part, ...rest] = short(name).split(".");
  const spec = recordsOf(scheme).type;
  if (scope !== "type" || rest.length || !part || !spec || !(role in spec.steps)) return null;
  return { spec, role, part, kind: lineHeights(spec)[role].kind };
}

/** A role's jobs for one token. A job named after a line kind (tight, snug, open) stays only for a token of that kind. */
const jobsFor = (jobs, place) => jobs.filter((j) => !(place && KINDS.includes(j.id) && j.id !== place.kind));

/** A length in px: "1.1875rem" is 19. null for a value that is no length. */
const pxOf = (v) => (typeof v === "string" && /^[\d.]+(rem|px)$/.test(v) ? parseFloat(v) * (v.endsWith("rem") ? 16 : 1) : null);

/** The group a token or a pattern belongs to: the longest owns entry of a grammar scope that covers it, else its first part. */
function ownerOf(g, name) {
  let best = null;
  for (const scope of g.scopes ?? []) for (const o of scope.owns ?? []) if (owns(name, o) && (!best || o.length > best.length)) best = o;
  return best ?? name.split(".")[0];
}

/**
 * The token groups that play roles (color, type, space, size.row, radius): the owner of every role's token
 * pattern. A group inside another listed group adds nothing, so it is left out.
 */
export function graphGroups(g) {
  const all = [...new Set((g.mapping ?? []).flatMap((e) => (e.roles ?? []).flatMap((r) => r.tokens.map((t) => ownerOf(g, t)))))];
  return all.filter((a) => !all.some((b) => b !== a && owns(a, b)));
}

/** True when a token sits in a group that plays roles, so each link of its chain must be there. */
export const inGraph = (g, name) => graphGroups(g).some((o) => owns(short(name), o));

/**
 * Every connection: semantics.connections, then each scope relation that has a kind. A relation keeps its
 * record per scheme (scheme.relations) and its check in shape-elevation.mjs; here it is one more connection.
 */
export function allConnections(g) {
  const relations = [...grammarRelations(g).values()]
    .filter((r) => r.kind)
    .map((r) => ({ id: r.id, kind: r.kind, by: "relation", tokens: r.tokens, says: r.says }));
  return [...(g.semantics?.connections?.items ?? []), ...relations];
}

/** The scope relations without a kind that name a token: each is the token's rule, checked like a connection. */
const ruleRelations = (g, name) => [...grammarRelations(g).values()].filter((r) => !r.kind && r.tokens.includes(short(name)));

/** The slot a token's last part names (@, subtle, hover), with the step it sits at, or null. */
export function slotOf(g, name) {
  const last = name.split(".").at(-1);
  return (g.semantics?.variants?.items ?? []).find((v) => v.id === last && (v.step || v.from)) ?? null;
}

/**
 * The connections a token takes part in, from semantics.connections. A pairs-with holds every fill and
 * text of the tone pairs, and the fills its also list names. A token that comes from the hue of its @
 * also takes part in each stays-apart by hue of that @: it shares the hue, so it shares the clash. Such
 * a connection carries via, the token it comes through.
 */
export function connectionsOf(g, name) {
  const keys = new Map((g.semantics?.keys ?? []).map((k) => [k.id, k]));
  const fills = new Set((g.semantics?.tones?.fills ?? []).map((f) => f.id));
  const items = allConnections(g);
  const inAlso = (c, n) => (c.also ?? []).some((a) => covers(a.fills, n) || a.text === n);
  const inPairs = (c, n) => fills.has(n) || toneRole(n) || keys.get(n)?.pairs?.on || [...keys.values()].some((k) => k.pairs?.on?.includes(n)) || inAlso(c, n);
  const full = keys.has(name) ? name : keys.has(`${name}.@`) ? `${name}.@` : name;
  const takesPart = (c, n) => covers(c.tokens, n) || (c.kind === "stays-apart" && covers(c.from, n));
  const own = items.filter((c) => (c.kind === "pairs-with" && c.pairs ? inPairs(c, full) : takesPart(c, name)));
  const sources = items
    .filter((c) => c.kind === "comes-from" && c.match === "hue" && c.from === "@" && covers(c.tokens, name))
    .map(() => `${short(name).split(".").slice(0, -1).join(".")}.@`);
  const inherited = sources.flatMap((via) =>
    items.filter((c) => c.kind === "stays-apart" && c.by === "hue" && !own.includes(c) && takesPart(c, via)).map((c) => ({ ...c, via: short(via) })),
  );
  return [...own, ...inherited];
}

/** The pairs an also list adds in one brand and mode: [{ key, on, contrast }]. The contrast is the text's own pair floor. */
function alsoPairs(g, c, names) {
  const keys = new Map((g.semantics?.keys ?? []).map((k) => [k.id, k]));
  return (c.also ?? []).flatMap((a) =>
    names.filter((n) => covers(a.fills, n)).map((on) => ({ key: a.text, on, contrast: keys.get(a.text)?.pairs?.contrast ?? null })),
  ).filter((p) => p.contrast);
}

/** Where a token's value ends in one brand and mode: { value, hue, side, step, hops }. hue is null for a value off every scale. */
export function placeOf(index, name) {
  const { hops, value } = aliasChain(index, name);
  const end = [...hops].reverse().find((h) => PRIMITIVE.test(h));
  const [, hue, side, step] = end?.match(PRIMITIVE) ?? [];
  return { value, hue: hue ?? null, side: side ?? null, step: step ?? null, hops: [name, ...hops] };
}

/** One token index per brand and mode, built when first asked for. The caller owns the cache. */
export function indexesOf(scheme) {
  const built = new Map();
  return (brand, mode) => {
    const key = `${brand}/${mode}`;
    if (!built.has(key)) built.set(key, tokenIndex(scheme, { brand, mode }));
    return built.get(key);
  };
}

// The contrast a step distance promises: the largest promise the distance reaches, or null.
const promised = (promise, apart) =>
  [...(promise ?? [])].sort((a, b) => b.apart - a.apart).find((p) => apart >= p.apart)?.contrast ?? null;
const stepNumber = (p) => (/^\d+$/.test(p.step ?? "") ? Number(p.step) : null);
const lightness = (hex) => (/^#[0-9a-f]{6}/i.test(hex ?? "") ? oklab(String(hex).slice(0, 7))[0] : null);

/**
 * The checks of one connection in one brand and mode, for every token it holds or only for name.
 * [{ connection, kind, theme, tokens: [a, b], holds, waits, says }]
 */
export function connectionChecks(scheme, g, c, { brand, mode, index, name = null }) {
  if (c.modes && !c.modes.includes(mode)) return [];
  const theme = `${brand}/${mode}`;
  const measure = MEASURES[c.match ?? c.by];
  if (measure) return measure(scheme, g, c, { brand, mode, theme, index, name });
  const names = flatTokens(scheme.tokens.semantic)
    .filter(([, t]) => !t.$deprecated)
    .map(([p]) => p);
  const has = new Set(names);
  const out = [];
  const add = (tokens, holds, says, waits = null) => out.push({ connection: c.id, kind: c.kind, theme, tokens, holds, ...(waits && { waits }), says });
  const mine = (n) => !name || short(n) === short(name);
  const place = (n) => placeOf(index, n);
  // Every step of a scale in order, 0 to 950: the neutral steps hold every step a hue has.
  const order = g.semantics?.neutral?.steps ?? [];
  // A fix the scheme records as waiting, on either token's pick.
  const waitsOf = (...tokens) => tokens.map((t) => toneOf(scheme.tokens.brands[brand]?.theme, mode, t)?.waits).find(Boolean) ?? null;

  if (c.kind === "comes-from") {
    for (const n of names.filter((x) => covers(c.tokens, x) && mine(x))) {
      const at = place(n);
      if (c.match === "chain") {
        const from = at.hops.find((h) => [c.from].flat().some((p) => matches(p, h)));
        const want = [c.from].flat().join(" or ");
        add([short(n), from ?? want], !!from, from ? `${short(n)} reads ${from}` : `${short(n)} does not read ${want}: it ends at ${at.hops.at(-1)}`);
        continue;
      }
      const source = c.from === "@" ? `${n.split(".").slice(0, -1).join(".")}.@` : c.from;
      if (!has.has(source)) continue;
      const src = place(source);
      const sameHue = at.hue !== null && at.hue === src.hue;
      const gap = Math.abs(order.indexOf(at.step) - order.indexOf(src.step));
      const holds = sameHue && (!c.steps || gap === c.steps);
      const where = `${at.hue}.${at.side}.${at.step} from ${src.hue}.${src.side}.${src.step}`;
      add([short(n), short(source)], holds, `${short(n)} is ${where}${c.steps ? `, ${gap} step${gap === 1 ? "" : "s"} on` : ""}`);
    }
  } else if (c.kind === "pairs-with") {
    for (const p of [...pairsIn(g, scheme, brand, mode), ...alsoPairs(g, c, names)]) {
      if (name && !mine(p.key) && !mine(p.on)) continue;
      const [a, b] = [place(p.key), place(p.on)];
      const ratio = contrastRatio(a.value, b.value);
      if (ratio === null) continue;
      const [sa, sb] = [stepNumber(a), stepNumber(b)];
      // A step promise holds between steps of one side: the light scales, or the dark ones.
      const apart = sa !== null && sb !== null && a.side === b.side ? Math.abs(sa - sb) : null;
      const promise = apart === null ? null : promised(c.promise, apart);
      const rule = apart === null ? "" : `; ${apart} steps apart${promise ? ` promise ${promise}:1` : " promise no floor"}`;
      add([short(p.key), short(p.on)], ratio >= p.contrast, `${short(p.key)} on ${short(p.on)} is ${r2(ratio)}, floor ${p.contrast}:1${rule}`, p.waits);
    }
  } else if (c.kind === "stays-apart" && c.by === "order") {
    const rungs = c.tokens.filter((t) => has.has(t) && typeof place(t).value === "string");
    for (let i = 1; i < rungs.length; i++) {
      const [lo, hi] = [rungs[i - 1], rungs[i]];
      if (name && !mine(lo) && !mine(hi)) continue;
      const [a, b] = [lightness(place(lo).value), lightness(place(hi).value)];
      add([lo, hi], a !== null && b !== null && a < b, `${lo} lightness ${a?.toFixed(3)} < ${hi} ${b?.toFixed(3)}`);
    }
  } else if (c.kind === "stays-apart") {
    const left = names.filter((x) => covers(c.tokens, x));
    const right = names.filter((x) => covers(c.from, x));
    for (const a of left)
      for (const b of right) {
        if (name && !mine(a) && !mine(b)) continue;
        const [pa, pb] = [place(a), place(b)];
        if (c.by === "hue") {
          const same = pa.hue !== null && pa.hue === pb.hue;
          add([short(a), short(b)], !same, same ? `${short(a)} and ${short(b)} share the ${pa.hue} hue` : `${short(a)} is ${pa.hue}, ${short(b)} is ${pb.hue}`, waitsOf(a, b));
          if (same) out.at(-1).hue = pa.hue;
        } else if (c.by === "delta-e") {
          const d = oklabDistance(String(pa.value).slice(0, 7), String(pb.value).slice(0, 7)) * 100;
          add([short(a), short(b)], d >= c.min_delta_e, `${short(a)} and ${short(b)} are ΔE ${d.toFixed(1)} apart, need ${c.min_delta_e}`, waitsOf(a, b));
        }
      }
  }
  return out;
}

/**
 * The checks of one type connection, for every token it holds or only for name, measured on the scheme's
 * type record (cli/src/type-scale.mjs) and the values the tokens resolve to. [] when the scheme keeps no
 * type record. Same shape as the color checks.
 */
function typeChecks(scheme, g, c, { theme, index, name }) {
  const spec = recordsOf(scheme).type;
  if (!spec) return [];
  const out = [];
  const add = (tokens, holds, says) => out.push({ connection: c.id, kind: c.kind, theme, tokens, holds, says });
  const value = (n) => aliasChain(index, n).value;
  const lines = lineHeights(spec);
  const roles = Object.keys(spec.steps);
  const tokenOf = (role, part) => `type.${role}.${part}`;
  const mine = (...tokens) => !name || tokens.includes(short(name));
  const names = new Set(flatTokens(scheme.tokens.semantic).map(([p]) => short(p)));
  const held = roles.filter((role) => c.tokens.some((p) => names.has(tokenOf(role, p.split(".").at(-1))) && matches(p, tokenOf(role, p.split(".").at(-1)))));
  // A line's height in px: a ratio times the size, or the line box.
  const linePx = (role) => {
    const v = value(tokenOf(role, "line-height"));
    return typeof v === "number" ? v * (pxOf(value(tokenOf(role, "font-size"))) ?? 0) : pxOf(v);
  };
  const m = c.match ?? c.by;
  if (m === "scale")
    for (const role of held.filter((r) => mine(tokenOf(r, "font-size")))) {
      const t = tokenOf(role, "font-size");
      const want = sizeOf(spec, role);
      const px = pxOf(value(t));
      const how = want.snapped ? `snapped to the ${want.snapped}px grid` : "rounded to whole px";
      add([t], px === want.px, `${t} is ${plain(px)}px; ${spec.base} × ${spec.ratio}^${spec.steps[role]} = ${plain(want.exact)}px, ${how}, gives ${want.px}px`);
    }
  else if (m === "line-kind")
    for (const role of held.filter((r) => mine(tokenOf(r, "line-height")))) {
      const t = tokenOf(role, "line-height");
      const { kind, ratio, grid, px } = lines[role];
      const v = value(t);
      const holds = grid ? pxOf(v) === px : v === ratio;
      const want = grid ? `${px}px, the ${kind} ratio ${ratio} × the size, snapped to the ${grid}px grid` : `${ratio}, the ${kind} ratio`;
      add([t], holds, `${t} is ${typeof v === "number" ? v : `${plain(pxOf(v))}px`}; its ${kind} line kind gives ${want}`);
    }
  else if (m === "ratio-step") {
    // Each step against the step below it, once: roles that share a step share a size by design. The pair
    // names the first role of each step, or the asked token's own role.
    const steps = [...new Set(held.map((r) => spec.steps[r]))].sort((a, b) => a - b);
    for (let i = 1; i < steps.length; i++) {
      const pairs = held.filter((r) => spec.steps[r] === steps[i]).flatMap((hi) => held.filter((r) => spec.steps[r] === steps[i - 1]).map((lo) => [tokenOf(lo, "font-size"), tokenOf(hi, "font-size")]));
      const pair = pairs.find(([a, b]) => mine(a, b));
      if (!pair) continue;
      const [a, b] = pair;
      const [pa, pb] = [pxOf(value(a)), pxOf(value(b))];
      const times = pb / pa;
      add([b, a], times >= spec.ratio - 1e-9, `${b} ${plain(pb)}px is ${times.toFixed(3)} × ${a} ${plain(pa)}px; one ${spec.ratio} step needs ${plain(pa * spec.ratio)}px`);
    }
  } else if (m === "kind-gap") {
    const kinds = KINDS.filter((k) => spec["line-height"][k]);
    const ratioOf = (k) => spec["line-height"][k].ratio;
    for (let i = 1; i < kinds.length; i++) {
      const [lo, hi] = [kinds[i - 1], kinds[i]];
      if (name && !held.some((r) => mine(tokenOf(r, "line-height")) && [lo, hi].includes(lines[r].kind))) continue;
      const gap = Math.round((ratioOf(hi) - ratioOf(lo)) * 1000) / 1000;
      add([`${lo} lines`, `${hi} lines`], gap >= c.min_apart, `${hi} ${ratioOf(hi)} is ${gap} above ${lo} ${ratioOf(lo)}; needs ${c.min_apart}`);
    }
  } else if (m === "holds-line") {
    const boxes = [...names].filter((n) => (c.from ?? []).some((p) => matches(p, n)));
    for (const role of held)
      for (const box of boxes) {
        if (!mine(tokenOf(role, "font-size"), tokenOf(role, "line-height"), box)) continue;
        const [line, px] = [linePx(role), pxOf(value(box))];
        if (line === null || px === null) continue;
        add([box, `type.${role}`], px >= line, `${box} is ${plain(px)}px for the ${plain(line)}px ${role} line`);
      }
  }
  return out;
}

/** The semantic token names of a scheme, short and not deprecated. */
const semanticNames = (scheme) => new Set(flatTokens(scheme.tokens.semantic).filter(([, t]) => !t.$deprecated).map(([p]) => short(p)));

/**
 * The checks of one spacing connection, measured on the scheme's records and the values the tokens resolve
 * to: a gap or inset from the spacing record and the base its spacing.definition answer sets
 * (spacing-use-cases.mjs), a component spacing step from the map's rhythm (spacing-map.mjs). [] when the
 * scheme keeps no such record.
 */
function spaceChecks(scheme, g, c, { theme, index, name }) {
  const out = [];
  const add = (tokens, holds, says) => out.push({ connection: c.id, kind: c.kind, theme, tokens, holds, says });
  const px = (n) => pxOf(aliasChain(index, n).value);
  const held = [...semanticNames(scheme)].filter((n) => covers(c.tokens, n) && (!name || n === short(name)));
  if (c.match === "base-multiple") {
    const spec = recordsOf(scheme).space;
    const option = (scheme.answers ?? []).find((a) => a.question === "spacing.definition")?.option;
    const base = baseOf(option);
    if (!spec || !base) return [];
    for (const t of held) {
      const u = spec["use-cases"][t.replace(/^space\./, "")];
      if (!u) continue;
      const useCase = [u.level, u.relation, u.reach].filter(Boolean).join(" ");
      add([t], px(t) === base * u.multiple, `${t} is ${plain(px(t))}px; the ${base}px base × ${plain(u.multiple)} for its ${useCase} use case gives ${plain(base * u.multiple)}px`);
    }
  } else if (c.match === "rhythm") {
    const spec = scheme.tokens.semantic["component-spacing-map"]?.$extensions?.["open-ds"];
    if (!spec) return [];
    const want = mapSteps(spec);
    for (const t of held) {
      const step = t.split(".").at(-1);
      if (!(step in want)) continue;
      const m = MULTIPLIERS.find((x) => `x${x}` === step);
      const how =
        step === "hairline"
          ? "the hairline is a fixed 2px"
          : (spec.fixed ?? []).includes(step)
            ? `4px × ${m}, held at every rhythm, gives ${want[step]}px`
            : `4px × ${m} × the ${spec.rhythm} rhythm, rounded to 4px and at most 64px, gives ${want[step]}px`;
      add([t], px(t) === want[step], `${t} is ${plain(px(t))}px; ${how}`);
    }
  }
  return out;
}

/**
 * The checks of a connection between two lengths: equals (a token is its from token) or at-least (a token is
 * at least times × its from token, times 1 when the connection names none). Any scope's lengths.
 */
function lengthChecks(scheme, g, c, { theme, index, name }) {
  const out = [];
  const names = semanticNames(scheme);
  const from = [c.from].flat()[0];
  if (!names.has(from)) return [];
  const px = (n) => pxOf(aliasChain(index, n).value);
  const times = c.times ?? 1;
  for (const t of [...names].filter((n) => covers(c.tokens, n))) {
    if (name && ![t, from].includes(short(name))) continue;
    const [a, b] = [px(t), px(from)];
    if (a === null || b === null) continue;
    const holds = (c.match ?? c.by) === "equals" ? a === b : a >= b * times - 1e-9;
    const against = times === 1 ? `${from} is ${plain(b)}px` : `${times} × ${from} ${plain(b)}px is ${plain(b * times)}px`;
    out.push({ connection: c.id, kind: c.kind, theme, tokens: [t, from], holds, says: `${t} is ${plain(a)}px; ${against}` });
  }
  return out;
}

/** The checks of a scope relation with a kind, from its records in this scheme (shape-elevation.mjs). */
function relationChecks(scheme, g, c, { brand, mode, theme, index, name }) {
  const records = (scheme.relations ?? []).filter((r) => r.relation === c.id && (!name || r.token === short(name)));
  return relationResults(scheme, g, { brand, mode, index, records }).results.map((x) => ({ connection: c.id, kind: c.kind, theme, tokens: [x.token], holds: x.holds, says: x.says }));
}

// What each measured connection reads, by its match or by: a type size from its scale, a line height from its
// kind, sizes a ratio step apart, line kinds apart, a box that holds a line; a gap or inset from the spacing
// base, a map step from the rhythm; two lengths that are equal or keep a floor; a scope relation.
const MEASURES = {
  scale: typeChecks,
  "line-kind": typeChecks,
  "ratio-step": typeChecks,
  "kind-gap": typeChecks,
  "holds-line": typeChecks,
  "base-multiple": spaceChecks,
  rhythm: spaceChecks,
  equals: lengthChecks,
  "at-least": lengthChecks,
  relation: relationChecks,
};

/**
 * Every connection of a scheme in every brand and mode, merged by subject: [{ connection, kind,
 * tokens, holds, waits, themes, says }]. A subject fails when it fails in any theme; themes lists them.
 */
export function evaluateConnections(scheme, g) {
  const indexOf = indexesOf(scheme);
  const bySubject = new Map();
  for (const brand of Object.keys(scheme.tokens.brands))
    for (const mode of MODES)
      for (const c of allConnections(g))
        for (const x of connectionChecks(scheme, g, c, { brand, mode, index: indexOf(brand, mode) })) {
          const key = `${x.connection} ${x.tokens.join(" | ")}`;
          const prev = bySubject.get(key);
          const failed = x.holds ? [] : [x.theme];
          if (!prev) bySubject.set(key, { ...x, themes: failed });
          else {
            prev.themes.push(...failed);
            if (prev.holds && !x.holds) Object.assign(prev, { holds: false, says: x.says, waits: x.waits });
          }
        }
  return [...bySubject.values()].map(({ theme, ...rest }) => rest);
}

/** The connections that do not hold and wait for no recorded fix: the gaps a scheme owes. */
export const connectionGaps = (checks) => checks.filter((x) => !x.holds && !x.waits);

// A job's how as the part after "does this by": "Luminance contrast → Text steps are …" becomes
// "luminance contrast: text steps are …"; "follows X: …" becomes "following X: …".
function byPhrase(how) {
  const text = String(how ?? "").trim().replace(/[.\s]+$/, "");
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  const arrow = text.split(" → ");
  if (arrow.length === 2) return `${lower(arrow[0])}: ${lower(arrow[1])}`;
  return lower(text.replace(/^follows\b/, "following"));
}

/** The option a scheme chose for a question, or null. */
function chosen(scheme, g, id) {
  const answer = (scheme.answers ?? []).find((a) => a.question === id);
  return answer ? (questions(g)[id]?.options?.find((o) => o.id === answer.option) ?? null) : null;
}

/** The scheme's answers whose chosen option creates a role: question ids, in grammar order. */
export function creatorsOf(scheme, g, roleId) {
  return Object.keys(questions(g)).filter((id) => chosen(scheme, g, id)?.creates?.includes(roleId));
}

/**
 * Why a color token exists in a scheme, as plain data: { role, always, creates, shapes }, or null when no
 * role covers it. creates holds the answers whose chosen option brings the role. always is the grammar's
 * reason when every scheme ships the role; then shapes holds the role's shaped_by answers. Else shapes holds
 * the token's deciders (decidersOf) that do not create it. Only answered questions count.
 */
export function madeBy(scheme, g, name) {
  const r = roleOf(g, name);
  if (!r) return null;
  const answered = new Set((scheme.answers ?? []).map((a) => a.question));
  const creates = creatorsOf(scheme, g, r.role.id);
  const always = r.role.always_on ?? null;
  const shapes = (always ? always.shaped_by : decidersOf(g, short(name))).filter((id) => answered.has(id) && !creates.includes(id));
  return { role: r.role.id, always: always?.why ?? null, creates, shapes };
}

/** The answers a color token's reason cites: those that create its role, then those that shape it. */
export const citedBy = (made) => (made ? [...made.creates, ...made.shapes] : []);

/**
 * The reason sentence of a token, in the grammar's reason form, written from the grammar's
 * fields and the scheme's answers, never stored: "We use <value> for <role> in order to <job>. The
 * <property> does this by <how>. So <what people get>, because <decision> (<answer ids>)." The because
 * cites only the answers that create or shape the role (madeBy). Null when no role covers the token.
 */
export function graphReason(scheme, g, name, { value }) {
  const r = roleOf(g, name);
  if (!r) return null;
  const asked = questions(g);
  const made = madeBy(scheme, g, name);
  const ids = citedBy(made);
  const words = ids.map((id) => `"${chosen(scheme, g, id)?.label ?? id}" to "${asked[id]?.text ?? id}"`);
  const answered = words.length ? `the scheme answers ${words.join(" and ")} (${ids.join(", ")})` : null;
  const decision = made.always
    ? `because ${made.always}${answered ? `, and ${answered}` : ""}`
    : answered
      ? `because ${answered}`
      : "because no answer decides it yet";
  const lead = jobsFor(r.jobs, typePlace(scheme, name))[0];
  return `We use ${value} for ${r.role.role} in order to ${r.role.to}. The ${r.title.toLowerCase()} does this by ${byPhrase(lead?.how)}. So ${r.role.gets}, ${decision}.`;
}

/** A value as the reason names it: a color's hue and step, a size in px and rem, a face by its name, else the value. */
function valueName(at, place) {
  if (at.hue) return `${at.hue}.${at.side}.${at.step}`;
  if (place?.part === "font-size" && pxOf(at.value) !== null) return `${plain(pxOf(at.value))}px (${at.value})`;
  if (place?.part === "font-family") return at.hops.at(-1).split(".").at(-1);
  // Another length reads in px, with its rem when it grows with the text: a gap, a corner, a row.
  if (!place && /^[\d.]+rem$/.test(String(at.value))) return `${plain(pxOf(at.value))}px (${at.value})`;
  return typeof at.value === "string" || typeof at.value === "number" ? String(at.value) : JSON.stringify(at.value);
}

/**
 * The graph part of a token's decision tree, in one brand and mode: role (with its jobs), rule (a color
 * slot and its step, a neutral step, or the rule its mapping entry states), each connection with its
 * checks, the value and the reason sentence. [] for a token no role covers.
 */
export function graphNodes(scheme, g, name, { brand, mode, index = tokenIndex(scheme, { brand, mode }) }) {
  const r = roleOf(g, name);
  if (!r) return [];
  const at = placeOf(index, name);
  const place = typePlace(scheme, name);
  const value = valueName(at, place);
  const made = madeBy(scheme, g, name);
  const nodes = [
    {
      level: "role",
      name: r.role.id,
      says: r.role.role,
      to: r.role.to,
      gets: r.role.gets,
      jobs: jobsFor(r.jobs, place).map((j) => ({ id: j.id, title: j.title, how: j.how })),
      always: made.always,
      creates: made.creates,
      shapes: made.shapes,
    },
  ];
  const slot = slotOf(g, name);
  const connections = connectionsOf(g, name);
  if (slot) {
    const want = slot.step ?? null;
    const says = want ? `${slot.id} sits at step ${want} of its hue` : `${slot.id} sits ${slot.steps} step${slot.steps === 1 ? "" : "s"} from its ${slot.from}`;
    nodes.push({ level: "rule", name: slot.id, says, step: want, picked: at.step, holds: want ? at.step === want : null });
  }
  // The rule the token's mapping entry states: how a type size or line height is made.
  const entry = mappingOf(g, short(name));
  if (!slot && entry?.rule) nodes.push({ level: "rule", name: entry.property, says: entry.rule, step: null, picked: null, holds: null });
  // A scope relation without a kind is the token's rule (a decided corner), with the check its relation runs.
  for (const rel of slot ? [] : ruleRelations(g, name)) {
    const records = (scheme.relations ?? []).filter((r) => r.relation === rel.id && r.token === short(name));
    const results = relationResults(scheme, g, { brand, mode, index, records }).results;
    nodes.push({ level: "rule", name: rel.id, says: rel.says, step: null, picked: null, holds: results.length ? results.every((x) => x.holds) : null, checks: results.map((x) => x.says) });
  }
  // A step of the neutral scale is its own rule: the step the scale's curve sets, or the floor below 0.
  const neutral = g.semantics?.neutral;
  const step = name.split(".").at(-1);
  if (name.startsWith("color.neutral.") && [...(neutral?.steps ?? []), neutral?.floor?.step].includes(step))
    nodes.push({
      level: "rule",
      name: "scale-step",
      says: step === neutral.floor?.step ? neutral.floor.description : `step ${step} of the neutral ramp, set by the scale's step curve`,
      step,
      picked: at.step,
      holds: null,
    });
  for (const c of connections) {
    if (!slot && c.kind === "pairs-with" && c.promise)
      nodes.push({ level: "rule", name: "step-promise", says: c.promise.map((p) => `${p.apart} steps apart give ${p.contrast}:1`).join(", "), step: null, picked: at.step, holds: null });
    const checks = connectionChecks(scheme, g, c, { brand, mode, index, name: c.via ?? name });
    nodes.push({ level: "connection", name: c.id, kind: c.kind, says: c.says, ...(c.via && { via: c.via }), holds: checks.every((x) => x.holds), checks });
  }
  nodes.push({ level: "value", name: place && at.hops.length ? at.hops.at(-1) : value, says: typeof at.value === "string" || typeof at.value === "number" ? String(at.value) : null });
  nodes.push({ level: "reason", name: `${brand}/${mode}`, says: graphReason(scheme, g, name, { value }) });
  return nodes;
}

/**
 * The links of a token that are missing: role, job, property, answer, rule, value. [] when every
 * link is there. A rule is the token's slot or a connection it takes part in.
 */
export function missingLinks(scheme, g, name, nodes) {
  const answered = new Set((scheme.answers ?? []).map((a) => a.question));
  const role = nodes.find((n) => n.level === "role");
  const property = nodes.find((n) => n.level === "property");
  return [
    !role && "role",
    !role?.jobs?.length && "job",
    !property?.name && "property",
    !(property?.decided_by ?? []).some((a) => answered.has(a.id)) && "answer",
    !nodes.some((n) => n.level === "rule" || n.level === "connection") && "rule",
    !nodes.some((n) => n.level === "value" && n.says) && "value",
  ].filter(Boolean);
}

// The numbers a stored reason names, and what each must equal. A size next to a role word ("the 19px body",
// "a 25px page title"), its own size ("its 35px size", "at 23px it sits"), a grid ("the 4px grid"), a line box ("a
// 20px line box"), a line kind ("the open step"), and the lead of the reason form ("We use 16px for").
const ROLE_SIZE = /(\d+(?:\.\d+)?)px (?:[a-z]+ )?(display|title|heading|body|label|caption|data)s?\b/g;
const OWN_SIZE = /\b(?:(?:its|the) (\d+(?:\.\d+)?)px size\b|at (\d+(?:\.\d+)?)px it (?!would))/g;
const GRID = /(\d+(?:\.\d+)?)px grid\b/g;
const LINE_BOX = /(\d+(?:\.\d+)?)px line box\b/g;
const KIND = /\bthe (tight|snug|open) (?:step|ratio|line kind)\b/g;
const LEAD = /^We use (\d+(?:\.\d+)?)px for\b/;

/**
 * The numbers in a scheme's stored reasons that its data does not support, one line each: a type reason
 * that names a size, a grid, a line box or a line kind its role does not have, and any reason in the
 * reason form whose lead names another px value than the token resolves to. Read in the scheme's first
 * brand, light, where type and spacing are the same in every mode. [] when every number holds.
 */
export function storedNumberGaps(scheme) {
  const indexOf = indexesOf(scheme);
  const first = Object.keys(scheme.tokens.brands)[0];
  const px = (n, brand = first, mode = "light") => pxOf(aliasChain(indexOf(brand, mode), n).value);
  const spec = recordsOf(scheme).type;
  const lines = spec ? lineHeights(spec) : {};
  const sizeOfRole = (role) => px(`type.${role}.font-size`);
  const out = [];
  for (const r of writtenReasons(scheme)) {
    const off = [];
    const lead = LEAD.exec(r.why);
    // A theme pick's lead names the value of the semantic token that reads it, in the pick's brand and mode.
    const [brand, mode] = r.where === "own" ? [first, "light"] : r.where.split("/");
    const own = px(r.token, brand, mode === "base" ? "light" : mode);
    if (lead && own !== null && Number(lead[1]) !== own) off.push(`it leads with ${lead[1]}px, the token is ${plain(own)}px`);
    const place = r.where === "own" ? typePlace(scheme, r.token) : null;
    if (place) {
      for (const [, n, role] of r.why.matchAll(ROLE_SIZE))
        if (role in spec.steps && Number(n) !== sizeOfRole(role)) off.push(`${n}px ${role}: the ${role} size is ${plain(sizeOfRole(role))}px`);
      for (const [, a, b] of r.why.matchAll(OWN_SIZE))
        if (Number(a ?? b) !== sizeOfRole(place.role)) off.push(`${a ?? b}px as its size: the ${place.role} size is ${plain(sizeOfRole(place.role))}px`);
      const grid = place.part === "line-height" ? lines[place.role].grid : place.part === "font-size" ? sizeOf(spec, place.role).snapped : undefined;
      if (grid !== undefined)
        for (const [, n] of r.why.matchAll(GRID)) if (Number(n) !== grid) off.push(`the ${n}px grid: ${grid ? `${place.role} snaps to the ${grid}px grid` : `${place.role} snaps to no grid`}`);
      if (place.part === "line-height") {
        for (const [, n] of r.why.matchAll(LINE_BOX)) if (Number(n) !== lines[place.role].px) off.push(`a ${n}px line box: the ${place.role} line box is ${lines[place.role].px ?? "none"}px`);
        for (const [, kind] of r.why.matchAll(KIND)) if (kind !== place.kind) off.push(`the ${kind} kind: ${place.role} lines are ${place.kind}`);
      }
    }
    if (off.length) out.push({ token: r.token, where: r.where, says: off.join("; ") });
  }
  return out;
}
