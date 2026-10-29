import { execFile } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { promisify } from "node:util";
import { repoRoot, run } from "../src/main.mjs";
import { publishDownloads } from "../../scripts/publish-downloads.mjs";

const exec = promisify(execFile);
const root = repoRoot();
const bin = join(root, "cli/bin/open-ds.js");

function filesOf(dir) {
  const out = {};
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else out[full.slice(dir.length + 1)] = readFileSync(full);
    }
  };
  walk(dir);
  return out;
}

async function initTo(name, dir) {
  const recipe = join(root, "recipes", `${name}.json`);
  await exec(process.execPath, [bin, "init", recipe, "--out", dir], { cwd: root });
}

test("init and catalog are byte-stable, and downloads match a local init", async () => {
  const first = mkdtempSync(join(tmpdir(), "open-ds-contract-a-"));
  const second = mkdtempSync(join(tmpdir(), "open-ds-contract-b-"));
  const catalogA = join(first, "catalog.json");
  const catalogB = join(second, "catalog.json");
  const published = mkdtempSync(join(tmpdir(), "open-ds-downloads-"));
  try {
    await initTo("dense-data", first);
    await initTo("dense-data", second);
    const left = filesOf(first);
    const right = filesOf(second);
    assert.deepEqual(Object.keys(left).sort(), Object.keys(right).sort());
    for (const name of Object.keys(left)) assert.deepEqual(left[name], right[name], name);

    const agents = readFileSync(join(first, "AGENTS.md"), "utf8");
    assert.ok(agents.startsWith("Status: provisional\n"));
    const tokens = JSON.parse(readFileSync(join(first, "theme", "tokens.json"), "utf8"));
    const target = tokens.primitive.target.min;
    assert.equal(target.$value.value, 24);
    assert.equal(target.$value.unit, "px");
    assert.equal(target.$extensions.openDs.basis, "floor");
    assert.equal(target.$extensions.openDs.why.includes("24px"), true);
    assert.equal("why" in tokens.primitive.color.paper.$extensions.openDs, false);
    const links = JSON.parse(readFileSync(join(first, "links.json"), "utf8"));
    const touch = links.filter((row) => row.to === "target-size/material-48");
    assert.deepEqual(
      touch.map((row) => row.from).sort(),
      ["density/comfortable", "density/compact", "density/spacious"],
    );
    for (const row of touch) {
      assert.equal(row.type, "recommends");
      assert.equal(row.basis, "sourced");
      assert.equal(row.sources[0].checked, "2026-10-29");
      assert.equal(row.sources[0].quote, "No matter the density, all touch targets should be at least 48px in size.");
    }
    assert.equal(
      JSON.stringify(tokens).includes('"value":48') || JSON.stringify(tokens).includes('"value": 48'),
      false,
    );

    assert.equal(await run(["catalog", "--out", catalogA]), 0);
    assert.equal(await run(["catalog", "--out", catalogB]), 0);
    assert.deepEqual(readFileSync(catalogA), readFileSync(catalogB));

    publishDownloads(root, published);
    const fresh = mkdtempSync(join(tmpdir(), "open-ds-fresh-"));
    try {
      await initTo("accessible-first", fresh);
      for (const name of ["recipe.json", "links.json", "AGENTS.md"]) {
        assert.deepEqual(readFileSync(join(published, "accessible-first", name)), readFileSync(join(fresh, name)));
      }
      assert.deepEqual(
        readFileSync(join(published, "accessible-first", "tokens.json")),
        readFileSync(join(fresh, "theme", "tokens.json")),
      );
      const zipA = join(published, "accessible-first", "accessible-first.zip");
      const zipB = join(published, "dense-data", "dense-data.zip");
      assert.ok(statSync(zipA).size > 0);
      assert.notEqual(readFileSync(zipA).toString("hex"), readFileSync(zipB).toString("hex"));
    } finally {
      rmSync(fresh, { recursive: true, force: true });
    }
  } finally {
    rmSync(first, { recursive: true, force: true });
    rmSync(second, { recursive: true, force: true });
    rmSync(published, { recursive: true, force: true });
  }
});
