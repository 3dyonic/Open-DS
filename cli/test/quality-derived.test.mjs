// Quality gate, derived against literal (OD-298): where each value comes from, new literals and their
// reasons, and raw literals in component code.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure, relative } from "../src/quality/criteria/derived.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { componentLiterals } from "../src/quality/sources.mjs";
import { cleanUi, fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

test("the clean fixture: 36 of 40 values derived, 4 literal", () => {
  const snap = snapshotOf(fixtureScheme());
  const m = measure(snap);
  assert.equal(valueOf(m, "derived.share"), 0.9);
  assert.equal(valueOf(m, "derived.literal-values"), 4);
  assert.equal(valueOf(m, "derived.component-literals"), 0);
  // 3 spacing map steps by their relation, 15 scale steps, 2 literals (the durations), in each of 2 themes
  assert.deepEqual(m.find((x) => x.id === "derived.share").details, ["relation: 6", "alias: 0", "scale: 30", "literal: 4"]);
  assert.equal(snap.schemes.fixture.origin.light["component-spacing-map.x3"], "relation");
  assert.equal(snap.schemes.fixture.origin.dark["color.action.primary"], "scale");
  // a pick of a gray step is a scale step, generated or not
  assert.equal(snap.schemes.fixture.origin.light["color.surface.canvas"], "scale");
  assert.equal(snap.schemes.fixture.origin.light["motion.duration.feedback"], "literal");
});

test("a raw hex typed in place of a color step is a literal and lowers the share", () => {
  const s = fixtureScheme();
  s.tokens.brands.default.theme.light.color.surface.canvas.$value = "#FFFFFF";
  const cand = snapshotOf(s);
  assert.equal(cand.schemes.fixture.origin.light["color.surface.canvas"], "literal");
  assert.equal(cand.schemes.fixture.origin.dark["color.surface.canvas"], "scale");
  const card = compareSnapshots(snapshotOf(fixtureScheme()), cand);
  assert.ok(card.failed.includes("derived.share"));
  assert.ok(card.failed.includes("derived.literal-values"));
});

test("a literal that replaces a derived step lowers the share and fails the scorecard", () => {
  const s = fixtureScheme();
  s.tokens.semantic["component-spacing-map"].x3.$value = "0.8rem";
  const base = snapshotOf(fixtureScheme());
  const cand = snapshotOf(s);
  const m = measure(cand);
  assert.equal(valueOf(m, "derived.literal-values"), 6);
  assert.equal(valueOf(m, "derived.share"), 0.85);
  const card = compareSnapshots(base, cand);
  assert.ok(card.failed.includes("derived.share"));
  assert.ok(card.failed.includes("derived.literal-values"));
  // the group's reason is about the whole map, not this value: the new literal has no reason of its own
  const rel = relative(base, cand);
  assert.equal(valueOf(rel, "derived.new-literals"), 1);
  assert.equal(valueOf(rel, "derived.new-literals-unreasoned"), 1);
  assert.deepEqual(rel.find((x) => x.id === "derived.new-literals-unreasoned").details, ["fixture: component-spacing-map.x3"]);
  // its own why is a reason
  s.tokens.semantic["component-spacing-map"].x3.$extensions["open-ds"].why = "0.8rem: the grid's gutter, set by the host app.";
  assert.equal(valueOf(relative(base, snapshotOf(s)), "derived.new-literals-unreasoned"), 0);
});

test("a new literal with no recorded reason is listed and fails", () => {
  const s = fixtureScheme();
  s.tokens.semantic.type.body["font-size"] = { $value: "15px" };
  const base = snapshotOf(fixtureScheme());
  const rel = relative(base, snapshotOf(s));
  assert.equal(valueOf(rel, "derived.new-literals-unreasoned"), 1);
  assert.deepEqual(rel.find((x) => x.id === "derived.new-literals-unreasoned").details, ["fixture: type.body.font-size"]);
  const card = compareSnapshots(base, snapshotOf(s));
  assert.ok(card.failed.includes("derived.new-literals-unreasoned"));
});

test("hex, px and ms literals in component code are found; comments are not", () => {
  const files = [
    { file: "ui/src/components/a.tsx", text: 'const a = "p-[3px] bg-[#ff0000] duration-[250ms]";\n// a 4px note\nconst b = "w-[var(--x)]";' },
    { file: "ui/src/a.css", text: "/* 2px in a comment */\n.a { gap: var(--space-gap-tight); }" },
  ];
  const found = componentLiterals(files);
  assert.deepEqual(
    found.map((l) => `${l.file}:${l.line} ${l.kind} ${l.text}`),
    ["ui/src/components/a.tsx:1 hex #ff0000", "ui/src/components/a.tsx:1 px 3px", "ui/src/components/a.tsx:1 ms 250ms"],
  );
  const snap = snapshotOf(fixtureScheme(), { ui: { ...cleanUi(), literals: found } });
  assert.equal(valueOf(measure(snap), "derived.component-literals"), 3);
  assert.ok(compareSnapshots(snapshotOf(fixtureScheme()), snap).failed.includes("derived.component-literals"));
});
