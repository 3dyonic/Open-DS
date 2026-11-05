// The gap ledger finds, by itself, every kind of gap we found by eye (OD-243): each test pins a known
// case, so a detector that goes blind fails here instead of reporting zero.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { componentGaps, drawsOwnEmpty } from "../src/gaps.mjs";

const roots = assetRoots();
const g = grammar(roots);
const gaps = (id) => componentGaps(loadScheme(id, roots), g, roots);
// A copy of the components with one file changed, to pin a case the components no longer have.
async function fixture(file, change) {
  const { cpSync, mkdtempSync, readFileSync, writeFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const ui = join(mkdtempSync(join(tmpdir(), "od-gaps-")), "src");
  cpSync(roots.ui, ui, { recursive: true });
  const f = join(ui, "components", file);
  const before = readFileSync(f, "utf8");
  const after = change(before);
  assert.notEqual(after, before, `the fixture changes ${file}`);
  writeFileSync(f, after);
  return { ui };
}
// A scheme under its own id, so the gap cache does not answer for the real one.
const fakeScheme = (tag) => {
  const s = structuredClone(loadScheme("dense-data", roots));
  s.id = `dense-data-${tag}`;
  return s;
};

test("nested-corner: a pill option inside a rounded menu, and not where corners are concentric", () => {
  // The known case, as it was before radius.option (OD-246): Content first's menu item on the pill.
  const pill = structuredClone(loadScheme("content-first", roots));
  pill.id = "content-first-pill";
  pill.tokens.component["dropdown-menu"].item.radius.$value = "{radius.badge}";
  const cf = componentGaps(pill, g, roots).filter(
    (x) => x.kind === "nested-corner",
  );
  assert.ok(
    cf.some((x) => x.component === "dropdown-menu" && x.part === "item"),
    "Content first's pill menu item",
  );
  for (const id of [
    "dense-data",
    "content-first",
    "accessible-first",
    "brand-expressive",
    "multi-brand",
  ])
    assert.equal(
      gaps(id).filter((x) => x.kind === "nested-corner").length,
      0,
      `${id}: options nest in their panels`,
    );
});

test("borrows-a-key: a component that reads another component's own key", async () => {
  // A fixture: the checkbox given back the button's focus ring, as it read before OD-243.
  const { ui } = await fixture("checkbox.tsx", (src) =>
    src.replace("var(--checkbox-focus-ring)", "var(--button-focus-ring)"),
  );
  assert.ok(
    componentGaps(fakeScheme("borrow"), g, { ...roots, ui }).some(
      (x) =>
        x.kind === "borrows-a-key" &&
        x.component === "checkbox" &&
        x.key === "component.button.focus-ring",
    ),
  );
});

test("reads-the-system: a bare utility that reads a system variable", async () => {
  // A fixture: the components as they are, with the alert given back a bare \`border\` (it read
  // --border from the system before OD-243).
  const {
    cpSync,
    mkdtempSync,
    readFileSync: read,
    writeFileSync: write,
  } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const ui = join(mkdtempSync(join(tmpdir(), "od-gaps-")), "src");
  cpSync(roots.ui, ui, { recursive: true });
  const f = join(ui, "components", "alert.tsx");
  write(
    f,
    read(f, "utf8")
      .replace('data-slot="alert"', 'data-slot="alert" data-x="border"')
      .replace(/className=\{cn\(\s*"/, (m) => `${m}border `),
  );
  const r = { ...roots, ui };
  const fake = structuredClone(loadScheme("dense-data", roots));
  fake.id = "dense-data-fixture";
  assert.ok(
    componentGaps(fake, g, r).some(
      (x) =>
        x.kind === "reads-the-system" &&
        x.component === "alert" &&
        x.key === "--border",
    ),
  );
});

test("skips-a-component: an empty state drawn by hand, not the Empty component", () => {
  const own = `const LABELS = { noResults: "No results." };\n<TableCell>{l.noResults}</TableCell>`;
  assert.equal(drawsOwnEmpty(own, "data-table"), true);
  assert.equal(
    drawsOwnEmpty(`import { Empty } from "./empty";\n${own}`, "data-table"),
    false,
  );
  assert.equal(drawsOwnEmpty(own, "empty"), false);
});

test("nested-corner: a trigger in a bar nests like an option in a menu", () => {
  // The menubar before OD-246: a pill trigger in Content first's rounded bar.
  const pill = structuredClone(loadScheme("content-first", roots));
  pill.id = "content-first-pill-trigger";
  pill.tokens.component.menubar.trigger.radius.$value = "{radius.badge}";
  assert.ok(
    componentGaps(pill, g, roots).some(
      (x) =>
        x.kind === "nested-corner" &&
        x.component === "menubar" &&
        x.part === "trigger",
    ),
  );
});

test("fades-a-color: an opacity modifier on a key or a named color", async () => {
  // A fixture: the calendar's focus ring faded to 50% by hand, as it was before OD-243.
  const { ui } = await fixture("calendar.tsx", (src) =>
    src.replace("var(--calendar-focus-ring)]", "var(--calendar-focus-ring)]/50"),
  );
  assert.ok(
    componentGaps(fakeScheme("fade"), g, { ...roots, ui }).some(
      (x) => x.kind === "fades-a-color" && x.component === "calendar",
    ),
  );
  // Fixed in OD-243: the menus' destructive highlight reads the danger tint, unfaded.
  for (const c of ["context-menu", "menubar", "combobox"])
    assert.ok(
      !gaps("dense-data").some(
        (x) => x.kind === "fades-a-color" && x.component === c,
      ),
      c,
    );
});

test("a class that reaches into a child paints the child, and has-[…] does not", async () => {
  const { usages } = await import("../src/gaps.mjs");
  const src = `<div data-slot="combobox-content" className="*:data-[slot=input-group]:h-[var(--x)] has-data-[slot=combobox-chip]:px-[var(--y)]" />`;
  assert.equal(usages(src, "combobox", "--x")[0].part, "input-group");
  assert.equal(usages(src, "combobox", "--y")[0].part, "content");
});

test("an agent is never offered a deprecated key (OD-243)", async () => {
  const { context } = await import("../src/context.mjs");
  const { findToken } = await import("../src/tools.mjs");
  const s = loadScheme("dense-data", roots);
  const old = new Set(
    g.component_keys.filter((k) => k.replaced_by).map((k) => k.id),
  );
  assert.ok(old.size > 0, "the fixture has deprecated keys");
  const c = context("dense-data", "color.text.primary", roots, g);
  for (const id of c.read_by ?? [])
    assert.ok(!old.has(id), `read_by offers ${id}`);
  for (const hit of findToken(s, g, "navigation menu trigger label hover", 20)
    .results)
    assert.ok(!old.has(hit.token), `find_token offers ${hit.token}`);
});
