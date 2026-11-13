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
const answerOf = (s, question) => s.answers.find((a) => a.question === question);
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

// ---------- Item 2: handles are faint at rest, strong under the pointer and in keyboard focus ----------
// A scroll thumb and a resize handle are tools, not content: at rest they stay quiet so the screen does
// not get busy. Under the pointer or in keyboard focus they take the strong border, and keyboard focus
// adds the focus ring (the mock the owner approved: Figma bFTn13mWXP5HXSXSgVBL8m).
setKey(
  "scroll-area/thumb/background",
  FAINT,
  "Fill of the scroll thumb at rest: the faint line, so a handle stays quiet while you read.",
);
addKey(
  "scroll-area/thumb/background-hover",
  STRONG,
  "Fill of the scroll thumb under the pointer: the strong border, so the handle you are about to drag is clear (3:1).",
);
addKey(
  "scroll-area/thumb/background-focus",
  STRONG,
  "Fill of the scroll thumb while its scroll area has keyboard focus: the strong border, the same as under the pointer. The area also shows the focus ring.",
);
setKey(
  "resizable/handle/background",
  FAINT,
  "Fill of the resize handle's line at rest: the faint line, so the panels read as one surface while you work.",
);
addKey(
  "resizable/handle/background-hover",
  STRONG,
  "Fill of the resize handle's line under the pointer: the strong border, so the line you are about to drag is clear (3:1).",
);
addKey(
  "resizable/handle/background-focus",
  STRONG,
  "Fill of the resize handle's line in keyboard focus: the strong border, the same as under the pointer, with the focus ring around it.",
);
const strongRule = g.semantics.keys.find((k) => k.id === STRONG);
const HANDLE_USE = "A scroll thumb or a resize handle under the pointer or in keyboard focus";
if (!strongRule.use_for.includes(HANDLE_USE)) strongRule.use_for.push(HANDLE_USE);

// ---------- Item 3: a row matches the control height in every scheme ----------
// The loader generates the row from the default control (OD-301). The trace rule states it as a decision,
// with its reason, so no scheme adds a few pixels to its rows again.
const rowRule = g.trace.find((r) => r.tokens.join() === "size.row");
rowRule.says =
  "Decided: a row is one default control tall in every scheme. A row holds controls, so a taller row only adds a gap around them, and a shorter one cuts them. The target size answer sets the control height; the roles answer says whether rows are a decision of their own, and the values answer sets the density they follow.";

// ---------- Item 4: the switch track is about twice its height, and the thumb slides ----------
// The track is the thumb plus the padding on each side, so it fits the thumb exactly. The thumb slides
// one track height, so the track is twice its height. The width and height keys multiplied the icon
// size by 2.25 and 1.25 in code, and the travel was one thumb's width; they give way to the thumb's size.
const SWITCH_OLD = ["switch/width", "switch/height", "switch/thumb/travel"];
const deprecateKey = (id, by) => {
  const e = keyOf(id);
  e.replaced_by = by;
  e.description = `Deprecated: use ${by} (OD-300). ${e.description.replace(/^Deprecated: use [^ ]+ \(OD-\d+\)\. /, "")}`;
};
for (const id of SWITCH_OLD) deprecateKey(id, "switch/thumb/size");
// A key deprecated earlier in favour of one deprecated now points at the key that replaces both.
const REPOINTED = new Set();
for (const k of g.component_keys) {
  let by = k.replaced_by;
  while (by && keyOf(by).replaced_by) by = keyOf(by).replaced_by;
  if (by && by !== k.replaced_by) {
    k.description = k.description.replace(`use ${k.replaced_by} `, `use ${by} `);
    k.replaced_by = by;
    REPOINTED.add(k.id);
  }
}
setKey(
  "switch/thumb/size",
  "size.icon",
  "Size of the switch's thumb: the icon size. The track is the thumb plus the padding on each side, so the thumb sets the track's height. The thumb slides one track height, so the track is twice its height.",
);
setKey(
  "switch/padding",
  "component-spacing-map.hairline",
  "Padding of the switch: the gap between the track's edge and the thumb, on every side.",
);

// ---------- Item 9: compact buttons in touch-first schemes get a 44px hit area ----------
// Multi-brand draws compact buttons at 36px; touch needs 44px. The drawn box keeps its size and the hit
// area grows past it, as the checkbox's and the switch's do. Buttons joined in a vertical group touch,
// so there the hit area does not grow: it would cover the next button.
addKey(
  "button/hit-area",
  "size.hit-area",
  "The button's hit area: it grows past a drawn box that is smaller, such as a compact button on touch, and never into a joined neighbour.",
);

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

  // Item 6: Accessible first keeps muted text at 6.54:1 on the canvas, a recorded exception. The promise
  // says what it holds: AAA for text you must read, AA for muted text, which must look secondary.
  if (id === "accessible-first") {
    const PROMISE = "AAA contrast for the text you must read";
    s.summary = `Large text, large targets and ${PROMISE}, so everyone can finish the task.`;
    s.description = s.description.replace(/Large text, large targets and AAA contrast[^,]*, so everyone can finish the task\./, s.summary);
    answerOf(s, "accessibility.definition").why =
      "AAA for text you must read; AA for muted text, which must look secondary. Muted text on the canvas is the owner's recorded exception.";
    const muted = s.tokens.brands.default.theme.light.color.text.muted;
    muted.$extensions["open-ds"] = {
      why: "neutral.500: We use the quietest readable gray for hints and captions in order to keep muted text a step below secondary text (neutral.700). The step does this by reading 7.0:1 on surface.default and 6.54:1 on the canvas. The canvas pair falls under 7:1 by the owner's recorded exception: AA for muted text, as neutral.600 would read 1.34:1 from secondary and no longer look secondary. So a hint reads as a hint and every line you must read keeps AAA, because the floor is AAA for text you must read (accessibility.definition) and the neutral ramp sets the steps (color.definition).",
      because: ["accessibility.definition", "color.definition"],
    };
  }

  // Item 7: a button label never breaks onto two lines. A voice rule, not a line-height fix; check_ui
  // flags a label longer than a button holds on one line.
  const ONE_LINE = "A button label stays on one line: it never breaks onto two.";
  if (!s.voice.principles.some((p) => p.text === ONE_LINE)) s.voice.principles.push({ text: ONE_LINE, follows: ["voice.values", "voice.definition"] });

  // Type item 1: Dense data's line boxes, 14/20 for body and help text, 14/18 for data cells and 12/16
  // for captions. The values follow the type record already (OD-301); the reasons named the wrong line
  // kind and grid, so each says the record's own rule.
  if (id === "dense-data") {
    const type = s.tokens.semantic.type;
    const LINES = {
      body: "A 20px line box for 14px body and help text: the open step, 1.45 × 14px (20.3px), snapped to the 2px grid, which also sits on the 4px grid. Help text wraps to several lines, so the open box lets the eye find the next line.",
      data: "An 18px line box for 14px cells: the snug step, 1.3 × 14px (18.2px), snapped to the 2px grid. A cell holds one line, so the box sits just above the text: the eye keeps its row while it scans a long table, and the row stays dense.",
      caption: "A 16px line box for 12px captions: the snug step, 1.3 × 12px (15.6px), snapped to the 2px grid, which also sits on the 4px grid. Hints and timestamps are short, so the snug box keeps them close to what they describe.",
    };
    for (const [role, why] of Object.entries(LINES)) {
      const od = type[role]["line-height"].$extensions["open-ds"];
      od.why = why;
      od.because = ["typography.definition", ...(role === "data" ? ["human.q1"] : [])];
    }
  }

  // Item 4: each deprecated switch key keeps its value one release and says what replaces it.
  for (const id of SWITCH_OLD) {
    const e = keyOf(id);
    const path = id.split("/");
    let node = s.tokens.component;
    for (const k of path.slice(0, -1)) node = node[k] ??= {};
    node[path.at(-1)] = {
      $value: `{${e.default}}`,
      $description: e.description,
      $deprecated: `Use component.${e.replaced_by.replaceAll("/", ".")}. Removed in the next minor release.`,
    };
  }
  for (const id of REPOINTED) {
    const e = keyOf(id);
    const leaf = id.split("/").reduce((n, k) => n?.[k], s.tokens.component);
    const n = leaf?.$value !== undefined ? leaf : leaf?.["@"];
    if (!n) continue;
    n.$description = e.description;
    n.$deprecated = `Use component.${e.replaced_by.replaceAll("/", ".")}. Removed in the next minor release.`;
  }

  saveScheme(s);
}
console.log("OD-300: grammar and every scheme written.");
