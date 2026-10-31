#!/usr/bin/env node
// Runs every check behind Yonatan's instructions and the ticket specs, and writes a report.
//
//   node harness/run.mjs            fast checks; slow builds are listed as skipped
//   node harness/run.mjs --full     also runs builds and test suites
//   node harness/run.mjs --only I06 one requirement
//
// Statuses: pass, fail, not built (the layer does not exist yet), skipped (slow, run --full).
// The exit code is 1 only when a check that can run fails.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CHECKS, makeContext } from "./checks.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

export async function runCheck(name, ctx, { full }) {
  const check = CHECKS[name];
  if (!check) return { name, status: "fail", detail: "no such check" };
  const missing = (check.requires ?? []).filter((r) => !ctx.has(r));
  if (missing.length) return { name, status: "not built", detail: `needs ${missing.join(", ")}` };
  if (check.slow && !full) return { name, status: "skipped", detail: "slow, run with --full" };
  try {
    const r = await check.run(ctx);
    return { name, status: r.ok ? "pass" : r.pending ? "not built" : "fail", detail: r.detail };
  } catch (e) {
    return { name, status: "fail", detail: String(e.message ?? e).slice(0, 300) };
  }
}

export function rollup(results) {
  const s = results.map((r) => r.status);
  if (s.includes("fail")) return "fail";
  if (s.every((x) => x === "pass")) return "pass";
  if (s.includes("not built")) return "not built";
  return "partial";
}

export async function runHarness({ full = false, only = null, rootDir = root } = {}) {
  const ctx = makeContext(rootDir);
  const cache = new Map();
  const sections = [];
  for (const [label, file] of [
    ["Yonatan's instructions", "harness/instructions.json"],
    ["Ticket specs", "harness/specs.json"],
  ]) {
    const items = ctx.json(file).items.filter((i) => !only || i.id === only);
    const rows = [];
    for (const item of items) {
      const results = [];
      for (const name of item.checks) {
        if (!cache.has(name)) cache.set(name, await runCheck(name, ctx, { full }));
        results.push(cache.get(name));
      }
      rows.push({ id: item.id, title: item.title, status: rollup(results), results });
    }
    sections.push({ label, rows });
  }
  const all = [...cache.values()];
  const count = (st) => all.filter((r) => r.status === st).length;
  const summary = {
    checks: all.length,
    pass: count("pass"),
    fail: count("fail"),
    notBuilt: count("not built"),
    skipped: count("skipped"),
  };
  return { generatedAt: new Date().toISOString(), full, summary, sections };
}

const ICON = { pass: "✅", fail: "❌", "not built": "⬜", skipped: "⏭️", partial: "🟡" };

export function toMarkdown(report) {
  const { summary: s } = report;
  const lines = [
    "# Harness report",
    "",
    `${s.pass} of ${s.checks} checks pass · ${s.fail} fail · ${s.notBuilt} not built yet · ${s.skipped} skipped${report.full ? "" : " (run --full for builds)"}`,
    "",
  ];
  for (const sec of report.sections) {
    const done = sec.rows.filter((r) => r.status === "pass").length;
    lines.push(`## ${sec.label} · ${done} of ${sec.rows.length} done`, "");
    for (const row of sec.rows) {
      lines.push(`- ${ICON[row.status]} **${row.id}** ${row.title}`);
      for (const r of row.results) lines.push(`  - ${ICON[r.status]} \`${r.name}\` ${r.detail}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const onlyAt = args.indexOf("--only");
  const report = await runHarness({ full: args.includes("--full"), only: onlyAt >= 0 ? args[onlyAt + 1] : null });
  if (onlyAt >= 0 && !report.sections.some((sec) => sec.rows.length)) {
    console.error(`No instruction or spec with id ${args[onlyAt + 1]}.`);
    process.exit(1);
  }
  const md = toMarkdown(report);
  writeFileSync(join(here, "report.md"), md);
  writeFileSync(join(here, "report.json"), JSON.stringify(report, null, 2));
  console.log(md);
  process.exitCode = report.summary.fail ? 1 : 0;
}
