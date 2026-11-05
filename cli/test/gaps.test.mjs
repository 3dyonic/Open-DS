// The gap ledger finds, by itself, every kind of gap we found by eye (OD-243): each test pins a known
// case, so a detector that goes blind fails here instead of reporting zero.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { componentGaps, drawsOwnEmpty } from "../src/gaps.mjs";

const roots = assetRoots();
const g = grammar(roots);
const gaps = (id) => componentGaps(loadScheme(id, roots), g, roots);

test("nested-corner: a pill option inside a rounded menu, and not where corners are concentric", () => {
  const cf = gaps("content-first").filter((x) => x.kind === "nested-corner");
  assert.ok(cf.some((x) => x.component === "dropdown-menu" && x.part === "item"), "Content first's pill menu item");
  const dd = gaps("dense-data").filter((x) => x.kind === "nested-corner" && x.component === "dropdown-menu");
  assert.equal(dd.length, 0, "Dense data: a 4px menu, 4px padding, square items");
});

test("borrows-a-key: a component that reads another component's own key", () => {
  assert.ok(gaps("dense-data").some((x) => x.kind === "borrows-a-key" && x.component === "checkbox" && x.key === "component.button.focus-ring"));
});

test("reads-the-system: a bare utility that reads a system variable", () => {
  assert.ok(gaps("dense-data").some((x) => x.kind === "reads-the-system" && x.component === "alert" && x.key === "--border"));
});

test("skips-a-component: an empty state drawn by hand, not the Empty component", () => {
  const own = `const LABELS = { noResults: "No results." };\n<TableCell>{l.noResults}</TableCell>`;
  assert.equal(drawsOwnEmpty(own, "data-table"), true);
  assert.equal(drawsOwnEmpty(`import { Empty } from "./empty";\n${own}`, "data-table"), false);
  assert.equal(drawsOwnEmpty(own, "empty"), false);
});
