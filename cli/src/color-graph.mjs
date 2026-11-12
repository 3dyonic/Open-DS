// The color decision graph (OD-304). Color is structural: a hue scale, a slot on it, a pair, and the
// connections between colors. A color token inherits its explanation down that chain, so nothing here
// is typed per token. The grammar holds the data: each mapping entry's roles (role, jobs, what people
// get), semantics.variants (the slot and its step) and semantics.connections (comes-from, pairs-with,
// stays-apart). This module reads them, measures what they promise, and writes the reason sentence in
// the grammar's reason form. No file access: the caller passes the scheme and the grammar.
import { aliasChain, tokenIndex } from "./lands.mjs";
import { oklab, oklabDistance } from "./quality/color.mjs";
import { questions } from "./schemes.mjs";
import { contrastRatio } from "./token-measure.mjs";
import { flatTokens } from "./tokens.mjs";
import { pairsIn, toneOf, toneRole } from "./tones.mjs";
import { decidersOf, mappingOf, matches } from "./trace.mjs";

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

/** The slot a token's last part names (@, subtle, hover), with the step it sits at, or null. */
export function slotOf(g, name) {
  const last = name.split(".").at(-1);
  return (g.semantics?.variants?.items ?? []).find((v) => v.id === last && (v.step || v.from)) ?? null;
}

/** The connections a token takes part in, from semantics.connections. A pairs-with holds every fill and text of the tone pairs. */
export function connectionsOf(g, name) {
  const keys = new Map((g.semantics?.keys ?? []).map((k) => [k.id, k]));
  const fills = new Set((g.semantics?.tones?.fills ?? []).map((f) => f.id));
  const inPairs = (n) => fills.has(n) || toneRole(n) || keys.get(n)?.pairs?.on || [...keys.values()].some((k) => k.pairs?.on?.includes(n));
  const full = keys.has(name) ? name : keys.has(`${name}.@`) ? `${name}.@` : name;
  return (g.semantics?.connections?.items ?? []).filter((c) =>
    c.kind === "pairs-with" ? inPairs(full) : covers(c.tokens, name) || (c.kind === "stays-apart" && covers(c.from, name)),
  );
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
    for (const p of pairsIn(g, scheme, brand, mode)) {
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
        } else if (c.by === "delta-e") {
          const d = oklabDistance(String(pa.value).slice(0, 7), String(pb.value).slice(0, 7)) * 100;
          add([short(a), short(b)], d >= c.min_delta_e, `${short(a)} and ${short(b)} are ΔE ${d.toFixed(1)} apart, need ${c.min_delta_e}`, waitsOf(a, b));
        }
      }
  }
  return out;
}

/**
 * Every connection of a scheme in every brand and mode, merged by subject: [{ connection, kind,
 * tokens, holds, waits, themes, says }]. A subject fails when it fails in any theme; themes lists them.
 */
export function evaluateConnections(scheme, g) {
  const indexOf = indexesOf(scheme);
  const bySubject = new Map();
  for (const brand of Object.keys(scheme.tokens.brands))
    for (const mode of MODES)
      for (const c of g.semantics?.connections?.items ?? [])
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

/**
 * The reason sentence of a color token, in the grammar's reason form, written from the grammar's
 * fields and the scheme's answers, never stored: "We use <value> for <role> in order to <job>. The
 * <property> does this by <how>. So <what people get>, because <decision> (<answer ids>)." Null when
 * no role covers the token.
 */
export function colorReason(scheme, g, name, { value }) {
  const r = roleOf(g, name);
  if (!r) return null;
  const asked = questions(g);
  const answers = new Map((scheme.answers ?? []).map((a) => [a.question, a]));
  const ids = decidersOf(g, short(name)).filter((id) => answers.has(id));
  const words = ids.map((id) => {
    const option = asked[id]?.options?.find((o) => o.id === answers.get(id).option);
    return `"${option?.label ?? answers.get(id).option}" to "${asked[id]?.text ?? id}"`;
  });
  const decision = words.length ? `because the scheme answers ${words.join(" and ")} (${ids.join(", ")})` : "because no answer decides it yet";
  return `We use ${value} for ${r.role.role} in order to ${r.role.to}. The ${r.title.toLowerCase()} does this by ${byPhrase(r.jobs[0]?.how)}. So ${r.role.gets}, ${decision}.`;
}

/**
 * The color part of a token's decision tree, in one brand and mode: role (with its jobs), rule (the
 * slot and its step), each connection with its checks, and the reason sentence. [] for a token no
 * color role covers.
 */
export function colorNodes(scheme, g, name, { brand, mode, index = tokenIndex(scheme, { brand, mode }) }) {
  const r = roleOf(g, name);
  if (!r) return [];
  const at = placeOf(index, name);
  const value = at.hue ? `${at.hue}.${at.side}.${at.step}` : typeof at.value === "string" ? at.value : JSON.stringify(at.value);
  const nodes = [
    { level: "role", name: r.role.id, says: r.role.role, to: r.role.to, gets: r.role.gets, jobs: r.jobs.map((j) => ({ id: j.id, title: j.title, how: j.how })) },
  ];
  const slot = slotOf(g, name);
  const connections = connectionsOf(g, name);
  if (slot) {
    const want = slot.step ?? null;
    const says = want ? `${slot.id} sits at step ${want} of its hue` : `${slot.id} sits ${slot.steps} step${slot.steps === 1 ? "" : "s"} from its ${slot.from}`;
    nodes.push({ level: "rule", name: slot.id, says, step: want, picked: at.step, holds: want ? at.step === want : null });
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
    if (!slot && c.kind === "pairs-with")
      nodes.push({ level: "rule", name: "step-promise", says: c.promise.map((p) => `${p.apart} steps apart give ${p.contrast}:1`).join(", "), step: null, picked: at.step, holds: null });
    const checks = connectionChecks(scheme, g, c, { brand, mode, index, name });
    nodes.push({ level: "connection", name: c.id, kind: c.kind, says: c.says, holds: checks.every((x) => x.holds), checks });
  }
  nodes.push({ level: "value", name: value, says: typeof at.value === "string" ? at.value : null });
  nodes.push({ level: "reason", name: `${brand}/${mode}`, says: colorReason(scheme, g, name, { value }) });
  return nodes;
}

/**
 * The links of a color token that are missing: role, job, property, answer, rule, value. [] when every
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
