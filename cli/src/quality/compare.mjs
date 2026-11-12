// open-ds compare (OD-298): measure a candidate against a base ref. Each ref is checked out in a
// temporary git worktree, its tokens are built with its own build, and its snapshot is extracted in a
// child process that loads the schemes with that ref's own code. The comparison itself is pure
// (scorecard.mjs). The worktrees are removed afterwards, whatever happens.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { baselineOf, compareSnapshots, scorecardMarkdown } from "./scorecard.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const EXTRACT = join(here, "extract.mjs");
/** Where the baseline lives, from the repository root. */
export const BASELINE = join("harness", "quality-baseline.json");

function git(repo, args) {
  const r = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8" });
  return { code: r.status ?? 1, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim() };
}

/** The repository root that holds a path, or an error that says what to do. */
export function repoRoot(from) {
  const r = git(from, ["rev-parse", "--show-toplevel"]);
  if (r.code !== 0 || !existsSync(join(r.out, "schemes", "grammar.json")))
    throw new Error("open-ds compare runs inside a git checkout of Open DS (it needs schemes/grammar.json and git).");
  return r.out;
}

/** The commit a ref names, or an error with the fetch to run. */
export function commitOf(repo, ref) {
  const r = git(repo, ["rev-parse", "--verify", "--quiet", `${ref}^{commit}`]);
  if (r.code !== 0 || !r.out) throw new Error(`No commit for "${ref}". Fetch it first: git fetch origin ${ref.replace(/^origin\//, "")}.`);
  return r.out;
}

// The checkout's dependencies, linked from the repository, so a worktree builds without an install.
function linkDependencies(repo, root) {
  for (const dir of ["", "tokens"]) {
    const from = join(repo, dir, "node_modules");
    const to = join(root, dir, "node_modules");
    if (existsSync(from) && !existsSync(to) && existsSync(join(root, dir))) symlinkSync(realpathSync(from), to, "dir");
  }
}

// The ref's own token build, for its CSS. A build that fails leaves the CSS "not present".
function buildTokens(root, log) {
  if (!existsSync(join(root, "tokens", "build.mjs"))) return false;
  const r = spawnSync(process.execPath, [join(root, "tokens", "build.mjs")], { cwd: root, encoding: "utf8", timeout: 300_000 });
  if (r.status !== 0) log(`  the token build failed, so its CSS is not measured: ${(r.stderr || r.stdout || "").trim().split("\n").slice(-2).join(" ")}`);
  return r.status === 0;
}

function extractIn(root, { ref, sha, file, blast }) {
  const args = [EXTRACT, "--root", root, "--out", file, "--ref", ref, ...(sha ? ["--sha", sha] : []), ...(blast ? [] : ["--no-blast"])];
  const r = spawnSync(process.execPath, args, { cwd: root, encoding: "utf8", timeout: 900_000, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`Could not read ${ref}: ${(r.stderr || r.stdout || "").trim().split("\n").slice(-4).join(" ")}`);
  return JSON.parse(readFileSync(file, "utf8"));
}

/**
 * The snapshot of one side: a ref in a temporary worktree, or the working tree when ref is null.
 * { snapshot }; the worktree is gone when this returns.
 */
export function snapshotSide({ repo, ref, scratch, css = true, blast = true, log = () => {} }) {
  const label = ref ?? "working tree";
  const sha = ref ? commitOf(repo, ref) : git(repo, ["rev-parse", "HEAD"]).out;
  const file = join(scratch, `${label.replace(/[^a-z0-9.-]+/gi, "_")}.snapshot.json`);
  if (!ref) {
    log(`Reading the working tree (${sha.slice(0, 10)}).`);
    if (css) buildTokens(repo, log);
    return { snapshot: extractIn(repo, { ref: label, sha, file, blast }), file };
  }
  const root = mkdtempSync(join(tmpdir(), "open-ds-compare-"));
  rmSync(root, { recursive: true, force: true });
  const add = git(repo, ["worktree", "add", "--detach", root, sha]);
  if (add.code !== 0) throw new Error(`Could not check out ${ref}: ${add.err}`);
  try {
    log(`Reading ${ref} (${sha.slice(0, 10)}) in a temporary worktree.`);
    linkDependencies(repo, root);
    if (css) buildTokens(root, log);
    return { snapshot: extractIn(root, { ref: label, sha, file, blast }), file };
  } finally {
    git(repo, ["worktree", "remove", "--force", root]);
    rmSync(root, { recursive: true, force: true });
    git(repo, ["worktree", "prune"]);
  }
}

/**
 * Compare a candidate (a ref, or the working tree) with a base ref. Writes scorecard.json,
 * scorecard.md and both snapshots into out; with writeBaseline, writes the base's numbers to
 * harness/quality-baseline.json. Returns { card, files }.
 */
export function compareRefs({ repo, base, candidate = null, out, writeBaseline = false, css = true, blast = true, log = () => {} }) {
  if (!base) throw new Error("compare needs a base: open-ds compare --base origin/master.");
  const outDir = resolve(out);
  mkdirSync(join(outDir, "snapshots"), { recursive: true });
  const scratch = join(outDir, "snapshots");
  const b = snapshotSide({ repo, ref: base, scratch, css, blast, log });
  const c = snapshotSide({ repo, ref: candidate, scratch, css, blast, log });
  const card = compareSnapshots(b.snapshot, c.snapshot);
  const files = { json: join(outDir, "scorecard.json"), md: join(outDir, "scorecard.md"), snapshots: [b.file, c.file] };
  writeFileSync(files.json, `${JSON.stringify(card, null, 2)}\n`);
  writeFileSync(files.md, scorecardMarkdown(card));
  if (writeBaseline) {
    files.baseline = join(repo, BASELINE);
    mkdirSync(dirname(files.baseline), { recursive: true });
    writeFileSync(files.baseline, `${JSON.stringify(baselineOf(b.snapshot), null, 2)}\n`);
  }
  return { card, files };
}
