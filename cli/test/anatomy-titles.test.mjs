// Anatomy card titles follow the scheme's answers (OD-267).
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { anatomyReference } from "../src/anatomy.mjs";

const roots = assetRoots();
const g = grammar(roots);
const titles = (id) => anatomyReference(loadScheme(id, roots), g, roots, "toast").cards.map((c) => c.title);

test("a scheme with no shadows names the toast's surface card by its edge", () => {
  assert.equal(titles("accessible-first")[0], "Surface and edge");
});

test("a scheme with shadows keeps the shadow in the title", () => {
  assert.equal(titles("dense-data")[0], "Surface and shadow");
});
