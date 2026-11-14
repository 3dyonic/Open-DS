// The build step (ADR-002 step 3): load each scheme, run every scheme rule, and write one
// file per scheme with its sha256 hash. A failed rule writes nothing. The built file is the scheme as
// loadScheme gives it, byte for byte: the stored decisions plus the component defaults, the color
// scales and the spacing map they generate. build.json beside it holds the hashes and the versions.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { checkScheme } from "./scheme-checks.mjs";
import { assetRoots, grammar, loadScheme, schemeIds, schemeSchema, storedScheme } from "./schemes.mjs";

/** The compiled scheme schema: a function that takes a scheme and sets .errors when it fails. */
export function schemeValidator(roots = assetRoots()) {
  return new Ajv2020({ allErrors: true, strict: false }).compile(schemeSchema(roots));
}

/** The built text of a scheme and its hash. */
export function builtText(scheme) {
  const text = `${JSON.stringify(scheme, null, 2)}\n`;
  return { text, hash: createHash("sha256").update(text).digest("hex") };
}

/** One scheme, loaded and checked: { id, scheme, text, hash, results, ok }. */
export function buildScheme(id, { roots = assetRoots(), g = grammar(roots), validate = schemeValidator(roots) } = {}) {
  const scheme = loadScheme(id, roots);
  const results = checkScheme(scheme, { grammar: g, validate, stored: storedScheme(id, roots) });
  const { text, hash } = builtText(scheme);
  return { id, scheme, text, hash, results, ok: results.every((r) => !r.findings.length) };
}

/**
 * Build the given schemes (all by default) into out. Every scheme is checked first; when any rule
 * fails, nothing is written. Returns { ok, out, built: [{ id, hash, results }] }.
 */
export function build({ ids, out, roots = assetRoots() } = {}) {
  const g = grammar(roots);
  const validate = schemeValidator(roots);
  const list = (ids?.length ? ids : schemeIds(roots)).map((id) => buildScheme(id, { roots, g, validate }));
  const ok = list.every((b) => b.ok);
  if (ok) {
    mkdirSync(out, { recursive: true });
    for (const b of list) writeFileSync(join(out, `${b.id}.json`), b.text);
    const index = {
      $comment: "Written by open-ds build. Each built scheme, its sha256 hash and the versions it was built from.",
      grammar: g.version,
      schemes: Object.fromEntries(list.map((b) => [b.id, { version: b.scheme.version, sha256: b.hash }])),
    };
    writeFileSync(join(out, "build.json"), `${JSON.stringify(index, null, 2)}\n`);
  }
  return { ok, out, built: list.map(({ id, hash, results }) => ({ id, hash, results })) };
}
