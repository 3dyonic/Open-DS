// Decision coverage (OD-273): how many semantic values in each scheme rest on no decision. Prints the
// count per scheme and each unlinked token by the scope that owns it; with --baseline, writes the
// counts to harness/coverage-baseline.json. The harness lets each count only go down.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assetRoots, grammar, loadScheme, schemeIds } from "../cli/src/schemes.mjs";
import { decisionCoverage } from "../cli/src/coverage.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE_DESCRIPTION =
  "Semantic values per scheme that rest on no decision (OD-273). Each may only go down: node scripts/coverage.mjs --baseline after a fix.";

/** The coverage of every scheme, in the grammar's scheme order. */
export function coverageOfSchemes(roots = assetRoots()) {
  const g = grammar(roots);
  return schemeIds(roots).map((id) => decisionCoverage(loadScheme(id, roots), g));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const all = coverageOfSchemes();
  const counts = Object.fromEntries(all.map((c) => [c.scheme, c.unlinked.length]));
  if (process.argv.includes("--baseline")) {
    const file = join(root, "harness", "coverage-baseline.json");
    writeFileSync(file, `${JSON.stringify({ $description: BASELINE_DESCRIPTION, counts }, null, 2)}\n`);
    console.log(`Wrote ${file}.`);
  }
  for (const c of all) {
    console.log(`${c.scheme}: ${c.unlinked.length} of ${c.total} semantic values rest on no decision.`);
    const byScope = Map.groupBy(c.unlinked, (u) => u.scope ?? "no scope owns it");
    for (const [scope, list] of byScope) console.log(`  ${scope}: ${list.map((u) => u.token).join(", ")}`);
  }
}
