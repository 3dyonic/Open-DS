// OD-294: shape, line width and elevation, as decisions and relations. Writes to the grammar the
// reason form, the jobs of each property (corner, line width, focus ring, shadow), the relation each
// token follows and the trace rules; writes to each scheme its relation records and a reason in the
// form for every radius, border-width and elevation value, in every brand and mode. Changes no value.
// Idempotent: run it again and nothing changes.
//
//   node scripts/od-294-shape.mjs
import { grammar as loadGrammar, loadScheme, saveGrammar, saveScheme } from "../cli/src/schemes.mjs";
import { REASONS } from "./od-294-shape-reasons.mjs";

const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];

const REASON_FORM = {
  description:
    "Every reason in every scope takes this form, so a reader learns the job, how the property does it, what people get and which decision sets it.",
  form: "We use <value> for <role> in order to <job>. The <property> does this by <how it works>. So <what people get>, because <the decision in words> (<answer ids>).",
  from_above:
    "A value set from above names its mechanism in the job part: the scale it is a step of, the relation it follows, or the value it inherits.",
  parts: [
    { id: "job", marker: "in order to", says: "The job the value does, named from its property's jobs." },
    { id: "how", marker: "does this by", says: "How the property itself does that job." },
    { id: "effect", marker: "so", says: "What people get from it." },
    { id: "decision", marker: "because", says: "The decision in words; the reason's because list cites the answer ids." },
  ],
};

const SHAPE_PROPERTIES = [
  {
    id: "corner",
    title: "Corner",
    description: "The radius of a box's corners.",
    tokens: ["radius.*"],
    works_by: "the curvature of the edge",
    jobs: [
      {
        id: "role",
        description: "A corner helps say what a thing is: a control, a status or a container.",
        how: "Each kind keeps one corner, so people learn it. Shape is a second cue: pair it with size, color or words.",
        source: "Material Design, the shape README: shapes identify components.",
      },
      {
        id: "tone",
        description: "A corner carries the brand's feel. Sharp for precise, soft for calm and a pill for playful is brand convention, not research.",
        how: "People prefer curved outlines, and sharp angles can read as a threat; the brand picks a curve for its feel.",
        source: "Bar and Neta 2006, Humans prefer curved visual objects, Psychological Science 17(8). The three labels are brand convention.",
      },
      {
        id: "objects",
        description: "A corner decides whether touching shapes read as separate objects (rounded) or as cells of one grid (square). A corner does not group: a shared fill or border groups.",
        how: "A rounded corner breaks the outline, so touching shapes read apart; square corners meet and tile into one grid.",
        source: "Palmer and Rock 1994, uniform connectedness; Wagemans et al. 2012. Grouping is common region (Palmer 1992), a job of fill and border.",
      },
      {
        id: "density",
        description: "Square corners align in dense rows; a large corner needs room, because the padding must be at least the radius.",
        how: "A small curve keeps long straight edges that line up; a large curve cuts into the content box.",
        source: "Cloud Four, The math behind nesting rounded corners.",
      },
      {
        id: "nesting",
        description: "An inner corner is the outer corner minus the padding, never under zero, so the shapes read as one family.",
        how: "The inner curve follows the outer curve at the padding's distance, so the two edges stay concentric.",
        source: "Cloud Four, The math behind nesting rounded corners; Apple's concentric corners.",
      },
      {
        id: "concentric",
        description: "The focus ring's corner is the control's corner plus the ring's offset, so the ring runs parallel to the control.",
        how: "The same nesting rule, applied outward: the outer curve is the inner curve plus the gap.",
        source: "Cloud Four, The math behind nesting rounded corners, applied outward.",
      },
    ],
  },
  {
    id: "line",
    title: "Line width",
    description: "The weight of the default border and divider. Its contrast lives in the color tokens.",
    tokens: ["border-width.default"],
    works_by: "the weight and contrast of a stroke",
    jobs: [
      {
        id: "separation",
        description: "A divider tells the eye where one region ends and the next starts. It decorates, so it has no contrast floor; space can often do the job instead.",
        how: "A stroke between two regions breaks the surface, and its weight sets how strong the break reads.",
        source: "WCAG 2.2, 1.4.11 Non-text Contrast: decoration is exempt.",
      },
      {
        id: "grouping",
        description: "A border around a region groups what it holds.",
        how: "A closed stroke draws a shared region, and the eye takes what is inside as one group.",
        source: "Palmer 1992, common region.",
      },
      {
        id: "boundary",
        description: "Where the edge is the only sign that a control exists, the line must be seen: 3:1 against the colors next to it.",
        how: "A stroke around the control marks its edge; its color sets the contrast and its weight how easy the edge is to find.",
        source: "WCAG 2.2, 1.4.11 Non-text Contrast (AA): 3:1.",
      },
    ],
  },
  {
    id: "focus-ring",
    title: "Focus ring",
    description: "The ring around the control that has keyboard focus, and the gap between them.",
    tokens: ["border-width.focus", "border-width.focus-offset"],
    works_by: "a heavier stroke with a gap",
    jobs: [
      {
        id: "focus",
        description: "The ring shows where the keyboard is, on any surface.",
        how: "A stroke one step heavier than the default line stands out from every border. The gap shows the page color between ring and control, so with two colors one keeps 3:1 against any fill.",
        source: "WCAG 2.2, 2.4.7 and 2.4.13; W3C technique C40, two-color focus indicator.",
      },
    ],
  },
];

// The component colors whose edge is the only sign of a control (OD-294 research): each needs 3:1.
const BOUNDARIES = [
  "component.combobox.input.border",
  "component.item.outline.border",
  "component.sidebar.menu-button.outline.border.@",
  "component.tabs.list.border",
];

const SHAPE_RELATIONS = [
  {
    id: "control-corner",
    tokens: ["radius.control"],
    check: "decided",
    follows: ["shape.values", "brand.q1", "content.q2"],
    jobs: ["role", "tone", "density"],
    says: "A decision: the corner answer says how controls look, the brand's feel sets the tone, and the density answer says how much room a corner gets.",
  },
  {
    id: "surface-corner",
    tokens: ["radius.surface"],
    check: "decided",
    follows: ["shape.roles", "shape.count", "brand.q1"],
    jobs: ["objects", "tone"],
    count: { question: "shape.count", tokens: ["radius.control", "radius.badge", "radius.surface"], options: { two: 2, three: 3 } },
    says: "A decision: the roles and count answers give containers their own corner, and the brand's feel sets its size. Control, badge and surface make as many sizes as the count answer names.",
  },
  {
    id: "option-nests",
    tokens: ["radius.option"],
    check: "minus",
    follows: ["shape.roles", "shape.count", "brand.q1", "spacing.values"],
    jobs: ["nesting"],
    says: "Derived: the surface corner minus the panel's padding, never under zero, so an option's corner stays concentric with its menu's.",
  },
  {
    id: "element-box",
    tokens: ["radius.element"],
    check: "equal-unless-pill",
    follows: ["shape.values", "brand.q1", "content.q2"],
    jobs: ["objects", "role"],
    says: "Derived: the control corner, or the box corner when the control corner is a pill, because a box that grows cannot stay a pill.",
  },
  {
    id: "badge-corner",
    tokens: ["radius.badge"],
    check: "equal-or-own",
    own_when: { question: "shape.roles", options: ["control-badge-container"] },
    follows: ["shape.roles", "shape.values", "brand.q1"],
    jobs: ["role"],
    says: "Derived: the control corner, unless the roles answer gives badges a corner of their own.",
  },
  {
    id: "default-line",
    tokens: ["border-width.default"],
    check: "decided",
    follows: ["elevation.definition", "accessibility.definition"],
    jobs: ["separation", "grouping", "boundary"],
    boundaries: BOUNDARIES,
    floor: 3,
    says: "A decision: the layering answer says whether lines separate groups, and the contrast floor says how heavy a line must be to be seen. A divider has no contrast floor; a line that is a control's only edge needs 3:1, so the boundaries listed here are checked.",
  },
  {
    id: "focus-heavier",
    tokens: ["border-width.focus"],
    check: "next-step",
    follows: ["accessibility.roles", "elevation.definition", "accessibility.definition"],
    jobs: ["focus"],
    says: "Derived: one step heavier than the default line, so the ring stands out from every border. Focus is a state with its own look (accessibility.roles).",
  },
  {
    id: "focus-gap",
    tokens: ["border-width.focus-offset"],
    check: "fixed",
    equals: "2px",
    follows: ["accessibility.roles"],
    jobs: ["focus"],
    says: "Fixed: a 2px gap between the control and its ring in every scheme. The gap is for contrast, not style: it shows the page color between ring and control, so one of the two colors keeps 3:1 on any fill (W3C technique C40).",
  },
];

const ELEVATION_PROPERTIES = [
  {
    id: "shadow",
    title: "Shadow",
    description: "The shade a layer casts on what is under it.",
    tokens: ["elevation.*"],
    works_by: "the offset and blur of a cast shade",
    jobs: [
      {
        id: "height",
        description: "A shadow shows how high a layer sits: one scale by layer.",
        how: "The eye assumes light from above, so a darker blurred area under an edge reads as raised; a larger offset and blur read as higher.",
        source: "Ramachandran 1988, Perception of shape from shading, Nature 331; Kleffner and Ramachandran 1992.",
      },
      {
        id: "floating",
        description: "A shadow marks a layer that floats for a while above the page: a menu, a dialog or a toast.",
        how: "A cast shade under the edge separates the layer from what is under it, even where the two have the same fill.",
        source: "Material Design, elevation.",
      },
    ],
  },
];

const ELEVATION_RELATIONS = [
  {
    id: "layer-step",
    tokens: ["elevation.card", "elevation.overlay"],
    check: "layer-step",
    by_answer: {
      question: "elevation.roles",
      options: { "floating-only": ["elevation.overlay"], "cards-too": ["elevation.card", "elevation.overlay"], nothing: [] },
    },
    steps: { "elevation.card": 1, "elevation.overlay": 2 },
    follows: ["elevation.roles", "elevation.values"],
    jobs: ["height", "floating"],
    says: "One scale by layer: each layer the roles answer names takes one step up, card step 1 and overlay step 2. The values answer sets the size of a step. A layer the roles answer leaves out casts no shadow.",
  },
  {
    id: "dark-shade",
    tokens: ["elevation.card", "elevation.overlay"],
    check: "dark-same-shape",
    depth: { raised: "color.surface.raised", base: "color.surface.default", sunken: "color.surface.sunken" },
    follows: ["elevation.roles", "elevation.values", "theming.values"],
    jobs: ["height", "floating"],
    says: "Decided: dark keeps the light shape (offset and blur); only the strength changes, set by the dark surface the shade falls on so that it stays visible. Beside it, an open finding: shadows are hard to see on dark surfaces, and Material shows height in dark mode with lighter surfaces. The check reports where a raised surface is not lighter than the base, or a sunken one is not darker.",
  },
];


const TRACE = [
  { tokens: ["radius.control"], follows: ["shape.values", "brand.q1", "content.q2"], says: "The control corner is a decision: the corner answer, the brand's feel (tone) and the density answer." },
  { tokens: ["radius.surface"], follows: ["shape.roles", "shape.count", "brand.q1"], says: "The surface corner is a decision: the roles and count answers give containers their own corner, so touching cards read as separate objects, and the brand's feel sets its size (tone)." },
  { tokens: ["radius.option"], follows: ["shape.roles", "shape.count", "brand.q1", "spacing.values"], says: "An option's corner is the surface corner minus the panel's padding (nesting), so it follows the surface's answers and the spacing answer." },
  { tokens: ["radius.element"], follows: ["shape.values", "brand.q1", "content.q2"], says: "A growing box takes the control corner, or the box corner when the control is a pill, so it follows the control corner's answers." },
  { tokens: ["radius.badge"], follows: ["shape.roles", "shape.values", "brand.q1"], says: "A badge takes the control corner unless the roles answer gives badges their own corner." },
  { tokens: ["border-width.default"], follows: ["elevation.definition", "accessibility.definition"], says: "The layering answer says whether lines separate groups; the contrast floor says how heavy a line must be to be seen." },
  { tokens: ["border-width.focus"], follows: ["accessibility.roles", "elevation.definition", "accessibility.definition"], says: "Focus is a state with its own look (roles answer); the ring is one step heavier than the default line, so it follows that line's answers too." },
  { tokens: ["border-width.focus-offset"], follows: ["accessibility.roles"], says: "Focus is a state with its own look (roles answer); its gap is a fixed 2px in every scheme, for contrast: the page color between ring and control (W3C technique C40)." },
  { tokens: ["elevation.card", "elevation.overlay"], follows: ["elevation.roles", "elevation.values"], says: "The roles answer names the layers that rise, each one step up the scale; the values answer sets the size of a step." },
];

// Where a scope's new parts sit: after its questions, before its hints.
function withParts(scope, parts) {
  const out = {};
  for (const [k, v] of Object.entries(scope)) {
    if (k === "properties" || k === "relations") continue;
    if (k === "hints") Object.assign(out, parts);
    out[k] = v;
  }
  if (!("hints" in scope)) Object.assign(out, parts);
  return out;
}

const g = loadGrammar();
const ordered = {};
for (const [k, v] of Object.entries(g)) {
  if (k === "reason_form") continue;
  if (k === "trace") ordered.reason_form = REASON_FORM;
  ordered[k] = v;
}
ordered.scopes = ordered.scopes.map((s) =>
  s.id === "shape"
    ? withParts(s, { properties: SHAPE_PROPERTIES, relations: SHAPE_RELATIONS })
    : s.id === "elevation"
      ? withParts(s, { properties: ELEVATION_PROPERTIES, relations: ELEVATION_RELATIONS })
      : s,
);
// The new rules replace any rule for the same tokens, at the place of the first one they replace;
// the other rules keep their place.
const named = new Set(TRACE.flatMap((r) => r.tokens));
const replaced = (r) => r.tokens.some((t) => named.has(t));
const at = ordered.trace.findIndex(replaced);
const kept = ordered.trace.filter((r) => !replaced(r));
const cut = at < 0 ? kept.length : ordered.trace.slice(0, at).filter((r) => !replaced(r)).length;
ordered.trace = [...kept.slice(0, cut), ...TRACE, ...kept.slice(cut)];
saveGrammar(ordered);

// Each scheme's records: the decided corners, the derived relations with their inputs, the line
// widths and the shadow scale. The panel's padding is the menu panel's (dropdown-menu/content/padding).
const records = (box) => [
  { token: "radius.control", relation: "control-corner" },
  { token: "radius.surface", relation: "surface-corner" },
  { token: "radius.option", relation: "option-nests", from: "radius.surface", minus: "component.dropdown-menu.content.padding" },
  { token: "radius.element", relation: "element-box", from: "radius.control", ...(box ? { box } : {}) },
  { token: "radius.badge", relation: "badge-corner", from: "radius.control" },
  { token: "border-width.default", relation: "default-line" },
  { token: "border-width.focus", relation: "focus-heavier", from: "border-width.default" },
  { token: "border-width.focus-offset", relation: "focus-gap" },
  { token: "elevation.card", relation: "layer-step" },
  { token: "elevation.overlay", relation: "layer-step" },
  { token: "elevation.card", relation: "dark-shade", on: "color.surface.canvas" },
  { token: "elevation.overlay", relation: "dark-shade", on: "color.surface.default" },
];
// The box corner today: the corner a growing box takes where the control corner is a pill.
const BOX = { "brand-expressive": "radius.12", "multi-brand": "radius.12" };

const od = (node) => ((node.$extensions ??= {})["open-ds"] ??= {});
for (const id of SCHEMES) {
  const s = loadScheme(id);
  const ordered = {};
  for (const [k, v] of Object.entries(s)) {
    if (k === "relations") continue;
    if (k === "usage") ordered.relations = records(BOX[id]);
    ordered[k] = v;
  }
  const reasons = REASONS[id];
  // Theme picks, in every brand and mode.
  for (const [brand, def] of Object.entries(ordered.tokens.brands))
    for (const [mode, theme] of Object.entries(def.theme)) {
      if (mode.startsWith("$")) continue;
      for (const group of ["radius", "elevation"])
        for (const [leaf, node] of Object.entries(theme[group] ?? {})) {
          const r = reasons.picks?.[`${brand}/${mode}/${group}.${leaf}`];
          if (!r) throw new Error(`${id}: no reason for ${brand}/${mode}/${group}.${leaf}`);
          const ext = od(node);
          ext.why = `${String(node.$value).slice(1, -1)}: ${r.why}`;
          ext.because = r.because;
          delete ext.generated;
        }
    }
  // The tokens' own reasons: border-width has no theme pick.
  for (const [leaf, node] of Object.entries(ordered.tokens.semantic["border-width"])) {
    const r = reasons.own?.[`border-width.${leaf}`];
    if (!r) throw new Error(`${id}: no reason for border-width.${leaf}`);
    Object.assign(od(node), { why: r.why, because: r.because });
  }
  saveScheme(ordered);
}
console.log(`Wrote the grammar's shape and elevation records and ${SCHEMES.length} schemes' relations and reasons.`);
