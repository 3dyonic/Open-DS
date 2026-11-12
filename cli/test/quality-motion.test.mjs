// Quality gate, motion (OD-298): reduced motion keeps no transform, and durations stay within their caps.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure } from "../src/quality/criteria/motion.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { reducedMotionTransforms } from "../src/quality/sources.mjs";
import { cleanUi, fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

test("a transform inside a reduced-motion block is found; none and resets are not", () => {
  const css = [
    "@media (prefers-reduced-motion: reduce) {",
    "  .a { transform: translateY(4px); }",
    "  .b { transform: none; }",
    "  /* .c { scale: 1.1; } */",
    "}",
    ".d { transform: scale(1.1); }",
  ].join("\n");
  const tsx = 'const c = "motion-reduce:translate-y-1 motion-reduce:transform-none motion-reduce:scale-100";';
  const found = reducedMotionTransforms([
    { file: "ui/src/styles.css", text: css },
    { file: "ui/src/components/x.tsx", text: tsx },
  ]);
  assert.deepEqual(
    found.map((f) => `${f.file}:${f.line} ${f.text}`),
    ["ui/src/styles.css:2 transform: translateY(4px)", "ui/src/components/x.tsx:1 motion-reduce:translate-y-1"],
  );
  const snap = snapshotOf(fixtureScheme(), { ui: { ...cleanUi(), reducedMotion: found } });
  assert.equal(valueOf(measure(snap), "motion.reduced-motion-transforms"), 2);
  assert.ok(compareSnapshots(snapshotOf(fixtureScheme()), snap).failed.includes("motion.reduced-motion-transforms"));
});

test("durations over their family's cap are counted: feedback 150, panels 300, expressive 500", () => {
  assert.equal(valueOf(measure(snapshotOf(fixtureScheme())), "motion.duration-caps"), 0);
  const s = fixtureScheme();
  s.tokens.primitive.duration.slower = { $value: "600ms" };
  s.tokens.semantic.motion.duration.feedback.$value = "{duration.moderate}";
  s.tokens.semantic.motion.duration.panels.$value = "{duration.slow}";
  s.tokens.semantic.motion.duration.hero = { $value: "{duration.slower}" };
  const snap = snapshotOf(s);
  const m = measure(snap);
  assert.equal(valueOf(m, "motion.duration-caps"), 2);
  assert.deepEqual(m.find((x) => x.id === "motion.duration-caps").details, [
    "fixture: fail",
    "  motion.duration.feedback is 200ms; the feedback cap is 150ms",
    "  motion.duration.hero is 600ms; the expressive cap is 500ms",
  ]);
});
