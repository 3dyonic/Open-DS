// Accessibility: every grammar pair keeps its WCAG contrast; APCA Lc below the readability
// floor is a warning, shown and never gated; hit areas; and text sizes in rem,
// so text follows the user's setting.
import { contrast } from "../../ramps.mjs";
import { apcaContrast, apcaFloor } from "../apca.mjs";
import { RELATION_LIST } from "../relations.mjs";
import { hex6 } from "../values.mjs";
import { relationMeasure } from "./invariants.mjs";
import { measureOf, perSchemeOf, perThemeOf, sum } from "./measure.mjs";

export const FAMILY = "accessibility";

/** Every measured pair of one scheme: [{ theme, key, on, need, ratio, lc, floor, waits }]. */
export function measuredPairs(s) {
  const out = [];
  for (const t of s.themes)
    for (const p of s.pairs[t.id] ?? []) {
      const [fg, bg] = [hex6(s.values[t.id]?.[p.key]), hex6(s.values[t.id]?.[p.on])];
      if (!fg || !bg) continue;
      out.push({ theme: t.id, key: p.key, on: p.on, need: p.contrast, ratio: contrast(fg, bg), lc: apcaContrast(fg, bg), floor: apcaFloor(p.contrast), waits: !!p.waits });
    }
  return out;
}

export function measure(snapshot) {
  const pairs = perSchemeOf(snapshot, (s) => measuredPairs(s));
  const failing = (p) => p.ratio < p.need && !p.waits;
  const weakLc = (p) => Math.abs(p.lc) < p.floor;
  const say = (fn, text) => Object.entries(pairs).flatMap(([id, list]) => list.filter(fn).map((p) => `${id}/${p.theme}: ${p.key} on ${p.on} ${text(p)}`));
  const rem = perSchemeOf(snapshot, (s) => {
    const bad = new Set();
    for (const t of s.themes)
      for (const [token, v] of Object.entries(s.values[t.id] ?? {}))
        if (/^type\..+\.font-size$/.test(token) && !(typeof v === "string" && /^\d*\.?\d+rem$/.test(v))) bad.add(`${token} = ${JSON.stringify(v)}`);
    return [...bad];
  });
  const hit = RELATION_LIST.find((r) => r.id === "hit-area");
  // Per scheme and theme, every theme listed, so a breach in one mode never hides behind a fix in another.
  const byTheme = (fn) => perThemeOf(snapshot, (s, theme, id) => pairs[id].filter((p) => p.theme === theme && fn(p)).length);
  return [
    measureOf({
      id: "accessibility.wcag-failures",
      family: FAMILY,
      title: "Grammar pairs below their WCAG contrast (pairs on a fill that waits for a fix excluded)",
      direction: "down",
      value: sum(Object.fromEntries(Object.entries(pairs).map(([id, l]) => [id, l.filter(failing).length]))),
      perScheme: Object.fromEntries(Object.entries(pairs).map(([id, l]) => [id, l.filter(failing).length])),
      parts: byTheme(failing),
      details: [`${sum(Object.fromEntries(Object.entries(pairs).map(([id, l]) => [id, l.length])))} pairs measured`, ...say(failing, (p) => `${p.ratio.toFixed(2)}:1, needs ${p.need}:1`)],
    }),
    measureOf({
      id: "accessibility.wcag-waiting",
      family: FAMILY,
      title: "Grammar pairs below their WCAG contrast on a fill that records it waits for a fix",
      direction: "report",
      value: sum(Object.fromEntries(Object.entries(pairs).map(([id, l]) => [id, l.filter((p) => p.ratio < p.need && p.waits).length]))),
      details: say((p) => p.ratio < p.need && p.waits, (p) => `${p.ratio.toFixed(2)}:1, needs ${p.need}:1`),
    }),
    measureOf({
      id: "accessibility.apca-warnings",
      family: FAMILY,
      title: "Grammar pairs whose APCA Lc is under the readability floor for their role (warning, not gated)",
      direction: "down",
      gated: false,
      notes: ["APCA Lc is a warning only: shown, never gated."],
      value: sum(Object.fromEntries(Object.entries(pairs).map(([id, l]) => [id, l.filter(weakLc).length]))),
      perScheme: Object.fromEntries(Object.entries(pairs).map(([id, l]) => [id, l.filter(weakLc).length])),
      parts: byTheme(weakLc),
      details: say(weakLc, (p) => `Lc ${p.lc.toFixed(1)}, floor ${p.floor}`),
    }),
    { ...relationMeasure(snapshot, hit), title: hit.title },
    measureOf({
      id: "accessibility.text-not-rem",
      family: FAMILY,
      title: "Text sizes that are not in rem, so they ignore the user's text setting",
      direction: "down",
      value: sum(Object.fromEntries(Object.entries(rem).map(([id, l]) => [id, l.length]))),
      perScheme: Object.fromEntries(Object.entries(rem).map(([id, l]) => [id, l.length])),
      details: Object.entries(rem).flatMap(([id, l]) => l.map((x) => `${id}: ${x}`)),
    }),
  ];
}
