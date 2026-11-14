// Independent verifier harness for the OD-298 quality gate. Each defect runs on a temporary copy of
// the schemes folder; the real scheme files are never written.
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractRef } from "../src/quality/extract.mjs";
import { storedScheme } from "../src/schemes.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SCHEME = "dense-data";

/** A temporary checkout: every top-level entry linked, except a private copy of schemes/. */
export function temporaryRoot(mutate = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "verify-a-"));
  for (const entry of readdirSync(REPO)) {
    if (entry === "schemes" || entry === ".git") continue;
    symlinkSync(join(REPO, entry), join(root, entry));
  }
  cpSync(join(REPO, "schemes"), join(root, "schemes"), { recursive: true });
  // The edited scheme goes in a single file, which the loader reads in place of the scheme's folder.
  const file = join(root, "schemes", `${SCHEME}.json`);
  const scheme = storedScheme(SCHEME, { schemes: join(root, "schemes") });
  mutate(scheme);
  writeFileSync(file, `${JSON.stringify(scheme, null, 2)}\n`);
  return root;
}

export async function snapshotOf(mutate) {
  const root = temporaryRoot(mutate);
  try {
    return await extractRef({ root, css: false, blast: true, ids: [SCHEME] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

let base = null;
export const baseSnapshot = async () => (base ??= await snapshotOf());

/** The scorecard of one mutation against the untouched copy. */
export async function cardOf(mutate) {
  return compareSnapshots(await baseSnapshot(), await snapshotOf(mutate));
}

export const row = (card, id) => {
  const r = card.criteria.find((x) => x.id === id);
  if (!r) throw new Error(`no criterion ${id}; have ${card.criteria.map((x) => x.id).join(", ")}`);
  return r;
};

/** The node at a dotted path; "@" and numeric keys work as plain segments. */
export function at(obj, path) {
  return path.split("/").reduce((o, k) => {
    if (!(k in o)) throw new Error(`missing ${k} in ${path}`);
    return o[k];
  }, obj);
}

export const semantic = (scheme, dotted) => at(scheme.tokens.semantic, dotted.split(".").join("/"));
export const themePick = (scheme, theme, dotted) => at(scheme.tokens.brands.default.theme[theme], dotted.split(".").join("/"));
export const setWhy = (node, why, because) => {
  node.$extensions ??= {};
  node.$extensions["open-ds"] ??= {};
  node.$extensions["open-ds"].why = why;
  if (because) node.$extensions["open-ds"].because = because;
};
