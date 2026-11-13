// Ticket statuses for the ADR check (OD-312). A one-off command: the harness and CI never run it.
// It reads every ticket key in an ADR's plan steps, and in the status line of an ADR with a plan, asks Jira for each
// status, and writes harness/ticket-status.json. Credentials come from the environment and are not stored.
//
//   JIRA_EMAIL=… JIRA_API_TOKEN=… node scripts/ticket-status.mjs
//
// JIRA_SITE sets the Jira site; the default is the project's site.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ADR_DIR,
  TICKET_STATUS_FILE,
  adrPlans,
  makeContext,
} from "../harness/checks.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_SITE = "https://juice-engine.atlassian.net";

/** Every ticket key in the ADRs' plan steps, and in the status line of each ADR with a plan, sorted. */
export function adrTicketKeys(plans) {
  const keys = plans
    .filter(({ plan }) => plan.steps.length)
    .flatMap(({ plan }) => [
      ...plan.statusTickets,
      ...plan.steps.flatMap((s) => s.tickets),
    ]);
  return [...new Set(keys)].sort(
    (a, b) => Number(a.slice(3)) - Number(b.slice(3)),
  );
}

/** The status file's content: the description it has, the refresh time and each key's status. */
export function statusFile(previous, statuses, now = new Date()) {
  return {
    $description: previous.$description,
    refreshed: now.toISOString(),
    statuses,
  };
}

async function fetchStatus(key, { site, auth }) {
  const res = await fetch(`${site}/rest/api/3/issue/${key}?fields=status`, {
    headers: { Authorization: `Basic ${auth}`, Accept: "application/json" },
  });
  if (!res.ok)
    throw new Error(
      `Jira answered ${res.status} for ${key}. Check JIRA_EMAIL, JIRA_API_TOKEN and JIRA_SITE.`,
    );
  return (await res.json()).fields.status.name;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const email = process.env.JIRA_EMAIL ?? "";
  const token = process.env.JIRA_API_TOKEN ?? "";
  const site = (process.env.JIRA_SITE ?? DEFAULT_SITE).replace(/\/$/, "");
  if (!email || !token) {
    console.error(
      "Set JIRA_EMAIL and JIRA_API_TOKEN (an Atlassian API token), then run again.",
    );
    process.exit(1);
  }
  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const keys = adrTicketKeys(adrPlans(makeContext(root)));
  if (!keys.length) {
    console.error(`No ticket keys found in ${ADR_DIR}.`);
    process.exit(1);
  }
  const statuses = {};
  for (const key of keys)
    statuses[key] = await fetchStatus(key, { site, auth });
  const file = join(root, TICKET_STATUS_FILE);
  const previous = JSON.parse(readFileSync(file, "utf8"));
  writeFileSync(
    file,
    `${JSON.stringify(statusFile(previous, statuses), null, 2)}\n`,
  );
  for (const [key, status] of Object.entries(statuses))
    console.log(`${key}: ${status}`);
  console.log(`Wrote ${file}.`);
}
