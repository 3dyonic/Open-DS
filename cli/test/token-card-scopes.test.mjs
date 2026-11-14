// The Token map's scope cards: each answers its scope's question with a measure against the scheme's own
// rule or floor, from data only. Run on the real schemes, so the numbers are the ones the docs show.
import { test } from "node:test";
import assert from "node:assert/strict";
import { lineBoxPx, scaleHint, shadowParts } from "../src/token-card-scopes.mjs";
import { tokenMapView } from "../src/token-map-view.mjs";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";

const roots = assetRoots();
const g = grammar(roots);
const glyph = { name: "Filter", nodes: [["path", { d: "M3 3h18" }]] };
const view = (id, scheme = loadScheme(id, roots)) => tokenMapView({ scheme, grammar: g, glyph });
const cf = view("content-first");
const dd = view("dense-data");
const card = (map, id, mode = "light") => map.shared.decisions[id].cards[mode];
const rows = (c, ask) => c.sections.find((s) => s.ask === ask).rows;
const said = (c, ask) => rows(c, ask).flatMap((r) => [...(r.pills ?? []), r.say, r.text].filter(Boolean));

test("a scale hint marks one place, and a scale of one says it is the only one", () => {
  const h = scaleHint([14, 12, 16, 20, 24], 14, { word: "size" });
  assert.deepEqual([h.n, h.of, h.say], [2, 5, "A middle size"]);
  assert.equal(h.ticks.length, 5);
  assert.deepEqual(scaleHint([1.5], 1.5, { word: "stroke width" }), {
    ask: "Where it sits",
    ticks: [50],
    at: 50,
    mark: null,
    n: 1,
    of: 1,
    say: "The only stroke width",
  });
  assert.equal(scaleHint([8, 12], 10, { word: "corner" }), null);
});

test("a line height is a length or a ratio of the size; a shadow reads as its parts", () => {
  assert.equal(lineBoxPx("1.25rem", 14), 20);
  assert.equal(lineBoxPx("1.65", 18), 29.7);
  assert.deepEqual(shadowParts("0px 12px 32px, #00000080"), {
    x: 0,
    y: 12,
    blur: 32,
    spread: 0,
    color: "#00000080",
    alpha: 50,
  });
  assert.equal(shadowParts("none"), null);
});

test("type: small body text meets the 12px desk floor; large body text says the answer", () => {
  const dense = rows(card(dd, "type.body.font-size"), "Can you read it?");
  assert.deepEqual(dense[0], { type: "meter", value: 14, floor: 12, max: 24, text: "14px" });
  assert.equal(card(dd, "type.body.font-size").hint.ask, "What do you read first?");
  const content = card(cf, "type.body.font-size");
  assert.deepEqual(said(content, "Can you read it?"), ["Large, by your answer: long reading stays effortless."]);
  assert.equal(content.sections[0].specimen.draw.line, 29.7);
  assert.deepEqual(
    content.shared.map((n) => n.token),
    ["type.data.font-size"],
  );
});

test("spacing: a gap is measured against the scheme's own floor; a pair with no rule says so", () => {
  assert.deepEqual(said(card(dd, "space.gap.section"), "What belongs together?").slice(0, 3), [
    "24px ÷ 16px",
    "1.5×",
    "Holds at the floor: a section reads as a larger break.",
  ]);
  assert.deepEqual(said(card(cf, "space.gap.default"), "What belongs together?").slice(0, 3), [
    "32px ÷ 16px",
    "2×",
    "Holds at the floor: groups read as separate.",
  ]);
  assert.ok(
    said(card(cf, "space.gap.tight"), "What belongs together?").includes(
      "No rule in the scheme sets a floor for this pair.",
    ),
  );
  assert.deepEqual(card(dd, "space.gap.tight").where, ["Inside one component", "Along one line", "1 × 4px base"]);
  const control = card(cf, "size.control.default");
  assert.deepEqual(rows(control, "Can you hit it?")[0], { type: "meter", value: 48, floor: 24, max: 56, text: "48px" });
});

test("shape: a container's corner nests by its padding, and the ring runs parallel to the control", () => {
  assert.ok(said(card(cf, "radius.surface"), "What kind of thing has this corner?").includes("12 − 4 = 8px inside"));
  assert.deepEqual(
    rows(card(cf, "radius.control"), "What kind of thing has this corner?")[0].kinds.map((k) => k.on),
    [true, false, false],
  );
  assert.ok(said(card(cf, "focus.ring.width"), "Where is the keyboard?").includes("8 + 2 = 10px ring corner"));
  const cases = rows(card(dd, "border-width.default"), "Where does one region end?")[0].cases;
  assert.deepEqual(
    cases.map((c) => c.here),
    [true, false, false],
  );
});

