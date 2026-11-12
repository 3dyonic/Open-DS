// The reason form (OD-294): how many semantic values per scheme have a reason that is not yet in the
// grammar's reason form ("We use … in order to … does this by … So …, because …"). Prints the count
// per scheme and the first values; with --baseline, writes the counts to
// harness/reason-form-baseline.json. The harness lets each count only go down.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assetRoots, grammar, loadScheme, schemeIds } from "../cli/src/schemes.mjs";
import { formReasons, traceScheme } from "../cli/src/trace.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE_DESCRIPTION =
  "Semantic values per scheme whose reason is not yet in the reason form (OD-294). Each may only go down: node scripts/reason-form.mjs --baseline after a round converts more reasons.";

/** Each scheme's values whose reason is not in the form, in the grammar's scheme order. */
export function formOfSchemes(roots = assetRoots()) {
  const g = grammar(roots);
  return schemeIds(roots).map((id) => {
    const trace = traceScheme(loadScheme(id, roots), g);
    return { scheme: id, total: trace.total, off: formReasons(trace, g) };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const all = formOfSchemes();
  if (process.argv.includes("--baseline")) {
    const file = join(root, "harness", "reason-form-baseline.json");
    const counts = Object.fromEntries(all.map((c) => [c.scheme, c.off.length]));
    writeFileSync(file, `${JSON.stringify({ $description: BASELINE_DESCRIPTION, counts }, null, 2)}\n`);
    console.log(`Wrote ${file}.`);
  }
  for (const c of all) {
    console.log(`${c.scheme}: ${c.off.length} of ${c.total} reasons are not in the form yet.`);
    for (const x of c.off.slice(0, 5)) console.log(`  ${x.token}: misses ${x.missing.join(", ")}`);
  }
}
