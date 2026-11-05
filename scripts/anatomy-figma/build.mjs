// The anatomy generator (OD-229): builds a component's Anatomy reference drawings in Figma from its
// parts layer, bound to the published kit's variables. This side, in Node, writes one self-contained
// Plugin API script: the spec (parts, cards, rows, and for every drawn property the chain of kit
// variables to bind, from the component key down to its semantic, with our token value last) plus the
// renderer. Run the script with use_figma in the anatomy file; it only reads the kit.
//
//   node scripts/anatomy-figma/build.mjs <component> [scheme] > /tmp/anatomy-<component>.js
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../..", import.meta.url).pathname;
const [component, schemeId = "dense-data"] = process.argv.slice(2);
if (!component) throw new Error("Usage: build.mjs <component> [scheme]");
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const g = read("schemes/grammar.json");
const s = read(`schemes/${schemeId}.json`);
const item = g.catalogue.items.find((i) => i.id === component);
if (!item?.anatomy) throw new Error(`${component} has no parts layer.`);
const spec = item.anatomy;
const RECIPES = { menu: "menu" };
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
const icon = (name) => {
  const src = readFileSync(join(ROOT, "node_modules/.pnpm", lucide, "node_modules/lucide-react/dist/esm/icons", `${name}.mjs`), "utf8");
  const data = Function(`return ${src.match(/const __icon(?:Data|Node) = ([\s\S]*?);\n/)[1]}`)();
  const node = Array.isArray(data) ? data : data.node;
  const body = node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ")}/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
};

const K = (k) => `component.${component}.${k}`;
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
}[recipe];

const flat = (l) => l.flatMap((p) => [p, ...(p.children ? flat(p.children) : [])]);
const icons = Object.fromEntries(
  [...new Set([...spec.drawing.rows.map((r) => r.icon).filter(Boolean), "chevron-right"])].map((n) => [n, icon(n)]),
);
const SPEC = {
  component,
  scheme: schemeId,
  library: "Open DS · Dense data · Figma kit",
  recipe,
  drawing: spec.drawing,
  parts: flat(spec.parts).filter((p) => p.n).map((p) => ({ n: p.n, label: p.label })),
  cards: spec.cards.map((c) => ({ title: c.title, parts: c.parts, image: c.image ?? null })),
  bind: B,
  icons,
};
const renderer = readFileSync(new URL("./renderer.js", import.meta.url), "utf8");
process.stdout.write(`const SPEC = ${JSON.stringify(SPEC)};\n${renderer}`);
