#!/usr/bin/env node
// OD-307: plain words for each option of color.definition.steps, for the page How the scale is built.
// Writes an explain object (goal, how, gives, band) on each option, and lets the grammar schema take it.
// {hue} stands for the scale's color name. Changes no value. Idempotent.
//
//   node scripts/od-307-explain.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatGrammar, grammar as loadGrammar, questions, saveGrammar } from "../cli/src/schemes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const EXPLAIN = {
  linear: {
    goal: "to make every step equally easy to tell from its neighbor",
    how: "The curve gives each step the same contrast gap, from end to end.",
    gives: "So no part of the {hue} scale has steps that blur together.",
  },
  "light-ease": {
    goal: "to keep the soft page tints close together",
    how: "The curve holds the ends a little closer and keeps the middle steps nearly even.",
    gives: "So backgrounds stay quiet behind long text, and buttons keep a clear {hue}.",
    band: "a little wider",
  },
  "medium-ease": {
    goal: "to fit every brand key with one curve",
    how: "The curve opens the middle steps a little and keeps the ends close.",
    gives: "So each brand gets soft tints for surfaces and open middle steps for fills.",
    band: "opened for brand fills",
  },
  "even-ease": {
    goal: "to give brand fills many strong steps",
    how: "The curve spreads the middle steps apart and keeps the ends close.",
    gives: "So buttons and badges get several rich {hue}s, while backgrounds stay soft and text stays deep.",
    band: "spread wider for brand fills",
  },
  "strong-ease": {
    goal: "to make fills in dense tables stand apart",
    how: "The curve spreads the middle steps furthest apart and keeps the ends close.",
    gives: "So status fills and row highlights stay distinct, while backgrounds stay soft.",
    band: "spread widest for fills in tables",
  },
};

const g = loadGrammar();
const steps = questions(g)["color.definition.steps"];
if (!steps) throw new Error("The grammar has no color.definition.steps question. Run scripts/od-299-color-questions.mjs first.");
for (const group of [...g.reasons, ...g.scopes]) {
  const q = group.questions.find((x) => x.id === "color.definition.steps");
  if (!q) continue;
  for (const o of q.options) {
    if (!EXPLAIN[o.id]) throw new Error(`No explain text for option ${o.id}. Add it to EXPLAIN in this script.`);
    o.explain = EXPLAIN[o.id];
  }
}
saveGrammar(g);

const schemaFile = join(root, "schema", "grammar.schema.json");
const schema = JSON.parse(readFileSync(schemaFile, "utf8"));
const text = (description) => ({ type: "string", minLength: 1, description });
schema.$defs.option.properties.explain = {
  type: "object",
  additionalProperties: false,
  required: ["goal", "how", "gives"],
  description:
    "Plain words that explain the option on a docs page, such as How the scale is built (OD-307). {hue} stands for the name of the scale's color.",
  properties: {
    goal: text("What the option is for: a clause after 'We use <option> for the <hue> scale,', such as 'to give brand fills many strong steps'."),
    how: text("One sentence: how the option does its job."),
    gives: text("One sentence that starts with 'So': what people get."),
    band: text("What the middle steps do, after 'Middle steps:'. Left out when the option draws no middle band, such as linear."),
  },
};
writeFileSync(schemaFile, formatGrammar(schema));
console.log(`Wrote the explain text for ${Object.keys(EXPLAIN).length} options of color.definition.steps, and its schema.`);
