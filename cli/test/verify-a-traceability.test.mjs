// Verifier, criterion 1: traceability. A seeded weak reason must raise a weak count and fail the gate.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cardOf, row, semantic, setWhy } from "./verify-a-harness.mjs";

const show = (r) => JSON.stringify({ base: r.base, candidate: r.candidate, details: r.details.slice(0, 6) });

function assertWeakRose(card, token) {
  const weak = row(card, "traceability.weak");
  assert.ok(weak.candidate > weak.base, `weak did not rise: ${show(weak)}`);
  assert.ok(!weak.pass && card.failed.includes("traceability.weak"), "the gate did not fail on traceability.weak");
  assert.ok(weak.details.some((d) => d.includes(token)), `${token} not named: ${show(weak)}`);
}

test("T1: a reason under 6 words is weak", async () => {
  const card = await cardOf((s) => setWhy(semantic(s, "type.body.font-size"), "Small body text."));
  assertWeakRose(card, "type.body.font-size");
});

test("T2: a reason that cites no answer is weak", async () => {
  const card = await cardOf((s) =>
    setWhy(semantic(s, "type.title.font-size"), "Twenty pixels keeps page titles small so the table starts higher on the screen.", []),
  );
  assertWeakRose(card, "type.title.font-size");
});

test("T3: a reason that shares its sentence with another value is weak", async () => {
  const card = await cardOf((s) => {
    const label = semantic(s, "type.label.font-size").$extensions["open-ds"];
    setWhy(semantic(s, "type.caption.font-weight"), label.why, label.because);
  });
  assertWeakRose(card, "type.caption.font-weight");
});

test("T5: two values that share one sentence inside otherwise distinct reasons are weak", async () => {
  const shared = "Analysts compare these rows for hours without a break.";
  const card = await cardOf((s) => {
    setWhy(semantic(s, "type.data.font-size"), `Thirteen pixels fits more mono columns into one row. ${shared}`, ["typography.roles", "content.q2"]);
    setWhy(semantic(s, "type.data.line-height"), `The open step gives cells a taller line for scanning. ${shared}`, ["typography.definition", "human.q1"]);
  });
  assertWeakRose(card, "type.data.font-size");
});

test("T4: a new semantic value with no reason and no grammar rule is untraced", async () => {
  const card = await cardOf((s) => {
    s.tokens.semantic.space.gap.huddle = { $type: "dimension", $value: "{space.8}" };
  });
  const traced = row(card, "traceability.traced-share");
  const weak = row(card, "traceability.weak");
  assert.ok(traced.candidate < traced.base || weak.candidate > weak.base, `neither traced nor weak moved: ${show(traced)} ${show(weak)}`);
});

test("T-clean: a longer reason that cites an answer is not flagged", async () => {
  const card = await cardOf((s) =>
    setWhy(
      semantic(s, "type.body.font-size"),
      "Fourteen pixels is the small body size, so help text reads in passing and more table rows fit on one screen.",
      ["typography.values", "outcomes.q1"],
    ),
  );
  for (const id of ["traceability.weak", "traceability.untraced", "traceability.traced-share"]) assert.ok(row(card, id).pass, `${id} failed: ${show(row(card, id))}`);
});
