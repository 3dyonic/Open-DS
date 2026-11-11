// The anatomy generator's renderer (OD-229). renderAnatomy(SPEC, kit) draws one component's stage and
// one frame per card on the page "Anatomy / <component>", binds every drawn property to the first kit
// variable in its chain, and reports what it bound and what fell back to the scheme's value (missing in
// the kit). It reads the published kit's variables and never edits the kit. loadKit reads them once.
// Plugins have no figma.createAutoLayout (the Figma MCP adds it), so the renderer brings its own.
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
// The kit's variables. The library is found by its name; if the published file's name differs a little
// (spacing, dots, case), by the scheme's name and "kit". kitLibraries lists what the file can see.
const norm = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
async function kitLibraries() {
  return [...new Set((await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()).map((c) => c.libraryName))];
}
async function loadKit(library) {
  const vars = new Map();
  const all = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const scheme = norm(library).replace(/^open ds /, "").replace(/ figma kit$/, "");
  let mine = all.filter((c) => c.libraryName === library);
  if (!mine.length) mine = all.filter((c) => norm(c.libraryName) === norm(library));
  if (!mine.length) mine = all.filter((c) => norm(c.libraryName).includes(scheme) && norm(c.libraryName).includes("kit"));
  for (const c of mine)
    for (const v of await figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key)) vars.set(`${c.name}/${v.name}`, v.key);
  if (vars.size) return vars;
  // No library variables reach this file: use the file's own Semantic and Component collections, as in
  // the kit file itself. A local variable is named "local:<id>" and read by id, not imported by key.
  for (const c of await figma.variables.getLocalVariableCollectionsAsync()) {
    if (!["Semantic", "Component"].includes(c.name)) continue;
    for (const id of c.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(id);
      if (v) vars.set(`${c.name}/${v.name}`, `local:${v.id}`);
    }
  }
  return vars;
}
async function renderAnatomy(SPEC, vars) {
const report = { bound: {}, fallback: {}, stale: {}, crops: [] };
const imported = new Map();
// A published kit can lag the scheme: a variable still aliases an older decision (a trigger corner on
// radius-control after it moved to radius-element). Read what the kit variable gives, and skip it when
// it differs from the scheme's value; the next variable in the chain, or the scheme's value, draws.
const probe = figma.createRectangle();
probe.name = "Open DS kit probe";
const kitValue = (v) => {
  try { return v.resolveForConsumer(probe).value; } catch (e) { return undefined; }
};
const differs = (kit, want) => {
  if (kit === undefined || want === undefined || want === null) return false;
  if (typeof want === "number") return Number.isFinite(want) && typeof kit === "number" && Math.abs(kit - want) > 0.5;
  if (typeof want === "object" && "r" in want && kit && typeof kit === "object" && "r" in kit)
    return ["r", "g", "b"].some((c) => Math.abs(kit[c] - want[c]) > 0.01);
  return false;
};
async function kitVar(role) {
  const b = SPEC.bind[role];
  for (const n of b.kit) {
    const key = vars.get(n);
    if (!key) continue;
    if (!imported.has(key))
      imported.set(key, key.startsWith("local:") ? await figma.variables.getVariableByIdAsync(key.slice(6)) : await figma.variables.importVariableByKeyAsync(key));
    const kit = kitValue(imported.get(key));
    if (differs(kit, b.value)) {
      report.stale[role] = `${n} gives ${typeof kit === "number" ? kit : JSON.stringify(kit)}; the scheme says ${typeof b.value === "number" ? b.value : JSON.stringify(b.value)}. Republish the kit.`;
      continue;
    }
    report.bound[role] = n;
    return imported.get(key);
  }
  // Shadows are effect styles in the kits, not variables: drawn from the scheme's value, not missing.
  if (b.kind !== "shadow" && !report.stale[role]) report.fallback[role] = `${b.path} (kit has none of: ${b.kit.join(", ") || "-"})`;
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
// The scheme's family when this computer has it; otherwise Inter, and the report says so.
const ALL_FONTS = await figma.listAvailableFontsAsync();
const wanted = String(V.font.value ?? "Inter").split(",")[0].replace(/["']/g, "").trim();
const hasFamily = (f) => ALL_FONTS.some((x) => x.fontName.family === f);
const family = hasFamily(wanted) ? wanted : "Inter";
if (family !== wanted) report.fallback.font = `${wanted} is not installed here; drawn in Inter`;
const faces = ALL_FONTS.filter((f) => f.fontName.family === family).map((f) => f.fontName.style);
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
  const panel = createAutoLayout("VERTICAL", { name: "Menu" });
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
      const wrap = createAutoLayout("VERTICAL", { name: "Separator" });
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
    const row = createAutoLayout("HORIZONTAL", { name: `Item · ${r.label}` });
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
  return { node: panel, marks: marks.filter(([n]) => !show || show.has(n)), all: marks };
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
  const r = createAutoLayout("HORIZONTAL", { name: head ? "Header row" : `Row · ${cells[0]}` });
  r.counterAxisAlignItems = "CENTER";
  num(r, "minHeight", "rowHeight");
  r.fills = head ? [paint("headFill")] : opts.state === "highlight" ? [paint("highlight")] : opts.state === "selected" ? [paint("selected")] : [];
  r.strokes = [paint("rowBorder")]; r.strokeTopWeight = 0; r.strokeLeftWeight = 0; r.strokeRightWeight = 0; r.strokeBottomWeight = 1;
  if (opts.state === "selected") {
    r.effects = [{ type: "INNER_SHADOW", color: { ...V.edge.value, a: 1 }, offset: { x: V.edgeWidth.value || 2, y: 0 }, radius: 0, spread: 0, visible: true, blendMode: "NORMAL" }];
  }
  const chk = createAutoLayout("HORIZONTAL", { name: "Check cell" });
  num(chk, "paddingLeft", "cellPaddingX"); num(chk, "paddingRight", "cellPaddingX"); chk.fills = [];
  const b = box(!!opts.checked); chk.appendChild(b); r.appendChild(chk);
  if (marks?.check) marks.push_([marks.check, b, "top"]);
  if (head && headMarks?.check) headMarks.push_([headMarks.check, b, "top"]);
  SPEC.drawing.columns.forEach((col, k) => {
    const c = createAutoLayout("HORIZONTAL", { name: `Cell · ${col.label}` });
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
  const bar = createAutoLayout("HORIZONTAL", { name: "Toolbar" });
  bar.counterAxisAlignItems = "CENTER"; bar.itemSpacing = 8; bar.fills = [];
  for (const t of SPEC.drawing.toolbar) {
    let n;
    if (t.kind === "search") {
      n = createAutoLayout("HORIZONTAL", { name: "Search field" });
      n.counterAxisAlignItems = "CENTER"; n.itemSpacing = 6;
      num(n, "minHeight", "inputHeight"); num(n, "paddingLeft", "inputPaddingX"); num(n, "paddingRight", "inputPaddingX");
      for (const c of CORNERS) num(n, c, "inputRadius");
      n.fills = [paint("inputFill")]; n.strokes = [paint("inputBorder")]; n.strokeWeight = 1;
      n.appendChild(svg("search", "iconSize", "inputPlaceholder"));
      n.appendChild(cellText(t.label, false, "inputPlaceholder", "inputFontSize"));
    } else if (t.kind === "button") {
      n = createAutoLayout("HORIZONTAL", { name: `Button · ${t.label}` });
      n.counterAxisAlignItems = "CENTER"; n.itemSpacing = 6;
      num(n, "minHeight", "btnHeight"); num(n, "paddingLeft", "btnPaddingX"); num(n, "paddingRight", "btnPaddingX");
      for (const c of CORNERS) num(n, c, "btnRadius");
      n.fills = [paint("btnFill")]; n.strokes = [paint("btnBorder")]; n.strokeWeight = 1;
      if (t.icon) n.appendChild(svg(t.icon, "iconSize", "btnLabel"));
      n.appendChild(cellText(t.label, false, "btnLabel", "btnFontSize"));
    } else if (t.kind === "count") {
      n = cellText(t.label, false, "count", "cellSize");
    } else {
      n = createAutoLayout("HORIZONTAL", { name: "Density switch" });
      n.fills = []; n.strokes = [paint("btnBorder")]; n.strokeWeight = 1;
      for (const c of CORNERS) num(n, c, "toggleRadius");
      t.options.forEach((o, k) => {
        const seg = createAutoLayout("HORIZONTAL", { name: o });
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
  const wrap = createAutoLayout("VERTICAL", { name: "Data table" });
  num(wrap, "itemSpacing", "gap"); wrap.fills = [];
  if (sections.includes("toolbar")) wrap.appendChild(toolbar(marks));
  const head = sections.includes("table") || sections.includes("header");
  const picked = sections.includes("table") ? SPEC.drawing.rows : sections.filter((x) => x.startsWith("row:")).map((x) => SPEC.drawing.rows[+x.split(":")[1]]);
  if (head || picked.length) {
    const fr = createAutoLayout("VERTICAL", { name: "Table" });
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
  return { node: wrap, marks: marks.filter(([n]) => !show || show.has(n)), all: marks };
}

// The tree recipe: any component, drawn from a tree of nodes in its parts layer. Every look a node has
// names a token (a key into SPEC.bind) or is a plain number; n numbers the part the node shows.
const setN = (node, prop, ref) => {
  if (ref === undefined || ref === null) return;
  if (typeof ref === "number") {
    if (prop === "height") node.resize(node.width, Math.max(ref, 0.01));
    else if (prop === "width") node.resize(Math.max(ref, 0.01), node.height);
    else node[prop] = ref;
  } else num(node, prop, ref);
};
const SIDE = { top: "strokeTopWeight", bottom: "strokeBottomWeight", left: "strokeLeftWeight", right: "strokeRightWeight" };
// A weight is "bold" or a weight token (600 and up draws the semibold face).
const isBold = (w) => w === "bold" || (w && w !== "regular" && Number(V[w]?.value) >= 600);
// Figma nodes take no properties of their own, so what the tree said about each node is kept here.
const META = new Map();
const RINGFILL = new Set();
function tnode(d, out, show) {
  let node;
  if (d.t === "text") {
    const t = figma.createText();
    t.fontName = d.font ? fontOf(d.font, isBold(d.weight) ? "bold" : "") : isBold(d.weight) ? BOLD : FONT;
    t.characters = String(d.text ?? "");
    setN(t, "fontSize", d.size ?? 14);
    // Line height: a ratio token (1.5) is a percent; a length is pixels and binds to the kit.
    if (d.lh !== undefined) {
      const lh = typeof d.lh === "number" ? d.lh : V[d.lh]?.value;
      if (typeof lh === "number") t.lineHeight = lh < 4 ? { unit: "PERCENT", value: lh * 100 } : { unit: "PIXELS", value: lh };
      if (typeof d.lh === "string" && V[d.lh]?.v && !(lh < 4)) t.setBoundVariable("lineHeight", V[d.lh].v);
    }
    t.fills = [d.color ? paint(d.color) : paint("__ink")];
    if (d.align === "end") t.textAlignHorizontal = "RIGHT";
    if (d.align === "center") t.textAlignHorizontal = "CENTER";
    node = t;
  } else if (d.t === "icon") {
    node = figma.createNodeFromSvg(SPEC.icons[d.icon]);
    node.name = `icon/${d.icon}`;
    const sz = typeof d.size === "number" ? d.size : V[d.size]?.value || 16;
    node.resize(sz, sz);
    for (const vec of node.findAll((x) => "strokes" in x && x.strokes.length)) vec.strokes = [d.color ? paint(d.color) : paint("__ink")];
  } else {
    const auto = d.t !== "rect" && d.t !== "ellipse" && d.layout !== "none";
    node = d.t === "ellipse" ? figma.createEllipse() : auto ? createAutoLayout(d.layout === "col" ? "VERTICAL" : "HORIZONTAL") : d.t === "rect" ? figma.createRectangle() : figma.createFrame();
    if (!auto && node.type === "FRAME") node.resize(10, 10);
    node.fills = d.fill ? [paint(d.fill, d.fillOpacity)] : [];
    if (auto) {
      node.counterAxisAlignItems = { center: "CENTER", end: "MAX", start: "MIN", baseline: d.layout === "col" ? "MIN" : "BASELINE" }[d.align ?? "center"] ?? "CENTER";
      if (d.justify) node.primaryAxisAlignItems = { center: "CENTER", end: "MAX", between: "SPACE_BETWEEN", start: "MIN" }[d.justify];
      setN(node, "itemSpacing", d.gap);
      const [py, px] = Array.isArray(d.pad) ? d.pad : [d.pad, d.pad];
      setN(node, "paddingTop", d.padT ?? d.padY ?? py); setN(node, "paddingBottom", d.padB ?? d.padY ?? py);
      setN(node, "paddingLeft", d.padL ?? d.padX ?? px); setN(node, "paddingRight", d.padR ?? d.padX ?? px);
      setN(node, "minHeight", d.minH); setN(node, "minWidth", d.minW);
    }
    // corners limits the radius, e.g. ["tl", "tr"] for a panel that opens from the bottom.
    const CN = { tl: "topLeftRadius", tr: "topRightRadius", bl: "bottomLeftRadius", br: "bottomRightRadius" };
    if (d.radius !== undefined) for (const [k, c] of Object.entries(CN)) if (node.type !== "ELLIPSE" && (!d.corners || d.corners.includes(k))) setN(node, c, d.radius);
    if (d.stroke) {
      node.strokes = [paint(d.stroke)];
      node.strokeAlign = d.strokeAlign === "outside" ? "OUTSIDE" : d.strokeAlign === "center" ? "CENTER" : "INSIDE";
      if (d.dash) node.dashPattern = d.dash;
      const sides = d.sides ?? ["top", "bottom", "left", "right"];
      if (node.type === "ELLIPSE") setN(node, "strokeWeight", d.strokeW ?? 1);
      else for (const [k, prop] of Object.entries(SIDE)) sides.includes(k) ? setN(node, prop, d.strokeW ?? 1) : (node[prop] = 0);
    }
    if (d.shadow) node.effects = shadow(V[d.shadow]?.value);
    if (d.clip) node.clipsContent = true;
    for (const c of d.children ?? []) {
      const k = tnode(c, out, show);
      node.appendChild(k);
      // Placed by x and y: inside auto layout it steps out of the flow; a plain frame places it as is.
      if (c.abs) { if (node.layoutMode && node.layoutMode !== "NONE") k.layoutPositioning = "ABSOLUTE"; k.x = c.abs[0]; k.y = c.abs[1]; }
    }
  }
  node.name = d.name ?? d.id ?? node.name;
  if (d.w !== undefined && d.w !== "fill" && d.w !== "hug") setN(node, "width", d.w);
  if (d.h !== undefined && d.h !== "fill" && d.h !== "hug") setN(node, "height", d.h);
  if (d.opacity !== undefined) setN(node, "opacity", d.opacity);
  // A focus ring: a frame around the node, its offset as padding, its width and color as the stroke.
  if (d.ring) {
    const r = createAutoLayout("HORIZONTAL", { name: "Focus ring" });
    // The gap between the node and the ring shows the offset color, when the decision names one.
    r.fills = d.ring.fill ? [paint(d.ring.fill)] : [];
    for (const k of ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"]) setN(r, k, d.ring.offset ?? 2);
    r.strokes = [paint(d.ring.color)];
    r.strokeAlign = "INSIDE";
    for (const prop of Object.values(SIDE)) setN(r, prop, d.ring.width ?? 2);
    if (d.ring.radius !== undefined) for (const c of CORNERS) setN(r, c, d.ring.radius);
    r.appendChild(node);
    for (const m of [].concat(d.ring.n ?? [])) out.push([m, r, "right"]);
    // A ring around a part that stretches: the ring stretches, and the part fills the ring.
    META.set(r, { w: d.w === "fill" ? "fill" : undefined, grow: d.grow });
    if (d.w === "fill") { r.counterAxisAlignItems = "CENTER"; RINGFILL.add(node); }
    node = r;
  }
  for (const m of [].concat(d.n ?? [])) out.push([m, node, d.at ?? "top"]);
  // marks: more numbers on this node, each at its own place, e.g. [[1, "corner"], [3, "shadow"]].
  for (const [m, at] of d.marks ?? []) out.push([m, node, at ?? "top"]);
  if (!META.has(node)) META.set(node, d);
  return node;
}
// Fill and hug apply once a node sits in its parent; one pass after the tree is built.
function sizeTree(node) {
  const d = META.get(node);
  if (RINGFILL.has(node) && node.parent) node.layoutGrow = 1;
  if (d && node.parent && node.parent.layoutMode && node.parent.layoutMode !== "NONE" && node.layoutPositioning !== "ABSOLUTE") {
    if (d.w === "fill") node.layoutSizingHorizontal = "FILL";
    if (d.h === "fill") node.layoutSizingVertical = "FILL";
    if (d.grow) node.layoutGrow = 1;
  }
  if ("children" in node) for (const c of node.children) sizeTree(c);
}
const fonts = new Map();
const fontOf = (ref, weight) => {
  const k = ref + "|" + (weight ?? "");
  return fonts.get(k) ?? (weight === "bold" ? BOLD : FONT);
};
async function loadTreeFonts(d) {
  const wk = isBold(d.weight) ? "bold" : "";
  if (d.font && !fonts.has(d.font + "|" + wk)) {
    const fam = String(V[d.font]?.value ?? "").split(",")[0].replace(/["']/g, "").trim();
    const st = (await figma.listAvailableFontsAsync()).filter((f) => f.fontName.family === fam).map((f) => f.fontName.style);
    const style = wk ? st.find((x) => /semi ?bold/i.test(x)) ?? st.find((x) => /bold/i.test(x)) : st.find((x) => /^regular$/i.test(x));
    if (st.length) { const f = { family: fam, style: style ?? st[0] }; await figma.loadFontAsync(f); fonts.set(d.font + "|" + wk, f); }
  }
  for (const c of d.children ?? []) await loadTreeFonts(c);
}
function treeDraw(root, show) {
  const marks = [];
  const node = tnode(root, marks, show);
  sizeTree(node);
  return { node, marks: marks.filter(([n]) => !show || show.has(n)), all: marks };
}

// crop: false for the stage; for a card, { context: [part numbers framed with it, not numbered] }.
function plate(name, built, w, crop = false) {
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
  const badges = [];
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
    badges.push(badge);
  }
  void origin;
  // A card is about its own parts (OD-248): it shows the box around its numbered parts and their
  // numbers, with a margin, not the whole stage. Nothing inside is scaled, so every binding to the kit
  // stays; the export draws the card at a larger scale, so the part fills the card in the docs.
  if (crop && built.marks.length) {
    const fb = f.absoluteBoundingBox;
    // The card's own parts, their numbers, and the parts it names as context (image.context): framed
    // with it, not numbered.
    const context = (built.all ?? []).filter(([n]) => crop.context.includes(n)).map(([, node]) => node);
    const boxes = [...built.marks.map(([, node]) => node), ...context, ...badges].map((x) => x.absoluteBoundingBox);
    let x0 = Math.min(...boxes.map((b) => b.x)) - fb.x, y0 = Math.min(...boxes.map((b) => b.y)) - fb.y;
    let x1 = Math.max(...boxes.map((b) => b.x + b.width)) - fb.x, y1 = Math.max(...boxes.map((b) => b.y + b.height)) - fb.y;
    // The margin is the padding the scheme puts inside a card (space.inset.container): the image is a
    // card, so it breathes as the scheme's cards do (16px in Dense data, 32px in Brand expressive). The minimum keeps a one-line part (a separator, a caret) a readable card:
    // room for its number and the margin on each side.
    const M = V.plateMargin.value, MIN_W = 220, MIN_H = 120;
    const [bx0, by0, bx1, by1] = [x0, y0, x1, y1];
    x0 -= M; y0 -= M; x1 += M; y1 += M;
    // Not smaller than a readable card, centered on the parts; never larger than the stage drawn.
    if (x1 - x0 < MIN_W) { const c = (x0 + x1) / 2; x0 = c - MIN_W / 2; x1 = c + MIN_W / 2; }
    if (y1 - y0 < MIN_H) { const c = (y0 + y1) / 2; y0 = c - MIN_H / 2; y1 = c + MIN_H / 2; }
    x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(f.width, x1); y1 = Math.min(f.height, y1);
    report.crops.push({ frame: f.name, focus: [bx1 - bx0, by1 - by0], margin: M, min: [MIN_W, MIN_H] });
    for (const k of f.children) { k.x -= x0; k.y -= y0; }
    f.resize(Math.max(1, x1 - x0), Math.max(1, y1 - y0));
    f.clipsContent = true;
  }
  return f;
}

// The page: one per component, rebuilt from scratch each run (only this page is touched).
const pageName = `Anatomy / ${SPEC.component}`;
let page = figma.root.children.find((p) => p.name === pageName);
if (!page) { page = figma.createPage(); page.name = pageName; }
await figma.setCurrentPageAsync(page);
// One page per component holds every scheme: one section per scheme, stacked in scheme order. A run
// replaces only its own scheme's section (and loose frames of that scheme from the old layout).
const ORDER = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
for (const c of [...page.children])
  if ((c.type === "SECTION" && c.name === SPEC.scheme) || c.name.startsWith(`${SPEC.component}/${SPEC.scheme}/`)) c.remove();
const all = new Set(SPEC.parts.map((p) => p.n));
if (SPEC.recipe === "tree") { await loadTreeFonts(SPEC.drawing.stage); for (const c of SPEC.cards) if (c.image?.tree) await loadTreeFonts(c.image.tree); }
const draw = (c, show) => {
  if (SPEC.recipe === "tree") return treeDraw(c?.image?.tree ?? SPEC.drawing.stage, show);
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
const cardFrames = [];
SPEC.cards.forEach((c, i) => {
  const f = plate(`${SPEC.component}/${SPEC.scheme}/card-${i + 1}`, draw(c, new Set(c.parts)), 280, { context: c.image?.context ?? [] });
  f.x = x; f.y = 0;
  x += f.width + 32;
  ids.cards.push(f.id);
  cardFrames.push(f);
});
void all;
// Gather this scheme's frames in its section, then stack the sections in scheme order.
const PAD = 48, GAP = 160;
const section = figma.createSection();
section.name = SPEC.scheme;
const frames = [stage, ...cardFrames];
for (const f of frames) section.appendChild(f);
const w = Math.max(...frames.map((f) => f.x + f.width)), h = Math.max(...frames.map((f) => f.y + f.height));
for (const f of frames) { f.x += PAD; f.y += PAD; }
section.resizeWithoutConstraints(w + 2 * PAD, h + 2 * PAD);
const sections = page.children.filter((c) => c.type === "SECTION").sort((a, b) => (ORDER.indexOf(a.name) + 99) % 99 - (ORDER.indexOf(b.name) + 99) % 99);
let top = 0;
for (const sct of sections) { sct.x = 0; sct.y = top; top += sct.height + GAP; }
// Loose frames from the old layout (other schemes, drawn before sections) go below.
for (const c of page.children) if (c.type !== "SECTION") { c.y = top; top += c.height + GAP; }
probe.remove();
return { ids, bound: report.bound, fallback: report.fallback, stale: report.stale, crops: report.crops };
}
