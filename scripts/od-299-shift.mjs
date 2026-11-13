#!/usr/bin/env node
// OD-299 shift report: every color token per scheme, brand and mode, on the shared curve and on the
// contrast-graded curve, with its OKLab distance and tier. Writes build/od-299/shift-report.md and
// shift-report.json (git does not keep build/).
//
//   node scripts/od-299-shift.mjs           the report
//   node scripts/od-299-shift.mjs --reasons record the reason of each review-tier move
//   node scripts/od-299-shift.mjs --hold    also hold each step with a move over its limit: the step
//                                           keeps the shared curve (its hue spec's held list), until
//                                           no move is over its limit
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { grammar as loadGrammar, loadScheme, saveScheme, schemeIds, storedScheme } from "../cli/src/schemes.mjs";
import { themeTokens } from "../cli/src/tokens.mjs";
import { answersOf, curveSnapshots, shiftReport, stepsToHold } from "../cli/src/quality/curve-shift.mjs";
import { curveOf } from "../cli/src/color-steps.mjs";
import { scale } from "../cli/src/ramps.mjs";
import { darkCanvas } from "../cli/src/scheme-generated.mjs";
import { oklabDistance } from "../cli/src/quality/color.mjs";

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

// Write each held step into its hue spec. Returns the number of steps it added.
function hold(toHold) {
  let added = 0;
  for (const [id, hues] of Object.entries(toHold)) {
    const s = loadScheme(id);
    for (const [hue, modes] of Object.entries(hues))
      for (const [mode, steps] of Object.entries(modes)) {
        const spec = s.tokens.primitive.color[hue].$extensions["open-ds"][mode];
        const held = { ...(spec.held ?? {}) };
        for (const [st, why] of Object.entries(steps)) if (!(st in held)) ((held[st] = why), added++);
        spec.held = Object.fromEntries(Object.entries(held).sort(([a], [b]) => a - b));
        // The loaded row was generated before this hold; drop it, so saveScheme stores only the spec.
        delete s.tokens.primitive.color[hue][mode];
      }
    saveScheme(s);
  }
  return added;
}

const f3 = (n) => n.toFixed(3);

/** Where the reasons for the review-tier moves live. The harness check color-curve-shift reads them. */
export const REASONS = join(root, "harness", "od-299-shift-reasons.json");

/** The reason a scheme gives its review-tier moves: it names the method and the scheme's answer. */
export const reasonFor = (answer) =>
  `Method: contrast-graded steps, ${answer.option} (easing ${answer.easing}). The step takes the luminance that keeps steps 400, 500 and 700 apart at 3:1, 4.5:1 and 7:1. Steps 50 and 950 and the key at 600 stay.`;

/** The reasons record from a report: { description, schemes: { id: { reason, tokens, steps } } }. */
export function reasonsRecord(r, answers) {
  const schemes = {};
  for (const id of Object.keys(r.perScheme))
    schemes[id] = {
      reason: reasonFor(answers[id]),
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

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--hold")) {
    for (let round = 1; round <= 10; round++) {
      const s = snapshots();
      const added = hold(stepsToHold(s.old, s.new));
      console.log(`Round ${round}: held ${added} more steps.`);
      if (!added) break;
    }
  }
  const s = snapshots();
  const r = shiftReport(s.old, s.new);
  const answers = answersOf(Object.fromEntries(schemeIds().map((id) => [id, loadScheme(id)])));
  // The held steps, as the graded curve would set them without the hold.
  if (process.argv.includes("--reasons")) writeFileSync(REASONS, `${JSON.stringify(reasonsRecord(r, answers), null, 2)}\n`);
  const heldList = heldSteps(schemeIds());
  const out = join(root, "build", "od-299");
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "shift-report.json"), `${JSON.stringify({ perScheme: r.perScheme, relations: r.relations, keys: r.keys, held: heldList, moves: r.moves, steps: r.steps }, null, 2)}\n`);
  writeFileSync(join(out, "shift-report.md"), reportMarkdown(r, answers, heldList));
  console.log(JSON.stringify(r.perScheme));
  console.log(`Relation gates firing: ${r.relations.map((m) => `${m.id} ${m.value}`).join(", ") || "none"}. Brand keys changed: ${r.keys.length}.`);
}
