// The version bump follows the public surface (OD-165).
import assert from "node:assert/strict";
import { test } from "node:test";
import { diff, levelOf } from "../scripts/release.mjs";

const base = { schemes: ["a", "b"], css_variables: ["a --x", "b --x"], mcp_tools: ["why"] };

test("no change needs only a patch", () => {
  const d = diff(base, base, "1.2.3");
  assert.equal(d.changed, false);
  assert.equal(d.needs, "patch");
});

test("an addition is a feature: minor, or patch while the major is 0", () => {
  const now = { ...base, mcp_tools: ["why", "get_context"] };
  assert.equal(diff(base, now, "1.2.3").needs, "minor");
  assert.equal(diff(base, now, "0.1.0").needs, "patch");
  assert.deepEqual(diff(base, now, "1.0.0").added, { mcp_tools: ["get_context"] });
});

test("a removal or rename is breaking: major, or minor while the major is 0", () => {
  const now = { ...base, css_variables: ["a --x", "b --y"] };
  const d = diff(base, now, "1.2.3");
  assert.equal(d.needs, "major");
  assert.deepEqual(d.removed, { css_variables: ["b --x"] });
  assert.equal(diff(base, now, "0.4.0").needs, "minor");
});

test("levelOf reads the step between two versions", () => {
  assert.equal(levelOf("0.1.0", "0.1.1"), "patch");
  assert.equal(levelOf("0.1.0", "0.2.0"), "minor");
  assert.equal(levelOf("0.1.0", "1.0.0"), "major");
  assert.equal(levelOf("0.1.1", "0.1.0"), null);
});
