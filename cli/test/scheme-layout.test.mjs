// The source folder split by scope: the loader reads both layouts, and they give the same objects.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { joinScheme, semanticOwner, splitGrammar, splitScheme } from "../src/scheme-layout.mjs";
import {
  assetRoots,
  formatGrammar,
  grammar,
  loadScheme,
  saveScheme,
  saveStoredScheme,
  schemeIds,
  schemeLayout,
  storedScheme,
} from "../src/schemes.mjs";

const roots = assetRoots();
const g = grammar(roots);
const ids = schemeIds(roots);
let work;
let fileRoots;

// The same sources in the single-file layout: one grammar file and one file per scheme.
before(() => {
  work = mkdtempSync(join(tmpdir(), "open-ds-layout-"));
  fileRoots = { ...roots, schemes: join(work, "schemes") };
  mkdirSync(fileRoots.schemes);
  writeFileSync(join(fileRoots.schemes, ["grammar", "json"].join(".")), formatGrammar(g));
  for (const id of ids) saveStoredScheme(storedScheme(id, roots), fileRoots);
});
after(() => rmSync(work, { recursive: true, force: true }));

test("the repository stores every scheme as a folder split by scope", () => {
  assert.equal(ids.length, 5);
  for (const id of ids) {
    assert.equal(schemeLayout(id, roots), "folder", id);
    for (const scope of g.scopes) assert.ok(existsSync(join(roots.schemes, id, "scopes", `${scope.id}.json`)), `${id} ${scope.id}`);
    assert.ok(existsSync(join(roots.schemes, id, "components.json")), id);
  }
  for (const scope of g.scopes) assert.ok(existsSync(join(roots.schemes, "grammar", "scopes", `${scope.id}.json`)), scope.id);
});

test("both layouts load to the same objects, key order and all", () => {
  assert.deepEqual(schemeIds(fileRoots), ids);
  assert.equal(JSON.stringify(grammar(fileRoots)), JSON.stringify(g));
  for (const id of ids) {
    assert.equal(schemeLayout(id, fileRoots), "file");
    assert.equal(JSON.stringify(storedScheme(id, fileRoots)), JSON.stringify(storedScheme(id, roots)), id);
    assert.deepEqual(loadScheme(id, fileRoots), loadScheme(id, roots), id);
  }
});

test("the shorthand of each semantic token lives with the scope that owns the token", () => {
  const stored = storedScheme("dense-data", roots);
  assert.ok(Object.keys(stored.shorthand.tokens).length > 100, "the shorthand comes back whole");
  const files = splitScheme(stored, g);
  const color = files["scopes/color.json"];
  assert.ok(Object.keys(color.shorthand).every((path) => semanticOwner(path, g) === "color"));
  assert.equal(color.shorthand["color.action.danger"].headline, stored.shorthand.tokens["color.action.danger"].headline);
  // A path no scope owns, such as the component spacing map, keeps its shorthand in scheme.json.
  assert.ok(Object.keys(files["scheme.json"].shorthand.tokens).every((path) => semanticOwner(path, g) === null));
  // A nested owner keeps its place: color.border.focus belongs to accessibility, inside the color tree.
  assert.equal(semanticOwner("color.border.focus", g), "accessibility");
  assert.match(color.tokens.semantic.color.border.focus.$ref, /^scopes\/accessibility\.json#\/tokens\/semantic\/color\/border\/focus$/);
});

test("a reference to a missing file fails with a plain message", () => {
  const files = splitScheme(storedScheme("dense-data", roots), g);
  delete files["scopes/color.json"];
  assert.throws(() => joinScheme(files, g), /names scopes\/color\.json, which the folder does not have/);
});

test("saveScheme writes the folder layout and replaces a single file", () => {
  const scheme = loadScheme("content-first", fileRoots);
  scheme.answers[0].why = "A changed reason.";
  saveScheme(scheme, fileRoots);
  assert.equal(schemeLayout("content-first", fileRoots), "folder");
  assert.equal(storedScheme("content-first", fileRoots).answers[0].why, "A changed reason.");
  const root = JSON.parse(readFileSync(join(fileRoots.schemes, "content-first", "scheme.json"), "utf8"));
  assert.equal(root.answers.length + g.scopes.reduce((n, s) => n + s.questions.length, 0), scheme.answers.length);
});

test("the grammar splits into a root, one file per scope and the component sections", () => {
  const files = splitGrammar(g);
  assert.deepEqual(files["grammar.json"].scopes[0], { $ref: `grammar/scopes/${g.scopes[0].id}.json` });
  assert.deepEqual(files["grammar.json"].catalogue, { $ref: "grammar/components.json#/catalogue" });
});
