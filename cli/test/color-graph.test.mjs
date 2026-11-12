// The color decision graph (OD-304): every color token inherits its reason from its role, job,
// property, answers, slot and connections. Run on the real schemes and grammar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { colorReason, connectionChecks, connectionGaps, creatorsOf, evaluateConnections, indexesOf, madeBy, missingLinks, roleOf } from "../src/color-graph.mjs";
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

test("the reason is written from the fields, in the reason form, and cites the answers that shape an always-on role", () => {
  const scheme = loadScheme("accessible-first", roots);
  const why = colorReason(scheme, g, "color.category.4.@", { value: "amber.light.600" });
  assert.match(why, /^We use amber\.light\.600 for a category mark in order to tell series and tags apart/);
  assert.match(why, /The category color does this by following brand hue/);
  assert.match(why, /because a design system ships category colors for the products teams build, and the scheme answers/);
  assert.match(why, /\(color\.definition, accessibility\.definition\)\.$/);
  // "Surface, text, action and status" does not name category, so the reason does not cite it.
  assert.doesNotMatch(why, /color\.roles/);
  assert.deepEqual(formGaps(g, "color.category.4", why, ["color.definition", "accessibility.definition"]), []);
});

test("an answer creates a role: the reason cites the option that brings it", () => {
  const scheme = loadScheme("dense-data", roots);
  assert.deepEqual(madeBy(scheme, g, "color.text.primary"), { role: "page-text", always: null, creates: ["color.roles"], shapes: ["color.definition"] });
  assert.deepEqual(madeBy(scheme, g, "color.surface.scrim").creates, ["elevation.lands"]);
  const why = colorReason(scheme, g, "color.text.primary", { value: "gray.light.900" });
  assert.match(why, /"Surface, text, action and status" to "Which color roles does it need\?"/);
});

test("every shipped color role is created by a chosen option or always-on; removing a creates entry breaks it", () => {
  const shipped = (scheme, grammarOf) =>
    [...new Set(g.mapping.flatMap((e) => (e.roles ?? []).map((r) => r.id)))].filter((id) => {
      const role = grammarOf.mapping.flatMap((e) => e.roles ?? []).find((r) => r.id === id);
      return !role.always_on && !creatorsOf(scheme, grammarOf, id).length;
    });
  for (const id of SCHEMES) assert.deepEqual(shipped(loadScheme(id, roots), g), [], id);
  const planted = structuredClone(g);
  const roles = planted.scopes.flatMap((s) => s.questions).find((q) => q.id === "elevation.lands");
  for (const o of roles.options) o.creates = [];
  assert.deepEqual(shipped(loadScheme("dense-data", roots), planted), ["scrim"]);
});

test("a category tint shows its pair and the stays-apart of its @", () => {
  const scheme = loadScheme("accessible-first", roots);
  const tree = decisionTree(scheme, g, "color.category.4.subtle", { mode: "light" });
  const links = tree.filter((n) => n.level === "connection");
  assert.deepEqual(links.map((n) => n.name), ["subtle-from-hue", "fill-pairs-with-text", "category-apart-from-status"]);
  const pair = links[1].checks;
  assert.deepEqual(pair.map((x) => x.tokens), [["color.text.primary", "color.category.4.subtle"]]);
  assert.match(pair[0].says, /800 steps apart promise 7:1/);
  const apart = links[2];
  assert.equal(apart.via, "color.category.4");
  assert.deepEqual(apart.checks.filter((x) => !x.holds).map((x) => [x.tokens, x.hue]), [[["color.category.4", "color.status.warning"], "amber"]]);
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
