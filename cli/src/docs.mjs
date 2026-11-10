// Writes the documentation of a delivered design system: one scheme, as Markdown pages for
// Docusaurus. The docs site (docs/) and `open-ds init --docs` both use this, so a team that takes
// a scheme gets the same pages Open DS builds.

import { decisionReference, lower, sentence } from "./decisions.mjs";
import { cssName, flatTokens, semanticView, themeTokens } from "./tokens.mjs";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { questions } from "./schemes.mjs";
import { SHADCN, SHADCN_SCALE } from "./shadcn.mjs";
import { pairsIn, sitsOn, toneOf, toneRole } from "./tones.mjs";
import { LANES, follow, laneOf, scaleMap } from "./scale-map.mjs";
import { aliasChain, tokenIndex } from "./lands.mjs";
import { spacingGuide } from "./spacing-map.mjs";
import { componentGuide, followers } from "./component.mjs";
import { anatomy, anatomyReference, tokenTrace } from "./anatomy.mjs";

// Which component keys each shipped component reads.
const KEY_GROUP = {
  button: "button",
  input: "input",
  select: "input",
  label: "input",
  checkbox: "control",
  switch: "control",
  badge: "badge",
  card: "card",
  table: "table",
  tabs: "tabs",
  dialog: "overlay",
  "dropdown-menu": "overlay",
  toast: "overlay",
  tooltip: "overlay",
};

// Every page says it is generated in its front matter, not in an HTML comment (OD-284).
const fm = (o) =>
  `---\n${Object.entries({
    generated: "By open-ds from the scheme. Do not edit by hand.",
    ...o,
  })
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n")}\n---\n\n`;
const NOTE = "";
const esc = (s) =>
  String(s)
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .replaceAll("<", "&lt;")
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
const title = (id) =>
  id.charAt(0).toUpperCase() + id.slice(1).replaceAll("-", " ");
const get = (tree, path) =>
  path
    .split(".")
    .reduce((n, p) => (n && typeof n === "object" ? n[p] : undefined), tree);
const isToken = (v) => v && typeof v === "object" && "$value" in v;

function merge(a, b) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b ?? {}))
    out[k] =
      v && typeof v === "object" && !isToken(v) && out[k]
        ? merge(out[k], v)
        : v;
  return out;
}

function leaves(node, path) {
  if (isToken(node))
    return [
      {
        path,
        ref: node.$value,
        type: node.$type,
        description: node.$description,
      },
    ];
  if (!node || typeof node !== "object") return [];
  return Object.entries(node)
    .filter(([k]) => !k.startsWith("$"))
    .flatMap(([k, v]) => leaves(v, `${path}.${k}`));
}

/** The tokens a scope owns in this scheme: semantics, brand primitives, component keys or words. */
function owned(scheme, owns) {
  const t = scheme.tokens;
  const theme = Object.values(t.brands)[0].theme;
  const sources = [
    semanticView(scheme, "light"),
    { theme: merge(theme.base ?? {}, theme.light) },
    { component: t.component },
    { content: t.content },
  ];
  return owns.flatMap((o) => {
    const tree = sources.find((x) => get(x, o) !== undefined);
    return tree ? leaves(get(tree, o), o) : [];
  });
}

const show = (v) =>
  v === undefined
    ? ""
    : typeof v === "string"
      ? v
      : Array.isArray(v)
        ? `cubic-bezier(${v.join(", ")})`
        : typeof v === "object"
          ? Object.values(v).join(" ")
          : String(v);
const px = (v) =>
  /^-?[\d.]+rem$/.test(v) ? `${v} (${Math.round(parseFloat(v) * 16)}px)` : v;

const cssVar = (path) => `var(--${cssName(path)})`;
const cssValue = (v) =>
  Array.isArray(v)
    ? `cubic-bezier(${v.join(",")})`
    : v && typeof v === "object"
      ? [v.offsetX, v.offsetY, v.blur, v.spread, v.color]
          .filter(Boolean)
          .join(" ")
      : String(v);
const attr = (s) => String(s).replaceAll('"', "&quot;");

/** One theme's tokens before resolving: primitives, the brand, the semantics for the mode, component keys. */
function rawTree(scheme, theme) {
  return themeTokens(scheme, theme.brand, theme.mode);
}

/** The aliases a token points through, ending at a primitive. Raw is set when the chain ends in a value. */
function chain(tree, path) {
  const steps = [];
  let at = path;
  for (let i = 0; i < 10; i++) {
    const node = get(tree, at);
    if (!isToken(node)) break;
    const m =
      typeof node.$value === "string" && node.$value.match(/^\{(.+)\}$/);
    if (!m) return { steps, raw: node.$value };
    steps.push(m[1]);
    at = m[1];
  }
  return { steps, raw: undefined };
}

/** A small live sample of a primitive or semantic value, drawn from its CSS variable. */
// The visual blocks (OD-182) are HTML inside Markdown. Docusaurus ends an HTML block at a blank
// line, so each block is written on one line; docs/src/css/visual.css dresses them.
const h = (...parts) => parts.flat().join("");
const STATUS_CLASS = {
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
};
const badgeHtml = (label, meaning) =>
  `<span class="odv-badge odv-t-${STATUS_CLASS[meaning] ?? "neutral"}">${attr(label)}</span>`;
/** WCAG contrast between two hex colors, for the ratios the color page prints. */
function contrast(a, b) {
  const lum = (hex) => {
    const c = String(hex).replace("#", "").slice(0, 6).match(/../g);
    if (!c) return 0;
    const [r, g, bl] = c.map((x) => {
      const v = parseInt(x, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
const ink = (hex) => {
  const c = String(hex).replace("#", "").slice(0, 6);
  return /^[0-9a-f]{6}$/i.test(c) && contrast(`#${c}`, "#000000") > 9
    ? "#000000"
    : "#FFFFFF";
};

// DTCG lets a group carry $type for its tokens; fall back to the path when a token has none.
const primitiveType = (path) =>
  ({
    color: "color",
    shadow: "shadow",
    duration: "duration",
    opacity: "number",
  })[path.split(".")[0]] ??
  (path.startsWith("font.family")
    ? "fontFamily"
    : /^(space|size|radius|border-width|font\.size|font\.line-height)\./.test(
          path,
        )
      ? "dimension"
      : undefined);

// The Primitives section (OD-195): one page per kind of value, in this order.
const PRIMITIVE_PAGES = [
  { id: "color", title: "Color", match: (p) => p.startsWith("color.") },
  {
    id: "space-and-size",
    title: "Space and size",
    match: (p) => /^(space|size)\./.test(p),
  },
  {
    id: "shape",
    title: "Shape",
    match: (p) => /^(radius|border-width)\./.test(p),
  },
  { id: "type", title: "Type", match: (p) => p.startsWith("font.") },
  {
    id: "motion",
    title: "Motion",
    match: (p) => /^(duration|easing)\./.test(p),
  },
  {
    id: "effects",
    title: "Effects",
    match: (p) => /^(opacity|shadow)\./.test(p),
  },
];

// A drawn value as an inline Sample composite (OD-284). Quotes in a value become single quotes, so the
// directive's attribute stays whole.
const draw = (kind, v, extra = "") =>
  `:sample{kind="${kind}" value="${String(v).replace(/"/g, "'")}"${extra}}`;
// A token's value as the facts a drawing needs: what it is (kind), the CSS value, and a note.
function sampleFact(path, type, raw) {
  // Primitives are not CSS variables (only semantic tokens and component keys are), so a primitive's
  // sample draws its own value.
  const value = String(raw === undefined ? cssVar(path) : cssValue(raw)).replace(/"/g, "'");
  const kind = (() => {
    if (type === "color") return "color";
    if (type === "fontFamily") return "font";
    if (type === "fontWeight" || /font[.-]weight/.test(path)) return "weight";
    if (/line-height/.test(path)) return "leading";
    if (/letter/.test(path)) return "tracking";
    if (type === "shadow") return "shadow";
    // Motion plays when you hover it (OD-220): a duration at the standard easing, an easing at a
    // relaxed speed.
    if (type === "duration") return "duration";
    if (type === "cubicBezier") return "easing";
    if (type === "number" && /opacity/.test(path)) return "opacity";
    if (type === "dimension") {
      if (/radius/.test(path)) return "radius";
      if (/border-width/.test(path)) return "line";
      // A type size shows type at that size (OD-217), not a bar.
      if (/font[.-]size/.test(path)) return "size";
      return "bar";
    }
    return null;
  })();
  if (!kind) return null;
  if (kind !== "leading") return { kind, value };
  // A line height, as the line box it makes (OD-221), with that height in px.
  const m = value.match(/^([\d.]+)(rem|px)?$/);
  const px = m ? Math.round(Number(m[1]) * (m[2] === "px" ? 1 : 16)) : "";
  return px ? { kind, value, note: `${px}px` } : { kind, value };
}
function sample(path, type, raw) {
  const f = sampleFact(path, type, raw);
  return f ? draw(f.kind, f.value, f.note ? ` note="${f.note}"` : "") : "";
}

/** The specimen at the top of a foundation page: the scope's semantic tokens, drawn live, as composite data. */
// The type specimen shows each role with its own kind of content (OD-218): headings the screen title,
// running text the scenario, a label the main action, data a number. Values come from the theme.
const ROLE_TEXT = {
  display: (x) => x.smp.screen,
  title: (x) => x.smp.screen,
  heading: (x) => x.smp.card?.title ?? x.smp.screen,
  label: (x) => x.smp.actions?.primary,
  data: (x) => x.smp.metrics?.map((m) => `${m.label} ${m.value}`).join(" · "),
};
function specimen(tokens, text, x = {}) {
  const roles = [
    ...new Set(
      tokens
        .map((t) => t.path.match(/^type\.([a-z-]+)\.font-size$/)?.[1])
        .filter(Boolean),
    ),
  ];
  // Each type role as a line set in its own tokens, with its values (OD-284: the TypeRoles composite).
  // Otherwise each token drawn as its value (the TokenSwatches composite). Returns the composite's data.
  if (roles.length)
    return {
      kind: "type-roles",
      data: {
        roles: roles.map((r) => {
          const p = `type.${r}`;
          const line = (x.smp && ROLE_TEXT[r]?.(x)) || text;
          return {
            role: r,
            text: line,
            ...Object.fromEntries(
              [
                ["size", "font-size"],
                ["lineHeight", "line-height"],
                ["weight", "font-weight"],
              ]
                .map(([k, t]) => [k, x.val?.(`${p}.${t}`)])
                .filter(([, v]) => v),
            ),
          };
        }),
      },
    };
  // Each token by its full name and its DTCG type; the composite draws it from its CSS variable.
  // A line height also carries its pixels, which the page prints beside it.
  const swatches = tokens
    .map((t) => ({ t, f: sampleFact(t.path, t.type) }))
    .filter((x) => x.f)
    .slice(0, 40)
    .map(({ t, f }) => ({
      token: t.path,
      type: t.type,
      ...(f.note && { px: Number(f.note.replace("px", "")) }),
    }));
  return swatches.length ? { kind: "token-swatches", data: { tokens: swatches } } : null;
}

/** The header comment of a component file, as plain text. */
function componentIntro(uiDir, name) {
  const path = join(uiDir, "components", `${name}.tsx`);
  if (!existsSync(path)) return "";
  const m = readFileSync(path, "utf8").match(/^\/\*\*([\s\S]*?)\*\//);
  return m
    ? m[1]
        .split("\n")
        .map((l) => l.replace(/^\s*\* ?/, ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

/**
 * Every page of one scheme's docs, as { "relative/path.md": text }.
 * roots: { tokens, ui } from assetRoots(). storybook: the Storybook URL to link to.
 */
/** Where a tone key sits, in words. */
const toneWords = (id) => {
  const r = toneRole(id);
  return r?.tone === "own"
    ? "The page's own fills"
    : `Fills whose tone is ${r?.tone}`;
};

// The Primitives page each Foundations scope's values are on.
const PRIM_PAGE_OF = {
  color: { id: "color", title: "Color" },
  spacing: { id: "space-and-size", title: "Space and size" },
  typography: { id: "type", title: "Type" },
  shape: { id: "shape", title: "Shape" },
  elevation: { id: "effects", title: "Effects" },
  motion: { id: "motion", title: "Motion" },
};
/**
 * The Themes page's key colors (OD-223): the tokens the grammar names, in every theme, each as the
 * primitive it points at, the neutral step it goes through, and its value. The scheme's gray first.
 */
function themeColors(scheme, g) {
  const t = scheme.tokens;
  const brands = Object.keys(t.brands);
  const kc = g.semantics?.key_colors;
  if (!kc) return "";
  const at = (p) =>
    p.split(".").reduce((n, k) => n && n[k], t.primitive)?.$value;
  const grays = brands
    .map((b) => ({ b, n: t.brands[b].theme.neutral }))
    .filter((x) => x.n);
  const same = new Set(grays.map((x) => x.n.gray)).size === 1;
  const gray = grays.length
    ? (same ? grays.slice(0, 1) : grays)
        .map(
          (x) =>
            `- ${brands.length > 1 ? (same ? "**Every brand**: " : `**${t.brands[x.b].label ?? x.b}**: `) : ""}the neutral is \`${x.n.gray}\` (${x.n.temperature}). ${esc(x.n.why)}`,
        )
        .join("\n") + "\n\n"
    : "";
  const cell = (th, path) => {
    const f = follow(t, th.brand ?? brands[0], th.mode ?? th.id, path);
    if (!f) return "—";
    const v = String(at(f.prim) ?? "")
      .slice(0, 9)
      .toUpperCase();
    return `${draw("tone", v, ` ink="${ink(v)}"`)} \`${f.prim.replace(/^color\./, "")}\` ${f.via ? `via ${f.via.replace(/^color\./, "")} · ` : ""}${v}`;
  };
  return (
    `## Key colors in each theme\n\n${esc(kc.description)} Each shows the primitive it points at, then its value.\n\n` +
    gray +
    `| Token | ${scheme.themes.map((x) => x.id).join(" | ")} |\n| --- | ${scheme.themes.map(() => "---").join(" | ")} |\n` +
    kc.tokens
      .map(
        (p) =>
          `| \`${p.replace(/\.@$/, "")}\` | ${scheme.themes.map((x) => cell(x, p)).join(" | ")} |`,
      )
      .join("\n") +
    "\n"
  );
}

/**
 * The scale view (OD-223): for each hue, a light and a dark tab. Each tab shows the lanes that hue's
 * tokens paint (backgrounds, edges and rings, text), each as the whole scale, the used steps filled and
 * the rest empty slots, then one row per token: its color, its name, the step and the value. A row and
 * its step light up together on hover (src/clientModules/scales.ts). A row links to the token's guidance.
 */
// OD-235: the component spacing map on Foundations › Spacing, from the same guide agents read.
function spacingMap(scheme, g) {
  const sg = spacingGuide(scheme, {
    index: tokenIndex(scheme),
    chain: aliasChain,
    hints: g.scopes.find((x) => x.id === "spacing")?.hints ?? [],
  });
  const val = (r) => `\`${r.primitive}\`: ${r.px}px`;
  return (
    `\n\n## The component spacing map\n\n` +
    `Inside a component, spacing is a step of this map. Each step is 4px × its multiplier × the scheme's rhythm, rounded to a multiple of 4px, at most 64px. In ${scheme.name} the rhythm is ${sg.rhythm}. ${esc(sg.why)}\n\n` +
    `Steps that hold still stay at 4px × their multiplier in every scheme. The hairline is a fixed 2px nudge. In code, write the step's utility: \`p-map-x6\`, \`gap-map-x2\`.\n\n` +
    `| Step | Multiplier | Utility | Token and value |\n| --- | --- | --- | --- |\n` +
    sg.steps
      .map(
        (x) =>
          `| ${x.step}${x.fixed ? " (holds still)" : ""} | ${x.multiplier ? `×${x.multiplier}` : "fixed"} | \`*-map-${x.step}\` | \`${x.token}\` ${val(x)} |`,
      )
      .join("\n") +
    `\n\nBetween things and on the page, use a role instead: ` +
    sg.roles.map((r) => `\`*-${r.utility}\` (${r.px}px)`).join(", ") +
    `. A spacing is never a number.`
  );
}

// put(id, data) stores a ColorScale composite's data and returns its directive (OD-284).
function colorScales(scheme, g, fams, put) {
  const t = scheme.tokens;
  const brands = Object.keys(t.brands);
  const many = brands.length > 1;
  const at = (p) =>
    t.primitive &&
    p.split(".").reduce((n, k) => n && n[k], t.primitive)?.$value;
  const hex = (p) =>
    String(at(p) ?? "")
      .slice(0, 9)
      .toUpperCase();
  const maps = {};
  for (const b of brands)
    for (const m of ["light", "dark"]) maps[`${b}|${m}`] = scaleMap(t, b, m);
  const guided = new Set(
    (g.semantics?.keys ?? []).map((k) => k.id.replace(/\.@$/, "")),
  );
  const surf = (m, path) => {
    const f = follow(t, brands[0], m, path);
    return f ? hex(f.prim) : "";
  };
  // a token, with the brands it lands in when not every brand
  const entries = (hue, m, side) => {
    const rows = new Map();
    for (const b of brands)
      for (const [prim, list] of Object.entries(maps[`${b}|${m}`])) {
        const [, h, mm, st] = prim.split(".");
        if (h !== hue || (side === "own") !== (mm === m)) continue;
        for (const x of list) {
          const key = `${x.token}|${prim}`;
          const r = rows.get(key) ?? { ...x, prim, step: st, brands: [] };
          r.brands.push(b);
          rows.set(key, r);
        }
      }
    return [...rows.values()];
  };
  // One token as facts (OD-284, doc-composites/schemas/color-scale.schema.json).
  const token = (r, own) => {
    const id = `color.${r.token}`;
    return {
      token: r.token,
      paints: laneOf(r.token),
      ...(own && { step: r.step }),
      primitive: r.prim.replace(/^color\./, ""),
      ...(r.via && { via: r.via }),
      hex: hex(r.prim),
      ...(many && r.brands.length < brands.length && { brands: r.brands }),
      ...(guided.has(id) && {
        guidance: `../foundations/color?for=${cssId(id)}#what-each-color-is-for`,
      }),
    };
  };
  const hues = [
    ...new Set(
      fams.filter((f) => f.startsWith("color.")).map((f) => f.split(".")[1]),
    ),
  ];
  const out = [];
  for (const hue of hues) {
    const modes = ["light", "dark"].filter(
      (m) => t.primitive?.color?.[hue]?.[m],
    );
    if (!modes.length) continue;
    const data = {
      family: hue,
      modes: modes.map((m) => ({
        mode: m,
        page: {
          canvas: surf(m, "color.surface.canvas"),
          text: surf(m, "color.text.primary"),
          muted: surf(m, "color.text.muted"),
          border: surf(m, "color.border.default"),
          inverse: surf(m, "color.surface.inverse"),
        },
        steps: Object.keys(t.primitive.color[hue][m])
          .filter((k) => !k.startsWith("$"))
          .map((st) => ({
            step: st,
            primitive: `${hue}.${m}.${st}`,
            hex: hex(`color.${hue}.${m}.${st}`),
          })),
        tokens: [
          ...entries(hue, m, "own").map((r) => token(r, true)),
          ...entries(hue, m, "other").map((r) => token(r, false)),
        ],
      })),
    };
    const n = (m) => entries(hue, m, "own").length;
    out.push(
      `## ${title(hue)}\n\n${modes.map((m) => `${n(m)} tokens in ${m}`).join(", ")}.\n\n` +
        put(hue, data),
    );
  }
  return (
    `Each color is a whole scale in each theme. The lanes show what its tokens paint: backgrounds, edges and rings, and text. A filled step is in use; an empty slot waits for one. Under each scale, one row per token: its color, its name, the step it points at and the value. Point at a row to find its step. A row links to the token's guidance in [Foundations](../foundations/color).\n\n` +
    out.join("\n\n")
  );
}
const cssId = (id) =>
  id
    .replaceAll(".@", "")
    .replace(/[^a-z0-9-]+/gi, "-")
    .toLowerCase();

/** The color scope's guidance, from the grammar: the urgency order, what each key is for, and its pairs. */
function colorGuidance(g) {
  const s = g.semantics;
  if (!s) return "";
  const keys = s.keys;
  return (
    `\n## Status urgency\n\n${s.urgency.description}\n\n${s.urgency.order.map((id) => `\`${id}\``).join(" → ")}\n` +
    // Surfaces: when, and for what effect (OD-241). Each surface has one job; the state fills
    // (highlight, pressed, selected) are surfaces too, so the table shows where each one belongs.
    `\n## Surfaces: when, and for what effect\n\nA surface tells people where they are in depth, or which item they are on. Each one has a job; using the wrong one breaks the reading order.\n\n| Surface | Its job | Use it for | Not for |\n| --- | --- | --- | --- |\n` +
    keys
      .filter((k) => k.id.startsWith("color.surface."))
      .map(
        (k) =>
          `| :sample{kind="dot" value="var(--${cssId(k.id)})"} **${esc(
            k.id
              .split(".")
              .pop()
              .replace(/^./, (c) => c.toUpperCase()),
          )}** | ${esc(k.intent)} | ${esc((k.use_for ?? []).join(", "))} | ${k.not_for.map((n) => `${esc(n.when)}: \`${n.use}\``).join("; ") || "—"} |`,
      )
      .join("\n") +
    `\n\n## What each color is for\n\n| Token | What it is for | Not for |\n| --- | --- | --- |\n` +
    keys
      .map(
        (k) =>
          `| \`${k.id}\` | ${esc(k.intent)} | ${k.not_for.map((n) => `${esc(n.when)}: \`${n.use}\``).join("; ") || "—"} |`,
      )
      .join("\n") +
    "\n"
  );
}

export function docsPages(
  scheme,
  g,
  roots,
  {
    storybook = "http://localhost:6006",
    all = false,
    robots = false,
    base = "/",
  } = {},
) {
  // The data the page composites draw (OD-284), written to _composites.json beside the pages.
  const compositeData = {};
  const cardGrid = (id, cards) => {
    (compositeData["card-grid"] ??= {})[id] = { cards };
    return `::card-grid{id="${id}"}`;
  };
  // A foundation's specimen (TokenSwatches or TypeRoles), as its directive.
  const foundationSpecimen = (id, block) => {
    if (!block) return "";
    (compositeData[block.kind] ??= {})[id] = block.data;
    return `::${block.kind}{id="${id}"}\n\n`;
  };
  const specimenBlock = (id, data) => {
    (compositeData.specimen ??= {})[id] = data;
    return `::specimen{id="${id}"}`;
  };
  // robots: the Open DS robot illustrations (OD-209), in the repo docs only. A scope's robot on its
  // Foundations card, the scheme's robot on its home page and in "Not part of" notes, Shelf on the
  // inventory. Day and night editions; the theme picks one. base: the site's base URL, for raw HTML. Created projects get the same layout
  // without the pictures, so the package stays small.
  // An Intro composite's robot (OD-284): named in the directive, drawn in the repo docs only.
  const introRobot = (name) => (robots ? `robot="${name}" ` : "");
  // A robot's day and night pictures, as data for a card (OD-284).
  const robotPics = (name) =>
    robots
      ? {
          day: `${base}robots/${name}.webp`,
          night: `${base}robots/${name}-dark.webp`,
        }
      : undefined;
  const robot = (name, cls = "") =>
    robots
      ? `<span class="odv-robot ${cls}"><img class="odv-robot-day" src="${base}robots/${name}.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="${base}robots/${name}-dark.webp" alt="" loading="lazy"/></span>`
      : "";
  // all: a page for every built component, the ones the scheme leaves out too, each marked "Not part
  // of" (OD-207). The repo docs use it so a scheme switch never lands on a missing page, the way the
  // repo Storybook renders every component in every scheme (OD-192).
  const qs = questions(g);
  const sits = Object.fromEntries(g.situations.map((s) => [s.id, s]));
  const answer = (id) => scheme.answers.find((a) => a.question === id);
  const label = (id) =>
    qs[id].options.find((o) => o.id === answer(id).option).label;
  const because = (ids) =>
    ids.map((b) => `${qs[b].text} ${label(b)}`).join("; ");
  const themes = Object.fromEntries(
    scheme.themes.map((t) => [
      t.id,
      JSON.parse(
        readFileSync(
          join(roots.tokens, scheme.id, `${t.id}.tokens.json`),
          "utf8",
        ),
      ),
    ]),
  );
  const first = scheme.themes[0];
  const dark = scheme.themes.find(
    (t) => t.brand === first.brand && t.mode === "dark",
  );
  const value = (theme, path, ref) => {
    const v = get(themes[theme.id], path);
    return px(show(v === undefined ? ref : v));
  };
  const trees = Object.fromEntries(
    scheme.themes.map((t) => [t.id, rawTree(scheme, t)]),
  );
  const primitiveTree = scheme.tokens.primitive;
  const isPrimitive = (path) => isToken(get(primitiveTree, path));
  // A semantic or component token shows what it points to, never a raw value. Only primitives have values.
  const link = (theme, path) => {
    const { steps, raw } = chain(trees[theme.id], path);
    if (steps.length) return steps.map((x) => `\`${x}\``).join(" → ");
    return raw === undefined
      ? ""
      : `${esc(px(show(raw)))} (set here, not a primitive)`;
  };
  const primitiveOf = (theme, path) => {
    const { steps } = chain(trees[theme.id], path);
    return steps.length && isPrimitive(steps.at(-1)) ? steps.at(-1) : undefined;
  };
  // OD-217: in a scheme with several brands, a table that names tokens or values is written once per
  // brand. The brand picked in the top bar shows (generate.mjs scopes .odv-brandset); with one brand
  // the table is written once, as before. Headings stay outside, so the page's contents do not repeat.
  const brandList = Object.keys(scheme.tokens.brands ?? {});
  const pairOf = (b) => {
    const l =
      scheme.themes.find((t) => t.brand === b && t.mode === "light") ??
      scheme.themes.find((t) => t.brand === b);
    return [
      l,
      scheme.themes.find((t) => t.brand === b && t.mode === "dark") ?? l,
    ];
  };
  // One brand's set, in a scheme with several: a BrandSet around the page's own Markdown (OD-284).
  const brandSet = (b, body) =>
    `::::brand{id="${b}" name="${(scheme.tokens.brands[b]?.label ?? b).replaceAll('"', "'")}"}\n${body}\n::::`;
  const perBrand = (fn) =>
    brandsOf.length < 2
      ? fn(first, dark)
      : brandsOf
          .map((b) => {
            const [l, d] = pairOf(b);
            return brandSet(b, fn(l, d));
          })
          .join("\n\n");
  // OD-233: pairs and tones as pictures. For each brand and mode, every fill painted in its color with
  // the text that may sit on it, its step and the contrast it keeps there, grouped by the fill's tone; then
  // each fill in both modes with the text its tone picks. From pairsIn and toneOf, which the harness checks.
  const colorBrands = Object.keys(scheme.tokens.brands);
  const prim = (p) =>
    String(
      p.split(".").reduce((n, k) => n && n[k], scheme.tokens.primitive)
        ?.$value ?? "",
    )
      .slice(0, 7)
      .toUpperCase();
  const at = (b, m, path) => {
    const f =
      follow(scheme.tokens, b, m, path) ??
      follow(scheme.tokens, b, m, `${path}.@`);
    return f
      ? { hex: prim(f.prim), prim: f.prim.replace(/^color\./, ""), via: f.via }
      : null;
  };
  const short = (p) => p.replace(/^color\./, "").replace(/\.@$/, "");
  const forBrands = (fn) =>
    colorBrands.length === 1
      ? fn(colorBrands[0])
      : colorBrands.map((b) => brandSet(b, fn(b))).join("\n\n");
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const pairsPicture = () => {
    const tones = g.semantics?.tones;
    if (!tones) return "";
    const fills = tones.fills.map((f) => f.id);
    const own =
      /^color\.surface\.(canvas|default|raised|sunken|highlight|pressed|selected)$/;
    // One mode's pairs as facts (OD-284): each fill, its primitive and value, and every text that may
    // sit on it with the contrast it keeps and its floor. PairsChart draws them.
    const FLOOR = Math.min(
      ...colorBrands.flatMap((b) =>
        ["light", "dark"].flatMap((m) => pairsIn(g, scheme, b, m).filter((p) => p.key.startsWith("color.text.")).map((p) => p.contrast)),
      ),
    );
    const mode = (b, m) => {
      const th = scheme.tokens.brands[b].theme;
      const byFill = {};
      for (const p of pairsIn(g, scheme, b, m))
        if (p.key.startsWith("color.text.")) (byFill[p.on] ??= []).push(p);
      const pageTone = toneOf(th, m, "color.surface.canvas")?.tone;
      const fillOf = (fill) => {
        const bg = at(b, m, fill);
        if (!bg) return null;
        return {
          fill: fill.replace(/\.@$/, ""),
          primitive: `color.${bg.prim}`,
          ...(bg.via && { via: bg.via }),
          hex: bg.hex,
          pairs: (byFill[fill] ?? [])
            .map((p) => {
              const t = at(b, m, p.key);
              return t
                ? {
                    text: p.key.replace(/\.@$/, ""),
                    primitive: `color.${t.prim}`,
                    ...(t.via && { via: t.via }),
                    hex: t.hex,
                    contrast: Number(contrast(t.hex, bg.hex).toFixed(2)),
                    // A pair names its own floor only when it differs from the chart's.
                    ...(p.contrast !== FLOOR && { floor: p.contrast }),
                  }
                : null;
            })
            .filter(Boolean),
        };
      };
      const ownFills = fills.filter(
        (f) => own.test(f) && toneOf(th, m, f)?.tone === pageTone,
      );
      const rest = fills.filter((f) => !ownFills.includes(f));
      // The fills by the text they take: the page's own surfaces, light fills, dark fills.
      const fillsBy = {
        page: ownFills,
        light: rest.filter((f) => toneOf(th, m, f)?.tone === "light"),
        dark: rest.filter((f) => toneOf(th, m, f)?.tone === "dark"),
      };
      return {
        mode: m,
        fills: Object.fromEntries(
          Object.entries(fillsBy)
            .map(([tone, list]) => [tone, list.map(fillOf).filter(Boolean)])
            .filter(([, list]) => list.length),
        ),
      };
    };
    return (
      `\n## Pairs at a glance\n\nWhich text may sit on which fill, and the contrast it keeps there. Each fill is shown in its own color, with every text that may sit on it. Fills are grouped by their tone in each mode: light fills take \`color.text.on-light\`, dark fills take \`color.text.on-dark\`. The harness checks every pair.\n\n` +
      forBrands((b) => {
        (compositeData["pairs-chart"] ??= {})[b] = {
          floor: FLOOR,
          modes: ["light", "dark"].map((m) => mode(b, m)),
        };
        return `::pairs-chart{id="${b}"}`;
      }) +
      "\n"
    );
  };
  const tonePicture = () => {
    const tones = g.semantics?.tones;
    if (!tones) return "";
    return (
      `\n## The tone of each fill\n\nEvery fill says whether it is light or dark, in each mode, and that picks the text on it. A fill can change tone between modes: the same token, the other text.\n\n` +
      forBrands((b) => {
        const th = scheme.tokens.brands[b].theme;
        const rows = tones.fills
          .map((f) => ({
            id: f.id,
            l: toneOf(th, "light", f.id),
            d: toneOf(th, "dark", f.id),
          }))
          .filter((x) => x.l && x.d);
        const flips = rows.filter((x) => x.l.tone !== x.d.tone).length;
        // A fill's tone in one mode, as facts: the tone, and the neutral step or primitive it reads.
        const tone = (m, t, id) => {
          const bg = at(b, m, id);
          return {
            mode: m,
            tone: t.tone,
            ...(bg && { primitive: `color.${bg.prim}` }),
            ...(bg?.via && { via: bg.via }),
            ...(t.waits && { waits: t.waits.for }),
          };
        };
        (compositeData["fill-tones"] ??= {})[b] = {
          modes: ["light", "dark"],
          fills: rows.map((x) => ({
            fill: x.id.replace(/\.@$/, ""),
            tones: [tone("light", x.l, x.id), tone("dark", x.d, x.id)],
          })),
        };
        return (
          `**${flips === rows.length ? `Every fill changes tone between light and dark mode.` : `${flips} of ${rows.length} fills change tone between light and dark mode.`}**\n\n` +
          `::fill-tones{id="${b}"}`
        );
      }) +
      "\n"
    );
  };
  const rule = (u) =>
    `| ${esc(sits[u.situation].title)} | ${esc(u.use)} | ${esc(u.not)} | ${esc(u.why)}${u.example ? ` Example: “${esc(u.example)}”` : ""} |`;
  const RULES = "| Situation | Use | Not | Why |\n| --- | --- | --- | --- |\n";
  const pages = {};

  // About this system: a home that shows the system before it explains it (OD-182). A product screen
  // built from its own components and sample content, the answers that shape it most, then tiles into
  // every section. The full reasons follow underneath.
  const smp = scheme.samples ?? {};
  const meaning = Object.fromEntries(
    (smp.statuses ?? []).map((x) => [x.label, x.meaning]),
  );
  const cited = {};
  for (const c of scheme.inventory?.in ?? [])
    for (const axis of Object.values(c.variants ?? {}))
      for (const d of Object.values(axis))
        for (const q of d.because ?? []) cited[q] = (cited[q] ?? 0) + 1;
  for (const u of scheme.usage)
    for (const q of u.because ?? []) cited[q] = (cited[q] ?? 0) + 1;
  const top = Object.entries(cited)
    .filter(([q]) => answer(q))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([q]) => q);
  const primCount = leaves(primitiveTree, "").length;
  // The hero's sample screen (OD-209, OD-284): the scheme's own sample content as data, drawn by the
  // SampleScreen composite from its real components. Which screen fits comes from the scheme's answer to
  // the main task (tasks.q1) and its brands: compare shows the table, read an article opening, complete a
  // form step (or the same card in every brand), explore a launch sign-up.
  const statusOf = (label) => ({
    text: label,
    tone: STATUS_CLASS[meaning[label]] ?? "neutral",
  });
  const carriesTable = (scheme.inventory?.in ?? []).some(
    (c) => c.id === "table" || c.id === "data-table",
  );
  const task = answer("tasks.q1")?.option;
  const brandsOf = Object.keys(scheme.tokens.brands ?? {});
  const tableScreen = smp.table && {
    table: {
      caption: smp.table.caption,
      columns: smp.table.columns.map((c) => ({
        label: c.label,
        ...(c.numeric && { numeric: true }),
      })),
      rows: smp.table.rows
        .slice(0, 6)
        .map((r) => ({ cells: r.cells, status: statusOf(r.status) })),
    },
    ...(smp.actions && {
      actions: {
        primary: smp.actions.primary,
        secondary: smp.actions.secondary,
      },
    }),
  };
  const card = smp.card ?? {};
  const cardScreen = smp.card && {
    screen: smp.screen,
    title: card.title,
    ...(card.status && { status: statusOf(card.status) }),
    ...(card.description && { description: card.description }),
    ...(smp.metrics?.length && {
      metrics: smp.metrics
        .slice(0, 4)
        .map((m) => ({ value: m.value, label: m.label })),
    }),
    actions: { primary: card.primary, secondary: card.secondary },
  };
  const field = smp.field && {
    label: smp.field.label,
    hint: smp.field.hint,
    placeholder: smp.field.placeholder,
  };
  const previews = {
    read: () =>
      smp.card && {
        eyebrow: card.description,
        title: card.title,
        ...(smp.tabs?.[0]?.content && { body: smp.tabs[0].content }),
        actions: { primary: card.primary, secondary: card.secondary },
      },
    complete: () =>
      smp.card &&
      (brandList.length > 1
        ? {
            brands: brandList.map((b) => scheme.tokens.brands[b]?.label ?? b),
            title: card.title,
            ...(card.status && { status: statusOf(card.status) }),
            ...(card.description && { description: card.description }),
            actions: { primary: card.primary },
          }
        : {
            screen: smp.screen,
            eyebrow: card.title,
            ...(field && { field }),
            actions: { primary: card.primary, link: card.secondary },
          }),
    explore: () => ({
      title: smp.screen,
      ...(smp.metrics?.length && {
        metrics: smp.metrics
          .slice(0, 2)
          .map((m) => ({ value: m.value, label: m.label })),
      }),
      ...(field && { field }),
      ...(smp.actions?.primary && {
        actions: { primary: smp.actions.primary },
      }),
    }),
  };
  const heroSample =
    (task === "compare" || carriesTable) && tableScreen
      ? tableScreen
      : previews[task]?.() || cardScreen || tableScreen;
  const firstRamp = leaves(primitiveTree, "")
    .filter((x) => x.path.startsWith(".color.") && /^#/.test(String(x.ref)))
    .slice(0, 12);
  // The tiles into every section (OD-284: CardGrid cards, each with a few samples).
  const tiles = [
    {
      href: "primitives/",
      title: "Primitives",
      text: `All ${primCount} raw values, and the tokens that point to each.`,
      samples: firstRamp.map((x) => ({ kind: "color", value: String(x.ref) })),
    },
    {
      href: "foundations/",
      title: "Foundations",
      text: "Color, type, spacing, shape and motion, each with the answer behind it.",
      samples: [
        ...[
          "color.action.primary",
          "color.status.success",
          "color.status.warning",
          "color.status.danger",
          "color.status.info",
          "color.text.primary",
        ].map((p) => ({ kind: "color", value: cssVar(p) })),
        { kind: "text", value: "Aa" },
      ],
    },
    {
      href: "components/inventory",
      title: "Components",
      text: `${(scheme.inventory?.in ?? []).length} components, each with when to use it and how ${scheme.name} decided.`,
      samples: [
        ...(smp.actions ? [{ kind: "text", value: smp.actions.primary }] : []),
        ...((smp.statuses ?? [])[2]
          ? [{ kind: "text", value: smp.statuses[2].label }]
          : []),
      ],
    },
    {
      href: "voice",
      title: "Voice and tone",
      text: scheme.voice?.summary?.text ?? "",
      samples: [
        { kind: "text", value: scheme.voice?.principles?.[0]?.text ?? "" },
      ],
    },
    {
      href: "themes",
      title: "Themes",
      text: `${scheme.themes.length} themes. Only semantic tokens change; components never do.`,
      samples: scheme.themes.map((th) => ({
        kind: "color",
        value: value(th, "color.surface.canvas", ""),
      })),
    },
    {
      href: "agents",
      title: "For agents",
      text: "AGENTS.md, the skill and the MCP: an AI builds the way the system would.",
      samples: [{ kind: "code", value: `open-ds why ${scheme.id} button` }],
    },
  ];
  pages["index.md"] =
    fm({
      sidebar_position: 1,
      slug: "/",
      title: scheme.name,
      description: scheme.summary,
      hide_title: true,
      hide_table_of_contents: true,
    }) +
    NOTE +
    // The opening (OD-284): the scheme's name and summary in Markdown inside a Hero, then its sample screen.
    `:::hero{${introRobot(scheme.id)}eyebrow="Design system · built from ${scheme.answers.length} answered questions" action="Explore the foundations" href="foundations/" stats="${(scheme.inventory?.in ?? []).length} components|${primCount} primitives|${scheme.themes.length} themes"}\n` +
    `# ${esc(scheme.name)}\n\n${esc(scheme.summary)}\n:::` +
    (heroSample
      ? `\n\n${(() => {
          (compositeData["sample-screen"] ??= {}).home = heroSample;
          return `::sample-screen{id="home"}`;
        })()}`
      : "") +
    `\n\n## Why it looks like this\n\nEvery decision follows from an answer. These are the answers its components and rules cite most. Follow them all in the [Decision reference](decision-reference).\n\n` +
    cardGrid(
      "home/answers",
      top.map((q) => ({
        eyebrow: qs[q].text,
        title: label(q),
        text: answer(q).why,
        code: q,
      })),
    ) +
    `\n\n## Explore the system\n\n` +
    cardGrid("home/sections", tiles) +
    `\n\n## Who it is for\n\n` +
    `- **Use it for:** ${scheme.ai.use_when}\n- **Not for:** ${scheme.ai.avoid_when}\n- **Products like:** ${scheme.ai.example_products.join(", ")}\n- **Themes:** ${scheme.themes.map((t) => t.id).join(", ")}\n\n` +
    `## Use scenarios\n\n${scheme.scenarios.map((s) => `- ${s.text}`).join("\n")}\n\n` +
    `## Every answer\n\nAll ${scheme.answers.length} answers, and the design decisions each one made: [Decision reference](decision-reference).\n`;

  // Decision reference (OD-239): the way in from the questions to the design. Each question, its
  // answer, why, the earlier answers it came from, and every design decision it made: a later
  // answer, a usage rule or a component variant, each linked to the page that goes deeper. Generated
  // from the answers, their because links, the usage rules and the components' variants. No
  // comparison with other schemes. Its section menu sits in the left sidebar
  // (_decision-menu.json, read by src/decisionMenu.ts) and opens only on this page.
  {
    const sections = [
      ...g.reasons.map((r) => ({ ...r, group: "Reasons", scope: null })),
      ...g.scopes.map((r) => ({ ...r, group: "Scopes", scope: r.id })),
    ].filter((r) => (r.questions ?? []).length);
    const secOf = {};
    for (const r of sections) for (const q of r.questions) secOf[q.id] = r;
    // The data comes from decisions.mjs, the same reference get_decision_reference returns.
    const lc = lower;
    const ref = decisionReference(scheme, g);
    const lineOf = {};
    for (const sec of ref.sections)
      for (const q of sec.questions)
        for (const b of q.because) lineOf[b.question] = b.line;
    const made = {};
    for (const sec of ref.sections)
      for (const q of sec.questions)
        made[q.id] = [
          ...q.decided.answers.map((d) => ({
            kind: "Answer",
            text: d.text,
            href: d.page ?? `#${d.section}`,
            go: d.page_title,
          })),
          ...q.decided.rules.map((d) => ({
            kind: "Rule",
            text: d.text,
            href: d.page,
            go: d.page_title,
          })),
          ...q.decided.variants.map((d) => ({
            kind: "Variant",
            text: d.text,
            href: d.page,
            go: d.page_title,
          })),
          ...(q.decided.picks ?? []).map((d) => ({
            kind: "Pick",
            text: d.text,
            href: d.page,
            go: d.page_title,
          })),
        ];
    const n = (q) => (made[q] ?? []).length;
    const total = (r) => r.questions.reduce((t, q) => t + n(q.id), 0);
    // One answer as the DecisionAnswer composite (OD-284): the question stays the page's heading.
    const GROUP = { Answer: "answers", Rule: "rules", Variant: "variants", Pick: "picks" };
    const answerData = (q, r) => {
      const all = made[q.id] ?? [];
      const a = answer(q.id);
      const considered = a.considers ?? {};
      const weighs = [...new Set((q.considers ?? []).map((k) => k.group))].map((gr) => ({
        group: gr,
        items: q.considers
          .filter((k) => k.group === gr)
          .map((k) => ({ label: k.label, text: considered[k.id] ?? "Not answered yet." })),
      }));
      return {
        answer: label(q.id),
        why: sentence(a.why),
        ...(weighs.length && { weighs }),
        because: (a.because ?? []).map((x) => lineOf[x]).filter(Boolean),
        decided: {
          groups: Object.entries(GROUP)
            .map(([k, kind]) => ({
              kind,
              items: all
                .filter((d) => d.kind === k)
                .map((d) => ({
                  text: d.text,
                  ...(d.href && d.go && { link: { label: d.go, href: d.href } }),
                })),
            }))
            .filter((x) => x.items.length),
          ...(!all.length &&
            r.scope && { values: { label: r.title, href: `foundations/${r.scope}` } }),
        },
      };
    };
    const qa = (q, r) => {
      const id = q.id.replace(/\./g, "-");
      (compositeData["decision-answer"] ??= {})[id] = answerData(q, r);
      return `#### ${esc(q.text)} {#${id}}\n\n::decision-answer{id="${id}"}`;
    };
    // Where it starts: a simple process tree. The first answers (nothing before them), each later
    // answer under the first answer it came from, and at the leaves the foundation values they set.
    const reasons = scheme.answers
      .map((a) => a.question)
      .filter((q) => !secOf[q].scope);
    const kids = {};
    for (const q of reasons) {
      const p = (answer(q).because ?? []).find((b) => reasons.includes(b));
      if (p) (kids[p] ??= []).push(q);
    }
    const ix = tokenIndex(scheme);
    const firstValue = (scope) => {
      const owns = g.scopes.find((x) => x.id === scope)?.owns ?? [];
      const all = flatTokens(scheme.tokens.semantic)
        .map(([k]) => k)
        .filter((k) => owns.some((o) => k === o || k.startsWith(`${o}.`)));
      // A number reads best in one line: a body value first, then any size, then the first token.
      const sized = all.filter((k) =>
        /^-?[\d.]/.test(String(aliasChain(ix, k).value)),
      );
      const p = sized.find((k) => /\.body\./.test(k)) ?? sized[0] ?? all[0];
      if (!p) return {};
      const c = aliasChain(ix, p);
      return {
        token: p,
        ...(c.hops.at(-1) && { primitive: c.hops.at(-1) }),
        value: typeof c.value === "object" ? cssValue(c.value) : String(c.value),
      };
    };
    const leaves = (q, depth) =>
      scheme.answers
        .filter(
          (a) =>
            secOf[a.question].scope &&
            /\.values$/.test(a.question) &&
            (a.because ?? [])[0] === q,
        )
        .map((a) => {
          const sec = secOf[a.question];
          return {
            answer: label(a.question),
            scope: {
              title: sec.title.toLowerCase(),
              href: `foundations/${sec.scope}`,
              ...firstValue(sec.scope),
            },
          };
        });
    const branch = (q) => {
      const also = (answer(q).because ?? []).slice(1);
      const children = [...(kids[q] ?? []).map((k) => branch(k)), ...leaves(q)];
      return {
        answer: label(q),
        question: qs[q].text,
        ...(also.length && { also: also.map((b) => label(b)) }),
        ...(children.length && { children }),
      };
    };
    const roots = reasons.filter(
      (q) => !(answer(q).because ?? []).some((b) => reasons.includes(b)),
    );
    (compositeData["decision-tree"] ??= {}).start = { roots: roots.map((q) => branch(q)) };
    const tree = `::decision-tree{id="start"}`;
    // Every question: one fold per section, one open at a time (src/clientModules/scales.ts).
    const every = ["Reasons", "Scopes"]
      .map(
        (grp) =>
          `::::group{title="${grp}"}\n` +
          sections
            .filter((r) => r.group === grp)
            .map(
              (r) =>
                `:::fold{id="${r.id}" title="${r.title.replaceAll('"', "'")}" note="${r.questions.length} answers, ${total(r)} decision${total(r) === 1 ? "" : "s"}${r.scope ? ", and the values of its tokens" : ""}"}\n` +
                r.questions.map((q) => qa(q, r)).join("\n\n") +
                `\n:::`,
            )
            .join("\n\n") +
          "\n::::",
      )
      .join("\n\n");
    const has = (q) => qs[q] && answer(q);
    const example =
      has("spacing.values") && has("voice.values")
        ? ` For example, why ${scheme.name}'s spacing is ${lc(label("spacing.values"))}, or why its voice is ${lc(label("voice.values"))}.`
        : "";
    const intro =
      `:::intro{${introRobot(scheme.id)}title="Take it one answer at a time"}\n` +
      `This page keeps every decision behind ${esc(scheme.name)} in one place: ${scheme.answers.length} answers and what each one shaped. It's a reference, not a reading list. Most days you only need one answer.\n\n` +
      `**Three easy ways in**\n\n` +
      `- Take a minute with [Where it starts](#where-it-starts). It shows the few first answers the rest grow from.\n` +
      `- Open one section when you wonder why.${esc(example)}\n` +
      `- Come in from a component page. Each one links here, to the answers that shaped it.\n\n` +
      `Everything else can wait until you need it.\n:::`;
    (compositeData.steps ??= {}).flow = {
      steps: ["Question", "Answer", "Why, and what it came from", "Design values", "In the UI"],
    };
    const flow = `::steps{id="flow"}`;
    pages["decision-reference.md"] =
      fm({
        sidebar_position: 1.5,
        title: "Decision reference",
        description: `${scheme.name}: each question, its answer, and the design decisions it made.`,
        hide_table_of_contents: true,
      }) +
      NOTE +
      `# Decision reference\n\n` +
      intro +
      "\n\n" +
      `${flow}\n\n` +
      `## Where it starts\n\nThe first answers lead to the rest. Each branch is an answer that follows from the one above it.\n\n${tree}\n\n` +
      `## Every question\n\nAll ${scheme.answers.length}, by section, in the order every scheme answers them. Each answer shows why, what it came from, and every design decision it made. The menu in the sidebar opens a section; its number is how many decisions that section made.\n\n` +
      every +
      "\n";
    // The section menu for the left sidebar, under Decision reference.
    pages["_decision-menu.json"] =
      JSON.stringify(
        {
          doc: "decision-reference",
          groups: ["Reasons", "Scopes"].map((grp) => ({
            title: grp,
            items: sections
              .filter((r) => r.group === grp)
              .map((r) => ({ id: r.id, title: r.title, count: total(r) })),
          })),
        },
        null,
        2,
      ) + "\n";
  }

  // Voice and tone
  const v = scheme.voice;
  const voiceRules = scheme.usage.filter(
    (u) => sits[u.situation].scope === "voice",
  );
  pages["voice.md"] =
    fm({
      sidebar_position: 2,
      title: "Voice and tone",
      description: v.summary.text,
    }) +
    NOTE +
    `# Voice and tone\n\n${v.summary.text}\n\n## Principles\n\n${v.principles.map((p) => `- ${p.text}`).join("\n")}\n\n` +
    (v.brands
      ? `## Each brand\n\n${Object.entries(v.brands)
          .map(([b, t]) => `- **${title(b)}:** ${t.text}`)
          .join("\n")}\n\n`
      : "") +
    `## Words\n\n- Use: ${v.words.use.join(", ")}\n- Avoid: ${v.words.avoid.join(", ")}\n\n` +
    `## Tone for each moment\n\n${RULES}${voiceRules.map(rule).join("\n")}\n`;

  // Foundations: one page per scope, the same parts for every scope.
  pages["foundations/_category_.json"] =
    JSON.stringify(
      {
        label: "Foundations",
        position: 3,
        link: { type: "doc", id: "foundations/index" },
      },
      null,
      2,
    ) + "\n";
  // The foundations overview: every scope in one compact table, with the answer that sets its values.
  // The Foundations index (OD-209): a card per scope in three groups, each with its answer for the
  // values, why, and a small specimen drawn in the scheme's own tokens.
  const SCOPE_ROBOT = {
    color: "swatch",
    spacing: "measure",
    components: "shelf",
  };
  const scopeRobot = (id) => robotPics(SCOPE_ROBOT[id] ?? `scopes/${id}`);
  // Each scope card's few samples, as kind and value (OD-284); a scope with no value to draw shows a line.
  const vars = (list, kind) =>
    list.map((v) => ({ kind, value: `var(--${v})` }));
  const scopeSpecimen = {
    typography: vars(
      ["type-title-font-size", "type-body-font-size", "type-caption-font-size"],
      "size",
    ),
    color: vars(
      [
        "color-action-primary",
        "color-text-primary",
        "color-text-secondary",
        "color-border-default",
        "color-status-danger",
        "color-status-success",
      ],
      "color",
    ),
    spacing: vars(
      [
        "space-gap-tight",
        "space-gap-default",
        "space-gap-group",
        "space-gap-section",
      ],
      "bar",
    ),
    shape: vars(
      ["radius-badge", "radius-option", "radius-control", "radius-container"],
      "radius",
    ),
    elevation: vars(["elevation-card", "elevation-overlay"], "shadow"),
    motion: vars(["motion-duration-feedback"], "duration"),
    accessibility: vars(["size-control-default"], "target"),
    // The page's canvas in each mode the scheme ships.
    theming: [...new Set(scheme.themes.map((th) => th.mode))].map((mode) => ({
      kind: "mode",
      value: String(
        value(scheme.themes.find((th) => th.mode === mode), "color.surface.canvas", ""),
      ),
    })),
    iconography: [
      {
        kind: "icon-label",
        value: scheme.tokens.content?.action?.destroy?.$value ?? "Delete",
      },
    ],
    naming: [{ kind: "code", value: "button/primary/background" }],
    voice: [
      {
        kind: "quote",
        value: scheme.tokens.content?.action?.commit?.$value ?? "Save",
      },
    ],
    components: [
      {
        kind: "count",
        value: String((scheme.inventory?.in ?? []).length),
        note: `of ${g.catalogue?.items?.length ?? 0} in the catalogue`,
      },
    ],
  };
  const SCOPE_GROUPS = [
    ["How it looks", ["typography", "color", "shape", "elevation"]],
    [
      "How it feels to use",
      ["spacing", "motion", "iconography", "accessibility"],
    ],
    [
      "Where it runs and how it speaks",
      ["theming", "naming", "voice", "components"],
    ],
  ];
  const grouped = new Set(SCOPE_GROUPS.flatMap(([, ids]) => ids));
  const rest = g.scopes.filter((sc) => !grouped.has(sc.id)).map((sc) => sc.id);
  const scopeCard = (id) => {
    const sc = g.scopes.find((x) => x.id === id);
    if (!sc) return null;
    const q =
      sc.questions.find((x) => x.method === "values") ?? sc.questions[3];
    return {
      title: sc.title,
      answer: { label: "Values", text: label(q.id) },
      text: answer(q.id).why,
      href: `./${sc.id}`,
      ...(robots && { robot: scopeRobot(sc.id) }),
      ...(scopeSpecimen[sc.id] && { samples: scopeSpecimen[sc.id] }),
    };
  };
  pages["foundations/index.md"] =
    fm({
      title: "Foundations",
      description: `${scheme.name}: every scope and the answer that sets its values.`,
      hide_table_of_contents: true,
    }) +
    NOTE +
    `# Foundations\n\nEvery scope answers the same five questions. This is the answer that sets each scope's values; open a scope for all five, its tokens and its specimen.\n\n` +
    [...SCOPE_GROUPS, ...(rest.length ? [["More", rest]] : [])]
      .map(
        ([title, ids]) =>
          `## ${title}\n\n` +
          cardGrid(
            `scopes/${cssId(title)}`,
            ids.map(scopeCard).filter(Boolean),
          ),
      )
      .join("\n\n") +
    "\n";
  // The color page leads with the colors in use (OD-182): the key colors as a band, the surfaces
  // as a stack in light and dark, and each status in use with its contrast, computed from the tokens.
  const colorVisuals = () => {
    const band = [
      ["Action", "color.action.primary"],
      ["Text", "color.text.primary"],
      ["Success", "color.status.success"],
      ["Warning", "color.status.warning"],
      ["Danger", "color.status.danger"],
      ["Info", "color.status.info"],
    ];
    const hex = (th, p) =>
      String(value(th, p, "")).match(/#[0-9a-f]{6,8}/i)?.[0] ?? "";
    const sts = (smp.statuses ?? []).filter(
      (x, j, all) =>
        STATUS_CLASS[x.meaning] &&
        all.findIndex((y) => y.meaning === x.meaning) === j,
    );
    return (
      perBrand((F) => {
        const id = F.brand ?? "all";
        (compositeData["color-keys"] ??= {})[id] = {
          keys: band.map(([n, p]) => ({ name: n, token: p })),
        };
        return `::color-keys{id="${id}"}`;
      }) +
      `\n\n## Surfaces\n\nThe canvas, then the surfaces content sits on, in ${scheme.themes.map((th) => th.id).join(" and ")}.\n\n` +
      perBrand((F, D) => {
        const id = F.brand ?? "all";
        (compositeData["surface-stack"] ??= {})[id] = {
          ...(brandsOf.length > 1 && { brand: F.brand }),
          modes: [F, D].filter(Boolean).map((th) => th.mode),
        };
        return `::surface-stack{id="${id}"}`;
      }) +
      (sts.length
        ? `\n\n## Status colors in use\n\nEach status label always gets the same color, with its dot, so color is never the only cue. The ratio is the status color on its subtle fill, computed from the tokens.\n\n` +
          perBrand((F, D) => {
            const id = F.brand ?? "all";
            (compositeData["status-colors"] ??= {})[id] = {
              statuses: sts.map((x) => {
                const k = `color.status.${x.meaning}`;
                return {
                  label: x.label,
                  tone: STATUS_CLASS[x.meaning],
                  meaning: x.why,
                  contrast: [F, D].filter(Boolean).map((th) => ({
                    mode: th.id,
                    ratio: Number(contrast(hex(th, k), hex(th, `${k}.subtle`)).toFixed(1)),
                  })),
                };
              }),
            };
            return `::status-colors{id="${id}"}`;
          })
        : "") +
      "\n\n"
    );
  };
  // The Theming page (OD-211): what a mode is, shown not listed. A live preview per mode from its
  // real colors, then what a mode changes (a table per job group, every mode side by side), then
  // what stays the same in every mode. Multi-brand gets one set per brand; the brand picked in the
  // top bar shows (generate.mjs scopes it), and without that CSS every brand shows.
  const themingVisuals = () => {
    const brandIds = Object.keys(scheme.tokens.brands ?? {});
    const modes = [...new Set(scheme.themes.map((t) => t.mode))];
    const hexOf = (th, p) =>
      String(value(th, p, "")).match(/#[0-9a-f]{6,8}/i)?.[0] ?? "";
    const semPath = (p) => p.replace(/^\./, "").replace(/\.@$/, "");
    const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
    const brandLabel = (b) => scheme.tokens.brands[b]?.label ?? cap(b);
    const radius = (th, k) => value(th, `radius.${k}`, "0");
    const sts = (smp.statuses ?? [])
      .filter((x) => STATUS_CLASS[x.meaning])
      .slice(0, 2);
    const commit = scheme.tokens.content?.action?.commit?.$value ?? "Save";
    const cancel = scheme.tokens.content?.action?.cancel?.$value ?? "Cancel";
    const sameBlock = (b) => {
      const base = scheme.tokens.brands[b]?.theme?.base ?? {};
      const th = scheme.themes.find((t) => t.brand === b) ?? first;
      const radii = leaves(base.radius ?? {}, "").map((x) =>
        x.path.replace(/^\./, ""),
      );
      const fams = {};
      for (const x of leaves(base.type ?? {}, "")) {
        const role = x.path.replace(/^\./, "").split(".")[0];
        const v = String(
          cssValue(value(th, `type.${role}.font-family`, "")) || "",
        )
          .split(",")[0]
          .replaceAll('"', "");
        if (v) (fams[v] ??= []).push(role);
      }
      // What stays the same in every mode (OD-284): the corners and the type families, as facts.
      (compositeData["mode-constants"] ??= {})[b] = {
        corners: radii.map((r) => {
          const [v, px] = String(radius(th, r)).match(/^(\S+)(?: \((.*)\))?$/)?.slice(1) ?? [String(radius(th, r))];
          return { token: r, value: v, ...(px && { px }) };
        }),
        families: Object.entries(fams).map(([family, roles]) => ({ family, roles })),
      };
      return `\n\n### What stays the same in every mode\n\n::mode-constants{id="${b}"}\n\n`;
    };
    const themingSet = (b) => {
      const ths = scheme.themes.filter((t) => t.brand === b);
      const tree = scheme.tokens.brands[b]?.theme ?? {};
      // The neutral steps are the scale behind the jobs, not jobs: they show as "via" on the jobs.
      const jobs = leaves(tree[ths[0]?.mode] ?? {}, "")
        .map((x) => semPath(x.path))
        .filter((p) => !p.startsWith("color.neutral."));
      const groups = [
        ...new Set(jobs.map((p) => p.split(".").slice(0, 2).join("."))),
      ];
      // Every color cell follows its token to the primitive, the way the scale view does (OD-223):
      // the primitive's name, the neutral step it goes through, and a swatch. Never a bare value.
      const cell = (th, p) => {
        const f = p.startsWith("color.")
          ? (follow(scheme.tokens, b, th.mode, p) ??
            follow(scheme.tokens, b, th.mode, `${p}.@`))
          : null;
        if (!f) return { value: String(value(th, p, "")) };
        const hx = String(
          f.prim.split(".").reduce((n, k) => n && n[k], scheme.tokens.primitive)
            ?.$value ?? "",
        );
        return {
          primitive: f.prim.replace(/^color\./, ""),
          ...(f.via && { via: f.via.replace(/^color\./, "") }),
          hex: hx,
        };
      };
      // The mode previews (OD-284): the scheme's own components, shown in each mode. The colors
      // and corners come from the tokens, so the data holds only the content.
      (compositeData["mode-preview"] ??= {})[b] = {
        name: scheme.name,
        scenario: scheme.scenarios[0]?.text ?? scheme.summary,
        actions: { commit, cancel },
        statuses: sts.map((x) => ({ label: x.label, meaning: x.meaning })),
        ...(brandIds.length > 1 && { brand: { id: b, label: brandLabel(b) } }),
        modes: ths.map((th) => th.mode),
      };
      // What a mode changes (OD-284): one table, a row per job group, every mode side by side.
      (compositeData["mode-changes"] ??= {})[b] = {
        modes: ths.map((t) => t.mode),
        groups: groups.map((gr) => ({
          title: cap(gr.split(".").pop()),
          rows: jobs
            .filter((p) => p.startsWith(`${gr}.`) || p === gr)
            .map((p) => ({
              job: p.split(".").slice(1).join("."),
              cells: ths.map((t) => cell(t, p)),
            })),
        })),
      };
      const tables = `::mode-changes{id="${b}"}`;
      const body =
        `::mode-preview{id="${b}"}\n\n### What a mode changes\n\n${tables}` +
        sameBlock(b);
      return brandIds.length > 1 ? brandSet(b, body) : body;
    };
    return (
      `${esc(scheme.name)} has **${modes.length} mode${modes.length === 1 ? "" : "s"}** and **${brandIds.length} brand${brandIds.length === 1 ? "" : "s"}**. A mode swaps the colors; corners and type stay the same in every mode.${brandIds.length > 1 ? " Pick a brand in the top bar to see its set." : ""}\n\n` +
      brandIds.map(themingSet).join("\n\n") +
      "\n\n"
    );
  };
  g.scopes.forEach((sc, i) => {
    const tokens = owned(scheme, sc.owns ?? []);
    const usage = scheme.usage.filter((u) => sits[u.situation].scope === sc.id);
    // Paths for the component scope start with component.; the key itself is the rest.
    const key = (p) => p.replace(/^component\./, "");
    const semantics = tokens.filter((t) => !isPrimitive(t.path));
    const darkDiffers = (F, D) =>
      semantics.some((t) => link(F, key(t.path)) !== link(D, key(t.path)));
    const primsOf = (F, D) => [
      ...tokens.filter((t) => isPrimitive(t.path)).map((t) => t.path),
      ...semantics.flatMap((t) => [
        primitiveOf(F, key(t.path)),
        primitiveOf(D, key(t.path)),
      ]),
    ];
    // One row per token per mode, so each chain has the whole last column to itself.
    const tokenTable = (F, D) =>
      (darkDiffers(F, D)
        ? `| Token | Mode | Points to |\n| --- | --- | --- |\n` +
          semantics
            .flatMap((t) => [
              `| \`${t.path}\` | ${F.mode} | ${link(F, key(t.path))} |`,
              `| | ${D.mode} | ${link(D, key(t.path))} |`,
            ])
            .join("\n")
        : "| Token | Points to |\n| --- | --- |\n" +
          semantics.map((t) => `| \`${t.path}\` | ${link(F, key(t.path))} |`).join("\n"));
    const hasPrims = primsOf(first, dark).filter(Boolean).length > 0;
    const SPECIMEN =
      sc.id === "theming"
        ? themingVisuals()
        : ["components", "naming", "voice"].includes(sc.id)
          ? ""
          : foundationSpecimen(
              sc.id,
              specimen(
                semantics.length ? semantics : tokens,
                scheme.scenarios[0].text,
                {
                  smp,
                  val: (path) => {
                    const v = String(value(first, path, ""));
                    return v.match(/\((\d+(?:\.\d+)?px)\)/)?.[1] ?? v;
                  },
                },
              ),
            );
    pages[`foundations/${sc.id}.md`] =
      fm({
        sidebar_position: i + 1,
        title: sc.title,
        description: `${scheme.name}: ${sc.description}`,
      }) +
      NOTE +
      `# ${sc.title}\n\n${sc.description}\n\n${SPECIMEN}${sc.id === "color" ? colorVisuals() : ""}## The five answers\n\n| Question | Answer | Why |\n| --- | --- | --- |\n` +
      sc.questions
        .map(
          (q) =>
            `| ${esc(q.text)} | ${esc(label(q.id))} | ${esc(answer(q.id).why)} |`,
        )
        .join("\n") +
      // Theming shows its tokens as the mode table above (OD-211), so it skips the flat lists.
      // Theming shows its tokens as the mode table above (OD-211); the component scopes' keys are on
      // each component's page, as its variables (OD-233).
      (sc.id === "theming" || (sc.owns ?? []).includes("component")
        ? ""
        : `\n\n## Tokens\n\n` +
          (semantics.length
            ? `Each token points to another token. Values live only on primitives, below.\n\n` +
              perBrand(tokenTable)
            : "This scope sets primitives directly.") +
          // The raw values live on the Primitives pages (OD-223), not repeated here.
          (hasPrims
            ? `\n\nThe raw values these tokens end at are on [Primitives › ${PRIM_PAGE_OF[sc.id]?.title ?? "all kinds"}](../primitives/${PRIM_PAGE_OF[sc.id]?.id ?? ""}).`
            : "")) +
      (sc.id === "spacing" ? spacingMap(scheme, g) : "") +
      // What lands where is shown per component, in its anatomy (OD-229), not as a list here.
      `\n\n` +
      `## When to use what\n\n${RULES}${usage.map(rule).join("\n")}\n` +
      (sc.id === "color"
        ? colorGuidance(g) + pairsPicture() + tonePicture()
        : "");
  });

  // Primitives (OD-184): every raw value, and what points to it in which mode. Unused primitives stay
  // listed, so a brand or a changed answer can pick them up without adding a value.
  const usedBy = {};
  const scan = (node, path, where) => {
    if (!node || typeof node !== "object") return;
    if (isToken(node)) {
      for (const m of JSON.stringify(node.$value).matchAll(/\{([^}]+)\}/g))
        (usedBy[m[1]] ??= []).push({ token: path.replace(/\.@$/, ""), where });
      return;
    }
    for (const [k, v] of Object.entries(node))
      if (!k.startsWith("$")) scan(v, path ? `${path}.${k}` : k, where);
  };
  for (const [b, brand] of Object.entries(scheme.tokens.brands ?? {}))
    for (const [mode, tree] of Object.entries(brand.theme ?? {}))
      scan(
        tree,
        "",
        mode === "base"
          ? `every mode${Object.keys(scheme.tokens.brands).length > 1 ? `, ${b}` : ""}`
          : `${mode}${Object.keys(scheme.tokens.brands).length > 1 ? `, ${b}` : ""}`,
      );
  scan(scheme.tokens.semantic, "", "semantic");
  scan(scheme.tokens.component, "", "component key");
  const prims = leaves(primitiveTree, "").map((x) => ({
    ...x,
    path: x.path.replace(/^\./, ""),
  }));
  const family = (path) => {
    const p = path.split(".");
    return p[0] === "color"
      ? p.slice(0, 3).join(".")
      : p[0] === "font"
        ? p.slice(0, 2).join(".")
        : p[0];
  };
  const nUsed = prims.filter((x) => usedBy[x.path]).length;
  // One group of primitives as the PrimitiveTable composite (OD-284): each value drawn, and every
  // token that uses it, one per line.
  const table = (list, id) => {
    (compositeData["primitive-table"] ??= {})[id] = {
      rows: list.map((x) => {
        const f = sampleFact(x.path, x.type ?? primitiveType(x.path), x.ref);
        return {
          primitive: x.path,
          value: String(value(first, x.path, x.ref)),
          ...(f && { sample: f }),
          usedBy: (usedBy[x.path] ?? []).map((y) => ({ token: y.token, where: y.where })),
        };
      }),
    };
    return `::primitive-table{id="${id}"}`;
  };
  // A small specimen per font family (above its table): a large Aa, the alphabet and figures, the
  // weights this scheme uses with it, the roles that read it and its fallback stack.
  const WEIGHT = {
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "Semibold",
    700: "Bold",
  };
  const specIndex = tokenIndex(scheme);
  const fontSpecimens = (list) =>
    specimenBlock("type/fonts", {
      items: list.map((x) => {
        const stack = String(value(first, x.path, x.ref));
        const roles = [
          ...new Set(
            (usedBy[x.path] ?? [])
              .map((y) => y.token.match(/^type\.([a-z-]+)\.font-family$/)?.[1])
              .filter(Boolean),
          ),
        ];
        const weights = [
          ...new Set(
            roles
              .map((r) =>
                Number(aliasChain(specIndex, `type.${r}.font-weight`).value),
              )
              .filter((w) => w > 0),
          ),
        ].sort((a, b) => a - b);
        return {
          font: stack.replace(/"/g, "'"),
          big: "Aa",
          token: x.path,
          sample: [
            "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm",
            "0123456789 · & ? !",
          ],
          ...(weights.length && {
            weights: weights.map((w) => ({
              weight: w,
              name: WEIGHT[w] ?? String(w),
            })),
          }),
          read: roles.length
            ? {
                label: "Read by",
                codes: roles.map((r) => `type.${r}.font-family`),
              }
            : { label: "Not used yet", codes: [] },
          foot: stack,
        };
      }),
    }) + "\n\n";
  const kinds = [
    ...PRIMITIVE_PAGES,
    {
      id: "other",
      title: "Other",
      match: (p) => !PRIMITIVE_PAGES.some((k) => k.match(p)),
    },
  ]
    .map((k) => ({ ...k, list: prims.filter((x) => k.match(x.path)) }))
    .filter((k) => k.list.length);
  pages["primitives/_category_.json"] =
    JSON.stringify(
      {
        label: "Primitives",
        position: 2.5,
        link: { type: "doc", id: "primitives/index" },
      },
      null,
      2,
    ) + "\n";
  // The Primitives index (OD-211), in the Foundations style: a card per kind in groups, each with a
  // robot, a specimen drawn from the raw values, and how many are in use. The table closes the page.
  const PRIM_GROUPS = [
    ["Color", ["color"]],
    ["Space and shape", ["space-and-size", "shape"]],
    ["Type, motion and effects", ["type", "motion", "effects"]],
  ];
  const PRIM_ROBOT = {
    color: "swatch",
    "space-and-size": "measure",
    shape: "scopes/shape",
    type: "scopes/typography",
    motion: "scopes/motion",
    effects: "scopes/elevation",
    other: "scopes/naming",
  };
  const rem = (v) => {
    const m = String(v).match(/^([\d.]+)(rem|px)$/);
    return m ? Number(m[1]) * (m[2] === "rem" ? 16 : 1) : NaN;
  };
  // Each primitive card's few samples, as kind and value (OD-284).
  const primSpecimen = (k) => {
    const used = k.list.filter((x) => usedBy[x.path]);
    const pick = used.length ? used : k.list;
    if (k.id === "color") {
      // One used step from each family, so the specimen is the palette in use.
      const hues = {};
      for (const x of pick.filter(
        (y) => /^#/.test(String(y.ref)) && !/\.dark\./.test(y.path),
      )) {
        const hue = x.path.split(".")[1];
        const step = Number(x.path.split(".").pop());
        const best = hues[hue];
        if (!best || Math.abs(step - 600) < Math.abs(best.step - 600))
          hues[hue] = { ...x, step };
      }
      return Object.values(hues)
        .slice(0, 8)
        .map((x) => ({ kind: "color", value: String(x.ref) }));
    }
    if (k.id === "space-and-size")
      return [...new Set(pick.map((x) => rem(x.ref)).filter((n) => n > 0))]
        .sort((a, b) => a - b)
        .slice(0, 7)
        .map((n) => ({ kind: "column", value: `${n}px` }));
    if (k.id === "shape")
      return [
        ...new Set(
          pick
            .filter((x) => x.path.startsWith("radius."))
            .map((x) => String(x.ref))
            .filter((v) => rem(v) < 999),
        ),
      ]
        .slice(0, 4)
        .map((v) => ({ kind: "radius", value: v }));
    if (k.id === "type") {
      const fams = pick
        .filter((x) => x.path.startsWith("font.family."))
        .slice(0, 2);
      return [
        ...fams.map((x) => ({
          kind: "font",
          value: String(cssValue(x.ref)).replace(/"/g, "'"),
        })),
        {
          kind: "text",
          value: fams
            .map((x) =>
              String(cssValue(x.ref)).split(",")[0].replaceAll('"', ""),
            )
            .join(" · "),
        },
      ];
    }
    if (k.id === "motion") {
      const ds = pick
        .filter((x) => x.path.startsWith("duration."))
        .map((x) => String(x.ref));
      return ds.length ? [{ kind: "duration", value: ds[0], note: ds[0] }] : [];
    }
    if (k.id === "effects")
      return pick
        .filter((x) => x.path.startsWith("shadow.") && !/none/.test(x.path))
        .slice(0, 3)
        .map((x) => ({ kind: "shadow", value: String(cssValue(x.ref)) }));
    return [];
  };
  const primCard = (k) => {
    const n = k.list.filter((x) => usedBy[x.path]).length;
    const samples = primSpecimen(k);
    return {
      title: k.title,
      text: `${k.list.length} primitives · ${n} in use`,
      href: `./${k.id}`,
      ...(robots && { robot: robotPics(PRIM_ROBOT[k.id] ?? PRIM_ROBOT.other) }),
      ...(samples.length && { samples }),
      meter: {
        value: n,
        max: k.list.length,
        label: `${n} of ${k.list.length} in use`,
      },
    };
  };
  const primGrouped = new Set(PRIM_GROUPS.flatMap(([, ids]) => ids));
  const primRest = kinds.filter((k) => !primGrouped.has(k.id)).map((k) => k.id);
  pages["primitives/index.md"] =
    fm({
      title: "Primitives",
      description: `Every raw value in ${scheme.name}, and what points to it.`,
      hide_table_of_contents: true,
    }) +
    NOTE +
    `# Primitives\n\n` +
    `:::intro{${introRobot(scheme.id)}stats="${prims.length} Primitives|${nUsed} In use|${prims.length - nUsed} Spare"}\n` +
    `The raw values of ${esc(scheme.name)}. Primitives hold the values; semantic tokens give them a job (see [Foundations](../foundations/)), and components read only the jobs. Color ramps stay whole, so some color steps wait for a use; every other primitive is read by something.\n:::` +
    "\n\n" +
    [...PRIM_GROUPS, ...(primRest.length ? [["More", primRest]] : [])]
      .map(([t, ids]) => {
        const cards = ids
          .map((id) => kinds.find((k) => k.id === id))
          .filter(Boolean);
        return cards.length
          ? `## ${t}\n\n` +
              cardGrid(`primitives/${cssId(t)}`, cards.map(primCard))
          : "";
      })
      .filter(Boolean)
      .join("\n\n") +
    `\n\n## Every kind\n\n**${prims.length}** primitives. **${nUsed}** are used by a semantic token, a theme or a component key. **${prims.length - nUsed}** are not used yet.\n\n` +
    `| Kind | Primitives | Used |\n| --- | --- | --- |\n` +
    kinds
      .map(
        (k) =>
          `| [${k.title}](./${k.id}.md) | ${k.list.length} | ${k.list.filter((x) => usedBy[x.path]).length} |`,
      )
      .join("\n") +
    "\n";
  kinds.forEach((k, i) => {
    const fams = [...new Set(k.list.map((x) => family(x.path)))];
    pages[`primitives/${k.id}.md`] =
      fm({
        sidebar_position: i + 1,
        title: k.title,
        description: `${k.title} primitives in ${scheme.name}.`,
      }) +
      NOTE +
      `# ${k.title}\n\n${k.list.length} primitives, ${k.list.filter((x) => usedBy[x.path]).length} used.\n\n` +
      // Colors lead with each family as a ramp (OD-182): every step, its value, and how many tokens
      // use it. Hover a step for the list; the table under it has the detail.
      (k.id === "color"
        ? colorScales(scheme, g, fams, (id, data) => {
            (compositeData["color-scale"] ??= {})[id] = data;
            return `::color-scale{id="${id}"}`;
          }) + `\n\n## Every color\n\n`
        : "") +
      (fams.length > 1
        ? fams
            .map(
              (f) =>
                `## \`${f}\`\n\n${f === "font.family" ? fontSpecimens(k.list.filter((x) => family(x.path) === f)) : ""}${table(k.list.filter((x) => family(x.path) === f), f)}`,
            )
            .join("\n\n")
        : table(k.list, k.id)) +
      "\n";
  });

  // What a component built on shadcn reads (OD-215): each class it uses, the shadcn variable, the
  // scheme's token behind it, and the primitive and value that token ends at in every theme. Read from
  // the component's own source and the mapping the token build writes, so it cannot drift.
  const tokenPaths = Object.fromEntries(
    leaves(trees[first.id], "").map((x) => {
      const path = x.path.replace(/^\./, "");
      return [cssName(path), path];
    }),
  );
  const PART = {
    bg: "Fill",
    text: "Text",
    border: "Edge",
    "border-t": "Edge",
    "border-b": "Edge",
    "border-l": "Edge",
    "border-r": "Edge",
    "border-x": "Edge",
    "border-y": "Edge",
    ring: "Focus ring",
    "ring-offset": "Focus ring offset",
    outline: "Outline",
    fill: "Icon fill",
    stroke: "Icon stroke",
    placeholder: "Placeholder",
    caret: "Caret",
    divide: "Divider",
    accent: "Accent",
    decoration: "Underline",
  };
  const WHEN = [
    [/^hover$|^\[a\]:hover$/, "on hover"],
    [/^focus(-visible|-within)?$/, "on focus"],
    [/state=open|^open$/, "when open"],
    [/state=checked|^checked$|state=on/, "when on"],
    [/selected/, "when selected"],
    [/^disabled$|disabled/, "when disabled"],
    [/invalid/, "when invalid"],
    [/variant=destructive/, "destructive"],
    [/placeholder/, ""],
  ];
  // A component's own tokens by their CSS name (OD-234): --accordion-trigger-padding-y →
  // component.accordion.trigger.padding-y, with what each aliases.
  const compByCss = new Map();
  for (const [p, tok] of flatTokens(scheme.tokens.component ?? {}))
    compByCss.set(cssName(p), {
      path: `component.${p}`,
      alias: String(tok.$value).replace(/^\{|\}$/g, ""),
    });
  const NAMES = {
    "padding-y": "Padding, top and bottom",
    "padding-x": "Padding, left and right",
    "padding-bottom": "Padding, bottom",
    "padding-top": "Padding, top",
    "font-size": "Text size",
    "font-weight": "Weight",
    radius: "Corner",
    gap: "Gap",
    size: "Size",
    duration: "Speed",
    opacity: "Opacity",
    width: "Width",
    label: "Text",
    background: "Fill",
  };
  const human = (x) =>
    NAMES[x] ?? x.charAt(0).toUpperCase() + x.slice(1).replaceAll("-", " ");
  // the part of the component a token belongs to, and its name there: trigger.padding-y → Trigger ·
  // Padding, top and bottom; icon.@ (a color) → Icon · Color; divider → Accordion · Divider
  const anatomyOf = (path, comp, alias) => {
    // a token every component shares (component.transition.*) sits under Shared
    if (!path.startsWith(`component.${comp}.`))
      return {
        group: "Shared",
        name: human(path.split(".").slice(1).join(" ")),
      };
    const seg = path.replace(`component.${comp}.`, "").split(".");
    const kind = alias.startsWith("color.") ? "Color" : "Value";
    if (seg.length === 1) return { group: title(comp), name: human(seg[0]) };
    // primary.background.@ → Primary · Background, beside its hover; icon.@ → Icon · Color
    if (seg.at(-1) === "@" && seg.length > 2)
      return { group: human(seg[0]), name: human(seg.slice(1, -1).join(" ")) };
    if (seg.at(-1) === "@")
      return { group: human(seg.slice(0, -1).join(" ")), name: kind };
    return { group: human(seg[0]), name: human(seg.slice(1).join(" ")) };
  };
  const readsOf = (name) => {
    const file = join(roots.ui, "components", `${name}.tsx`);
    if (!existsSync(file)) return [];
    const src = readFileSync(file, "utf8");
    const rows = new Map();
    for (const cls of src.match(/[!\w:[\]=&>*()+.,'"\/-]+/g) ?? []) {
      // Variants before the last colon outside brackets; the utility after it.
      const segs = [];
      let depth = 0;
      let cur = "";
      for (const ch of cls) {
        if (ch === "[") depth++;
        if (ch === "]") depth--;
        if (ch === ":" && depth === 0) {
          segs.push(cur);
          cur = "";
        } else cur += ch;
      }
      const util = cur.replace(/^!/, "").replace(/\/\d+$/, "");
      const states = segs;
      let row;
      const own = util.match(/var\(--([a-z0-9-]+)\)/);
      const comp = own && compByCss.get(own[1]);
      if (comp) {
        const a = anatomyOf(comp.path, name, comp.alias);
        row = {
          part: a.name,
          group: a.group,
          variable: own[1],
          own: true,
          alias: comp.alias,
          cls: util,
          lookup: comp.path,
          path: comp.path,
        };
      }
      const color =
        !row &&
        util.match(
          /^(bg|text|border(?:-[tblrxy])?|ring-offset|ring|outline|fill|stroke|divide|placeholder|caret|accent|decoration)-([a-z0-9-]+)$/,
        );
      if (color && SHADCN[color[2]])
        row = {
          part: PART[color[1]],
          variable: color[2],
          token: SHADCN[color[2]],
        };
      else if (/^border(-[tblrxy])?$/.test(util))
        row = {
          part: "Edge",
          variable: "border",
          token: SHADCN.border,
          cls: util,
        };
      else {
        const scale = util.match(
          /^(rounded(?:-[tblrse]{1,2})?|shadow|text)-(xs|sm|md|lg|xl|base)$/,
        );
        const key =
          scale &&
          `--${scale[1].startsWith("rounded") ? "radius" : scale[1]}-${scale[2]}`;
        if (key && SHADCN_SCALE[key])
          row = {
            part: key.startsWith("--radius")
              ? "Corner"
              : key.startsWith("--shadow")
                ? "Shadow"
                : "Text size",
            variable: key.slice(2),
            token: SHADCN_SCALE[key].replace(/^var\(--(.+)\)$/, "$1"),
          };
      }
      if (!row || (!row.own && !tokenPaths[row.token])) continue;
      const when = states
        .map((st) => WHEN.find(([re]) => re.test(st))?.[1])
        .filter(Boolean);
      row.when = [...new Set(when)].join(", ");
      row.cls = row.cls ?? util;
      // The lookup keeps a base's @; the page shows the token without it.
      row.lookup = row.lookup ?? tokenPaths[row.token];
      row.path = row.path ?? row.lookup.replace(/\.@$/, "");
      // A token of its own shows once, in its plainest state (disabled covers disabled and hovered).
      const k = row.own ? row.path : `${row.part}|${row.path}|${row.when}`;
      const had = rows.get(k);
      if (!had || (row.own && row.when.length < had.when.length))
        rows.set(k, row);
    }
    const order = [
      "Fill",
      "Text",
      "Edge",
      "Divider",
      "Focus ring",
      "Focus ring offset",
      "Outline",
      "Icon fill",
      "Icon stroke",
      "Placeholder",
      "Caret",
      "Accent",
      "Underline",
      "Corner",
      "Shadow",
      "Text size",
    ];
    return [...rows.values()].sort(
      (a, b) =>
        order.indexOf(a.part) - order.indexOf(b.part) ||
        (a.when ? 1 : 0) - (b.when ? 1 : 0) ||
        a.cls.localeCompare(b.cls),
    );
  };
  const brandName = (b) => scheme.tokens.brands?.[b]?.label ?? b;
  const themeLabel = (t) =>
    `${Object.keys(scheme.tokens.brands ?? {}).length > 1 ? `${brandName(t.brand)} ` : ""}${t.mode.charAt(0).toUpperCase()}${t.mode.slice(1)}`;
  // own tokens resolve through the theme's alias chain (cli/src/lands.mjs), the same one get_scales uses
  const themeIx = {};
  const ownEnd = (row, t) => {
    themeIx[t.id] ??= tokenIndex(scheme, {
      brand: t.brand ?? Object.keys(scheme.tokens.brands)[0],
      mode: t.mode ?? t.id,
    });
    const ch = aliasChain(themeIx[t.id], row.path);
    return { raw: String(cssValue(ch.value) ?? ""), prim: ch.end };
  };
  // One value cell as data for the TokenTable composite (OD-284): a swatch when the value has one,
  // the primitive an own token ends at, and the value as text.
  const readCell = (row, t) => {
    const own = row.own ? ownEnd(row, t) : null;
    const raw = own ? own.raw : String(value(t, row.lookup, ""));
    const prim =
      (own ? own.prim : primitiveOf(t, row.lookup))?.replace(/^color\./, "") ??
      "";
    const hex = raw.match(/#[0-9a-f]{6,8}/i)?.[0];
    if (row.part === "Shadow")
      return { swatch: { shadow: raw }, text: prim || raw };
    const swatch =
      row.part === "Corner"
        ? { corner: raw }
        : hex
          ? { color: hex }
          : undefined;
    // an own token's value: the primitive as a token, its raw value as plain text beside it (OD-234)
    if (row.own) return { swatch, token: prim || undefined, text: raw };
    return {
      swatch,
      text: `${prim}${prim && raw ? " · " : ""}${raw}`.replace(/ · $/, ""),
    };
  };
  const sameCells = (cells) =>
    cells.every((c) => JSON.stringify(c) === JSON.stringify(cells[0]));
  // own tokens in the order the component defines them, grouped by part; system reads after
  const compOrder = [...compByCss.values()].map((x) => x.path);
  const orderRows = (rows) => {
    if (!rows.some((r) => r.own)) return rows;
    const groups = [
      ...new Set(
        rows
          .filter((r) => r.own)
          .sort((a, b) => compOrder.indexOf(a.path) - compOrder.indexOf(b.path))
          .map((r) => r.group),
      ),
    ];
    return [
      ...groups.flatMap((g) =>
        rows
          .filter((r) => r.own && r.group === g)
          .sort(
            (a, b) => compOrder.indexOf(a.path) - compOrder.indexOf(b.path),
          ),
      ),
      ...rows
        .filter((r) => !r.own)
        .map((r) => ({ ...r, group: "From the system" })),
    ];
  };
  const tokensRead = (name) => {
    const rows = readsOf(name);
    if (!rows.length)
      return `## Tokens it reads\n\n${title(name)} sets no colors, corners or shadows of its own; it takes them from the components inside it.`;
    const ths = scheme.themes;
    const tokens = new Set(rows.map((r) => r.path)).size;
    return (
      `## Tokens it reads\n\n${
        rows.some((r) => r.own)
          ? `${title(name)} reads ${new Set(rows.filter((r) => r.own).map((r) => r.path)).size} tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of ${title(name)}'s tokens to change ${title(name)} alone.`
          : `${title(name)} reads ${tokens} of ${esc(scheme.name)}'s tokens. Each row follows one part of the component from its class to the value it ends at, in every theme. Change a token in the scheme and every component that reads it follows.`
      }\n\n` +
      tokenTable(
        name,
        rows.some((r) => r.own) ? ownTable(rows, ths) : classTable(rows, ths),
      )
    );
  };
  // Each table is data in _composites.json; the page holds one directive line (OD-284).
  const tokenTable = (name, data) => {
    (compositeData["token-table"] ??= {})[name] = data;
    return `::token-table{component="${name}"}`;
  };
  // A component with its own tokens (OD-234): Part · its token → the semantic, with the CSS variable
  // under it · one Value column. Colors show each theme side by side; everything else has one value.
  // the legend (OD-234): the scheme decides what a theme switch changes; the marked rows are the ones it moves
  const themeLegend = () => {
    const brands = Object.keys(scheme.tokens.brands).length;
    const lands = answer("theming.lands")
      ? label("theming.lands").toLowerCase()
      : "colors";
    const between =
      brands > 1
        ? "between its brands and between light and dark"
        : "between light and dark";
    return {
      label: "Changes with theme",
      text: `${scheme.name} decides what changes when you switch theme. Here a switch changes ${lands}, so the marked rows differ ${between}; everything else holds steady.`,
      title: `${scheme.name} gives it a different value in each theme`,
    };
  };
  const ownTable = (rows, ths) => ({
    kind: "own",
    legend: themeLegend(),
    head: ["Part", "Its token and the semantic it aliases", "Value"],
    rows: orderRows(rows).map((r) => {
      const cells = ths.map((t) => readCell(r, t));
      const same = sameCells(cells);
      return {
        group: r.group,
        part: r.part,
        when: r.when,
        themed: !same,
        chain: r.own
          ? {
              token: r.path.replace(/\.@$/, ""),
              alias: r.alias.replace(/\.@$/, ""),
              variable: r.variable,
            }
          : { system: r.path, variable: r.variable },
        values: same
          ? [cells[0]]
          : ths.map((t, j) => ({ theme: themeLabel(t), ...cells[j] })),
      };
    }),
  });
  // A component that reads system tokens straight through its classes: Part · class → variable → token ·
  // a column per theme.
  const classTable = (rows, ths) => ({
    kind: "class",
    head: ["Part", "From the class to the token", ...ths.map(themeLabel)],
    rows: rows.map((r) => {
      const cells = ths.map((t) => readCell(r, t));
      return {
        part: r.part,
        when: r.when,
        chain: { cls: r.cls, variable: r.variable, token: r.path },
        values:
          sameCells(cells) && ths.length > 1
            ? [
                {
                  ...cells[0],
                  text: `${cells[0].text}, every theme`,
                  span: ths.length,
                },
              ]
            : cells,
      };
    }),
  });

  // Components
  pages["components/_category_.json"] =
    JSON.stringify(
      {
        label: "Components",
        position: 4,
        link: { type: "doc", id: "components/inventory" },
      },
      null,
      2,
    ) + "\n";
  const built = readdirSync(join(roots.ui, "components"))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort();
  const inventory = Object.fromEntries(
    (scheme.inventory?.in ?? []).map((i) => [i.id, i.why]),
  );
  const out = Object.fromEntries(
    (scheme.inventory?.out ?? []).map((i) => [i.id, i.why]),
  );
  // What to use instead of a left-out component (OD-211), each a component the scheme keeps.
  const instead = Object.fromEntries(
    (scheme.inventory?.out ?? []).map((i) => [i.id, i.instead ?? []]),
  );
  const catalogue = g.catalogue?.items ?? [];
  // The inventory page (OD-209): what the scheme carries, grouped by family as cards, then what it
  // leaves out and why. Every catalogue item appears once, with whether it is built yet.
  const FAMILY_TEXT = {
    action: "Things people press.",
    form: "Things people fill in.",
    data: "Tables and charts.",
    feedback: "Status and messages.",
    navigation: "Ways around.",
    overlay: "Things that float above the page.",
    layout: "The frame around content.",
    content: "Ways to show more content.",
    media: "Pictures and slides.",
  };
  const FAMILY_ORDER = [
    "action",
    "form",
    "data",
    "feedback",
    "navigation",
    "overlay",
    "layout",
    "content",
    "media",
  ];
  const families = [
    ...new Set([...FAMILY_ORDER, ...catalogue.map((c) => c.family)]),
  ];
  // Only a component with a page links to it: built, and in the inventory unless every page is made.
  const hasPage = (id) => built.includes(id) && (all || id in inventory);
  // An inventory card (OD-284: a CardGrid card). Every card says what the component is (OD-213). The
  // scheme's rule, or why it leaves the component out, is on the component's page.
  const icard = (c, out) => ({
    title: title(c.id),
    text: c.description ?? "",
    label: out
      ? { text: "Left out", tone: "warning" }
      : { text: "In · built", tone: "info" },
    ...(hasPage(c.id) && { href: `./${c.id}` }),
  });
  const inItems = catalogue.filter((c) => c.id in inventory);
  const outItems = catalogue.filter((c) => !(c.id in inventory));
  pages["components/inventory.md"] =
    fm({
      sidebar_position: 0,
      title: "Inventory",
      description: `The components ${scheme.name} carries.`,
      hide_table_of_contents: true,
    }) +
    NOTE +
    `# Inventory

` +
    `:::intro{${introRobot("shelf")}stats="${Object.keys(inventory).length} In|${outItems.length} Left out|${new Set(inItems.map((c) => c.family)).size} Families"}\n` +
    `**${Object.keys(inventory).length}** components are in ${esc(scheme.name)}. The components answers picked them (see [Components](../foundations/components)). Anything not in is out, and its page says why.\n:::` +
    "\n\n" +
    families
      .map((f) => {
        const list = inItems
          .filter((c) => c.family === f)
          .sort((a, b) => a.id.localeCompare(b.id));
        if (!list.length) return "";
        return (
          `## ${title(f)}\n\n${FAMILY_TEXT[f] ?? ""} ${list.length} in ${esc(scheme.name)}.\n\n` +
          cardGrid(
            `inventory/${f}`,
            list.map((c) => icard(c)),
          )
        );
      })
      .filter(Boolean)
      .join("\n\n") +
    (outItems.length
      ? `\n\n## Left out\n\nThe components answers did not pick these.${all ? " Each page still shows how it would look." : ""}\n\n` +
        cardGrid(
          "inventory/left-out",
          outItems
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((c) => icard(c, true)),
        )
      : "") +
    "\n";
  // A page per component that is in the inventory and built (OD-194). It reads the same engine as the
  // CLI's component command and the MCP's get_component, so the docs, Storybook and agents agree, and
  // adds what Storybook cannot: the answers behind each decision and what a change would move.
  const names = built.filter((n) => all || !scheme.inventory || n in inventory);
  const leftOut = (n) => Boolean(scheme.inventory) && !(n in inventory);
  // Embeds open the story in this design system: the Open DS Storybook reads the scheme (and the first
  // brand) from its toolbar global; a created project's Storybook has one scheme and ignores it.
  const brandIds = Object.keys(scheme.tokens.brands ?? {});
  const sbScheme = `scheme:${scheme.id}${brandIds.length > 1 ? `--${brandIds[0]}` : ""}`;
  const pageOf = (id) =>
    names.includes(id) ? `[${title(id)}](./${id}.md)` : title(id);
  const qText = (id) => qs[id]?.text ?? id;
  // The Anatomy reference (OD-229): the component taken apart, part by part, from the anatomy engine
  // that get_component also returns. A part whose value changes between schemes carries a "By scheme"
  // tag; each token follows the decision to the value: the semantic's rule, the pick and its reason in
  // light and dark, what else picks the same step, and the answers it follows from.
  const byTag = `:label[By scheme]{tone="info"}`;
  const partName = (p) =>
    p === "root"
      ? "The component"
      : p.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
  function anatomyPage(name, i) {
    // The Anatomy reference (OD-229), as the approved Figma page lays it out: a calm intro, the roles
    // a part can play, the drawing with a number on each part beside its legend, then one card per
    // group of parts that follows each decision from the answer through the rule to the token and the
    // value you see. The parts come from the catalogue's parts layer; the words and values from the
    // scheme, so every scheme gets its own page.
    const spec = g.catalogue.items.find((x) => x.id === name)?.anatomy;
    if (!spec) return null;
    const T = title(name);
    // One engine with open-ds anatomy and get_anatomy: the cards' answers, rules and tokens come from it.
    const ref = anatomyReference(scheme, g, roots, name);
    const refCard = Object.fromEntries(ref.cards.map((c) => [c.title, c]));
    // Figma assets (OD-229): the drawings are frames in Figma, drawn from this scheme's tokens and
    // exported into docs/static/anatomy/<scheme>/<component>/. Each image links back to its frame, so
    // the drawing is seen and changed in Figma.
    // A tree drawing (OD-229) is drawn in Figma by the Open DS anatomy plugin, bound to the scheme's kit,
    // and its frames are exported to the same place. Until they are, the page says so in their place.
    const tree = spec.drawing?.kind === "tree";
    const asset = spec.drawing?.kind === "asset" || tree;
    const exportedIn = (id, file) =>
      existsSync(
        join(
          roots.schemes,
          "..",
          "docs",
          "static",
          "anatomy",
          id,
          name,
          `${file}.png`,
        ),
      );
    // Until a scheme's own drawings are exported, its page borrows Dense data's and says so.
    const FALLBACK = "dense-data";
    const imgScheme = (file) =>
      exportedIn(scheme.id, file)
        ? scheme.id
        : tree && exportedIn(FALLBACK, file)
          ? FALLBACK
          : null;
    const exported = (file) => imgScheme(file) !== null;
    const borrowed =
      tree && scheme.id !== FALLBACK && imgScheme("stage") === FALLBACK;
    const figmaLink = (node) =>
      node && spec.drawing.figma?.file
        ? `\n\n[Open in Figma](https://www.figma.com/design/${spec.drawing.figma.file}/?node-id=${node.replace(":", "-")})`
        : "";
    // An exported drawing is a Markdown image, linked to its Figma frame (OD-284).
    const assetImg = (file, node, alt) =>
      tree && !exported(file)
        ? `Drawn in Figma by the Open DS anatomy plugin; the image is not exported yet.`
        : `![${esc(alt)}](/anatomy/${imgScheme(file) ?? scheme.id}/${name}/${file}.png)${figmaLink(node)}`;
    const roleOf = Object.fromEntries(
      (g.anatomy?.roles ?? []).map((r) => [r.id, r]),
    );
    const trace = (p) => tokenTrace(scheme, g, roots, p);
    const traces = new Map();
    const tr = (p) =>
      traces.has(p) ? traces.get(p) : (traces.set(p, trace(p)), traces.get(p));
    const flat = (list) => list.flatMap((x) => [x, ...flat(x.children ?? [])]);
    const parts = flat(spec.parts);
    const changes = (part) => (part.tokens ?? []).some((t) => tr(t)?.by_scheme);
    const chip = (id) => `:label[${esc(roleOf[id]?.label ?? id)}]`;
    // The drawing, from the scheme's own component variables: what you see is what the scheme decides.
    // An AnatomyDrawing composite draws it from data beside the page (OD-284).
    const drawn = (id, data) => {
      (compositeData["anatomy-drawing"] ??= {})[`${name}/${id}`] = data;
      return `::anatomy-drawing{id="${name}/${id}"}`;
    };
    const drawing = (id, rows, show, whole) =>
      drawn(id, {
        kind: "menu",
        rows,
        show: [...show],
        whole,
        surface: spec.drawing.surface ?? [],
        shadow: spec.drawing.shadow ?? [],
      });
    // A table, from the table's and the data table's own variables: toolbar, frame, header, rows. The
    // empty state is the Empty component's, so it is not drawn here.
    const tableDrawing = (id, sections, show) => {
      const d = spec.drawing;
      return drawn(id, {
        kind: "table",
        sections,
        show: [...show],
        toolbar: d.toolbar,
        columns: d.columns,
        header: d.header,
        rows: d.rows,
        frame: d.frame,
      });
    };
    const allNums = new Set(parts.filter((p) => p.n).map((p) => p.n));
    const rowsFor = (nums) => {
      const r = spec.drawing.rows;
      const has = (row) =>
        Object.values(row.marks ?? {}).some((n) => nums.has(n));
      if (nums.has(1) || nums.has(2)) return { rows: r, whole: true };
      // The row that holds most of the card's parts (Copy holds the icon, label and shortcut).
      const hits = (row) =>
        Object.values(row.marks ?? {}).filter((n) => nums.has(n)).length;
      const best = Math.max(
        0,
        ...r.map((row) => (row.separator ? 0 : hits(row))),
      );
      const i = best
        ? r.findIndex((row) => !row.separator && hits(row) === best)
        : -1;
      // A separator is drawn with the rows on either side of it.
      const sep = r.findIndex(
        (row) =>
          row.separator &&
          Object.values(row.marks ?? {}).some((n) => nums.has(n)),
      );
      if (sep >= 0)
        return { rows: r.slice(Math.max(0, sep - 1), sep + 2), whole: false };
      return { rows: i >= 0 ? [r[i]] : [], whole: false };
    };
    const px = (v) => (/rem$/.test(v) ? `${parseFloat(v) * 16}px` : v);
    const tableCaption = (() => {
      if (spec.drawing.kind !== "table") return "";
      const v = (p) => px(tr(p)?.light.value ?? "");
      return `${attr(scheme.name)}, light, drawn from the scheme's tokens: ${v("component.table.row-height")} rows, ${v("component.table.cell-padding-x")} cell padding, ${v("component.table.font-size")} text and a ${v("component.data-table.container.radius")} frame corner.`;
    })();
    const D = tr("component.overlay.item-height");
    const caption = `${attr(scheme.name)}, light, drawn from the scheme's tokens: ${px(D?.light.value ?? "")} items, ${px(tr("component.dropdown-menu.item.padding-x")?.light.value ?? "")} side padding, ${px(tr("component.dropdown-menu.item.font-size")?.light.value ?? "")} text, a ${px(tr("component.overlay.radius")?.light.value ?? "")} corner and its shadow.`;
    // The legend (OD-284): a nested Markdown list, one item per part, with its number, what it needs,
    // the "By scheme" tag and its roles as Labels.
    const legendRow = (p, depth) => {
      const need = `${p.need}${p.note ? ` · ${p.note}` : ""}${p.n && !(p.tokens ?? []).length && p.need !== "required" ? " · no token yet" : ""}`;
      return `${"  ".repeat(depth)}- ${p.n ? `**${p.n}** ` : ""}**${esc(p.label)}** ${esc(need)}${changes(p) ? ` ${byTag}` : ""}${(p.roles ?? []).length ? ` ${p.roles.map(chip).join(" ")}` : ""}`;
    };
    const legend = (list, depth = 0) =>
      list
        .flatMap((p) => [
          legendRow(p, depth),
          ...(p.children ? [legend(p.children, depth + 1)] : []),
        ])
        .join("\n");
    // Each card's steps (OD-284): a Markdown list, from the answer through the rule to the token.
    const answerStep = (a) =>
      `- **Answer** ${esc(a.scope ? `${a.scope} · ` : "")}${esc(a.text)} → ${esc(a.answer)}\n\n  ${esc(a.why)}`;
    const ruleStep = (u) =>
      `- **Rule** For ${esc(lower(u.title))}, use ${esc(u.use)}.${u.not ? ` Don't use ${esc(lower(u.not))}.` : ""}${u.why ? `\n\n  ${esc(u.why)}` : ""}`;
    const tokenStep = (t) => {
      if (!t) return "";
      const said = (x) => esc(x.why ?? x.pick);
      const dark =
        t.dark.value !== t.light.value ? ` · dark ${esc(t.dark.value)}` : "";
      const lines = [
        `  - **Pick** ${said(t.light)}`,
        t.dark.value !== t.light.value || t.dark.why !== t.light.why
          ? `  - **Dark** ${said(t.dark)}`
          : "",
        t.shares.length
          ? `  - **Shares the step with** ${t.shares.map((x) => esc(x.replace(/^color\./, ""))).join(", ")}. Changing this pick moves only what reads ${esc(t.semantic)}.`
          : "",
      ].filter(Boolean);
      return (
        `- **Token** \`${t.semantic}\` ${t.key ? `→ \`${t.key.replace(`${name}.`, "")}\`` : "no key of its own yet"} ${esc(t.light.value)}${dark}${t.by_scheme ? ` ${byTag}` : ""}` +
        (t.rule ? `\n\n  ${esc(t.rule)}` : "") +
        `\n\n${lines.join("\n")}`
      );
    };
    // One Panel per card (OD-284): its drawing, its parts and roles, and its steps.
    const card = (c, k) => {
      const nums = new Set(c.parts);
      const d = refCard[c.title];
      const steps = [
        ...d.answers.map(answerStep),
        ...d.rules.map(ruleStep),
        ...d.tokens.map(tokenStep),
      ].filter(Boolean);
      let image;
      if (asset)
        image = assetImg(
          `card-${k + 1}`,
          c.figma?.[scheme.id],
          `${c.title}: ${c.parts.join(", ")}`,
        );
      else if (spec.drawing.kind === "table")
        image = tableDrawing(`card-${k + 1}`, c.image?.sections ?? [], nums);
      else {
        const own =
          c.image && spec.drawing.rows.find((r) => r.label === c.image.row);
        const { rows, whole } = own
          ? {
              rows: [{ ...own, state: undefined, marks: c.image.marks }],
              whole: false,
            }
          : rowsFor(nums);
        image = drawing(`card-${k + 1}`, rows, nums, whole);
      }
      return (
        `:::panel{id="part-${c.parts.join("-")}" title="${c.title.replaceAll('"', "'")}" note="Parts ${c.parts.join(", ")}"}\n` +
        `${image}\n\n` +
        (c.roles.length ? `${c.roles.map(chip).join(" ")}\n\n` : "") +
        `${steps.join("\n\n")}\n:::`
      );
    };
    const intro =
      `:::intro{${introRobot("anatomy")}title="Look closer, when you want to"}\n` +
      `This page takes ${esc(spec.intro ?? T)} apart to show how design decisions become the parts you see. You don't need it to use ${esc(spec.intro ?? T)}: [its own page](../${name}) has everything you need to build.\n\n` +
      `**Three easy ways in**\n\n` +
      `- Start with the drawing. Each number is one part, and the legend beside it names it.\n` +
      `- Want to know why a part looks the way it does? Its card follows the decision from the answer about the product, through the rule and the token, to what you see.\n` +
      `- Or start from a job, like Focus or Emphasis, and find every part that does it in the legend.\n\n` +
      `Come back whenever a part makes you wonder why.\n:::`;
    const roles = (g.anatomy?.roles ?? [])
      .map((r) => `- **${esc(r.label)}** ${esc(r.ask)}`)
      .join("\n");
    // The drawing with every part numbered, its caption, then the legend (OD-284).
    const stage = asset
      ? assetImg(
          "stage",
          spec.drawing.figma?.stage?.[scheme.id],
          `${T}, every part numbered`,
        )
      : spec.drawing.kind === "table"
        ? tableDrawing("stage", ["toolbar", "table"], allNums)
        : drawing("stage", spec.drawing.rows, allNums, true);
    const stageCaption = asset
      ? borrowed
        ? `Dense data's drawing, shown until ${esc(scheme.name)}'s own is exported; the parts and the decisions below are ${esc(scheme.name)}'s.`
        : `${esc(scheme.name)}, light, drawn in Figma from the scheme's tokens.`
      : spec.drawing.kind === "table"
        ? esc(tableCaption)
        : esc(caption);
    const partsBlock =
      `${stage}\n\n*${stageCaption}*\n\n` +
      `Legend: every part and its roles. The numbers match the drawing; a part without one isn't in this example.\n\n` +
      `${byTag} Its value changes by scheme. The part is the same in every scheme.\n\n` +
      legend(spec.parts);
    return (
      fm({
        sidebar_position: i + 1.5,
        // Served under its component: /components/<name>/anatomy (a slug relative to the folder).
        slug: `${name}/anatomy`,
        sidebar_label: "Anatomy reference",
        sidebar_class_name: "ods-anatomy",
        hide_table_of_contents: true,
        title: "Anatomy reference",
        description: `How the design decisions reach each part of ${T} in ${scheme.name}.`,
      }) +
      NOTE +
      [
        intro,
        `## Design roles\n\nEach part does a job for the person. These are the jobs, as questions the part answers.\n\n${roles}`,
        `## The parts\n\n${partsBlock}`,
        `## How the decisions reach each part\n\nEach part follows a chain: an answer about the product, the rule it set, the token that carries it, and the value you see. The numbers match the drawing.\n\n${spec.cards.map((c, k) => card(c, k)).join("\n\n")}`,
        `## For agents\n\nAgents get this same anatomy: every part, its roles, whether it is required, the tokens it reads and the decisions behind them.\n\n- **From an AI agent:** call the \`get_anatomy\` tool on the Open DS MCP server, with this scheme and \`${name}\`.\n- **From a terminal:** \`npx open-ds anatomy ${scheme.id} ${name}\``,
      ].join("\n\n") +
      "\n"
    );
  }

  const contentWords = Object.entries(scheme.tokens.content?.action ?? {})
    .filter(([k]) => !k.startsWith("$"))
    .map(([k, v]) => `- \`content.action.${k}\`: ${esc(v.$value)}`);
  names.forEach((name, i) => {
    const group = KEY_GROUP[name];
    const keys = g.component_keys.filter((k) => k.component === group);
    const guide = componentGuide(scheme.id, name, roots, g);
    const r = guide?.reference ?? {};
    const parts = [];
    // OD-229: the Anatomy reference follows the approved Figma page. Only a component whose catalogue
    // entry describes its parts (the parts layer) gets one. Its card sits after the variants.
    const anat = anatomyPage(name, i);
    const anatSpec = g.catalogue.items.find((x) => x.id === name)?.anatomy;
    const leaves = (list) =>
      list.flatMap((p) =>
        p.children
          ? leaves(p.children)
          : /^shown by/.test(p.note ?? "")
            ? []
            : [p],
      );
    const anatCard = anat
      ? cardGrid(`anatomy-link/${name}`, [
          {
            title: "Anatomy reference",
            text: `Every part of ${anatSpec.intro}, the job it does, and the decisions behind it. ${leaves(anatSpec.parts).length} parts.`,
            href: `./${name}/anatomy`,
            go: true,
          },
        ])
      : "";
    parts.push(
      `# ${title(name)}\n\n${esc(r.overview ?? componentIntro(roots.ui, name))}\n\n` +
        // Left out or in, the page is the same (OD-192, OD-211): a left-out component is designed in
        // the scheme's tokens like any other, and only adds its badge, its reason and what to use.
        // The status is a Label composite (OD-284): a directive in the Markdown, drawn by the scheme's Badge.
        (leftOut(name)
          ? `:label[Left out of ${esc(scheme.name)}]{tone="warning"} ${esc(out[name] ?? guide?.why ?? "")}` +
            ((instead[name] ?? []).length
              ? ` Use instead: ${instead[name].map((x) => (names.includes(x) ? `[${title(x)}](./${x})` : title(x))).join(", ")}`
              : "")
          : `:label[In ${esc(scheme.name)}]{tone="info"}`),
    );
    // The live component, from Storybook (OD-183), in light and dark: a Preview composite (OD-284).
    // The link works where the embed cannot load.
    (compositeData.preview ??= {})[`${name}/live`] = {
      title: `${title(name)} examples in Storybook`,
      wait: "Start Storybook to see it live: npm run storybook",
      frames: {
        light: `${storybook}/iframe.html?id=components-${name}--examples&viewMode=story&globals=${sbScheme};mode:light`,
        dark: `${storybook}/iframe.html?id=components-${name}--examples&viewMode=story&globals=${sbScheme};mode:dark`,
      },
      caption: "Live from Storybook",
      links: [
        {
          text: `Open ${title(name)} in Storybook`,
          href: `${storybook}/?path=/docs/components-${name}--docs`,
        },
      ],
    };
    parts.push(`## See it live\n\n::preview{${introRobot("slumber")}id="${name}/live"}`);
    // A kept component's own use leads "When to use it" (OD-211): where this scheme uses it, then
    // what it is for in any design system.
    const ownUse = leftOut(name) ? "" : (guide?.why ?? inventory[name] ?? "");
    if (r.apply_when || ownUse)
      parts.push(
        `## When to use it\n\n` +
          (ownUse ? `**In ${esc(scheme.name)}:** ${esc(ownUse)}\n\n` : "") +
          (r.apply_when
            ? `- **Use it when:** ${esc(r.apply_when)}\n- **Not when:** ${esc(r.not_when)}`
            : "") +
          (r.vs?.length
            ? `\n\nInstead:\n\n${r.vs.map((v) => `- ${v.outside ? esc(title(v.id)) : pageOf(v.id)}: ${esc(v.why)}`).join("\n")}`
            : ""),
      );
    const variants = guide?.variants ?? [];
    // Each variant is its own full-width section (OD-203): a live sample, then what it is for, what
    // this scheme decided, and the answers behind it, each as its own topic.
    // A "Because" answer as a link to its card below (#why-...), or its key when unanswered.
    const answerLink = (b) =>
      answer(b)
        ? `- [${esc(qText(b))} **${esc(label(b))}**](#why-${b.replace(/\./g, "-")}) · \`${b}\``
        : `- \`${b}\``;
    // Each variant is a Panel around its own Markdown (OD-203, OD-284): a live sample, what it is for,
    // what this scheme decided, and the answers behind it.
    if (variants.length)
      parts.push(
        `## Variants\n\nWhat each variant is for in any design system, then what ${esc(scheme.name)} decided and why. Each sample is the live story with that variant set.\n\n` +
          variants
            .map((v) => {
              const d = v.here;
              const used = d && !d.not_used;
              const [state, tone] = !d
                ? ["Not decided yet", "neutral"]
                : used
                  ? [`Used in ${scheme.name}`, "success"]
                  : [`Not used in ${scheme.name}`, "neutral"];
              let stage = "";
              if (v.axis !== "state") {
                const id = `${name}/${v.axis}/${v.id}`;
                (compositeData.preview ??= {})[id] = {
                  title: `${title(name)} ${v.id}`,
                  wait: "Start Storybook to see it live",
                  frames: {
                    light: `${storybook}/iframe.html?id=components-${name}--playground&viewMode=story&globals=${sbScheme};mode:light&args=${v.axis}:${v.id}`,
                  },
                };
                stage = `::preview{${introRobot("slumber")}id="${id}"}\n\n`;
              }
              const when = [
                v.reference.apply_when
                  ? `- ✓ ${esc(v.reference.apply_when)}`
                  : "",
                v.reference.not_when ? `- ✕ ${esc(v.reference.not_when)}` : "",
              ].filter(Boolean);
              return (
                `:::panel{title="${v.id}" note="${v.axis}" label="${state}" tone="${tone}"}\n` +
                stage +
                `**What it is for**\n\n${esc(v.reference.overview)}\n\n` +
                (when.length ? `${when.join("\n")}\n\n` : "") +
                `**In ${esc(scheme.name)}**\n\n${esc(!d ? "Not decided yet." : used ? d.use : d.why)}\n\n` +
                ((d?.because ?? []).length
                  ? `**Because**\n\n${d.because.map(answerLink).join("\n")}\n`
                  : "") +
                `:::`
              );
            })
            .join("\n\n"),
      );
    const rules = guide?.rules ?? [];
    if (anatCard) parts.push(anatCard);
    if (rules.length)
      parts.push(
        `## How ${esc(scheme.name)} uses it\n\n` +
          `::::grid{columns="2"}\n` +
          rules
            .map(
              (u) =>
                `:::panel{title="${(u.title ?? u.situation).replaceAll('"', "'")}"}\n` +
                `**Use** ${esc(u.use)}\n\n**Not** ${esc(u.not)}\n\n` +
                `${esc(u.why)}${u.example ? ` Example: “${esc(u.example)}”` : ""}\n:::`,
            )
            .join("\n") +
          `\n::::`,
      );
    const cited = [
      ...new Set(variants.flatMap((v) => v.here?.because ?? [])),
    ].filter((q) => answer(q));
    // Why it works this way (OD-203): one card per answer, three steps inside: the answer, what it
    // decided for this component (and what else it shapes), and what would move if it changed.
    if (cited.length)
      parts.push(
        `## Why it works this way\n\n${title(name)} looks the way it does because of ${cited.length} answer${cited.length === 1 ? "" : "s"} about this product. Each card is one answer, in three steps: the answer, what it decided for ${title(name)}, and what would move if it changed.\n\n` +
          cited
            .map((q) => {
              const f = followers(scheme, q);
              const moved = new Set([q, ...f]);
              const here = variants.filter((v) =>
                (v.here?.because ?? []).includes(q),
              );
              const reopen = variants.filter((v) =>
                (v.here?.because ?? []).some((b) => moved.has(b)),
              ).length;
              const also = (scheme.inventory?.in ?? []).flatMap((c) =>
                c.id === name
                  ? []
                  : Object.entries(c.variants ?? {}).flatMap(([ax, vs]) =>
                      Object.entries(vs)
                        .filter(([, d]) => (d.because ?? []).includes(q))
                        .map(([vid]) => `${title(c.id)}: ${vid}`),
                    ),
              );
              const id = `${name}/${q}`;
              (compositeData["reason-chain"] ??= {})[id] = {
                anchor: `why-${q.replace(/\./g, "-")}`,
                question: qText(q),
                key: q,
                steps: [
                  {
                    kind: "answer",
                    title: "The answer",
                    answer: label(q),
                    why: answer(q).why,
                  },
                  {
                    kind: "decided",
                    title: `So ${title(name)}`,
                    lines: here.map((v) => ({
                      used: !v.here.not_used,
                      verb: v.here.not_used ? "does not use" : "uses",
                      subject: v.id,
                      text: v.here.not_used ? v.here.why : v.here.use,
                    })),
                    ...(also.length && {
                      also: { label: "It also shapes", items: also },
                    }),
                  },
                  {
                    kind: "change",
                    title: "If it changed",
                    count: reopen,
                    caption: `${title(name)} decision${reopen === 1 ? "" : "s"} would reopen`,
                    text: f.length
                      ? `and ${f.length} answer${f.length === 1 ? "" : "s"} that follow from it: ${f
                          .slice(0, 3)
                          .map((x) => label(x))
                          .join(
                            ", ",
                          )}${f.length > 3 ? `, and ${f.length - 3} more` : ""}.`
                      : "No other answer follows from it.",
                  },
                ],
              };
              return `::reason-chain{id="${id}"}`;
            })
            .join("\n\n"),
      );
    const voiceLines = (scheme.voice?.principles ?? []).map(
      (x) => `- ${esc(x.text)}`,
    );
    if (voiceLines.length || contentWords.length)
      parts.push(
        `## Words\n\n` +
          (voiceLines.length ? `${voiceLines.join("\n")}\n` : "") +
          (scheme.voice?.words
            ? `- Use: ${scheme.voice.words.use.map(esc).join(", ")}. Avoid: ${scheme.voice.words.avoid.map(esc).join(", ")}.\n`
            : "") +
          (contentWords.length
            ? `\nThe labels components use, from the voice tokens:\n\n${contentWords.join("\n")}`
            : "") +
          `\n\nSee [Voice and tone](../voice.md) for the whole voice.`,
      );
    const a11y = r.accessibility ?? [];
    const kb = r.keyboard ?? [];
    if (a11y.length || kb.length)
      parts.push(
        `## Accessibility and keyboard\n\n` +
          (kb.length
            ? `| Keyboard | What happens | Not |\n| --- | --- | --- |\n${kb.map((k) => `| ${esc(k.apply_when)} | ${esc(k.overview)} | ${esc(k.not_when)} |`).join("\n")}\n\n`
            : "") +
          (a11y.length
            ? `Test before you ship:\n\n${a11y.map((x) => `- [ ] ${esc(x.overview)} ${esc(x.apply_when)}`).join("\n")}`
            : ""),
      );
    parts.push(
      `## Use it in code\n\n\`\`\`bash\nnpx open-ds add ${name}\n\`\`\`\n\n` +
        `The component reads only component keys and semantic tokens, so it follows the brand and mode on \`<html>\`.`,
    );
    parts.push(
      keys.length && !readsOf(name).some((r) => r.own)
        ? `## Component keys\n\nThe CSS variable is the key with \`/\` replaced by \`-\` and the base \`@\` dropped. Each key points to a token; values live only on primitives.\n\n` +
            perBrand(
              (F, D) =>
                `| Key | What it controls | Points to, ${F.id} | Points to, ${D.id} |\n| --- | --- | --- | --- |\n` +
                keys
                  .map((k) => {
                    const p = k.id.replaceAll("/", ".");
                    const l = link(F, p);
                    const d = link(D, p);
                    return `| \`${k.id}\` | ${esc(k.description)} | ${l} | ${d === l ? "same" : d} |`;
                  })
                  .join("\n"),
            )
        : tokensRead(name),
    );
    if (anat) pages[`components/${name}-anatomy.md`] = anat;
    pages[`components/${name}.md`] =
      fm({
        sidebar_position: i + 1,
        title: title(name),
        description: `${title(name)} in ${scheme.name}.`,
        ...(leftOut(name) && { sidebar_class_name: "ods-left-out" }),
      }) +
      NOTE +
      parts.join("\n\n") +
      "\n";
  });

  // Themes
  const brands = Object.entries(scheme.tokens.brands);
  pages["themes.md"] =
    fm({
      sidebar_position: 5,
      title: "Themes",
      description: `Brands and modes in ${scheme.name}.`,
    }) +
    NOTE +
    `# Themes\n\n${scheme.name} ships ${scheme.themes.length} themes: ${scheme.themes.map((t) => t.id).join(", ")}. Only semantic tokens change between themes; components never do.\n\n` +
    `## How to switch\n\n- Dark mode: add the class \`dark\` to \`<html>\`.\n` +
    (brands.length > 1
      ? `- Brand: set \`data-brand\` on \`<html>\` to ${brands.map(([b]) => `\`${b}\``).join(", ")}.\n`
      : "") +
    `\n## Brands\n\n${brands.map(([b, x]) => `- **${x.label}** (\`${b}\`): ${x.description}`).join("\n")}\n\n` +
    themeColors(scheme, g);

  // For agents
  pages["agents.md"] =
    fm({
      sidebar_position: 6,
      title: "For agents",
      description: "How an AI agent builds with this design system.",
    }) +
    NOTE +
    `# For agents\n\nThis design system ships an agent layer, so an AI builds the way the system would and can say why.\n\n` +
    `- **AGENTS.md** in the project root: the rules that always apply. In a design system project it is short, and \`context/\` holds one booklet per component, color and task, with a router (\`context/index.json\`) that says what to load for a file.\n` +
    `- **The agent skill** in \`.claude/skills/open-ds/SKILL.md\`: how to pick, read and follow the scheme.\n` +
    `- **The full scheme** in \`.open-ds/scheme.json\`: every answer with its reason.\n` +
    `- **llms.txt** next to these docs: an index of these pages for agents.\n\n` +
    `Ask the open-ds CLI or MCP server:\n\n\`\`\`bash\nopen-ds why ${scheme.id} typography.definition\nopen-ds when ${scheme.id} "a number in a table"\n\`\`\`\n`;
  // Each page's composite data sits beside it, as <page>.json (OD-284): an agent that reads the raw
  // page finds the rows next to it, and the front matter names the file.
  const KEYS = {
    "token-table": "component",
    "reason-chain": "id",
    "card-grid": "id",
    preview: "id",
    specimen: "id",
    "anatomy-drawing": "id",
    "color-scale": "id",
    "mode-preview": "id",
    "pairs-chart": "id",
    "surface-stack": "id",
    "sample-screen": "id",
    "token-swatches": "id",
    "type-roles": "id",
    "primitive-table": "id",
    "color-keys": "id",
    "fill-tones": "id",
    "status-colors": "id",
    "mode-changes": "id",
    "mode-constants": "id",
    steps: "id",
    "decision-tree": "id",
    "decision-answer": "id",
  };
  for (const [p, text] of Object.entries(pages)) {
    if (!p.endsWith(".md")) continue;
    const data = {};
    for (const m of text.matchAll(/^::([a-z-]+)\{([^}]*)\}$/gm)) {
      const [, kind, attrs] = m;
      // The directive's attributes, in any order; the one its kind names holds the entry's id.
      const id = new RegExp(`(?:^|\\s)${KEYS[kind]}="([^"]+)"`).exec(attrs)?.[1];
      if (!KEYS[kind] || !id) continue;
      if (compositeData[kind]?.[id] === undefined)
        throw new Error(
          `${p}: ::${kind}{${key}="${id}"} has no data. The generator wrote the line without its rows.`,
        );
      (data[kind] ??= {})[id] = compositeData[kind][id];
    }
    if (!Object.keys(data).length) continue;
    const file = p.replace(/\.md$/, ".json");
    pages[file] = JSON.stringify(data, null, 1) + "\n";
    pages[p] = text.replace(
      /^---\n/,
      `---\ncomposite_data: "./${file.split("/").pop()}"\n`,
    );
  }
  return pages;
}

/** llms.txt for one scheme's docs: an index of its pages. */
export function docsLlms(scheme, pages) {
  const md = Object.keys(pages).filter((p) => p.endsWith(".md"));
  const href = (p) => (p === "index.md" ? "/" : `/${p.replace(/\.md$/, "")}`);
  const head = (p) => pages[p].match(/^title: "(.*)"$/m)?.[1] ?? p;
  return `# ${scheme.name}\n\n> ${scheme.summary}\n\n## Pages\n\n${md.map((p) => `- [${head(p)}](${href(p)})`).join("\n")}\n`;
}
