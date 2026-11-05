// The gap ledger's counts (OD-243). Prints the counts per scheme and kind; with --baseline, writes
// them to harness/gaps-baseline.json. The harness lets each count only go down: a fix that removes
// gaps lowers the baseline in the same change, so the drop is on record.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assetRoots, grammar, loadScheme, schemeIds } from "../cli/src/schemes.mjs";
import { gapLedger } from "../cli/src/gaps.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const roots = assetRoots();
const g = grammar(roots);
export const gapCounts = () =>
  Object.fromEntries(schemeIds(roots).map((id) => [id, gapLedger(loadScheme(id, roots), g, roots).counts]));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const counts = gapCounts();
  if (process.argv.includes("--baseline")) {
    const file = join(root, "harness", "gaps-baseline.json");
    writeFileSync(
      file,
      `${JSON.stringify({ $description: "The gap ledger's counts per scheme and kind (OD-243). Each may only go down: node scripts/gaps.mjs --baseline after a fix.", counts }, null, 2)}\n`,
    );
    console.log(`Wrote ${file}.`);
  }
  console.table(counts);
}
