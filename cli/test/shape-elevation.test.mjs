// OD-294: corners, lines and shadows follow their decisions and relations, and their reasons say why.
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRelations, contrast, elevationScale, px, shadeContrast } from "../src/shape-elevation.mjs";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import { formGaps, formReasons, traceScheme, writtenReasons } from "../src/trace.mjs";

const g = grammar();
const found = (r, token) => r.results.filter((x) => x.token === token && !x.holds);

test("px reads rem, px and a pill", () => {
  assert.equal(px("0.25rem"), 4);
  assert.equal(px("2px"), 2);
  assert.equal(px("calc(infinity * 1px)"), Infinity);
  assert.equal(px("50%"), null);
});

test("contrast and shade contrast follow WCAG", () => {
  assert.equal(contrast("#000000", "#FFFFFF"), 21);
  assert.equal(shadeContrast("#00000000", "#FFFFFF"), 1);
  assert.ok(shadeContrast("#00000080", "#FFFFFF") > 1.5);
});

test("every scheme records every relation the grammar names, and each record can be checked", () => {
  for (const id of schemeIds()) assert.deepEqual(checkRelations(loadScheme(id), g).errors, [], id);
});

test("today the derived corners, the focus ring and the shadow scale hold in every scheme", () => {
  for (const id of schemeIds()) {
    const r = checkRelations(loadScheme(id), g);
    for (const token of ["radius.option", "radius.element", "radius.badge", "border-width.focus", "border-width.focus-offset", "elevation.card", "elevation.overlay"])
      assert.deepEqual(found(r, token), [], `${id} ${token}`);
  }
});

test("an option corner that is not the surface minus the padding is a finding", () => {
  const s = structuredClone(loadScheme("content-first"));
  s.tokens.brands.default.theme.base.radius.option.$value = "{radius.12}";
  const r = checkRelations(s, g);
  assert.equal(found(r, "radius.option").length, 1);
  assert.match(found(r, "radius.option")[0].says, /12px − component\.dropdown-menu\.content\.padding 4px = 8px/);
});

test("a growing box under a pill control takes the box corner, never the pill", () => {
  const s = structuredClone(loadScheme("brand-expressive"));
  s.tokens.brands.default.theme.base.radius.element.$value = "{radius.pill}";
  assert.equal(found(checkRelations(s, g), "radius.element").length, 1);
});

test("a badge with its own corner is a finding where the roles answer gives it none", () => {
  const s = structuredClone(loadScheme("brand-expressive"));
  s.tokens.brands.default.theme.base.radius.badge.$value = "{radius.12}";
  assert.equal(found(checkRelations(s, g), "radius.badge").length, 1);
});

test("a dark shadow that changes shape is a finding", () => {
  const s = structuredClone(loadScheme("multi-brand"));
  s.tokens.brands.aster.theme.dark.elevation.overlay.$value = "{shadow.card-dark}";
  const r = checkRelations(s, g);
  assert.ok(r.results.some((x) => x.token === "elevation.overlay" && x.relation === "dark-shade" && !x.holds && x.brand === "aster"));
});

test("a scheme with no record for a token is an error, not a pass", () => {
  const s = structuredClone(loadScheme("dense-data"));
  s.relations = s.relations.filter((x) => x.token !== "radius.option");
  assert.ok(checkRelations(s, g).errors.some((e) => e.includes("radius.option")));
});

test("the shadow scale gives one shape per values answer and step", () => {
  for (const row of elevationScale(schemeIds().map((id) => loadScheme(id)), g)) assert.ok(row.same, JSON.stringify(row));
});

test("a reason misses each part of the form it lacks", () => {
  const full = "We use a 2px corner for controls in order to show their role. A small radius does this by curving the edge. So rows align, because the product is dense (content.q2).";
  assert.deepEqual(formGaps(g, "radius.control", full, ["content.q2"]), []);
  assert.deepEqual(formGaps(g, "radius.control", full.replace("does this by", "works by"), ["content.q2"]), ["how"]);
  assert.deepEqual(formGaps(g, "radius.control", full, []), ["answer"]);
  assert.deepEqual(formGaps(g, "radius.control", full.replace("show their role", "look right"), ["content.q2"]), ["job name"]);
});

test("every shape and elevation reason, in every brand and mode, is in the form", () => {
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    for (const r of writtenReasons(s).filter((x) => /^(radius|border-width|elevation)\./.test(x.token)))
      assert.deepEqual(formGaps(g, r.token, r.why, r.because), [], `${id} ${r.where} ${r.token}`);
    const off = formReasons(traceScheme(s, g), g).filter((x) => /^(radius|border-width|elevation)\./.test(x.token));
    assert.deepEqual(off, [], id);
  }
});
