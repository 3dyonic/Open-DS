// The Token map page's data (OD-274): one scheme and brand, read left to right. An area (Color,
// Spacing …) holds scales (a hue, the space scale …); a scale holds the steps that decisions use; a
// step's decisions sit in semantic groups; a decision lists the components that show it and the
// decisions that copy it. Everything here comes from the scheme, the grammar and the component code:
// a reason the scheme does not record is left out, never filled in.
//
// The docs build calls tokenMapView once per scheme and brand (docs/scripts/generate.mjs) and the page
// renders the result (docs/src/components/TokenMap). The component source is passed in as text, so
// this module reads no files.
import {
  backgroundsOf,
  colorIndex,
  componentsShowing,
  contrastsOf,
  decisionsReading,
  groupOf,
  jobFor,
  primitiveParts,
  reasonChain,
  rowLabel,
  tokenName,
} from "./color-map.mjs";
import { tokenIndex } from "./lands.mjs";
import { contrastRatio } from "./token-measure.mjs";
import { reasonsOf, tokenGraph } from "./token-graph.mjs";
import { decidersOf, decisionTree, mappingOf, traceScheme } from "./trace.mjs";

export const AREAS = ["Color", "Spacing", "Size", "Type", "Shape", "Elevation", "Motion", "Opacity"];

// Non-color primitives by id: [pattern, area, scale id, scale label, the grammar scope that sets it].
const SCALES = [
  [/^space\.(\d+)$/, "Spacing", "space", "space", "spacing"],
  [/^size\.(\d+)$/, "Size", "size", "size", "spacing"],
  [/^font\.size\.(.+)$/, "Type", "font-size", "font size", "typography"],
  [/^font\.line-height\.(.+)$/, "Type", "line-height", "line height", "typography"],
  [/^font\.weight\.(.+)$/, "Type", "font-weight", "font weight", "typography"],
  [/^font\.family\.(.+)$/, "Type", "typeface", "typeface", "typography"],
  [/^radius\.(.+)$/, "Shape", "radius", "corner", "shape"],
  [/^border-width\.(.+)$/, "Shape", "border-width", "line width", "shape"],
  [/^shadow\.(.+)$/, "Elevation", "shadow", "shadow", "elevation"],
  [/^duration\.(.+)$/, "Motion", "duration", "duration", "motion"],
  [/^easing\.(.+)$/, "Motion", "easing", "easing", "motion"],
  [/^opacity\.(.+)$/, "Opacity", "opacity", "opacity", "accessibility"],
];

// A theme pick's why without its pick prefix, which the card shows on its own: "blue.light.600: the focus
// ring, …" → "the focus ring, …". The measured contrast and the because clause stay: they are the reason.
export function plainWhy(why) {
  if (!why) return null;
  return why.replace(/^[a-z]+(\.[a-z0-9-]+)+:\s*/i, "").trim() || null;
}

// The theme pick of a semantic token in one brand and mode (or the mode-free base), if any.
function pickOf(scheme, brand, mode, id) {
  const theme = scheme.tokens.brands[brand]?.theme ?? {};
  for (const where of [mode, "base"]) {
    let node = theme[where];
    for (const k of id.split(".")) node = node?.[k];
    const ext = node?.$extensions?.["open-ds"] ?? node?.["@"]?.$extensions?.["open-ds"];
    if (ext) return ext;
  }
  return null;
}

/**
 * The decisions that use a value: the semantic tokens it reaches (decisionsReading), then any semantic
 * token that copies one of them (color.text.on-action copies color.text.on-dark). Returns
 * { found: [ids], via: { copy id: the decision it copies } }.
 */
export function decisionsUsing(index, id) {
  const found = [...decisionsReading(index, id)];
  const via = {};
  for (let i = 0; i < found.length; i++)
    for (const r of index.readers.get(found[i]) ?? []) {
      const n = index.nodes.get(r);
      if (n?.tier === "semantic" && r.startsWith("color.") && !r.startsWith("color.neutral.") && !found.includes(r)) {
        found.push(r);
        via[r] = found[i];
      }
    }
  return { found, via };
}

// How the component code reads a token: Tailwind variants before its CSS variable say when it applies.
const CONDITIONS = [
  [/^md$|^lg$|^xl$/, "on wide screens"],
  [/^sm$/, "on small screens"],
  [/^hover$|:hover\]$/, "on hover"],
  [/^has-focus$|^focus$|^focus-within$/, "when focused"],
  [/^focus-visible$/, "on keyboard focus"],
  [/^pointer-coarse$/, "on touch screens"],
  [/state=open/, "when open"],
  [/selected/, "when selected"],
  [/^disabled$/, "when disabled"],
  [/aria-invalid/, "when invalid"],
  [/^\[&>span\]$/, "of its text"],
  [/^\[&>a/, "of its links"],
  [/cmdk-group-heading/, "of group headings"],
  [/slot=combobox-chip/, "when it holds chips"],
];
const PROPERTY_WORDS = {
  label: "text color",
  background: "fill",
  border: "edge",
  radius: "corner",
  "font-size": "text size",
  "line-height": "line height",
  "font-weight": "text weight",
  "padding-x": "side padding",
  "padding-y": "top and bottom padding",
  icon: "icon color",
};
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");

/**
 * A readable name for a numbered component token (component.empty.padding-2): its part, its property
 * and the condition under which the component code reads it ("padding on wide screens"). Null for a
 * token without a number. { name, read: false } when no component code reads it at all.
 */
export function betterName(id, componentSource) {
  const key = tokenName(id).replace(/^component\./, "");
  if (!/-\d+$/.test(key)) return null;
  const parts = key.split(".");
  parts.shift();
  const last = parts.pop().replace(/-\d+$/, "");
  const name = [parts.join(" ").replace(/-/g, " "), PROPERTY_WORDS[last] ?? last.replace(/-/g, " ")];
  const use = new RegExp(`([^\\s"'\`]*)var\\(${escape("--" + key.replace(/\./g, "-"))}\\)`).exec(componentSource);
  if (!use) return { name: name.filter(Boolean).join(" "), read: false };
  const conditions = use[1]
    .split(":")
    .slice(0, -1)
    .flatMap((v) => CONDITIONS.filter(([re]) => re.test(v)).map(([, w]) => w));
  return { name: [...name, ...new Set(conditions)].filter(Boolean).join(" "), read: true };
}

const stepOrder = (a, b) => {
  const [x, y] = [parseFloat(a.step), parseFloat(b.step)];
  if (Number.isNaN(x) || Number.isNaN(y)) return Number.isNaN(x) - Number.isNaN(y) || a.step.localeCompare(b.step);
  return x - y;
};

/**
 * The map of one scheme and brand: { scheme, name, brand, brands, areas, answers, shared, modes }.
 * modes.light and modes.dark hold { theme, families, decisions } for color: theme is the scheme's own
 * surface, text and line colors (the canvas wears them). shared holds { families, decisions } for every
 * other area, the same in both modes. Decisions are keyed by token id; a decision's answers are ids
 * into answers.
 */
export function tokenMapView({ scheme, grammar, brand = Object.keys(scheme.tokens.brands)[0], componentSource = "", waiting = {} }) {
  const reasons = reasonsOf(scheme, grammar);
  // A decision without a theme pick says why through its own, its group's or a usage rule's reason
  // (trace.mjs). A grammar trace rule links answers but says no why of the scheme's: none is invented.
  const trace = traceScheme(scheme, grammar);
  const traced = new Map(trace.tokens.map((t) => [t.token, t]));
  const tracedWhy = (id) => traced.get(tokenName(id))?.links.find((l) => l.by !== "pick" && l.why)?.why ?? null;
  const answer = (id) => (reasons[id] ? { id, question: reasons[id].question, answer: reasons[id].answer, why: reasons[id].why } : null);
  const graphs = Object.fromEntries(["light", "dark"].map((m) => [m, tokenGraph({ scheme, brand, mode: m, grammar, trace })]));
  const indexes = Object.fromEntries(["light", "dark"].map((m) => [m, colorIndex(graphs[m], m)]));
  const floorAnswer = reasons["accessibility.definition"]?.answer ?? "";
  const textFloor = /AAA/.test(floorAnswer) ? 7 : 4.5;
  const level = /AAA/.test(floorAnswer) ? "AAA" : "AA";

  const rowsOf = (rows) =>
    rows.map((id) => ({ id: tokenName(id), label: rowLabel(id), better: betterName(id, componentSource) }));
  const componentsOf = (index, d) =>
    componentsShowing(index, d).map((c) => ({ component: c.component, rows: rowsOf(c.rows) }));
  // One token index per mode, so the color graph (OD-304) resolves each value once.
  const tokenIndexes = Object.fromEntries(["light", "dark"].map((m) => [m, tokenIndex(scheme, { brand, mode: m })]));
  // A color token's decision graph, in the order the card reads it: role → jobs → property → answers →
  // rule → connections → value, and the reason sentence the engine writes from those fields.
  // A check that does not hold waits when the scheme records a fix for it, or when the connection's
  // baseline (waiting, the harness's connections-baseline.json counts) keeps gaps for this scheme.
  const waits = (n, x) => !x.holds && (!!x.waits || (waiting[n.name]?.[scheme.id] ?? 0) > 0);
  // A hue clash names the other token: "shares the amber hue with color.status.warning".
  const waitText = (n, x, mine) =>
    x.hue ? `shares the ${x.hue} hue with ${x.tokens.find((t) => t !== mine) ?? x.tokens[1]}` : x.says;
  const graphOf = (tree, name) => {
    const role = tree.find((n) => n.level === "role");
    if (!role) return null;
    const reason = tree.find((n) => n.level === "reason")?.says ?? null;
    const value = tree.find((n) => n.level === "value");
    return {
      role: role.says,
      to: role.to,
      gets: role.gets,
      // The role's jobs by title; the decision's mapping holds each job's how once.
      jobs: role.jobs.map((j) => j.title),
      // Why the token exists: the answers that create its role, or the reason every scheme ships it.
      made: { always: role.always, creates: role.creates, shapes: role.shapes },
      rules: tree.filter((n) => n.level === "rule").map((n) => ({ name: n.name, says: n.says, holds: n.holds })),
      connections: tree
        .filter((n) => n.level === "connection")
        .map((n) => {
          const mine = n.via ?? name.replace(/\.@$/, "");
          return {
            id: n.name,
            ...(n.via && { via: n.via }),
            holds: n.holds,
            checks: n.checks.length,
            // A pairs-with shows each pair it measures: the text, the ratio and the step promise.
            pairs: n.kind === "pairs-with" ? n.checks.filter((c) => c.holds).map((c) => c.says) : [],
            off: n.checks.filter((c) => !c.holds && !waits(n, c)).map((c) => c.says),
            waits: n.checks.filter((c) => waits(n, c)).map((c) => waitText(n, c, mine)),
          };
        }),
      value: value ? { name: value.name, hex: value.says } : null,
      reason,
    };
  };
  const chainOf = (index, d, mode = "light") => {
    const { steps, links } = reasonChain(index, reasons, d);
    const direct = links.filter((l) => l.to === "decision").map((l) => l.from);
    // OD-303: a mapped token shows the one answer that decides it, its property and the property's jobs.
    // The answers behind that answer belong to the answer, not to this token.
    const entry = mappingOf(grammar, tokenName(d));
    // What the token is for, from the grammar's semantics: its intent, uses and the token to use instead.
    const key = (grammar.semantics?.keys ?? []).find((k) => k.id === tokenName(d));
    const guide = key && { intent: key.intent ?? null, useFor: key.use_for ?? [], notFor: (key.not_for ?? []).map((n) => ({ when: n.when, use: n.use })) };
    // What each part of the name means: the semantic group and the variant, from the scheme and the grammar.
    const tree = decisionTree(scheme, grammar, d, { brand, mode, index: tokenIndexes[mode] });
    const meaning = tree
      .filter((n) => (n.level === "group" || n.level === "variant") && n.says)
      .map((n) => ({ level: n.level, name: n.name, says: n.says }));
    const property = tree.find((n) => n.level === "property");
    const graph = graphOf(tree, tokenName(d));
    if (property)
      return {
        ...(graph && { graph }),
        // The questions the engine says decide this kind of token, the mapping's first (decidersOf).
        answers: property.decided_by.map((a) => a.id).filter((id) => reasons[id]),
        direct,
        mapping: { property: property.name ?? entry?.title ?? null, says: property.says, jobs: property.jobs },
        ...(meaning.length && { meaning }),
        ...(guide && { guide }),
      };
    return { answers: steps.map((s) => s.id).filter((id) => reasons[id]), direct, ...(guide && { guide }) };
  };

  // Every area but color is the same in both modes: built once, from the light graph.
  const shared = { families: [], decisions: {} };
  {
    const families = new Map();
    for (const n of graphs.light.nodes) {
      if (n.tier !== "primitive" || n.id.startsWith("color.")) continue;
      const scale = SCALES.find(([re]) => re.test(n.id));
      if (!scale) continue;
      const [re, area, id, label, scope] = scale;
      const users = (indexes.light.readers.get(n.id) ?? []).filter((r) => {
        const node = indexes.light.nodes.get(r);
        return node?.tier === "semantic" && !node.deprecated;
      });
      if (!users.length) continue;
      for (const d of users) {
        if (shared.decisions[d]) continue;
        const pick = pickOf(scheme, brand, "light", d);
        const chain = chainOf(indexes.light, d);
        const parts = d.split(".");
        const group = parts[0] === "component-spacing-map" ? "Component spacing" : groupOf(parts.length > 2 ? d : `x.${parts[0]}`);
        shared.decisions[d] = {
          id: d,
          group,
          why: plainWhy(pick?.why) ?? tracedWhy(d),
          description: indexes.light.nodes.get(d)?.description ?? null,
          answers: chain.answers,
          direct: chain.direct,
          ...(chain.mapping && { mapping: chain.mapping }),
          ...(chain.meaning && { meaning: chain.meaning }),
          ...(chain.guide && { guide: chain.guide }),
          components: componentsOf(indexes.light, d),
        };
      }
      if (!families.has(id)) families.set(id, { id, area, label, scope, steps: [] });
      const step = re.exec(n.id)[1].replace("_", ".");
      families.get(id).steps.push({
        id: n.id,
        step,
        name: `${label} ${step}`,
        value: typeof n.value === "string" ? n.value : JSON.stringify(n.value),
        decisions: users,
        checks: [],
      });
    }
    for (const f of families.values()) f.steps.sort(stepOrder);
    shared.families = [...families.values()];
  }

  const modes = {};
  for (const mode of ["light", "dark"]) {
    const index = indexes[mode];
    const other = indexes[mode === "light" ? "dark" : "light"];
    const v = (id) => index.nodes.get(id)?.value ?? null;
    const brandHue = index.hues.find((h) => h.steps.some((s) => decisionsReading(index, s.id).includes("color.action.primary.@")))?.id ?? null;
    const decisions = {};
    const addDecision = (d, extra = {}) => {
      if (decisions[tokenName(d)]) return;
      const pick = pickOf(scheme, brand, mode, tokenName(d));
      const chain = chainOf(index, d, mode);
      decisions[tokenName(d)] = {
        id: tokenName(d),
        group: groupOf(d),
        why: plainWhy(pick?.why) ?? tracedWhy(d),
        description: index.nodes.get(d)?.description ?? null,
        answers: chain.answers,
        direct: chain.direct,
        ...(chain.mapping && { mapping: chain.mapping }),
        ...(chain.meaning && { meaning: chain.meaning }),
        ...(chain.guide && { guide: chain.guide }),
        ...(chain.graph && { graph: chain.graph }),
        components: componentsOf(index, d),
        ...extra,
      };
    };

    // The lightest step of a hue whose label passes the text floor, for a fill: a measured fact.
    const lightestFill = (hue, step, d) => {
      const job = jobFor(index, d);
      if (job?.kind !== "fill") return null;
      const label = v(job.against);
      const passing = hue.steps
        .filter((s) => contrastRatio(label, s.value) >= textFloor)
        .sort((a, b) => contrastRatio(b.value, "#000000") - contrastRatio(a.value, "#000000"));
      if (passing[0]?.id !== step.id) return null;
      const who = contrastRatio(label, "#FFFFFF") < 1.2 ? "white" : "dark";
      return `The lightest ${hue.id} where ${who} text reads at ${level}.`;
    };

    const colorFamilies = index.hues
      .map((hue) => {
        // All the hue's steps, used or not, decide "lightest"; only used steps are shown.
        const all = [...index.nodes.values()]
          .filter((n) => n.tier === "primitive" && primitiveParts(n.id)?.hue === hue.id && primitiveParts(n.id)?.mode === mode)
          .map((n) => ({ id: n.id, step: primitiveParts(n.id).step, value: n.value }));
        const steps = hue.steps
          .map((s) => {
            const { found, via } = decisionsUsing(index, s.id);
            if (!found.length) return null;
            for (const d of found) addDecision(d, { via: via[d] ? tokenName(via[d]) : null, stepWhy: lightestFill({ id: hue.id, steps: all }, s, d) });
            const low = contrastsOf(index, s.value).reduce((a, b) => (b.ratio < a.ratio ? b : a), { ratio: Infinity });
            const checks = [];
            for (const d of found) {
              const job = jobFor(index, d);
              if (!job) continue;
              const ratio =
                job.kind === "fill" ? contrastRatio(v(job.against), s.value) : Number.isFinite(low.ratio) ? low.ratio : null;
              if (ratio == null || ratio < job.needs) continue;
              const what =
                job.kind === "fill"
                  ? `${contrastRatio(v(job.against), "#FFFFFF") < 1.2 ? "White" : "Dark"} text on it is easy to read`
                  : job.kind === "text"
                    ? "Reads as text on every surface"
                    : "Visible on every surface";
              if (!checks.some((c) => c.what === what)) checks.push({ what, ratio: +ratio.toFixed(2) });
            }
            return {
              id: s.id,
              step: s.step,
              name: `${hue.id} ${s.step}`,
              value: s.value,
              otherMode: other.hues.find((h) => h.id === hue.id)?.steps.find((x) => x.step === s.step)?.value ?? null,
              brand: hue.id === brandHue,
              decisions: found.map(tokenName),
              checks,
            };
          })
          .filter(Boolean);
        return { id: hue.id, area: "Color", label: hue.id, scope: "color", steps };
      })
      .filter((f) => f.steps.length);

    modes[mode] = {
      theme: {
        canvas: v("color.surface.canvas"),
        panel: v("color.surface.default"),
        sunken: v("color.surface.sunken"),
        text: v("color.text.primary"),
        muted: v("color.text.secondary"),
        line: v("color.border.default"),
        lineStrong: v("color.border.strong"),
        accent: v("color.border.selected"),
        accentSoft: v("color.surface.selected"),
      },
      backgrounds: backgroundsOf(index).length,
      families: colorFamilies,
      decisions,
    };
  }

  // The answers the page quotes, by id, once.
  const quoted = new Set(["color.definition", "accessibility.definition"]);
  for (const s of ["spacing", "typography", "shape", "elevation", "motion", "accessibility", "color"])
    for (const k of ["definition", "values"]) quoted.add(`${s}.${k}`);
  for (const m of [shared, ...Object.values(modes)]) for (const d of Object.values(m.decisions)) d.answers.forEach((a) => quoted.add(a));
  const answers = Object.fromEntries([...quoted].map((id) => [id, answer(id)]).filter(([, a]) => a));

  return {
    scheme: scheme.id,
    name: scheme.name,
    brand,
    brands: Object.keys(scheme.tokens.brands),
    areas: AREAS.filter((a) => [...modes.light.families, ...shared.families].some((f) => f.area === a)),
    answers,
    // What each color connection says, by id, once: a decision's graph names its connections by id.
    connections: Object.fromEntries((grammar.semantics?.connections?.items ?? []).map((c) => [c.id, { kind: c.kind, says: c.says }])),
    shared,
    modes,
  };
}
