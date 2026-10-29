import { execFile } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { promisify } from "node:util";
import { checkRecipe } from "../../site/src/lib/check.mjs";
import { check, loadPacks, repoRoot } from "../src/main.mjs";

const exec = promisify(execFile);
const root = repoRoot();
const bin = join(root, "cli", "bin", "open-ds.js");
const stances = ["accessible-first", "dense-data", "multi-brand", "content-first", "brand-expressive"];
const expectedFail = {
  "accessible-first": "required-option",
  "dense-data": "required-option",
  "multi-brand": "required-option",
  "content-first": "conflict",
  "brand-expressive": "required-option",
};

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function prop(css, name) {
  const match = css.match(new RegExp(`${name}:\\s*([^;]+);`));
  assert.ok(match, name);
  return match[1].trim();
}

async function initOut(name, dir) {
  const recipe = join(root, "recipes", `${name}.json`);
  const result = await exec("node", [bin, "init", recipe, "--out", dir], { cwd: root });
  assert.equal(result.stderr ?? "", "");
  const checked = await exec("node", [bin, "check", "--dir", dir], { cwd: root });
  assert.equal(checked.stderr ?? "", "");
  return { init: result.stdout, check: checked.stdout };
}

test("each stance inits and checks", async () => {
  const packs = loadPacks(root);
  for (const name of stances) {
    const dir = mkdtempSync(join(tmpdir(), `open-ds-${name}-`));
    try {
      const output = await initOut(name, dir);
      assert.match(output.check, /^[0-9a-f]{64}\n$/);
      assert.equal((await check(dir, root)).ok, true);
      assert.ok(readFileSync(join(dir, "structure", "Button.tsx"), "utf8").length > 0);
      const recipe = readJson(join(root, "recipes", `${name}.json`));
      const result = await checkRecipe(recipe, packs);
      assert.equal(result.ok, true, JSON.stringify(result.findings));
      const fail = readJson(join(root, "fixtures", "recipes", `${name}-fail.json`));
      const failed = await checkRecipe(fail, packs);
      assert.equal(failed.ok, false);
      assert.ok(failed.findings.some((item) => item.id === expectedFail[name] && item.severity === "error"));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

test("accessible-first and dense-data differ in spacing, type, and density", async () => {
  const access = mkdtempSync(join(tmpdir(), "open-ds-access-"));
  const dense = mkdtempSync(join(tmpdir(), "open-ds-dense-"));
  try {
    await initOut("accessible-first", access);
    await initOut("dense-data", dense);
    const accessCss = readFileSync(join(access, "theme", "tokens.css"), "utf8");
    const denseCss = readFileSync(join(dense, "theme", "tokens.css"), "utf8");
    assert.notEqual(prop(accessCss, "--space-1"), prop(denseCss, "--space-1"));
    assert.equal(prop(accessCss, "--space-1"), "0.5rem");
    assert.equal(prop(denseCss, "--space-1"), "0.25rem");
    assert.notEqual(prop(accessCss, "--font-size-body"), prop(denseCss, "--font-size-body"));
    assert.equal(prop(accessCss, "--font-size-body"), "1.125rem");
    assert.equal(prop(denseCss, "--font-size-body"), "0.875rem");
    assert.equal(prop(accessCss, "--density"), "spacious");
    assert.equal(prop(denseCss, "--density"), "compact");
    assert.notEqual(prop(accessCss, "--type-scale-ratio"), prop(denseCss, "--type-scale-ratio"));
    const accessTokens = readJson(join(access, "theme", "tokens.json"));
    const denseTokens = readJson(join(dense, "theme", "tokens.json"));
    assert.notEqual(accessTokens.primitive.space["1"].$value.value, denseTokens.primitive.space["1"].$value.value);
  } finally {
    rmSync(access, { recursive: true, force: true });
    rmSync(dense, { recursive: true, force: true });
  }
});

test("changing a font-size pick changes the fingerprint and the token", async () => {
  const packs = loadPacks(root);
  const original = readJson(join(root, "recipes", "dense-data.json"));
  const changed = structuredClone(original);
  const pick = changed.picks.find((item) => item.question === "base-font-size");
  pick.option = "size-16";
  pick.rationale = "Try the 16 pixel body instead of 14.";
  const before = await checkRecipe(original, packs);
  const after = await checkRecipe(changed, packs);
  assert.equal(before.ok, true);
  assert.equal(after.ok, true);
  assert.notEqual(before.fingerprint, after.fingerprint);
  const dirA = mkdtempSync(join(tmpdir(), "open-ds-a-"));
  const file = join(dirA, "changed.json");
  try {
    await initOut("dense-data", dirA);
    writeFileSync(file, JSON.stringify(changed));
    const out = mkdtempSync(join(tmpdir(), "open-ds-changed-"));
    await exec("node", [bin, "init", file, "--out", out], { cwd: root });
    const originalCss = readFileSync(join(dirA, "theme", "tokens.css"), "utf8");
    const changedCss = readFileSync(join(out, "theme", "tokens.css"), "utf8");
    assert.equal(prop(originalCss, "--font-size-body"), "0.875rem");
    assert.equal(prop(changedCss, "--font-size-body"), "1rem");
    rmSync(out, { recursive: true, force: true });
  } finally {
    rmSync(dirA, { recursive: true, force: true });
  }
});

test("brand-expressive sets OKLCH, a bold accent, a larger radius, and dark by default", async () => {
  const dir = mkdtempSync(join(tmpdir(), "open-ds-brand-"));
  try {
    await initOut("brand-expressive", dir);
    const css = readFileSync(join(dir, "theme", "tokens.css"), "utf8");
    const readme = readFileSync(join(dir, "README.md"), "utf8");
    assert.match(css, /OKLCH lightness steps/);
    assert.match(css, /#ff6a2c/);
    assert.equal(prop(css, "--radius-control"), "0.75rem");
    assert.match(css, /:root,\n\[data-theme="dark"\]/);
    assert.match(css, /base default/);
    assert.match(css, /decision: default-theme/);
    const chain = readme.slice(readme.indexOf("## Chain from Purpose"), readme.indexOf("<!-- decisions:start -->"));
    assert.match(chain, /on-color pairing/);
    assert.match(chain, /dark-mode token set/);
    assert.doesNotMatch(chain, /radius/i);
    const tokens = readJson(join(dir, "theme", "tokens.json"));
    assert.equal(tokens.primitive.color["accent-bold"].$value.hex, "#ff6a2c");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
