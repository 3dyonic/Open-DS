// Verifier, criterion 4: repetition. A sentence repeated across reasons, once token names are
// stripped, must raise the repeated-sentence count and fail the gate.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cardOf, row, semantic, setWhy, themePick } from "./verify-a-harness.mjs";

const show = (r) => JSON.stringify({ base: r.base, candidate: r.candidate, pass: r.pass, details: r.details.slice(0, 4) });

function assertRepeated(card) {
  const r = row(card, "repetition.repeated-sentences");
  assert.ok(r.candidate > r.base && !r.pass, `repeated-sentences did not rise: ${show(r)}`);
  assert.ok(card.failed.includes("repetition.repeated-sentences"), "the gate did not fail");
}

test("R1: two reasons that differ only in the token they name", async () => {
  const card = await cardOf((s) => {
    setWhy(semantic(s, "type.body.font-weight"), "type.body stays regular so long help sentences read calmly beside the dense data.");
    setWhy(semantic(s, "type.caption.font-weight"), "type.caption stays regular so long help sentences read calmly beside the dense data.");
  });
  assertRepeated(card);
});

test("R2: the same sentence with other case and punctuation, inside longer reasons", async () => {
  const card = await cardOf((s) => {
    setWhy(themePick(s, "base", "radius.control"), "radius.2 for controls. Quiet corners keep the dense grid easy to scan!");
    setWhy(themePick(s, "base", "radius.element"), "radius.2 for growing boxes; it matches controls. quiet corners keep the dense grid easy to scan.");
  });
  assertRepeated(card);
});

test("R3: one sentence pasted into three answer reasons", async () => {
  const card = await cardOf((s) => {
    for (const q of ["business.q1", "people.q1", "content.q2"]) {
      const a = s.answers.find((x) => x.question === q);
      a.why = `${a.why} Analysts watch this screen for hours every working day.`;
    }
  });
  assertRepeated(card);
});

test("R4: the scorecard names a new repeated sentence, so a reviewer can find it", async () => {
  const card = await cardOf((s) => {
    setWhy(semantic(s, "type.body.font-weight"), "type.body stays regular so long help sentences read calmly beside the dense data.");
    setWhy(semantic(s, "type.caption.font-weight"), "type.caption stays regular so long help sentences read calmly beside the dense data.");
  });
  const r = row(card, "repetition.repeated-sentences");
  assert.ok(r.details.some((d) => d.includes("help sentences read calmly")), `not among ${r.details.length} details for ${r.candidate} repeats`);
});

test("R-clean: rewording a reason into a fresh sentence adds no repetition", async () => {
  const card = await cardOf((s) =>
    setWhy(semantic(s, "type.body.font-weight"), "Regular weight keeps help sentences quiet next to bold numbers in the grid."),
  );
  const r = row(card, "repetition.repeated-sentences");
  assert.ok(r.pass && r.candidate <= r.base, show(r));
});
