// The host starts the server and answers on /health and /mcp.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("../server.mjs", import.meta.url));

test("the host serves /health and /mcp", async () => {
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, PORT: "8791", HOST: "127.0.0.1" },
  });
  try {
    await new Promise((resolve, reject) => {
      child.stderr.on("data", (d) => String(d).includes("/mcp") && resolve());
      child.on("exit", (code) => reject(new Error(`exited ${code}`)));
    });
    const health = await (await fetch("http://127.0.0.1:8791/health")).json();
    assert.equal(health.name, "open-ds");
    const r = await fetch("http://127.0.0.1:8791/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    });
    assert.ok(
      (await r.json()).result.tools.some((t) => t.name === "list_schemes"),
    );
  } finally {
    child.kill();
  }
});
