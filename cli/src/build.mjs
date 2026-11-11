// The build step (OD-292, ADR-002 step 3): load each scheme, run every scheme rule, and write one
// file per scheme with its sha256 hash. A failed rule writes nothing. The built file is the scheme as
// loadScheme gives it, byte for byte; build.json beside it holds the hashes and the versions.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkScheme } from "./scheme-checks.mjs";
import { assetRoots, grammar, loadScheme, schemeIds } from "./schemes.mjs";

/** The built text of a scheme and its hash. */
export function builtText(scheme) {
  const text = `${JSON.stringify(scheme, null, 2)}\n`;
  return { text, hash: createHash("sha256").update(text).digest("hex") };
}

/** One scheme, loaded and checked: { id, scheme, text, hash, results, ok }. */
export function buildScheme(id, roots = assetRoots()) {
  const scheme = loadScheme(id, roots);
  const results = checkScheme(scheme);
  const { text, hash } = builtText(scheme);
  return { id, scheme, text, hash, results, ok: results.every((r) => !r.findings.length) };
}

/**
 * Build the given schemes (all by default) into out. Every scheme is checked first; when any rule
 * fails, nothing is written. Returns { ok, out, built: [{ id, hash, results }] }.
 */
export function build({ ids, out, roots = assetRoots() } = {}) {
  const list = (ids?.length ? ids : schemeIds(roots)).map((id) => buildScheme(id, roots));
  const ok = list.every((b) => b.ok);
  if (ok) {
    mkdirSync(out, { recursive: true });
    for (const b of list) writeFileSync(join(out, `${b.id}.json`), b.text);
    const g = grammar(roots);
    const index = {
      $comment: "Written by open-ds build. Each built scheme, its sha256 hash and the versions it was built from.",
      grammar: g.version,
      schemes: Object.fromEntries(list.map((b) => [b.id, { version: b.scheme.version, sha256: b.hash }])),
    };
    writeFileSync(join(out, "build.json"), `${JSON.stringify(index, null, 2)}\n`);
  }
  return { ok, out, built: list.map(({ id, hash, results }) => ({ id, hash, results })) };
}
