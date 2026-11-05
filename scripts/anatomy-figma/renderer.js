// The anatomy generator's renderer (OD-229), run by use_figma with SPEC from build.mjs. It reads the
// published kit's variables (never edits the kit), draws the component's stage and one frame per card
// on the page "Anatomy / <component>", binds every drawn property to the first kit variable in its
// chain, and reports what it bound and what fell back to the scheme's value (missing in the kit).
const report = { bound: {}, fallback: {}, created: [] };
const vars = new Map();
for (const c of await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync())
  if (c.libraryName === SPEC.library)
    for (const v of await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key)) vars.set(`${c.name}/${v.name}`, v.key);
const imported = new Map();
async function kitVar(role) {
  const b = SPEC.bind[role];
  for (const n of b.kit) {
    const key = vars.get(n);
    if (!key) continue;
    if (!imported.has(key)) imported.set(key, await figma.variables.importVariableByKeyAsync(key));
    report.bound[role] = n;
    return imported.get(key);
  }
  report.fallback[role] = `${b.path} (kit has none of: ${b.kit.join(", ") || "-"})`;
  return null;
}
const V = {};
for (const role of Object.keys(SPEC.bind)) V[role] = { v: await kitVar(role), value: SPEC.bind[role].value };
const paint = (role, opacity) => {
  const { v, value } = V[role];
  const c = value ?? { r: 0, g: 0, b: 0, a: 1 };
  let p = { type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: opacity ?? c.a ?? 1 };
  if (v) p = figma.variables.setBoundVariableForPaint(p, "color", v);
  return p;
};
const num = (node, prop, role) => {
  const { v, value } = V[role];
  if (typeof value === "number" && !Number.isNaN(value)) {
    // Width and height go through resize; every other number is a plain property.
    if (prop === "height") node.resize(node.width, Math.max(value, 0.01));
    else if (prop === "width") node.resize(Math.max(value, 0.01), node.height);
    else node[prop] = value;
  }
  if (v) node.setBoundVariable(prop, v);
};
// Fonts: the scheme's body family, its regular and semibold faces.
const family = String(V.font.value ?? "Inter").split(",")[0].replace(/["']/g, "").trim();
const faces = (await figma.listAvailableFontsAsync()).filter((f) => f.fontName.family === family).map((f) => f.fontName.style);
const FONT = { family, style: faces.find((x) => /^regular$/i.test(x)) ?? faces[0] ?? "Regular" };
const BOLD = { family, style: faces.find((x) => /semi ?bold/i.test(x)) ?? faces.find((x) => /bold/i.test(x)) ?? FONT.style };
await Promise.all([figma.loadFontAsync(FONT), figma.loadFontAsync(BOLD)]);
const text = (chars, sizeRole, colorRole, opacity) => {
  const t = figma.createText();
  t.fontName = FONT;
  t.characters = chars;
  num(t, "fontSize", sizeRole);
  t.fills = [paint(colorRole, opacity)];
  return t;
};
const svg = (name, sizeRole, colorRole) => {
  const n = figma.createNodeFromSvg(SPEC.icons[name]);
  n.name = `icon/${name}`;
  const sz = V[sizeRole].value || 16;
  n.resize(sz, sz);
  for (const vec of n.findAll((x) => "strokes" in x && x.strokes.length)) vec.strokes = [paint(colorRole)];
  return n;
};
const shadow = (css) => {
  if (!css || css === "none") return [];
  // A token shadow ({ color, offsetX, offsetY, blur, spread }, or a list of them).
  if (typeof css === "object") {
    const px = (v) => parseFloat(v) || 0;
    return [].concat(css).map((sh) => {
      const h = String(sh.color);
      const color = { r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255, a: h.length > 7 ? parseInt(h.slice(7, 9), 16) / 255 : 1 };
      return { type: "DROP_SHADOW", color, offset: { x: px(sh.offsetX), y: px(sh.offsetY) }, radius: px(sh.blur), spread: px(sh.spread), visible: true, blendMode: "NORMAL" };
    });
  }
  return String(css).split(/,(?![^(]*\))/).map((part) => {
    const col = part.match(/(#[0-9a-f]{6,8}|rgba?\([^)]*\))/i)?.[0] ?? "rgb(0 0 0 / 0.16)";
    const nums = part.replace(col, "").trim().split(/\s+/).map((x) => parseFloat(x) || 0);
    const m = col.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0.16];
    const color = col.startsWith("#")
      ? { r: parseInt(col.slice(1, 3), 16) / 255, g: parseInt(col.slice(3, 5), 16) / 255, b: parseInt(col.slice(5, 7), 16) / 255, a: col.length > 7 ? parseInt(col.slice(7, 9), 16) / 255 : 1 }
      : { r: m[0] / 255, g: m[1] / 255, b: m[2] / 255, a: m[3] ?? 1 };
    return { type: "DROP_SHADOW", color, offset: { x: nums[0] || 0, y: nums[1] || 0 }, radius: nums[2] || 0, spread: nums[3] || 0, visible: true, blendMode: "NORMAL" };
  });
};

// The menu recipe: a panel of rows, each row the parts it has; a mark records which node a number sits on.
function menu(rows, show, whole) {
  const marks = [];
  const panel = figma.createAutoLayout("VERTICAL", { name: "Menu" });
  num(panel, "paddingTop", "panelPadding"); num(panel, "paddingBottom", "panelPadding");
  num(panel, "paddingLeft", "panelPadding"); num(panel, "paddingRight", "panelPadding");
  for (const c of ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]) num(panel, c, "panelRadius");
  panel.fills = [paint("panelFill")];
  panel.strokes = [paint("panelBorder")];
  for (const w of ["strokeTopWeight", "strokeBottomWeight", "strokeLeftWeight", "strokeRightWeight"]) num(panel, w, "panelBorderWidth");
  panel.effects = shadow(V.panelShadow.value);
  panel.resize(220, 10);
  panel.primaryAxisSizingMode = "AUTO";
  panel.counterAxisSizingMode = "FIXED";
  for (const r of rows) {
    if (r.separator) {
      const wrap = figma.createAutoLayout("VERTICAL", { name: "Separator" });
      num(wrap, "paddingTop", "sepMargin"); num(wrap, "paddingBottom", "sepMargin");
      wrap.fills = [];
      const line = figma.createRectangle();
      line.name = "Line";
      line.resize(10, 1);
      num(line, "height", "sepThickness");
      line.fills = [paint("sepColor")];
      wrap.appendChild(line);
      line.layoutSizingHorizontal = "FILL";
      panel.appendChild(wrap);
      wrap.layoutSizingHorizontal = "FILL";
      if (r.marks?.row) marks.push([r.marks.row, line, "right"]);
      continue;
    }
    const row = figma.createAutoLayout("HORIZONTAL", { name: `Item · ${r.label}` });
    row.counterAxisAlignItems = "CENTER";
    num(row, "minHeight", "itemHeight");
    num(row, "paddingLeft", "itemPaddingX"); num(row, "paddingRight", "itemPaddingX");
    num(row, "itemSpacing", "itemGap");
    for (const c of ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"]) num(row, c, "itemRadius");
    row.fills = r.state === "highlight" ? [paint("highlight")] : [];
    if (r.state === "focus") {
      row.strokes = [paint("focusColor")];
      row.strokeAlign = "INSIDE";
      for (const w of ["strokeTopWeight", "strokeBottomWeight", "strokeLeftWeight", "strokeRightWeight"]) num(row, w, "focusWidth");
    }
    const tone = r.tone === "danger" ? "destructive" : "itemLabel";
    if (r.icon) { const i = svg(r.icon, "iconSize", tone); row.appendChild(i); if (r.marks?.icon) marks.push([r.marks.icon, i, "top"]); }
    const label = text(r.label, "itemFontSize", tone);
    label.name = "Label";
    row.appendChild(label);
    label.layoutGrow = 1;
    if (r.marks?.label) marks.push([r.marks.label, label, "top"]);
    if (r.shortcut) { const k = text(r.shortcut, "shortcutSize", "shortcutColor"); k.name = "Shortcut"; row.appendChild(k); if (r.marks?.shortcut) marks.push([r.marks.shortcut, k, "top"]); }
    if (r.chevron) { const ch = svg("chevron-right", "iconSize", "itemLabel"); row.appendChild(ch); if (r.marks?.chevron) marks.push([r.marks.chevron, ch, "top"]); }
    if (r.state === "disabled") num(row, "opacity", "disabled");
    panel.appendChild(row);
    row.layoutSizingHorizontal = "FILL";
    for (const [k, n] of Object.entries(r.marks ?? {})) if (["row", "focus"].includes(k)) marks.push([n, row, "right"]);
  }
  if (whole) { for (const n of SPEC.drawing.surface ?? []) marks.push([n, panel, "corner"]); for (const n of SPEC.drawing.shadow ?? []) marks.push([n, panel, "shadow"]); }
  return { node: panel, marks: marks.filter(([n]) => !show || show.has(n)) };
}

// A frame on the scheme's canvas holding a drawing, with the numbers placed on it (the template's badges).
function plate(name, built, w) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [paint("canvas")];
  f.cornerRadius = 8;
  f.clipsContent = false;
  f.appendChild(built.node);
  built.node.x = 40; built.node.y = 32;
  f.resize(Math.max(w, built.node.width + 80), built.node.height + 64);
  const origin = f.absoluteTransform;
  for (const [n, node, where] of built.marks) {
    const bb = node.absoluteBoundingBox, fb = f.absoluteBoundingBox;
    const x = bb.x - fb.x, y = bb.y - fb.y;
    const pos = where === "corner" ? [x - 8, y - 8] : where === "shadow" ? [x + bb.width - 8, y + bb.height - 4] : where === "right" ? [x + bb.width + 6, y + bb.height / 2 - 8] : [x + bb.width / 2 - 8, y - 18];
    const badge = figma.createFrame();
    badge.name = `Number ${n}`;
    badge.resize(16, 16);
    badge.cornerRadius = 8;
    badge.fills = [{ type: "SOLID", color: { r: 0.294, g: 0.247, b: 0.851 } }];
    badge.strokes = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    badge.strokeWeight = 1.5;
    const t = figma.createText();
    t.fontName = BOLD;
    t.characters = String(n);
    t.fontSize = 10;
    t.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    t.textAlignHorizontal = "CENTER";
    t.textAlignVertical = "CENTER";
    t.resize(16, 16);
    badge.appendChild(t);
    f.appendChild(badge);
    badge.x = pos[0]; badge.y = pos[1];
  }
  void origin;
  return f;
}

// The page: one per component, rebuilt from scratch each run (only this page is touched).
const pageName = `Anatomy / ${SPEC.component}`;
let page = figma.root.children.find((p) => p.name === pageName);
if (!page) { page = figma.createPage(); page.name = pageName; }
await figma.setCurrentPageAsync(page);
for (const c of [...page.children]) c.remove();
const all = new Set(SPEC.parts.map((p) => p.n));
const stage = plate(`${SPEC.component}/${SPEC.scheme}/stage`, menu(SPEC.drawing.rows, null, true), 360);
stage.x = 0; stage.y = 0;
const ids = { page: page.id, stage: stage.id, cards: [] };
let x = stage.width + 64;
SPEC.cards.forEach((c, i) => {
  const show = new Set(c.parts);
  const rows = c.image?.row
    ? [{ ...SPEC.drawing.rows.find((r) => r.label === c.image.row), state: undefined, marks: c.image.marks }]
    : c.parts.some((n) => (SPEC.drawing.surface ?? []).includes(n) || (SPEC.drawing.shadow ?? []).includes(n))
      ? SPEC.drawing.rows
      : SPEC.drawing.rows.filter((r) => Object.values(r.marks ?? {}).some((n) => show.has(n)));
  const whole = rows === SPEC.drawing.rows;
  const f = plate(`${SPEC.component}/${SPEC.scheme}/card-${i + 1}`, menu(rows, show, whole), 280);
  f.x = x; f.y = 0;
  x += f.width + 32;
  ids.cards.push(f.id);
});
void all;
return { ids, bound: report.bound, fallback: report.fallback };
