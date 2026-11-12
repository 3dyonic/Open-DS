// Verifier, criterion 2: derived against literal. A new raw literal must lower the derived share,
// fail the gate, and appear in the unreasoned list when it has no reason of its own.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cardOf, row, semantic, setWhy, themePick } from "./verify-a-harness.mjs";

const show = (r) => JSON.stringify({ base: r.base, candidate: r.candidate, pass: r.pass, details: r.details.slice(0, 3) });

function assertLiteralCaught(card, token) {
  const share = row(card, "derived.share");
  assert.ok(share.candidate < share.base && !share.pass, `derived.share did not fall: ${show(share)}`);
  assert.ok(card.failed.includes("derived.share"), "the gate did not fail");
  const listed = row(card, "derived.new-literals");
  assert.ok(listed.details.some((d) => d.includes(token)), `${token} not listed as a new literal: ${show(listed)}`);
}

const strip = (n) => {
  delete n.$description;
  delete n.$extensions;
};

test("D1: a spacing alias replaced by a raw px value, no reason", async () => {
  const card = await cardOf((s) => {
    const n = semantic(s, "space.gap.tight");
    n.$value = "4px";
    strip(n);
  });
  assertLiteralCaught(card, "space.gap.tight");
});

test("D2: the default control height replaced by a raw px value, no reason", async () => {
  const card = await cardOf((s) => {
    const n = semantic(s, "size.control.default");
    n.$value = "32px";
    strip(n);
  });
  assertLiteralCaught(card, "size.control.default");
});

test("D3: a border color pick replaced by a raw hex, no reason", async () => {
  const card = await cardOf((s) => {
    const n = themePick(s, "light", "color.border.default");
    n.$value = "#D0E2EA";
    strip(n);
  });
  assertLiteralCaught(card, "color.border.default");
});

test("D4: a radius pick replaced by a raw px value, no reason", async () => {
  const card = await cardOf((s) => {
    const n = themePick(s, "base", "radius.control");
    n.$value = "2px";
    strip(n);
  });
  assertLiteralCaught(card, "radius.control");
});

test("D5: a new literal stripped of its own reason is listed as unreasoned", async () => {
  // The literal keeps only the grammar's usage-rule text, which is not a reason recorded for it.
  const card = await cardOf((s) => {
    const n = semantic(s, "space.gap.tight");
    n.$value = "4px";
    strip(n);
  });
  const unreasoned = row(card, "derived.new-literals-unreasoned");
  assert.ok(unreasoned.details.some((d) => d.includes("space.gap.tight")), `not listed: ${show(unreasoned)}; new-literals: ${show(row(card, "derived.new-literals"))}`);
});

test("D-clean: a scale step swapped for another scale step is not a literal", async () => {
  const card = await cardOf((s) => {
    semantic(s, "space.gap.default").$value = "{space.12}";
  });
  for (const id of ["derived.share", "derived.literal-values", "derived.new-literals-unreasoned"]) assert.ok(row(card, id).pass, `${id}: ${show(row(card, id))}`);
  assert.deepEqual(row(card, "derived.new-literals").details, []);
});

test("D-clean: a new literal with its own recorded reason is not in the unreasoned list", async () => {
  const card = await cardOf((s) => {
    const n = themePick(s, "base", "radius.control");
    n.$value = "2px";
    setWhy(n, "Two pixels on purpose, off the radius scale, so controls match the host app's grid.", ["shape.values", "brand.q1"]);
  });
  assert.ok(row(card, "derived.new-literals").details.some((d) => d.includes("radius.control")), "the reasoned literal is not listed as new");
  assert.deepEqual(row(card, "derived.new-literals-unreasoned").details, []);
});
