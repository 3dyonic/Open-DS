// Curve checks (OD-298): the shape of each color scale. Neighbouring steps differ in OKLab lightness
// by at least curves.minGap; steps 400, 500 and 700 apart reach 3:1, 4.5:1 and 7:1. The grades are
// reported, not gated, until OD-299 lands (curves.gradesGated). Each scale is gated on its own.
import { contrast, oklab } from "../color.mjs";
import { countBy, measureOf } from "./measure.mjs";

export const FAMILY = "curves";

// Numeric steps of one scale row, in order.
const numeric = (row) =>
  Object.keys(row)
    .filter((s) => /^\d+$/.test(s))
    .sort((a, b) => a - b);

/** Neighbouring steps closer than the gap: [{ scheme, hue, mode, from, to, gap }]. */
export function tightSteps(snapshot, minGap) {
  const out = [];
  for (const [id, s] of Object.entries(snapshot.schemes))
    for (const [hue, modes] of Object.entries(s.palette ?? {}))
      for (const [mode, row] of Object.entries(modes)) {
        const steps = numeric(row);
        for (let i = 1; i < steps.length; i++) {
          const gap = Math.abs(oklab(row[steps[i]])[0] - oklab(row[steps[i - 1]])[0]);
          if (gap < minGap) out.push({ scheme: id, hue, mode, from: steps[i - 1], to: steps[i], gap });
        }
      }
  return out;
}

/** Step pairs under their contrast grade: [{ scheme, hue, mode, from, to, ratio, need }]. */
export function gradeMisses(snapshot, grades) {
  const sorted = [...grades].sort((a, b) => a.apart - b.apart);
  const out = [];
  for (const [id, s] of Object.entries(snapshot.schemes))
    for (const [hue, modes] of Object.entries(s.palette ?? {}))
      for (const [mode, row] of Object.entries(modes)) {
        const steps = numeric(row);
        for (let i = 0; i < steps.length; i++)
          for (let j = i + 1; j < steps.length; j++) {
            const grade = sorted.filter((g) => steps[j] - steps[i] >= g.apart).at(-1);
            if (!grade) continue;
            const ratio = contrast(row[steps[i]], row[steps[j]]);
            if (ratio < grade.ratio) out.push({ scheme: id, hue, mode, from: steps[i], to: steps[j], ratio, need: grade.ratio });
          }
      }
  return out;
}

export function measure(snapshot, params) {
  const tight = tightSteps(snapshot, params.curves.minGap);
  const misses = gradeMisses(snapshot, params.curves.grades);
  return [
    measureOf({
      id: "curves.min-gap",
      family: FAMILY,
      title: `Neighbouring scale steps closer than ${params.curves.minGap} in OKLab lightness`,
      direction: "down",
      value: tight.length,
      perScheme: countBy(tight, (t) => t.scheme),
      parts: countBy(tight, (t) => `${t.scheme}/${t.hue}.${t.mode}`),
      details: tight.map((t) => `${t.scheme}: ${t.hue}.${t.mode} ${t.from} → ${t.to} differ by ${t.gap.toFixed(3)}`),
    }),
    measureOf({
      id: "curves.grades",
      family: FAMILY,
      title: `Step pairs under their contrast grade (${params.curves.grades.map((g) => `${g.apart} apart ${g.ratio}:1`).join(", ")})`,
      direction: params.curves.gradesGated ? "down" : "report",
      value: misses.length,
      perScheme: countBy(misses, (m) => m.scheme),
      parts: countBy(misses, (m) => `${m.scheme}/${m.hue}.${m.mode}`),
      notes: params.curves.gradesGated ? [] : ["Contrast grades are reported, not gated (gradesGated: false), by the owner's decision. They gate once OD-299 lands."],
      details: misses.map((m) => `${m.scheme}: ${m.hue}.${m.mode} ${m.from} and ${m.to} are ${m.ratio.toFixed(2)}:1, need ${m.need}:1`),
    }),
  ];
}
