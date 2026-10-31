#!/usr/bin/env node
// End-to-end check of the MCP server over stdio, the way an AI client connects to it.
// Starts `open-ds mcp`, lists tools and prompts, reads the schemes, asks when_to_use and plans an init.
// Prints one JSON line.
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const bin = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "bin",
  "open-ds.js",
);
const client = new Client({ name: "e2e", version: "1" });
await client.connect(
  new StdioClientTransport({ command: process.execPath, args: [bin, "mcp"] }),
);
const data = async (name, args) =>
  JSON.parse(
    (await client.callTool({ name, arguments: args })).content[0].text,
  );
const tools = (await client.listTools()).tools.map((t) => t.name).sort();
const prompts = (await client.listPrompts()).prompts.map((p) => p.name).sort();
const schemes = (await data("list_schemes", {})).map((s) => s.id);
const rule = await data("when_to_use", {
  scheme_id: "dense-data",
  situation: "number in a table",
});
const plan = await data("plan_init", {
  scheme_id: "multi-brand",
  brand: "coral",
});
await client.close();
console.log(
  JSON.stringify({
    tools,
    prompts,
    schemes,
    rule: rule.situation,
    command: plan.command,
    files: Object.keys(plan.record.files ?? {}),
  }),
);
