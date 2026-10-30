import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CHECKS, makeContext } from "../checks.mjs";
import { rollup, runCheck, runHarness, toMarkdown } from "../run.mjs";

const root = join(import.meta.dirname, "..", "..");

test("every check named in instructions and specs exists", () => {
  const ctx = makeContext(root);
  for (const file of ["harness/instructions.json", "harness/specs.json"]) {
    for (const item of ctx.json(file).items) {
      for (const name of item.checks) assert.ok(CHECKS[name], `${item.id} names unknown check ${name}`);
    }
  }
});

test("every instruction carries Yonatan's words and every spec its In list", () => {
  const ctx = makeContext(root);
  for (const i of ctx.json("harness/instructions.json").items) assert.ok(i.words, `${i.id} has no words`);
  for (const s of ctx.json("harness/specs.json").items) assert.ok(s.in?.length, `${s.id} has no In`);
});

test("a check whose layer is missing reports not built, not fail", async () => {
  const empty = mkdtempSync(join(tmpdir(), "ods-h-"));
  const r = await runCheck("ui-components", makeContext(empty), { full: false });
  assert.equal(r.status, "not built");
});

test("slow checks are skipped without --full", async () => {
  const r = await runCheck("site-build", makeContext(root), { full: false });
  assert.equal(r.status, "skipped");
});

test("a failing check fails the requirement", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ods-h-"));
  mkdirSync(join(dir, "tokens"));
  writeFileSync(join(dir, "tokens", "package.json"), JSON.stringify({ name: "x" }));
  const r = await runCheck("tokens-style-dictionary", makeContext(dir), { full: false });
  assert.equal(r.status, "fail");
  assert.equal(rollup([{ status: "pass" }, r]), "fail");
});

test("rollup reads pass, partial and not built", () => {
  assert.equal(rollup([{ status: "pass" }, { status: "pass" }]), "pass");
  assert.equal(rollup([{ status: "pass" }, { status: "skipped" }]), "partial");
  assert.equal(rollup([{ status: "pass" }, { status: "not built" }]), "not built");
});

test("the report lists both sources", async () => {
  const report = await runHarness({ rootDir: root });
  const md = toMarkdown(report);
  assert.match(md, /Yonatan's instructions/);
  assert.match(md, /Ticket specs/);
  assert.equal(report.sections[0].rows.length, makeContext(root).json("harness/instructions.json").items.length);
});
