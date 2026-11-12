// Verifier, criterion 3: blast radius. A hard-coded value under an anchor must show as an orphan;
// a value wired to an anchor with no trace link must show as a hidden coupling.
import { test } from "node:test";
import assert from "node:assert/strict";
import { baseSnapshot, cardOf, row, SCHEME, semantic, themePick } from "./verify-a-harness.mjs";

const show = (r) => JSON.stringify({ base: r.base, candidate: r.candidate, pass: r.pass, details: r.details });

function assertOrphan(card, token) {
  const r = row(card, "blast-radius.anchor-orphans");
  assert.ok(r.candidate > r.base && !r.pass, `anchor-orphans did not rise: ${show(r)}`);
  assert.ok(r.details.some((d) => d.includes(token)), `${token} not named as an orphan: ${show(r)}`);
}

function assertHidden(card, token) {
  const r = row(card, "blast-radius.hidden-couplings");
  assert.ok(r.candidate > r.base && !r.pass, `hidden-couplings did not rise: ${show(r)}`);
  assert.ok(r.details.some((d) => d.includes(token)), `${token} not named as a hidden coupling: ${show(r)}`);
}

test("B1: the default control height hard-coded is an orphan of the control-height anchor", async () => {
  const card = await cardOf((s) => {
    semantic(s, "size.control.default").$value = "32px";
  });
  assertOrphan(card, "size.control.default");
});

test("B2: the control radius pick hard-coded is an orphan of the default-radius anchor", async () => {
  const card = await cardOf((s) => {
    themePick(s, "base", "radius.control").$value = "2px";
  });
  assertOrphan(card, "radius.control");
});

test("B3: a base-step spacing value hard-coded is an orphan of the base-step anchor", async () => {
  const card = await cardOf((s) => {
    semantic(s, "space.gap.tight").$value = "4px";
  });
  assertOrphan(card, "space.gap.tight");
});

test("B4: cell padding wired to the control height, with no trace link, is a hidden coupling", async () => {
  const card = await cardOf((s) => {
    semantic(s, "space.inset.cell-x").$value = "{size.control.default}";
  });
  assertHidden(card, "space.inset.cell-x");
});

test("B5: the surface radius wired to the control radius, with no trace link, is a hidden coupling", async () => {
  const card = await cardOf((s) => {
    semantic(s, "radius.surface").$value = "{radius.control}";
  });
  assertHidden(card, "radius.surface");
});

test("B6: perturbing an answer moves at least one value it is linked to", { todo: "A true finding about the schemes, not a gate miss: the loader stores values and derives none from answers, so no answer moves a value in any scheme. The gate reports it as blast-radius.answers-generate-nothing." }, async () => {
  const s = (await baseSnapshot()).schemes[SCHEME];
  const answers = s.blast.filter((b) => b.kind === "answer");
  const moved = answers.filter((b) => b.moved.length > 0);
  assert.ok(moved.length > 0, `0 of ${answers.length} answer perturbations moved any value; ${answers.filter((b) => b.expected.length).length} have expected values`);
});

test("B7: perturbing the key color moves the primary action color", async () => {
  const s = (await baseSnapshot()).schemes[SCHEME];
  const key = s.blast.find((b) => b.id === "key-color");
  assert.ok(key.moved.includes("color.action.primary"), `key-color moved ${JSON.stringify(key.moved)}, expected ${JSON.stringify(key.expected)}`);
});

test("B-clean: rewording a description changes no blast number", async () => {
  const card = await cardOf((s) => {
    semantic(s, "space.gap.group").$description = "Between groups of related items on one screen.";
  });
  for (const id of ["blast-radius.answer-orphans", "blast-radius.anchor-orphans", "blast-radius.hidden-couplings"]) {
    const r = row(card, id);
    assert.equal(r.candidate, r.base, `${id}: ${show(r)}`);
  }
  assert.equal(card.pass, true, `gate failed: ${card.failed}`);
});
