// The decision graph (OD-304): every token of a scope on the graph inherits its reason from its role, job,
// property, answers, rule and connections. Run on the real schemes and grammar.
import { test } from "node:test";
import assert from "node:assert/strict";
import { graphReason, connectionChecks, connectionGaps, creatorsOf, evaluateConnections, indexesOf, madeBy, missingLinks, roleOf, storedNumberGaps } from "../src/decision-graph.mjs";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { flatTokens } from "../src/tokens.mjs";
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
  const why = graphReason(scheme, g, "color.category.4.@", { value: "amber.light.600" });
  assert.match(why, /^We use amber\.light\.600 for a category mark in order to tell series and tags apart/);
  assert.match(why, /The category color does this by following brand hue/);
  assert.match(why, /because a design system ships category colors for the products teams build, and the scheme answers/);
  assert.match(why, /\(color\.definition, accessibility\.definition\)\.$/);
  // "Brand primary, surface, text and status" does not name category, so the reason does not cite it.
  assert.doesNotMatch(why, /color\.roles/);
  assert.deepEqual(formGaps(g, "color.category.4", why, ["color.definition", "accessibility.definition"]), []);
});

test("an answer creates a role: the reason cites the option that brings it", () => {
  const scheme = loadScheme("dense-data", roots);
  assert.deepEqual(madeBy(scheme, g, "color.text.primary"), { role: "page-text", always: null, creates: ["color.roles"], shapes: ["color.definition"] });
  assert.deepEqual(madeBy(scheme, g, "color.surface.scrim").creates, ["elevation.lands"]);
  const why = graphReason(scheme, g, "color.text.primary", { value: "gray.light.900" });
  assert.match(why, /"Brand primary, surface, text and status" to "Which color roles does it need\?"/);
});

test("every shipped color role is created by a chosen option or always-on; removing a creates entry breaks it", () => {
  // The roles a scheme ships: those of its own tokens. hero-time ships only where a scheme has a hero duration.
  const ships = (scheme) => new Set(flatTokens(scheme.tokens.semantic).map(([p]) => roleOf(g, p)?.role.id).filter(Boolean));
  const shipped = (scheme, grammarOf) =>
    [...ships(scheme)].filter((id) => {
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

// Type (OD-304): one base and one ratio make every size; a line kind makes every line height.
const typeGaps = (scheme, id) => connectionGaps(evaluateConnections(scheme, g)).filter((x) => x.connection === id);

test("a type token reads role → property → rule → connections → value → reason, with the job of its line kind", () => {
  const scheme = loadScheme("accessible-first", roots);
  const tree = decisionTree(scheme, g, "type.body.line-height");
  const levels = tree.map((n) => n.level).filter((l) => ["role", "property", "rule", "connection", "value", "reason"].includes(l));
  assert.deepEqual([...new Set(levels)], ["role", "property", "rule", "connection", "value", "reason"]);
  const role = tree.find((n) => n.level === "role");
  assert.equal(role.name, "text-lines");
  assert.deepEqual(role.creates, ["typography.definition"]);
  assert.ok(!role.jobs.some((j) => j.id === "tight"), "an open line shows no tight job");
  assert.deepEqual(tree.filter((n) => n.level === "connection").map((n) => [n.name, n.holds]), [["line-from-kind", true], ["line-kinds-apart", true]]);
  assert.match(tree.find((n) => n.level === "reason").says, /^We use 1\.6 for lines of running text in order to .* does this by return sweep: .*\(typography\.definition\)\.$/);
  assert.deepEqual(formGaps(g, "type.body.line-height", tree.find((n) => n.level === "reason").says, ["typography.definition"]).filter((x) => x !== "job name"), []);
  assert.deepEqual(missingLinks(scheme, g, "type.body.line-height", tree), []);
});

test("a label line in a tight scheme leads with the tight job; in accessible-first it is open", () => {
  const tight = decisionTree(loadScheme("dense-data", roots), g, "type.label.line-height").find((n) => n.level === "role");
  const open = decisionTree(loadScheme("accessible-first", roots), g, "type.label.line-height").find((n) => n.level === "role");
  assert.equal(tight.jobs[0].id, "tight");
  assert.equal(open.jobs[0].id, "open");
});

test("each size comes from base × ratio^step; a planted size breaks it", () => {
  assert.deepEqual(typeGaps(loadScheme("accessible-first", roots), "size-from-scale"), []);
  const scheme = structuredClone(loadScheme("accessible-first", roots));
  scheme.tokens.semantic.type.body["font-size"].$value = "{font.size.16}";
  assert.deepEqual(typeGaps(scheme, "size-from-scale").map((x) => x.tokens), [["type.body.font-size"]]);
});

test("adjacent sizes stay one ratio step apart and line kinds 0.2 apart: today's gaps are the baseline's", () => {
  assert.deepEqual(typeGaps(loadScheme("dense-data", roots), "line-kinds-apart").map((x) => x.tokens), [["tight lines", "snug lines"], ["snug lines", "open lines"]]);
  assert.deepEqual(typeGaps(loadScheme("content-first", roots), "sizes-step-apart"), []);
  assert.deepEqual(typeGaps(loadScheme("accessible-first", roots), "sizes-step-apart").map((x) => x.tokens), [
    ["type.body.font-size", "type.caption.font-size"],
    ["type.title.font-size", "type.heading.font-size"],
  ]);
});

test("a control holds one label line; a planted short control breaks it", () => {
  assert.deepEqual(typeGaps(loadScheme("dense-data", roots), "label-pairs-with-control"), []);
  const scheme = structuredClone(loadScheme("dense-data", roots));
  scheme.tokens.semantic.size.control.compact.$value = "{size.12}";
  scheme.tokens.primitive.size["12"] ??= { $type: "dimension", $value: "0.75rem" };
  assert.deepEqual(typeGaps(scheme, "label-pairs-with-control").map((x) => x.tokens), [["size.control.compact", "type.label"]]);
});

test("every shipped type role is created by a chosen option or always-on", () => {
  const scheme = loadScheme("dense-data", roots);
  assert.deepEqual(creatorsOf(scheme, g, "heading-lines"), ["typography.definition"]);
  assert.deepEqual(creatorsOf(scheme, g, "typeface"), ["brand.q3"]);
  assert.deepEqual(madeBy(scheme, g, "type.data.font-size"), { role: "data-size", always: "every scheme's type scale gives values a step of their own", creates: [], shapes: ["typography.roles", "typography.count", "typography.values"] });
});

// A snug line (OD-304): a snug token leads with the snug job, not the open one.
test("a snug caption line leads with the snug job", () => {
  const role = decisionTree(loadScheme("dense-data", roots), g, "type.caption.line-height").find((n) => n.level === "role");
  assert.equal(role.jobs[0].id, "snug");
  assert.ok(!role.jobs.some((j) => j.id === "open" || j.id === "tight"));
});

// Spacing (OD-304): one base and a multiple per use case make every gap and inset; the map's rhythm makes each step.
const gapsOf = (scheme, id) => connectionGaps(evaluateConnections(scheme, g)).filter((x) => x.connection === id);

test("a spacing token reads role → property → rule → connections → value → reason", () => {
  const scheme = loadScheme("dense-data", roots);
  const tree = decisionTree(scheme, g, "space.gap.group");
  const levels = tree.map((n) => n.level).filter((l) => ["role", "property", "rule", "connection", "value", "reason"].includes(l));
  assert.deepEqual([...new Set(levels)], ["role", "property", "rule", "connection", "value", "reason"]);
  assert.equal(tree.find((n) => n.level === "role").name, "group-gap");
  assert.deepEqual(tree.filter((n) => n.level === "connection").map((n) => [n.name, n.holds]), [
    ["space-from-base", true],
    ["group-gap-apart", true],
    ["section-gap-apart", true],
    ["group-gap-past-padding", true],
  ]);
  assert.match(tree.find((n) => n.level === "reason").says, /^We use 16px \(1rem\) for the gap between groups in order to .* does this by proximity: .*\(spacing\.roles, .*\)\.$/);
  assert.deepEqual(missingLinks(scheme, g, "space.gap.group", tree), []);
});

test("each gap and inset comes from the spacing base, each map step from the rhythm; planted values break them", () => {
  for (const id of SCHEMES) {
    const scheme = loadScheme(id, roots);
    for (const c of ["space-from-base", "map-from-rhythm", "group-gap-apart", "section-gap-apart", "group-gap-past-padding", "row-from-control", "row-holds-target"])
      assert.deepEqual(gapsOf(scheme, c), [], `${id} ${c}`);
  }
  const scheme = structuredClone(loadScheme("dense-data", roots));
  scheme.tokens.semantic.space.gap.group.$value = "{space.12}";
  scheme.tokens.semantic["component-spacing-map"].x3.$value = "{space.16}";
  assert.deepEqual(gapsOf(scheme, "space-from-base").map((x) => x.tokens), [["space.gap.group"]]);
  assert.deepEqual(gapsOf(scheme, "group-gap-apart").map((x) => x.says), ["space.gap.group is 12px; 2 × space.gap.default 8px is 16px"]);
  assert.deepEqual(gapsOf(scheme, "group-gap-past-padding").map((x) => x.tokens), [["space.gap.group", "space.inset.container"]]);
  assert.deepEqual(gapsOf(scheme, "map-from-rhythm").map((x) => x.tokens), [["component-spacing-map.x3"]]);
});

test("a row is one default control tall and at least the smallest target; a planted row breaks both", () => {
  const scheme = structuredClone(loadScheme("dense-data", roots));
  scheme.tokens.semantic.size.row.$value = "{size.16}";
  assert.deepEqual(gapsOf(scheme, "row-from-control").map((x) => x.says), ["size.row is 16px; size.control.default is 32px"]);
  assert.deepEqual(gapsOf(scheme, "row-holds-target").map((x) => x.says), ["size.row is 16px; size.hit-area is 24px"]);
});

// Shape (OD-304): a decided corner's relation is its rule; a derived corner's relation is a connection.
test("a decided corner reads its relation as the rule; a derived corner comes from it", () => {
  const scheme = loadScheme("content-first", roots);
  const control = decisionTree(scheme, g, "radius.control");
  assert.deepEqual(control.filter((n) => n.level === "rule").map((n) => [n.name, n.holds]), [["control-corner", true]]);
  const element = decisionTree(scheme, g, "radius.element");
  assert.deepEqual(element.filter((n) => n.level === "connection").map((n) => [n.name, n.kind, n.holds]), [["element-box", "comes-from", true]]);
  assert.match(element.find((n) => n.level === "reason").says, /^We use 8px \(0\.5rem\) for the corner of a box inside a control in order to /);
  assert.deepEqual(missingLinks(scheme, g, "radius.element", element), []);
  const broken = structuredClone(scheme);
  broken.tokens.brands.default.theme.base.radius.element.$value = "{radius.12}";
  assert.equal(decisionTree(broken, g, "radius.element").find((n) => n.name === "element-box").holds, false);
});

test("the badge corner ships everywhere: always-on, and created where the roles answer names badges", () => {
  assert.deepEqual(madeBy(loadScheme("dense-data", roots), g, "radius.badge").creates, ["shape.roles"]);
  const expressive = madeBy(loadScheme("brand-expressive", roots), g, "radius.badge");
  assert.deepEqual(expressive.creates, []);
  assert.match(expressive.always, /every scheme ships badges/);
});

// Elevation (OD-304): the shadow scale and the dark shade are the scope's relations; the default line is its rule.
test("a shadow reads role → property → connections → value → reason; a planted flat overlay breaks the layer step", () => {
  const scheme = loadScheme("brand-expressive", roots);
  const tree = decisionTree(scheme, g, "elevation.overlay");
  assert.equal(tree.find((n) => n.level === "role").name, "overlay-shadow");
  assert.deepEqual(tree.filter((n) => n.level === "connection").map((n) => [n.name, n.kind, n.holds]), [["layer-step", "stays-apart", true], ["dark-shade", "comes-from", true]]);
  assert.equal(tree.find((n) => n.level === "value").says, "0px 24px 48px 0px #1F141133");
  assert.deepEqual(missingLinks(scheme, g, "elevation.overlay", tree), []);
  const low = structuredClone(scheme);
  low.tokens.brands.default.theme.light.elevation.overlay.$value = "{shadow.none}";
  assert.equal(decisionTree(low, g, "elevation.overlay").find((n) => n.name === "layer-step").holds, false);
});

// OD-300: the edge rule gives each only cue the strong border, so the default line's rule holds; with
// shape.count at two, Multi-brand's corner count breaks only in Birch, which waits for the owner.
test("the default line's rule holds: every control's only edge is 3:1 or more in every scheme", () => {
  const tree = decisionTree(loadScheme("dense-data", roots), g, "border-width.default");
  const rule = tree.find((n) => n.level === "rule" && n.name === "default-line");
  assert.equal(rule.holds, true);
  for (const id of SCHEMES) assert.equal(gapsOf(loadScheme(id, roots), "default-line").length, 0, id);
  assert.deepEqual(gapsOf(loadScheme("multi-brand", roots), "surface-corner").map((x) => x.themes), [["birch/light", "birch/dark"]]);
});

// Motion (OD-304): the family picks a duration's job and sets its limits; an exit takes the feedback time.
test("a motion token's family picks its job and its rule", () => {
  const expressive = decisionTree(loadScheme("brand-expressive", roots), g, "motion.duration.panels");
  const productive = decisionTree(loadScheme("dense-data", roots), g, "motion.duration.panels");
  assert.deepEqual(expressive.find((n) => n.level === "role").jobs.map((j) => j.id), ["expressive"]);
  assert.deepEqual(productive.find((n) => n.level === "role").jobs.map((j) => j.id), ["productive"]);
  assert.equal(productive.find((n) => n.level === "rule").says, "the productive family: motion.duration.panels takes at most 300ms");
  const easing = decisionTree(loadScheme("dense-data", roots), g, "motion.easing.enter");
  assert.equal(easing.find((n) => n.level === "value").says, "cubic-bezier(0.2, 0, 0, 1)");
  assert.deepEqual(easing.filter((n) => n.level === "connection").map((n) => [n.name, n.holds]), [["enter-from-standard", true]]);
  assert.deepEqual(missingLinks(loadScheme("dense-data", roots), g, "motion.easing.enter", easing), []);
});

test("motion connections hold today; a planted slow feedback breaks its family and the exit's chain", () => {
  for (const id of SCHEMES) for (const c of ["exit-from-feedback", "enter-from-standard", "panels-after-feedback", "hero-after-panels", "motion-family"]) assert.deepEqual(gapsOf(loadScheme(id, roots), c), [], `${id} ${c}`);
  const scheme = structuredClone(loadScheme("dense-data", roots));
  scheme.tokens.semantic.motion.duration.feedback.$value = "{duration.relaxed}";
  scheme.tokens.primitive.duration.relaxed ??= { $type: "duration", $value: "400ms" };
  scheme.tokens.semantic.motion.duration.exit.$value = "{duration.fast}";
  assert.deepEqual(gapsOf(scheme, "motion-family").map((x) => x.tokens), [["motion.duration.feedback"]]);
  assert.deepEqual(gapsOf(scheme, "exit-from-feedback").map((x) => x.tokens), [["motion.duration.exit", "motion.duration.feedback"]]);
  assert.deepEqual(gapsOf(scheme, "panels-after-feedback").map((x) => x.tokens), [["motion.duration.panels", "motion.duration.feedback"]]);
});

// Accessibility (OD-304): the control scale makes each control height; the focus width comes from the default line.
test("each control height comes from the control scale and holds a label line; a planted compact control breaks the scale", () => {
  const scheme = loadScheme("multi-brand", roots);
  const tree = decisionTree(scheme, g, "size.control.compact");
  assert.equal(tree.find((n) => n.level === "role").name, "compact-control");
  assert.deepEqual(tree.filter((n) => n.level === "connection").map((n) => [n.name, n.holds]), [["label-pairs-with-control", true], ["controls-from-scale", true]]);
  assert.deepEqual(missingLinks(scheme, g, "size.control.compact", tree), []);
  for (const id of SCHEMES) assert.deepEqual(gapsOf(loadScheme(id, roots), "controls-from-scale"), [], id);
  const planted = structuredClone(loadScheme("dense-data", roots));
  planted.tokens.semantic.size.control.compact.$value = "{size.32}";
  assert.deepEqual(gapsOf(planted, "controls-from-scale").map((x) => x.says), ["size.control.compact is 32px; the 32px default − 1 × the 8px step gives 24px"]);
});

test("the focus width comes from the default line and the gap is the ring's fixed rule; a planted thin ring breaks it", () => {
  const scheme = loadScheme("accessible-first", roots);
  const width = decisionTree(scheme, g, "focus.ring.width");
  assert.deepEqual(width.filter((n) => n.level === "connection").map((n) => [n.name, n.kind, n.holds]), [["focus-heavier", "comes-from", true]]);
  const gap = decisionTree(scheme, g, "focus.ring.offset");
  assert.deepEqual(gap.filter((n) => n.level === "rule").map((n) => [n.name, n.holds]), [["focus-gap", true]]);
  const thin = structuredClone(scheme);
  thin.tokens.semantic.focus.ring.width.$value = "{border-width.2}";
  assert.equal(decisionTree(thin, g, "focus.ring.width").find((n) => n.name === "focus-heavier").holds, false);
});

// Iconography (OD-304): an icon is one label line tall; its stroke renders at least 1px at its size.
test("an icon holds a label line in three schemes and its stroke renders; a planted thin stroke breaks it", () => {
  assert.deepEqual(
    SCHEMES.flatMap((id) => gapsOf(loadScheme(id, roots), "icon-matches-label").map((x) => `${id}: ${x.says}`)),
    ["content-first: size.icon is 16px for the 23.2px label line", "accessible-first: size.icon is 20px for the 30.4px label line"],
  );
  for (const id of SCHEMES) assert.deepEqual(gapsOf(loadScheme(id, roots), "stroke-renders"), [], id);
  const scheme = structuredClone(loadScheme("dense-data", roots));
  scheme.tokens.primitive["stroke-width"]["1"] ??= { $type: "number", $value: 1 };
  scheme.tokens.semantic.icon["stroke-width"].$value = "{stroke-width.1}";
  assert.deepEqual(gapsOf(scheme, "stroke-renders").map((x) => x.says), ["icon.stroke-width 1 on a 16px icon renders 0.67px (1 × 16 ÷ 24); needs at least 1px"]);
  const tree = decisionTree(loadScheme("dense-data", roots), g, "size.icon");
  assert.deepEqual(tree.filter((n) => n.level === "connection").map((n) => n.name), ["icon-matches-label", "stroke-renders"]);
  assert.deepEqual(missingLinks(loadScheme("dense-data", roots), g, "size.icon", tree), []);
});

// A stored reason names the numbers its data has (OD-304).
test("stored reasons name the sizes, grids and line kinds their tokens have; a planted old number is found", () => {
  for (const id of SCHEMES) assert.deepEqual(storedNumberGaps(loadScheme(id, roots)), [], id);
  const scheme = structuredClone(loadScheme("dense-data", roots));
  const line = scheme.tokens.semantic.type.caption["line-height"].$extensions["open-ds"];
  line.why = line.why.replace("the snug step", "the open step").replace("2px grid", "4px grid");
  const gap = scheme.tokens.semantic.space.gap.tight.$extensions["open-ds"];
  gap.why = gap.why.replace("We use 4px", "We use 6px");
  assert.deepEqual(storedNumberGaps(scheme), [
    { token: "space.gap.tight", where: "own", says: "it leads with 6px, the token is 4px" },
    { token: "type.caption.line-height", where: "own", says: "the 4px grid: caption snaps to the 2px grid; the open kind: caption lines are snug" },
  ]);
});
