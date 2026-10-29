import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { checkRecipe } from "./check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const fixtureDir = join(root, "fixtures", "recipes");

function fragmentExists(fragment) {
  if (typeof fragment !== "string" || !fragment || isAbsolute(fragment)) return false;
  if (fragment.split(/[\\/]/).includes("..")) return false;
  const full = resolve(root, fragment);
  const rel = relative(root, full);
  if (!rel || rel.startsWith("..") || isAbsolute(rel)) return false;
  return existsSync(full) && statSync(full).isFile();
}

function readFragment(fragment) {
  if (!fragmentExists(fragment)) return null;
  try {
    const data = JSON.parse(readFileSync(join(root, fragment), "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    return data;
  } catch {
    return null;
  }
}

function ids(result, severity) {
  return [
    ...new Set(result.findings.filter((item) => item.severity === severity).map((item) => item.id)),
  ].sort();
}

function prefills(result) {
  return [...(result.prefills || [])].map((item) => `${item.question}:${item.option}`).sort();
}

const names = readdirSync(fixtureDir)
  .filter((name) => name.endsWith(".json"))
  .sort();

for (const name of names) {
  test(name, async () => {
    const fixture = JSON.parse(readFileSync(join(fixtureDir, name), "utf8"));
    const result = await checkRecipe(fixture.recipe, fixture.packs, {
      fragmentExists,
      readFragment,
    });
    assert.deepEqual(
      ids(result, "error"),
      [...fixture.expected_errors].sort(),
      JSON.stringify(result.findings, null, 2),
    );
    if (fixture.expected_warnings) {
      assert.deepEqual(
        ids(result, "warning"),
        [...fixture.expected_warnings].sort(),
        JSON.stringify(result.findings, null, 2),
      );
    }
    if (fixture.expected_prefills) {
      assert.deepEqual(
        prefills(result),
        [...fixture.expected_prefills].sort(),
        JSON.stringify(result.prefills),
      );
    }
    for (const id of fixture.absent || []) {
      assert.equal(
        result.findings.some((item) => item.id === id),
        false,
        JSON.stringify(result.findings, null, 2),
      );
    }
  });
}
