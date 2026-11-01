// The health page, built like Open UX's: a static shell that asks the hosted service for /health.json
// and shows whether the website, the MCP server and the database answer. Agents and scripts read the
// same facts as JSON. The service (open-ds-ops) owns the facts; this page only shows them.
import type { Metadata } from "next";
import { HealthView } from "@/components/health-view";

export const metadata: Metadata = {
  title: "Health",
  description: "Whether open-ds.dev is up: the website, the MCP server and the database.",
  robots: { index: false },
};

export default function HealthPage() {
  return <HealthView />;
}
