// OD-241: the state fill gets its own semantic, color.surface.highlight. A state is shown by the
// item's background, one step from the surface it sits on. surface.sunken goes back to depth only.
// Adds the grammar guidance and, in every scheme and brand, the semantic and its theme picks, each
// with its why (from the surfaces it meets) and the answers it follows from. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const ID = "color.surface.highlight";
const INTENT =
  "The fill of the item the pointer or the keyboard is on. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.";

const g = read("schemes/grammar.json");
const keys = g.semantics.keys;
if (!keys.some((k) => k.id === ID)) {
  const at = keys.findIndex((k) => k.id === "color.surface.sunken");
  keys.splice(at + 1, 0, {
    id: ID,
    intent: INTENT,
    use_for: ["Highlighted menu items", "Highlighted options"],
    not_for: [
      { when: "Table headers and wells", use: "color.surface.sunken" },
      { when: "A selected or current item", use: "color.surface.selected" },
    ],
  });
  const sunken = keys[at];
  sunken.not_for.push({ when: "An item the pointer or the keyboard is on", use: ID });
  const fills = g.semantics.tones.fills;
  const f = fills.findIndex((x) => x.id === "color.surface.sunken");
  fills.splice(f + 1, 0, { id: ID, carries: [...fills[f].carries] });
  write("schemes/grammar.json", g);
}

const step = (ref) => ref.match(/^\{color\.neutral\.(\d+)\}$/)?.[1];
for (const id of SCHEMES) {
  const s = read(`schemes/${id}.json`);
  const surface = s.tokens.semantic.color.surface;
  if (!surface.highlight) {
    // After sunken, so the semantic file reads in the grammar's order.
    const entries = Object.entries(surface);
    const i = entries.findIndex(([k]) => k === "sunken");
    entries.splice(i + 1, 0, [
      "highlight",
      { $type: "color", $description: "The item the pointer or the keyboard is on.", $value: "{theme.color.surface.highlight}" },
    ]);
    s.tokens.semantic.color.surface = Object.fromEntries(entries);
  }
  for (const def of Object.values(s.tokens.brands))
    for (const mode of ["light", "dark"]) {
      const c = def.theme[mode].color.surface;
      const pick = c.sunken.$value;
      const on = [...new Set([c.default.$value, c.raised.$value])].map(step);
      const here = step(pick);
      const dir = mode === "light" ? "darker" : "lighter";
      const steps = g.semantics.neutral.steps;
      const far = Math.min(...on.map((x) => Math.abs(steps.indexOf(here) - steps.indexOf(x))));
      const count = ["no step", "one step", "two steps", "three steps"][far] ?? `${far} steps`;
      const why =
        `neutral.${here}, ${count} ${dir} than the surfaces it sits on (neutral.${on.join(" and neutral.")}), ` +
        `so the item under the pointer or the keyboard reads as a band${mode === "dark" ? " on the menu and on cards" : " without lifting off the page"}` +
        (far > 1 && step(c.canvas.$value) && steps.indexOf(step(c.canvas.$value)) > Math.min(...on.map((x) => steps.indexOf(x))) &&
        steps.indexOf(step(c.canvas.$value)) < steps.indexOf(here)
          ? `. It skips neutral.${step(c.canvas.$value)}, the page canvas, so a menu item never matches the page behind it.`
          : ".");
      const entries = Object.entries(c).filter(([k]) => k !== "highlight");
      const i = entries.findIndex(([k]) => k === "sunken");
      entries.splice(i + 1, 0, [
        "highlight",
        {
          $type: "color",
          $value: pick,
          $extensions: {
            "open-ds": { tone: c.sunken.$extensions["open-ds"].tone, why, because: ["accessibility.roles", "color.definition"] },
          },
        },
      ]);
      def.theme[mode].color.surface = Object.fromEntries(entries);
    }
  write(`schemes/${id}.json`, s);
}
console.log(`${ID}: grammar guidance and tone, and a reasoned pick in every scheme, brand and mode.`);
