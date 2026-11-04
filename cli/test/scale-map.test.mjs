// The scale view's map (OD-223): every colour token lands on a primitive step in every brand and mode,
// so the docs and Storybook scale views show every token and nothing is lost.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { laneOf, scaleMap } from "../src/scale-map.mjs";

const dir = new URL("../../schemes/", import.meta.url).pathname;
const schemes = readdirSync(dir)
  .filter((f) => f.endsWith(".json") && f !== "grammar.json")
  .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));

const colourPaths = (node, path = []) =>
  !node || typeof node !== "object"
    ? []
    : "$value" in node
      ? [path.join(".")]
      : Object.entries(node)
          .filter(([k]) => !k.startsWith("$"))
          .flatMap(([k, v]) => colourPaths(v, [...path, k]));

test("every colour token lands on a primitive step in every brand and mode", () => {
  for (const s of schemes) {
    const want = colourPaths(s.tokens.semantic).filter(
      (p) => p.startsWith("color.") && !p.startsWith("color.neutral."),
    );
    for (const b of Object.keys(s.tokens.brands))
      for (const m of ["light", "dark"]) {
        const got = Object.values(scaleMap(s.tokens, b, m))
          .flat()
          .map((x) => x.path);
        assert.deepEqual(got.sort(), [...want].sort(), `${s.id} ${b} ${m}`);
      }
  }
});

test("a token's lane is what it paints", () => {
  assert.equal(laneOf("surface.canvas"), "fill");
  assert.equal(laneOf("text.link"), "text");
  assert.equal(laneOf("disabled.text"), "text");
  assert.equal(laneOf("border.focus"), "edge");
  assert.equal(laneOf("disabled.border"), "edge");
  assert.equal(laneOf("status.danger"), "edge");
  assert.equal(laneOf("status.danger.subtle"), "fill");
});

test("scales gives each hue's steps with the tokens on them, for the CLI and the MCP", async () => {
  const { scales } = await import("../src/scale-map.mjs");
  const s = schemes.find((x) => x.id === "dense-data");
  const out = scales(s, { mode: "dark", hue: "violet" });
  assert.equal(out.hues.length, 1);
  const st600 = out.hues[0].steps.find((x) => x.step === "600");
  assert.ok(
    st600.tokens.some((x) => x.token === "action.primary" && x.lane === "fill"),
  );
  assert.throws(() => scales(s, { brand: "nope" }), /No brand/);
  assert.throws(() => scales(s, { hue: "nope" }), /No hue/);
});
