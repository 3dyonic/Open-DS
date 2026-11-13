// OD-300: the round 1 and 2 decisions the owner (Yonatan) made on 2026-11-12, written into the
// grammar and every scheme. Each section names its In item. Each value it adds or changes gets a
// reason. Idempotent: run it again and nothing changes.
//
//   node scripts/od-300-decisions.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { formatGrammar, grammar as loadGrammar, loadScheme, saveGrammar, saveScheme, schemeIds } from "../cli/src/schemes.mjs";

const g = loadGrammar();
const keyOf = (id) => {
  const k = g.component_keys.find((x) => x.id === id);
  if (!k) throw new Error(`No component key ${id} in the grammar.`);
  return k;
};
const setKey = (id, def, description) => Object.assign(keyOf(id), { default: def, description });
const addKey = (id, def, description) => {
  const comp = id.split("/")[0];
  const c = g.components.find((x) => x.id === comp);
  if (!c) throw new Error(`No component ${comp} in the grammar.`);
  const e = g.component_keys.find((x) => x.id === id);
  if (e) Object.assign(e, { default: def, description });
  else {
    const last = g.component_keys.map((k) => k.component).lastIndexOf(comp);
    g.component_keys.splice(last + 1, 0, { id, component: comp, description, default: def });
  }
  if (!c.keys.includes(id)) c.keys.push(id);
};
const scope = (id) => g.scopes.find((s) => s.id === id);
const relation = (scopeId, id) => scope(scopeId).relations.find((r) => r.id === id);
const writeSchema = (name, edit) => {
  const path = new URL(`../schema/${name}`, import.meta.url);
  const schema = JSON.parse(readFileSync(path, "utf8"));
  edit(schema);
  writeFileSync(path, formatGrammar(schema));
};
const dot = (id) => `component.${id.replaceAll("/", ".")}`;

// ---------- Item 1: the edge rule ----------
// A line that is the only cue you can click or type must be seen (3:1). Importance picks its strength,
// and the same importance gets the same line: every such edge reads color.border.strong. A line that
// is not the only cue stays faint, and the grammar says why for each.
const STRONG = "color.border.strong";
const FAINT = "color.border.default";
setKey(
  "combobox/input/border",
  STRONG,
  "Border of the search field in the combobox's list: the strong edge, the same as the input's, as the edge is the only cue that you can type there.",
);
setKey(
  "sidebar/menu-button/outline/border/@",
  STRONG,
  "Edge of an outline menu button, of the sidebar: the strong edge, the same as the outline (secondary) button's, as the edge is the only cue that it is a button.",
);
setKey(
  "item/outline/border",
  FAINT,
  "Edge of a static outline item: the faint line. A static item cannot be clicked, so its edge only groups its content.",
);
addKey(
  "item/outline/clickable/border",
  STRONG,
  "Edge of an outline item that is a link or a button: the strong edge, as the edge is the only cue that the item can be clicked.",
);
setKey(
  "tabs/list/border",
  FAINT,
  "List border of the tabs: the faint line. Each tab's label shows that it can be clicked, so the line only separates the tabs from the panel.",
);
const EDGES = [
  "input/border/@",
  "input-group/border/@",
  "input-otp/slot/border/@",
  "native-select/border",
  "select/trigger/border/@",
  "textarea/border",
  "combobox/chips/border",
  "combobox/input/border",
  "button/secondary/border",
  "toggle/outline/border",
  "sidebar/menu-button/outline/border/@",
  "item/outline/clickable/border",
];
const QUIET = [
  { token: "tabs/list/border", why: "Each tab's label is the cue that it can be clicked. The line under the list only separates the tabs from the panel." },
  { token: "item/outline/border", why: "A static item cannot be clicked. Its edge only groups the item's content." },
];
for (const id of [...EDGES, ...QUIET.map((q) => q.token)]) keyOf(id);
const line = relation("shape", "default-line");
line.boundaries = EDGES.map(dot);
line.quiet = QUIET.map((q) => ({ token: dot(q.token), why: q.why }));
line.says =
  "A decision: the layering answer says whether lines separate groups, and the contrast floor says how heavy a line must be to be seen. The edge rule: a line that is the only cue that you can click or type is a boundary and needs 3:1. Importance picks its strength, and the same importance gets the same line, so every boundary reads color.border.strong. A line that is not the only cue stays faint, and quiet says why for each.";
writeSchema("grammar.schema.json", (schema) => {
  const walk = (node) => {
    if (!node || typeof node !== "object") return null;
    if (node.boundaries && node.floor && node.properties === undefined) return node;
    for (const v of Object.values(node)) {
      const hit = walk(v);
      if (hit) return hit;
    }
    return null;
  };
  const props = walk(schema);
  if (!props) throw new Error("No relation properties with boundaries in grammar.schema.json.");
  props.boundaries.description =
    "For a line: the component colors whose edge is the only cue that you can click or type there (the edge rule). Each reads color.border.strong and needs the floor's contrast against surface.default (WCAG 1.4.11).";
  props.quiet = {
    type: "array",
    description: "For a line: the component colors whose edge is not the only cue, so they stay faint (color.border.default), each with its reason.",
    items: {
      type: "object",
      additionalProperties: false,
      required: ["token", "why"],
      description: "One faint line and why it may stay faint.",
      properties: {
        token: { type: "string", pattern: "^component\\.", description: "A component token path, for example component.tabs.list.border." },
        why: { type: "string", minLength: 1, description: "What else shows that the part can be clicked or typed in, or why it cannot." },
      },
    },
  };
});

// ---------- Item 8: the skeleton fills with neutral step 200 ----------
// Colors map to scale steps only. Step 200 is the nearest step to the chosen look; sunken (step 100)
// is the well's job, and a placeholder is not a well.
setKey(
  "skeleton/background",
  "color.neutral.200",
  "Fill of the skeleton: neutral step 200, the nearest scale step to the chosen look. A placeholder shows content to come, so it does not take the sunken fill of a well.",
);

saveGrammar(g);

// ---------- Schemes ----------
for (const id of schemeIds()) {
  const s = loadScheme(id);

  // Item 5: Multi-brand makes two corner sizes, not three.
  if (id === "multi-brand") {
    const a = s.answers.find((x) => x.question === "shape.count");
    a.option = "two";
    a.why = "Two corner sizes: one for controls and badges, and a larger one for containers, as Aster's 4px and 8px corners show.";
    a.because = ["shape.roles", "shape.values"];
  }

  saveScheme(s);
}
console.log("OD-300: grammar and every scheme written.");
