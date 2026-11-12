// Quality gate, end to end (OD-298): open-ds compare checks out two commits of a throwaway repository in
// temporary worktrees, loads each with its own code in a child process, and writes the scorecard. No
// network: the repository is made here, from this checkout's cli/src and the fixture scheme.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { compareRefs, repoRoot } from "../src/quality/compare.mjs";
import { saveGrammar, saveStoredScheme } from "../src/schemes.mjs";
import { fixtureGrammar, fixtureScheme } from "./quality-fixture.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const git = (repo, ...args) => {
  const r = spawnSync("git", ["-C", repo, "-c", "user.name=test", "-c", "user.email=test@example.invalid", "-c", "commit.gpgsign=false", ...args], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
};
const roots = (repo) => ({ schemes: join(repo, "schemes") });
const writeScheme = (repo, scheme) => saveStoredScheme(scheme, roots(repo));

function makeRepo() {
  const repo = mkdtempSync(join(tmpdir(), "open-ds-compare-test-"));
  cpSync(join(here, "..", "src"), join(repo, "cli", "src"), { recursive: true });
  writeFileSync(join(repo, "cli", "package.json"), JSON.stringify({ type: "module" }));
  mkdirSync(join(repo, "schemes"));
  saveGrammar(fixtureGrammar(), roots(repo));
  writeScheme(repo, fixtureScheme());
  git(repo, "init", "-q");
  git(repo, "add", "-A");
  git(repo, "commit", "-q", "-m", "base");
  return repo;
}

test("compare measures a committed candidate against its parent and fails a broken formula", () => {
  const repo = makeRepo();
  try {
    const broken = fixtureScheme();
    broken.tokens.semantic["component-spacing-map"].x2.$value = "{space.12}";
    writeScheme(repo, broken);
    git(repo, "commit", "-q", "-am", "candidate");
    assert.equal(repoRoot(join(repo, "cli")), git(repo, "rev-parse", "--show-toplevel"));
    const out = join(repo, "out");
    const { card, files } = compareRefs({ repo, base: "HEAD~1", candidate: "HEAD", out, css: false });
    assert.equal(card.pass, false);
    assert.deepEqual(card.failed, ["invariants.failures", "invariants.spacing-map"]);
    assert.equal(card.criteria.find((r) => r.id === "invariants.spacing-map").candidate, 1);
    assert.equal(card.criteria.find((r) => r.id === "blast-radius.answer-orphans").base, 20);
    assert.ok(existsSync(files.md) && existsSync(files.json));
    assert.match(readFileSync(files.md, "utf8"), /\*\*Fail\.\*\*/);
    // both temporary worktrees are gone
    assert.equal(git(repo, "worktree", "list").split("\n").length, 1);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("the candidate defaults to the working tree, and --write-baseline records the base", () => {
  const repo = makeRepo();
  try {
    const better = fixtureScheme();
    better.tokens.semantic.size.control.compact.$extensions["open-ds"].why = "Compact control: one step below the 32px default control.";
    writeScheme(repo, better);
    const { card, files } = compareRefs({ repo, base: "HEAD", out: join(repo, "out"), css: false, blast: false, writeBaseline: true });
    assert.equal(card.pass, true);
    assert.equal(card.candidate.ref, "working tree");
    assert.equal(card.criteria.find((r) => r.id === "blast-radius.answer-orphans").candidate, null);
    const baseline = JSON.parse(readFileSync(files.baseline, "utf8"));
    assert.equal(baseline.ref, "HEAD");
    assert.equal(baseline.criteria["derived.share"].value, 0.65);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});

test("a ref that does not exist says how to fetch it", () => {
  const repo = makeRepo();
  try {
    assert.throws(() => compareRefs({ repo, base: "origin/no-such-branch", out: join(repo, "out"), css: false }), /git fetch origin no-such-branch/);
  } finally {
    rmSync(repo, { recursive: true, force: true });
  }
});
