// Shared helpers for the independent verify-b seeded-defect tests (OD-298).
// Each test edits a temporary copy of the repo data, never the real scheme files.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractRef } from "../src/quality/extract.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { DEFAULT_PARAMS, paramsFrom } from "../src/quality/params.mjs";

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const COPY = ["cli/src", "cli/package.json", "schemes", "ui", "schema", "tokens", "harness/quality-approvals.json"];

/** A fresh temporary copy of the data the gate reads. */
export function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "verify-b-"));
  for (const part of COPY) cpSync(join(REPO, part), join(root, part), { recursive: true, filter: (src) => !src.includes("node_modules") });
  return root;
}

export const drop = (root) => rmSync(root, { recursive: true, force: true });

export const schemePath = (root, id) => join(root, "schemes", `${id}.json`);
export const readScheme = (root, id) => JSON.parse(readFileSync(schemePath(root, id), "utf8"));

/** Read a value at a dotted path (array of keys). */
export function get(obj, path) {
  return path.reduce((o, k) => o?.[k], obj);
}
/** Set a value at a path, creating objects on the way. */
export function set(obj, path, value) {
  let o = obj;
  for (const k of path.slice(0, -1)) o = o[k] ??= {};
  o[path.at(-1)] = value;
}

export const snap = (root, ids) => extractRef({ root, css: false, blast: false, ids });

/**
 * Snapshot the candidate after `mutate(schemesById, root)` edits scheme JSON in place,
 * then restore the original files. `mutate` gets an object { [id]: parsedScheme }.
 */
export async function withEdits(root, ids, mutate) {
  const originals = Object.fromEntries(ids.map((id) => [id, readFileSync(schemePath(root, id), "utf8")]));
  const approvals = join(root, "harness", "quality-approvals.json");
  const approvalsText = readFileSync(approvals, "utf8");
  const schemes = Object.fromEntries(ids.map((id) => [id, JSON.parse(originals[id])]));
  try {
    await mutate(schemes, root);
    for (const id of ids) writeFileSync(schemePath(root, id), JSON.stringify(schemes[id], null, 2));
    return await snap(root, ids);
  } finally {
    for (const id of ids) writeFileSync(schemePath(root, id), originals[id]);
    writeFileSync(approvals, approvalsText);
  }
}

export const compare = (base, candidate, overrides) => compareSnapshots(base, candidate, overrides ? paramsFrom(overrides) : DEFAULT_PARAMS);
export const row = (card, id) => {
  const r = card.criteria.find((c) => c.id === id);
  if (!r) throw new Error(`no criterion ${id}; have ${card.criteria.map((c) => c.id).join(", ")}`);
  return r;
};
export const failing = (card) => card.criteria.filter((c) => !c.pass).map((c) => c.id);

/** Path to a theme token in a single-brand scheme. */
export const themeToken = (mode, dotted) => ["tokens", "brands", "default", "theme", mode, ...dotted.split(".")];
export const prim = (dotted) => ["tokens", "primitive", ...dotted.split(".")];

// ---- Independent color math (written from the published formulas, not from the gate) ----
// OKLab: Björn Ottosson, 2020. WCAG 2.x relative luminance and contrast ratio.
// CVD simulation: Machado, Oliveira & Fernandes 2009, severity 1.0, applied in linear sRGB.
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const linearOf = (hex) => [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
export const hexOfLinear = (rgb) => "#" + rgb.map((c) => Math.round(clamp01(toGamma(clamp01(c))) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
export function labOfLinear([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
export function linearOfLab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
export const lab = (hex) => labOfLinear(linearOf(hex));
export const dist = (x, y) => Math.hypot(...lab(x).map((v, i) => v - lab(y)[i]));
export const lch = (hex) => { const [L, a, b] = lab(hex); return { L, C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 }; };
export const hexOfLch = ({ L, C, H }) => hexOfLinear(linearOfLab([L, C * Math.cos((H * Math.PI) / 180), C * Math.sin((H * Math.PI) / 180)]));
export const luminance = (hex) => { const [r, g, b] = linearOf(hex); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const ratio = (x, y) => { const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p); return (hi + 0.05) / (lo + 0.05); };
export const MACHADO = {
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
export const simLinear = (rgb, vision) => MACHADO[vision].map((row) => clamp01(row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2]));
export const simDist = (x, y, vision) => { const p = labOfLinear(simLinear(linearOf(x), vision)); const q = labOfLinear(simLinear(linearOf(y), vision)); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

/** A gray whose OKLab distance from `hex` is `target` (searches lighter or darker). */
export function grayAt(hex, target, darker = true) {
  let best = null;
  for (let v = 0; v <= 255; v++) {
    const g = "#" + v.toString(16).padStart(2, "0").repeat(3).toUpperCase();
    if (darker ? luminance(g) > luminance(hex) : luminance(g) < luminance(hex)) continue;
    const d = Math.abs(dist(hex, g) - target);
    if (!best || d < best.d) best = { g, d };
  }
  return best.g;
}

/** Search sRGB for a color that merges with `partner` under `vision` but stays far in normal vision. */
export function mergeUnder(partner, vision, { minNormal = 0.1, step = 3 } = {}) {
  const target = labOfLinear(simLinear(linearOf(partner), vision));
  let best = null;
  for (let r = 0; r < 256; r += step) for (let g = 0; g < 256; g += step) for (let b = 0; b < 256; b += step) {
    const lin = [r, g, b].map((v) => toLinear(v / 255));
    const p = labOfLinear(simLinear(lin, vision));
    const d = Math.hypot(p[0] - target[0], p[1] - target[1], p[2] - target[2]);
    if (best && d >= best.d) continue;
    const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
    if (dist(hex, partner) < minNormal) continue;
    best = { hex, d };
  }
  return best.hex;
}

/** Set a theme token's $value; a token that is also a group keeps its own value under "@". */
export function setTheme(scheme, mode, dotted, value) {
  const node = get(scheme, themeToken(mode, dotted));
  if (!node) throw new Error(`no theme token ${mode} ${dotted}`);
  (node["@"] ?? node).$value = value;
}
