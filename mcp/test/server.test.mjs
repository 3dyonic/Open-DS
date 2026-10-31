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

test("with SITE_DIR the host also serves the site, a 404 page, and nothing outside the folder", async () => {
  const { mkdtempSync, writeFileSync, mkdirSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const dir = mkdtempSync(join(tmpdir(), "open-ds-site-"));
  writeFileSync(join(dir, "index.html"), "<h1>home</h1>");
  writeFileSync(join(dir, "404.html"), "<h1>missing</h1>");
  mkdirSync(join(dir, "schemes"));
  writeFileSync(join(dir, "schemes", "index.html"), "<h1>schemes</h1>");
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, PORT: "8792", HOST: "127.0.0.1", SITE_DIR: dir },
  });
  try {
    await new Promise((resolve, reject) => {
      child.stderr.on("data", (d) => String(d).includes("/mcp") && resolve());
      child.on("exit", (code) => reject(new Error(`exited ${code}`)));
    });
    const base = "http://127.0.0.1:8792";
    assert.equal(await (await fetch(`${base}/`)).text(), "<h1>home</h1>");
    assert.equal(
      await (await fetch(`${base}/schemes/`)).text(),
      "<h1>schemes</h1>",
    );
    const missing = await fetch(`${base}/nope`);
    assert.equal(missing.status, 404);
    assert.equal(await missing.text(), "<h1>missing</h1>");
    assert.equal((await fetch(`${base}/..%2f..%2fetc%2fpasswd`)).status, 404);
    assert.equal(
      (await (await fetch(`${base}/health`)).json()).name,
      "open-ds",
    );
  } finally {
    child.kill();
  }
});
