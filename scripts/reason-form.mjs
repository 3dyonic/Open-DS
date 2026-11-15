// The reason form: the semantic values per scheme whose reason is not yet in the grammar's reason form
// ("We use … in order to … does this by … So …, because …"). Prints the count per scheme and the first
// values; with --baseline, writes each such value by name to harness/reason-form-baseline.json. The
// harness fails a value the list does not name, and a listed value whose reason is in the form now.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assetRoots, grammar, loadScheme, schemeIds } from "../cli/src/schemes.mjs";
import { formReasons, traceScheme } from "../cli/src/trace.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE_DESCRIPTION =
  "The semantic values whose reason is not yet in the grammar's reason form, one name each: the scheme and the token. The harness check reasons-say-why fails on a value this list does not name, and on a listed value whose reason is in the form now: take it out. Written by node scripts/reason-form.mjs --baseline.";

/** Each scheme's values whose reason is not in the form, in the grammar's scheme order. */
export function formOfSchemes(roots = assetRoots()) {
  const g = grammar(roots);
  return schemeIds(roots).map((id) => {
    const trace = traceScheme(loadScheme(id, roots), g);
    return { scheme: id, total: trace.total, off: formReasons(trace, g) };
  });
}

/** Every value out of the form, named "<scheme> <token>": [{ id, scheme, token, missing }]. */
export const namedOff = (schemes) =>
  schemes.flatMap((c) =>
    c.off.map((x) => ({ id: `${c.scheme} ${x.token}`, scheme: c.scheme, token: x.token, missing: x.missing })),
  );

/** The baseline file of a list of named values: { description, failures: [id] }, sorted. */
export const formBaseline = (off) => ({
  description: BASELINE_DESCRIPTION,
  failures: [...new Set(off.map((x) => x.id))].sort(),
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const all = formOfSchemes();
  if (process.argv.includes("--baseline")) {
    const file = join(root, "harness", "reason-form-baseline.json");
    writeFileSync(file, `${JSON.stringify(formBaseline(namedOff(all)), null, 2)}\n`);
    console.log(`Wrote ${file}.`);
  }
  for (const c of all) {
    console.log(`${c.scheme}: ${c.off.length} of ${c.total} reasons are not in the form yet.`);
    for (const x of c.off.slice(0, 5)) console.log(`  ${x.token}: misses ${x.missing.join(", ")}`);
  }
}
