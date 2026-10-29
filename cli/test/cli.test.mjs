import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { check, init, repoRoot, run } from "../src/main.mjs";

const root = repoRoot();
const recipePath = join(root, "recipes", "3dyonic.json");
const manifest = JSON.parse(readFileSync(join(root, "boilerplates", "3dyonic", "manifest.json"), "utf8"));

test("package is private", () => {
  const pkg = JSON.parse(readFileSync(join(root, "cli", "package.json"), "utf8"));
  assert.equal(pkg.private, true);
  assert.equal(pkg.name, "open-ds");
});

test("init and check work against the authored boilerplate", async () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-"));
  try {
    const installed = await init(recipePath, dir, root);
    assert.equal(installed.fingerprint, manifest.fingerprint);
    assert.ok(installed.items.includes("tokens"));
    assert.ok(installed.items.includes("css"));
    assert.ok(installed.items.includes("components"));
    const file = JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8"));
    assert.deepEqual(file.locked, manifest.lockedAtInit);
    const result = await check(dir, root);
    assert.equal(result.ok, true);
    assert.equal(result.fingerprint, manifest.fingerprint);
    const byFingerprint = await init(manifest.fingerprint, join(dir, "again"), root);
    assert.equal(byFingerprint.fingerprint, manifest.fingerprint);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("check rejects a recipe with no rationale and prints no fingerprint", async () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-"));
  try {
    await init(recipePath, dir, root);
    const installed = JSON.parse(readFileSync(join(dir, "open-ds.json"), "utf8"));
    installed.recipe.picks[0].rationale = "";
    const { writeFileSync } = await import("node:fs");
    writeFileSync(join(dir, "open-ds.json"), JSON.stringify(installed));
    const result = await check(dir, root);
    assert.equal(result.ok, false);
    assert.equal(result.fingerprint, undefined);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("add and diff are stubs", async () => {
  const logs = [];
  const original = console.log;
  console.log = (line) => logs.push(String(line));
  try {
    assert.equal(await run(["add", "button"]), 0);
    assert.match(logs.join("\n"), /add is not ready/);
    logs.length = 0;
    assert.equal(await run(["diff"]), 0);
    assert.match(logs.join("\n"), /diff is not ready/);
  } finally {
    console.log = original;
  }
});
