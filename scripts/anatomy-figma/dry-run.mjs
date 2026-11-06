// Runs the anatomy renderer against a stand-in for the Figma Plugin API, so a drawing can be checked
// without Figma: it must draw without errors, bind every token, place each number once on its part,
// and give every frame a size. Kit variables are taken to exist for every name the chain offers first.
//
//   node scripts/anatomy-figma/dry-run.mjs <component> [scheme]   (ANATOMY_LAYERS works as in build.mjs)
import { anatomySpec, renderer } from "./build.mjs";

let id = 0;
// The node properties the renderer may set (all are Figma's own).
const FIGMA_PROPS = new Set(("name x y fills strokes effects opacity cornerRadius topLeftRadius topRightRadius bottomLeftRadius bottomRightRadius " +
  "strokeWeight strokeTopWeight strokeBottomWeight strokeLeftWeight strokeRightWeight strokeAlign dashPattern clipsContent " +
  "layoutMode primaryAxisSizingMode counterAxisSizingMode primaryAxisAlignItems counterAxisAlignItems itemSpacing " +
  "paddingTop paddingBottom paddingLeft paddingRight minHeight minWidth layoutGrow layoutPositioning layoutSizingHorizontal layoutSizingVertical " +
  "fontName fontSize characters textAlignHorizontal textAlignVertical lineHeight textAutoResize").split(" "));
class Node {
  constructor(type) {
    Object.assign(this, { id: `0:${++id}`, type, name: type, children: [], parent: null, x: 0, y: 0, width: 100, height: 100 });
    Object.assign(this, { fills: [], strokes: [], effects: [], bound: {}, layoutMode: "NONE" });
    // Like Figma's nodes, these take only the properties Figma has: setting any other throws.
    return new Proxy(this, {
      set(t, k, v) {
        if (typeof k === "string" && !(k in t) && !FIGMA_PROPS.has(k)) throw new TypeError(`object is not extensible (${t.name}.${k})`);
        // Figma: baseline alignment only in a row.
        if (k === "counterAxisAlignItems" && v === "BASELINE" && t.layoutMode !== "HORIZONTAL")
          throw new Error(`counterAxisAlignItems BASELINE needs a horizontal layout (${t.name})`);
        // Figma: absolute positioning only inside auto layout.
        if (k === "layoutPositioning" && v === "ABSOLUTE" && (!t.parent || t.parent.layoutMode === "NONE"))
          throw new Error(`in set_layoutPositioning: Can only set layoutPositioning = ABSOLUTE if the parent node has layoutMode !== NONE (${t.name})`);
        t[k] = v;
        return true;
      },
    });
  }
  resize(w, h) {
    if (!(w > 0 && h > 0)) throw new Error(`${this.name}: resize(${w}, ${h})`);
    this.width = w;
    this.height = h;
  }
  appendChild(c) {
    if (c.parent) c.parent.children = c.parent.children.filter((k) => k !== c);
    c.parent = this;
    this.children.push(c);
  }
  remove() {
    if (this.parent) this.parent.children = this.parent.children.filter((k) => k !== this);
  }
  setBoundVariable(prop, v) {
    if (!v) throw new Error(`${this.name}: bind ${prop} to nothing`);
    this.bound[prop] = v.name;
  }
  resizeWithoutConstraints(w, h) {
    this.resize(w, h);
  }
  findOne(f) {
    return this.findAll(f)[0] ?? null;
  }
  findAll(f) {
    const out = [];
    const walk = (n) => n.children.forEach((c) => { if (f(c)) out.push(c); walk(c); });
    walk(this);
    return out;
  }
  // Auto layout sizes: hug what is inside, so absolute boxes are close to Figma's.
  get absoluteBoundingBox() {
    let x = this.x, y = this.y;
    for (let p = this.parent; p && p.type !== "PAGE"; p = p.parent) { x += p.x; y += p.y; }
    return { x, y, width: this.width, height: this.height };
  }
  set characters(t) {
    if (!this.fontName) throw new Error("text without a font");
    this._t = t;
    this.width = Math.max(1, t.length * 7);
    this.height = 16;
  }
  get characters() { return this._t; }
  set layoutSizingHorizontal(v) {
    if (v === "FILL" && (!this.parent || this.parent.layoutMode === "NONE")) throw new Error(`${this.name}: FILL outside auto layout`);
  }
  set layoutSizingVertical(v) {
    if (v === "FILL" && (!this.parent || this.parent.layoutMode === "NONE")) throw new Error(`${this.name}: FILL outside auto layout`);
  }
}
// Lay out auto layout frames (hug, gap, padding) before positions are read.
function layout(n) {
  n.children.forEach(layout);
  if (n.layoutMode === "NONE" || !n.children.length) return;
  const row = n.layoutMode === "HORIZONTAL";
  const pad = (k) => (typeof n[k] === "number" ? n[k] : 0);
  let at = row ? pad("paddingLeft") : pad("paddingTop");
  let cross = 0;
  for (const c of n.children) {
    if (c.layoutPositioning === "ABSOLUTE") continue;
    if (row) { c.x = at; c.y = pad("paddingTop"); at += c.width + (n.itemSpacing || 0); cross = Math.max(cross, c.height); }
    else { c.y = at; c.x = pad("paddingLeft"); at += c.height + (n.itemSpacing || 0); cross = Math.max(cross, c.width); }
  }
  const main = at - (n.itemSpacing || 0) + (row ? pad("paddingRight") : pad("paddingBottom"));
  if (n.primaryAxisSizingMode === "AUTO") row ? (n.width = Math.max(main, n.minWidth || 0)) : (n.height = Math.max(main, n.minHeight || 0));
  if (n.counterAxisSizingMode === "AUTO") row ? (n.height = Math.max(cross + pad("paddingTop") + pad("paddingBottom"), n.minHeight || 0)) : (n.width = cross + pad("paddingLeft") + pad("paddingRight"));
}

// shared: pass the same object to several runs to draw them into one document (as one anatomy file
// holding every scheme).
export async function dryRun(component, scheme = "dense-data", shared = null) {
  const SPEC = anatomySpec(component, scheme);
  const pages = shared ? (shared.pages ??= []) : [];
  const page = () => Object.assign(new Node("PAGE"), { name: "Page 1" });
  const root = { name: "dense-data-Anatomy", children: pages };
  if (!pages.length) pages.push(page());
  const figma = {
    root,
    currentPage: pages[0],
    createPage: () => { const p = page(); pages.push(p); return p; },
    setCurrentPageAsync: async (p) => { figma.currentPage = p; },
    createFrame: () => { const f = new Node("FRAME"); figma.currentPage.appendChild(f); return f; },
    createSection: () => { const f = new Node("SECTION"); figma.currentPage.appendChild(f); return f; },
    createRectangle: () => new Node("RECTANGLE"),
    createEllipse: () => new Node("ELLIPSE"),
    createText: () => new Node("TEXT"),
    createNodeFromSvg: (svg) => {
      if (!/^<svg/.test(svg ?? "")) throw new Error("icon without an svg");
      const n = new Node("FRAME");
      n.appendChild(Object.assign(new Node("VECTOR"), { strokes: [{}] }));
      return n;
    },
    // Every family the scheme names is taken to be installed, with Inter: the dry run checks the drawing.
    listAvailableFontsAsync: async () => {
      const named = Object.values(SPEC.bind).filter((b) => b.kind === "font").map((b) => String(b.value).split(",")[0].replace(/["']/g, "").trim());
      return ["Regular", "SemiBold", "Bold"].flatMap((style) => [...new Set(["Inter", ...named])].map((family) => ({ fontName: { family, style } })));
    },
    loadFontAsync: async () => {},
    teamLibrary: {
      getAvailableLibraryVariableCollectionsAsync: async () => [{ libraryName: SPEC.library, name: "all", key: "k" }],
      // The kit is taken to hold the first name of every chain.
      getVariablesInLibraryCollectionAsync: async () => Object.values(SPEC.bind).filter((b) => b.kit[0]).map((b) => ({ name: b.kit[0].split("/").slice(1).join("/"), key: b.kit[0] })),
    },
    variables: {
      importVariableByKeyAsync: async (key) => ({ name: key }),
      setBoundVariableForPaint: (p, _f, v) => ({ ...p, boundVariables: { color: v.name } }),
    },
  };
  // loadKit names variables "<collection>/<name>"; the stand-in has one collection holding full names.
  const src = renderer().replace("vars.set(`${c.name}/${v.name}`, v.key)", "vars.set(v.key, v.key)");
  // Positions are read inside plate(); lay the drawing out just before.
  // Lay the drawing out before plate() reads positions. If the hook stops matching, fail: without it
  // every position is 0 and the checks below see nothing.
  const hooked = src.replace(/function plate\(([^)]*)\) \{/, (m) => `${m}\n  __layout(built.node);`);
  if (hooked === src) throw new Error("dry run: plate() not found in the renderer; the layout hook does not apply.");
  const run = new Function("figma", "SPEC", "__layout", `return (async () => {\n${hooked}\nreturn await renderAnatomy(SPEC, await loadKit(SPEC.library));\n})();`);
  const result = await run(figma, SPEC, layout);
  // Checks: every number placed once per frame, none on top of another.
  const problems = [];
  const compPage = pages.find((p) => p.name === `Anatomy / ${component}`);
  // The scheme's frames sit in its section on the component's page.
  const section = compPage.children.find((c) => c.type === "SECTION" && c.name === scheme);
  if (!section) throw new Error(`no section ${scheme} on the page`);
  const drawn = section;
  for (const f of drawn.children) {
    const badges = f.children.filter((c) => c.name.startsWith("Number "));
    const seen = new Set();
    for (const b of badges) {
      if (seen.has(b.name)) problems.push(`${f.name}: ${b.name} twice`);
      seen.add(b.name);
      for (const o of badges) if (o !== b && Math.abs(o.x - b.x) < 16 && Math.abs(o.y - b.y) < 16 && b.id < o.id) problems.push(`${f.name}: ${b.name} covers ${o.name}`);
    }
  }
  const card = (i) => drawn.children.find((f) => f.name.endsWith(`card-${i + 1}`));
  SPEC.cards.forEach((c, i) => {
    const names = new Set(card(i).children.filter((k) => k.name.startsWith("Number ")).map((k) => +k.name.slice(7)));
    for (const n of c.parts) if (!names.has(n)) problems.push(`card ${c.title}: part ${n} has no number on the drawing`);
  });
  const stage = drawn.children.find((f) => f.name.endsWith("/stage"));
  // OD-248: a card shows its own parts large. Its frame is the box around its numbered parts, their
  // numbers and its context parts, with the scheme's card padding as margin, or a minimum card.
  SPEC.cards.forEach((c, i) => {
    const f = card(i);
    const crop = result.crops.find((x) => x.frame === f.name);
    if (!crop) return problems.push(`card ${c.title}: not cropped to its parts`);
    const w = Math.max(crop.focus[0] + 2 * crop.margin, crop.min[0]), h = Math.max(crop.focus[1] + 2 * crop.margin, crop.min[1]);
    if (f.width > w + 1 || f.height > h + 1) problems.push(`card ${c.title}: ${Math.round(f.width)}×${Math.round(f.height)} for parts that take ${Math.round(crop.focus[0])}×${Math.round(crop.focus[1])}`);
  });
  const onStage = new Set(stage.children.filter((k) => k.name.startsWith("Number ")).map((k) => +k.name.slice(7)));
  const cardNums = new Set(SPEC.cards.flatMap((c) => c.parts));
  for (const p of SPEC.parts) if (!onStage.has(p.n) && !cardNums.has(p.n)) problems.push(`part ${p.n} ${p.label} is numbered nowhere`);
  return { frames: drawn.children.length, bound: Object.keys(result.bound).length, fallback: result.fallback, problems };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [component, scheme] = process.argv.slice(2);
  const r = await dryRun(component, scheme);
  console.log(JSON.stringify(r, null, 2));
  if (r.problems.length || Object.keys(r.fallback).length) process.exit(1);
}
