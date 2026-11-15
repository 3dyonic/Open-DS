// The grammar schema takes a semantic key's own variant rule and a component default's fill, and
// rejects each shape that is not one. Fixture grammars only: the real grammar sets neither field.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { assetRoots, grammar } from "../src/schemes.mjs";

const roots = assetRoots();
const g = grammar(roots);
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(
  JSON.parse(readFileSync(join(roots.schema, "grammar.schema.json"), "utf8")),
);
const withKey = (variant) => {
  const fixture = structuredClone(g);
  fixture.semantics.keys.find((k) => k.id === "color.status.danger.@").variant = variant;
  return fixture;
};
const withOn = (on) => {
  const fixture = structuredClone(g);
  fixture.component_keys.find((k) => k.id === "badge/success/label").on = on;
  return fixture;
};

test("the real grammar matches its schema", () => {
  assert.ok(validate(g), JSON.stringify(validate.errors?.slice(0, 3)));
});

test("a semantic key's variant is a step, or from and steps, and nothing else", () => {
  for (const variant of [{ step: "700" }, { from: "@", steps: 2 }]) assert.ok(validate(withKey(variant)), JSON.stringify(variant));
  for (const variant of [
    {},
    { step: "700", from: "@" },
    { step: "700", steps: 1 },
    { step: "700", from: "@", steps: 1 },
    { from: "@" },
    { steps: 1 },
    { step: "deep red" },
    { from: "", steps: 1 },
    { from: "@", steps: 0 },
    { step: "700", note: "free text" },
    "700",
  ])
    assert.equal(validate(withKey(variant)), false, JSON.stringify(variant));
});

test("a component default's on is a semantic colour path", () => {
  for (const on of ["color.status.success.subtle", "color.action.primary.@"]) assert.ok(validate(withOn(on)), on);
  for (const on of ["", "the success fill", "status.success.subtle", ["color.status.success.subtle"], { id: "x" }])
    assert.equal(validate(withOn(on)), false, JSON.stringify(on));
});
