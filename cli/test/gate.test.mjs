// The gate: every claim a token's card makes holds, or waits with an approved wait. The gate and the cards
// read the same checks, a rule that does not hold is a gap, and a wait has one shape. Run on the real schemes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { schemeValidator } from "../src/build.mjs";
import { allConnections, connectionGaps, evaluateConnections, gapId, gapItem, graphNodes, indexesOf, roleOf, waitsOf } from "../src/decision-graph.mjs";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { flatTokens } from "../src/tokens.mjs";

const roots = assetRoots();
const g = grammar(roots);
const SCHEMES = ["dense-data", "content-first", "accessible-first", "multi-brand", "brand-expressive"];
const MODES = ["light", "dark"];
const key = (x) => `${x.connection} ${x.tokens.join(" | ")}`;
const ruleGaps = (scheme) => connectionGaps(evaluateConnections(scheme, g)).filter((x) => x.kind === "rule");
const gapsOf = (scheme, id) => connectionGaps(evaluateConnections(scheme, g)).filter((x) => x.connection === id);
const approved = { for: "a planted decision", why: "A planted break.", approved_by: "the design lead" };
const unapproved = { for: "a planted decision", why: "A planted break." };
const withWait = (token, waits) => ({ ...token, $extensions: { ...token.$extensions, "open-ds": { ...token.$extensions?.["open-ds"], waits } } });

test("the gate checks every connection pair that a token's card shows, and no other", () => {
  const ids = new Set(allConnections(g).map((c) => c.id));
  for (const id of SCHEMES) {
    const scheme = loadScheme(id, roots);
    const gate = new Map(evaluateConnections(scheme, g).filter((x) => ids.has(x.connection)).map((x) => [key(x), x.holds]));
    // The cards: each role's token, in each brand and mode, asks the engine for its own checks by name.
    const cards = new Map();
    const indexOf = indexesOf(scheme);
    const names = flatTokens(scheme.tokens.semantic).filter(([p, t]) => !t.$deprecated && roleOf(g, p)).map(([p]) => p);
    for (const brand of Object.keys(scheme.tokens.brands))
      for (const mode of MODES)
        for (const name of names)
          for (const node of graphNodes(scheme, g, name, { brand, mode, index: indexOf(brand, mode) }).filter((n) => n.level === "connection"))
            for (const x of node.checks) cards.set(key(x), (cards.get(key(x)) ?? true) && x.holds);
    assert.deepEqual([...cards.keys()].filter((k) => !gate.has(k)), [], `${id}: the cards show checks the gate never runs`);
    assert.deepEqual([...gate.keys()].filter((k) => !cards.has(k)), [], `${id}: the gate runs checks no card shows`);
    for (const [k, holds] of gate) assert.equal(cards.get(k), holds, `${id} ${k}`);
  }
});

test("every type role meets every role one step below it: two roles on one step are two pairs", () => {
  const pairs = gapsOf(loadScheme("dense-data", roots), "sizes-step-apart").map((x) => x.tokens.join(" ~ "));
  assert.deepEqual(pairs, [
    "type.body.font-size ~ type.label.font-size",
    "type.body.font-size ~ type.caption.font-size",
    "type.data.font-size ~ type.label.font-size",
    "type.data.font-size ~ type.caption.font-size",
    "type.heading.font-size ~ type.body.font-size",
    "type.heading.font-size ~ type.data.font-size",
  ]);
});

test("a rule that does not hold is a gap: today 12 rules break in five schemes", () => {
  const found = SCHEMES.flatMap((id) => ruleGaps(loadScheme(id, roots)).map((x) => gapId(gapItem(id, x))));
  assert.deepEqual(found, [
    "dense-data @ color.action.secondary",
    "dense-data @ color.category.5",
    "content-first @ color.action.secondary",
    "content-first @ color.category.5",
    "accessible-first @ color.action.secondary",
    "accessible-first @ color.action.danger",
    "accessible-first @ color.status.danger",
    "accessible-first @ color.category.5",
    "multi-brand surface-corner radius.surface",
    "multi-brand @ color.action.secondary",
    "brand-expressive @ color.action.secondary",
    "brand-expressive @ color.category.5",
  ]);
});

test("a planted step off the slot breaks its rule; the rule node and the gate agree", () => {
  const scheme = structuredClone(loadScheme("dense-data", roots));
  assert.ok(!ruleGaps(scheme).some((x) => x.tokens[0] === "color.status.info"));
  for (const mode of MODES) scheme.tokens.brands.default.theme[mode].color.status.info["@"].$value = `{color.blue.${mode}.300}`;
  const gap = ruleGaps(scheme).find((x) => x.tokens[0] === "color.status.info");
  assert.equal(gap.says, "color.status.info: @ sits at step 600 of its hue; it sits at step 300");
  assert.deepEqual(gap.themes, ["default/light", "default/dark"]);
});

test("a wait on the semantic token, its mode pick or its base pick covers its rule; only an approved one passes", () => {
  const surface = (scheme) => gapsOf(scheme, "surface-corner").map((x) => x.tokens.join(" | "));
  // A token index is built once per tree, so each planted wait goes on a fresh copy.
  const plant = (id, edit) => {
    const scheme = structuredClone(loadScheme(id, roots));
    edit(scheme);
    return scheme;
  };
  assert.deepEqual(surface(loadScheme("multi-brand", roots)), ["radius.surface"]);
  // On the base pick of the brand that breaks it.
  const onBase = (waits) => (s) => {
    const radius = s.tokens.brands.birch.theme.base.radius;
    radius.surface = withWait(radius.surface, waits);
  };
  assert.deepEqual(surface(plant("multi-brand", onBase(unapproved))), ["radius.surface"], "a wait with no approved_by does not pass");
  assert.deepEqual(surface(plant("multi-brand", onBase(approved))), [], "an approved wait on the base pick passes");
  // On the semantic token itself.
  const onToken = (s) => {
    s.tokens.semantic.radius.surface = withWait(s.tokens.semantic.radius.surface, approved);
  };
  assert.deepEqual(surface(plant("multi-brand", onToken)), [], "an approved wait on the semantic token passes");
  // On each mode pick: the secondary fill's slot rule.
  const onModes = (s) => {
    for (const mode of MODES) {
      const t = s.tokens.brands.default.theme[mode].color.action.secondary;
      t["@"] = withWait(t["@"], approved);
    }
  };
  const secondary = (scheme) => ruleGaps(scheme).filter((x) => x.tokens[0] === "color.action.secondary").length;
  assert.equal(secondary(loadScheme("accessible-first", roots)), 1);
  assert.equal(secondary(plant("accessible-first", onModes)), 0, "an approved wait on the mode picks passes");
});

test("an approved wait in one theme excuses no other theme", () => {
  const danger = (modes) => {
    const scheme = structuredClone(loadScheme("multi-brand", roots));
    for (const mode of modes) scheme.tokens.brands.coral.theme[mode].color.action.primary["@"].$extensions["open-ds"].waits.approved_by = "the design lead";
    return gapsOf(scheme, "danger-apart-from-primary");
  };
  assert.deepEqual(danger([]).map((x) => x.themes), [["coral/light", "coral/dark"]], "today's wait has no approval, so it is a gap");
  assert.equal(danger(["light"]).length, 1, "dark still waits with no approval");
  assert.deepEqual(danger(["light", "dark"]), []);
});

test("the three waits on record say what they wait for in plain words and are not approved", () => {
  const waits = [
    ["brand-expressive", "default", "dark"],
    ["multi-brand", "coral", "light"],
    ["multi-brand", "coral", "dark"],
  ].map(([id, brand, mode]) => waitsOf(indexesOf(loadScheme(id, roots))(brand, mode), ["color.action.primary"]));
  for (const w of waits) {
    assert.equal(w.for, "a brand decision: the primary moves away from the danger red, or danger may differ per brand");
    assert.equal(w.approved_by, undefined);
  }
});

test("the scheme schema takes a wait in plain words and rejects a ticket key in for or a blank approved_by", () => {
  const validate = schemeValidator(roots);
  // A token that fails also fails the group branch of the schema; only the errors inside the wait count.
  const plant = (waits) => {
    const scheme = structuredClone(loadScheme("dense-data", roots));
    scheme.tokens.semantic.radius.surface = withWait(scheme.tokens.semantic.radius.surface, waits);
    if (validate(scheme)) return [];
    const inWait = validate.errors.filter((e) => e.instancePath.includes("/open-ds/waits"));
    return [...new Set(inWait.map((e) => `${e.instancePath.split("/").at(-1)} ${e.keyword}`))];
  };
  assert.deepEqual(plant(approved), []);
  assert.deepEqual(plant(unapproved), [], "a wait with no approved_by fits the schema; the gate counts it as a gap");
  assert.deepEqual(plant({ ...approved, for: "OD-225" }), ["for not"]);
  assert.deepEqual(plant({ ...approved, for: "the fix in OD-225" }), ["for not"]);
  assert.deepEqual(plant({ ...approved, approved_by: " " }), ["approved_by pattern"]);
  assert.deepEqual(plant({ ...approved, until: "later" }), ["waits additionalProperties"]);
});
