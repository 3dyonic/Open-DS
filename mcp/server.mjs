#!/usr/bin/env node
// The hosted Open DS MCP server: Streamable HTTP at /mcp, health at /health.
// PORT and HOST come from the environment (a host sets PORT). No authentication yet (OD-145).
import { runHttp } from "open-ds/mcp";

const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? "0.0.0.0";
runHttp({ port, host }).once("listening", () =>
  console.error(
    `Open DS MCP server on http://${host}:${port}/mcp (no authentication).`,
  ),
);
