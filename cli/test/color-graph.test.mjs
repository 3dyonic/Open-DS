// The color decision graph (OD-304): every color token inherits its reason from its role, job,
// property, answers, slot and connections. Run on the real schemes and grammar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { colorReason, connectionChecks, connectionGaps, evaluateConnections, indexesOf, missingLinks, roleOf } from "../src/color-graph.mjs";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { decisionTree, formGaps } from "../src/trace.mjs";

const roots = assetRoots();
const g = grammar(roots);
const SCHEMES = ["dense-data", "content-first", "accessible-first", "multi-brand", "brand-expressive"];
const connection = (id) => g.semantics.connections.items.find((c) => c.id === id);
const clashes = (id) =>
  connectionGaps(evaluateConnections(loadScheme(id, roots), g))
    .filter((x) => x.connection === "category-apart-from-status")
    .map((x) => x.tokens.join(" ~ "));

// The first connection test. It fails on today's data on purpose: the harness keeps the clashes in a
// baseline that may only go down, and the owner decides the fix.
test("category hues stay apart from status hues: today every scheme breaks it", () => {
  assert.deepEqual(clashes("accessible-first"), [
    "color.category.2 ~ color.status.info",
    "color.category.3 ~ color.status.success",
    "color.category.4 ~ color.status.warning",
  ]);
  assert.deepEqual(clashes("multi-brand"), ["color.category.4 ~ color.status.info", "color.category.5 ~ color.status.success"]);
  for (const id of SCHEMES) assert.ok(clashes(id).length > 0, id);
});

test("a category moved off the status hue holds the connection", () => {
  const scheme = structuredClone(loadScheme("accessible-first", roots));
  for (const mode of ["light", "dark"]) scheme.tokens.brands.default.theme[mode].color.category["4"]["@"].$value = `{color.blue.${mode}.600}`;
  const left = connectionGaps(evaluateConnections(scheme, g))
    .filter((x) => x.connection === "category-apart-from-status")
    .map((x) => x.tokens.join(" ~ "));
  assert.deepEqual(left, ["color.category.2 ~ color.status.info", "color.category.3 ~ color.status.success"]);
});

test("a subtle fill comes from the hue of its @; a planted hue breaks it", () => {
  const scheme = structuredClone(loadScheme("dense-data", roots));
  const index = indexesOf(scheme)("default", "light");
  const c = connection("subtle-from-hue");
  assert.ok(connectionChecks(scheme, g, c, { brand: "default", mode: "light", index }).every((x) => x.holds));
  scheme.tokens.brands.default.theme.light.color.status.info.subtle.$value = "{color.red.light.100}";
  const planted = connectionChecks(scheme, g, c, { brand: "default", mode: "light", index: indexesOf(scheme)("default", "light"), name: "color.status.info.subtle" });
  assert.deepEqual(planted.map((x) => x.holds), [false]);
});

test("a fill pairs with its text and states the step promise", () => {
  const scheme = loadScheme("accessible-first", roots);
  const index = indexesOf(scheme)("default", "light");
  const checks = connectionChecks(scheme, g, connection("fill-pairs-with-text"), { brand: "default", mode: "light", index, name: "color.action.primary.@" });
  assert.ok(checks.length > 0);
  assert.ok(checks.every((x) => x.holds));
  assert.ok(checks.some((x) => /steps apart promise/.test(x.says)), checks.map((x) => x.says).join("\n"));
});

test("the surface ladder and the danger rule live in the connections, and the gate reads them", () => {
  assert.equal(g.semantics.danger_apart, undefined);
  assert.deepEqual(connection("surface-ladder").tokens, ["color.surface.sunken", "color.surface.default", "color.surface.raised", "color.surface.floating"]);
  assert.equal(connection("danger-apart-from-primary").min_delta_e, 10);
});

test("each color role names jobs its mapping entry has", () => {
  for (const entry of g.mapping.filter((e) => e.roles))
    for (const r of entry.roles) for (const j of r.jobs) assert.ok(entry.jobs.some((x) => x.id === j), `${entry.property} ${r.id} ${j}`);
  assert.equal(roleOf(g, "color.action.primary").role.id, "action-fill");
  assert.equal(roleOf(g, "color.action.primary.hover").role.id, "hover");
  assert.equal(roleOf(g, "space.gap.sm"), null);
});

test("the reason is written from the fields, in the reason form, and cites the deciding answers", () => {
  const scheme = loadScheme("accessible-first", roots);
  const why = colorReason(scheme, g, "color.category.4.@", { value: "amber.light.600" });
  assert.match(why, /^We use amber\.light\.600 for a category mark in order to tell series and tags apart/);
  assert.match(why, /The category color does this by following brand hue/);
  assert.match(why, /\(color\.roles\)\.$/);
  assert.deepEqual(formGaps(g, "color.category.4", why, ["color.roles"]), []);
});

test("the decision tree reads role → property → rule → connections → value → reason", () => {
  const scheme = loadScheme("accessible-first", roots);
  const tree = decisionTree(scheme, g, "color.action.primary.hover", { mode: "dark" });
  const levels = tree.map((n) => n.level).filter((l) => ["role", "property", "rule", "connection", "value", "reason"].includes(l));
  assert.deepEqual([...new Set(levels)], ["role", "property", "rule", "connection", "value", "reason"]);
  assert.equal(tree.find((n) => n.level === "rule").says, "hover sits 1 step from its @");
  assert.ok(tree.some((n) => n.level === "connection" && n.name === "hover-from-fill" && n.holds));
  assert.deepEqual(missingLinks(scheme, g, "color.action.primary.hover", tree), []);
});

test("a color token with no role misses its links", () => {
  const scheme = loadScheme("accessible-first", roots);
  const bare = { ...g, mapping: g.mapping.map(({ roles, ...e }) => e) };
  const tree = decisionTree(scheme, bare, "color.action.primary.hover");
  assert.deepEqual(missingLinks(scheme, bare, "color.action.primary.hover", tree), ["role", "job", "rule", "value"]);
});
