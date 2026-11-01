#!/usr/bin/env node
// The Figma kit for a scheme (OD-149), generated from the scheme, never drawn by hand.
//
//   node scripts/figma-kit.mjs <scheme-id> [out-dir]
//
// Writes Figma Plugin API scripts, one per step, to figma/kits/<scheme>/ (git-ignored). Run them in
// order in the kit's Figma file: through the Figma MCP (use_figma), or pasted into a development
// plugin. Running them again regenerates the kit in place.
//
//   01-variables.js     Semantic and Component collections, one mode per theme, with CSS code syntax;
//                       component variables alias semantic ones, as in tokens.css. Text and effect styles.
//   02-foundations.js   Cover, then colour swatches (every theme), type, spacing and radius specimens.
//   03-components-*.js  The scheme's whole inventory, each component built from the variables.
//   04-scheme-*.js      Every question with its answer, why and because; voice, usage and inventory.
//
// Sources: tokens/dist/<scheme>/tokens.css (the shipped semantic and component variables, run
// `pnpm --dir tokens build` first), tokens/dist/<scheme>/<theme>.tokens.json (names), schemes/*.json.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENT_HELPERS, FAMILIES, RECIPES } from "./figma-kit-components.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_SCRIPT = 48_000; // use_figma takes up to 50,000 characters per call.
// Smaller parts are easier to hand over: FIGMA_KIT_PART=12000 splits variables and answers finer.
const PART = Number(process.env.FIGMA_KIT_PART || 0);

// ---------- reading the scheme ----------

/** The variables in tokens.css: { modes: [{name, selector}], vars: {css: {modeName: value}}, desc: {css: text} }. */
export function parseCss(css, scheme) {
  const blocks = [...css.matchAll(/^([^\n{}]+)\{\n([\s\S]*?)\n\}/gm)];
  const modes = [];
  const vars = {};
  const desc = {};
  const order = [];
  for (const [, selector, body] of blocks) {
    const sel = selector.trim();
    const brand = sel.match(/data-brand="([^"]+)"/)?.[1];
    const dark = /\.dark/.test(sel);
    const name = brand ? `${brand[0].toUpperCase()}${brand.slice(1)} ${dark ? "dark" : "light"}` : dark ? "Dark" : "Light";
    modes.push({ name, brand: brand ?? "default", mode: dark ? "dark" : "light" });
    for (const line of body.split("\n")) {
      const m = line.match(/^\s*--([a-z0-9-]+):\s*(.+?);\s*(?:\/\*\*\s*(.*?)\s*\*\/)?\s*$/);
      if (!m) continue;
      const [, n, v, d] = m;
      if (!vars[n]) (vars[n] = {}), order.push(n);
      vars[n][name] = v;
      if (d && !desc[n]) desc[n] = d;
    }
  }
  if (!modes.length) throw new Error(`No variables in tokens.css for ${scheme}.`);
  return { modes, vars, desc, order };
}

/** css name → Figma name, from the DTCG tree: button-primary-background → button/primary/background/default. */
function figmaNames(tokens) {
  const out = {};
  const walk = (o, path) => {
    if (o === null || typeof o !== "object") {
      const css = path.filter((k) => k !== "@").join("-");
      out[css] = path.map((k) => (k === "@" ? "default" : k)).join("/");
      return;
    }
    for (const [k, v] of Object.entries(o)) if (!k.startsWith("$")) walk(v, [...path, k]);
  };
  walk(tokens, []);
  return out;
}

const hex = (v) => /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(v);
const px = (v) => {
  const m = String(v).match(/^(-?[\d.]+)(px|rem)?$/);
  return m ? Number(m[1]) * (m[2] === "rem" ? 16 : 1) : null;
};
const isShadow = (v) => /^-?\d+(px)? -?\d+(px)? /.test(v) && /#/.test(v);

/** A line height for Figma: px stays px, a plain ratio (1.55) becomes a percentage. */
function lineHeightOf(v) {
  if (v == null) return null;
  if (/^[\d.]+$/.test(String(v)) && Number(v) < 4) return { unit: "PERCENT", value: Math.round(Number(v) * 1000) / 10 };
  const n = px(v);
  return n === null ? null : { unit: "PIXELS", value: n };
}
/** Letter spacing for Figma: em becomes a percentage of the size, px stays px. */
function letterSpacingOf(v) {
  if (v == null) return null;
  const em = String(v).match(/^(-?[\d.]+)em$/);
  if (em) return { unit: "PERCENT", value: Number(em[1]) * 100 };
  const n = px(v);
  return n ? { unit: "PIXELS", value: n } : null;
}

/** One variable's type and value in a mode. */
function valueOf(v) {
  const ref = v.match(/^var\(--([a-z0-9-]+)\)$/);
  if (ref) return { kind: "alias", to: ref[1] };
  if (hex(v)) return { kind: "COLOR", value: v.toUpperCase() };
  if (isShadow(v)) return { kind: "shadow", value: v };
  const n = px(v);
  if (n !== null) return { kind: "FLOAT", value: n };
  if (/^\d+ms$/.test(v)) return { kind: "FLOAT", value: Number.parseInt(v, 10) };
  const fam = v.match(/^"([^"]+)"/);
  if (fam) return { kind: "STRING", value: fam[1], font: true };
  return { kind: "STRING", value: v };
}

function scopesFor(name, type) {
  const n = name.toLowerCase();
  if (type === "COLOR") {
    if (/(text|label|placeholder)/.test(n)) return ["TEXT_FILL"];
    if (/(border|ring|focus|outline)/.test(n)) return ["STROKE_COLOR"];
    if (/(indicator|track|thumb|checked)/.test(n)) return ["FRAME_FILL", "SHAPE_FILL", "STROKE_COLOR"];
    return ["FRAME_FILL", "SHAPE_FILL"];
  }
  if (type === "FLOAT") {
    if (/radius/.test(n)) return ["CORNER_RADIUS"];
    if (/border-width/.test(n)) return ["STROKE_FLOAT"];
    if (/font-size/.test(n)) return ["FONT_SIZE"];
    if (/line-height/.test(n)) return ["LINE_HEIGHT"];
    if (/font-weight/.test(n)) return ["FONT_WEIGHT"];
    if (/letter-spacing/.test(n)) return ["LETTER_SPACING"];
    if (/opacity/.test(n)) return ["OPACITY"];
    if (/(space|padding|gap|inset)/.test(n)) return ["GAP"];
    if (/(size|height|width|row)/.test(n)) return ["WIDTH_HEIGHT"];
    return [];
  }
  if (type === "STRING" && /font-family/.test(n)) return ["FONT_FAMILY"];
  return [];
}

/** Everything a kit needs, from the scheme's files. */
export function kitData(id) {
  const scheme = JSON.parse(readFileSync(join(ROOT, "schemes", `${id}.json`), "utf8"));
  const grammar = JSON.parse(readFileSync(join(ROOT, "schemes", "grammar.json"), "utf8"));
  const css = readFileSync(join(ROOT, "tokens/dist", id, "tokens.css"), "utf8");
  const { modes, vars, desc, order } = parseCss(css, id);
  const firstTheme = scheme.themes[0].id;
  const names = figmaNames(JSON.parse(readFileSync(join(ROOT, "tokens/dist", id, `${firstTheme}.tokens.json`), "utf8")));
  const componentRoots = new Set(grammar.component_keys.map((k) => k.component));
  for (const extra of ["transition", "tooltip", "overlay", "control", "tabs", "table", "card", "badge", "input", "button"]) componentRoots.add(extra);

  const variables = [];
  const shadows = {};
  for (const cssName of order) {
    const perMode = vars[cssName];
    const kinds = Object.fromEntries(Object.entries(perMode).map(([m, v]) => [m, valueOf(v)]));
    const first = Object.values(kinds)[0];
    if (first.kind === "shadow") {
      shadows[cssName] = Object.fromEntries(Object.entries(kinds).map(([m, k]) => [m, k.value]));
      continue;
    }
    const name = names[cssName] ?? cssName.replace(/-/g, "/");
    const root = name.split("/")[0];
    variables.push({ css: cssName, name, collection: componentRoots.has(root) ? "Component" : "Semantic", values: kinds, description: desc[cssName] ?? "" });
  }

  // Resolve types through aliases; drop variables whose alias ends at a shadow or nothing.
  const byCss = Object.fromEntries(variables.map((v) => [v.css, v]));
  const typeOf = (v, seen = new Set()) => {
    if (seen.has(v.css)) return null;
    seen.add(v.css);
    const k = Object.values(v.values)[0];
    if (k.kind !== "alias") return k.kind;
    const t = byCss[k.to];
    return t ? typeOf(t, seen) : null;
  };
  const kept = [];
  const shadowAliases = {};
  for (const v of variables) {
    const t = typeOf(v);
    if (!t) {
      const k = Object.values(v.values)[0];
      if (k.kind === "alias" && shadows[k.to]) shadowAliases[v.css] = k.to;
      continue;
    }
    v.type = t;
    v.scopes = scopesFor(v.name, t);
    // A unitless ratio (1.55) is not a pixel line height: keep it, but offer it nowhere.
    if (/line-height/.test(v.css) && Object.values(v.values).some((k) => k.kind === "FLOAT" && k.value < 4)) v.scopes = [];
    kept.push(v);
  }
  const keptSet = new Set(kept.map((v) => v.css));
  for (const v of kept)
    for (const k of Object.values(v.values)) if (k.kind === "alias" && !keptSet.has(k.to)) throw new Error(`${v.css} aliases a missing ${k.to}`);

  // Type roles for text styles.
  const roles = [...new Set(order.map((n) => n.match(/^type-([a-z]+)-font-size$/)?.[1]).filter(Boolean))];
  const light = modes[0].name;
  const resolve = (cssName) => {
    let v = vars[cssName]?.[light];
    for (let i = 0; i < 5 && v && v.startsWith("var("); i++) v = vars[v.slice(6, -1)]?.[light];
    return v;
  };
  const textStyles = roles.map((r) => ({
    name: `Type/${r}`,
    role: r,
    family: valueOf(resolve(`type-${r}-font-family`) ?? '"Inter"').value,
    size: px(resolve(`type-${r}-font-size`)) ?? 14,
    lineHeight: lineHeightOf(resolve(`type-${r}-line-height`)),
    weight: Number(resolve(`type-${r}-font-weight`) ?? 400),
    letterSpacing: letterSpacingOf(resolve(`type-${r}-letter-spacing`)),
  }));

  // Questions and answers, grouped by reason and scope.
  const questions = {};
  for (const group of [...grammar.reasons, ...grammar.scopes])
    for (const q of group.questions) questions[q.id] = { group: group.id, groupTitle: group.title, kind: group.kind, q };
  const answers = scheme.answers.map((a) => {
    const g = questions[a.question];
    const opt = g?.q.options?.find((o) => o.id === a.option);
    return {
      group: g?.groupTitle ?? a.question.split(".")[0],
      kind: g?.kind ?? "scope",
      id: a.question,
      question: g?.q.text ?? a.question,
      answer: opt?.label ?? a.option,
      why: a.why,
      because: a.because ?? [],
    };
  });

  const present = new Set(order.map((n) => n.split("-")[0]));
  const inventory = scheme.inventory.in.map((c) => ({ id: c.id, why: c.why }));
  const components = ["button", "input", "control", "badge", "card", "table", "tabs", "overlay", "tooltip"].filter((c) => present.has(c));

  return {
    id,
    name: scheme.name,
    version: scheme.version,
    summary: scheme.summary,
    description: scheme.description,
    modes: modes.map((m) => m.name),
    variables: kept.map(({ css, name, collection, type, scopes, values, description }) => ({
      css,
      name,
      collection,
      type,
      scopes,
      description,
      values: Object.fromEntries(Object.entries(values).map(([m, k]) => [m, k.kind === "alias" ? { alias: k.to } : k.value])),
    })),
    shadows,
    shadowAliases,
    textStyles,
    answers,
    voice: scheme.voice,
    usage: scheme.usage,
    inventory,
    components,
  };
}

// ---------- the scripts ----------

const HEADER = (d, step) => `// Open DS Figma kit · ${d.name} (${d.id} ${d.version}) · ${step}
// Generated by scripts/figma-kit.mjs from the scheme. Do not edit: regenerate.
`;

/** Shared helpers every script carries. */
const HELPERS = `
const hexToRgba = (h) => { const n = h.replace('#', ''); const a = n.length === 8 ? parseInt(n.slice(6, 8), 16) / 255 : 1; return { r: parseInt(n.slice(0, 2), 16) / 255, g: parseInt(n.slice(2, 4), 16) / 255, b: parseInt(n.slice(4, 6), 16) / 255, a }; };
async function pageNamed(name, index) {
  let p = figma.root.children.find((x) => x.name === name);
  if (!p) { p = figma.createPage(); p.name = name; }
  if (index !== undefined && figma.root.children.indexOf(p) !== index) figma.root.insertChild(Math.min(index, figma.root.children.length - 1), p);
  await figma.setCurrentPageAsync(p);
  for (const c of [...p.children]) c.remove();
  return p;
}
const avail = await figma.listAvailableFontsAsync();
const families = new Set(avail.map((f) => f.fontName.family));
const WEIGHT_STYLES = { 100: ['Thin'], 200: ['ExtraLight', 'Extra Light'], 300: ['Light'], 400: ['Regular', 'Book', 'Roman'], 500: ['Medium'], 600: ['SemiBold', 'Semi Bold', 'Semibold', 'DemiBold'], 700: ['Bold'], 800: ['ExtraBold', 'Extra Bold'], 900: ['Black', 'Heavy'] };
function fontFor(family, weight) {
  const fam = families.has(family) ? family : 'Inter';
  const styles = avail.filter((f) => f.fontName.family === fam).map((f) => f.fontName.style);
  for (const w of [weight, 400, 500, 600, 700]) for (const s of WEIGHT_STYLES[w] || []) if (styles.includes(s)) return { family: fam, style: s };
  return { family: fam, style: styles[0] || 'Regular' };
}
const loaded = new Set();
async function load(font) { const k = font.family + '/' + font.style; if (!loaded.has(k)) { await figma.loadFontAsync(font); loaded.add(k); } return font; }
async function text(chars, { font, size = 14, color, width, lineHeight } = {}) {
  const t = figma.createText();
  t.fontName = await load(font || { family: 'Inter', style: 'Regular' });
  t.fontSize = size;
  if (lineHeight) t.lineHeight = { unit: 'PIXELS', value: lineHeight };
  t.characters = String(chars);
  if (color) t.fills = [{ type: 'SOLID', color: color }];
  if (width) { t.textAutoResize = 'HEIGHT'; t.resize(width, t.height); }
  return t;
}
const allVars = await figma.variables.getLocalVariablesAsync();
const V = (name) => allVars.find((v) => v.name === name);
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const C = (name) => collections.find((c) => c.name === name);
function bindFill(node, name, prop = 'fills') {
  const v = V(name); if (!v) return false;
  const paint = figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }, 'color', v);
  node[prop] = [paint]; return true;
}
function bindNum(node, field, name) { const v = V(name); if (v) node.setBoundVariable(field, v); return Boolean(v); }
const INK = { r: 0.09, g: 0.08, b: 0.06 }, MUTED = { r: 0.39, g: 0.37, b: 0.31 }, PAPER = { r: 0.965, g: 0.949, b: 0.914 }, LINE = { r: 0.81, g: 0.776, b: 0.706 }, ACCENT = { r: 1, g: 0.353, b: 0.122 };
`;

function variablesScripts(d) {
  // Large schemes (many modes) do not fit one call: the variables are split into parts. The first part
  // makes the collections, the last makes the styles; aliases find earlier variables by name.
  const css2name = Object.fromEntries(d.variables.map((v) => [v.css, v.name]));
  const parts = [];
  let cur = [];
  for (const v of d.variables) {
    if (cur.length && JSON.stringify(cur).length + JSON.stringify(v).length > (PART || 34_000)) (parts.push(cur), (cur = []));
    cur.push(v);
  }
  parts.push(cur);
  return parts.map((vars, i) => {
    const first = i === 0;
    const last = i === parts.length - 1;
    const aliasTargets = {};
    for (const v of vars) for (const val of Object.values(v.values)) if (val && typeof val === "object") aliasTargets[val.alias] = css2name[val.alias];
    const data = { modes: d.modes, variables: vars, aliasTargets, first, last, textStyles: last ? d.textStyles : [], shadows: last ? d.shadows : {} };
    return `${HEADER(d, `01 variables, part ${i + 1} of ${parts.length}`)}const D = ${JSON.stringify(data)};
${HELPERS}
// Regenerate: the kit's own collections and styles are replaced, nothing else is touched.
const cols = {};
if (D.first) {
  for (const c of collections) if (c.name === 'Semantic' || c.name === 'Component') c.remove();
  for (const name of ['Semantic', 'Component']) {
    const c = figma.variables.createVariableCollection(name);
    c.renameMode(c.modes[0].modeId, D.modes[0]);
    for (const m of D.modes.slice(1)) c.addMode(m);
    cols[name] = c;
  }
} else { cols.Semantic = C('Semantic'); cols.Component = C('Component'); }
const made = {};
const modeId = (c, m) => c.modes.find((x) => x.name === m).modeId;
for (const v of D.variables) {
  const x = figma.variables.createVariable(v.name, cols[v.collection], v.type);
  x.scopes = v.scopes;
  x.setVariableCodeSyntax('WEB', 'var(--' + v.css + ')');
  if (v.description) x.description = v.description;
  made[v.css] = x;
}
const target = (css) => made[css] || V(D.aliasTargets[css]);
let values = 0;
for (const v of D.variables) {
  const x = made[v.css], c = cols[v.collection];
  for (const m of D.modes) {
    const raw = v.values[m] ?? v.values[D.modes[0]];
    let val;
    if (raw && typeof raw === 'object') val = figma.variables.createVariableAlias(target(raw.alias));
    else if (v.type === 'COLOR') val = hexToRgba(raw);
    else if (v.type === 'FLOAT') val = /opacity/.test(v.css) && raw <= 1 ? raw * 100 : Number(raw);
    else val = String(raw);
    x.setValueForMode(modeId(c, m), val); values++;
  }
}
const styleIds = [], effectIds = [];
if (D.last) {
  // Text styles: one per type role, in the scheme's font (or Inter when Figma does not have it).
  for (const s of await figma.getLocalTextStylesAsync()) if (s.name.startsWith('Type/')) s.remove();
  for (const t of D.textStyles) {
    const st = figma.createTextStyle();
    st.name = t.name;
    st.fontName = await load(fontFor(t.family, t.weight));
    st.fontSize = t.size;
    if (t.lineHeight) st.lineHeight = t.lineHeight;
    if (t.letterSpacing) st.letterSpacing = t.letterSpacing;
    st.description = t.family + (families.has(t.family) ? '' : ' (not in Figma here: shown in Inter)') + ', ' + t.weight;
    styleIds.push(st.id);
  }
  // Effect styles: elevation, from the first theme; other themes are in the description.
  for (const s of await figma.getLocalEffectStylesAsync()) if (s.name.startsWith('Elevation/')) s.remove();
  for (const [css, perMode] of Object.entries(D.shadows)) {
    const first = perMode[D.modes[0]];
    const parts = first.split(/,(?![^(]*\\))/).map((p) => p.trim());
    const effects = parts.map((p) => {
      const m = p.match(/(-?[\\d.]+)(?:px)? (-?[\\d.]+)(?:px)? (-?[\\d.]+)(?:px)? (-?[\\d.]+)(?:px)? (#[0-9a-fA-F]{6,8})/);
      if (!m) return null;
      return { type: 'DROP_SHADOW', offset: { x: +m[1], y: +m[2] }, radius: +m[3], spread: +m[4], color: hexToRgba(m[5]), visible: true, blendMode: 'NORMAL' };
    }).filter(Boolean);
    const st = figma.createEffectStyle();
    st.name = 'Elevation/' + css.replace(/^(elevation|shadow)-/, '');
    st.effects = effects;
    st.description = 'var(--' + css + ')\\n' + Object.entries(perMode).map(([m, v]) => m + ': ' + v).join('\\n');
    effectIds.push(st.id);
  }
}
return { part: ${i + 1}, collections: Object.fromEntries(Object.entries(cols).map(([k, c]) => [k, { id: c.id, modes: c.modes.map((m) => m.name), variables: c.variableIds.length }])), values, textStyles: styleIds.length, effectStyles: effectIds.length };
`;
  });
}

function foundationsScript(d) {
  const colors = d.variables.filter((v) => v.collection === "Semantic" && v.type === "COLOR").map((v) => v.name);
  const floats = d.variables.filter((v) => v.collection === "Semantic" && v.type === "FLOAT" && /^(space|radius|size)\//.test(v.name)).map((v) => v.name);
  const data = { name: d.name, id: d.id, version: d.version, summary: d.summary, description: d.description, modes: d.modes, colors, floats, styles: d.textStyles.map((t) => t.name), counts: { variables: d.variables.length, components: kitCount(d), answers: d.answers.length }, inventory: kitCount(d) };
  return `${HEADER(d, "02 intro and foundations")}const D = ${JSON.stringify(data)};
${HELPERS}
const sans = await load({ family: 'Inter', style: 'Regular' }), bold = await load({ family: 'Inter', style: 'Bold' }), semi = await load({ family: 'Inter', style: 'Semi Bold' });
const created = [];

// Figma's empty default page goes (the cover is its own step, 05).
for (const pg of [...figma.root.children]) if (pg.name === 'Page 1' && figma.root.children.length > 1) { await pg.loadAsync(); if (pg.children.length === 0) pg.remove(); }

// Intro: Open DS, the scheme, what is in the kit and how to use it.
await pageNamed('Intro', 1);
const intro = figma.createAutoLayout('VERTICAL', { name: 'Intro', itemSpacing: 40, paddingLeft: 96, paddingRight: 96, paddingTop: 88, paddingBottom: 88 });
intro.fills = [{ type: 'SOLID', color: PAPER }]; intro.resize(1200, 100); intro.counterAxisSizingMode = 'FIXED';
const brand = figma.createAutoLayout('HORIZONTAL', { name: 'Open DS', itemSpacing: 14, counterAxisAlignItems: 'CENTER' }); intro.appendChild(brand);
const mark = figma.createFrame(); mark.name = 'Mark'; mark.resize(36, 26); mark.fills = []; brand.appendChild(mark);
['110111', '101010', '1l1011', '101001', '110111'].forEach((row, r) => [...row].forEach((c, i) => { if (c === '0') return; const px = figma.createRectangle(); px.resize(4, 4); px.x = i * 16 / 3; px.y = r * 16 / 3; px.fills = [{ type: 'SOLID', color: c === 'l' ? ACCENT : INK }]; mark.appendChild(px); }));
brand.appendChild(await text('Open DS', { font: bold, size: 26, color: INK }));
const dot = figma.createRectangle(); dot.resize(7, 7); dot.fills = [{ type: 'SOLID', color: ACCENT }]; brand.appendChild(dot);
const head = figma.createAutoLayout('VERTICAL', { name: 'Heading', itemSpacing: 14 }); intro.appendChild(head);
head.appendChild(await text('FIGMA KIT', { font: semi, size: 14, color: ACCENT }));
head.appendChild(await text(D.name, { font: bold, size: 64, color: INK }));
head.appendChild(await text(D.summary, { font: sans, size: 24, color: INK, width: 1000, lineHeight: 34 }));
head.appendChild(await text(D.description, { font: sans, size: 17, color: MUTED, width: 1000, lineHeight: 26 }));
const links = figma.createAutoLayout('VERTICAL', { name: 'Links', itemSpacing: 8 }); intro.appendChild(links);
for (const [label, url] of [['The scheme on open-ds.dev', 'https://open-ds.dev/schemes/' + D.id + '/'], ['Take it as code', 'https://open-ds.dev/install/'], ['Open DS', 'https://open-ds.dev']]) {
  const t = await text(label + ': ' + url.replace('https://', ''), { font: semi, size: 17, color: { r: 0.725, g: 0.227, b: 0 } });
  t.hyperlink = { type: 'URL', value: url }; t.textDecoration = 'UNDERLINE'; links.appendChild(t);
}
async function block(title, items) {
  const b = figma.createAutoLayout('VERTICAL', { name: title, itemSpacing: 16 }); intro.appendChild(b);
  b.appendChild(await text(title.toUpperCase(), { font: semi, size: 14, color: ACCENT }));
  for (const [label, body] of items) {
    const it = figma.createAutoLayout('VERTICAL', { name: label, itemSpacing: 4 }); b.appendChild(it);
    it.appendChild(await text(label, { font: semi, size: 18, color: INK }));
    it.appendChild(await text(body, { font: sans, size: 15, color: MUTED, width: 1000, lineHeight: 23 }));
  }
}
await block('In this kit', [
  ['Variables', D.counts.variables + ' variables in two collections, Semantic and Component, with one mode per theme: ' + D.modes.join(', ') + '. Each carries its CSS name, so Dev Mode shows var(--…) as in the code.'],
  ['Styles', 'A text style per type role in the fonts of the scheme, and elevation effect styles.'],
  ['Foundations', 'Every colour in every theme, the type roles, and the spacing, size and radius scale.'],
  ['Components', D.counts.components + ' components: the inventory of the scheme, each reading only the variables.'],
  ['Scheme', 'All ' + D.counts.answers + ' design questions with their answers and reasons, the voice, when to use what, and the inventory.'],
]);
await block('How to use it', [
  ['Switch theme', 'Select a frame, then in the Appearance panel pick a mode for Semantic and Component.'],
  ['Build screens', 'Use the components as instances. They follow every theme without detaching.'],
  ['Go to code', 'Run npx open-ds init ' + D.id + ' in a project for the same system as tokens, components, Storybook and docs.'],
]);
intro.appendChild(await text('Generated from the scheme by Open DS. The Open DS code, schemes and tokens are MIT licensed.', { font: sans, size: 13, color: MUTED, width: 1000 }));
intro.x = 0; intro.y = 0;
created.push(intro.id);

// Foundations
await pageNamed('Foundations', 2);
const semantic = C('Semantic');
const root = figma.createAutoLayout('VERTICAL', { name: 'Foundations', itemSpacing: 48, paddingLeft: 64, paddingRight: 64, paddingTop: 64, paddingBottom: 64 });
root.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
root.appendChild(await text('Foundations', { font: bold, size: 48, color: INK }));
root.appendChild(await text('Each swatch is bound to its variable. Each column is one theme (a mode of the Semantic collection).', { font: sans, size: 16, color: MUTED, width: 1000 }));
const themes = figma.createAutoLayout('HORIZONTAL', { name: 'Colour by theme', itemSpacing: 24 });
for (const m of D.modes) {
  const col = figma.createAutoLayout('VERTICAL', { name: 'Theme ' + m, itemSpacing: 8, paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 20, cornerRadius: 12 });
  col.setExplicitVariableModeForCollection(semantic, semantic.modes.find((x) => x.name === m).modeId);
  bindFill(col, 'color/surface/canvas');
  col.appendChild(await text(m, { font: semi, size: 18 }));
  const t0 = col.children[0]; bindFill(t0, 'color/text/primary');
  for (const name of D.colors) {
    const row = figma.createAutoLayout('HORIZONTAL', { name, itemSpacing: 10, counterAxisAlignItems: 'CENTER' });
    const sw = figma.createRectangle(); sw.resize(28, 28); sw.cornerRadius = 6; bindFill(sw, name);
    // A border in the theme's own strong border colour, so dark swatches show on dark paper.
    if (!bindFill(sw, 'color/border/strong', 'strokes')) sw.strokes = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.5 }];
    sw.strokeWeight = 1; sw.strokeAlign = 'INSIDE';
    row.appendChild(sw);
    const label = await text(name, { font: sans, size: 12 }); bindFill(label, 'color/text/secondary') || bindFill(label, 'color/text/primary');
    row.appendChild(label); col.appendChild(row);
  }
  themes.appendChild(col);
}
root.appendChild(themes);

root.appendChild(await text('Type', { font: bold, size: 32, color: INK }));
const styles = await figma.getLocalTextStylesAsync();
for (const s of D.styles) {
  const st = styles.find((x) => x.name === s); if (!st) continue;
  await load(st.fontName);
  const row = figma.createAutoLayout('HORIZONTAL', { name: s, itemSpacing: 24, counterAxisAlignItems: 'BASELINE' });
  row.appendChild(await text(s.replace('Type/', ''), { font: sans, size: 13, color: MUTED }));
  const sample = figma.createText(); sample.characters = 'The quick brown fox, 1 234.56'; await sample.setTextStyleIdAsync(st.id); sample.fills = [{ type: 'SOLID', color: INK }];
  row.appendChild(sample);
  row.appendChild(await text(st.description + ' · ' + st.fontSize + 'px', { font: sans, size: 12, color: MUTED }));
  root.appendChild(row);
}

root.appendChild(await text('Spacing, size and radius', { font: bold, size: 32, color: INK }));
const scale = figma.createAutoLayout('HORIZONTAL', { name: 'Scale', itemSpacing: 24, counterAxisAlignItems: 'MAX' });
for (const name of D.floats) {
  const v = V(name); if (!v) continue;
  const val = v.valuesByMode[Object.keys(v.valuesByMode)[0]];
  const n = typeof val === 'number' ? val : 8;
  const cell = figma.createAutoLayout('VERTICAL', { name, itemSpacing: 6 });
  const r = figma.createRectangle(); r.resize(name.startsWith('radius') ? 48 : Math.max(2, Math.min(n, 160)), name.startsWith('radius') ? 48 : 24);
  r.fills = [{ type: 'SOLID', color: ACCENT, opacity: 0.25 }]; r.strokes = [{ type: 'SOLID', color: ACCENT }]; r.strokeWeight = 1;
  if (name.startsWith('radius')) bindNum(r, 'topLeftRadius', name) && ['topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'].forEach((f) => bindNum(r, f, name));
  else bindNum(r, 'width', name);
  cell.appendChild(r);
  cell.appendChild(await text(name + '\\n' + n + 'px', { font: sans, size: 11, color: MUTED }));
  scale.appendChild(cell);
}
root.appendChild(scale);
root.x = 0; root.y = 0;
created.push(root.id);
return { created, swatches: D.colors.length * D.modes.length, styles: D.styles.length, scale: D.floats.length };
`;
}

/** How many components the kit draws: the scheme's inventory, where a recipe exists. */
const kitCount = (d) => d.inventory.filter((c) => RECIPES[c.id]).length;

/** The scheme's inventory, in family order, as [family, [ids]] — only components with a recipe. */
function inventoryByFamily(d) {
  const have = new Set(d.inventory.map((c) => c.id));
  return FAMILIES.map(([f, ids]) => [f, ids.filter((id) => have.has(id) && RECIPES[id])]).filter(([, ids]) => ids.length);
}

function componentsScripts(d) {
  // One script per family or two, so each stays small. The first makes the page; the rest add to it.
  const fams = inventoryByFamily(d);
  const count = fams.reduce((n, [, ids]) => n + ids.length, 0);
  const missing = d.inventory.map((c) => c.id).filter((id) => !RECIPES[id]);
  const chunks = [];
  let cur = [];
  for (const fam of fams) {
    const size = (x) => x.reduce((n, [, ids]) => n + ids.reduce((m, id) => m + RECIPES[id][2].length, 0), 0);
    if (cur.length && size(cur) + size([fam]) > (PART || 22_000)) (chunks.push(cur), (cur = []));
    cur.push(fam);
  }
  if (cur.length) chunks.push(cur);
  return chunks.map((part, i) => {
    const first = i === 0;
    const last = i === chunks.length - 1;
    const recipes = part
      .flatMap(([, ids]) => ids)
      .map((id) => `  ${JSON.stringify(id)}: [${JSON.stringify(RECIPES[id][0])}, ${JSON.stringify(RECIPES[id][1])}, async () => {${RECIPES[id][2]}\n  }],`)
      .join("\n");
    const data = { name: d.name, first, last, families: part, count, missing };
    return `${HEADER(d, `03 components, part ${i + 1} of ${chunks.length}`)}const D = ${JSON.stringify(data)};
${HELPERS}
${COMPONENT_HELPERS}
const R = {
${recipes}
};
const sansF = await load({ family: 'Inter', style: 'Regular' }), boldF = await load({ family: 'Inter', style: 'Bold' }), semiF = await load({ family: 'Inter', style: 'Semi Bold' });
let page, root;
if (D.first) {
  page = await pageNamed('Components', 3);
  root = figma.createAutoLayout('VERTICAL', { name: 'Components', itemSpacing: 72, paddingLeft: 80, paddingRight: 80, paddingTop: 80, paddingBottom: 80 });
  root.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  root.appendChild(await text('Components', { font: boldF, size: 56, color: INK }));
  root.appendChild(await text(D.count + ' components, the inventory of ' + D.name + '. Each reads only the variables of the kit, so it follows every theme: switch the Semantic and Component modes on a frame to see another.', { font: sansF, size: 18, color: MUTED, width: 960, lineHeight: 27 }));
  root.x = 0; root.y = 0;
} else {
  page = figma.root.children.find((p) => p.name === 'Components'); await figma.setCurrentPageAsync(page);
  root = page.children.find((n) => n.name === 'Components' && n.type === 'FRAME');
}
const made = [];
for (const [family, ids] of D.families) {
  const sec = figma.createAutoLayout('VERTICAL', { name: family, itemSpacing: 40 }); sec.fills = []; root.appendChild(sec);
  const head = figma.createAutoLayout('VERTICAL', { name: 'Heading', itemSpacing: 8 }); head.fills = []; sec.appendChild(head);
  head.appendChild(await text(family.toUpperCase(), { font: semiF, size: 14, color: ACCENT }));
  const rule = figma.createRectangle(); rule.resize(960, 1); rule.fills = [{ type: 'SOLID', color: LINE }]; head.appendChild(rule);
  const grid = figma.createAutoLayout('HORIZONTAL', { name: 'Grid', itemSpacing: 40, counterAxisSpacing: 48 }); grid.fills = []; grid.layoutWrap = 'WRAP'; sec.appendChild(grid); grid.resize(1440, grid.height); grid.primaryAxisSizingMode = 'FIXED';
  for (const id of ids) {
    const [title, desc, build] = R[id];
    const card = figma.createAutoLayout('VERTICAL', { name: title, itemSpacing: 10 }); card.fills = []; grid.appendChild(card);
    card.appendChild(await text(title, { font: boldF, size: 20, color: INK }));
    card.appendChild(await text(desc, { font: sansF, size: 13, color: MUTED, width: 420, lineHeight: 19 }));
    // The stage has room above the component so Figma's component name label never covers the title.
    const stage = figma.createAutoLayout('HORIZONTAL', { name: 'Stage', paddingLeft: 32, paddingRight: 32, paddingTop: 40, paddingBottom: 32, cornerRadius: 12 });
    fill(stage, 'color-surface-canvas'); card.appendChild(stage);
    try {
      const node = await build();
      stage.appendChild(node);
      if (node.type === 'COMPONENT' && !node.description) node.description = desc;
      made.push(node.id);
    } catch (e) { stage.appendChild(await text('Could not build: ' + e.message, { font: sansF, size: 12, color: ACCENT })); }
  }
}
if (D.last && D.missing.length) root.appendChild(await text('Not drawn yet: ' + D.missing.join(', ') + '. They read the same variables in code.', { font: sansF, size: 14, color: MUTED, width: 960 }));
return { part: D.families.map((f) => f[0]), components: made.length };
`;
  });
}

function schemeScripts(d) {
  // The Q&A page can be long: split it into scripts under the size limit, one group at a time.
  const groups = [];
  for (const a of d.answers) {
    let g = groups.find((x) => x.title === a.group);
    if (!g) groups.push((g = { title: a.group, kind: a.kind, answers: [] }));
    g.answers.push(a);
  }
  const extras = { voice: d.voice, usage: d.usage, inventory: d.inventory };
  const chunks = [];
  let cur = [];
  const size = (x) => JSON.stringify(x).length;
  for (const g of groups) {
    if (cur.length && size(cur) + size(g) > (PART || 30_000)) (chunks.push(cur), (cur = []));
    cur.push(g);
  }
  if (cur.length) chunks.push(cur);
  return chunks.map((part, i) => {
    const first = i === 0;
    const last = i === chunks.length - 1;
    const data = { name: d.name, part, extras: last ? extras : null, first, x: i * 1040 };
    return `${HEADER(d, `04 scheme page, part ${i + 1} of ${chunks.length}`)}const D = ${JSON.stringify(data)};
${HELPERS}
const sans = await load({ family: 'Inter', style: 'Regular' }), bold = await load({ family: 'Inter', style: 'Bold' }), semi = await load({ family: 'Inter', style: 'Semi Bold' }), mono = families.has('Roboto Mono') ? await load({ family: 'Roboto Mono', style: 'Regular' }) : sans;
let page = figma.root.children.find((p) => p.name === 'Scheme');
if (D.first) page = await pageNamed('Scheme', 4); else await figma.setCurrentPageAsync(page);
const col = figma.createAutoLayout('VERTICAL', { name: 'Scheme ' + (D.part[0]?.title || ''), itemSpacing: 32, paddingLeft: 48, paddingRight: 48, paddingTop: 48, paddingBottom: 48 });
col.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; col.resize(1000, 100); col.counterAxisSizingMode = 'FIXED';
if (D.first) {
  col.appendChild(await text(D.name + ': every question and its answer', { font: bold, size: 36, color: INK, width: 904 }));
  col.appendChild(await text('Reasons come first: why the product exists and who uses it. Scopes follow: what the system decides. Each answer carries its why, and the earlier answers it follows.', { font: sans, size: 15, color: MUTED, width: 904, lineHeight: 22 }));
}
for (const g of D.part) {
  col.appendChild(await text((g.kind === 'reason' ? 'REASON · ' : 'SCOPE · ') + g.title.toUpperCase(), { font: semi, size: 13, color: ACCENT }));
  for (const a of g.answers) {
    const card = figma.createAutoLayout('VERTICAL', { name: a.id, itemSpacing: 6, paddingLeft: 20, paddingRight: 20, paddingTop: 16, paddingBottom: 16, cornerRadius: 8 });
    card.fills = [{ type: 'SOLID', color: PAPER }];
    col.appendChild(card); card.layoutSizingHorizontal = 'FILL';
    for (const [chars, opts] of [[a.question, { font: semi, size: 16, color: INK }], [a.answer, { font: bold, size: 20, color: INK }], [a.why, { font: sans, size: 14, color: INK, lineHeight: 21 }], [a.id + (a.because.length ? '  ·  follows ' + a.because.join(', ') : ''), { font: mono, size: 11, color: MUTED }]]) {
      const t = await text(chars, opts); card.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT';
    }
  }
}
if (D.extras) {
  const E = D.extras;
  // Voice and when to use what share a frame; the inventory has its own. Each item: a bold label, then
  // its description on the next line.
  async function frame(name, x) {
    const f = figma.createAutoLayout('VERTICAL', { name, itemSpacing: 24, paddingLeft: 48, paddingRight: 48, paddingTop: 48, paddingBottom: 48 });
    f.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; f.resize(760, 100); f.counterAxisSizingMode = 'FIXED'; f.x = x; f.y = 0; return f;
  }
  const add = async (f, chars, opts) => { const t = await text(chars, opts); f.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; return t; };
  async function item(f, label, body) {
    const it = figma.createAutoLayout('VERTICAL', { name: label, itemSpacing: 4 }); f.appendChild(it); it.layoutSizingHorizontal = 'FILL';
    await add(it, label, { font: semi, size: 17, color: INK });
    if (body) await add(it, body, { font: sans, size: 14, color: MUTED, lineHeight: 21 });
  }
  const human = (s) => String(s).replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase());
  const vf = await frame('Voice and when to use what', D.x + 1040);
  await add(vf, 'Voice and when to use what', { font: bold, size: 32, color: INK });
  await add(vf, 'VOICE', { font: semi, size: 13, color: ACCENT });
  if (E.voice?.summary) await add(vf, E.voice.summary.text, { font: semi, size: 20, color: INK, lineHeight: 28 });
  for (const p of E.voice?.principles || []) await item(vf, p.text);
  if (E.voice?.words) { await item(vf, 'Words to use', (E.voice.words.use || []).join(', ')); await item(vf, 'Words to avoid', (E.voice.words.avoid || []).join(', ')); }
  for (const [b, v] of Object.entries(E.voice?.brands || {})) await item(vf, human(b), v.text);
  await add(vf, 'WHEN TO USE WHAT', { font: semi, size: 13, color: ACCENT });
  for (const u of E.usage || []) await item(vf, human(u.situation), 'Use ' + u.use + (u.not ? ', not ' + u.not : '') + '. ' + (u.why || ''));
  const inv = await frame('Inventory', D.x + 1040 + 800);
  await add(inv, 'Inventory', { font: bold, size: 32, color: INK });
  await add(inv, E.inventory.length + ' COMPONENTS', { font: semi, size: 13, color: ACCENT });
  for (const c of E.inventory) await item(inv, human(c.id), c.why);
}
col.x = D.x; col.y = 0;
return { id: col.id, groups: D.part.length, answers: D.part.reduce((n, g) => n + g.answers.length, 0) };
`;
  });
}

function coverScript(d) {
  const data = { name: d.name, id: d.id, version: d.version, summary: d.summary, modes: d.modes, counts: { variables: d.variables.length, components: kitCount(d), answers: d.answers.length } };
  return `${HEADER(d, "05 cover")}const D = ${JSON.stringify(data)};
${HELPERS}
// The cover: the scheme in its own colours, bound to the kit's variables. It is the file's thumbnail.
const sans = await load({ family: 'Inter', style: 'Regular' }), bold = await load({ family: 'Inter', style: 'Bold' }), semi = await load({ family: 'Inter', style: 'Semi Bold' });
const page = await pageNamed('Cover', 0);
for (const pg of [...figma.root.children]) if (pg.name === 'Page 1' && pg !== page) { await pg.loadAsync(); if (pg.children.length === 0) pg.remove(); }
const semantic = C('Semantic');
const cv = figma.createAutoLayout('VERTICAL', { name: 'Cover', itemSpacing: 40, paddingLeft: 96, paddingRight: 96, paddingTop: 88, paddingBottom: 88 });
cv.resize(1600, 960); cv.primaryAxisSizingMode = 'FIXED'; cv.counterAxisSizingMode = 'FIXED'; cv.primaryAxisAlignItems = 'SPACE_BETWEEN';
cv.setExplicitVariableModeForCollection(semantic, semantic.modes[0].modeId);
bindFill(cv, 'color/surface/canvas') || (cv.fills = [{ type: 'SOLID', color: PAPER }]);
const top = figma.createAutoLayout('VERTICAL', { name: 'Title', itemSpacing: 20 }); top.fills = []; cv.appendChild(top);\nconst VV = (n) => V(n) || V(n + '/default');\nconst display = (await figma.getLocalTextStylesAsync()).find((s) => s.name === 'Type/display');\nconst displayFont = display ? await load(display.fontName) : bold;
const eyebrow = await text('OPEN DS · FIGMA KIT', { font: semi, size: 18 }); bindFill(eyebrow, 'color/action/primary/default') || (eyebrow.fills = [{ type: 'SOLID', color: ACCENT }]); top.appendChild(eyebrow);
const title = await text(D.name, { font: displayFont, size: 120 }); bindFill(title, 'color/text/primary'); top.appendChild(title);
const sum = await text(D.summary, { font: sans, size: 34, width: 1180, lineHeight: 44 }); bindFill(sum, 'color/text/secondary'); top.appendChild(sum);
// The scheme's colours.
const strip = figma.createAutoLayout('HORIZONTAL', { name: 'Colours', itemSpacing: 0 }); cv.appendChild(strip); strip.layoutSizingHorizontal = 'FILL';
for (const n of ['color/action/primary', 'color/action/primary/hover', 'color/text/primary', 'color/surface/raised', 'color/status/success', 'color/status/warning', 'color/status/danger', 'color/status/info']) {
  const v = VV(n); if (!v) continue;
  const r = figma.createRectangle(); r.name = v.name; r.resize(100, 96); bindFill(r, v.name); strip.appendChild(r); r.layoutSizingHorizontal = 'FILL';
}
strip.cornerRadius = 16; strip.clipsContent = true; strip.strokes = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.25 }]; strip.strokeWeight = 1;
// A button from the kit, and the facts.
const foot = figma.createAutoLayout('HORIZONTAL', { name: 'Facts', itemSpacing: 32, counterAxisAlignItems: 'CENTER' }); foot.fills = []; cv.appendChild(foot);
const compPage = figma.root.children.find((p) => p.name === 'Components');
let set = null;
if (compPage) { await compPage.loadAsync(); set = compPage.children.find((n) => n.name === 'Button' && n.type === 'COMPONENT_SET') || null; }
if (set && set.type === 'COMPONENT_SET') { const inst = set.defaultVariant.createInstance(); inst.rescale(1.6); foot.appendChild(inst); }
const facts = await text(D.modes.length + ' themes: ' + D.modes.join(', ') + '\\n' + D.counts.variables + ' variables · ' + D.counts.components + ' components · ' + D.counts.answers + ' answered questions\\nScheme ' + D.id + ' ' + D.version + ' · generated from the scheme', { font: sans, size: 20, lineHeight: 30 });
bindFill(facts, 'color/text/secondary'); foot.appendChild(facts);
// The first frame of the first page is the file's thumbnail in Figma.
cv.x = 0; cv.y = 0;
if (figma.setFileThumbnailNodeAsync) { try { await figma.setFileThumbnailNodeAsync(cv); } catch {} }
return { cover: cv.id };
`;
}

/** All scripts for a scheme, in order: [{ file, code }]. */
export function kitScripts(id) {
  const d = kitData(id);
  const scripts = [
    ...variablesScripts(d).map((code, i) => ({ file: `01-variables-${i + 1}.js`, code })),
    { file: "02-foundations.js", code: foundationsScript(d) },
    ...componentsScripts(d).map((code, i) => ({ file: `03-components-${i + 1}.js`, code })),
    ...schemeScripts(d).map((code, i) => ({ file: `04-scheme-${i + 1}.js`, code })),
    { file: "05-cover.js", code: coverScript(d) },
  ];
  for (const s of scripts) if (s.code.length > MAX_SCRIPT) throw new Error(`${id}/${s.file} is ${s.code.length} characters, over ${MAX_SCRIPT}.`);
  return { data: d, scripts };
}

/** One development plugin with every scheme's kit: figma/plugin/ (manifest.json, code.js, ui.html). */
export function writePlugin(dir, ids) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "manifest.json"),
    JSON.stringify({ name: "Open DS kits", id: "open-ds-kits", api: "1.0.0", main: "code.js", ui: "ui.html", editorType: ["figma"], documentAccess: "dynamic-page", networkAccess: { allowedDomains: ["none"] } }, null, 2) + "\n",
  );
  const kits = ids.map((id) => {
    const { data, scripts } = kitScripts(id);
    const steps = scripts.map((x) => `    [${JSON.stringify(x.file)}, async () => {\n${x.code.replaceAll("figma.createAutoLayout(", "createAutoLayout(")}\n    }],`).join("\n");
    return `  ${JSON.stringify(id)}: { name: ${JSON.stringify(data.name)}, steps: [\n${steps}\n  ] },`;
  });
  writeFileSync(
    join(dir, "code.js"),
    `// Open DS kits: builds a scheme's Figma kit in the open file. Generated by scripts/figma-kit.mjs.
// The kit scripts are written for the Figma MCP, which adds figma.createAutoLayout. Plugins don't have it
// and the figma object cannot be extended, so the plugin calls this function instead.
function createAutoLayout(dir, props) {
  if (dir && typeof dir === "object") { props = dir; dir = "HORIZONTAL"; }
  const f = figma.createFrame();
  f.fills = [];
  f.layoutMode = dir || "HORIZONTAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  if (props) for (const [k, v] of Object.entries(props)) f[k] = v;
  return f;
}
const KITS = {
${kits.join("\n")}
};
const guess = Object.keys(KITS).find((id) => figma.root.name.toLowerCase().includes(KITS[id].name.toLowerCase())) || "";
figma.showUI(__html__, { width: 360, height: 240 });
figma.ui.postMessage({ type: "init", kits: Object.fromEntries(Object.entries(KITS).map(([k, v]) => [k, v.name])), guess });
figma.ui.onmessage = async (msg) => {
  if (msg.type !== "run") return;
  const kit = KITS[msg.id];
  let current = "start";
  try {
    for (const [i, [file, step]] of kit.steps.entries()) {
      current = file;
      figma.ui.postMessage({ type: "progress", text: (i + 1) + " of " + kit.steps.length + ": " + file });
      await step();
    }
    figma.closePlugin("Open DS kit · " + kit.name + ": done");
  } catch (e) {
    figma.ui.postMessage({ type: "progress", text: "Failed at " + current + ": " + (e && e.message ? e.message : String(e)) });
    console.error("Open DS kits failed at " + current, e);
  }
};
`,
  );
  writeFileSync(
    join(dir, "ui.html"),
    `<style>body{font:13px Inter,system-ui,sans-serif;margin:16px;color:#16140f}select,button{width:100%;height:32px;margin-top:8px;font:inherit}button{background:#16140f;color:#f6f2e9;border:0;border-radius:4px;font-weight:600}p{color:#645e50}</style>
<b>Open DS kits</b>
<p>Builds the scheme's kit in this file: variables, styles, foundations, components, every question and answer, and the cover. Running it again rebuilds the kit.</p>
<select id="kit"></select><button id="run">Build the kit</button><p id="status"></p>
<script>
onmessage = (e) => { const m = e.data.pluginMessage; if (m.type === "init") { const s = document.getElementById("kit"); for (const [id, name] of Object.entries(m.kits)) s.add(new Option(name, id, false, id === m.guess)); } if (m.type === "progress") document.getElementById("status").textContent = m.text; };
document.getElementById("run").onclick = () => parent.postMessage({ pluginMessage: { type: "run", id: document.getElementById("kit").value } }, "*");
</script>
`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv[2] && process.argv[2] !== "all" ? [process.argv[2]] : JSON.parse(readFileSync(join(ROOT, "tokens/dist/index.json"), "utf8")).schemes.map((s) => s.id);
  for (const id of ids) {
    const out = process.argv[3] ?? join(ROOT, "figma/kits", id);
    rmSync(out, { recursive: true, force: true });
    mkdirSync(out, { recursive: true });
    const { data, scripts } = kitScripts(id);
    for (const s of scripts) writeFileSync(join(out, s.file), s.code);
    console.log(`${id}: ${data.variables.length} variables, ${data.modes.length} modes, ${data.textStyles.length} text styles, ${data.components.length} components, ${data.answers.length} answers → ${scripts.length} scripts in ${out}`);
  }
  if (!process.argv[3]) {
    const all = JSON.parse(readFileSync(join(ROOT, "tokens/dist/index.json"), "utf8")).schemes.map((s) => s.id);
    writePlugin(join(ROOT, "figma/plugin"), all);
    console.log(`Figma plugin with every kit → figma/plugin (Plugins, Development, Import plugin from manifest).`);
  }
}
