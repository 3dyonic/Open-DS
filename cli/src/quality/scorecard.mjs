// The quality scorecard: pure functions over snapshots. measureAll gives one snapshot's
// numbers; compareSnapshots puts a base and a candidate side by side; gateAgainstBaseline checks a
// candidate's numbers against the recorded baseline. Each criterion: { id, base, candidate, delta,
// direction, pass, details }.
import * as accessibility from "./criteria/accessibility.mjs";
import * as blastRadius from "./criteria/blast-radius.mjs";
import * as colorRelations from "./criteria/color-relations.mjs";
import * as componentPairs from "./criteria/component-pairs.mjs";
import * as curves from "./criteria/curves.mjs";
import * as derived from "./criteria/derived.mjs";
import * as invariants from "./criteria/invariants.mjs";
import * as motion from "./criteria/motion.mjs";
import * as repetition from "./criteria/repetition.mjs";
import * as shift from "./criteria/shift.mjs";
import * as size from "./criteria/size.mjs";
import * as traceability from "./criteria/traceability.mjs";
import { componentPairRows } from "./criteria/component-pairs.mjs";
import { DEFAULT_PARAMS } from "./params.mjs";
import { RELATION_LIST } from "./relations.mjs";

/** The criterion families, in the order the scorecard shows them. */
export const FAMILIES = [traceability, derived, invariants, blastRadius, accessibility, motion, repetition, size, shift, colorRelations, curves, componentPairs];

/** Every measure of one snapshot, family by family. */
export const measureAll = (snapshot, params = DEFAULT_PARAMS) => FAMILIES.flatMap((f) => f.measure(snapshot, params));

/** The measures that need both snapshots: new literals, color shifts, relations kept, component pairs. */
export const measureRelative = (base, candidate, params = DEFAULT_PARAMS) => FAMILIES.flatMap((f) => f.relative?.(base, candidate, params) ?? []);

/**
 * Whether a value moved the right way: "down" passes when it did not rise, "up" when it did not fall.
 * A measure either side does not have passes: it is new, or not present yet.
 */
export function passes(direction, base, candidate) {
  if (direction === "report" || base === null || base === undefined || candidate === null || candidate === undefined) return true;
  return direction === "down" ? candidate <= base + 1e-9 : candidate >= base - 1e-9;
}

/**
 * The parts (schemes, scheme themes or files) that moved the wrong way, so a fix in one part never
 * hides a breach in another: [{ part, base, candidate }]. A count (down) a side does not list is 0 there;
 * a share (up) a side does not list is new, so it passes.
 */
export function partRegressions(direction, base, candidate) {
  if (direction === "report" || !base || !candidate) return [];
  const absent = direction === "down" ? 0 : null;
  const out = [];
  for (const part of [...new Set([...Object.keys(base), ...Object.keys(candidate)])].sort()) {
    const [b, c] = [base[part] ?? absent, candidate[part] ?? absent];
    if (!passes(direction, b, c)) out.push({ part, base: b, candidate: c });
  }
  return out;
}

const delta = (base, candidate) => (typeof base === "number" && typeof candidate === "number" ? Math.round((candidate - base) * 10000) / 10000 : null);

/** One criterion row from a base and a candidate measure of the same id. */
export function criterionRow(b, c) {
  const m = c ?? b;
  const base = b?.value ?? null;
  const candidate = c?.value ?? null;
  const present = base !== null && candidate !== null;
  const regressions = present ? partRegressions(m.direction, b.parts ?? b.perScheme, c.parts ?? c.perScheme) : [];
  return {
    id: m.id,
    family: m.family,
    title: m.title,
    direction: m.direction,
    gated: m.gated,
    base,
    candidate,
    delta: delta(base, candidate),
    pass: passes(m.direction, base, candidate) && regressions.length === 0,
    regressions,
    perScheme: { base: b?.perScheme ?? {}, candidate: c?.perScheme ?? {} },
    parts: { base: b?.parts ?? b?.perScheme ?? {}, candidate: c?.parts ?? c?.perScheme ?? {} },
    notes: m.notes ?? [],
    details: c?.details ?? b?.details ?? [],
  };
}

/** The scorecard of a candidate against a base snapshot. */
export function compareSnapshots(base, candidate, params = DEFAULT_PARAMS) {
  const b = new Map(measureAll(base, params).map((m) => [m.id, m]));
  const c = new Map(measureAll(candidate, params).map((m) => [m.id, m]));
  const ids = [...new Set([...b.keys(), ...c.keys()])];
  const rows = ids.map((id) => criterionRow(b.get(id), c.get(id)));
  // A relative measure is zero for the base by definition: nothing is new against itself.
  for (const m of measureRelative(base, candidate, params)) rows.push(criterionRow({ ...m, value: 0, perScheme: {}, parts: {}, details: [] }, m));
  const failed = rows.filter((r) => r.gated && !r.pass);
  return {
    base: { ref: base.ref, sha: base.sha },
    candidate: { ref: candidate.ref, sha: candidate.sha },
    pass: failed.length === 0,
    failed: failed.map((r) => r.id),
    notes: rows.flatMap((r) => r.notes.map((note) => ({ id: r.id, note }))),
    criteria: rows,
    relations: relationTable(base, candidate),
    params,
    componentPairs: pairSummary(componentPairRows(base, candidate, params)),
  };
}

const pairSummary = (rows) => ({ compared: rows.length, flagged: rows.filter((r) => r.flagged) });

/** Each relation per scheme, base against candidate: [{ scheme, relation, base, candidate }]. */
export function relationTable(base, candidate) {
  const ids = [...new Set([...Object.keys(base.schemes), ...Object.keys(candidate.schemes)])];
  return ids.flatMap((scheme) =>
    RELATION_LIST.map((r) => {
      const status = (snap) => {
        const x = snap.schemes[scheme]?.relations.find((y) => y.id === r.id);
        if (!x) return "not present";
        const failing = x.checks.filter((c) => !c.pass).length;
        return x.status === "fail" ? `fail (${failing} of ${x.checks.length})` : x.status;
      };
      return { scheme, relation: r.id, family: r.family, kind: r.kind, base: status(base), candidate: status(candidate) };
    }),
  );
}

/** The baseline file's content from one snapshot: each measure's value and direction. */
export function baselineOf(snapshot, params = DEFAULT_PARAMS) {
  return {
    $description:
      "The quality gate's baseline: each criterion's value on the ref below, its value per part (scheme, scheme/theme or file), and the way it may move (down: may only go down; up: may only go up; report: not gated). gated: false is shown, not gated. Each part is gated on its own. Refresh on purpose: open-ds compare --base origin/master --write-baseline.",
    ref: snapshot.ref,
    sha: snapshot.sha,
    criteria: Object.fromEntries(measureAll(snapshot, params).map((m) => [m.id, { value: m.value, direction: m.direction, gated: m.gated, parts: m.parts }])),
  };
}

/**
 * A snapshot's numbers against the baseline: { ok, worse, better, missing }. worse lists each gated
 * criterion, or part of one, that moved the wrong way; better each that moved the right way (lower the
 * baseline).
 */
export function gateAgainstBaseline(snapshot, baseline, params = DEFAULT_PARAMS) {
  const worse = [];
  const better = [];
  const missing = [];
  for (const m of measureAll(snapshot, params)) {
    const was = baseline.criteria?.[m.id];
    if (!was) {
      missing.push(m.id);
      continue;
    }
    const direction = was.direction ?? m.direction;
    if (direction === "report" || !m.gated) continue;
    const line = `${m.id}: ${was.value} → ${m.value}`;
    // A baseline written before parts were recorded gates the total only.
    const parts = was.value === null || m.value === null || !was.parts ? [] : partRegressions(direction, was.parts, m.parts);
    if (!passes(direction, was.value, m.value)) worse.push(line);
    else if (parts.length) worse.push(`${m.id} in ${parts.map((p) => `${p.part} ${p.base} → ${p.candidate}`).join(", ")}`);
    else if (m.value !== was.value && m.value !== null && was.value !== null) better.push(line);
  }
  return { ok: worse.length === 0, worse, better, missing };
}

const num = (v) => (v === null || v === undefined ? "not present" : Number.isInteger(v) ? String(v) : v.toFixed(4));
const sign = (d) => (d === null ? "" : d > 0 ? `+${num(d)}` : d < 0 ? num(d) : "0");
const arrow = { down: "↓ lower is better", up: "↑ higher is better", report: "shown, not gated" };
const directionOf = (r) => (r.gated || r.direction === "report" ? arrow[r.direction] : `${arrow[r.direction]}, not gated`);
const resultOf = (r) => (!r.gated ? "—" : r.pass ? "pass" : r.regressions.length && passes(r.direction, r.base, r.candidate) ? "**fail** in a part" : "**fail**");
const partLine = (p) => `${p.part} ${num(p.base)} → ${num(p.candidate)}`;

/**
 * The scorecard as Markdown, for people: the verdict, the notes, the table, each relation per scheme,
 * then the detail. Each criterion shows its first detailLines lines and a count of the rest; scorecard.json
 * keeps them all.
 */
export function scorecardMarkdown(card, { detailLines = 10 } = {}) {
  const lines = [
    "# Scheme quality scorecard",
    "",
    `Base: \`${card.base.ref}\`${card.base.sha ? ` (${card.base.sha.slice(0, 10)})` : ""}. Candidate: \`${card.candidate.ref}\`${card.candidate.sha ? ` (${card.candidate.sha.slice(0, 10)})` : ""}.`,
    "",
    card.pass ? "**Pass.** No gated criterion moved the wrong way." : `**Fail.** ${card.failed.length} gated criteria moved the wrong way: ${card.failed.join(", ")}.`,
    "",
    "Every number is computed by code from the two checkouts. Run `open-ds compare --base <ref>` to produce it again. Each gated count is gated per scheme (and per scheme and theme where it applies): a breach in one part fails, whatever the total does.",
    "",
    ...(card.notes?.length ? ["## Notes", "", ...card.notes.map((n) => `- \`${n.id}\`: ${n.note}`), ""] : []),
    "| Criterion | Base | Candidate | Delta | Direction | Result |",
    "| --- | ---: | ---: | ---: | --- | --- |",
    ...card.criteria.map((r) => `| \`${r.id}\` | ${num(r.base)} | ${num(r.candidate)} | ${sign(r.delta)} | ${directionOf(r)} | ${resultOf(r)} |`),
    "",
    "## Relations per scheme",
    "",
    "| Scheme | Relation | Kind | Base | Candidate |",
    "| --- | --- | --- | --- | --- |",
    ...card.relations.map((r) => `| ${r.scheme} | \`${r.relation}\` | ${r.kind} | ${r.base} | ${r.candidate} |`),
    "",
    "## Detail",
    "",
  ];
  for (const r of card.criteria) {
    lines.push(`### \`${r.id}\``, "", r.title, "");
    const schemes = [...new Set([...Object.keys(r.perScheme.base), ...Object.keys(r.perScheme.candidate)])];
    if (schemes.length)
      lines.push(`Per scheme (base → candidate): ${schemes.map((s) => `${s} ${num(r.perScheme.base[s] ?? null)} → ${num(r.perScheme.candidate[s] ?? null)}`).join("; ")}.`, "");
    if (r.regressions?.length) lines.push(`Worse in: ${r.regressions.map(partLine).join("; ")}.`, "");
    const shown = r.details.slice(0, detailLines);
    if (shown.length) lines.push(...shown.map((d) => `- ${d}`), ...(r.details.length > detailLines ? [`- … ${r.details.length - detailLines} more in scorecard.json`] : []), "");
  }
  return `${lines.join("\n")}\n`;
}
