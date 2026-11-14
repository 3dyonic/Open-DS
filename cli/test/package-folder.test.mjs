// The package folder: open-ds export writes it, and open-ds create --from reads it after a hash check.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { createFromFolder } from "../src/create.mjs";
import { emptyOverlay } from "../src/overlay.mjs";
import { exportPackage, MANIFEST, readPackageFolder } from "../src/package-folder.mjs";
import { buildProject, json, PROJECT_FILES, projectScheme, readLock } from "../src/project.mjs";
import { loadScheme } from "../src/schemes.mjs";

const source = loadScheme("dense-data");
const pick = { brand: "default", mode: "base", token: "theme.radius.control", value: "{radius.4}", because: ["shape.values"], why: "Rounder controls." };
let work;
let folder;

// A project with one edit, exported as a package folder.
before(() => {
  work = mkdtempSync(join(tmpdir(), "open-ds-package-"));
  const project = join(work, "project");
  mkdirSync(project);
  writeFileSync(join(project, PROJECT_FILES.overlay), json({ ...emptyOverlay(source), picks: [pick] }));
  assert.ok(buildProject(project, { raised: [], newSource: true }).ok);
  folder = join(work, "folder");
  exportPackage({ dir: project, out: folder });
});
after(() => rmSync(work, { recursive: true, force: true }));

test("export writes the manifest, the overlay, the lockfile and the built file", () => {
  for (const f of [MANIFEST, PROJECT_FILES.overlay, PROJECT_FILES.lock, PROJECT_FILES.built]) assert.ok(existsSync(join(folder, f)), f);
  const pkg = readPackageFolder(folder);
  assert.deepEqual(pkg.manifest.source, { scheme: "dense-data", version: source.version });
  assert.equal(pkg.built.tokens.brands.default.theme.base.radius.control.$value, "{radius.4}");
});

test("export of a scheme as it ships has an empty overlay", () => {
  const out = join(work, "plain");
  exportPackage({ schemeId: "content-first", out });
  const pkg = readPackageFolder(out);
  assert.deepEqual(pkg.overlay.picks, []);
  assert.deepEqual(pkg.built, loadScheme("content-first"));
});

test("create --from builds the project from the folder's overlay", () => {
  const dir = join(work, "ds");
  const record = createFromFolder(folder, dir);
  assert.equal(record.scheme, "dense-data");
  assert.deepEqual(JSON.parse(readFileSync(join(dir, PROJECT_FILES.overlay), "utf8")).picks, [pick]);
  assert.equal(projectScheme(dir).tokens.brands.default.theme.base.radius.control.$value, "{radius.4}");
  assert.equal(readLock(dir).built.sha256, readLock(folder).built.sha256, "the project builds the same scheme as the folder");
  const theme = JSON.parse(readFileSync(join(dir, "tokens/src/theme/default.tokens.json"), "utf8"));
  assert.equal(Object.values(theme)[0].theme.base.radius.control.$value, "{radius.4}", "the token source carries the edit");
});

test("a changed file in the folder fails the hash check and writes nothing", () => {
  const changed = join(work, "changed");
  exportPackage({ schemeId: "dense-data", out: changed });
  const overlay = JSON.parse(readFileSync(join(changed, PROJECT_FILES.overlay), "utf8"));
  writeFileSync(join(changed, PROJECT_FILES.overlay), json({ ...overlay, picks: [pick] }));
  const dir = join(work, "never");
  assert.throws(() => createFromFolder(changed, dir), /overlay\.json in .* does not match open-ds\.lock/);
  assert.ok(!existsSync(dir), "nothing is written");
  writeFileSync(join(changed, MANIFEST), json({ ...readPackageFolder(folder).manifest, format: 99 }));
  assert.throws(() => readPackageFolder(changed), /package format 99/);
});
