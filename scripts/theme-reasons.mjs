// Reasons on theme picks (OD-241, OD-243): each pick says why its step carries the semantic's rule
// in this scheme, brand and mode, and which answers it follows from. The why is computed from the
// values the pick meets (contrast, the surfaces around it), never typed per scheme. Run after a pick
// changes: node scripts/theme-reasons.mjs. A pick that already has a why written by hand keeps it.
import { readFileSync, writeFileSync } from "node:fs";
import { loadScheme, assetRoots } from "../cli/src/schemes.mjs";
import { tokenIndex, aliasChain } from "../cli/src/lands.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const roots = assetRoots();
const lum = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const r1 = (n) => `${n.toFixed(2).replace(/0$/, "")}:1`;
const stepOf = (ref) => ref.replace(/^\{color\.|\}$/g, "");

// Each reason: the theme path, the answers it follows from, and how to say why from the values.
const REASONS = [
  {
    path: ["color", "surface", "raised"],
    because: ["elevation.roles", "elevation.definition"],
    why: ({ v, pick, mode }) => {
      const same = v("color.surface.raised") === v("color.surface.default");
      const shadow = v("elevation.overlay");
      const lifts = shadow && typeof shadow === "object" && !/00$/.test(shadow.color ?? "") ? "its edge and its one shadow" : "its edge alone";
      return same
        ? `${pick}, the same as content (surface.default): a menu stands out by ${lifts}, not by its fill${mode === "dark" ? ", as in light" : ""}.`
        : `${pick}, one step from content (surface.default), with ${lifts}, so a menu reads as on top.`;
    },
  },
  {
    path: ["color", "border", "default"],
    because: ["elevation.definition", "accessibility.definition"],
    why: ({ v, pick }) => {
      const on = ["color.surface.canvas", "color.surface.default", "color.surface.raised"].map((s) => [s, ratio(v("color.border.default"), v(s))]);
      const [low, r] = on.sort((a, b) => a[1] - b[1])[0];
      return `${pick}: a quiet line that stays visible on every surface it meets (lowest ${r1(r)}, on ${low.replace("color.", "")}). It decorates, so it holds no contrast minimum.`;
    },
  },
  {
    path: ["color", "text", "primary"],
    because: ["accessibility.definition"],
    why: ({ v, pick, floor }) => `${pick}: the strongest text step, ${r1(ratio(v("color.text.primary"), v("color.surface.default")))} on content, above the ${floor}:1 floor.`,
  },
  {
    path: ["color", "border", "focus"],
    because: ["accessibility.definition", "color.definition"],
    why: ({ v, pick }) => `${pick}: the ring keeps ${r1(ratio(v("color.border.focus"), v("color.surface.default")))} on content, over the 3:1 a focus ring needs, so the keyboard's place is never lost.`,
  },
  {
    path: ["color", "status", "danger", "@"],
    because: ["accessibility.definition", "color.lands"],
    why: ({ v, pick, floor }) => `${pick}: real risk reads as text, ${r1(ratio(v("color.status.danger.@"), v("color.surface.default")))} on content, above the ${floor}:1 floor.`,
  },
];

const dry = process.argv.includes("--dry");
const preview = {};
let added = 0;
for (const id of SCHEMES) {
  const file = `schemes/${id}.json`;
  const raw = JSON.parse(readFileSync(ROOT + file, "utf8"));
  const s = loadScheme(id, roots);
  const floor = { aa: 4.5, aaa: 7 }[raw.answers.find((a) => a.question === "accessibility.definition")?.option] ?? 4.5;
  for (const [brand, def] of Object.entries(raw.tokens.brands))
    for (const mode of ["light", "dark"]) {
      const ix = tokenIndex(s, { brand, mode });
      const v = (p) => aliasChain(ix, p).value;
      for (const r of REASONS) {
        const node = r.path.reduce((n, k) => n?.[k], def.theme[mode]);
        if (!node?.$value) continue;
        const ext = (node.$extensions ??= {});
        const od = (ext["open-ds"] ??= {});
        if (od.why && !od.generated) continue;
        od.why = r.why({ v, pick: stepOf(node.$value), mode, floor });
        od.because = r.because;
        od.generated = true;
        added++;
        (preview[`${id}/${brand}/${mode}`] ??= {})[r.path.join(".")] = { pick: node.$value, why: od.why };
      }
    }
  if (!dry) writeFileSync(ROOT + file, `${JSON.stringify(raw, null, 2)}\n`);
}
if (dry) console.log(JSON.stringify(preview, null, 1));
else console.log(`Reasons on ${added} theme picks.`);
