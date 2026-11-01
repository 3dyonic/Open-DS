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
//   03-components.js    The scheme's components that have component keys, bound to the variables.
//   04-scheme-*.js      Every question with its answer, why and because; voice, usage and inventory.
//
// Sources: tokens/dist/<scheme>/tokens.css (the shipped semantic and component variables, run
// `pnpm --dir tokens build` first), tokens/dist/<scheme>/<theme>.tokens.json (names), schemes/*.json.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
    lineHeight: px(resolve(`type-${r}-line-height`)),
    weight: Number(resolve(`type-${r}-font-weight`) ?? 400),
    letterSpacing: px(resolve(`type-${r}-letter-spacing`) ?? "0"),
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
    if (t.lineHeight) st.lineHeight = { unit: 'PIXELS', value: t.lineHeight };
    if (t.letterSpacing) st.letterSpacing = { unit: 'PIXELS', value: t.letterSpacing };
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
  const data = { name: d.name, id: d.id, version: d.version, summary: d.summary, description: d.description, modes: d.modes, colors, floats, styles: d.textStyles.map((t) => t.name), counts: { variables: d.variables.length, components: d.components.length, answers: d.answers.length } };
  return `${HEADER(d, "02 cover and foundations")}const D = ${JSON.stringify(data)};
${HELPERS}
const sans = await load({ family: 'Inter', style: 'Regular' }), bold = await load({ family: 'Inter', style: 'Bold' }), semi = await load({ family: 'Inter', style: 'Semi Bold' });
const created = [];

// Figma's empty default page goes (the cover is its own step, 05).
for (const pg of [...figma.root.children]) if (pg.name === 'Page 1' && figma.root.children.length > 1) { await pg.loadAsync(); if (pg.children.length === 0) pg.remove(); }

// Foundations
await pageNamed('Foundations', 1);
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
    sw.strokes = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.3 }]; sw.strokeWeight = 1;
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

function componentsScript(d) {
  const data = { components: d.components, modes: d.modes, inventory: d.inventory.map((c) => c.id), name: d.name };
  return `${HEADER(d, "03 components")}const D = ${JSON.stringify(data)};
${HELPERS}
await pageNamed('Components', 2);
const fam = (role) => { const st = figma.getLocalTextStyles ? null : null; return role; };
const styles = await figma.getLocalTextStylesAsync();
const style = (role) => styles.find((s) => s.name === 'Type/' + role) || styles.find((s) => s.name === 'Type/body') || styles[0];
async function label(chars, role, fill) {
  const t = figma.createText(); const st = style(role);
  if (st) { await load(st.fontName); t.fontName = st.fontName; t.characters = chars; await t.setTextStyleIdAsync(st.id); }
  else { t.fontName = await load({ family: 'Inter', style: 'Regular' }); t.characters = chars; }
  if (fill) bindFill(t, fill); return t;
}
function pad(node, x, y) { if (!bindNum(node, 'paddingLeft', x)) node.paddingLeft = 12; bindNum(node, 'paddingRight', x) || (node.paddingRight = 12); if (y) { bindNum(node, 'paddingTop', y) || (node.paddingTop = 8); bindNum(node, 'paddingBottom', y) || (node.paddingBottom = 8); } }
function radius(node, name) { if (V(name)) for (const f of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) node.setBoundVariable(f, V(name)); }
function stroke(node, name) { const v = V(name); if (!v) return; node.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }, 'color', v)]; node.strokeAlign = 'INSIDE'; if (!bindNum(node, 'strokeWeight', 'border/width/default')) node.strokeWeight = 1; }
function base(name, dir = 'HORIZONTAL') { const c = figma.createComponent(); c.name = name; c.layoutMode = dir; c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'AUTO'; c.counterAxisAlignItems = 'CENTER'; c.primaryAxisAlignItems = 'CENTER'; c.fills = []; return c; }
function grid(set, cols) { const kids = set.children; let x = 0, y = 0, rowH = 0, i = 0; for (const k of kids) { k.x = x; k.y = y; rowH = Math.max(rowH, k.height); x += k.width + 24; if (++i % cols === 0) { x = 0; y += rowH + 24; rowH = 0; } } set.layoutMode = 'NONE'; let w = 0, h = 0; for (const k of kids) { w = Math.max(w, k.x + k.width); h = Math.max(h, k.y + k.height); } set.resize(w + 32, h + 32); for (const k of kids) { k.x += 16; k.y += 16; } }
const sets = [];
const page = figma.currentPage;
let cursorY = 0;
async function place(node, title, desc) {
  const header = await text(title, { font: await load({ family: 'Inter', style: 'Bold' }), size: 28, color: INK });
  header.x = 0; header.y = cursorY; cursorY += header.height + 12;
  node.x = 0; node.y = cursorY; cursorY += node.height + 72;
  if (desc && (node.type === 'COMPONENT_SET' || node.type === 'COMPONENT')) node.description = desc;
  sets.push(node.id);
}

if (D.components.includes('button')) {
  const variants = [['Primary', 'button/primary/background/default', 'button/primary/label', null], ['Primary hover', 'button/primary/background/hover', 'button/primary/label', null], ['Secondary', 'button/secondary/background/default', 'button/secondary/label', 'button/secondary/border'], ['Secondary hover', 'button/secondary/background/hover', 'button/secondary/label', 'button/secondary/border'], ['Ghost', null, 'button/ghost/label', null], ['Ghost hover', 'button/ghost/background-hover', 'button/ghost/label', null], ['Disabled', 'button/disabled/background', 'button/disabled/label', 'button/disabled/border']];
  const comps = [];
  for (const [vn, bg, fg, br] of variants) {
    const c = base('Variant=' + vn); bindNum(c, 'height', 'button/height'); c.primaryAxisSizingMode = 'AUTO'; c.counterAxisSizingMode = 'FIXED';
    pad(c, 'button/padding-x'); radius(c, 'button/radius'); c.itemSpacing = 6;
    if (bg) bindFill(c, bg); if (br) stroke(c, br);
    const t = await label('Button', 'label', fg); c.appendChild(t); bindNum(t, 'fontSize', 'button/font-size');
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, page); set.name = 'Button'; grid(set, 7);
  await place(set, 'Button', 'Every action. Primary is the one main action in a view. Reads only button/* component keys.');
}

if (D.components.includes('input')) {
  const comps = [];
  for (const [vn, br, bg, fg] of [['Default', 'input/border', 'input/background', 'input/placeholder'], ['Filled', 'input/border', 'input/background', 'input/text'], ['Focus', 'input/border-focus', 'input/background', 'input/text'], ['Disabled', 'input/disabled/border', 'input/disabled/background', 'input/disabled/text']]) {
    const c = base('State=' + vn); c.primaryAxisAlignItems = 'MIN'; c.resize(240, 32); c.primaryAxisSizingMode = 'FIXED'; c.counterAxisSizingMode = 'FIXED'; bindNum(c, 'height', 'input/height');
    pad(c, 'input/padding-x'); radius(c, 'input/radius'); bindFill(c, bg); stroke(c, br);
    if (vn === 'Focus' && V('input/border-focus')) { bindNum(c, 'strokeWeight', 'border/width/focus') || (c.strokeWeight = 2); }
    const t = await label(vn === 'Default' ? 'Search' : vn === 'Disabled' ? 'Not editable' : 'Alert 2041', 'body', fg); c.appendChild(t); bindNum(t, 'fontSize', 'input/font-size');
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, page); set.name = 'Input'; grid(set, 4);
  await place(set, 'Input', 'Text fields. Reads only input/* component keys.');
}

if (D.components.includes('badge')) {
  const comps = [];
  for (const tone of ['neutral', 'info', 'success', 'warning', 'danger']) {
    if (!V('badge/' + tone + '/background')) continue;
    const c = base('Tone=' + tone[0].toUpperCase() + tone.slice(1)); pad(c, 'badge/padding-x'); c.paddingTop = 2; c.paddingBottom = 2; radius(c, 'badge/radius');
    bindFill(c, 'badge/' + tone + '/background');
    const t = await label(tone[0].toUpperCase() + tone.slice(1), 'caption', 'badge/' + tone + '/label'); c.appendChild(t); bindNum(t, 'fontSize', 'badge/font-size');
    comps.push(c);
  }
  if (comps.length) { const set = figma.combineAsVariants(comps, page); set.name = 'Badge'; grid(set, 5); await place(set, 'Badge', 'Status at a glance. One tone per status meaning.'); }
}

if (D.components.includes('control')) {
  const comps = [];
  for (const [vn, on] of [['Checkbox off', false], ['Checkbox on', true], ['Switch off', false], ['Switch on', true]]) {
    const isSwitch = vn.startsWith('Switch');
    const c = base('Control=' + vn); c.itemSpacing = 8;
    const box = figma.createFrame(); box.name = isSwitch ? 'Track' : 'Box'; box.resize(isSwitch ? 32 : 16, 16); box.layoutMode = 'HORIZONTAL'; box.primaryAxisAlignItems = on ? 'MAX' : 'MIN'; box.counterAxisAlignItems = 'CENTER'; box.paddingLeft = 2; box.paddingRight = 2;
    if (isSwitch) { box.cornerRadius = 8; bindFill(box, on ? 'control/checked' : 'control/track'); const th = figma.createEllipse(); th.resize(12, 12); bindFill(th, 'control/thumb'); box.appendChild(th); }
    else { radius(box, 'control/radius'); if (on) bindFill(box, 'control/checked'); else { box.fills = []; stroke(box, 'input/border'); } if (on) { const tick = await label('✓', 'caption', 'control/thumb'); box.primaryAxisAlignItems = 'CENTER'; box.appendChild(tick); } }
    c.appendChild(box); c.appendChild(await label(isSwitch ? 'Live updates' : 'Select row', 'body', 'color/text/primary'));
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, page); set.name = 'Checkbox and switch'; grid(set, 4);
  await place(set, 'Checkbox and switch', 'Choices that are on or off. Reads control/* component keys.');
}

if (D.components.includes('card')) {
  const c = base('Card', 'VERTICAL'); c.primaryAxisAlignItems = 'MIN'; c.counterAxisAlignItems = 'MIN'; c.resize(320, 120); c.counterAxisSizingMode = 'FIXED'; c.itemSpacing = 8;
  bindFill(c, 'card/background'); stroke(c, 'card/border'); radius(c, 'card/radius');
  for (const f of ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom']) bindNum(c, f, 'card/padding') || (c[f] = 16);
  const es = (await figma.getLocalEffectStylesAsync()).find((s) => s.name === 'Elevation/card'); if (es) await c.setEffectStyleIdAsync(es.id);
  const h = await label('Card title', 'heading', 'color/text/primary'); c.appendChild(h);
  const b = await label('A group of related content, on its own surface.', 'body', 'color/text/secondary'); c.appendChild(b); b.layoutSizingHorizontal = 'FILL'; b.textAutoResize = 'HEIGHT';
  await place(c, 'Card', 'A surface that groups related content.');
}

if (D.components.includes('table')) {
  const c = base('Table', 'VERTICAL'); c.primaryAxisAlignItems = 'MIN'; c.counterAxisAlignItems = 'MIN'; c.itemSpacing = 0; c.resize(480, 100); c.counterAxisSizingMode = 'FIXED';
  stroke(c, 'table/row-border'); radius(c, 'radius/container'); c.clipsContent = true;
  const rows = [['Name', 'Status', 'Updated'], ['Row one', 'Open', '09:41'], ['Row two', 'Closed', '08:15'], ['Row three', 'Open', 'Yesterday']];
  for (const [i, r] of rows.entries()) {
    const row = figma.createAutoLayout('HORIZONTAL', { name: i ? 'Row' : 'Header', itemSpacing: 0, counterAxisAlignItems: 'CENTER' });
    c.appendChild(row); row.layoutSizingHorizontal = 'FILL'; bindNum(row, 'height', 'table/row-height'); row.counterAxisSizingMode = 'FIXED';
    if (i === 0) bindFill(row, 'table/header-background'); else if (i === 2) bindFill(row, 'table/row-selected'); else row.fills = [];
    if (i < rows.length - 1) { const v = V('table/row-border'); if (v) { row.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }, 'color', v)]; row.strokeTopWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0; row.strokeBottomWeight = 1; } }
    for (const cell of r) {
      const f = figma.createAutoLayout('HORIZONTAL', { name: 'Cell', counterAxisAlignItems: 'CENTER' }); row.appendChild(f); f.layoutSizingHorizontal = 'FILL'; pad(f, 'table/cell-padding-x');
      const t = await label(cell, i ? 'data' : 'label', i ? 'color/text/primary' : 'color/text/secondary'); f.appendChild(t); bindNum(t, 'fontSize', 'table/font-size');
    }
  }
  await place(c, 'Table', 'Rows of records. Header, rows, and a selected row.');
}

if (D.components.includes('tabs')) {
  const c = base('Tabs'); c.itemSpacing = 24; c.primaryAxisAlignItems = 'MIN';
  for (const [i, n] of ['Overview', 'Activity', 'Settings'].entries()) {
    const tab = figma.createAutoLayout('VERTICAL', { name: 'Tab', itemSpacing: 6, counterAxisAlignItems: 'CENTER' }); c.appendChild(tab);
    tab.appendChild(await label(n, 'label', i === 0 ? 'tabs/label-active' : 'tabs/label'));
    const bar = figma.createRectangle(); bar.resize(40, 2); tab.appendChild(bar); bar.layoutSizingHorizontal = 'FILL'; if (i === 0) bindFill(bar, 'tabs/indicator'); else bar.fills = [];
  }
  await place(c, 'Tabs', 'Switch between views of the same thing.');
}

if (D.components.includes('overlay')) {
  const c = base('Menu', 'VERTICAL'); c.primaryAxisAlignItems = 'MIN'; c.counterAxisAlignItems = 'MIN'; c.resize(200, 100); c.counterAxisSizingMode = 'FIXED'; c.paddingTop = 4; c.paddingBottom = 4;
  bindFill(c, 'overlay/background'); radius(c, 'overlay/radius'); stroke(c, 'color/border/default');
  const es = (await figma.getLocalEffectStylesAsync()).find((s) => s.name === 'Elevation/overlay'); if (es) await c.setEffectStyleIdAsync(es.id);
  for (const n of ['Open', 'Rename', 'Delete']) {
    const item = figma.createAutoLayout('HORIZONTAL', { name: 'Item', counterAxisAlignItems: 'CENTER' }); c.appendChild(item); item.layoutSizingHorizontal = 'FILL';
    bindNum(item, 'height', 'overlay/item-height'); item.counterAxisSizingMode = 'FIXED'; item.paddingLeft = 12; item.paddingRight = 12; item.fills = [];
    item.appendChild(await label(n, 'body', n === 'Delete' ? 'color/status/danger' : 'color/text/primary'));
  }
  await place(c, 'Menu', 'Dropdown and context menus, popovers. Reads overlay/* keys.');
}

if (D.components.includes('tooltip')) {
  const c = base('Tooltip'); c.paddingLeft = 8; c.paddingRight = 8; c.paddingTop = 4; c.paddingBottom = 4; radius(c, 'radius/control');
  bindFill(c, 'tooltip/background'); c.appendChild(await label('Copied', 'caption', 'tooltip/label'));
  await place(c, 'Tooltip', 'A short hint on hover or focus.');
}

const note = await text('This kit carries the components that have component keys. The scheme\\'s full inventory (' + D.inventory.length + ' components) is listed on the Scheme page; every one reads the same variables.', { font: await load({ family: 'Inter', style: 'Regular' }), size: 14, color: MUTED, width: 900 });
note.x = 0; note.y = cursorY;
return { components: sets.length, ids: sets };
`;
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
if (D.first) page = await pageNamed('Scheme', 3); else await figma.setCurrentPageAsync(page);
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
  const section = async (title) => col.appendChild(await text(title, { font: semi, size: 13, color: ACCENT }));
  const para = async (chars, size = 14, color = INK, font = sans) => { const t = await text(chars, { font, size, color, lineHeight: Math.round(size * 1.5) }); col.appendChild(t); t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; };
  await section('VOICE');
  if (E.voice?.summary) await para(E.voice.summary.text, 18, INK, semi);
  for (const p of E.voice?.principles || []) await para('· ' + p.text);
  if (E.voice?.words) await para('Use: ' + (E.voice.words.use || []).join(', ') + '.  Avoid: ' + (E.voice.words.avoid || []).join(', ') + '.', 14, MUTED);
  for (const [b, v] of Object.entries(E.voice?.brands || {})) await para(b + ': ' + v.text, 14, MUTED);
  await section('WHEN TO USE WHAT');
  for (const u of E.usage || []) await para(u.situation + ': use ' + u.use + (u.not ? ', not ' + u.not : '') + '. ' + (u.why || ''));
  await section('INVENTORY · ' + E.inventory.length + ' COMPONENTS');
  for (const c of E.inventory) await para(c.id + ': ' + c.why);
}
col.x = D.x; col.y = 0;
return { id: col.id, groups: D.part.length, answers: D.part.reduce((n, g) => n + g.answers.length, 0) };
`;
  });
}

function coverScript(d) {
  const data = { name: d.name, id: d.id, version: d.version, summary: d.summary, modes: d.modes, counts: { variables: d.variables.length, components: d.components.length, answers: d.answers.length } };
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
    { file: "03-components.js", code: componentsScript(d) },
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
    const steps = scripts.map((x) => `    [${JSON.stringify(x.file)}, async () => {\n${x.code}\n    }],`).join("\n");
    return `  ${JSON.stringify(id)}: { name: ${JSON.stringify(data.name)}, steps: [\n${steps}\n  ] },`;
  });
  writeFileSync(
    join(dir, "code.js"),
    `// Open DS kits: builds a scheme's Figma kit in the open file. Generated by scripts/figma-kit.mjs.
const KITS = {
${kits.join("\n")}
};
const guess = Object.keys(KITS).find((id) => figma.root.name.toLowerCase().includes(KITS[id].name.toLowerCase())) || "";
figma.showUI(__html__, { width: 360, height: 240 });
figma.ui.postMessage({ type: "init", kits: Object.fromEntries(Object.entries(KITS).map(([k, v]) => [k, v.name])), guess });
figma.ui.onmessage = async (msg) => {
  if (msg.type !== "run") return;
  const kit = KITS[msg.id];
  try {
    for (const [i, [file, step]] of kit.steps.entries()) {
      figma.ui.postMessage({ type: "progress", text: (i + 1) + " of " + kit.steps.length + ": " + file });
      await step();
    }
    figma.closePlugin("Open DS kit · " + kit.name + ": done");
  } catch (e) {
    figma.ui.postMessage({ type: "progress", text: "Failed: " + e.message });
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
