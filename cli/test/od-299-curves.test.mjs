// OD-299: the contrast-graded curve, its flag, the held steps, the difference check and the docs page.
import assert from "node:assert/strict";
import { test } from "node:test";
import { EASING_BY_STEPS, GRADED_STEPS, curveOf, differenceThreshold, stepsAnswer } from "../src/color-steps.mjs";
import { colorScalePage, primaryScale, scaleFacts, stepsChain } from "../src/color-scale-doc.mjs";
import { contrast, easedPosition, gradedDarkScale, gradedLightScale, lch, lightScale, luminance, scale, STEPS } from "../src/ramps.mjs";
import { closePairs, onSurface, smallestDistance } from "../src/quality/difference.mjs";
import { stepsToHold } from "../src/quality/curve-shift.mjs";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";

const KEY = "#0B4FC0";
const z = (hex) => Math.log(luminance(hex) + 0.05);

test("the curve follows the flag", () => {
  const scheme = { answers: [{ question: "color.definition.steps", option: "even-ease" }] };
  assert.equal(curveOf(scheme, false), null);
  assert.deepEqual(curveOf(scheme, true), { easing: 0.5 });
  assert.deepEqual(curveOf(scheme), GRADED_STEPS ? { easing: 0.5 } : null, "the default is the flag");
  assert.equal(curveOf({ answers: [] }, true), null, "no answer, no graded curve");
});

test("each scheme answers both color questions, with a strength and a threshold", () => {
  const seen = new Set();
  for (const id of schemeIds()) {
    const s = loadScheme(id);
    assert.ok(stepsAnswer(s), `${id} answers color.definition.steps`);
    assert.ok(differenceThreshold(s) > 0, `${id} answers color.values.difference`);
    seen.add(stepsAnswer(s).easing);
  }
  assert.deepEqual([...seen].sort(), [0, 0.25, 0.4, 0.5, 0.6], "the owner's five strengths, one per scheme");
});

test("the graded light scale keeps 50, the key at 600 and 950, and is ordered", () => {
  const shared = lightScale(KEY);
  for (const easing of Object.values(EASING_BY_STEPS)) {
    const row = gradedLightScale(KEY, easing);
    assert.equal(row["600"], KEY);
    assert.equal(row["50"], shared["50"]);
    assert.equal(row["950"], shared["950"]);
    for (let i = 1; i < STEPS.length; i++) assert.ok(lch(row[STEPS[i]])[0] < lch(row[STEPS[i - 1]])[0], `easing ${easing}: ${STEPS[i]} is darker than ${STEPS[i - 1]}`);
  }
});

test("easing 0 is even in ln(luminance + 0.05): equal steps give equal contrast", () => {
  const row = gradedLightScale(KEY, 0);
  const rate = (a, b) => (z(row[a]) - z(row[b])) / (+b - +a);
  assert.ok(Math.abs(rate("100", "200") - rate("300", "400")) < 0.0005, "the same rate above the key");
  assert.ok(Math.abs(rate("700", "800") - rate("800", "900")) < 0.0005, "the same rate below the key");
});

test("a stronger ease holds the ends closer and opens the middle", () => {
  assert.equal(easedPosition(50, 0.6), 0);
  assert.equal(easedPosition(950, 0.6), 1);
  const gap = (easing, a, b) => easedPosition(b, easing) - easedPosition(a, easing);
  assert.ok(gap(0.6, 50, 100) < gap(0, 50, 100));
  assert.ok(gap(0.6, 500, 550) > gap(0, 500, 550));
});

test("the dark scale keeps its anchors and climbs from the canvas", () => {
  const row = gradedDarkScale("#8AB4F8", "#0F1115", 0.4);
  assert.equal(row["600"], "#8AB4F8");
  for (let i = 1; i < STEPS.length; i++) assert.ok(luminance(row[STEPS[i]]) > luminance(row[STEPS[i - 1]]));
});

test("a held step keeps the shared curve; the shared curve ignores held", () => {
  const spec = { key: KEY, held: { 200: "over-limit", 100: "order" } };
  const shared = scale({ key: KEY }, "light");
  const graded = scale(spec, "light", null, { easing: 0.4 });
  assert.equal(graded["200"], shared["200"]);
  assert.equal(graded["100"], shared["100"]);
  assert.notEqual(graded["400"], shared["400"]);
  assert.deepEqual(scale(spec, "light"), shared);
});

test("a scheme loads on the curve the flag names, and the two curves differ", () => {
  for (const id of schemeIds()) {
    const colors = (graded) => JSON.stringify(loadScheme(id, undefined, { graded }).tokens.primitive.color);
    assert.equal(JSON.stringify(loadScheme(id).tokens.primitive.color), colors(GRADED_STEPS), id);
    assert.notEqual(colors(true), colors(false), `${id}: the graded curve moves some step`);
  }
});

test("the trace links a color on a graded step to the steps answer, only with the curve on", async () => {
  const { traceScheme } = await import("../src/trace.mjs");
  const g = grammar();
  const linked = (graded) => {
    const s = loadScheme("content-first", undefined, { graded });
    // traceScheme reads the flag through curveOf; a scheme with no steps answer has no curve.
    const scheme = graded ? s : { ...s, answers: s.answers.filter((a) => a.question !== "color.definition.steps") };
    return traceScheme(scheme, g).tokens.filter((t) => t.links.some((l) => l.by === "scale")).map((t) => t.token);
  };
  assert.deepEqual(linked(false), []);
  if (GRADED_STEPS) assert.ok(linked(true).includes("color.action.primary.hover"));
});

test("the difference check lays a translucent mark over its surface and finds close pairs", () => {
  assert.equal(onSurface("#00000080", "#FFFFFF"), "#7F7F7F");
  assert.equal(onSurface("#123456", "#FFFFFF"), "#123456");
  const values = {
    "color.surface.canvas": "#FFFFFF",
    "color.status.danger": "#C42B2B",
    "color.status.warning": "#C42B2C",
    "color.status.info": "#083C93",
    "color.category.1": "#C42B2B",
  };
  const pairs = closePairs(values, 0.05);
  assert.ok(pairs.some((p) => p.vision === "normal" && p.tokens.join() === "color.status.danger,color.status.warning"));
  assert.ok(!pairs.some((p) => p.tokens.includes("color.category.1")), "a category is not compared with a status mark");
  assert.equal(smallestDistance({ a: "#FF0000", b: "#FF0000" }).distance, 0);
});

test("holding runs from a held step to its end of the scale", () => {
  const snap = (row) => ({ schemes: { s: { themes: [], values: {}, chains: {}, palette: { blue: { light: row } }, keys: { blue: { light: { key: KEY } } }, trace: [], decisions: { answers: [] } } } });
  const base = lightScale(KEY);
  const moved = { ...base, 300: "#9DBEF8" };
  const held = stepsToHold(snap(base), snap(moved));
  assert.deepEqual(held, { s: { blue: { light: { 300: "over-limit", 50: "order", 100: "order", 200: "order" } } } });
});

test("How the scale is built: none while the flag is off; with it on, every section from the data", () => {
  const g = grammar();
  const fm = () => "";
  const s = loadScheme("content-first", undefined, { graded: true });
  const stored = {};
  const put = (kind, id, data) => (((stored[kind] ??= {})[id] = data), `::${kind}{id="${id}"}`);
  assert.equal(colorScalePage(s, g, { graded: false, frontMatter: fm, put }), null);
  const page = colorScalePage(s, g, { graded: true, frontMatter: fm, put });
  assert.match(page, /# How the scale is built/);
  for (const kind of ["scale-strip", "scale-curve", "scale-uses", "scale-options"]) assert.match(page, new RegExp(`^::${kind}\\{id="key"\\}$`, "m"));
  assert.match(page, /^:::scale-why\{id="key"\}\nWe use a light ease for the navy scale, to keep the soft page tints close together\. /m);
  assert.match(page, /We chose it because the content is long-form text\.\n:::/);
  assert.doesNotMatch(page, /<[a-z]/, "no HTML in a docs page");
  assert.doesNotMatch(page, /Not used yet|in grey|Part of \[Primitives/, "the grey strip and its lines are gone");
  // The strip and the dots are the built scale; the uses are its real contrast.
  const row = primaryScale(s).row;
  assert.deepEqual(stored["scale-strip"].key.steps.map((x) => x.hex), STEPS.map((st) => row[st]));
  assert.deepEqual(stored["scale-curve"].key.steps.map((x) => x.hex), STEPS.map((st) => row[st]));
  const banner = stored["scale-uses"].key.uses.find((u) => u.use === "banner");
  assert.equal(banner.contrast, Math.round(contrast(row[950], row[100]) * 100) / 100);
  const own = stored["scale-options"].key.options.filter((o) => o.own);
  assert.deepEqual(own.map((o) => o.option), ["light-ease"]);
  assert.deepEqual(own[0].steps.map((x) => x.hex), STEPS.map((st) => gradedLightScale(row[600], 0.25)[st]));
});

test("the chain to the step answer follows each answer's because list, earliest first", () => {
  const g = grammar();
  const chain = stepsChain(loadScheme("brand-expressive"), g).map((x) => x.question);
  assert.deepEqual(chain, ["brand.q1", "color.definition", "color.definition.steps"]);
  const af = stepsChain(loadScheme("accessible-first"), g).map((x) => x.question);
  assert.deepEqual(af, ["people.q1", "color.definition", "color.definition.steps"]);
  const facts = scaleFacts(loadScheme("multi-brand"), g);
  assert.equal(facts.brand, "aster", "Multi-brand shows its first brand");
});

test("How the scale is built reads plainly: a four-sentence reason, a hidden repeat, captions with color names", () => {
  const g = grammar();
  const fm = () => "";
  const page = (id) => {
    const stored = {};
    const put = (kind, key, data) => (((stored[kind] ??= {})[key] = data), `::${kind}{id="${key}"}`);
    return { text: colorScalePage(loadScheme(id, undefined, { graded: true }), g, { graded: true, frontMatter: fm, put }), stored };
  };
  const be = page("brand-expressive");
  assert.match(
    be.text,
    /\nWe use an even ease for the pink scale, to give brand fills many strong steps\. The curve spreads the middle steps apart and keeps the ends close\. So buttons and badges get several rich pinks, while backgrounds stay soft and text stays deep\. We chose it because the brand is bold\.\n/,
  );
  const cards = be.stored["scale-why"].key.steps;
  assert.equal(cards.find((c) => c.question === "brand.q1").repeatsLabel, true, "Bold and confident. only repeats Bold");
  assert.equal(cards.find((c) => c.question === "color.definition").repeatsLabel, false, "Warm neutrals and one vivid ramp. adds a fact");
  assert.deepEqual(
    be.stored["scale-uses"].key.uses.map((u) => u.caption),
    ["White text on pink 600. The main button.", "Pink 600 text on pink 50. A highlight.", "Pink 950 text on pink 100. A banner."],
  );
  assert.equal(be.stored["scale-curve"].key.band.label, "spread wider for brand fills");
  const af = page("accessible-first");
  assert.equal(af.stored["scale-curve"].key.band, undefined, "a linear curve draws no middle band");
  assert.doesNotMatch(af.text, /A thin line links it/);
  for (const id of ["brand-expressive", "accessible-first", "content-first", "dense-data", "multi-brand"]) {
    const reason = page(id).text.match(/^:::scale-why\{id="key"\}\n(.+)\n:::$/m)[1];
    const sentences = reason.split(/(?<=\.) /);
    assert.equal(sentences.length, 4, `${id}: four sentences`);
    for (const s of sentences) assert.ok(s.split(" ").length <= 20, `${id}: "${s}" has more than 20 words`);
    assert.doesNotMatch(reason, /\d+(\.\d+)? times|\*\*/, `${id}: no ratio and no bold`);
  }
});
