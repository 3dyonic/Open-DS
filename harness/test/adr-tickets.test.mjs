import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { adrPlan, adrStatusGaps, adrStepGaps, makeContext, ticketStatusGaps } from "../checks.mjs";
import { runCheck } from "../run.mjs";
import { adrTicketKeys } from "../../scripts/ticket-status.mjs";

const NOW = Date.parse("2026-11-13T00:00:00Z");
const adr = (status, steps) =>
  [
    "# ADR",
    "",
    `Status: ${status}`,
    "",
    "## Order of work",
    "",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "## Later",
    "",
    "1. Not a step.",
  ].join("\n");

// A temporary repo with one ADR and a status file.
function repo(text, statuses, refreshed = "2026-11-12T00:00:00Z") {
  const dir = mkdtempSync(join(tmpdir(), "od-312-"));
  mkdirSync(join(dir, "guide", "contributing", "adr"), { recursive: true });
  mkdirSync(join(dir, "harness"));
  writeFileSync(join(dir, "guide", "contributing", "adr", "009-test.md"), text);
  writeFileSync(join(dir, "harness", "ticket-status.json"), JSON.stringify({ refreshed, statuses }));
  return makeContext(dir);
}

test("adrPlan reads the status line and only the steps under Order of work", () => {
  const plan = adrPlan(adr("decided (OD-1).", ["Load path. (OD-2)", "Build step. (OD-3, OD-4)"]));
  assert.deepEqual(plan.statusTickets, ["OD-1"]);
  assert.deepEqual(
    plan.steps.map((s) => [s.step, s.tickets]),
    [
      [1, ["OD-2"]],
      [2, ["OD-3", "OD-4"]],
    ],
  );
});

test("a step with no ticket fails the check", async () => {
  const text = adr("decided.", ["Load path. (OD-2)", "Build step."]);
  assert.deepEqual(adrStepGaps("a.md", adrPlan(text)), ["a.md:8 step 2 names no ticket (OD-n)"]);
  const r = await runCheck("adr-steps-name-tickets", repo(text, {}), { full: false });
  assert.equal(r.status, "fail");
  assert.match(r.detail, /step 2 names no ticket/);
});

test("a nothing-built status with a Done step ticket fails the check", async () => {
  const text = adr("decided. Nothing in this note is built yet.", ["Load path. (OD-2)", "Build step. (OD-3)"]);
  const statuses = { "OD-2": "Done", "OD-3": "To Do" };
  assert.match(adrStatusGaps("a.md", adrPlan(text), statuses)[0], /nothing is built, but step 1 \(OD-2\) is Done/);
  const r = await runCheck("adr-status-matches-tickets", repo(text, statuses), { full: false });
  assert.equal(r.status, "fail");
});

test("a status that says which steps shipped passes", async () => {
  const text = adr("decided. Step 1 shipped (OD-2). Step 2 is open (OD-3).", [
    "Load path. (OD-2)",
    "Build step. (OD-3)",
  ]);
  const r = await runCheck("adr-status-matches-tickets", repo(text, { "OD-2": "Done", "OD-3": "To Do" }), {
    full: false,
  });
  assert.equal(r.status, "pass", r.detail);
  const nothing = adr("decided. Nothing is built yet.", ["Build step. (OD-3)"]);
  assert.deepEqual(adrStatusGaps("a.md", adrPlan(nothing), { "OD-3": "To Do" }), []);
});

test("an old status file or a missing key fails, and names the refresh command", async () => {
  const fresh = { refreshed: "2026-11-01T00:00:00Z", statuses: { "OD-2": "Done" } };
  assert.deepEqual(ticketStatusGaps(fresh, ["OD-2"], NOW), []);
  const old = ticketStatusGaps({ ...fresh, refreshed: "2026-09-01T00:00:00Z" }, ["OD-2"], NOW);
  assert.match(old[0], /73 days old \(limit 30\); run: node scripts\/ticket-status\.mjs/);
  assert.match(ticketStatusGaps(fresh, ["OD-2", "OD-9"], NOW)[0], /no status for OD-9/);
  assert.match(ticketStatusGaps({ statuses: {} }, [], NOW)[0], /no valid refreshed date/);
  const text = adr("decided.", ["Load path. (OD-2)", "Build step. (OD-3)"]);
  const r = await runCheck("adr-status-matches-tickets", repo(text, { "OD-2": "Done" }), { full: false });
  assert.equal(r.status, "fail");
  assert.match(r.detail, /no status for OD-3/);
});

test("the refresh script asks for step tickets and the status line of an ADR with a plan", () => {
  const plans = [
    { file: "a.md", plan: adrPlan(adr("decided (OD-10).", ["Load path. (OD-2)"])) },
    { file: "b.md", plan: adrPlan("# Old\n\nStatus: superseded. OD-99 removed it.\n") },
  ];
  assert.deepEqual(adrTicketKeys(plans), ["OD-2", "OD-10"]);
});
