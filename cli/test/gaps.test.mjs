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

test("nested-corner: a trigger in a bar nests like an option in a menu", () => {
  // The menubar before OD-246: a pill trigger in Content first's rounded bar.
  const pill = structuredClone(loadScheme("content-first", roots));
  pill.id = "content-first-pill-trigger";
  pill.tokens.component.menubar.trigger.radius.$value = "{radius.badge}";
  assert.ok(componentGaps(pill, g, roots).some((x) => x.kind === "nested-corner" && x.component === "menubar" && x.part === "trigger"));
});

test("fades-a-color: an opacity modifier on a key or a named color", () => {
  // A color faded by hand. The known case: the calendar's focus ring at 50%.
  assert.ok(gaps("dense-data").some((x) => x.kind === "fades-a-color" && x.component === "calendar"));
  // Fixed in OD-243: the menus' destructive highlight reads the danger tint, unfaded.
  for (const c of ["context-menu", "menubar", "combobox"])
    assert.ok(!gaps("dense-data").some((x) => x.kind === "fades-a-color" && x.component === c), c);
});

test("a class that reaches into a child paints the child, and has-[…] does not", async () => {
  const { usages } = await import("../src/gaps.mjs");
  const src = `<div data-slot="combobox-content" className="*:data-[slot=input-group]:h-[var(--x)] has-data-[slot=combobox-chip]:px-[var(--y)]" />`;
  assert.equal(usages(src, "combobox", "--x")[0].part, "input-group");
  assert.equal(usages(src, "combobox", "--y")[0].part, "content");
});
