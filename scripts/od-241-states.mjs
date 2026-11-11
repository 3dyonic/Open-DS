// OD-241: the state rules, written once on their semantics. highlight covers the pointer, the
// keyboard and an open submenu; selected covers a toggle that is on; pressed gets its own semantic,
// whose pick follows each scheme's answer to "Which states get their own visible value?".
// Idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { grammar, loadScheme, saveGrammar, saveScheme } from "../cli/src/schemes.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);

const g = grammar();
const keys = g.semantics.keys;
const key = (id) => keys.find((k) => k.id === id);
const hl = key("color.surface.highlight");
hl.intent =
  "The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surface it sits on: darker in light, lighter in dark.";
hl.use_for = ["Highlighted menu items", "Highlighted options", "Hover rows", "Open submenu triggers"];
const sunken = key("color.surface.sunken");
sunken.use_for = sunken.use_for.filter((u) => u !== "Hover rows");
const sel = key("color.surface.selected");
sel.intent = "The fill of a selected or current item, or a toggle that is on.";
if (!sel.use_for.includes("Toggles that are on")) sel.use_for.push("Toggles that are on");
if (!key("color.surface.pressed")) {
  keys.splice(keys.indexOf(hl) + 1, 0, {
    id: "color.surface.pressed",
    intent:
      "The fill of an item while it is pressed. Where the scheme gives pressed its own value, one step past the highlight; where pressed reuses hover, the highlight's step.",
    use_for: ["Pressed menu buttons", "Pressed list items"],
    not_for: [{ when: "The item the pointer or the keyboard is on", use: "color.surface.highlight" }],
  });
  const fills = g.semantics.tones.fills;
  const f = fills.findIndex((x) => x.id === "color.surface.highlight");
  fills.splice(f + 1, 0, { id: "color.surface.pressed", carries: ["text.primary", "text.secondary", "icon", "border", "focus"] });
}
saveGrammar(g);

const steps = g.semantics.neutral.steps;
const step = (ref) => ref.match(/^\{color\.neutral\.(\d+)\}$/)?.[1];
for (const id of SCHEMES) {
  const s = loadScheme(id);
  const roles = s.answers.find((a) => a.question === "accessibility.roles");
  const own = roles.option !== "hover-focus-disabled";
  const surface = s.tokens.semantic.color.surface;
  if (!surface.pressed) {
    const e = Object.entries(surface);
    e.splice(e.findIndex(([k]) => k === "highlight") + 1, 0, [
      "pressed",
      { $type: "color", $description: "The item while it is pressed.", $value: "{theme.color.surface.pressed}" },
    ]);
    s.tokens.semantic.color.surface = Object.fromEntries(e);
  }
  for (const def of Object.values(s.tokens.brands))
    for (const mode of ["light", "dark"]) {
      const c = def.theme[mode].color.surface;
      const h = step(c.highlight.$value);
      const here = own ? steps[steps.indexOf(h) + 1] : h;
      const why = own
        ? `neutral.${here}, one step past the highlight (neutral.${h}), so a press reads as its own change under the finger: ${roles.why.replace(/\.$/, "").toLowerCase()}.`
        : `neutral.${here}, the highlight's step: ${roles.why.replace(/\.$/, "").toLowerCase()}.`;
      const e = Object.entries(c).filter(([k]) => k !== "pressed");
      e.splice(e.findIndex(([k]) => k === "highlight") + 1, 0, [
        "pressed",
        {
          $type: "color",
          $value: `{color.neutral.${here}}`,
          $extensions: { "open-ds": { tone: c.highlight.$extensions["open-ds"].tone, why, because: ["accessibility.roles", "color.definition"] } },
        },
      ]);
      def.theme[mode].color.surface = Object.fromEntries(e);
    }
  saveScheme(s);
}
console.log("State rules written; color.surface.pressed picked in every scheme from its answer.");
