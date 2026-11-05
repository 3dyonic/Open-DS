// The anatomy generator's renderer (OD-229). renderAnatomy(SPEC, kit) draws one component's stage and
// one frame per card on the page "Anatomy / <component>", binds every drawn property to the first kit
// variable in its chain, and reports what it bound and what fell back to the scheme's value (missing in
// the kit). It reads the published kit's variables and never edits the kit. loadKit reads them once.
async function loadKit(library) {
  const vars = new Map();
  for (const c of await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync())
    if (c.libraryName === library)
      for (const v of await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key)) vars.set(`${c.name}/${v.name}`, v.key);
  return vars;
}
async function renderAnatomy(SPEC, vars) {
const report = { bound: {}, fallback: {} };
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
// The data font (tables): its regular face, if the scheme names one Figma has.
let DATA = FONT;
if (V.dataFont) {
  const fam = String(V.dataFont.value ?? "").split(",")[0].replace(/["']/g, "").trim();
  const df = (await figma.listAvailableFontsAsync()).filter((f) => f.fontName.family === fam).map((f) => f.fontName.style);
  if (df.length) { DATA = { family: fam, style: df.find((x) => /^regular$/i.test(x)) ?? df[0] }; await figma.loadFontAsync(DATA); }
}
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
const CORNERS = ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"];
const SIDES = ["strokeTopWeight", "strokeBottomWeight", "strokeLeftWeight", "strokeRightWeight"];
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

// The table recipe: a toolbar, then a framed table (header row, rows); sections pick what a card shows.
const box = (checked, sizeRole = "boxSize") => {
  const b = figma.createFrame();
  b.name = checked ? "Select box · checked" : "Select box";
  const sz = V[sizeRole].value || 16;
  b.resize(sz, sz);
  num(b, "width", sizeRole); num(b, "height", sizeRole);
  for (const c of CORNERS) num(b, c, "boxRadius");
  if (checked) {
    b.fills = [paint("boxChecked")];
    const m = svg("check", "boxSize", "boxMark");
    m.resize(sz * 0.75, sz * 0.75); b.appendChild(m); m.x = sz * 0.125; m.y = sz * 0.125;
  } else { b.fills = []; b.strokes = [paint("boxBorder")]; b.strokeWeight = 1; }
  return b;
};
function cellText(chars, numeric, colorRole = "cellLabel", sizeRole = "cellSize") {
  const t = figma.createText();
  t.fontName = numeric ? DATA : FONT;
  t.characters = chars;
  num(t, "fontSize", sizeRole);
  t.fills = [paint(colorRole)];
  if (numeric) t.textAlignHorizontal = "RIGHT";
  return t;
}
function trow(cells, opts, marks, headMarks) {
  const head = opts.head;
  const r = figma.createAutoLayout("HORIZONTAL", { name: head ? "Header row" : `Row · ${cells[0]}` });
  r.counterAxisAlignItems = "CENTER";
  num(r, "minHeight", "rowHeight");
  r.fills = head ? [paint("headFill")] : opts.state === "highlight" ? [paint("highlight")] : opts.state === "selected" ? [paint("selected")] : [];
  r.strokes = [paint("rowBorder")]; r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.strokeBottomWeight = 1;
  if (opts.state === "selected") {
    r.effects = [{ type: "INNER_SHADOW", color: { ...V.edge.value, a: 1 }, offset: { x: V.edgeWidth.value || 2, y: 0 }, radius: 0, spread: 0, visible: true, blendMode: "NORMAL" }];
  }
  const chk = figma.createAutoLayout("HORIZONTAL", { name: "Check cell" });
  num(chk, "paddingLeft", "cellPaddingX"); num(chk, "paddingRight", "cellPaddingX"); chk.fills = [];
  const b = box(!!opts.checked); chk.appendChild(b); r.appendChild(chk);
  if (marks?.check) marks.push_([marks.check, b, "top"]);
  if (head && headMarks?.check) headMarks.push_([headMarks.check, b, "top"]);
  SPEC.drawing.columns.forEach((col, k) => {
    const c = figma.createAutoLayout("HORIZONTAL", { name: `Cell · ${col.label}` });
    c.counterAxisAlignItems = "CENTER"; c.itemSpacing = 4; c.fills = [];
    if (col.numeric) c.primaryAxisAlignItems = "MAX";
    num(c, "paddingLeft", "cellPaddingX"); num(c, "paddingRight", "cellPaddingX");
    const t = head ? cellText(col.label, false, "headLabel", "headSize") : cellText(cells[k], col.numeric);
    if (head) t.fontName = BOLD;
    c.appendChild(t);
    if (head && col.sort) { const i = svg("arrow-up-down", "iconSize", "sortIcon"); c.appendChild(i); if (k === 0 && headMarks?.sort) headMarks.push_([headMarks.sort, i, "top"]); }
    if (head && k === 0 && headMarks?.label) headMarks.push_([headMarks.label, t, "top"]);
    if (!head && k === 0 && marks?.cell) marks.push_([marks.cell, t, "top"]);
    r.appendChild(c);
    c.layoutGrow = 1;
  });
  if (head && headMarks?.row) headMarks.push_([headMarks.row, r, "right"]);
  if (!head && marks?.row) marks.push_([marks.row, r, "right"]);
  return r;
}
function toolbar(out) {
  const bar = figma.createAutoLayout("HORIZONTAL", { name: "Toolbar" });
  bar.counterAxisAlignItems = "CENTER"; bar.itemSpacing = 8; bar.fills = [];
  for (const t of SPEC.drawing.toolbar) {
    let n;
    if (t.kind === "search") {
      n = figma.createAutoLayout("HORIZONTAL", { name: "Search field" });
      n.counterAxisAlignItems = "CENTER"; n.itemSpacing = 6;
      num(n, "minHeight", "inputHeight"); num(n, "paddingLeft", "inputPaddingX"); num(n, "paddingRight", "inputPaddingX");
      for (const c of CORNERS) num(n, c, "inputRadius");
      n.fills = [paint("inputFill")]; n.strokes = [paint("inputBorder")]; n.strokeWeight = 1;
      n.appendChild(svg("search", "iconSize", "inputPlaceholder"));
      n.appendChild(cellText(t.label, false, "inputPlaceholder", "inputFontSize"));
    } else if (t.kind === "button") {
      n = figma.createAutoLayout("HORIZONTAL", { name: `Button · ${t.label}` });
      n.counterAxisAlignItems = "CENTER"; n.itemSpacing = 6;
      num(n, "minHeight", "btnHeight"); num(n, "paddingLeft", "btnPaddingX"); num(n, "paddingRight", "btnPaddingX");
      for (const c of CORNERS) num(n, c, "btnRadius");
      n.fills = [paint("btnFill")]; n.strokes = [paint("btnBorder")]; n.strokeWeight = 1;
      if (t.icon) n.appendChild(svg(t.icon, "iconSize", "btnLabel"));
      n.appendChild(cellText(t.label, false, "btnLabel", "btnFontSize"));
    } else if (t.kind === "count") {
      n = cellText(t.label, false, "count", "cellSize");
    } else {
      n = figma.createAutoLayout("HORIZONTAL", { name: "Density switch" });
      n.fills = []; n.strokes = [paint("btnBorder")]; n.strokeWeight = 1;
      for (const c of CORNERS) num(n, c, "toggleRadius");
      t.options.forEach((o, k) => {
        const seg = figma.createAutoLayout("HORIZONTAL", { name: o });
        seg.counterAxisAlignItems = "CENTER"; num(seg, "minHeight", "btnHeight"); num(seg, "paddingLeft", "btnPaddingX"); num(seg, "paddingRight", "btnPaddingX");
        seg.fills = k === 0 ? [paint("toggleOn")] : [];
        seg.appendChild(cellText(o, false, "btnLabel", "btnFontSize"));
        n.appendChild(seg);
      });
    }
    bar.appendChild(n);
    out.push_([t.n, n, "top"]);
  }
  return bar;
}
function table(sections, show) {
  const marks = []; marks.push_ = (m) => marks.push(m);
  const wrap = figma.createAutoLayout("VERTICAL", { name: "Data table" });
  num(wrap, "itemSpacing", "gap"); wrap.fills = [];
  if (sections.includes("toolbar")) wrap.appendChild(toolbar(marks));
  const head = sections.includes("table") || sections.includes("header");
  const picked = sections.includes("table") ? SPEC.drawing.rows : sections.filter((x) => x.startsWith("row:")).map((x) => SPEC.drawing.rows[+x.split(":")[1]]);
  if (head || picked.length) {
    const fr = figma.createAutoLayout("VERTICAL", { name: "Table" });
    fr.resize(560, 10); fr.primaryAxisSizingMode = "AUTO"; fr.counterAxisSizingMode = "FIXED";
    fr.fills = [paint("frameFill")]; fr.strokes = [paint("frameBorder")];
    for (const w of SIDES) num(fr, w, "frameBorderWidth");
    for (const c of CORNERS) num(fr, c, "frameRadius");
    fr.clipsContent = true;
    if (head) { const h = trow([], { head: true }, null, Object.assign({ push_: (m) => marks.push(m) }, SPEC.drawing.header)); fr.appendChild(h); h.layoutSizingHorizontal = "FILL"; }
    for (const rw of picked) {
      // The select box is numbered on the header when the header is drawn, else on its own row.
      const m = Object.assign({ push_: (x) => marks.push(x) }, rw.marks ?? {}, head ? { check: undefined } : {});
      const r = trow(rw.cells, { state: rw.state, checked: rw.checked }, m);
      fr.appendChild(r); r.layoutSizingHorizontal = "FILL";
    }
    wrap.appendChild(fr);
  }
  return { node: wrap, marks: marks.filter(([n]) => !show || show.has(n)) };
}
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
  const placed = [];
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
    while (placed.some(([px, py]) => Math.abs(px - pos[0]) < 18 && Math.abs(py - pos[1]) < 18)) pos[0] += 20;
    placed.push([pos[0], pos[1]]);
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
const draw = (c, show) => {
  if (SPEC.recipe === "table") return table(c ? c.image?.sections ?? [] : ["toolbar", "table"], show);
  if (!c) return menu(SPEC.drawing.rows, null, true);
  const rows = c.image?.row
    ? [{ ...SPEC.drawing.rows.find((r) => r.label === c.image.row), state: undefined, marks: c.image.marks }]
    : c.parts.some((n) => (SPEC.drawing.surface ?? []).includes(n) || (SPEC.drawing.shadow ?? []).includes(n))
      ? SPEC.drawing.rows
      : SPEC.drawing.rows.filter((r) => Object.values(r.marks ?? {}).some((n) => show.has(n)));
  return menu(rows, show, rows === SPEC.drawing.rows);
};
const stage = plate(`${SPEC.component}/${SPEC.scheme}/stage`, draw(null, null), 360);
stage.x = 0; stage.y = 0;
const ids = { page: page.id, stage: stage.id, cards: [] };
let x = stage.width + 64;
SPEC.cards.forEach((c, i) => {
  const f = plate(`${SPEC.component}/${SPEC.scheme}/card-${i + 1}`, draw(c, new Set(c.parts)), 280);
  f.x = x; f.y = 0;
  x += f.width + 32;
  ids.cards.push(f.id);
});
void all;
return { ids, bound: report.bound, fallback: report.fallback };
}
