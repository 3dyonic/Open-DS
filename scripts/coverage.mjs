// Decision coverage (OD-273): how many semantic values in each scheme rest on no decision. Prints the
// count per scheme and each unlinked token by the scope that owns it. The harness fails any value
// that rests on no decision.
import { fileURLToPath } from "node:url";
import { assetRoots, grammar, loadScheme, schemeIds } from "../cli/src/schemes.mjs";
import { decisionCoverage } from "../cli/src/coverage.mjs";

/** The coverage of every scheme, in the grammar's scheme order. */
export function coverageOfSchemes(roots = assetRoots()) {
  const g = grammar(roots);
  return schemeIds(roots).map((id) => decisionCoverage(loadScheme(id, roots), g));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const all = coverageOfSchemes();
  for (const c of all) {
    console.log(`${c.scheme}: ${c.unlinked.length} of ${c.total} semantic values rest on no decision.`);
    const byScope = Map.groupBy(c.unlinked, (u) => u.scope ?? "no scope owns it");
    for (const [scope, list] of byScope) console.log(`  ${scope}: ${list.map((u) => u.token).join(", ")}`);
  }
}
