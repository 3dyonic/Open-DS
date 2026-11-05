// The Open DS MCP server: every tool, the prompts, and the Streamable HTTP transport.
import assert from "node:assert/strict";
import { test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer, runHttp } from "../src/mcp.mjs";
import { loadScheme } from "../src/schemes.mjs";

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
  "check_copy",
  "check_ui",
  "compare_schemes",
  "find_token",
  "fit_scheme",
  "get_anatomy",
  "get_answer",
  "get_component",
  "get_component_spacing_map",
  "get_context",
  "get_decision_reference",
  "get_gaps",
  "get_inventory",
  "get_key",
  "get_scales",
  "get_scheme",
  "list_schemes",
  "plan_add",
  "plan_change",
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
  // Section all is the full answer as JSON, as before OD-205.
  const token = await call(client, "get_context", {
    scheme_id: "dense-data",
    target: "color.status.danger",
    section: "all",
  });
  assert.equal(token.kind, "semantic");
  assert.equal(token.guidance.id, "color.status.danger.@");
  assert.equal(token.guidance.urgency.level, 3);
  assert.ok(token.guidance.not_for.every((n) => n.use.startsWith("color.")));
  assert.ok(token.values.light.startsWith("#"));
  const review = await call(client, "get_context", {
    scheme_id: "dense-data",
    target: "review",
    section: "all",
  });
  assert.equal(review.skill, "open-ds-review");
  assert.ok(review.semantics.length > 30 && review.rules.length > 10);
  const badge = await call(client, "get_context", {
    scheme_id: "multi-brand",
    target: "badge",
    section: "all",
  });
  assert.ok(badge.keys.some((k) => k.key === "badge/info/label"));
  const key = await call(client, "get_key", {
    scheme_id: "dense-data",
    key: "button/primary/background",
  });
  assert.equal(key.guidance.id, "color.action.primary.@");
  const bad = await client.callTool({
    name: "get_context",
    arguments: { scheme_id: "dense-data", target: "nope" },
  });
  assert.ok(bad.isError);
});

test("get_context is short by default, with sections, pages and file routes (OD-205)", async () => {
  const c = await connect();
  const text = async (args) =>
    (await c.callTool({ name: "get_context", arguments: args })).content[0]
      .text;
  const button = await text({ scheme_id: "dense-data", target: "button" });
  assert.match(button, /^# button \(dense-data\)/);
  assert.match(
    button,
    /secondary, then confirm in a dialog with Button danger/,
  );
  assert.doesNotMatch(button, /#[0-9A-Fa-f]{6}\b/, "no values by default");
  assert.match(button, /More, ask by section:/);
  assert.match(button, /get_context target=button section=/);
  assert.ok(Buffer.byteLength(button) <= 3000);
  const values = await text({
    scheme_id: "dense-data",
    target: "button",
    section: "values",
  });
  assert.match(values, /#[0-9A-Fa-f]{6}/);
  const rules = await text({
    scheme_id: "dense-data",
    target: "build",
    section: "rules",
  });
  assert.match(
    rules,
    /Page 1 of \d+\. Next: get_context target=build section=rules page=2/,
  );
  const second = await text({
    scheme_id: "dense-data",
    target: "build",
    section: "rules",
    page: 2,
  });
  assert.match(second, /Page 2 of/);
  const file = await text({
    scheme_id: "dense-data",
    file: "src/components/ui/dialog.tsx",
  });
  assert.match(file, /components\/dialog\.md/);
  assert.match(file, /# dialog \(dense-data\)/);
  const bad = await c.callTool({
    name: "get_context",
    arguments: { scheme_id: "dense-data", target: "button", section: "nope" },
  });
  assert.ok(bad.isError);
});

test("get_component: the reference next to each scheme's decisions (OD-185)", async () => {
  const c = await connect();
  const dense = await call(c, "get_component", {
    scheme_id: "dense-data",
    component: "button",
  });
  assert.equal(dense.carried, true);
  assert.match(dense.reference.overview, /commits an action/);
  assert.ok(dense.reference.vs.some((v) => v.id === "toggle"));
  const ghost = (g) =>
    g.variants.find((v) => v.axis === "variant" && v.id === "ghost");
  assert.match(ghost(dense).here.use, /Row actions/);
  // The same component, decided differently: Accessible first does not use ghost.
  const af = await call(c, "get_component", {
    scheme_id: "accessible-first",
    component: "button",
  });
  assert.equal(ghost(af).here.not_used, true);
  assert.ok(af.rules.some((r) => r.situation === "commit-action"));
  // get_context on a component carries the same two layers.
  const ctx = await call(c, "get_context", {
    scheme_id: "dense-data",
    target: "button",
    section: "all",
  });
  assert.ok(ctx.reference && ctx.variants.length >= 9);
  const bad = await c.callTool({
    name: "get_component",
    arguments: { scheme_id: "dense-data", component: "nope" },
  });
  assert.ok(bad.isError);
});

test("get_gaps and get_component: where the decision trace breaks (OD-243)", async () => {
  const c = await connect();
  const all = await call(c, "get_gaps", { scheme_id: "dense-data" });
  assert.deepEqual(
    all.kinds.map((k) => k.id),
    [
      "key-hides-part",
      "key-hides-state",
      "wrong-semantic",
      "two-jobs",
      "rule-not-written",
      "borrows-a-key",
      "reads-the-system",
      "nested-corner",
      "skips-a-component",
      "pick-without-reason",
    ],
  );
  for (const k of all.kinds) assert.equal(all.counts[k.id], all.gaps.filter((x) => x.kind === k.id).length);
  // OD-241 fixed the menu: its keys name their part and state, and link the semantic whose rule covers them.
  const menu = await call(c, "get_gaps", { scheme_id: "dense-data", component: "dropdown-menu" });
  assert.equal(menu.gaps.filter((x) => x.component === "dropdown-menu").length, 0);
  // A shared gap still names the components it touches: border.default also paints the sidebar rail.
  for (const x of menu.gaps) assert.ok(x.kind === "two-jobs" || x.kind === "rule-not-written");
  // A filter by kind returns only that kind.
  const wrong = await call(c, "get_gaps", { scheme_id: "dense-data", kind: "wrong-semantic" });
  assert.ok(wrong.gaps.length > 0 && wrong.gaps.every((x) => x.kind === "wrong-semantic"));
  // get_component carries the same gaps, so an agent sees them before it builds.
  const comp = await call(c, "get_component", { scheme_id: "dense-data", component: "dropdown-menu" });
  assert.equal(comp.gaps.length, menu.gaps.length);
  const bad = await c.callTool({ name: "get_gaps", arguments: { scheme_id: "dense-data", component: "nope" } });
  assert.ok(bad.isError);
});

test("get_anatomy: the parts people see and how each decision reaches them (OD-229)", async () => {
  const c = await connect();
  const menu = await call(c, "get_anatomy", { scheme_id: "dense-data", component: "dropdown-menu" });
  assert.equal(menu.parts_layer, true);
  const flat = (l) => l.flatMap((p) => [p, ...flat(p.children ?? [])]);
  const parts = flat(menu.parts);
  assert.equal(parts.filter((p) => p.n).length, 11);
  assert.ok(parts.find((p) => p.id === "shortcut").no_token_yet);
  const hl = menu.cards.find((k) => k.title === "Highlight fill");
  assert.equal(hl.tokens[0].semantic, "color.surface.highlight");
  assert.match(hl.tokens[0].light.why, /neutral\.100/);
  assert.ok(hl.answers.some((a) => a.question === "accessibility.roles"));
  // get_component only points at it.
  const comp = await call(c, "get_component", { scheme_id: "dense-data", component: "dropdown-menu" });
  assert.deepEqual(comp.anatomy, { parts_layer: true, see: "get_anatomy dropdown-menu" });
  // A component without a parts layer says so.
  const btn = await call(c, "get_anatomy", { scheme_id: "dense-data", component: "button" });
  assert.equal(btn.parts_layer, false);
});

test("get_component on a left-out component: what to use instead and the answers behind it (OD-212)", async () => {
  const c = await connect();
  const s = loadScheme("dense-data");
  const left = s.inventory.out[0];
  const r = await call(c, "get_component", {
    scheme_id: "dense-data",
    component: left.id,
  });
  assert.equal(r.carried, false);
  assert.equal(r.why, left.why);
  assert.deepEqual(
    r.instead.map((x) => x.id),
    left.instead,
  );
  const kept = new Set(s.inventory.in.map((x) => x.id));
  assert.ok(r.instead.every((x) => kept.has(x.id) && x.what));
  assert.deepEqual(r.because, left.because);
  // A kept component carries neither.
  const b = await call(c, "get_component", {
    scheme_id: "dense-data",
    component: "button",
  });
  assert.equal(b.instead, undefined);
});

test("what_moves lists the variant decisions and rules an answer drives (OD-185)", async () => {
  const c = await connect();
  const m = await call(c, "what_moves", {
    scheme_id: "multi-brand",
    question_id: "accessibility.values",
  });
  assert.ok(
    m.variants.some(
      (v) =>
        v.component === "button" &&
        v.axis === "size" &&
        v.variant === "compact" &&
        v.not_used,
    ),
  );
  assert.ok(m.rules.some((r) => r.situation === "smallest-target"));
});

test("the tools behind the skills answer through the server (OD-202)", async () => {
  const c = await connect();
  const ui = await call(c, "check_ui", {
    scheme_id: "dense-data",
    files: [
      { path: "src/app/page.tsx", content: '<Button size="large">Go</Button>' },
    ],
  });
  assert.equal(ui.pass, false);
  assert.equal(ui.findings[0].rule, "variant-not-used");
  const copy = await call(c, "check_copy", {
    scheme_id: "dense-data",
    kind: "button",
    text: "Export",
  });
  assert.equal(copy.pass, true);
  const plan = await call(c, "plan_change", {
    scheme_id: "dense-data",
    token: "color.violet.light.600",
    value: "#9C93F5",
  });
  assert.equal(plan.pass, false);
  const token = await call(c, "find_token", {
    scheme_id: "dense-data",
    query: "page background",
  });
  assert.equal(token.results[0].token, "color.surface.canvas");
  const fit = await call(c, "fit_scheme", {
    product: "a magazine where people read long articles",
  });
  assert.equal(fit[0].scheme, "content-first");
  const bad = await c.callTool({
    name: "plan_change",
    arguments: { scheme_id: "dense-data", question_id: "content.q2" },
  });
  assert.ok(bad.isError);
});

test("every server sends its instructions when an agent connects (OD-204)", async () => {
  // The local stdio server and the hosted HTTP server are built by the same createMcpServer.
  const c = await connect();
  const text = c.getInstructions();
  assert.match(text, /check_ui/);
  assert.match(text, /fit_scheme/);
  assert.match(text, /plan_change/);
  // The read-once text, the same as in AGENTS.md and context/README.md (OD-205).
  const { READ_ONCE } = await import("../src/brief.mjs");
  assert.ok(text.endsWith(READ_ONCE));
});

test("get_scales returns a hue's steps and the tokens on them", async () => {
  const client = await connect();
  const out = await call(client, "get_scales", {
    scheme_id: "dense-data",
    hue: "violet",
  });
  assert.equal(out.hues[0].hue, "violet");
  assert.ok(
    out.hues[0].steps.some((x) =>
      x.tokens.some((t) => t.token === "action.primary"),
    ),
  );
});

test("the decision reference: every answer with what it decided, the same as the docs page (OD-239)", async () => {
  const c = await connect();
  const ref = await call(c, "get_decision_reference", {
    scheme_id: "dense-data",
  });
  // 79: brand.q3, the typeface, joined the reasons (OD-245).
  assert.equal(ref.answers, 79);
  const face = ref.sections.flatMap((s) => s.questions).find((x) => x.id === "brand.q3");
  assert.equal(face.considers.length, 11);
  assert.ok(face.considers.every((k) => k.how));
  assert.ok(face.decided.picks.some((d) => d.token === "type.data.font-family"));
  const q = ref.sections
    .flatMap((s) => s.questions)
    .find((x) => x.id === "content.q1");
  assert.equal(q.answer, "Numbers and records");
  assert.ok(q.because.length);
  assert.ok(
    q.decided.answers.length &&
      q.decided.rules.length &&
      q.decided.variants.length,
  );
  assert.match(q.decided.rules[0].text, /^For a status, use /);
  const one = await call(c, "get_decision_reference", {
    scheme_id: "dense-data",
    question_id: "spacing.values",
  });
  assert.deepEqual(
    one.sections.map((s) => s.id),
    ["spacing"],
  );
  const answer = await call(c, "get_answer", {
    scheme_id: "dense-data",
    question_id: "content.q2",
  });
  assert.ok(answer.decided.rules.length);
});
