// Reasons on theme picks (OD-241, OD-243): each pick says why its step carries the semantic's rule
// in this scheme, brand and mode, and which answers it follows from. The why is computed from the
// values the pick meets (contrast against the scheme's own floor, the surfaces around it) or quotes
// the scheme's answer, never typed per scheme. A pick that breaks its floor gets no reason: it is a
// gap to fix, not to explain. A why written by hand (no "generated" flag) is kept.
//
//   node scripts/theme-reasons.mjs          write
//   node scripts/theme-reasons.mjs --dry    print, write nothing
import { readFileSync, writeFileSync } from "node:fs";
import { loadScheme, saveScheme, assetRoots } from "../cli/src/schemes.mjs";
import { tokenIndex, aliasChain } from "../cli/src/lands.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const roots = assetRoots();
const dry = process.argv.includes("--dry");
const hex = (x) => typeof x === "string" && /^#[0-9a-f]{6}/i.test(x);
const lum = (h) =>
  [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const r1 = (n) => `${n.toFixed(2).replace(/0$/, "")}:1`;
const name = (ref) => ref.replace(/^\{(color\.)?|\}$/g, "");
const short = (p) => p.replace(/^color\./, "").replace(/\.@$/, "");
const BROKE = Symbol("breaks its floor");

// A contrast reason: "<pick>: <what>, R:1 on <surface>, above the F:1 floor." Breaking the floor
// returns BROKE, so the pick stays a gap.
const contrast = (c, a, b, floor, what) => {
  const [x, y] = [c.v(a), c.v(b)];
  if (!hex(x) || !hex(y)) return null;
  const r = ratio(x, y);
  if (r < floor) return BROKE;
  return `${c.pick}: ${what}, ${r1(r)} on ${short(b)}, above the ${floor}:1 floor.`;
};
const step = (ref) => ref?.match(/\.(\d+)\}?$/)?.[1];

// Each rule: which theme paths it explains, the answers it follows from, and how to say why.
const RULES = [
  {
    test: /^color\.neutral\.\d+$/,
    because: ["color.definition"],
    why: (c) => `${c.pick}: the scheme's neutral is ${c.pick.split(".")[0]}. ${c.answer("color.definition")}`,
  },
  {
    test: /^color\.surface\.raised$/,
    because: ["elevation.roles", "elevation.definition"],
    why: (c) => {
      const same = c.v("color.surface.raised") === c.v("color.surface.default");
      const sh = c.v("elevation.overlay");
      const lifts = sh && typeof sh === "object" && !/00$/.test(sh.color ?? "") ? "its edge and its one shadow" : "its edge alone";
      return same
        ? `${c.pick}, the same as content (surface.default): a menu stands out by ${lifts}, not by its fill${c.mode === "dark" ? ", as in light" : ""}.`
        : `${c.pick}, one step from content (surface.default), with ${lifts}, so a menu reads as on top.`;
    },
  },
  {
    test: /^color\.border\.default$/,
    because: ["elevation.definition", "accessibility.definition"],
    why: (c) => {
      const on = ["color.surface.canvas", "color.surface.default", "color.surface.raised"].map((x) => [x, ratio(c.v("color.border.default"), c.v(x))]);
      const [low, r] = on.sort((a, b) => a[1] - b[1])[0];
      return `${c.pick}: a quiet line that stays visible on every surface it meets (lowest ${r1(r)}, on ${short(low)}). It decorates, so it holds no contrast minimum.`;
    },
  },
  {
    test: /^color\.text\.primary$/,
    because: ["accessibility.definition"],
    why: (c) => contrast(c, c.path, "color.surface.default", c.floor, "the strongest text step"),
  },
  {
    test: /^color\.border\.focus$/,
    because: ["accessibility.definition", "color.definition"],
    why: (c) => contrast(c, c.path, "color.surface.default", 3, "the focus ring, so the keyboard's place is never lost"),
  },
  {
    test: /^color\.surface\.canvas$/,
    because: ["elevation.definition", "color.definition"],
    why: (c) => `${c.pick}, under content: ${r1(ratio(c.v("color.surface.canvas"), c.v("color.surface.default")))} from surface.default, so cards and panels stand forward.`,
  },
  {
    test: /^color\.surface\.default$/,
    because: ["accessibility.definition"],
    why: (c) => {
      const r = ratio(c.v("color.text.primary"), c.v("color.surface.default"));
      return r < c.floor ? BROKE : `${c.pick}: the base for content; body text reads ${r1(r)} on it, above the ${c.floor}:1 floor.`;
    },
  },
  {
    test: /^color\.surface\.sunken$/,
    because: ["elevation.definition", "color.definition"],
    why: (c) => `${c.pick}, a step below content (${r1(ratio(c.v("color.surface.sunken"), c.v("color.surface.default")))} on surface.default), so table headers and wells read as recessed.`,
  },
  {
    test: /^color\.surface\.selected$/,
    because: ["color.definition", "accessibility.count"],
    why: (c) => `${c.pick}: a tint of the brand, ${r1(ratio(c.v("color.surface.selected"), c.v("color.surface.default")))} from content, always beside its edge (border.selected), so selection is never color alone.`,
  },
  {
    test: /^color\.surface\.inverse$/,
    because: ["accessibility.definition"],
    why: (c) => contrast(c, "color.text.inverse", "color.surface.inverse", c.floor, "the reverse of content for short messages; its text reads"),
  },
  {
    test: /^color\.surface\.scrim$/,
    because: ["elevation.roles"],
    why: (c) => `${c.pick}: a see-through layer that dims the page behind a modal, so the dialog is the one thing to act on.`,
  },
  {
    test: /^color\.text\.(secondary|muted|link)$/,
    because: ["accessibility.definition"],
    why: (c) => contrast(c, c.path, "color.surface.default", c.floor, { "color.text.secondary": "supporting text", "color.text.muted": "the quietest text that still reads", "color.text.link": "a link, set apart by its hue" }[c.path]),
  },
  {
    test: /^color\.text\.(inverse|on-action|on-danger)$/,
    because: ["accessibility.definition"],
    why: (c) => {
      const fill = { "color.text.inverse": "color.surface.inverse", "color.text.on-action": "color.action.primary.@", "color.text.on-danger": "color.action.danger.@" }[c.path];
      return contrast(c, c.path, fill, c.floor, `the text its fill's tone picks`);
    },
  },
  {
    test: /^color\.text\.on-(light|dark)$/,
    // Both are checked in light: there the page is light and the primary action is a dark fill.
    modeOf: () => "light",
    because: ["accessibility.definition"],
    why: (c) => contrast(c, c.path, c.path.endsWith("on-light") ? "color.surface.default" : "color.action.primary.@", c.floor, c.path.endsWith("on-light") ? "the text for every light fill" : "the text for every dark fill"),
  },
  {
    test: /^color\.text\.(info|success|warning|danger)-on-(light|dark)$/,
    modeOf: (p) => (p.endsWith("on-light") ? "light" : "dark"),
    because: ["accessibility.definition", "accessibility.count"],
    why: (c) => {
      const s = c.path.match(/text\.([a-z]+)-on/)[1];
      return contrast(c, c.path, `color.status.${s}.subtle`, c.floor, `${s} text on its own tint`);
    },
  },
  {
    test: /^color\.border\.(strong|selected)$/,
    because: ["accessibility.definition"],
    why: (c) => contrast(c, c.path, "color.surface.default", 3, c.path.endsWith("strong") ? "the edge of a control people must find" : "the edge beside a selected fill, so selection is never color alone"),
  },
  {
    test: /^color\.action\.(primary|secondary|danger)\.@$/,
    because: ["accessibility.definition", "color.count"],
    why: (c) => {
      const kind = c.path.split(".")[2];
      const label = { primary: "color.text.on-action", secondary: "color.text.primary", danger: "color.text.on-danger" }[kind];
      return contrast(c, label, c.path, c.floor, `the ${kind} action's fill; its label reads`)?.toString().replace(` on ${short(c.path)}`, "") ?? null;
    },
  },
  {
    test: /^color\.action\.(primary|secondary|danger)\.hover$/,
    because: ["accessibility.roles", "accessibility.definition"],
    why: (c) => {
      const kind = c.path.split(".")[2];
      const label = { primary: "color.text.on-action", secondary: "color.text.primary", danger: "color.text.on-danger" }[kind];
      const base = c.ref(`color.action.${kind}.@`);
      const r = contrast(c, label, c.path, c.floor, "x");
      if (r === BROKE || r === null) return r;
      return `${c.pick}: one step from the ${kind} action (${name(base)}), so the pointer shows; its label still reads ${r1(ratio(c.v(label), c.v(c.path)))}, above the ${c.floor}:1 floor.`;
    },
  },
  {
    test: /^color\.status\.(info|success|warning|danger)\.@$/,
    because: ["accessibility.definition", "color.lands"],
    why: (c) => {
      const s = c.path.split(".")[2];
      // Status reads as text and icons; an icon or a mark needs 3:1, text the scheme's floor.
      const r = ratio(c.v(c.path), c.v("color.surface.default"));
      if (r < 3) return BROKE;
      return r >= c.floor
        ? `${c.pick}: ${s} reads as text and icons, ${r1(r)} on surface.default, above the ${c.floor}:1 floor.`
        : `${c.pick}: ${s} marks icons and edges, ${r1(r)} on surface.default, over 3:1; its text uses ${s}-on-light, which reads at the floor.`;
    },
  },
  {
    test: /^color\.status\.(info|success|warning|danger)\.subtle$/,
    because: ["accessibility.count", "color.lands"],
    why: (c) => {
      const s = c.path.split(".")[2];
      const t = c.mode === "light" ? `color.text.${s}-on-light` : `color.text.${s}-on-dark`;
      return contrast(c, t, c.path, c.floor, `a quiet tint behind ${s}; its text`)?.toString().replace(` on ${short(c.path)}`, "") ?? null;
    },
  },
  {
    test: /^color\.category\.\d\.@$/,
    because: ["color.count", "color.lands"],
    why: (c) => contrast(c, c.path, "color.surface.default", 3, "a series color: a distinct hue with no meaning, for tags and chart marks"),
  },
  {
    test: /^color\.category\.\d\.subtle$/,
    because: ["color.count"],
    why: (c) => contrast(c, "color.text.primary", c.path, c.floor, "a tag's tint; text on it reads")?.toString().replace(` on ${short(c.path)}`, "") ?? null,
  },
  {
    test: /^color\.disabled\.(text|surface|border)$/,
    because: ["accessibility.roles"],
    why: (c) => {
      const part = c.path.split(".")[2];
      if (part === "text")
        return `${c.pick}: ${r1(ratio(c.v(c.path), c.v("color.surface.default")))} on surface.default, under the floor on purpose, so the control reads as unavailable. Disabled text has no contrast minimum.`;
      return `${c.pick}: the ${part} of a control that cannot be used, flat and quiet, so it never reads as an action.`;
    },
  },
  {
    // OD-245: the typeface is the brand.q3 answer; the pick quotes it, with the role it serves.
    test: /^type\.[a-z]+\.font-family$/,
    because: ["brand.q3"],
    why: (c) => {
      const a = c.answers["brand.q3"];
      if (!a) return null;
      const role = c.path.split(".")[1];
      return `${c.pick.replace(/^font\.family\./, "")} for ${role} text: ${a.why}`;
    },
  },
  {
    test: /^radius\.(control|badge|container)$/,
    because: ["shape.roles", "shape.values"],
    why: (c) => `${c.pick}: ${c.answer("shape.values")}`,
  },
  {
    test: /^elevation\.(card|overlay)$/,
    because: ["elevation.roles", "elevation.values"],
    why: (c) => `${c.pick}: ${c.answer(c.path.endsWith("card") ? "elevation.roles" : "elevation.values")}`,
  },
];

const leaves = (o, p = []) =>
  !o || typeof o !== "object"
    ? []
    : "$value" in o
      ? [[p.join("."), o]]
      : Object.entries(o).flatMap(([k, v]) => (k[0] === "$" ? [] : leaves(v, [...p, k])));
const preview = {};
let added = 0;
const broke = [];
for (const id of SCHEMES) {
  const raw = loadScheme(id, roots);
  const s = loadScheme(id, roots);
  const answers = Object.fromEntries(raw.answers.map((a) => [a.question, a]));
  const floor = { aa: 4.5, "aaa-text": 7, aaa: 7 }[answers["accessibility.definition"]?.option] ?? 4.5;
  for (const [brand, def] of Object.entries(raw.tokens.brands))
    for (const mode of ["base", "light", "dark"])
      for (const [path, node] of leaves(def.theme[mode] ?? {})) {
        const sem = path;
        const rule = RULES.find((r) => r.test.test(path));
        if (!rule) continue;
        // A mode-free pick (base) is checked in the mode it serves.
        const m = mode === "base" ? (rule.modeOf?.(path) ?? "light") : mode;
        const ix = tokenIndex(s, { brand, mode: m });
        const od = ((node.$extensions ??= {})["open-ds"] ??= {});
        if (od.why && !od.generated) continue;
        const c = {
          path: sem,
          mode: m,
          floor,
          pick: name(node.$value),
          v: (p) => aliasChain(ix, p).value,
          ref: (p) => leaves(def.theme[m]).find(([q]) => q === p)?.[1]?.$value ?? "",
          answer: (q) => answers[q]?.why ?? "",
          answers,
        };
        const why = rule.why(c);
        if (why === BROKE) {
          broke.push(`${id}/${brand}/${mode} ${path} (${c.pick})`);
          delete od.why;
          delete od.because;
          delete od.generated;
          continue;
        }
        if (!why) continue;
        od.why = why;
        od.because = rule.because;
        od.generated = true;
        added++;
        (preview[`${id}/${brand}/${mode}`] ??= {})[path] = why;
      }
  if (!dry) saveScheme(raw, roots);
}
if (dry) console.log(JSON.stringify(preview, null, 1));
else console.log(`Reasons on ${added} theme picks.`);
if (broke.length) console.error(`Left without a reason, because they break their scheme's floor:\n  ${broke.join("\n  ")}`);
