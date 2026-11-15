// The gap ledger and the reason form keep their failures as named lists. The checks compare today's
// failures with the list (againstBaseline): a failure the list does not name fails, and a listed failure
// that is fixed now fails until the same change takes it out.
import assert from "node:assert/strict";
import { join } from "node:path";
import { test } from "node:test";
import { CHECKS, makeContext } from "../checks.mjs";
import { gapLedgers, gapName, gapsBaseline, namedGaps } from "../../scripts/gaps.mjs";
import { formBaseline, formOfSchemes, namedOff } from "../../scripts/reason-form.mjs";

const root = join(import.meta.dirname, "..", "..");
const real = makeContext(root);
// The context with one harness file replaced, so a check reads a planted baseline.
const withFile = (file, data) => ({
  ...real,
  json: (...parts) => (parts.join("/") === `harness/${file}` ? data : real.json(...parts)),
});
const run = (name, ctx) => CHECKS[name].run(ctx);
const gaps = namedGaps(gapLedgers());
const off = namedOff(formOfSchemes());

test("the gaps baseline names each of today's 45 gaps once, as the writer writes it", async () => {
  assert.equal(gaps.length, 45);
  assert.equal(new Set(gaps.map((x) => x.id)).size, gaps.length, "two gaps share a name");
  assert.deepEqual(real.json("harness", "gaps-baseline.json"), gapsBaseline(gaps));
  assert.equal((await run("gaps-only-go-down", real)).ok, true);
});

test("a gap's name is its scheme, kind and where it is", () => {
  assert.equal(
    gapName("dense-data", { kind: "decided-in-code", component: "drawer", key: "w-[100px]" }),
    "dense-data decided-in-code drawer w-[100px]",
  );
  assert.equal(
    gapName("dense-data", { kind: "rule-not-written", state: "hover", property: "text", keys: ["a"] }),
    "dense-data rule-not-written hover text",
  );
  assert.equal(
    gapName("multi-brand", { kind: "pick-without-reason", brand: "coral", mode: "dark", token: "theme.color.x" }),
    "multi-brand pick-without-reason theme.color.x coral/dark",
  );
});

test("a gap the list does not name fails, and a listed gap that is fixed fails with take it out", async () => {
  const listed = gapsBaseline(gaps);
  const [first, ...rest] = listed.failures;
  const added = await run("gaps-only-go-down", withFile("gaps-baseline.json", { ...listed, failures: rest }));
  assert.equal(added.ok, false);
  assert.match(
    added.detail,
    new RegExp(`^1 gaps the baseline does not name \\(open-ds gaps <scheme> lists them\\): ${first.replace(/[[\]().*+?|]/g, "\\$&")}:`),
  );
  const planted = "dense-data wrong-semantic button component.button.planted";
  const fixed = await run(
    "gaps-only-go-down",
    withFile("gaps-baseline.json", { ...listed, failures: [...listed.failures, planted] }),
  );
  assert.equal(fixed.ok, false);
  assert.match(fixed.detail, /^1 listed gaps are fixed; take them out of harness\/gaps-baseline\.json/);
  assert.ok(fixed.detail.endsWith(planted));
});

test("the reason-form baseline names each of today's 532 values once, as the writer writes it", async () => {
  assert.equal(off.length, 532);
  assert.equal(new Set(off.map((x) => x.id)).size, off.length);
  assert.deepEqual(real.json("harness", "reason-form-baseline.json"), formBaseline(off));
  assert.equal((await run("reasons-say-why", real)).ok, true);
});

test("a reason out of the form the list does not name fails, and a listed one in the form fails with take it out", async () => {
  const listed = formBaseline(off);
  const [first, ...rest] = listed.failures;
  const added = await run("reasons-say-why", withFile("reason-form-baseline.json", { ...listed, failures: rest }));
  assert.equal(added.ok, false);
  assert.match(
    added.detail,
    new RegExp(`^1 reasons out of the form that the baseline does not name: ${first.replace(/\./g, "\\.")} misses `),
  );
  const planted = "dense-data color.planted";
  const fixed = await run(
    "reasons-say-why",
    withFile("reason-form-baseline.json", { ...listed, failures: [...listed.failures, planted] }),
  );
  assert.equal(fixed.ok, false);
  assert.match(
    fixed.detail,
    /^1 listed reasons are in the form now; take them out of harness\/reason-form-baseline\.json/,
  );
  assert.match(fixed.detail, /dense-data color\.planted\. Values whose reason/);
});
