// The gap ledger's named list. Prints the counts per scheme and kind; with --baseline, writes each gap
// by name to harness/gaps-baseline.json. The harness fails a gap the list does not name, and a listed
// gap that is fixed now: a fix takes its gap out of the list in the same change, so the drop is on record.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assetRoots, grammar, loadScheme, schemeIds } from "../cli/src/schemes.mjs";
import { gapLedger } from "../cli/src/gaps.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE_DESCRIPTION =
  "The gap ledger's gaps today, one name each: the scheme, the kind, and what the gap names (its component, key or token, state, property, brand and mode). The harness check gaps-only-go-down fails on a gap this list does not name, and on a listed gap that is fixed now: take it out. Written by node scripts/gaps.mjs --baseline.";

/** A gap's name in the baseline: its scheme, its kind, and the fields of the gap that say where it is. */
export const gapName = (scheme, gap) =>
  [
    scheme,
    gap.kind,
    gap.component,
    gap.key ?? gap.token ?? gap.semantic,
    gap.state,
    gap.property,
    gap.brand && `${gap.brand}/${gap.mode}`,
  ]
    .filter(Boolean)
    .join(" ");

/** Each scheme's gap ledger, in the grammar's scheme order: [ledger]. */
export function gapLedgers(roots = assetRoots()) {
  const g = grammar(roots);
  return schemeIds(roots).map((id) => gapLedger(loadScheme(id, roots), g, roots));
}

/** Every gap of every ledger, named: [{ id, scheme, kind, says }]. */
export const namedGaps = (ledgers) =>
  ledgers.flatMap((l) =>
    l.gaps.map((x) => ({ id: gapName(l.scheme, x), scheme: l.scheme, kind: x.kind, says: x.says })),
  );

/** The baseline file of a list of named gaps: { description, failures: [id] }, sorted. */
export const gapsBaseline = (gaps) => ({
  description: BASELINE_DESCRIPTION,
  failures: [...new Set(gaps.map((x) => x.id))].sort(),
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const ledgers = gapLedgers();
  if (process.argv.includes("--baseline")) {
    const file = join(root, "harness", "gaps-baseline.json");
    writeFileSync(file, `${JSON.stringify(gapsBaseline(namedGaps(ledgers)), null, 2)}\n`);
    console.log(`Wrote ${file}.`);
  }
  console.table(Object.fromEntries(ledgers.map((l) => [l.scheme, l.counts])));
}
