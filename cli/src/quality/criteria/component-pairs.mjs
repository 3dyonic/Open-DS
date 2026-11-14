// Simulated component pairs: each foreground-on-background pair a component draws, resolved on
// base and candidate per scheme, brand and mode. A pair is flagged when either side moves past the
// shift tier's pass, when its contrast drops a WCAG level, or when its difference (ΔE foreground
// against background) falls below componentPairs.minDifference. A level drop or a shrunk difference the
// owner approved (harness/quality-approvals.json) is listed, not counted.
import { approvalFor } from "../approvals.mjs";
import { contrast, oklabDistance, wcagLevel } from "../color.mjs";
import { pairKey } from "../component-pairs.mjs";
import { hex6 } from "../values.mjs";
import { countBy, measureOf } from "./measure.mjs";
import { tierOf } from "./shift.mjs";

export const FAMILY = "component-pairs";
const LEVEL_DROPS = "component-pairs.level-drops";
const SHRUNK = "component-pairs.difference-shrunk";

// One side of a pair in one theme: its two colors, contrast and difference.
function side(s, theme, p, page) {
  const v = s.componentPairs?.values?.[theme] ?? {};
  const fg = hex6(v[p.fg]);
  const bg = hex6(p.bg ? v[p.bg] : s.values[theme]?.[page]);
  if (!fg || !bg) return null;
  return { fg, bg, ratio: contrast(fg, bg), difference: oklabDistance(fg, bg) };
}

/** Every pair both sides draw, in every theme both have: rows with before, after and the flags. */
export function componentPairRows(base, candidate, params) {
  const { page, minDifference } = params.componentPairs;
  const tiers = { pass: params.shift.pass, review: params.shift.review };
  const rows = [];
  for (const [id, c] of Object.entries(candidate.schemes)) {
    const b = base.schemes[id];
    if (!b) continue;
    const was = new Set((b.componentPairs?.pairs ?? []).map(pairKey));
    for (const p of c.componentPairs?.pairs ?? []) {
      if (!was.has(pairKey(p))) continue;
      for (const theme of c.themes.map((t) => t.id).filter((t) => b.values[t])) {
        const [before, after] = [side(b, theme, p, page), side(c, theme, p, page)];
        if (!before || !after) continue;
        const moveFg = oklabDistance(before.fg, after.fg);
        const moveBg = oklabDistance(before.bg, after.bg);
        const tier = ["approval", "review", "pass", "none"].find((t) => [tierOf(moveFg, tiers), tierOf(moveBg, tiers)].includes(t));
        const levelDrop = wcagLevel(after.ratio) < wcagLevel(before.ratio);
        const shrunk = before.difference >= minDifference && after.difference < minDifference;
        // The pair as an approval names it: its two variables, or the page token when it has no fill of its own.
        const flag = { scheme: id, themes: [theme], tokens: [p.fg, p.bg ?? page] };
        const approved = {
          [LEVEL_DROPS]: levelDrop ? approvalFor(candidate.approvals, { ...flag, check: LEVEL_DROPS }) : null,
          [SHRUNK]: shrunk ? approvalFor(candidate.approvals, { ...flag, check: SHRUNK }) : null,
        };
        rows.push({ scheme: id, theme, ...p, before, after, moveFg, moveBg, tier, levelDrop, shrunk, approved, flagged: tier === "review" || tier === "approval" || levelDrop || shrunk });
      }
    }
  }
  return rows;
}

const pairName = (r) => `${r.component} ${r.state} ${r.role}: --${r.fg} on ${r.bg ? `--${r.bg}` : "the page"}`;
const approvedBy = (a) => (a ? ` (approved by ${a.approved_by}: ${a.why})` : "");
const flags = (r) =>
  [
    r.tier === "review" || r.tier === "approval" ? `moved (${r.tier})` : null,
    r.levelDrop ? `WCAG level drop${approvedBy(r.approved?.[LEVEL_DROPS])}` : null,
    r.shrunk ? `difference below the floor${approvedBy(r.approved?.[SHRUNK])}` : null,
  ]
    .filter(Boolean)
    .join(", ");

export const measure = () => [];

export function relative(base, candidate, params) {
  const rows = componentPairRows(base, candidate, params);
  const line = (r) => `${r.scheme}/${r.theme} ${pairName(r)}: ${r.before.ratio.toFixed(2)}:1 → ${r.after.ratio.toFixed(2)}:1, ΔE fg/bg ${r.before.difference.toFixed(3)} → ${r.after.difference.toFixed(3)}`;
  const flagged = rows.filter((r) => r.flagged);
  const components = [...new Set(flagged.map((r) => r.component))].sort();
  // An approved flag stays in the detail and leaves the gated count.
  const pairMeasure = (id, title, hit) => {
    const open = rows.filter((r) => hit(r) && !r.approved[id]);
    const cleared = rows.filter((r) => hit(r) && r.approved[id]);
    return measureOf({
      id,
      family: FAMILY,
      title,
      direction: "down",
      value: open.length,
      parts: countBy(open, (r) => `${r.scheme}/${r.theme}`),
      details: [...open.map(line), ...cleared.map((r) => `${line(r)}${approvedBy(r.approved[id])}`)],
    });
  };
  return [
    pairMeasure(LEVEL_DROPS, "Component pairs whose contrast drops a WCAG level, less the approved ones", (r) => r.levelDrop),
    pairMeasure(SHRUNK, `Component pairs whose foreground-to-background ΔE fell below ${params.componentPairs.minDifference}, less the approved ones`, (r) => r.shrunk),
    measureOf({
      id: "component-pairs.moved",
      family: FAMILY,
      title: `Component pairs where a side moved past ΔE ${params.shift.pass}`,
      direction: "report",
      value: rows.filter((r) => r.tier === "review" || r.tier === "approval").length,
      details: [`${rows.length} pairs compared`],
    }),
    measureOf({
      id: "component-pairs.flagged-components",
      family: FAMILY,
      title: "Components with a flagged pair (see component-pairs.md)",
      direction: "report",
      value: components.length,
      details: components,
    }),
  ];
}

/**
 * The review sheet: the flagged pairs only, by component, with the swatches as hex text. rows may hold
 * every pair or only the flagged ones; compared is how many pairs were compared.
 */
export function componentPairsSheet(rows, { base, candidate, compared = rows.length }) {
  const flagged = rows.filter((r) => r.flagged);
  const lines = [
    "# Component pairs to review",
    "",
    `Base \`${base}\` against candidate \`${candidate}\`. ${flagged.length} of ${compared} pairs are flagged, in ${new Set(flagged.map((r) => r.component)).size} components. Colors are hex: foreground on background, before → after.`,
    "",
  ];
  if (!flagged.length) return `${[...lines, "No pair is flagged."].join("\n")}\n`;
  const byComponent = new Map();
  for (const r of flagged) byComponent.set(r.component, [...(byComponent.get(r.component) ?? []), r]);
  for (const [component, list] of [...byComponent].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`## ${component}`, "", "| Scheme / theme | State | Pair | Before | After | Contrast | ΔE fg/bg | Moved fg / bg | Flag |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    for (const r of list)
      lines.push(
        `| ${r.scheme}/${r.theme} | ${r.state} | ${r.role}: \`--${r.fg}\` on ${r.bg ? `\`--${r.bg}\`` : "the page"} | \`${r.before.fg}\` on \`${r.before.bg}\` | \`${r.after.fg}\` on \`${r.after.bg}\` | ${r.before.ratio.toFixed(2)} → ${r.after.ratio.toFixed(2)} | ${r.before.difference.toFixed(3)} → ${r.after.difference.toFixed(3)} | ${r.moveFg.toFixed(3)} / ${r.moveBg.toFixed(3)} | ${flags(r)} |`,
      );
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}
