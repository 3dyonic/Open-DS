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
  // The known case, as it was before radius.option (OD-246): Content first's menu item on the pill.
  const pill = structuredClone(loadScheme("content-first", roots));
  pill.id = "content-first-pill";
  pill.tokens.component["dropdown-menu"].item.radius.$value = "{radius.badge}";
  const cf = componentGaps(pill, g, roots).filter((x) => x.kind === "nested-corner");
  assert.ok(cf.some((x) => x.component === "dropdown-menu" && x.part === "item"), "Content first's pill menu item");
  for (const id of ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"])
    assert.equal(gaps(id).filter((x) => x.kind === "nested-corner").length, 0, `${id}: options nest in their panels`);
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
