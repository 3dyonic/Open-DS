// Quality gate, size (OD-298): token count and CSS bytes are shown; an unused semantic is gated.
import { test } from "node:test";
import assert from "node:assert/strict";
import { measure, unusedSemantics } from "../src/quality/criteria/size.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

const withRow = () => {
  const s = fixtureScheme();
  s.tokens.semantic.size.row = { $value: "{size.32}", $extensions: { "open-ds": { why: "Row height: 32px holds one line of table data.", because: ["people.q1"] } } };
  return s;
};

test("the clean fixture: 24 tokens, no CSS built, nothing unused", () => {
  const m = measure(snapshotOf(fixtureScheme()));
  assert.equal(valueOf(m, "size.tokens"), 24);
  assert.equal(valueOf(m, "size.css-bytes"), null);
  assert.equal(valueOf(m, "size.unused-semantics"), 0);
});

test("a semantic nothing reads is unused, and the scorecard fails it; token count is only shown", () => {
  const cand = snapshotOf(withRow());
  const m = measure(cand);
  assert.equal(valueOf(m, "size.unused-semantics"), 1);
  assert.equal(valueOf(m, "size.tokens"), 25);
  const card = compareSnapshots(snapshotOf(fixtureScheme()), cand);
  assert.ok(card.failed.includes("size.unused-semantics"));
  assert.equal(card.criteria.find((r) => r.id === "size.tokens").pass, true);
});

test("a key that names its fill reads both text pairs of the fill's tone", () => {
  const s = fixtureScheme();
  const pair = (hex) => ({ $value: "{color.gray.light.900}", $extensions: { "open-ds": { why: `Danger text pair ${hex} on a status fill.`, because: ["color.values"] } } });
  s.tokens.semantic.color.text["danger-on-light"] = pair("light");
  s.tokens.semantic.color.text["danger-on-dark"] = pair("dark");
  s.tokens.component.badge = { label: { $value: "{color.text.danger-on-light}", $extensions: { "open-ds": { on: "color.surface.default" } } } };
  const snap = snapshotOf(s, { ui: { files: 0, literals: [], reducedMotion: [], reads: [] } });
  const unused = unusedSemantics(snap.schemes.fixture, snap.ui);
  assert.equal(unused.includes("color.text.danger-on-light"), false);
  assert.equal(unused.includes("color.text.danger-on-dark"), false);
});

test("a CSS read or a token reference makes a semantic used", () => {
  const s = snapshotOf(withRow()).schemes.fixture;
  assert.equal(unusedSemantics(s, { reads: [] }).length, 17);
  assert.equal(unusedSemantics({ ...s, css: { reads: ["size-row"] } }, { reads: [] }).includes("size.row"), false);
  const built = snapshotOf(withRow());
  built.schemes.fixture.css = { bytes: 42, properties: 1, reads: ["size-row"] };
  const m = measure(built);
  assert.equal(valueOf(m, "size.css-bytes"), 42);
  assert.equal(valueOf(m, "size.unused-semantics"), 0);
});
