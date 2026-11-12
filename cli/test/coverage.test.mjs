// Decision coverage (OD-273): each test pins one way a semantic value rests on a decision, or does not.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { decisionCoverage } from "../src/coverage.mjs";

const roots = assetRoots();
const g = grammar(roots);
const dense = decisionCoverage(loadScheme("dense-data", roots), g);
const linkOf = (cov, token) => cov.linked.find((l) => l.token === token);
const gapOf = (cov, token) => cov.unlinked.find((u) => u.token === token);

test("a theme pick that cites an answer links its semantic", () => {
  const link = linkOf(dense, "color.text.primary");
  assert.ok(link, "color.text.primary is linked");
  assert.deepEqual(link.by, ["pick"]);
  assert.ok(link.because.length > 0, "it carries the answers its pick cites");
});

test("a usage rule that names a group links every token in it", () => {
  // Dense data's paragraph rule uses type.body, because of outcomes.q1.
  for (const part of ["font-size", "line-height", "font-weight"]) {
    const link = linkOf(dense, `type.body.${part}`);
    assert.ok(link, `type.body.${part} is linked`);
    assert.ok(link.by.includes("rule"), link.by.join(", "));
    assert.ok(link.because.includes("outcomes.q1"));
  }
});

test("a value with no pick and no rule takes its group's reason: the component spacing map's rhythm", () => {
  assert.ok(linkOf(dense, "border-width.default"));
  const link = linkOf(dense, "component-spacing-map.x1");
  assert.ok(link.by.includes("group"), link.by.join(", "));
  assert.ok(link.because.includes("spacing.values"));
  assert.equal(gapOf(dense, "component-spacing-map.x1"), undefined);
  assert.equal(dense.linked.length + dense.unlinked.length, dense.total);
});

// A small scheme and grammar: one question asked and answered (shape.q1), one asked and not answered
// (shape.q2), and one nobody asks (nope.q1).
const fixtureGrammar = {
  reasons: [],
  scopes: [{ id: "shape", owns: ["radius"], questions: [{ id: "shape.q1" }, { id: "shape.q2" }] }],
};
const fixtureScheme = ({
  pickBecause = [],
  ruleBecause = [],
  use = "radius.badge-wide, radius.cardish, then radius.ca",
} = {}) => ({
  id: "fixture",
  answers: [{ question: "shape.q1", option: "a" }],
  themes: [{ id: "light", brand: "default", mode: "light" }],
  usage: [{ situation: "chip", use, because: ruleBecause }],
  tokens: {
    primitive: { radius: { 2: { $value: "2px" } } },
    semantic: {
      radius: {
        control: { $value: "{theme.radius.control}" },
        badge: { $value: "{radius.2}" },
        card: { $value: "{radius.2}" },
      },
    },
    brands: {
      default: {
        theme: {
          base: {
            radius: {
              control: { $value: "{radius.2}", $extensions: { "open-ds": { because: pickBecause } } },
            },
          },
          light: {},
        },
      },
    },
  },
});

test("a cited id that the grammar does not ask, or the scheme does not answer, links nothing", () => {
  const unlinked = (s) => decisionCoverage(s, fixtureGrammar).unlinked.map((u) => u.token);
  assert.deepEqual(unlinked(fixtureScheme({ pickBecause: ["shape.q1"] })), ["radius.badge", "radius.card"]);
  assert.deepEqual(unlinked(fixtureScheme({ pickBecause: ["nope.q1"] })), [
    "radius.control",
    "radius.badge",
    "radius.card",
  ]);
  assert.deepEqual(unlinked(fixtureScheme({ pickBecause: ["shape.q2"] })), [
    "radius.control",
    "radius.badge",
    "radius.card",
  ]);
  assert.deepEqual(unlinked(fixtureScheme({ use: "radius.badge", ruleBecause: ["shape.q1"] })), [
    "radius.control",
    "radius.card",
  ]);
  assert.deepEqual(unlinked(fixtureScheme({ use: "radius.badge", ruleBecause: ["nope.q1", "shape.q2"] })), [
    "radius.control",
    "radius.badge",
    "radius.card",
  ]);
});

test("a rule names whole tokens, not part of a name", () => {
  // The rule names radius.badge-wide, radius.cardish and radius.ca: none is radius.badge or radius.card.
  const cov = decisionCoverage(fixtureScheme({ ruleBecause: ["shape.q1"] }), fixtureGrammar);
  assert.deepEqual(
    cov.unlinked.map((u) => [u.token, u.scope]),
    [
      ["radius.control", "shape"],
      ["radius.badge", "shape"],
      ["radius.card", "shape"],
    ],
  );
});
