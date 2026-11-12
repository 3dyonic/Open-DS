// Illustrative sample copy shows a sample mark in the anatomy drawings (OD-135).
import assert from "node:assert/strict";
import { test } from "node:test";
import { SAMPLE_MARK, sampleText } from "../../scripts/anatomy-figma/sample-text.mjs";

const samples = {
  choices: [
    { label: "Monthly", description: "12.00 a month. Cancel any time.", illustrative: ["description"] },
    { label: "Yearly", description: "Pay once a year." },
  ],
};

test("a field listed in illustrative ends with the sample mark", () => {
  assert.deepEqual(sampleText({ sample: "choices.0.description" }, samples), {
    text: `12.00 a month. Cancel any time.${SAMPLE_MARK}`,
  });
});

test("a field of the same object that is not listed keeps its text", () => {
  assert.deepEqual(sampleText({ sample: "choices.0.label" }, samples), { text: "Monthly" });
});

test("an object without illustrative keeps its text", () => {
  assert.deepEqual(sampleText({ sample: "choices.1.description" }, samples), { text: "Pay once a year." });
});
