// verify-b: end-to-end run of `open-ds compare` on a throwaway git repo (OD-298).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { storedScheme } from "../src/schemes.mjs";
import { join } from "node:path";
import { sandbox, drop, REPO } from "./verify-b-helpers.mjs";
import { cpSync, symlinkSync } from "node:fs";

let root;
before(() => {
  root = sandbox();
  for (const f of ["package.json", "harness/quality-baseline.json", "cli/bin"]) cpSync(join(REPO, f), join(root, f), { recursive: true });
  // The CLI's build reads its schema checker (ajv) from cli/node_modules; the sandbox copies no packages.
  symlinkSync(join(REPO, "cli", "node_modules"), join(root, "cli", "node_modules"), "dir");
  const git = (...a) => execFileSync("git", a, { cwd: root, stdio: "pipe" });
  git("init", "-q");
  git("add", "-A");
  git("-c", "user.email=verify@example.invalid", "-c", "user.name=verify", "commit", "-qm", "base");
});
after(() => drop(root));

function run(edit) {
  // The edited scheme goes in a single file, which the loader reads in place of the scheme's folder.
  const file = join(root, "schemes", "dense-data.json");
  const scheme = storedScheme("dense-data", { schemes: join(root, "schemes") });
  edit(scheme);
  writeFileSync(file, JSON.stringify(scheme, null, 2));
  try {
    const out = join(root, "build", "quality");
    const res = spawnSync("node", [join(root, "cli", "bin", "open-ds.js"), "compare", "--base", "HEAD", "--out", out], { cwd: root, encoding: "utf8", timeout: 300000 });
    const card = existsSync(join(out, "scorecard.json")) ? JSON.parse(readFileSync(join(out, "scorecard.json"), "utf8")) : null;
    return { status: res.status, stdout: res.stdout + res.stderr, card };
  } finally {
    rmSync(file, { force: true });
  }
}

test("CLI exits 1 on a focus ring defect in the working tree", { timeout: 300000 }, () => {
  const { status, stdout, card } = run((s) => { s.tokens.semantic.focus.ring.width.$value = "{border-width.1}"; });
  assert.equal(status, 1, stdout.slice(-2000));
  assert.ok(card.failed.includes("invariants.focus-ring"), JSON.stringify(card.failed));
});
test("CLI exits 0 on a clean duration change", { timeout: 300000 }, () => {
  const { status, stdout } = run((s) => { s.tokens.primitive.duration.fast.$value = "140ms"; });
  assert.equal(status, 0, stdout.slice(-2000));
});
