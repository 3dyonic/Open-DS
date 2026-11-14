// The relations a scheme must keep. Two kinds:
//   recorded  relations the scheme's data states: the spacing map's multiplier and rhythm, and the
//             color scales generated from a recorded key color;
//   minimum   the relations the gate sets, checked where the data records none yet.
// Each relation reads a scheme's facts (resolved values, scales, answers) and returns its checks. A
// relation whose tokens a scheme does not have is "not present", never failed. Pure.
import { lch } from "../ramps.mjs";
import { CAP_PX } from "../spacing-map.mjs";
import { ms, px } from "./values.mjs";

/** Component keys the relations read, as snapshot names: the menu's corner, padding and border. */
export const RELATION_TOKENS = [
  "component.overlay.radius",
  "component.dropdown-menu.item.radius",
  "component.dropdown-menu.content.padding",
  "component.dropdown-menu.content.border-width",
];

/** Motion caps by family, in ms. Any other duration is expressive. */
export const MOTION_CAPS = { feedback: 150, panels: 300, expressive: 500 };
/** Hit areas in px: every control, and the default control of a touch-first scheme. */
export const HIT_AREA = { min: 24, touch: 44 };
/** Answers to accessibility.values that make a scheme touch-first: a large target is at least a touch one. */
export const TOUCH_FIRST = ["touch", "large"];
/**
 * The surface ladder, from the grammar's connections: the stays-apart connection by order.
 * { tokens, modes }: the rungs lowest first, and the modes where each rung is lighter than the one below.
 */
export function ladderOf(g) {
  const c = (g?.semantics?.connections?.items ?? []).find((x) => x.kind === "stays-apart" && x.by === "order");
  return { tokens: c?.tokens ?? [], modes: c?.modes ?? ["light", "dark"] };
}

const near = (a, b, tolerance = 0.01) => Math.abs(a - b) <= tolerance;
const fmt = (n) => (n === Infinity ? "a pill" : `${+n.toFixed(3)}px`);

// The step next to a value on a scale of px values, or null.
function stepFrom(scale, value, by) {
  const steps = [...new Set(scale.map((s) => s.px))].filter((n) => n !== null && Number.isFinite(n)).sort((a, b) => a - b);
  const i = steps.findIndex((n) => near(n, value));
  if (i < 0) return { want: null, why: `${fmt(value)} is not a step of the scale (${steps.join(", ")})` };
  const j = i + by;
  return j < 0 || j >= steps.length ? { want: null, why: `no step ${by > 0 ? "above" : "below"} ${fmt(value)}` } : { want: steps[j] };
}

// Every theme gives the same check for a mode-free value; a theme-dependent one is checked per theme.
// Checks are merged by subject: a subject fails when any theme fails it, and themes lists each theme
// it fails in.
function perTheme(facts, fn) {
  const bySubject = new Map();
  for (const theme of facts.themes) {
    for (const c of fn(facts.values[theme.id] ?? {}, theme) ?? []) {
      const prev = bySubject.get(c.subject);
      const themes = [...(prev?.themes ?? []), ...(c.pass ? [] : [theme.id])];
      if (!prev || (prev.pass && !c.pass)) bySubject.set(c.subject, { ...c, theme: theme.id, themes });
      else prev.themes = themes;
    }
  }
  return [...bySubject.values()];
}

const RELATIONS = [
  {
    id: "spacing-map",
    family: "invariants",
    kind: "recorded",
    title: "Each spacing map step is the base step × its multiplier × the rhythm, a multiple of 4px, at most 64px",
    links: (f) => (f.spacingMap && f.baseStep ? { inputs: [f.baseStep.path], outputs: f.spacingMap.steps.map((s) => s.token) } : null),
    check: (f) => {
      if (!f.spacingMap?.steps.length || !f.baseStep) return null;
      const { rhythm, fixed = [], steps } = f.spacingMap;
      return perTheme(f, (v) =>
        steps.map((s) => {
          const r = s.fixed || fixed.includes(s.token.split(".").at(-1)) ? 1 : rhythm;
          const want = Math.min(CAP_PX, Math.floor(s.multiplier * r + 0.5) * f.baseStep.px);
          const got = px(v[s.token]);
          const pass = got !== null && near(got, want);
          return { subject: s.token, pass, says: `${s.token} is ${got === null ? "not a length" : fmt(got)}; ${s.multiplier} × ${f.baseStep.px}px × rhythm ${r} gives ${fmt(want)}` };
        }),
      );
    },
  },
  {
    id: "color-scale",
    family: "invariants",
    kind: "recorded",
    title: "Each step of a generated color scale is the generator's output from its recorded key color",
    links: () => null,
    check: (f) =>
      f.colorScales?.length
        ? f.colorScales.map((c) => ({
            subject: `color.${c.hue}.${c.mode}.${c.step}`,
            themes: f.themes.filter((t) => t.mode === c.mode).map((t) => t.id),
            pass: String(c.stored).toUpperCase() === String(c.generated).toUpperCase(),
            says: `color.${c.hue}.${c.mode}.${c.step} is ${c.stored}; the key ${c.key} gives ${c.generated}`,
          }))
        : null,
  },
  {
    id: "focus-ring",
    family: "invariants",
    kind: "minimum",
    title: "The focus ring is the default border + 1 step",
    links: () => ({ inputs: ["border-width.default"], outputs: ["focus.ring.width", "border-width.focus"] }),
    check: (f) => {
      // The ring has its own token, focus.ring.width; older refs name it border-width.focus.
      const ring = has(f, ["focus.ring.width"]) ? "focus.ring.width" : "border-width.focus";
      if (!has(f, ["border-width.default", ring])) return null;
      return perTheme(f, (v) => {
        const d = px(v["border-width.default"]);
        const got = px(v[ring]);
        const { want, why } = stepFrom(f.scales["border-width"] ?? [], d, 1);
        return [{ subject: ring, pass: want !== null && near(got, want), says: want === null ? why : `${ring} is ${fmt(got)}; one step above the ${fmt(d)} border is ${fmt(want)}` }];
      });
    },
  },
  {
    id: "compact-step",
    family: "invariants",
    kind: "minimum",
    title: "A compact control is the default − 1 step on the control scale",
    links: () => ({ inputs: ["size.control.default"], outputs: ["size.control.compact"] }),
    check: (f) => {
      if (!has(f, ["size.control.default", "size.control.compact"])) return null;
      return perTheme(f, (v) => {
        const d = px(v["size.control.default"]);
        const got = px(v["size.control.compact"]);
        const { want, why } = stepFrom(f.scales.size ?? [], d, -1);
        return [{ subject: "size.control.compact", pass: want !== null && near(got, want), says: want === null ? why : `size.control.compact is ${fmt(got)}; one step below the ${fmt(d)} default is ${fmt(want)}` }];
      });
    },
  },
  {
    id: "nested-radius",
    family: "invariants",
    kind: "minimum",
    title: "A nested corner: outer = inner + padding + border (an inner corner never goes below 0)",
    links: () => ({ inputs: ["radius.surface"], outputs: ["radius.option"] }),
    check: (f) => {
      if (!has(f, RELATION_TOKENS)) return null;
      return perTheme(f, (v) => {
        const [outer, inner, pad, border] = RELATION_TOKENS.map((t) => px(v[t]));
        if ([outer, inner, pad, border].some((n) => n === null))
          return [{ subject: "radius.option", pass: false, says: "a corner, padding or border is not a length" }];
        const want = outer === Infinity ? Infinity : Math.max(0, outer - pad - border);
        const pass = want === Infinity ? inner === Infinity : inner !== Infinity && Math.abs(inner - want) <= 0.5;
        return [{ subject: "radius.option", pass, says: `the menu item corner is ${fmt(inner)}; a ${fmt(outer)} menu with ${fmt(pad)} padding and a ${fmt(border)} border gives ${fmt(want)}` }];
      });
    },
  },
  {
    id: "dark-ladder",
    family: "invariants",
    kind: "minimum",
    title: "In dark mode the surfaces lighten as they rise: sunken < default < raised < floating",
    links: () => null,
    check: (f) => {
      const { tokens: ladder, modes } = f.ladder;
      const dark = f.themes.filter((t) => modes.includes(t.mode));
      const present = ladder.filter((t) => dark.some((d) => typeof f.values[d.id]?.[t] === "string"));
      if (present.length < 2 || !dark.length) return null;
      const checks = [];
      for (const d of dark) {
        const v = f.values[d.id];
        for (let i = 1; i < present.length; i++) {
          const [lo, hi] = [present[i - 1], present[i]];
          const [a, b] = [v[lo], v[hi]].map((c) => (/^#[0-9a-f]{6}/i.test(c ?? "") ? lch(c.slice(0, 7))[0] : null));
          const subject = `${d.brand}: ${lo.split(".").at(-1)} < ${hi.split(".").at(-1)}`;
          checks.push({ subject, tokens: [lo, hi], theme: d.id, themes: [d.id], pass: a !== null && b !== null && a < b, says: `${subject}: lightness ${a?.toFixed(3)} vs ${b?.toFixed(3)}` });
        }
      }
      const missing = ladder.filter((t) => !present.includes(t));
      return { checks, notPresent: missing };
    },
  },
  {
    id: "duration-caps",
    family: "motion",
    kind: "minimum",
    title: `Durations stay within their family's cap: feedback ≤ ${MOTION_CAPS.feedback}ms, panels ≤ ${MOTION_CAPS.panels}ms, expressive ≤ ${MOTION_CAPS.expressive}ms`,
    links: () => null,
    check: (f) => {
      const names = Object.keys(f.values[f.themes[0]?.id] ?? {}).filter((t) => t.startsWith("motion.duration."));
      if (!names.length) return null;
      return perTheme(f, (v) =>
        names.map((t) => {
          const family = ["feedback", "panels"].includes(t.split(".")[2]) ? t.split(".")[2] : "expressive";
          const cap = MOTION_CAPS[family];
          const got = ms(v[t]);
          return { subject: t, pass: got !== null && got <= cap, says: `${t} is ${v[t]}; the ${family} cap is ${cap}ms` };
        }),
      );
    },
  },
  {
    id: "hit-area",
    family: "accessibility",
    kind: "minimum",
    title: `Every control is at least ${HIT_AREA.min}px; a touch-first scheme's default control is at least ${HIT_AREA.touch}px`,
    links: () => null,
    check: (f) => {
      const names = Object.keys(f.values[f.themes[0]?.id] ?? {}).filter((t) => /^size\.control\.[^.]+$/.test(t));
      if (!names.length) return null;
      const touch = TOUCH_FIRST.includes(f.answers?.["accessibility.values"]);
      return perTheme(f, (v) =>
        names.map((t) => {
          const floor = touch && t === "size.control.default" ? HIT_AREA.touch : HIT_AREA.min;
          const got = px(v[t]);
          return { subject: t, pass: got !== null && got >= floor, says: `${t} is ${got === null ? v[t] : fmt(got)}; the floor is ${floor}px${touch ? " (touch-first)" : ""}` };
        }),
      );
    },
  },
];

const has = (f, names) => f.themes.length > 0 && names.every((n) => f.values[f.themes[0].id]?.[n] !== undefined && f.values[f.themes[0].id]?.[n] !== null);

/** The relations, for listing. */
export const RELATION_LIST = RELATIONS.map(({ id, family, kind, title }) => ({ id, family, kind, title }));

/**
 * Every relation evaluated on one scheme's facts: [{ id, family, kind, title, status, checks, notPresent }].
 * status is "pass", "fail" or "not present". facts: { themes, values, scales, spacingMap, baseStep,
 * colorScales, answers, ladder }.
 */
export function evaluateRelations(facts) {
  return RELATIONS.map((r) => {
    const out = r.check(facts);
    const checks = Array.isArray(out) ? out : (out?.checks ?? []);
    const notPresent = Array.isArray(out) ? [] : (out?.notPresent ?? []);
    const status = out === null ? "not present" : checks.every((c) => c.pass) ? "pass" : "fail";
    return { id: r.id, family: r.family, kind: r.kind, title: r.title, status, checks, notPresent };
  });
}

/** What each relation ties together, for the blast radius: [{ id, inputs, outputs }]. */
export function relationLinks(facts) {
  return RELATIONS.map((r) => ({ id: r.id, ...(r.links(facts) ?? { inputs: [], outputs: [] }) })).filter((l) => l.inputs.length);
}
