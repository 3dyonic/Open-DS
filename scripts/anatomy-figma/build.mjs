// The anatomy generator (OD-229): a component's Anatomy reference drawings, from its parts layer, bound
// to the published kit's variables. anatomySpec(component, scheme) is the data the renderer draws: the
// parts, cards, drawing, and for every drawn property the chain of kit variables to bind (component key
// down to its semantic) with our token value last. scripts/figma-anatomy.mjs puts every component's
// data and the renderer in the Open DS anatomy plugin; run here, it prints one use_figma script.
//
//   node scripts/anatomy-figma/build.mjs <component> [scheme] > /tmp/anatomy-<component>.js
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname;
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
export const RECIPES = { menu: "menu", table: "table", tree: "tree" };
/** The components with a parts layer the renderer has a recipe for. */
export function drawable() {
  return read("schemes/grammar.json").catalogue.items.filter((i) => RECIPES[layer(i)?.drawing?.kind]).map((i) => i.id);
}
// A parts layer: the grammar's, or one being drafted in ANATOMY_LAYERS (anatomy-<component>.json).
function layer(item) {
  const dir = process.env.ANATOMY_LAYERS;
  if (dir) {
    try {
      const j = JSON.parse(readFileSync(join(dir, `anatomy-${item.id}.json`), "utf8"));
      return j.anatomy ?? j;
    } catch {}
  }
  return item.anatomy;
}
/** The library name of a scheme's published Figma kit. */
export const kitLibrary = (s) => `Open DS · ${s.name} · Figma kit`;

export function anatomySpec(component, schemeId = "dense-data") {
const g = read("schemes/grammar.json");
const s = read(`schemes/${schemeId}.json`);
const item = g.catalogue.items.find((i) => i.id === component);
const spec = item && layer(item);
if (!spec) throw new Error(`${component} has no parts layer.`);
const recipe = RECIPES[spec.drawing?.kind];
if (!recipe) throw new Error(`${component}: no recipe for drawing kind ${spec.drawing?.kind} yet.`);

// Token chain: a path resolves through component → semantic → theme → primitive, the same order as
// the build. Each step is a name the kit may carry as a variable.
const brand = Object.values(s.tokens.brands)[0].theme;
const tiers = [
  ["component", s.tokens.component],
  ["semantic", s.tokens.semantic],
  ["theme", { theme: { ...brand.base, ...mergeDeep(brand.base, brand.light) } }],
  ["primitive", s.tokens.primitive],
];
function mergeDeep(a = {}, b = {}) {
  const o = { ...a };
  for (const [k, v] of Object.entries(b)) o[k] = v && typeof v === "object" && !("$value" in v) ? mergeDeep(a[k], v) : v;
  return o;
}
const at = (tree, path) => {
  let n = path.split(".").reduce((o, k) => o?.[k], tree);
  if (n && !("$value" in n) && n["@"]) n = n["@"];
  return n?.$value !== undefined ? n : null;
};
function chain(path) {
  const steps = [];
  let p = path.replace(/^component\./, "");
  let first = path.startsWith("component.");
  for (let i = 0; i < 12; i++) {
    const hit = first ? [["component", at(s.tokens.component, p)]] : tiers.map(([t, tree]) => [t, at(tree, p)]);
    const found = hit.find(([, n]) => n) ?? (!first ? [["component", at(s.tokens.component, p)]] : null);
    if (!found?.[1]) break;
    steps.push({ tier: found[0], path: p });
    const v = found[1].$value;
    const ref = typeof v === "string" && v.match(/^\{(.+)\}$/)?.[1];
    if (!ref) return { steps, value: v };
    p = ref;
    first = false;
  }
  return { steps, value: null };
}
// Kit variable names: Component/<key id>, Semantic/<path with / and @ as default>.
const kitName = ({ tier, path }) =>
  tier === "component"
    ? `Component/${path.replaceAll(".", "/").replace(/\/@$/, "")}`
    : tier === "semantic"
      ? `Semantic/${path.replaceAll(".", "/").replace(/\/@$/, "/default")}`
      : null;
const px = (v) => (typeof v === "number" ? v : /rem$/.test(v) ? parseFloat(v) * 16 : /px$/.test(v) ? parseFloat(v) : parseFloat(v));
const hex = (v) => {
  const m = String(v).match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a: m[2] ? parseInt(m[2], 16) / 255 : 1 };
};
function bind(path, kind) {
  const c = chain(path);
  const raw = c.value;
  const value = kind === "color" ? hex(raw) : kind === "shadow" ? raw : kind === "font" ? raw : px(raw);
  return { path, kind, kit: c.steps.map(kitName).filter(Boolean), value };
}

// Lucide icons, from the package the components use.
const lucide = readdirSync(join(ROOT, "node_modules/.pnpm")).find((d) => d.startsWith("lucide-react@"));
function icon(name) {
  let src = readFileSync(join(ROOT, "node_modules/.pnpm", lucide, "node_modules/lucide-react/dist/esm/icons", `${name}.mjs`), "utf8");
  // A renamed icon is an alias file: follow it (filter → funnel).
  const alias = !/__icon(?:Data|Node) =/.test(src) && src.match(/from '\.\/([a-z0-9-]+)\.mjs'/)?.[1];
  if (alias) return icon(alias);
  const data = Function(`return ${src.match(/const __icon(?:Data|Node) = ([\s\S]*?);\n/)[1]}`)();
  const node = Array.isArray(data) ? data : data.node;
  const body = node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ")}/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const K = (k) => `component.${component}.${k}`;
// The tree recipe's bindings: every token a node names, by the property that reads it.
const COLOR = new Set(["fill", "stroke", "color"]);
function treeNodes(sp) {
  const all = [];
  const walk = (d) => { all.push(d); if (d.ring) all.push({ ...d.ring, __ring: true }); (d.children ?? []).forEach(walk); };
  walk(sp.drawing.stage);
  for (const c of sp.cards) if (c.image?.tree) walk(c.image.tree);
  return all;
}
function treeBindings(sp) {
  const out = { canvas: bind("color.surface.canvas", "color"), font: bind("type.body.font-family", "font"), __ink: bind("color.text.primary", "color") };
  const WORDS = new Set(["t", "id", "name", "text", "icon", "layout", "align", "justify", "at", "strokeAlign", "sides", "abs", "children", "ring", "n", "grow", "clip", "__ring"]);
  for (const d of treeNodes(sp))
    for (const [k, raw] of Object.entries(d)) {
      if (WORDS.has(k)) continue;
      for (const v of [].concat(raw)) {
        if (typeof v !== "string" || v === "fill" || v === "hug" || (k === "weight" && (v === "bold" || v === "regular"))) continue;
        const kind = COLOR.has(k) ? "color" : k === "shadow" ? "shadow" : k === "font" ? "font" : "number";
        if (!out[v]) out[v] = bind(v, kind);
      }
    }
  return out;
}
const B = {
  menu: {
    panelFill: bind("component.overlay.background", "color"),
    panelBorder: bind(K("content.border"), "color"),
    panelBorderWidth: bind(K("content.border-width"), "number"),
    panelRadius: bind("component.overlay.radius", "number"),
    panelPadding: bind(K("content.padding"), "number"),
    panelShadow: bind("component.overlay.shadow", "shadow"),
    itemHeight: bind("component.overlay.item-height", "number"),
    itemPaddingX: bind(K("item.padding-x"), "number"),
    itemGap: bind(K("item.gap"), "number"),
    itemRadius: bind(K("item.radius"), "number"),
    itemFontSize: bind(K("item.font-size"), "number"),
    itemLabel: bind("color.text.primary", "color"),
    iconSize: bind(K("item.icon"), "number"),
    shortcutSize: bind("type.caption.font-size", "number"),
    shortcutColor: bind("color.text.muted", "color"),
    highlight: bind(K("item.background.highlight"), "color"),
    focusColor: bind("color.border.focus", "color"),
    focusWidth: bind("border-width.focus", "number"),
    disabled: bind(K("item.disabled"), "number"),
    destructive: bind(K("item.label.destructive"), "color"),
    sepColor: bind(K("separator.background"), "color"),
    sepThickness: bind(K("separator.thickness"), "number"),
    sepMargin: bind(K("separator.margin-y"), "number"),
    canvas: bind("color.surface.canvas", "color"),
    font: bind("type.body.font-family", "font"),
  },
  table: {
    frameFill: bind("color.surface.default", "color"),
    frameBorder: bind(K("container.border"), "color"),
    frameBorderWidth: bind(K("container.border-width"), "number"),
    frameRadius: bind(K("container.radius"), "number"),
    gap: bind(K("gap"), "number"),
    inputHeight: bind("component.input.height", "number"),
    inputBorder: bind("component.input.border", "color"),
    inputRadius: bind("component.input.radius", "number"),
    inputFill: bind("component.input.background", "color"),
    inputPlaceholder: bind("component.input.placeholder", "color"),
    inputPaddingX: bind("component.input.padding-x", "number"),
    inputFontSize: bind("component.input.font-size", "number"),
    btnFill: bind("component.button.secondary.background", "color"),
    btnBorder: bind("component.button.secondary.border", "color"),
    btnLabel: bind("component.button.secondary.label", "color"),
    btnRadius: bind("component.button.radius", "number"),
    btnHeight: bind("component.button.height", "number"),
    btnPaddingX: bind("component.button.padding-x", "number"),
    btnFontSize: bind("component.button.font-size", "number"),
    toggleRadius: bind("component.toggle-group.radius", "number"),
    toggleOn: bind("component.toggle.background.on", "color"),
    count: bind(K("label"), "color"),
    headFill: bind("component.table.header-background", "color"),
    headLabel: bind("component.table.head.label", "color"),
    headSize: bind("component.table.head.font-size", "number"),
    sortIcon: bind(K("label"), "color"),
    rowHeight: bind("component.table.row-height", "number"),
    rowBorder: bind("component.table.row-border", "color"),
    cellLabel: bind("component.table.label", "color"),
    cellSize: bind("component.table.font-size", "number"),
    cellPaddingX: bind("component.table.cell-padding-x", "number"),
    dataFont: bind("component.table.cell.font-family", "font"),
    highlight: bind(K("row.background.hover"), "color"),
    selected: bind("component.table.row-selected", "color"),
    edge: bind("component.table.row-selected-edge", "color"),
    edgeWidth: bind("component.table.row.focus", "number"),
    boxSize: bind("component.checkbox.size", "number"),
    boxRadius: bind("component.control.radius", "number"),
    boxBorder: bind("color.border.strong", "color"),
    boxChecked: bind("component.control.checked", "color"),
    boxMark: bind("color.text.on-action", "color"),
    iconSize: bind("size.icon", "number"),
    canvas: bind("color.surface.canvas", "color"),
    font: bind("type.body.font-family", "font"),
  },
  tree: recipe === "tree" ? treeBindings(spec) : null,
}[recipe];
// A binding that resolves to nothing is a mistake in this file, not a gap in the kit.
for (const [role, b] of Object.entries(B)) if (b.value === null || b.value === undefined || Number.isNaN(b.value)) throw new Error(`${component}: ${role} (${b.path}) resolves to no value.`);

const flat = (l) => l.flatMap((p) => [p, ...(p.children ? flat(p.children) : [])]);
const iconNames = recipe === "menu"
  ? [...spec.drawing.rows.map((r) => r.icon).filter(Boolean), "chevron-right"]
  : recipe === "tree"
    ? treeNodes(spec).filter((d) => d.t === "icon").map((d) => d.icon)
    : [...spec.drawing.toolbar.map((t) => t.icon).filter(Boolean), "search", "arrow-up-down", "check"];
if (recipe === "tree") {
  // Every numbered part is shown somewhere: on the stage or on its card's own drawing.
  const shown = new Set(treeNodes(spec).flatMap((d) => [].concat(d.n ?? [], d.ring?.n ?? [])));
  const missing = flat(spec.parts).filter((p) => p.n && !shown.has(p.n)).map((p) => `${p.n} ${p.label}`);
  if (missing.length) throw new Error(`${component}: the drawing shows no part ${missing.join(", ")}.`);
}
const icons = Object.fromEntries([...new Set(iconNames)].map((n) => [n, icon(n)]));
return {
  component,
  scheme: schemeId,
  library: kitLibrary(s),
  recipe,
  drawing: spec.drawing,
  parts: flat(spec.parts).filter((p) => p.n).map((p) => ({ n: p.n, label: p.label })),
  cards: spec.cards.map((c) => ({ title: c.title, parts: c.parts, image: c.image ?? null })),
  bind: B,
  icons,
};
}

export const renderer = () => readFileSync(new URL("./renderer.js", import.meta.url), "utf8");

if (import.meta.url === `file://${process.argv[1]}`) {
  const [component, schemeId = "dense-data"] = process.argv.slice(2);
  if (!component) throw new Error("Usage: build.mjs <component> [scheme]");
  const SPEC = anatomySpec(component, schemeId);
  process.stdout.write(`const SPEC = ${JSON.stringify(SPEC)};\n${renderer()}\nreturn await renderAnatomy(SPEC, await loadKit(SPEC.library));\n`);
}
