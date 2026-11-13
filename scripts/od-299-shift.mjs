#!/usr/bin/env node
// OD-299 shift report: every color token per scheme, brand and mode, on the shared curve and on the
// contrast-graded curve, with its OKLab distance and tier. Writes build/od-299/shift-report.md and
// shift-report.json (git does not keep build/).
//
//   node scripts/od-299-shift.mjs           the report
//   node scripts/od-299-shift.mjs --reasons record the reason of each review-tier move
//   node scripts/od-299-shift.mjs --hold    also hold each step with a move over its limit: the step
//                                           keeps the shared curve (its hue spec's held list), until
//                                           no move is over its limit. A move the owner approved in
//                                           harness/quality-approvals.json is not over its limit.
//   node scripts/od-299-shift.mjs --release <ids> --ticket <key> --approved-by "<name, date>"
//                                           the owner approved the moves over the limit in these
//                                           schemes: drop their over-limit and order holds, hold
//                                           again (relation and order only), then record an approval
//                                           for each move over its limit that is left
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { grammar as loadGrammar, loadScheme, saveScheme, schemeIds, storedScheme } from "../cli/src/schemes.mjs";
import { themeTokens } from "../cli/src/tokens.mjs";
import { answersOf, curveSnapshots, shiftReport, stepsToHold } from "../cli/src/quality/curve-shift.mjs";
import { curveOf } from "../cli/src/color-steps.mjs";
import { scale } from "../cli/src/ramps.mjs";
import { darkCanvas } from "../cli/src/scheme-generated.mjs";
import { oklabDistance } from "../cli/src/quality/color.mjs";
import { approvalsFrom } from "../cli/src/quality/approvals.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Both snapshots of this checkout. */
export function snapshots(ids = schemeIds()) {
  return curveSnapshots({
    ids,
    load: (id, graded) => loadScheme(id, undefined, { graded }),
    stored: (id) => storedScheme(id),
    grammar: loadGrammar(),
    themeTokens,
  });
}

const ORDER = ["50", "100", "200", "300", "400", "500", "700", "800", "900", "950"];

// Write each held step into its hue spec, and give every held step its run to its end of the scale.
// Returns the number of steps it added.
function hold(toHold) {
  let added = 0;
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    let changed = false;
    for (const [hue, g] of Object.entries(s.tokens.primitive.color)) {
      const ext = g?.$extensions?.["open-ds"];
      for (const mode of ["light", "dark"]) {
        const spec = ext?.[mode];
        const steps = toHold[id]?.[hue]?.[mode] ?? {};
        if (!spec || (!spec.held && !Object.keys(steps).length)) continue;
        const held = { ...(spec.held ?? {}) };
        const before = Object.keys(held).length;
        for (const [st, why] of Object.entries(steps)) held[st] ??= why;
        // A held step holds its run to its end of the scale, so held and graded steps never swap.
        for (const st of Object.keys(held))
          for (const other of ORDER) if ((+st < 600 && +other < +st) || (+st > 600 && +other > +st)) held[other] ??= "order";
        if (Object.keys(held).length === before) continue;
        added += Object.keys(held).length - before;
        changed = true;
        spec.held = Object.fromEntries(Object.entries(held).sort(([a], [b]) => a - b));
        // The loaded row was generated before this hold; drop it, so saveScheme stores only the spec.
        delete g[mode];
      }
    }
    if (changed) saveScheme(s);
  }
  return added;
}

const f3 = (n) => n.toFixed(3);

/** Where the owner's approvals live. A move over its limit with an approval here moves; it is not held. */
export const APPROVALS = join(root, "harness", "quality-approvals.json");
const readApprovals = () => approvalsFrom(JSON.parse(readFileSync(APPROVALS, "utf8")));

// Drop the over-limit and order holds of these schemes; relation holds stay. The next hold round gives
// each run its order holds again. Returns the number dropped.
function release(ids) {
  let dropped = 0;
  for (const id of ids) {
    const s = loadScheme(id);
    for (const [hue, g] of Object.entries(s.tokens.primitive.color)) {
      const ext = g?.$extensions?.["open-ds"];
      for (const mode of ["light", "dark"]) {
        if (!ext?.[mode]?.held) continue;
        const kept = Object.fromEntries(Object.entries(ext[mode].held).filter(([, why]) => why === "relation"));
        dropped += Object.keys(ext[mode].held).length - Object.keys(kept).length;
        if (Object.keys(kept).length) ext[mode].held = Object.fromEntries(Object.entries(kept).sort(([a], [b]) => a - b));
        else delete ext[mode].held;
        delete g[mode];
      }
    }
    saveScheme(s);
  }
  return dropped;
}

/**
 * The approval entries for each move over its limit in these schemes: a scale step (its mode is the
 * theme) and a semantic token (per theme), each to the value it moves to.
 */
export function overLimitApprovals(r, { ids, ticket, approvedBy }) {
  const why = (what) => `Cause: ${ticket}. The owner approved the contrast-graded curve for this scheme. ${what} moves over the shift limit to its graded value.`;
  const steps = r.steps
    .filter((m) => ids.includes(m.scheme) && m.tier === "approval")
    .map((m) => ({ scheme: m.scheme, theme: m.mode, check: "shift.approval-unapproved", token: `color.${m.hue}.${m.mode}.${m.step}`, to: m.to.toLowerCase(), why: why(`The step ${m.hue} ${m.step}`), approved_by: approvedBy }));
  const tokens = r.moves
    .filter((m) => ids.includes(m.scheme) && m.tier === "approval")
    .map((m) => ({ scheme: m.scheme, theme: m.theme, check: "shift.approval-unapproved", token: m.token, to: m.to.toLowerCase(), why: why(`The token ${m.token}`), approved_by: approvedBy }));
  return [...steps, ...tokens];
}

// Replace this ticket's approvals in these schemes with the given list, and keep every other entry.
function recordApprovals(list, { ids, ticket }) {
  const doc = JSON.parse(readFileSync(APPROVALS, "utf8"));
  const ours = (a) => ids.includes(a.scheme) && a.check === "shift.approval-unapproved" && a.why.startsWith(`Cause: ${ticket}.`);
  doc.approvals = [...doc.approvals.filter((a) => !ours(a)), ...list];
  approvalsFrom(doc);
  writeFileSync(APPROVALS, `${JSON.stringify(doc, null, 2)}\n`);
}

/** Where the reasons for the review-tier moves live. The harness check color-curve-shift reads them. */
export const REASONS = join(root, "harness", "od-299-shift-reasons.json");

/**
 * The reason a scheme gives its review-tier moves: it names the method and the scheme's answer. tickets
 * are the tickets in which the owner approved the scheme's moves over the limit.
 */
export const reasonFor = (answer, tickets = []) =>
  `Method: contrast-graded steps, ${answer.option} (easing ${answer.easing}). The step takes the luminance that keeps steps 400, 500 and 700 apart at 3:1, 4.5:1 and 7:1. Steps 50 and 950 and the key at 600 stay.${tickets.length ? ` The owner approved the moves over the limit in ${tickets.join(", ")}, so those steps move too. harness/quality-approvals.json lists each one.` : ""}`;

// The tickets of the approvals that clear a scheme's moves over the limit, from each approval's cause.
const approvalTickets = (r, approvals, id) => {
  const over = [...r.moves, ...r.steps].filter((m) => m.scheme === id && m.tier === "approval" && m.approved);
  const tokenOf = (m) => m.token ?? `color.${m.hue}.${m.mode}.${m.step}`;
  const tickets = approvals
    .filter((a) => a.scheme === id && over.some((m) => tokenOf(m) === a.token))
    .map((a) => a.why.match(/^Cause: ([A-Z]+-\d+)\./)?.[1])
    .filter(Boolean);
  return [...new Set(tickets)].sort();
};

/** The reasons record from a report: { description, schemes: { id: { reason, tokens, steps } } }. */
export function reasonsRecord(r, answers, approvals = []) {
  const schemes = {};
  for (const id of Object.keys(r.perScheme))
    schemes[id] = {
      reason: reasonFor(answers[id], approvalTickets(r, approvals, id)),
      tokens: r.moves.filter((m) => m.scheme === id && m.tier === "review").map((m) => `${m.theme} ${m.token}`).sort(),
      steps: r.steps.filter((m) => m.scheme === id && m.tier === "review").map((m) => `${m.hue}.${m.mode}.${m.step}`).sort(),
    };
  return {
    description:
      "OD-299: the recorded reason for each color move in the review tier (OKLab 0.02 to 0.05; 0.01 to 0.02 for a surface) between the shared curve and the contrast-graded curve. Each scheme's reason names the method. The harness check color-curve-shift fails a review move with no entry here, and an entry with no move. Written by node scripts/od-299-shift.mjs --reasons.",
    schemes,
  };
}

/**
 * Every held step, with what it keeps and what the graded curve would give it:
 * [{ scheme, hue, mode, step, why, from, to, distance }].
 */
export function heldSteps(ids) {
  const out = [];
  for (const id of ids) {
    const sch = loadScheme(id);
    const canvas = darkCanvas(sch);
    const curve = curveOf(sch, true);
    for (const [hue, g] of Object.entries(sch.tokens.primitive.color)) {
      const spec = g?.$extensions?.["open-ds"];
      for (const mode of ["light", "dark"]) {
        if (!spec?.[mode]?.held) continue;
        const kept = scale(spec[mode], mode, canvas, null);
        const free = scale({ ...spec[mode], held: {} }, mode, canvas, curve);
        for (const [step, why] of Object.entries(spec[mode].held))
          out.push({ scheme: id, hue, mode, step, why, from: kept[step], to: free[step], distance: oklabDistance(kept[step], free[step]) });
      }
    }
  }
  return out;
}

/** The report as Markdown. */
export function reportMarkdown(r, answers, heldList) {
  const lines = ["# OD-299 shift report: the shared curve against the contrast-graded curve", ""];
  lines.push("Every color token in every scheme, brand and mode. Tiers: under 0.02 OKLab passes; 0.02 to 0.05 needs a recorded reason (harness/od-299-shift-reasons.json); over 0.05 keeps its current value (held). Surfaces: under 0.01 passes, 0.01 to 0.02 needs a reason.", "");
  lines.push("| Scheme | Steps answer (easing) | Tokens pass | Tokens review | Tokens over | Steps pass | Steps review | Steps over | Held steps | Grade misses old → new |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const [id, p] of Object.entries(r.perScheme)) {
    const held = heldList.filter((h) => h.scheme === id).length;
    lines.push(`| ${id} | ${answers[id]?.option} (${answers[id]?.easing}) | ${p.tokens.pass} | ${p.tokens.review} | ${p.tokens.approval} | ${p.steps.pass} | ${p.steps.review} | ${p.steps.approval} | ${held} | ${p.gradesOld} → ${p.gradesNew} |`);
  }
  lines.push("", "## Relation gates", "", r.relations.length ? r.relations.map((m) => `- ${m.id}: ${m.value}\n${m.details.slice(0, 20).map((d) => `  - ${d}`).join("\n")}`).join("\n") : "Every gate holds: no contrast pair drops a level, step and ladder order hold, state steps keep their direction and gap, distinct pairs stay distinct under each vision, shared colors stay shared.", "");
  lines.push(r.keys.length ? `Brand key colors that changed: ${r.keys.length}.` : "Brand key colors: all exact.", "");
  lines.push("## Held steps (the owner's list)", "", "| Scheme | Step | Why held | Kept (shared curve) | Graded curve would give | OKLab distance |", "| --- | --- | --- | --- | --- | --- |");
  for (const h of heldList) lines.push(`| ${h.scheme} | ${h.hue}.${h.mode}.${h.step} | ${h.why} | ${h.from} | ${h.to} | ${f3(h.distance)} |`);
  lines.push("", "## Every token move", "");
  for (const tier of ["approval", "review", "pass"]) {
    const list = r.moves.filter((m) => m.tier === tier);
    lines.push(`### ${tier} (${list.length})`, "");
    for (const m of list) lines.push(`- ${m.scheme}/${m.theme} ${m.token}: ${m.from} → ${m.to}, ${f3(m.distance)}${m.role !== "default" ? ` (${m.role} limits)` : ""}`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

const option = (name) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};

// Hold until nothing more is held. approve(s) gives the approvals each round reads.
function holdRounds(approve) {
  for (let round = 1; round <= 10; round++) {
    const s = snapshots();
    const added = hold(stepsToHold(s.old, s.new, undefined, approve(s)));
    console.log(`Round ${round}: held ${added} more steps.`);
    if (!added) break;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const releaseIds = option("--release")?.split(",");
  if (releaseIds) {
    const [ticket, approvedBy] = [option("--ticket"), option("--approved-by")];
    const unknown = releaseIds.filter((id) => !schemeIds().includes(id));
    if (unknown.length || !/^[A-Z]+-\d+$/.test(ticket ?? "") || !approvedBy) {
      console.error(`--release needs known scheme ids (not ${unknown.join(", ") || "none"}), --ticket <KEY-123> and --approved-by "<name, date>". Nothing changed.`);
      process.exit(1);
    }
    console.log(`Released ${release(releaseIds)} over-limit and order holds in ${releaseIds.join(", ")}.`);
    // While the holds settle, every move over its limit in these schemes counts as approved; the
    // relation gates and the order still hold their steps.
    holdRounds((s) => [...readApprovals(), ...overLimitApprovals(shiftReport(s.old, s.new), { ids: releaseIds, ticket, approvedBy })]);
    const s = snapshots();
    const list = overLimitApprovals(shiftReport(s.old, s.new), { ids: releaseIds, ticket, approvedBy });
    recordApprovals(list, { ids: releaseIds, ticket });
    console.log(`Recorded ${list.length} approvals for ${ticket}.`);
  }
  if (process.argv.includes("--hold")) holdRounds(() => readApprovals());
  const approvals = readApprovals();
  const s = snapshots();
  const r = shiftReport(s.old, s.new, undefined, approvals);
  const answers = answersOf(Object.fromEntries(schemeIds().map((id) => [id, loadScheme(id)])));
  // The held steps, as the graded curve would set them without the hold.
  if (process.argv.includes("--reasons")) writeFileSync(REASONS, `${JSON.stringify(reasonsRecord(r, answers, approvals), null, 2)}\n`);
  const heldList = heldSteps(schemeIds());
  const out = join(root, "build", "od-299");
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "shift-report.json"), `${JSON.stringify({ perScheme: r.perScheme, relations: r.relations, keys: r.keys, held: heldList, moves: r.moves, steps: r.steps }, null, 2)}\n`);
  writeFileSync(join(out, "shift-report.md"), reportMarkdown(r, answers, heldList));
  console.log(JSON.stringify(r.perScheme));
  const over = [...r.moves, ...r.steps].filter((m) => m.tier === "approval");
  console.log(`Moves over the limit: ${over.length}, approved by the owner: ${over.filter((m) => m.approved).length}.`);
  console.log(`Relation gates firing: ${r.relations.map((m) => `${m.id} ${m.value}`).join(", ") || "none"}. Brand keys changed: ${r.keys.length}.`);
}
