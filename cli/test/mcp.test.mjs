// The Open DS MCP server: every tool, the prompts, and the Streamable HTTP transport.
import assert from "node:assert/strict";
import { test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer, runHttp } from "../src/mcp.mjs";

async function connect() {
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "1" });
  await Promise.all([createMcpServer().connect(a), client.connect(b)]);
  return client;
}
const call = async (client, name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  assert.ok(!r.isError, `${name} failed: ${r.content?.[0]?.text}`);
  return JSON.parse(r.content[0].text);
};

const TOOLS = [
  "compare_schemes",
  "get_answer",
  "get_context",
  "get_inventory",
  "get_key",
  "get_scheme",
  "list_schemes",
  "plan_add",
  "plan_create",
  "plan_init",
  "what_moves",
  "when_to_use",
  "why",
];

test("lists every tool, all read-only", async () => {
  const client = await connect();
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), TOOLS);
  for (const t of tools)
    assert.equal(
      t.annotations?.readOnlyHint,
      true,
      `${t.name} is not read-only`,
    );
});

test("reads schemes, answers, reasons and rules", async () => {
  const c = await connect();
  const schemes = await call(c, "list_schemes");
  assert.deepEqual(schemes.map((s) => s.id).sort(), [
    "accessible-first",
    "brand-expressive",
    "content-first",
    "dense-data",
    "multi-brand",
  ]);
  assert.ok(
    (await call(c, "get_scheme", { scheme_id: "dense-data" })).ai.use_when,
  );
  const answer = await call(c, "get_answer", {
    scheme_id: "dense-data",
    question_id: "components.count",
  });
  assert.equal(answer.options.filter((o) => o.chosen).length, 1);
  assert.ok(
    (
      await call(c, "why", {
        scheme_id: "dense-data",
        target: "typography.definition",
      })
    ).why,
  );
  assert.ok(
    (
      await call(c, "why", {
        scheme_id: "dense-data",
        target: "button/primary/background",
      })
    ).semantic,
  );
  assert.ok(
    (
      await call(c, "when_to_use", {
        scheme_id: "content-first",
        situation: "a number in a table",
      })
    ).use,
  );
  const cmp = await call(c, "compare_schemes", {
    a: "dense-data",
    b: "content-first",
  });
  assert.ok(cmp.different > 0 && cmp.answers.every((r) => !r.same));
  const inv = await call(c, "get_inventory", { scheme_id: "dense-data" });
  assert.ok(inv.in.some((i) => i.id === "data-table"));
  const moves = await call(c, "what_moves", {
    scheme_id: "dense-data",
    question_id: "people.q1",
  });
  assert.ok(moves.follows.length > 0);
  assert.ok(
    (
      await call(c, "get_key", {
        scheme_id: "multi-brand",
        key: "button/primary/background",
      })
    ).values,
  );
});

test("plans return commands and never write to the caller's disk", async () => {
  const c = await connect();
  const create = await call(c, "plan_create", {
    scheme_id: "dense-data",
    dir: "my-ds",
  });
  assert.equal(create.command, "npx open-ds create my-ds --scheme dense-data");
  assert.ok(
    create.files.includes("tokens/build.mjs") &&
      create.files.includes(".claude/skills/open-ds-build/SKILL.md"),
  );
  const init = await call(c, "plan_init", {
    scheme_id: "multi-brand",
    brand: "coral",
  });
  assert.equal(
    init.command,
    "npx open-ds init multi-brand --dir . --brand coral",
  );
  const add = await call(c, "plan_add", { component: "data-table" });
  assert.ok(
    add.components.includes("table") && add.packages["@tanstack/react-table"],
  );
});

test("unknown input gives a clear error", async () => {
  const c = await connect();
  const r = await c.callTool({
    name: "get_scheme",
    arguments: { scheme_id: "nope" },
  });
  assert.ok(r.isError && /Unknown scheme/.test(r.content[0].text));
});

test("serves the overview and the five skills as prompts", async () => {
  const c = await connect();
  const { prompts } = await c.listPrompts();
  assert.deepEqual(prompts.map((p) => p.name).sort(), [
    "open-ds",
    "open-ds-build",
    "open-ds-change",
    "open-ds-choose",
    "open-ds-review",
    "open-ds-write",
  ]);
  const p = await c.getPrompt({ name: "open-ds-build" });
  assert.match(p.messages[0].content.text, /when_to_use/);
});

test("Streamable HTTP: health, then initialize and list tools at /mcp", async () => {
  const http = runHttp({ port: 0 });
  await new Promise((r) => http.once("listening", r));
  const base = `http://127.0.0.1:${http.address().port}`;
  try {
    assert.equal(
      (await (await fetch(`${base}/health`)).json()).name,
      "open-ds",
    );
    const post = (body) =>
      fetch(`${base}/mcp`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
        },
        body: JSON.stringify(body),
      }).then((r) => r.json());
    const init = await post({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "t", version: "1" },
      },
    });
    assert.equal(init.result.serverInfo.name, "open-ds");
    const list = await post({ jsonrpc: "2.0", id: 2, method: "tools/list" });
    assert.equal(list.result.tools.length, TOOLS.length);
    assert.equal((await fetch(`${base}/mcp`)).status, 405);
  } finally {
    http.close();
  }
});

// Regressions from the MVP QA cycle (OD-158).
test("plan tools refuse shell text and unknown or empty names", async () => {
  const c = await connect();
  for (const [name, args] of [
    ["plan_create", { scheme_id: "dense-data", dir: "x; rm -rf ~" }],
    ["plan_create", { scheme_id: "dense-data", dir: "my design system" }],
    ["plan_create", { scheme_id: "dense-data", dir: "" }],
    ["plan_create", { scheme_id: "dense-data", dir: "--yes" }],
    ["plan_add", { component: "dialog; rm -rf ~" }],
    ["plan_add", { component: "nope-widget" }],
    ["plan_add", { component: "" }],
  ]) {
    const r = await c.callTool({ name, arguments: args });
    assert.ok(r.isError, `${name} ${JSON.stringify(args)} should fail`);
  }
  const add = await call(c, "plan_add", {
    component: "carousel",
    scheme_id: "dense-data",
  });
  assert.equal(add.in_inventory, false);
});

test("names Object already has are unknown questions, not crashes", async () => {
  const c = await connect();
  for (const name of ["get_answer", "what_moves", "why"])
    for (const q of ["constructor", "toString", "__proto__"]) {
      const args =
        name === "why"
          ? { scheme_id: "dense-data", target: q }
          : { scheme_id: "dense-data", question_id: q };
      const r = await c.callTool({ name, arguments: args });
      assert.ok(
        r.isError && /Unknown question|Nothing called/.test(r.content[0].text),
        `${name}(${q}): ${r.content[0].text}`,
      );
    }
});

test("plans list open-ds.json, and when_to_use says how it matched", async () => {
  const c = await connect();
  assert.ok(
    (await call(c, "plan_create", { scheme_id: "dense-data" })).files.includes(
      "open-ds.json",
    ),
  );
  const init = await call(c, "plan_init", { scheme_id: "dense-data" });
  assert.ok(
    init.files.includes("open-ds.json") && init.files.includes("AGENTS.md"),
  );
  assert.equal(
    (
      await call(c, "when_to_use", {
        scheme_id: "dense-data",
        situation: "number-in-table",
      })
    ).match,
    "exact",
  );
  assert.equal(
    (
      await call(c, "when_to_use", {
        scheme_id: "dense-data",
        situation: "a number in a table",
      })
    ).match,
    "best guess",
  );
});

test("get_context returns only the slice for a token, a task and a component, and get_key carries guidance", async () => {
  const client = await connect();
  const token = await call(client, "get_context", { scheme_id: "dense-data", target: "color.status.danger" });
  assert.equal(token.kind, "semantic");
  assert.equal(token.guidance.id, "color.status.danger.@");
  assert.equal(token.guidance.urgency.level, 3);
  assert.ok(token.guidance.not_for.every((n) => n.use.startsWith("color.")));
  assert.ok(token.values.light.startsWith("#"));
  const review = await call(client, "get_context", { scheme_id: "dense-data", target: "review" });
  assert.equal(review.skill, "open-ds-review");
  assert.ok(review.semantics.length > 30 && review.rules.length > 10);
  const badge = await call(client, "get_context", { scheme_id: "multi-brand", target: "badge" });
  assert.ok(badge.keys.some((k) => k.key === "badge/info/label"));
  const key = await call(client, "get_key", { scheme_id: "dense-data", key: "button/primary/background" });
  assert.equal(key.guidance.id, "color.action.primary.@");
  const bad = await client.callTool({ name: "get_context", arguments: { scheme_id: "dense-data", target: "nope" } });
  assert.ok(bad.isError);
});
