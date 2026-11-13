#!/usr/bin/env node
// OD-299 difference check: the accent, status and category colors of each scheme, brand and mode, on
// each surface, under normal vision and simulated protanopia, deuteranopia and tritanopia. A pair
// closer than the scheme's color.values.difference threshold needs a second cue.
//
//   node scripts/od-299-difference.mjs                     the failing pairs, against the baseline
//   node scripts/od-299-difference.mjs --graded on|off     with the curve flag forced
//   node scripts/od-299-difference.mjs --write-baseline    write harness/color-difference-baseline.json
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadScheme, schemeIds } from "../cli/src/schemes.mjs";
import { themeTokens } from "../cli/src/tokens.mjs";
import { DIFFERENCE_BASELINE, againstBaseline, baselineRecord, differenceOf } from "../cli/src/quality/difference.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const forced = args.includes("--graded") ? args[args.indexOf("--graded") + 1] === "on" : undefined;
const schemes = Object.fromEntries(schemeIds().map((id) => [id, loadScheme(id, undefined, { graded: forced })]));
const failures = differenceOf(schemes, themeTokens);
const file = join(root, DIFFERENCE_BASELINE);
if (args.includes("--write-baseline")) {
  writeFileSync(file, `${JSON.stringify(baselineRecord(failures), null, 2)}\n`);
  console.log(`Wrote ${failures.length} failing pairs to ${DIFFERENCE_BASELINE}.`);
} else {
  const count = (key) => Object.entries(Object.groupBy(failures, key)).map(([k, v]) => `${k} ${v.length}`).join(", ");
  console.log(`${failures.length} failing pairs. By scheme: ${count((f) => f.scheme)}. By vision: ${count((f) => f.vision)}.`);
  const { added, fixed } = againstBaseline(failures, JSON.parse(readFileSync(file, "utf8")));
  console.log(`Against the baseline: ${added.length} new, ${fixed.length} fixed.`);
  for (const f of added.slice(0, 20)) console.log(`  new: ${f.id} ${f.distance.toFixed(3)}`);
}
