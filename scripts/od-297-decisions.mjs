// OD-297: the ten design decisions the owner accepted, written into the grammar and every scheme.
//   1 disabled reads muted colors, never opacity;      6 the spring is for the emphasize move only;
//   2 exits ease out; only a layer that leaves the     7 dense data keeps 12px text, with its reason;
//     screen accelerates, and only when expressive;    8 a hit-area token: 24px, 44px for touch;
//   3 productive and expressive duration limits;       9 the focus ring is its own token;
//   4 reduced motion keeps fades and color only;      10 uppercase tracking (checked in code, not data).
//   5 dark depth: raised lighter, sunken darker, a solid light ring, shadows on floating layers only;
// Each value it adds or changes gets a reason in the reason form (scripts/od-297-reasons.mjs).
// Idempotent: run it again and nothing changes.
//
//   node scripts/od-297-decisions.mjs
import { grammar as loadGrammar, loadScheme, saveGrammar, saveScheme, schemeIds } from "../cli/src/schemes.mjs";
import { aliasChain, tokenIndex } from "../cli/src/lands.mjs";
import { contrast } from "../cli/src/shape-elevation.mjs";
import { FAMILIES, darkReasons, hitAreaReason, motionReasons, typeReasons, USAGE } from "./od-297-reasons.mjs";

const g = loadGrammar();
const scope = (id) => g.scopes.find((s) => s.id === id);

// ---------- Grammar: motion families and move types (decisions 2, 3, 6) ----------
scope("motion").families = FAMILIES;

// ---------- Grammar: the focus ring is its own token (decision 9) ----------
const FOCUS = { "border-width.focus": "focus.ring.width", "border-width.focus-offset": "focus.ring.offset" };
const renamed = (t) => FOCUS[t] ?? t;
for (const p of scope("shape").properties) p.tokens = p.tokens.map(renamed);
for (const r of scope("shape").relations) r.tokens = r.tokens.map(renamed);
for (const r of g.trace) r.tokens = r.tokens.map(renamed);

// ---------- Grammar: a hit area (decision 8) and the scopes that own the new tokens ----------
const acc = scope("accessibility");
for (const o of ["focus", "size.hit-area"]) if (!acc.owns.includes(o)) acc.owns.push(o);
const traceRule = (tokens, follows, says) => {
  const at = g.trace.findIndex((r) => r.tokens.join() === tokens.join());
  const rule = { tokens, follows, says };
  if (at < 0) g.trace.splice(g.trace.findIndex((r) => r.tokens.includes("size.control.*")), 0, rule);
  else g.trace[at] = rule;
};
traceRule(
  ["size.hit-area"],
  ["accessibility.values", "spacing.values"],
  "The target-size answer sets the hit area: 24px for a pointer, 44px for touch. A control drawn smaller keeps its size; its hit area grows past it. The density answer says how close neighbours sit.",
);
// Disabled reads colors now; opacity.disabled is a deprecated alias with no decision of its own.
g.trace = g.trace.filter((r) => r.tokens.join() !== "opacity.disabled");

// ---------- Grammar: dark depth (decision 5) ----------
const dark = scope("elevation").relations.find((r) => r.id === "dark-shade");
dark.floating = ["elevation.overlay"];
dark.depth = { raised: "color.surface.raised", base: "color.surface.default", sunken: "color.surface.sunken", ring: "color.border.raised" };
dark.says =
  "Decided: in dark, only floating layers (menus, popovers, dialogs, toasts, tooltips) cast a shade, and it keeps the light shape (offset and blur); only its strength changes with the dark surface it falls on. Every other layer casts none in dark. Height reads by tone: a raised surface is lighter than the base, with a solid ring lighter still; a sunken one is darker. The check reports each break.";
const keys = g.semantics.keys;
const intent = (id, text) => (keys.find((k) => k.id === id).intent = text);
intent("color.surface.raised", "Fills that float above content. In dark, one step lighter than content, so height reads by tone.");
intent(
  "color.surface.highlight",
  "The fill of the item the pointer or the keyboard is on, or whose submenu is open. A state shows on the item's background, one step from the surfaces it sits on: darker in light, and darker in dark too, as raised layers take the lighter step.",
);
if (!keys.some((k) => k.id === "color.border.raised"))
  keys.splice(keys.findIndex((k) => k.id === "color.border.strong"), 0, {
    id: "color.border.raised",
    intent: "The 1px edge of a raised layer. In dark, a solid step lighter than the raised surface, so the edge shows where a shadow cannot.",
    use_for: ["Menus", "Popovers", "Dialogs", "Toasts", "Raised cards"],
    not_for: [
      { when: "Dividers and card borders in the page flow", use: "color.border.default" },
      { when: "The edge of a control people must find", use: "color.border.strong" },
    ],
  });

// ---------- Grammar: component keys ----------
const keyOf = (id) => g.component_keys.find((k) => k.id === id);
const addKey = (id, def, description) => {
  const comp = id.split("/")[0];
  const c = g.components.find((x) => x.id === comp);
  if (!c) throw new Error(`No component ${comp} in the grammar.`);
  const e = keyOf(id);
  if (e) Object.assign(e, { default: def, description });
  else {
    const last = g.component_keys.map((k) => k.component).lastIndexOf(comp);
    g.component_keys.splice(last + 1, 0, { id, component: comp, description, default: def });
  }
  if (!c.keys.includes(id)) c.keys.push(id);
};
const deprecateKey = (id, by) => {
  const e = keyOf(id);
  if (!e) throw new Error(`No key ${id}.`);
  e.replaced_by = by;
  e.description = `Deprecated: use ${by} (OD-297). ${e.description.replace(/^Deprecated: use [^ ]+ \(OD-\d+\)\. /, "")}`;
};

// Motion: one key per move, on the shared transition keys.
addKey("transition/enter-easing", "motion.easing.enter", "Easing of a layer that appears: a menu, a popover, a dialog.");
addKey("transition/exit-easing", "motion.easing.exit", "Easing of a layer that closes in place.");
addKey("transition/offscreen-exit-easing", "motion.easing.exit-offscreen", "Easing of a layer that slides off the screen: a sheet or a drawer.");
addKey("transition/emphasize-easing", "motion.easing.emphasize", "Easing of a moment that calls for attention.");
addKey("transition/exit-duration", "motion.duration.exit", "Duration of a layer that closes.");

// Focus: every key that read a border width for the ring reads the ring's own tokens.
for (const k of g.component_keys) k.default = renamed(k.default);

// Floating layers: their edge is the raised ring.
const RING = [
  "alert-dialog/content/border",
  "combobox/content/border",
  "context-menu/sub/content/border",
  "context-menu/content/border",
  "dialog/content/border",
  "dropdown-menu/content/border",
  "hover-card/content/border",
  "menubar/content/border",
  "menubar/sub/content/border",
  "navigation-menu/content/border",
  "popover/content/border",
  "select/content/border",
  "toast/neutral/border",
];
for (const id of RING) {
  if (!keyOf(id)) throw new Error(`No key ${id}.`);
  keyOf(id).default = "color.border.raised";
}

// Hit areas: the controls drawn under 24px, and the groups that keep their rows apart.
addKey("checkbox/hit-area", "size.hit-area", "The checkbox's hit area: it grows past the drawn box, which keeps its size.");
addKey("radio-group/item/hit-area", "size.hit-area", "A radio's hit area, and the least height of each row in the group, so two hit areas never overlap.");
addKey("switch/hit-area", "size.hit-area", "The switch's hit area: it grows past the drawn track, which keeps its size.");
addKey("slider/thumb/hit-area", "size.hit-area", "The slider thumb's hit area: it grows past the drawn thumb, which keeps its size.");
addKey("field/group/hit-area", "size.hit-area", "The least height of each row in a checkbox group, so two checkboxes' hit areas never overlap.");

// Disabled: muted colors in place of opacity. [old opacity key, [new key, semantic, description]...]
const TEXT = "color.disabled.text";
const FILL = "color.disabled.surface";
const EDGE = "color.disabled.border";
const DISABLED = [
  ["accordion/trigger/disabled/opacity", [["accordion/trigger/disabled/label", TEXT, "Label of a disabled accordion trigger."]]],
  ["calendar/disabled-opacity-disabled", [["calendar/nav/disabled/icon", TEXT, "Icon of a disabled previous or next month button."]]],
  ["calendar/day/disabled-opacity", [["calendar/day/disabled/label", TEXT, "Label of a day that cannot be picked."]]],
  [
    "checkbox/disabled",
    [
      ["checkbox/disabled-background", FILL, "Fill of a disabled checkbox."],
      ["checkbox/disabled-border", EDGE, "Edge of a disabled checkbox."],
      ["checkbox/disabled-indicator", TEXT, "Check mark of a disabled, checked checkbox."],
    ],
  ],
  ["combobox/item/disabled-opacity-disabled", [["combobox/item/disabled/label", TEXT, "Label of a disabled combobox option."]]],
  [
    "combobox/chip/disabled-opacity",
    [
      ["combobox/chip/disabled/label", TEXT, "Label of a disabled chip."],
      ["combobox/chip/disabled/background", FILL, "Fill of a disabled chip."],
    ],
  ],
  ["command/input/disabled-opacity-disabled", [["command/input/disabled/text", TEXT, "Text of a disabled command search field."]]],
  ["command/item/disabled-opacity-disabled", [["command/item/disabled/label", TEXT, "Label of a disabled command item."]]],
  ["context-menu/item/disabled-opacity-disabled", [["context-menu/item/disabled/label", TEXT, "Label and icon of a disabled menu item."]]],
  [
    "context-menu/checkbox/item/disabled-opacity-disabled",
    [["context-menu/checkbox/item/disabled/label", TEXT, "Label and mark of a disabled checkbox item."]],
  ],
  [
    "context-menu/radio/item/disabled-opacity-disabled",
    [["context-menu/radio/item/disabled/label", TEXT, "Label and mark of a disabled radio item."]],
  ],
  ["dropdown-menu/item/disabled", [["dropdown-menu/item/disabled-label", TEXT, "Label and icon of a disabled menu item."]]],
  ["field/label/disabled-opacity-disabled", [["field/label/disabled/text", TEXT, "Label of a disabled field: muted, and still readable."]]],
  ["menubar/item/disabled-opacity-disabled", [["menubar/item/disabled/label", TEXT, "Label and icon of a disabled menu item."]]],
  [
    "menubar/checkbox/item/disabled-opacity-disabled",
    [["menubar/checkbox/item/disabled/label", TEXT, "Label and mark of a disabled checkbox item."]],
  ],
  [
    "menubar/radio/item/disabled-opacity-disabled",
    [["menubar/radio/item/disabled/label", TEXT, "Label and mark of a disabled radio item."]],
  ],
  ["navigation-menu/trigger/disabled-opacity", [["navigation-menu/trigger/disabled/label", TEXT, "Label of a disabled navigation trigger."]]],
  [
    "radio-group/item/disabled-opacity-disabled",
    [
      ["radio-group/item/disabled/background", FILL, "Fill of a disabled radio."],
      ["radio-group/item/disabled/border", EDGE, "Edge of a disabled radio."],
      ["radio-group/item/disabled/indicator", TEXT, "Dot of a disabled, chosen radio."],
    ],
  ],
  ["select/item/disabled", [["select/item/disabled-label", TEXT, "Label of a disabled option."]]],
  [
    "sidebar/menu/sub/button/disabled-opacity-disabled",
    [["sidebar/menu/sub/button/disabled/label", TEXT, "Label and icon of a disabled sub-item."]],
  ],
  ["sidebar/menu-button/opacity/disabled", [["sidebar/menu-button/disabled/label", TEXT, "Label and icon of a disabled menu button."]]],
  ["slider/disabled-opacity-disabled", [["slider/disabled/range", EDGE, "Filled part of a disabled slider's track."]]],
  [
    "slider/thumb/disabled-opacity-disabled",
    [
      ["slider/thumb/disabled/background", FILL, "Fill of a disabled slider's thumb."],
      ["slider/thumb/disabled/border", EDGE, "Edge of a disabled slider's thumb."],
    ],
  ],
  ["switch/disabled", [["switch/disabled-track", EDGE, "Track of a disabled switch, on or off; the thumb's place shows the state."]]],
  ["toggle/disabled-opacity-disabled", [["toggle/disabled/label", TEXT, "Label and icon of a disabled toggle."]]],
];
for (const [old, adds] of DISABLED) {
  for (const [id, def, description] of adds) addKey(id, def, description);
  deprecateKey(old, adds[0][0]);
}
// A key deprecated earlier in favour of one deprecated now points at the key that replaces both.
const touched = new Set(DISABLED.map(([old]) => old));
for (const k of g.component_keys) {
  let by = k.replaced_by;
  while (by && keyOf(by)?.replaced_by) by = keyOf(by).replaced_by;
  if (by && by !== k.replaced_by) {
    k.description = k.description.replace(`use ${k.replaced_by} `, `use ${by} `);
    k.replaced_by = by;
    touched.add(k.id);
  }
}
// The anatomy names tokens by path: the renamed ones follow.
const DOT = (id) => `component.${id.replaceAll("/", ".")}`;
const SWAP = new Map([...Object.entries(FOCUS), ...DISABLED.map(([old, adds]) => [DOT(old), DOT(adds[0][0])])]);
const swapStrings = (node) => {
  if (!node || typeof node !== "object") return;
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "string" && SWAP.has(v)) node[k] = SWAP.get(v);
    else swapStrings(v);
  }
};
swapStrings(g);
saveGrammar(g);

// ---------- Schemes ----------
const MS = (n) => `${n}ms`;
const EASINGS = {
  standard: { value: [0.2, 0, 0, 1], description: "A standard ease-out: fast at the start, settling slowly, with no overshoot." },
  "strong-out": { value: [0.23, 1, 0.32, 1], description: "A strong ease-out: most of the way in the first third of the time, then a soft stop. For exits." },
  accelerate: { value: [0.4, 0, 1, 1], description: "An accelerate curve: slow at the start, fastest at the end. Only for a layer that leaves the screen." },
  spring: { value: [0.34, 1.56, 0.64, 1], description: "A spring that overshoots and settles back. Only for the emphasize move." },
};
const at = (tree, path) => path.split(".").reduce((n, k) => n?.[k], tree);
const ext = (why, because) => ({ "open-ds": { why, because } });

for (const id of schemeIds()) {
  const s = loadScheme(id);
  const answer = Object.fromEntries(s.answers.map((a) => [a.question, a.option]));
  const family = FAMILIES.by_option[answer[FAMILIES.question]];
  const p = s.tokens.primitive;
  const sem = s.tokens.semantic;
  const plan = motionReasons(id, family);

  // Primitives: the durations and easings the family's moves need.
  for (const [name, ms] of Object.entries(plan.durations))
    p.duration[name] = {
      $type: "duration",
      $value: MS(ms),
      $description: {
        fast: `Fast: about ${ms}ms, the convention for feedback.`,
        moderate: `Moderate: a calm, easy-to-follow speed, about ${ms}ms.`,
        relaxed: `Relaxed: a slower speed for larger moves, about ${ms}ms.`,
      }[name],
    };
  for (const name of Object.keys(p.duration)) if (!(name in plan.durations) && !name.startsWith("$")) delete p.duration[name];
  for (const name of new Set(Object.values(plan.easings).map((e) => e.curve)))
    p.easing[name] = { $type: "cubicBezier", $value: EASINGS[name].value, $description: EASINGS[name].description };
  for (const name of Object.keys(p.easing)) if (!Object.values(plan.easings).some((e) => e.curve === name) && !name.startsWith("$")) delete p.easing[name];

  // Semantics: one duration per move kind and one easing per move type, each with its reason.
  const motion = { duration: {}, easing: {} };
  for (const [name, d] of Object.entries(plan.durationTokens))
    motion.duration[name] = { $type: "duration", $value: `{duration.${d.word}}`, $description: d.description, $extensions: ext(d.why, d.because) };
  for (const [name, e] of Object.entries(plan.easings))
    motion.easing[name] = { $type: "cubicBezier", $value: `{easing.${e.curve}}`, $description: e.description, $extensions: ext(e.why, e.because) };
  sem.motion = motion;

  // Focus ring: its own tokens; the border-width names stay one release as aliases.
  const bw = sem["border-width"];
  const ring = sem.focus?.ring ?? {};
  for (const [old, name] of Object.entries(FOCUS)) {
    const leaf = old.split(".")[1];
    const was = bw[leaf];
    const now = name.split(".")[2];
    if (!was.$deprecated)
      ring[now] = {
        $type: "dimension",
        $value: was.$value,
        $description: now === "width" ? "The focus ring's width: one step heavier than the default border, and not a border width." : "The gap between a control and its focus ring, so the ring never touches the control and reads on any fill.",
        $extensions: was.$extensions,
      };
    bw[leaf] = { $type: "dimension", $value: `{${name}}`, $description: `Deprecated: use ${name}.`, $deprecated: `Use ${name}. Removed in the next minor release.` };
  }
  const semOrder = Object.entries(sem).filter(([k]) => k !== "focus");
  const iBw = semOrder.findIndex(([k]) => k === "border-width");
  semOrder.splice(iBw + 1, 0, ["focus", { ring }]);
  s.tokens.semantic = Object.fromEntries(semOrder);
  for (const r of s.relations) {
    r.token = renamed(r.token);
    if (r.from) r.from = renamed(r.from);
  }
  // Stored component values that named a border width for the ring name the ring.
  const retarget = (node) => {
    for (const v of Object.values(node))
      if (v && typeof v === "object") {
        if (typeof v.$value === "string") v.$value = v.$value.replace(/\{border-width\.focus(-offset)?\}/, (m) => `{${FOCUS[m.slice(1, -1)]}}`);
        else retarget(v);
      }
  };
  retarget(s.tokens.component);

  // Hit area: 24px for a pointer, 44px for touch.
  const hit = { pointer: 24, touch: 44, large: 44 }[answer["accessibility.values"]];
  if (!p.size[String(hit)]) {
    p.size[String(hit)] = { $type: "dimension", $value: `${hit / 16}rem` };
    const ordered = Object.entries(p.size).sort(([a], [b]) => (a.startsWith("$") ? 1 : b.startsWith("$") ? -1 : Number(a) - Number(b)));
    s.tokens.primitive.size = Object.fromEntries(ordered);
  }
  const hr = hitAreaReason(id, hit);
  s.tokens.semantic.size["hit-area"] = {
    $type: "dimension",
    $value: `{size.${hit}}`,
    $description: "The least hit area of a control. A control drawn smaller keeps its size; its hit area grows past it, never into a neighbour.",
    $extensions: ext(hr.why, hr.because),
  };

  // Disabled: opacity is for loading and dragging only; disabled reads the color.disabled roles.
  s.tokens.semantic.opacity.disabled = {
    ...s.tokens.semantic.opacity.disabled,
    $description: "Deprecated: disabled reads color.disabled.text, color.disabled.surface and color.disabled.border. Opacity is for loading and dragging only.",
    $deprecated: "Use color.disabled.text, color.disabled.surface and color.disabled.border. Removed in the next minor release.",
  };
  delete s.tokens.semantic.opacity.disabled.$extensions;
  // Each key deprecated or re-pointed here: its stored token says what replaces it, as the grammar does.
  for (const e of g.component_keys.filter((k) => touched.has(k.id))) {
    const path = e.id.split("/");
    const leaf = at(s.tokens.component, path.join("."));
    const n = leaf?.$value !== undefined ? leaf : leaf?.["@"];
    if (!n) continue;
    n.$description = e.description;
    n.$deprecated = `Use component.${e.replaced_by.replaceAll("/", ".")}. Removed in the next minor release.`;
  }
  // Words that named the focus ring by its old border-width names.
  const reword = (node) => {
    for (const [k, v] of Object.entries(node))
      if (typeof v === "string") node[k] = v.replace(/border-width\.focus(-offset)?/g, (m) => FOCUS[m]);
      else if (v && typeof v === "object") reword(v);
  };
  for (const [k, v] of Object.entries(s)) if (k !== "tokens" && v && typeof v === "object") reword(v);

  // Dark depth: a raised layer is a lighter step with a solid lighter ring; sunken is darker.
  s.tokens.semantic.color.border.raised = {
    $type: "color",
    $description: "The 1px edge of a raised layer: menus, dialogs and toasts, and raised cards.",
    $value: "{theme.color.border.raised}",
  };
  const order = ["default", "raised", "strong", "focus", "selected"];
  s.tokens.semantic.color.border = Object.fromEntries(order.filter((k) => s.tokens.semantic.color.border[k]).map((k) => [k, s.tokens.semantic.color.border[k]]));
  const cardsRise = answer["elevation.roles"] === "cards-too";
  for (const [brand, def] of Object.entries(s.tokens.brands)) {
    for (const mode of ["light", "dark"]) {
      const theme = def.theme[mode];
      const picks = darkReasons(id, mode, cardsRise);
      for (const [path, pick] of Object.entries(picks.picks)) {
        const node = at(theme, path);
        const tone = node?.$extensions?.["open-ds"]?.tone;
        const parent = at(theme, path.split(".").slice(0, -1).join("."));
        parent[path.split(".").at(-1)] = {
          $type: pick.type ?? "color",
          $value: pick.value,
          $extensions: { "open-ds": { ...(tone ? { tone } : {}), why: "", because: pick.because } },
        };
      }
      const border = theme.color.border;
      theme.color.border = Object.fromEntries(order.filter((k) => border[k]).map((k) => [k, border[k]]));
    }
  }
  // Each pick's why quotes the contrasts it meets, so it is written once the values are in place.
  for (const [brand, def] of Object.entries(s.tokens.brands))
    for (const mode of ["light", "dark"]) {
      const ix = tokenIndex(s, { brand, mode });
      const v = (path) => aliasChain(ix, path).value;
      const ratio = (a, b) => contrast(v(a), v(b));
      const picks = darkReasons(id, mode, cardsRise, { ratio, v, step: (path) => at(def.theme[mode], path).$value.replace(/[{}]/g, "").replace(/^color\./, "") });
      for (const [path, pick] of Object.entries(picks.picks)) at(def.theme[mode], path).$extensions["open-ds"].why = pick.why;
    }
  if (cardsRise) {
    s.tokens.component.card.background = { $value: "{color.surface.raised}", $description: "Card fill: a raised layer, lighter than content in dark." };
    s.tokens.component.card.border = { $value: "{color.border.raised}", $description: "Card edge: the raised ring, a solid lighter step in dark." };
  }
  // In dark only floating layers cast a shade: a card's dark shadow goes, and no shadow is a primitive.
  if (cardsRise) {
    p.shadow.none ??= {
      $type: "shadow",
      $value: { color: "#00000000", offsetX: "0px", offsetY: "0px", blur: "0px", spread: "0px" },
      $description: "No shadow: flat surfaces.",
    };
    delete p.shadow["card-dark"];
  }

  // Dense data keeps 12px text: its reasons say why (decision 7).
  for (const [path, r] of Object.entries(typeReasons(id))) at(s.tokens.semantic, path).$extensions = ext(r.why, r.because);
  if (id === "dense-data")
    p.font.family["ibm-plex-sans"].$extensions = { "open-ds": { x_height: 0.516, why: "IBM Plex Sans's x-height is 0.516 of the em (its metrics: 516 of 1000 units), so 12px text has a 6.2px x-height." } };

  // Usage rules that named opacity, the focus border widths or the spring.
  for (const [situation, rule] of Object.entries(USAGE[id] ?? {})) {
    const u = s.usage.find((x) => x.situation === situation);
    if (!u) throw new Error(`${id}: no usage rule ${situation}`);
    Object.assign(u, rule);
  }
  saveScheme(s);
}
console.log("OD-297: grammar and every scheme written.");
