// The build step (OD-292): each scheme checked, written as loadScheme gives it, with a stable hash.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build, buildScheme } from "../src/build.mjs";
import { checkScheme } from "../src/scheme-checks.mjs";
import { assetRoots, loadScheme, saveScheme, schemeIds } from "../src/schemes.mjs";

const roots = assetRoots();

test("every scheme passes its rules, and its built file is the loaded scheme", () => {
  const out = mkdtempSync(join(tmpdir(), "open-ds-build-"));
  try {
    const r = build({ out, roots });
    assert.ok(r.ok, JSON.stringify(r.built.flatMap((b) => b.results.flatMap((x) => x.findings)).slice(0, 3)));
    for (const id of schemeIds(roots)) {
      assert.equal(readFileSync(join(out, `${id}.json`), "utf8"), `${JSON.stringify(loadScheme(id, roots), null, 2)}\n`, id);
    }
    const index = JSON.parse(readFileSync(join(out, "build.json"), "utf8"));
    assert.equal(index.schemes["dense-data"].sha256, buildScheme("dense-data", roots).hash);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});

test("a broken reference fails its rule and names the token", () => {
  const s = loadScheme("dense-data", roots);
  s.tokens.component.button.radius.$value = "{radius.nope}";
  const resolveRule = checkScheme(s).find((r) => r.rule === "tokens resolve");
  assert.ok(resolveRule.findings.some((f) => f.includes("button.radius") && f.includes("radius.nope")), resolveRule.findings[0]);
});

test("a failed rule writes nothing", () => {
  const tmp = mkdtempSync(join(tmpdir(), "open-ds-build-"));
  try {
    const broken = { ...roots, schemes: join(tmp, "schemes") };
    cpSync(roots.schemes, broken.schemes, { recursive: true });
    const s = loadScheme("dense-data", broken);
    s.tokens.component.button.radius.$value = "{radius.nope}";
    saveScheme(s, broken);
    const out = join(tmp, "out");
    const r = build({ out, roots: broken });
    assert.equal(r.ok, false);
    assert.equal(existsSync(out), false);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test("a type value set by hand next to its record fails the build (OD-301)", () => {
  const tmp = mkdtempSync(join(tmpdir(), "open-ds-build-"));
  try {
    const handSet = { ...roots, schemes: join(tmp, "schemes") };
    cpSync(roots.schemes, handSet.schemes, { recursive: true });
    const s = loadScheme("dense-data", handSet);
    s.tokens.semantic.type.body["font-size"].$value = "{font.size.12}";
    saveScheme(s, handSet);
    const b = buildScheme("dense-data", handSet);
    const rule = b.results.find((r) => r.rule === "type and spacing come from their records");
    assert.equal(b.ok, false);
    assert.deepEqual(rule.findings, [
      "dense-data: type.body.font-size is set by hand next to its record; remove its value, the loader generates it",
      "dense-data: type.body.font-size is {font.size.12}, and its record gives {font.size.14}",
    ]);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
