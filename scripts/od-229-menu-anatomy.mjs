// OD-229: the parts layer for the menu, from the approved Figma page (Anatomy reference, node 35:267).
// The grammar says what the parts are, the jobs they do for people (roles), and which answers, rules
// and tokens each card follows. The words and values come from each scheme, so every scheme gets its
// own page from this one description. Idempotent.
import { readFileSync, writeFileSync } from "node:fs";
import { grammar, saveGrammar } from "../cli/src/schemes.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);

// The jobs a part does for a person, as the questions it answers (the Figma page's "Design roles").
const ROLES = [
  { id: "containment", label: "Containment", ask: "What holds this?" },
  { id: "layering", label: "Layering", ask: "What sits on top?" },
  { id: "hierarchy", label: "Hierarchy", ask: "What do you read first?" },
  { id: "readability", label: "Readability", ask: "Can you read it?" },
  { id: "emphasis", label: "Emphasis", ask: "Where does the eye go?" },
  { id: "meaning", label: "Meaning", ask: "What state is it in?" },
  { id: "affordance", label: "Affordance", ask: "Can you act on it?" },
  { id: "feedback", label: "Feedback", ask: "Did it respond?" },
  { id: "focus", label: "Focus", ask: "Where is the keyboard?" },
  { id: "grouping", label: "Grouping", ask: "What belongs together?" },
  { id: "reach", label: "Reach", ask: "Can you hit it?" },
];

const MENU = {
  intro: "the menu",
  // The drawing: one real menu, drawn from the scheme's tokens, with a number on each part.
  drawing: {
    kind: "menu",
    surface: [1],
    shadow: [2],
    rows: [
      { label: "Share with", icon: "share", chevron: true, state: "focus", marks: { focus: 8, label: 3, chevron: 6 } },
      { label: "Copy", icon: "copy", shortcut: "⌘C", state: "highlight", marks: { icon: 4, shortcut: 5, row: 7 } },
      { label: "Paste special", icon: "clipboard", shortcut: "⌘⇧V", state: "disabled", marks: { row: 9 } },
      { separator: true, marks: { row: 11 } },
      { label: "Delete", icon: "trash", tone: "danger", marks: { row: 10 } },
    ],
  },
  // The legend: every part, required or optional, and its roles. A part with no number isn't drawn.
  parts: [
    { id: "menu", label: "Menu", need: "required", children: [
      { n: 1, id: "surface", label: "Surface", need: "required", roles: ["containment", "layering"], tokens: ["component.overlay.background", "component.dropdown-menu.content.border"] },
      { n: 2, id: "shadow", label: "Shadow", need: "required", roles: ["layering"], tokens: ["component.overlay.shadow"] },
    ] },
    { id: "item", label: "Item", need: "required", roles: ["readability", "reach", "affordance"], children: [
      { n: 3, id: "item-label", label: "Item label", need: "required", roles: ["readability", "hierarchy"], tokens: ["component.dropdown-menu.item.font-size"] },
      { n: 4, id: "item-icon", label: "Item icon", need: "optional", roles: ["meaning"], tokens: ["component.dropdown-menu.item.icon"] },
      { n: 5, id: "shortcut", label: "Shortcut", need: "optional", roles: ["hierarchy"], tokens: [] },
      { n: 6, id: "submenu-chevron", label: "Submenu chevron", need: "optional", roles: ["affordance"], tokens: [] },
      { n: 7, id: "highlight-fill", label: "Highlight fill", need: "state", roles: ["feedback"], tokens: ["component.dropdown-menu.item.background.highlight"] },
      { n: 8, id: "focus-ring", label: "Focus ring", need: "state", roles: ["focus"], tokens: ["color.border.focus", "border-width.focus"] },
      { n: 9, id: "disabled-item", label: "Disabled item", need: "state", roles: ["feedback"], tokens: ["component.dropdown-menu.item.disabled"] },
      { n: 10, id: "destructive-item", label: "Destructive item", need: "optional", roles: ["meaning", "emphasis"], tokens: ["component.dropdown-menu.item.label.destructive"] },
    ] },
    { n: 11, id: "separator", label: "Separator", need: "optional", roles: ["grouping"], tokens: ["component.dropdown-menu.separator.background"] },
    { id: "group-label", label: "Group label", need: "optional", note: "not in this example", roles: ["hierarchy", "grouping"], tokens: [] },
  ],
  // The cards: how the decisions reach each part, from the answer to the value you see.
  cards: [
    { title: "Surface and shadow", parts: [1, 2], roles: ["containment", "layering"], answers: ["elevation.roles", "elevation.values"], rules: ["menu-or-dialog"], tokens: ["component.overlay.background", "component.overlay.shadow"] },
    { title: "Item", parts: [3, 4, 5], image: { row: "Copy", marks: { icon: 4, label: 3, shortcut: 5 } }, roles: ["readability", "reach", "affordance"], answers: ["typography.values", "spacing.values", "accessibility.values"], rules: ["smallest-target"], tokens: ["component.dropdown-menu.item.font-size", "component.dropdown-menu.item.padding-x", "component.overlay.item-height"] },
    { title: "Highlight fill", parts: [7], roles: ["feedback"], answers: ["accessibility.roles", "motion.values"], rules: ["hover-feedback"], tokens: ["component.dropdown-menu.item.background.highlight"] },
    { title: "Focus ring", parts: [8], roles: ["focus"], answers: ["accessibility.definition"], rules: ["keyboard-focus"], tokens: ["color.border.focus", "border-width.focus"] },
    { title: "Disabled item", parts: [9], roles: ["feedback"], answers: ["accessibility.roles"], rules: [], tokens: ["component.dropdown-menu.item.disabled"] },
    { title: "Destructive item", parts: [10], roles: ["meaning", "emphasis"], answers: ["accessibility.count"], rules: ["destructive-action"], tokens: ["component.dropdown-menu.item.label.destructive"] },
    { title: "Separator", parts: [11], roles: ["grouping"], answers: ["elevation.definition"], rules: ["between-sections"], tokens: ["component.dropdown-menu.separator.background"] },
  ],
};

const g = grammar();
g.anatomy = {
  description: "The parts layer (OD-229): the jobs a part does for a person, as the questions it answers. A catalogue component that describes its parts gets an Anatomy reference page.",
  roles: ROLES,
};
const item = g.catalogue.items.find((i) => i.id === "dropdown-menu");
item.anatomy = MENU;
saveGrammar(g);

// The schema admits the parts layer.
const sp = "schema/grammar.schema.json";
const sch = read(sp);
sch.properties.anatomy = {
  type: "object",
  description: "The parts layer (OD-229): the roles a part can play, as the questions they answer.",
  required: ["description", "roles"],
  properties: {
    description: { type: "string", minLength: 1 },
    roles: {
      type: "array",
      items: { type: "object", additionalProperties: false, required: ["id", "label", "ask"], properties: { id: { type: "string", pattern: "^[a-z-]+$" }, label: { type: "string" }, ask: { type: "string" } } },
    },
  },
};
const itemSchema = (o) => (o?.properties?.items?.items ? o.properties.items.items : null);
let target = itemSchema(sch.properties.catalogue);
if (target?.$ref) target = target.$ref.replace("#/$defs/", "").split("/").reduce((n, k) => n[k], sch.$defs);
if (target?.properties)
  target.properties.anatomy = {
    type: "object",
    description: "The component's parts (OD-229): the drawing, every part with its roles, and the cards that follow each decision to its part. Its Anatomy reference page is generated from it.",
  };
write(sp, sch);
console.log("The menu's parts layer, with 11 roles, in the grammar.");
