// Quality gate, repetition (OD-298): a sentence repeated across reasons, token names taken out.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure, repeatedSentences, sentencesOf } from "../src/quality/criteria/repetition.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

test("sentences lose their token names, case and end punctuation; short ones drop", () => {
  assert.deepEqual(sentencesOf("radius.2: a small control corner keeps buttons crisp. Too short."), ["a small control corner keeps buttons crisp"]);
  assert.deepEqual(sentencesOf("gray.50 sits under color.surface.default, quietly behind cards."), ["sits under quietly behind cards"]);
});

test("the clean fixture repeats no sentence", () => {
  assert.equal(valueOf(measure(snapshotOf(fixtureScheme())), "repetition.repeated-sentences"), 0);
});

test("a duplicate sentence counts once per extra copy, even with other token names", () => {
  const s = fixtureScheme();
  s.tokens.semantic.radius.surface.$extensions["open-ds"].why = "Surface corner: 4px. Sharp corners let panels tile into a grid.";
  s.tokens.brands.default.theme.light.color.surface.sunken.$extensions["open-ds"].why = "gray.100: the light canvas sits just behind the cards.";
  const snap = snapshotOf(s);
  assert.equal(valueOf(measure(snap), "repetition.repeated-sentences"), 2);
  assert.deepEqual(
    repeatedSentences(snap.schemes.fixture.reasons).map((r) => [r.sentence, r.count]),
    [
      ["sharp corners let panels tile into a grid", 2],
      ["the light canvas sits just behind the cards", 2],
    ],
  );
  assert.ok(compareSnapshots(snapshotOf(fixtureScheme()), snap).failed.includes("repetition.repeated-sentences"));
});
