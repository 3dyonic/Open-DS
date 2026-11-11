// OD-246: the option corner. An option inside a menu or list has its own semantic, radius.option,
// whose pick is the panel's corner less the panel's padding, so the two corners nest. The pick reuses
// a primitive step where one fits and adds the step where none does. Options leave radius.badge,
// which goes back to badges and checkboxes. The panels that hold options read the overlay corner,
// radius.container, as the dropdown menu and the select already do. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { grammar, loadScheme, saveGrammar, saveScheme } from "../cli/src/schemes.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);

// The options: the rows a person picks from inside a panel.
const OPTIONS = [
  "combobox/item/radius",
  "command/item/radius",
  "context-menu/item/radius",
  "context-menu/checkbox/item/radius",
  "context-menu/radio/item/radius",
  "context-menu/sub/trigger/radius",
  "dropdown-menu/item/radius",
  "menubar/item/radius",
  "menubar/checkbox/item/radius",
  "menubar/radio/item/radius",
  "menubar/sub/trigger/radius",
  "select/item/radius",
];
// The panels that hold them: one kind of surface, one corner.
const PANELS = [
  "combobox/content/radius",
  "context-menu/content/radius",
  "context-menu/sub/content/radius",
  "menubar/content/radius",
  "menubar/sub/content/radius",
];
const PANEL_PADDING = "component-spacing-map.x1"; // every option panel's padding (grammar defaults)
const DESC = {
  option: "Corner of options in menus and lists: the panel's corner less its padding, so the corners nest.",
  badge: "Corner of badges, chips, tooltips, keyboard keys (kbd) and checkboxes: small labels and marks.",
  container: "Corner of cards, menus and dialogs.",
};

// 1. The grammar: option keys and panel keys follow the new defaults.
const g = grammar();
for (const e of g.component_keys) {
  if (OPTIONS.includes(e.id)) e.default = "radius.option";
  if (PANELS.includes(e.id)) e.default = "radius.container";
}
saveGrammar(g);

// 2. Every scheme and brand.
const px = (v) => (/rem$/.test(v) ? parseFloat(v) * 16 : /px$/.test(v) ? parseFloat(v) : NaN);
const ref = (v) => v.match(/^\{(.+)\}$/)?.[1];
for (const id of SCHEMES) {
  const s = loadScheme(id);
  const t = s.tokens;
  const prim = t.primitive.radius;
  // A reference resolves in the semantic tier first, then the primitive tier.
  const at = (path) => [t.semantic, t.primitive].map((tier) => path.split(".").reduce((n, k) => n?.[k], tier)).find((n) => n?.$value);
  const resolve = (v) => {
    for (let i = 0; i < 8 && ref(v); i++) v = at(ref(v))?.$value;
    return px(v ?? "");
  };
  const pad = resolve(`{${PANEL_PADDING}}`);
  if (!Number.isFinite(pad)) throw new Error(`${id}: ${PANEL_PADDING} does not resolve to a length.`);

  // The semantic, after badge, so the file reads in order.
  const sem = Object.entries(t.semantic.radius).filter(([k]) => k !== "option");
  sem.splice(sem.findIndex(([k]) => k === "badge") + 1, 0, [
    "option",
    { $type: "dimension", $value: "{theme.radius.option}", $description: DESC.option },
  ]);
  t.semantic.radius = Object.fromEntries(sem);
  t.semantic.radius.badge.$description = DESC.badge;
  t.semantic.radius.container.$description = DESC.container;

  for (const [brand, def] of Object.entries(t.brands)) {
    const r = def.theme.base.radius;
    const outerRef = ref(r.container.$value);
    const outer = px(prim[outerRef.split(".")[1]].$value);
    const want = Math.max(0, outer - pad);
    // Reuse the step that has this length; add it where the scale has none.
    let step = Object.keys(prim).find((k) => k[0] !== "$" && k !== "full" && px(prim[k].$value) === want);
    if (!step) {
      step = String(want);
      const entries = Object.entries(prim);
      const at = entries.findIndex(([k]) => k[0] !== "$" && k !== "full" && px(prim[k].$value) > want);
      entries.splice(at < 0 ? entries.length : at, 0, [step, { $type: "dimension", $value: `${want / 16}rem` }]);
      t.primitive.radius = Object.fromEntries(entries);
    }
    const why =
      want === 0
        ? `radius.${step}: square, because the panel's ${outer}px corner is used up by its ${pad}px padding.`
        : `radius.${step}: the panel's ${outer}px corner less its ${pad}px padding, so an option's corner nests inside the menu's.`;
    const theme = Object.entries(r).filter(([k]) => k !== "option");
    theme.splice(theme.findIndex(([k]) => k === "badge") + 1, 0, [
      "option",
      {
        $type: "dimension",
        $value: `{radius.${step}}`,
        // Written here, not by theme-reasons: the pick is computed from two decisions, not chosen.
        $extensions: { "open-ds": { why, because: ["shape.roles", "spacing.values"] } },
      },
    ]);
    def.theme.base.radius = Object.fromEntries(theme);
  }

  // Component keys.
  const set = (id2, to) => {
    const path = id2.split("/");
    const n = path.slice(0, -1).reduce((o, k) => o?.[k], t.component)?.[path.at(-1)];
    if (!n) throw new Error(`${id}: no component.${path.join(".")}`);
    n.$value = `{${to}}`;
  };
  for (const k of OPTIONS) set(k, "radius.option");
  for (const k of PANELS) set(k, "radius.container");
  saveScheme(s);
  console.log(`${id}: radius.option = ${Object.values(t.brands).map((d) => d.theme.base.radius.option.$value).join(", ")}`);
}
console.log(`radius.option on ${OPTIONS.length} option keys; ${PANELS.length} panels on the overlay corner.`);
