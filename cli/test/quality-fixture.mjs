// A small, made-up scheme and grammar for the quality gate tests (OD-298). Never the real schemes: each
// test builds a fresh copy, seeds one defect, and asserts the exact numbers. Exports helpers only.
import { scale } from "../src/ramps.mjs";
import { snapshotScheme } from "../src/quality/snapshot.mjs";
import { themeTokens } from "../src/tokens.mjs";

const q = (id, options) => ({ id, text: `${id}?`, options: options.map((o) => ({ id: o, label: o })) });

export function fixtureGrammar() {
  return {
    reasons: [{ id: "people", title: "People", questions: [q("people.q1", ["experts", "everyone"])] }],
    scopes: [
      { id: "spacing", title: "Spacing", kind: "scope", owns: ["space"], questions: [q("spacing.values", ["compact", "roomy"])] },
      { id: "color", title: "Color", kind: "scope", owns: ["color"], questions: [q("color.values", ["cool", "warm"])] },
      { id: "shape", title: "Shape", kind: "scope", owns: ["radius"], questions: [q("shape.values", ["sharp", "soft"])] },
      { id: "motion", title: "Motion", kind: "scope", owns: ["motion"], questions: [q("motion.values", ["fast", "moderate"])] },
      { id: "accessibility", title: "Accessibility", kind: "scope", owns: [], questions: [q("accessibility.values", ["pointer", "touch", "large"])] },
    ],
    situations: [],
    component_keys: [],
    trace: [],
    semantics: {
      keys: [{ id: "color.text.primary", pairs: { on: ["color.surface.default", "color.surface.sunken"], contrast: 4.5 } }],
      tones: { fills: [] },
      connections: {
        items: [{ id: "surface-ladder", kind: "stays-apart", by: "order", modes: ["dark"], tokens: ["color.surface.sunken", "color.surface.default", "color.surface.raised", "color.surface.floating"] }],
      },
    },
  };
}

const dim = (v) => ({ $type: "dimension", $value: v });
const ext = (why, because, more = {}) => ({ $extensions: { "open-ds": { why, because, ...more } } });
const tok = (value, why, because, more) => ({ $value: value, ...(why ? ext(why, because, more) : {}) });

const GRAY = {
  light: { 0: "#FFFFFF", 50: "#F7F8FA", 100: "#EEF1F5", 300: "#9AA3B0", 900: "#161B23" },
  dark: { 0: "#111111", 50: "#0B0D10", 100: "#16191F", 200: "#22262E", 300: "#3A3F48", 900: "#F0F2F5" },
};
const KEYS = { light: { key: "#4B3FD9" }, dark: { key: "#A9A3F6" } };

/** The violet scale of a mode, generated from its key over the fixture's dark canvas. */
export const violet = (mode, keys = KEYS) => scale(keys[mode], mode, GRAY.dark[0]);

const steps = (row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, { $type: "color", $value: v }]));

/** A fresh copy of the fixture scheme: 20 semantic values, two themes, every value traced. */
export function fixtureScheme() {
  return {
    id: "fixture",
    themes: [
      { id: "light", brand: "default", mode: "light" },
      { id: "dark", brand: "default", mode: "dark" },
    ],
    answers: [
      { question: "people.q1", option: "experts", why: "Experts read dense screens all day at work.", because: [] },
      { question: "spacing.values", option: "compact", why: "Compact spacing fits more records on one screen.", because: ["people.q1"] },
      { question: "color.values", option: "cool", why: "Cool neutrals keep the attention on the data.", because: [] },
      { question: "shape.values", option: "sharp", why: "Sharp corners let panels tile into a grid.", because: [] },
      { question: "motion.values", option: "fast", why: "Fast motion answers a click without a wait.", because: [] },
      { question: "accessibility.values", option: "pointer", why: "A pointer target suits desk work with a mouse.", because: [] },
    ],
    usage: [],
    tokens: {
      primitive: {
        space: { 2: dim("0.125rem"), 4: dim("0.25rem"), 8: dim("0.5rem"), 12: dim("0.75rem"), 16: dim("1rem") },
        size: { 16: dim("1rem"), 24: dim("1.5rem"), 32: dim("2rem"), 40: dim("2.5rem") },
        radius: { 0: dim("0rem"), 2: dim("0.125rem"), 4: dim("0.25rem"), 8: dim("0.5rem") },
        "border-width": { 1: dim("1px"), 2: dim("2px"), 3: dim("3px") },
        duration: { fast: { $value: "120ms" }, moderate: { $value: "200ms" }, slow: { $value: "300ms" } },
        font: { size: { 14: dim("0.875rem"), 16: dim("1rem") } },
        color: {
          gray: { light: steps(GRAY.light), dark: steps(GRAY.dark) },
          violet: { $extensions: { "open-ds": structuredClone(KEYS) }, light: steps(violet("light")), dark: steps(violet("dark")) },
        },
      },
      brands: {
        default: {
          theme: {
            base: { radius: { control: tok("{radius.2}", "radius.2: a small control corner keeps buttons crisp.", ["shape.values"]) } },
            light: {
              color: {
                surface: {
                  canvas: tok("{color.gray.light.50}", "gray.50: the light canvas sits just behind the cards.", ["color.values"]),
                  default: tok("{color.gray.light.0}", "gray.0: white content surface for cards and panels.", ["color.values"]),
                  sunken: tok("{color.gray.light.100}", "gray.100: sunken wells read a step below content.", ["color.values"]),
                  raised: tok("{color.gray.light.0}", "gray.0: raised menus stay white and rely on a shadow.", ["color.values"]),
                },
                text: { primary: tok("{color.gray.light.900}", "gray.900: primary text, darkest step for long reading.", ["color.values"]) },
                action: { primary: { "@": tok("{color.violet.light.600}", "violet.600: primary action carries the brand key color.", ["color.values"]) } },
              },
            },
            dark: {
              color: {
                surface: {
                  canvas: tok("{color.gray.dark.0}", "gray.dark.0: the dark canvas recedes behind all content.", ["color.values"]),
                  default: tok("{color.gray.dark.100}", "gray.dark.100: dark content surface above the canvas.", ["color.values"]),
                  sunken: tok("{color.gray.dark.50}", "gray.dark.50: dark sunken wells sit below content.", ["color.values"]),
                  raised: tok("{color.gray.dark.200}", "gray.dark.200: dark raised menus lift above content.", ["color.values"]),
                },
                text: { primary: tok("{color.gray.dark.900}", "gray.dark.900: dark primary text, near white for reading.", ["color.values"]) },
                action: { primary: { "@": tok("{color.violet.dark.600}", "violet.dark.600: dark primary action keeps the brand key.", ["color.values"]) } },
              },
            },
          },
        },
      },
      semantic: {
        space: { gap: { tight: tok("{space.4}", "Tight gap: 4px between things that belong together.", ["spacing.values"]) } },
        size: {
          control: {
            default: tok("{size.32}", "Default control height: 32px fits a pointer in dense rows.", ["accessibility.values"]),
            compact: tok("{size.24}", "Compact control height: one step below the default control.", ["accessibility.values"]),
          },
        },
        radius: {
          control: { $value: "{theme.radius.control}" },
          surface: tok("{radius.4}", "Surface corner: 4px softens cards and menus slightly.", ["shape.values"]),
          option: tok("{radius.0}", "Option corner: square, since the panel padding uses the corner.", ["shape.values"]),
        },
        "border-width": {
          default: tok("{border-width.1}", "Default border: a 1px line around every control.", ["people.q1"]),
          focus: tok("{border-width.2}", "Focus ring: 2px, one step above the default border.", ["people.q1"]),
        },
        "component-spacing-map": {
          $extensions: { "open-ds": { rhythm: 1, fixed: ["x1"], because: ["spacing.values"], why: "Compact spacing keeps the fixture's rows tight." } },
          x1: { $value: "{space.4}", $extensions: { "open-ds": { multiplier: 1, fixed: true } } },
          x2: { $value: "{space.8}", $extensions: { "open-ds": { multiplier: 2 } } },
          x3: { $value: "{space.12}", $extensions: { "open-ds": { multiplier: 3 } } },
        },
        color: {
          surface: {
            canvas: { $value: "{theme.color.surface.canvas}" },
            default: { $value: "{theme.color.surface.default}" },
            sunken: { $value: "{theme.color.surface.sunken}" },
            raised: { $value: "{theme.color.surface.raised}" },
          },
          text: { primary: { $value: "{theme.color.text.primary}" } },
          action: { primary: { "@": { $value: "{theme.color.action.primary.@}" } } },
        },
        motion: {
          duration: {
            feedback: tok("{duration.fast}", "Feedback duration: fast 120ms for hover and press.", ["motion.values"]),
            panels: tok("{duration.moderate}", "Panels duration: moderate 200ms for dialogs opening.", ["motion.values"]),
          },
        },
        type: { body: { "font-size": tok("{font.size.16}", "Body font size: 16px reads well at the default setting.", ["people.q1"]) } },
      },
      component: {
        overlay: { radius: { $value: "{radius.surface}" } },
        "dropdown-menu": {
          item: { radius: { $value: "{radius.option}" } },
          content: { padding: { $value: "{component-spacing-map.x1}" }, "border-width": { $value: "{border-width.default}" } },
        },
      },
    },
  };
}

/** The CSS variable names of every semantic in the fixture, as component code that reads them all. */
export const ALL_READS = [
  "space-gap-tight",
  "size-control-default",
  "size-control-compact",
  "radius-control",
  "radius-surface",
  "radius-option",
  "border-width-default",
  "border-width-focus",
  "component-spacing-map-x1",
  "component-spacing-map-x2",
  "component-spacing-map-x3",
  "color-surface-canvas",
  "color-surface-default",
  "color-surface-sunken",
  "color-surface-raised",
  "color-text-primary",
  "color-action-primary",
  "motion-duration-feedback",
  "motion-duration-panels",
  "type-body-font-size",
];

/** Component code facts with nothing wrong: no literals, no reduced-motion transforms, every semantic read. */
export const cleanUi = () => ({ files: 1, literals: [], reducedMotion: [], reads: [...ALL_READS] });

/**
 * A ref snapshot of one scheme: { ref, sha, schemes: { fixture }, ui }. reload is the loader a changed
 * stored file goes through (identity: the stored file is the scheme, as before OD-292); load turns the
 * stored file into the scheme first.
 */
export function snapshotOf(stored, { grammar = fixtureGrammar(), load = (s) => structuredClone(s), reload = load, ui = cleanUi(), ref = "fixture", approvals = [] } = {}) {
  const scheme = load(stored);
  return { ref, sha: null, schemes: { fixture: snapshotScheme({ scheme, stored, grammar, themeTokens, reload, uiPairs: ui.pairs ?? [] }) }, ui, approvals };
}

/** One measure's value from a list of measures. */
export const valueOf = (measures, id) => {
  const m = measures.find((x) => x.id === id);
  if (!m) throw new Error(`no measure ${id}`);
  return m.value;
};
