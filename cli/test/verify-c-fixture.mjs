// Independent verifier fixture for the OD-298 quality gate. It never touches the real checkout:
// each case copies schemes, ui/src, cli and tokens into a temporary root, applies one seeded
// defect, and reads that root with the gate's public extractRef. Not a test file by itself.
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractRef } from "../src/quality/extract.mjs";

export const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** A temporary copy of the parts of the repo the gate reads. Returns its root. */
export function copyRepo() {
  const root = mkdtempSync(join(tmpdir(), "verify-c-"));
  for (const dir of ["schemes", "ui/src", "harness/quality-approvals.json"]) {
    if (existsSync(join(REPO, dir))) cpSync(join(REPO, dir), join(root, dir), { recursive: true });
  }
  mkdirSync(join(root, "cli"), { recursive: true });
  for (const p of ["src", "templates", "package.json"]) cpSync(join(REPO, "cli", p), join(root, "cli", p), { recursive: true });
  mkdirSync(join(root, "tokens"), { recursive: true });
  for (const p of ["build.mjs", "package.json"]) cpSync(join(REPO, "tokens", p), join(root, "tokens", p));
  symlinkSync(join(REPO, "tokens", "node_modules"), join(root, "tokens", "node_modules"), "dir");
  symlinkSync(join(REPO, "node_modules"), join(root, "node_modules"), "dir");
  if (existsSync(join(REPO, "cli", "node_modules"))) symlinkSync(join(REPO, "cli", "node_modules"), join(root, "cli", "node_modules"), "dir");
  return root;
}

export const readScheme = (root, id) => JSON.parse(readFileSync(join(root, "schemes", `${id}.json`), "utf8"));
export const writeScheme = (root, id, s) => writeFileSync(join(root, "schemes", `${id}.json`), `${JSON.stringify(s, null, 2)}\n`);

/** Set a $value at a dotted path under a scheme's tokens (path segments may contain '@'). */
export function setToken(scheme, path, value) {
  let node = scheme.tokens;
  const parts = path.split(".");
  for (const p of parts) {
    node[p] ??= {};
    node = node[p];
  }
  node.$value = value;
  return scheme;
}

export function editScheme(root, id, fn) {
  const s = readScheme(root, id);
  fn(s);
  writeScheme(root, id, s);
}

export function editFile(root, rel, fn) {
  const file = join(root, rel);
  writeFileSync(file, fn(existsSync(file) ? readFileSync(file, "utf8") : ""));
}

export function buildTokens(root) {
  const r = spawnSync(process.execPath, [join(root, "tokens", "build.mjs")], { cwd: root, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`token build failed: ${r.stderr}`);
}

export const snapshotOf = (root, { css = false, ids = ["dense-data"] } = {}) => extractRef({ root, blast: false, css, ids });

/** A seeded case: copy, mutate, snapshot, clean up. */
export async function seeded(mutate, opts = {}) {
  const root = copyRepo();
  try {
    await mutate(root);
    if (opts.css) buildTokens(root);
    return await snapshotOf(root, opts);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export const row = (card, id) => {
  const r = card.criteria.find((c) => c.id === id);
  if (!r) throw new Error(`no criterion ${id}; have ${card.criteria.map((c) => c.id).join(", ")}`);
  return r;
};
