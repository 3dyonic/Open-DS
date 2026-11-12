// The foreground-on-background pairs each component draws (OD-298), read from its source. Pure.
//
// An element is one class string. In it, a foreground (text, an icon's fill or stroke) sits on the
// element's fill in the same state, or on its resting fill; with no fill of its own it sits on the page.
// A border and a focus ring sit on the page. A state is the variant prefix of a class (hover,
// focus-visible, aria-disabled, data-[state=checked]); "rest" has none. Only colors read through a
// CSS variable count: var(--button-primary-label).

const ROLE = {
  text: "text",
  placeholder: "text",
  caret: "text",
  decoration: "text",
  fill: "icon",
  stroke: "icon",
  border: "border",
  "border-t": "border",
  "border-r": "border",
  "border-b": "border",
  "border-l": "border",
  "border-x": "border",
  "border-y": "border",
  divide: "border",
  ring: "focus",
  outline: "focus",
};
const CLASS = /^((?:[^:\s]+:)*)(bg|text|placeholder|caret|decoration|fill|stroke|border(?:-[trblxy])?|divide|ring|outline)-\[(?:color:)?var\(--([a-z0-9-]+)\)\]$/;
const LITERAL = /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/gs;

/** The pairs one component's source draws: [{ component, state, role, fg, bg }], bg null for the page. */
export function pairsOfSource(component, src) {
  const out = new Map();
  const add = (p) => out.set(`${p.state}|${p.role}|${p.fg}|${p.bg}`, { component, ...p });
  for (const [, , literal] of src.matchAll(LITERAL)) {
    const states = new Map();
    for (const cls of literal.split(/\s+/)) {
      const m = cls.match(CLASS);
      if (!m) continue;
      const state = m[1] ? m[1].slice(0, -1) : "rest";
      const s = states.get(state) ?? { bg: null, fg: {} };
      if (m[2] === "bg") s.bg = m[3];
      else (s.fg[ROLE[m[2]]] ??= []).push(m[3]);
      states.set(state, s);
    }
    if (!states.size) continue;
    const rest = states.get("rest") ?? { bg: null, fg: {} };
    for (const [state, s] of states) {
      const bg = s.bg ?? rest.bg;
      for (const role of ["text", "icon"]) {
        // A state draws a pair when it changes the fill or this foreground.
        const fgs = s.fg[role] ?? (state === "rest" || s.bg ? (rest.fg[role] ?? []) : []);
        for (const fg of fgs) add({ state, role, fg, bg });
      }
      for (const role of ["border", "focus"]) for (const fg of s.fg[role] ?? []) add({ state, role, fg, bg: null });
    }
  }
  return [...out.values()];
}

/** Every pair the components draw, from files [{ file, text }] under ui/src/components. */
export function componentPairsOf(files) {
  return files
    .filter((f) => /(^|\/)components\/[^/]+\.tsx$/.test(f.file))
    .flatMap((f) => pairsOfSource(f.file.split("/").at(-1).replace(/\.tsx$/, ""), f.text));
}

/** The key that names one pair on both sides of a comparison. */
export const pairKey = (p) => `${p.component}|${p.state}|${p.role}|${p.fg}|${p.bg ?? "page"}`;
