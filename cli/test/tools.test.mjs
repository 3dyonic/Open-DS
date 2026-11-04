// The tools behind the skills (OD-202): check_ui, check_copy, plan_change, find_token, fit_scheme.
import assert from "node:assert/strict";
import { test } from "node:test";
import { grammar, loadScheme, schemeIds } from "../src/schemes.mjs";
import {
  checkCopy,
  checkUi,
  findToken,
  fitScheme,
  planChange,
} from "../src/tools.mjs";

const g = grammar();
const dense = loadScheme("dense-data");

test("checkUi: raw values, components the scheme does not carry, variants it does not use", () => {
  const { pass, findings } = checkUi(dense, g, [
    {
      path: "src/app/page.tsx",
      content: [
        'import { Button } from "@/components/ui/button";',
        'import { Carousel } from "@/components/ui/carousel";',
        'export default () => <div className="bg-red-500 p-[13px]" style={{ color: "#ff0000" }}>',
        '  <Button size="large">Go</Button> <Button size="compact">Ok</Button>',
        "</div>;",
      ].join("\n"),
    },
    {
      path: "src/app/page.css",
      content:
        ":root { --brand: #fff; --gap: 4px }\n.x { margin: 12px; padding: var(--gap, 8px); }",
    },
  ]);
  assert.equal(pass, false);
  const rules = findings.map((f) => `${f.file}:${f.line} ${f.rule}`);
  assert.deepEqual(rules, [
    "src/app/page.css:2 raw-size",
    "src/app/page.tsx:2 not-in-inventory",
    "src/app/page.tsx:3 raw-color",
    "src/app/page.tsx:3 raw-color",
    "src/app/page.tsx:3 raw-size",
    "src/app/page.tsx:4 variant-not-used",
  ]);
  const variant = findings.find((f) => f.rule === "variant-not-used");
  assert.match(variant.message, /size="large"/);
  assert.match(variant.fix, /compact/);
});

test("checkUi: clean code passes, and components and token styles are not checked", () => {
  const { pass } = checkUi(dense, g, [
    {
      path: "src/app/page.tsx",
      content:
        'import { Button } from "@/components/ui/button";\nexport default () => <Button size="compact">Export</Button>;',
    },
    { path: "src/components/ui/button.tsx", content: 'const x = "#123456";' },
    {
      path: "src/styles/open-ds.css",
      content: ".x { color: #000; margin: 3px }",
    },
  ]);
  assert.equal(pass, true);
});

test("checkCopy: the voice's avoid list, exclamation marks and the shape of a button", () => {
  const bad = checkCopy(dense, g, {
    kind: "button",
    text: "Please save it now!",
  });
  assert.deepEqual(bad.findings.map((f) => f.rule).sort(), [
    "avoid-word",
    "button-shape",
    "button-shape",
    "no-exclamation",
  ]);
  assert.equal(bad.situation, "button-label");
  assert.ok(bad.rule.use);
  assert.equal(
    checkCopy(dense, g, { kind: "button", text: "Export" }).pass,
    true,
  );
  assert.equal(
    checkCopy(dense, g, {
      kind: "error",
      text: "Alert ALR-2042 not saved. Threshold must be between 0 and 100.",
    }).pass,
    true,
  );
  assert.equal(
    checkCopy(dense, g, { kind: "error", text: "One. Two. Three." }).findings[0]
      .rule,
    "too-long",
  );
  assert.throws(
    () => checkCopy(dense, g, { kind: "poem", text: "x" }),
    /kind must be/,
  );
});

test("planChange: a new answer lists what follows and the decisions it reopens", () => {
  const p = planChange(dense, g, {
    question: "content.q2",
    option: "moderate",
  });
  assert.equal(p.from.option, "a-lot");
  assert.equal(p.to.option, "moderate");
  assert.ok(p.follows.length > 0);
  assert.ok(
    p.variants.some((v) => v.component === "button" && v.axis === "size"),
  );
  assert.match(p.edits[0], /set the answer to content\.q2 to "moderate"/);
  assert.throws(
    () => planChange(dense, g, { question: "content.q2", option: "nope" }),
    /not an option/,
  );
});

test("planChange: a new color primitive reaches its tokens and checks every pair's contrast", () => {
  const p = planChange(dense, g, {
    token: "color.violet.light.600",
    value: "#9C93F5",
  });
  assert.ok(p.semantic.light.includes("color.action.primary.@"));
  assert.ok(p.component_keys.includes("button/primary/background/@"));
  assert.equal(p.pass, false);
  const onAction = p.pairs.find(
    (x) =>
      x.token === "color.text.on-action" && x.on === "color.action.primary.@",
  );
  assert.ok(onAction.before >= 4.5 && onAction.after < 4.5);
  // The same value keeps every pair.
  assert.equal(
    planChange(dense, g, { token: "color.violet.light.600", value: p.from })
      .pass,
    true,
  );
  assert.throws(
    () => planChange(dense, g, { token: "color.text.primary", value: "#000" }),
    /not a primitive/,
  );
});

test("findToken: the token for an intent, with its guidance", () => {
  const f = findToken(dense, g, "text on the primary button");
  assert.equal(f.results[0].token, "button/primary/label");
  assert.ok(f.results.some((r) => r.token === "color.text.on-action"));
  assert.equal(
    findToken(dense, g, "page background").results[0].token,
    "color.surface.canvas",
  );
  const danger = findToken(dense, g, "error message text");
  assert.ok(danger.results.some((r) => r.token === "color.status.danger.@"));
});

test("fitScheme: ranks the schemes against a product, with the reasons", () => {
  const all = schemeIds().map((id) => loadScheme(id));
  assert.equal(
    fitScheme(
      all,
      "a security operations console where analysts triage alerts",
    )[0].scheme,
    "dense-data",
  );
  assert.equal(
    fitScheme(all, "a magazine where people read long articles")[0].scheme,
    "content-first",
  );
  assert.equal(
    fitScheme(all, "a benefit application for people with low vision")[0]
      .scheme,
    "accessible-first",
  );
  const top = fitScheme(all, "a magazine where people read long articles")[0];
  assert.ok(top.matched.includes("magazine"));
});
