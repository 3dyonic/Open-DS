#!/usr/bin/env node
// OD-299: two color questions, each a follow-up of one method question. color.definition.steps asks how
// a scale spaces its steps (contrast-graded, with an easing strength); color.values.difference asks how
// far apart colors that mean different things must be. Writes the questions to the grammar, lets the
// schemas take a follow-up question, and writes each scheme's answer with its why. Changes no value:
// the graded curve stays behind its flag (cli/src/color-steps.mjs). Idempotent.
//
//   node scripts/od-299-color-questions.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatGrammar, grammar as loadGrammar, loadScheme, saveGrammar, saveScheme, schemeIds } from "../cli/src/schemes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const STEPS = {
  id: "color.definition.steps",
  method: "definition",
  text: "How are the steps of a color scale spaced?",
  description:
    "Every option is contrast-graded: steps 400 apart reach 3:1, 500 apart 4.5:1 and 700 apart 7:1. The option sets how much the lightness curve eases toward the ends. A stronger ease keeps the soft tints and the deep shades closer together and opens the middle steps.",
  options: [
    { id: "linear", label: "Linear", description: "No ease. The same contrast for the same distance in steps, from end to end.", creates: [] },
    { id: "light-ease", label: "A light ease", description: "A quarter of the ease. The ends sit a little closer together.", creates: [] },
    { id: "medium-ease", label: "A medium ease", description: "A bit less than half of the ease.", creates: [] },
    { id: "even-ease", label: "An even ease", description: "Half linear, half eased.", creates: [] },
    { id: "strong-ease", label: "A strong ease", description: "More ease than linear. The middle steps stand furthest apart.", creates: [] },
  ],
};

const DIFFERENCE = {
  id: "color.values.difference",
  method: "values",
  text: "How far apart must colors that mean different things be?",
  description:
    "The smallest OKLab distance between two accent, status or category colors on a surface. It is checked with normal vision and with simulated red-weak, green-weak and blue-weak vision. A pair under it needs a second cue: an icon, a label or a pattern.",
  options: [
    { id: "distinct", label: "Distinct", description: "Visibly different side by side. Words and icons carry most of the meaning.", creates: [] },
    { id: "clear", label: "Clear", description: "Different at a glance, about as far apart as the closest status colors of published systems.", creates: [] },
    { id: "strong", label: "Strong", description: "Different even at small sizes and from a distance.", creates: [] },
  ],
};

/** Each scheme's answers: { steps, difference }, each { option, why, because }. */
const ANSWERS = {
  "accessible-first": {
    steps: { option: "linear", why: "Even contrast between all steps, so every pair of steps is as easy to tell apart as any other.", because: ["people.q1", "color.definition"] },
    difference: { option: "strong", why: "Status and accent must be told apart by everyone, also with a color vision deficiency.", because: ["people.q1", "color.lands"] },
  },
  "content-first": {
    steps: { option: "light-ease", why: "A light ease keeps the soft tints behind long text close together; the middle stays even.", because: ["content.q1", "color.definition"] },
    difference: { option: "clear", why: "Readers meet status and links inside text, so each must be clear at a glance.", because: ["content.q1", "color.lands"] },
  },
  "multi-brand": {
    steps: { option: "medium-ease", why: "A medium ease fits every brand key: soft tints for surfaces, open middle steps for fills.", because: ["brand.q1", "color.definition"] },
    difference: { option: "clear", why: "Each brand keeps its status colors clear of its own accent at a glance.", because: ["brand.q1", "color.lands"] },
  },
  "brand-expressive": {
    steps: { option: "even-ease", why: "Half eased: rich middle steps for brand fills, soft ends for backgrounds and deep text.", because: ["brand.q1", "color.definition"] },
    difference: { option: "distinct", why: "Brand moments carry meaning with words and icons too, so a visible difference is enough.", because: ["brand.q1", "color.lands"] },
  },
  "dense-data": {
    steps: { option: "strong-ease", why: "A strong ease opens the middle steps, where dense tables need fills that stand apart.", because: ["tasks.q1", "color.definition"] },
    difference: { option: "clear", why: "Status and categories in tables must differ at a glance, row after row.", because: ["tasks.q1", "color.lands"] },
  },
};

// A question goes right after the method question it follows.
function withFollowUp(questions, q) {
  const rest = questions.filter((x) => x.id !== q.id);
  const at = rest.findIndex((x) => x.id === q.id.split(".").slice(0, 2).join("."));
  return [...rest.slice(0, at + 1), q, ...rest.slice(at + 1)];
}

const g = loadGrammar();
const color = g.scopes.find((s) => s.id === "color");
color.questions = withFollowUp(withFollowUp(color.questions, STEPS), DIFFERENCE);
saveGrammar(g);

// The schemas take a follow-up question: <scope>.<method>.<name>, after the five method questions.
const FOLLOW_UP = "^[a-z]+\\.(roles|count|definition|values|lands)(\\.[a-z-]+)?$";
const grammarSchemaFile = join(root, "schema", "grammar.schema.json");
const gs = JSON.parse(readFileSync(grammarSchemaFile, "utf8"));
const scopeQuestions = gs.$defs.scope.properties.questions;
delete scopeQuestions.maxItems;
scopeQuestions.description = "One question per method, in method order. A follow-up question refines one method question and sits right after it (OD-299).";
const sq = gs.$defs["scope-question"].properties;
sq.id.pattern = FOLLOW_UP;
sq.id.description = "Scope question id: <scope>.<method>, or <scope>.<method>.<name> for a follow-up question.";
sq.id.examples = ["typography.values", "color.definition.steps"];
writeFileSync(grammarSchemaFile, formatGrammar(gs));

const schemeSchemaFile = join(root, "schema", "scheme.schema.json");
const ss = JSON.parse(readFileSync(schemeSchemaFile, "utf8"));
const answer = ss.properties.answers.items.properties;
const ANSWER = "^[a-z]+\\.(q\\d+|roles|count|definition|values|lands)(\\.[a-z-]+)?$";
answer.question.pattern = ANSWER;
answer.because.items.pattern = ANSWER;
// A step the contrast-graded curve would move over its shift limit keeps the shared curve (OD-299).
ss.$defs.scaleSpec.properties.held = {
  type: "object",
  description:
    "Steps that keep the shared curve when the contrast-graded curve is on, each with why: over-limit (the move is over its shift limit), relation (a relation gate would fail) or order (it sits between a held step and the end of the scale).",
  propertyNames: { pattern: "^(50|[1-9]00|950)$" },
  additionalProperties: { enum: ["over-limit", "relation", "order"] },
};
writeFileSync(schemeSchemaFile, formatGrammar(ss));

for (const id of schemeIds()) {
  const a = ANSWERS[id];
  if (!a) throw new Error(`${id} has no OD-299 color answers. Add them to ANSWERS in this script.`);
  const s = loadScheme(id);
  const put = (question, x) => {
    const rest = s.answers.filter((y) => y.question !== question);
    const at = rest.findIndex((y) => y.question === question.split(".").slice(0, 2).join("."));
    s.answers = [...rest.slice(0, at + 1), { question, option: x.option, why: x.why, because: x.because }, ...rest.slice(at + 1)];
  };
  put(STEPS.id, a.steps);
  put(DIFFERENCE.id, a.difference);
  saveScheme(s);
}
console.log(`Wrote ${STEPS.id} and ${DIFFERENCE.id} to the grammar, the schemas and ${schemeIds().length} schemes.`);
