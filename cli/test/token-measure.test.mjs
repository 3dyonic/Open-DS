// The token map's measured effect (OD-274): the WCAG 2.x contrast ratio, the tap sizes and the focus
// ring thickness, computed from a primitive's value.
import { test } from "node:test";
import assert from "node:assert/strict";
import { contrastRatio, measure, parseHex, ratioText, toPx } from "../src/token-measure.mjs";

const met = (lines) => Object.fromEntries(lines.filter((l) => l.met !== undefined).map((l) => [l.text, l.met]));

test("the contrast ratio follows the WCAG 2.x relative luminance formula", () => {
  assert.equal(ratioText(contrastRatio("#0B4FC0", "#FFFFFF")), "7.26");
  assert.equal(ratioText(contrastRatio("#73A2F3", "#FFFFFF")), "2.56");
  assert.equal(contrastRatio("#000000", "#FFFFFF"), 21);
  assert.equal(contrastRatio("#FFF", "#FFFFFF"), 1);
  // The order of the two colors does not change the ratio.
  assert.equal(contrastRatio("#FFFFFF", "#0B4FC0"), contrastRatio("#0B4FC0", "#FFFFFF"));
  // A see-through color counts as it shows on the background: fully clear is the background itself.
  assert.equal(contrastRatio("#00000000", "#FFFFFF"), 1);
  assert.equal(contrastRatio("rgb(0 0 0)", "#FFFFFF"), null);
  assert.deepEqual(parseHex("#0B4FC080"), { r: 11, g: 79, b: 192, a: 128 / 255 });
});

test("a ratio just under a level never shows as reaching it", () => {
  assert.equal(ratioText(4.497), "4.49");
  assert.equal(ratioText(4.504), "4.50");
  assert.equal(ratioText(7.2569), "7.26");
});

test("a color shows its lowest and highest contrast on the backgrounds, and the levels it reaches on all", () => {
  const backgrounds = [
    { id: "color.surface.default", value: "#FFFFFF" },
    { id: "color.surface.sunken", value: "#F0F0F0" },
  ];
  const lines = measure({ id: "color.blue.light.600", value: "#0B4FC0", type: "color" }, { backgrounds });
  const low = ratioText(contrastRatio("#0B4FC0", "#F0F0F0"));
  assert.equal(lines[0].text, `${low} to 7.26 on this scheme's backgrounds`);
  assert.match(lines[0].rule, /color\.surface\.default, color\.surface\.sunken/);
  assert.deepEqual(met(lines), {
    "Easy to spot (3:1)": true,
    "Readable text (4.5:1)": true,
    "Readable text, strict (7:1)": false,
  });
  assert.equal(lines.find((l) => l.text === "Readable text (4.5:1)").rule, "WCAG 1.4.3 Contrast (Minimum)");

  const light = measure({ id: "color.blue.light.400", value: "#73A2F3" }, { backgrounds: backgrounds.slice(0, 1) });
  assert.equal(light[0].text, "2.56 on this scheme's backgrounds");
  assert.deepEqual(Object.values(met(light)), [false, false, false]);
});

test("a size compares with the tap sizes, at 16px per rem", () => {
  assert.equal(toPx("3.25rem"), 52);
  assert.equal(toPx("20px"), 20);
  assert.equal(toPx("auto"), null);
  const big = measure({ id: "size.52", value: "3.25rem" });
  assert.equal(big[0].text, "52px at 16px per rem");
  assert.deepEqual(met(big), { "Big enough to tap, basic (24px)": true, "Big enough to tap (44px)": true });
  assert.deepEqual(met(measure({ id: "size.20", value: "1.25rem" })), {
    "Big enough to tap, basic (24px)": false,
    "Big enough to tap (44px)": false,
  });
  assert.deepEqual(met(measure({ id: "size.28", value: "1.75rem" })), {
    "Big enough to tap, basic (24px)": true,
    "Big enough to tap (44px)": false,
  });
});

test("a border width compares with the focus ring thickness", () => {
  assert.deepEqual(met(measure({ id: "border-width.2", value: "2px" })), {
    "Thick enough for a focus ring (2px)": true,
  });
  const thin = measure({ id: "border-width.1", value: "1px" });
  assert.deepEqual(met(thin), { "Thick enough for a focus ring (2px)": false });
  assert.equal(thin[0].rule, "WCAG 2.4.13 Focus Appearance");
});

test("every other kind shows its value only", () => {
  for (const token of [
    { id: "space.16", value: "1rem" },
    { id: "radius.8", value: "0.5rem" },
    { id: "font.size.16", value: "1rem" },
    { id: "duration.moderate", value: "200ms" },
    { id: "easing.standard", value: "[0.2,0,0,1]" },
    { id: "opacity.50", value: "0.5" },
    { id: "shadow.none", value: "0px 0px 0px, #00000000" },
  ])
    assert.deepEqual(measure(token), [], token.id);
});

test("a value it cannot measure says so", () => {
  assert.match(measure({ id: "color.x", value: "oklch(0.5 0.1 200)" })[0].text, /not a hex color/);
  assert.match(measure({ id: "size.x", value: "calc(1rem + 2px)" })[0].text, /not in px or rem/);
});
