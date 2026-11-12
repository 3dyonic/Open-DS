// verify-b: independent check of the gate's color math (OD-298). Reference values come from
// the published OKLab, WCAG 2.x and Machado 2009 formulas in verify-b-helpers.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { oklab, oklabDistance, contrast, wcagLevel, simulate, chromaHue } from "../src/quality/color.mjs";
import { lab, dist, ratio, lch, linearOf, simLinear, hexOfLinear } from "./verify-b-helpers.mjs";

const PAIRS = [
  ["#FFFFFF", "#6B7585"], // white on slate 500: near the 4.5:1 line
  ["#C42B2B", "#1F7A3A"], // red vs green: the classic CVD pair
  ["#161B23", "#A9A3F6"], // dark surface vs a pastel violet
  ["#4B3FD9", "#3729AA"], // primary rest vs hover
  ["#808080", "#7F7F7F"], // one unit apart: the smallest step
];
const myLevel = (r) => (r >= 7 ? 3 : r >= 4.5 ? 2 : r >= 3 ? 1 : 0);

for (const [x, y] of PAIRS) {
  test(`math ${x} vs ${y}`, () => {
    for (const h of [x, y]) {
      const mine = lab(h), theirs = oklab(h);
      mine.forEach((v, i) => assert.ok(Math.abs(v - theirs[i]) < 1e-6, `OKLab ${h}[${i}] mine ${v} tool ${theirs[i]}`));
      const c1 = lch(h), c2 = chromaHue(h);
      assert.ok(Math.abs(c1.C - c2.C) < 1e-6, `chroma ${h}`);
      if (c1.C > 1e-3) assert.ok(Math.abs(((c1.H - c2.H + 540) % 360) - 180) < 1e-4, `hue ${h} ${c1.H} ${c2.H}`);
    }
    assert.ok(Math.abs(dist(x, y) - oklabDistance(x, y)) < 1e-6, `distance mine ${dist(x, y)} tool ${oklabDistance(x, y)}`);
    const mineR = ratio(x, y);
    for (const theirs of [contrast(x, y), contrast(y, x)]) assert.ok(Math.abs(mineR - theirs) < 1e-6, `contrast mine ${mineR} tool ${theirs}`);
    assert.equal(wcagLevel(mineR), myLevel(mineR));
    for (const vision of ["deuteranopia", "protanopia", "tritanopia"]) for (const h of [x, y]) {
      const mine = hexOfLinear(simLinear(linearOf(h), vision));
      const theirs = simulate(h, vision).toUpperCase();
      assert.ok(dist(mine, theirs) < 0.005, `${vision} ${h}: mine ${mine} tool ${theirs}`);
    }
  });
}

test("math wcagLevel boundaries", () => {
  assert.deepEqual([2.999, 3, 4.499, 4.5, 6.999, 7].map(wcagLevel), [0, 1, 1, 2, 2, 3]);
});
