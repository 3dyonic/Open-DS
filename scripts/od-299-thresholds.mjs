#!/usr/bin/env node
// OD-299 threshold research: the smallest pairwise OKLab distance in the status and category colors of
// five published design systems, under each vision. Reads harness/research/od-299-difference-sources.json
// and writes its measured block back. With --check, it writes nothing and exits 1 when the stored block
// differs from a fresh measure.
//
//   node scripts/od-299-thresholds.mjs [--check]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { VISIONS } from "../cli/src/quality/color.mjs";
import { smallestDistance } from "../cli/src/quality/difference.mjs";

const file = join(dirname(fileURLToPath(import.meta.url)), "..", "harness", "research", "od-299-difference-sources.json");

/** The measured block of a research record: { system: { set: { vision: { distance, pair } } } }. */
export function measured(record) {
  return Object.fromEntries(
    record.systems.map((sys) => [
      sys.id,
      Object.fromEntries(
        Object.entries(sys.sets).map(([set, { colors }]) => [
          set,
          Object.fromEntries(
            Object.keys(VISIONS).map((v) => {
              const m = smallestDistance(colors, v);
              return [v, { distance: +m.distance.toFixed(4), pair: m.pair }];
            }),
          ),
        ]),
      ),
    ]),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const record = JSON.parse(readFileSync(file, "utf8"));
  const fresh = measured(record);
  if (process.argv.includes("--check")) {
    const same = JSON.stringify(fresh) === JSON.stringify(record.measured);
    console.log(same ? "The measured block matches the sources." : "The measured block is out of date. Run: node scripts/od-299-thresholds.mjs");
    process.exit(same ? 0 : 1);
  }
  writeFileSync(file, `${JSON.stringify({ ...record, measured: fresh }, null, 2)}\n`);
  for (const [sys, sets] of Object.entries(fresh))
    for (const [set, by] of Object.entries(sets))
      console.log(`${sys} ${set}: ${Object.entries(by).map(([v, m]) => `${v} ${m.distance} (${m.pair.join("/")})`).join(", ")}`);
}
