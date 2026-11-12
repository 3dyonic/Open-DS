// The quality scorecard (OD-298): pure functions over snapshots. measureAll gives one snapshot's
// numbers; compareSnapshots puts a base and a candidate side by side; gateAgainstBaseline checks a
// candidate's numbers against the recorded baseline. Each criterion: { id, base, candidate, delta,
// direction, pass, details }.
import * as accessibility from "./criteria/accessibility.mjs";
import * as blastRadius from "./criteria/blast-radius.mjs";
import * as derived from "./criteria/derived.mjs";
import * as invariants from "./criteria/invariants.mjs";
import * as motion from "./criteria/motion.mjs";
import * as repetition from "./criteria/repetition.mjs";
import * as size from "./criteria/size.mjs";
import * as traceability from "./criteria/traceability.mjs";
import { RELATION_LIST } from "./relations.mjs";

/** The criterion families, in the order the scorecard shows them. */
export const FAMILIES = [traceability, derived, invariants, blastRadius, accessibility, motion, repetition, size];

/** Every measure of one snapshot, family by family. */
export const measureAll = (snapshot) => FAMILIES.flatMap((f) => f.measure(snapshot));

/** The measures that need both snapshots (new literals against the base). */
export const measureRelative = (base, candidate) => FAMILIES.flatMap((f) => f.relative?.(base, candidate) ?? []);

/**
 * Whether a value moved the right way: "down" passes when it did not rise, "up" when it did not fall.
 * A measure either side does not have passes: it is new, or not present yet.
 */
export function passes(direction, base, candidate) {
  if (direction === "report" || base === null || base === undefined || candidate === null || candidate === undefined) return true;
  return direction === "down" ? candidate <= base + 1e-9 : candidate >= base - 1e-9;
}

const delta = (base, candidate) => (typeof base === "number" && typeof candidate === "number" ? Math.round((candidate - base) * 10000) / 10000 : null);

/** One criterion row from a base and a candidate measure of the same id. */
export function criterionRow(b, c) {
  const m = c ?? b;
  const base = b?.value ?? null;
  const candidate = c?.value ?? null;
  return {
    id: m.id,
    family: m.family,
    title: m.title,
    direction: m.direction,
    gated: m.gated,
    base,
    candidate,
    delta: delta(base, candidate),
    pass: passes(m.direction, base, candidate),
    perScheme: { base: b?.perScheme ?? {}, candidate: c?.perScheme ?? {} },
    details: c?.details ?? b?.details ?? [],
  };
}

/** The scorecard of a candidate against a base snapshot. */
export function compareSnapshots(base, candidate) {
  const b = new Map(measureAll(base).map((m) => [m.id, m]));
  const c = new Map(measureAll(candidate).map((m) => [m.id, m]));
  const ids = [...new Set([...b.keys(), ...c.keys()])];
  const rows = ids.map((id) => criterionRow(b.get(id), c.get(id)));
  // A relative measure is zero for the base by definition: nothing is new against itself.
  for (const m of measureRelative(base, candidate)) rows.push(criterionRow({ ...m, value: 0, perScheme: {}, details: [] }, m));
  const failed = rows.filter((r) => r.gated && !r.pass);
  return {
    base: { ref: base.ref, sha: base.sha },
    candidate: { ref: candidate.ref, sha: candidate.sha },
    pass: failed.length === 0,
    failed: failed.map((r) => r.id),
    criteria: rows,
    relations: relationTable(base, candidate),
  };
}

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
export function baselineOf(snapshot) {
  return {
    $description:
      "The quality gate's baseline (OD-298): each criterion's value on the ref below and the way it may move (down: may only go down; up: may only go up; report: not gated). Refresh on purpose: open-ds compare --base origin/master --write-baseline.",
    ref: snapshot.ref,
    sha: snapshot.sha,
    criteria: Object.fromEntries(measureAll(snapshot).map((m) => [m.id, { value: m.value, direction: m.direction }])),
  };
}

/**
 * A snapshot's numbers against the baseline: { ok, worse, better, missing }. worse lists each gated
 * criterion that moved the wrong way; better each that moved the right way (lower the baseline).
 */
export function gateAgainstBaseline(snapshot, baseline) {
  const worse = [];
  const better = [];
  const missing = [];
  for (const m of measureAll(snapshot)) {
    const was = baseline.criteria?.[m.id];
    if (!was) {
      missing.push(m.id);
      continue;
    }
    const direction = was.direction ?? m.direction;
    if (direction === "report" || !m.gated) continue;
    const line = `${m.id}: ${was.value} → ${m.value}`;
    if (!passes(direction, was.value, m.value)) worse.push(line);
    else if (m.value !== was.value && m.value !== null && was.value !== null) better.push(line);
  }
  return { ok: worse.length === 0, worse, better, missing };
}

const num = (v) => (v === null || v === undefined ? "not present" : Number.isInteger(v) ? String(v) : v.toFixed(4));
const sign = (d) => (d === null ? "" : d > 0 ? `+${num(d)}` : d < 0 ? num(d) : "0");
const arrow = { down: "↓ lower is better", up: "↑ higher is better", report: "shown, not gated" };

/** The scorecard as Markdown, for people: the verdict, the table, each relation per scheme, then the detail. */
export function scorecardMarkdown(card, { detailLines = 12 } = {}) {
  const lines = [
    "# Scheme quality scorecard",
    "",
    `Base: \`${card.base.ref}\`${card.base.sha ? ` (${card.base.sha.slice(0, 10)})` : ""}. Candidate: \`${card.candidate.ref}\`${card.candidate.sha ? ` (${card.candidate.sha.slice(0, 10)})` : ""}.`,
    "",
    card.pass ? "**Pass.** No gated criterion moved the wrong way." : `**Fail.** ${card.failed.length} gated criteria moved the wrong way: ${card.failed.join(", ")}.`,
    "",
    "Every number is computed by code from the two checkouts. Run `open-ds compare --base <ref>` to produce it again.",
    "",
    "| Criterion | Base | Candidate | Delta | Direction | Result |",
    "| --- | ---: | ---: | ---: | --- | --- |",
    ...card.criteria.map((r) => `| \`${r.id}\` | ${num(r.base)} | ${num(r.candidate)} | ${sign(r.delta)} | ${arrow[r.direction]} | ${r.direction === "report" ? "—" : r.pass ? "pass" : "**fail**"} |`),
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
    const shown = r.details.slice(0, detailLines);
    if (shown.length) lines.push(...shown.map((d) => `- ${d}`), ...(r.details.length > detailLines ? [`- … ${r.details.length - detailLines} more in scorecard.json`] : []), "");
  }
  return `${lines.join("\n")}\n`;
}
