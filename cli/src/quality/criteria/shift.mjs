// Shift per token (OD-298): how far each color moved between base and candidate, as an OKLab
// distance, per scheme, brand and mode. Tiers: under shift.pass passes; up to shift.review needs a
// recorded reason; above needs the owner's approval (harness/quality-approvals.json). Some roles
// (surfaces) have tighter tiers; a chromatic token may turn its hue only a little; a brand key color
// stays exact unless an adjustment is recorded.
import { chromaHue, hueDifference, oklabDistance } from "../color.mjs";
import { hex6 } from "../values.mjs";
import { measureOf } from "./measure.mjs";

export const FAMILY = "shift";

/** The tiers that apply to a token: the first role whose pattern matches it, else the defaults. */
export function tiersFor(token, shift) {
  const role = (shift.roles ?? []).find((r) => new RegExp(r.match).test(token));
  return { role: role?.id ?? "default", pass: role?.pass ?? shift.pass, review: role?.review ?? shift.review };
}

/** The tier of a move: "none" (no move), "pass", "review" or "approval". */
export function tierOf(distance, { pass, review }) {
  if (distance < 1e-9) return "none";
  return distance < pass ? "pass" : distance <= review ? "review" : "approval";
}

/** Whether the owner approved a move: an entry for this scheme and token, in this theme or any. */
export const approved = (approvals, scheme, token, theme) =>
  (approvals ?? []).some((a) => a.scheme === scheme && a.token === token && (!a.theme || a.theme === "*" || a.theme === theme));

const fmt = (n) => n.toFixed(3);

// The hue and mode of a key step a chain ends on, when the step is the hue's recorded key color.
function keyStepOf(end, palette, keys) {
  const m = end?.match(/^color\.([a-z0-9-]+)\.(light|dark)\.([^.]+)$/);
  if (!m) return null;
  const key = keys?.[m[1]]?.[m[2]]?.key;
  return key && palette?.[m[1]]?.[m[2]]?.[m[3]] === key ? { hue: m[1], mode: m[2] } : null;
}
const adjusts = (keys, hue, mode) => Object.keys(keys?.[hue]?.[mode]?.adjust ?? {}).length > 0;

/** Every color move between two snapshots: [{ scheme, theme, token, from, to, distance, role, tier, reasoned, approved, hue, keyColor }]. */
export function colorMoves(base, candidate, params) {
  const shift = params.shift;
  const out = [];
  for (const [id, c] of Object.entries(candidate.schemes)) {
    const b = base.schemes[id];
    if (!b) continue;
    const baseWhy = new Map(b.trace.map((t) => [t.token, t.why]));
    const candReason = new Map(c.trace.map((t) => [t.token, t]));
    for (const theme of c.themes.map((t) => t.id).filter((t) => b.values[t])) {
      for (const [token, value] of Object.entries(c.values[theme] ?? {})) {
        const [from, to] = [hex6(b.values[theme][token]), hex6(value)];
        if (!from || !to) continue;
        const distance = oklabDistance(from, to);
        const tiers = tiersFor(token, shift);
        const r = candReason.get(token);
        const reasoned = !!r?.why && (r.reason === "own" || r.reason === "exact-rule") && r.why !== baseWhy.get(token);
        const [p, q] = [chromaHue(from), chromaHue(to)];
        const turn = p.C > shift.chroma && q.C > shift.chroma ? hueDifference(p.H, q.H) : 0;
        const key = keyStepOf(b.chains[theme]?.[token]?.end, b.palette, b.keys);
        out.push({
          scheme: id,
          theme,
          token,
          from,
          to,
          distance,
          role: tiers.role,
          tier: tierOf(distance, tiers),
          reasoned,
          approved: approved(candidate.approvals, id, token, theme),
          hueTurn: turn,
          keyColor: key && distance > 1e-9 && !adjusts(c.keys, key.hue, key.mode) ? key : null,
        });
      }
    }
  }
  return out.filter((m) => m.tier !== "none");
}

/** Recorded key colors that changed with no adjustment recorded: [{ scheme, hue, mode, from, to }]. */
export function keyChanges(base, candidate) {
  const out = [];
  for (const [id, c] of Object.entries(candidate.schemes)) {
    const b = base.schemes[id];
    for (const [hue, modes] of Object.entries(b?.keys ?? {}))
      for (const [mode, k] of Object.entries(modes)) {
        const now = c.keys?.[hue]?.[mode];
        if (now && now.key !== k.key && !adjusts(c.keys, hue, mode) && !approved(candidate.approvals, id, `color.${hue}.${mode}.key`))
          out.push({ scheme: id, hue, mode, from: k.key, to: now.key });
      }
  }
  return out;
}

export const measure = () => [];

export function relative(base, candidate, params) {
  const moves = colorMoves(base, candidate, params);
  const line = (m) => `${m.scheme}/${m.theme} ${m.token}: ${m.from} → ${m.to}, ΔE ${fmt(m.distance)} (${m.tier}${m.role !== "default" ? `, ${m.role} limits` : ""})`;
  const byTier = (tier) => moves.filter((m) => m.tier === tier);
  const unreasoned = byTier("review").filter((m) => !m.reasoned && !m.approved);
  const unapproved = byTier("approval").filter((m) => !m.approved);
  const hue = moves.filter((m) => m.hueTurn > params.shift.hueDegrees && !m.approved);
  const keys = keyChanges(base, candidate);
  // A token on a key step that moved because its key changed is counted once, as the key.
  const keyTokens = moves.filter(
    (m) => m.keyColor && !m.approved && !keys.some((k) => k.scheme === m.scheme && k.hue === m.keyColor.hue && k.mode === m.keyColor.mode),
  );
  return [
    measureOf({
      id: "shift.moves",
      family: FAMILY,
      title: "Color tokens that moved, per scheme, brand and mode, every move listed by tier",
      direction: "report",
      value: moves.length,
      details: ["approval", "review", "pass"].flatMap((t) => [`${t}: ${byTier(t).length}`, ...byTier(t).map((m) => `  ${line(m)}`)]),
    }),
    measureOf({
      id: "shift.review-unreasoned",
      family: FAMILY,
      title: `Moves in the review tier (ΔE ${params.shift.pass} to ${params.shift.review}) with no new recorded reason`,
      direction: "down",
      value: unreasoned.length,
      details: unreasoned.map(line),
    }),
    measureOf({
      id: "shift.approval-unapproved",
      family: FAMILY,
      title: `Moves over ΔE ${params.shift.review} (or a role's own limit) that the owner has not approved`,
      direction: "down",
      value: unapproved.length,
      details: unapproved.map(line),
    }),
    measureOf({
      id: "shift.hue",
      family: FAMILY,
      title: `Chromatic tokens (C > ${params.shift.chroma}) whose hue turned more than ${params.shift.hueDegrees}°`,
      direction: "down",
      value: hue.length,
      details: hue.map((m) => `${line(m)}, hue turned ${m.hueTurn.toFixed(1)}°`),
    }),
    measureOf({
      id: "shift.key-colors",
      family: FAMILY,
      title: "Brand key colors that changed with no adjustment recorded",
      direction: "down",
      value: keys.length + keyTokens.length,
      details: [
        ...keys.map((k) => `${k.scheme}: the ${k.hue} ${k.mode} key ${k.from} → ${k.to}`),
        ...keyTokens.map((m) => `${line(m)}, on the ${m.keyColor.hue} ${m.keyColor.mode} key`),
      ],
    }),
  ];
}
