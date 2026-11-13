#!/usr/bin/env node
// OD-299 swatch sheets: for each scheme, every generated hue in light and dark, the shared curve and
// the contrast-graded curve side by side, drawn from the token values the loader builds (no
// screenshots). A held step is outlined. Writes build/od-299/swatches/<scheme>.html and index.html
// (git does not keep build/).
//
//   node scripts/od-299-swatches.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { stepsAnswer } from "../cli/src/color-steps.mjs";
import { STEPS, contrast } from "../cli/src/ramps.mjs";
import { oklabDistance } from "../cli/src/quality/color.mjs";
import { loadScheme, schemeIds } from "../cli/src/schemes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "build", "od-299", "swatches");

const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
const ink = (hex) => (contrast(hex, "#000000") >= contrast(hex, "#FFFFFF") ? "#000" : "#FFF");
const value = (group, mode, st) => String(group?.[mode]?.[st]?.$value ?? "").slice(0, 7).toUpperCase();

/** One scheme's sheet as HTML. */
export function sheet(id) {
  const shared = loadScheme(id, undefined, { graded: false });
  const graded = loadScheme(id, undefined, { graded: true });
  const answer = stepsAnswer(shared);
  const rows = [];
  for (const [hue, g] of Object.entries(shared.tokens.primitive.color)) {
    const spec = g?.$extensions?.["open-ds"];
    if (!spec) continue;
    for (const mode of ["light", "dark"]) {
      if (!spec[mode]?.key) continue;
      const held = spec[mode].held ?? {};
      const cell = (hex, st, isHeld) =>
        `<td style="background:${hex};color:${ink(hex)}"${isHeld ? ' class="held"' : ""} title="${hue}.${mode}.${st} ${hex}">${st}<br>${hex}</td>`;
      const old = STEPS.map((st) => cell(value(g, mode, st), st, false)).join("");
      const now = STEPS.map((st) => cell(value(graded.tokens.primitive.color[hue], mode, st), st, st in held)).join("");
      const move = STEPS.map((st) => `<td class="d">${oklabDistance(value(g, mode, st), value(graded.tokens.primitive.color[hue], mode, st)).toFixed(3)}</td>`).join("");
      rows.push(
        `<tr><th rowspan="3">${esc(hue)}<br>${mode}</th><th>shared</th>${old}</tr><tr><th>graded</th>${now}</tr><tr><th>OKLab move</th>${move}</tr>`,
      );
    }
  }
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(shared.name)} swatches</title>
<style>
body{font:13px/1.4 system-ui,sans-serif;margin:16px;background:#fff;color:#111}
table{border-collapse:collapse;margin-bottom:24px}
th,td{padding:6px 8px;text-align:center;font-size:11px}
th{text-align:left;font-weight:600;white-space:nowrap}
td{min-width:64px}
td.held{outline:3px dashed #111;outline-offset:-4px}
td.d{color:#444}
.wrap{overflow-x:auto}
</style></head><body>
<h1>${esc(shared.name)}: the shared curve and the contrast-graded curve</h1>
<p>Steps answer: ${esc(answer?.option ?? "none")} (easing ${answer?.easing ?? "none"}). Each hue shows its light and dark scale on the shared curve, then on the graded curve, then the OKLab move of each step. A dashed outline marks a held step: it keeps the shared curve. Drawn from the token values the loader builds.</p>
<div class="wrap"><table>${rows.join("\n")}</table></div>
</body></html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mkdirSync(out, { recursive: true });
  const ids = schemeIds();
  for (const id of ids) writeFileSync(join(out, `${id}.html`), sheet(id));
  writeFileSync(
    join(out, "index.html"),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OD-299 swatch sheets</title></head><body style="font:14px system-ui;margin:16px"><h1>OD-299 swatch sheets</h1><ul>${ids.map((id) => `<li><a href="${id}.html">${id}</a></li>`).join("")}</ul></body></html>\n`,
  );
  console.log(`Wrote ${ids.length} swatch sheets to build/od-299/swatches/.`);
}
