import assert from "node:assert/strict";
import { test } from "node:test";
import { cvaVariants, processWords, tokenApiGaps } from "../checks.mjs";

test("process words: a ticket key, the owner, the harness, a ticket and a pull request are found", () => {
  const text = [
    "// Fixed in OD-12 and ORC-3.",
    "The owner decided this.",
    "The harness checks that it holds.",
    "See the ticket.",
    "Merged in PR 214.",
    "A plain sentence for a user.",
  ].join("\n");
  const found = processWords("ui/src/x.tsx", text).map((x) => `${x.line} ${x.word}`);
  assert.deepEqual(found, ["1 ticket key", "1 ticket key", "2 owner", "3 harness", "4 ticket", "5 pull request"]);
});

test("process words: identifiers and the known-shortfall field pass", () => {
  assert.deepEqual(processWords("cli/src/x.mjs", "const ownerOf = (g) => g; // pr-[var(--x)]"), []);
  const scheme = JSON.stringify({ tone: "light", waits: { for: "OD-225", why: "A brand decision." } });
  assert.deepEqual(processWords("fixture/x.json", scheme), []);
  assert.equal(processWords("fixture/x.json", JSON.stringify({ why: "Fixed in OD-1." })).length, 1);
});

test("cva variants: every axis and option of every variants block", () => {
  const src = `const a = cva("x", {
    variants: {
      variant: {
        primary: "bg-[var(--a)]",
        "ghost": "hover:bg-[var(--b)]",
      },
      size: { default: "h-8" },
    },
  });
  const b = cva("y", {
    variants: {
      align: {
        start: "x",
      },
    },
  });`;
  assert.deepEqual(cvaVariants("button", src), ["button/variant/primary", "button/variant/ghost", "button/align/start"]);
});

test("token api: a name the approved list lacks fails with the approval message", () => {
  const approved = { component_keys: ["button/label"], variants: [], semantic_tokens: ["color.text.primary"] };
  const current = { component_keys: ["button/label", "button/glow"], variants: ["button/variant/loud"], semantic_tokens: ["color.text.primary"] };
  assert.deepEqual(tokenApiGaps(current, approved), [
    "button/glow is new; add it to harness/token-api.json only with the owner's approval.",
    "button/variant/loud is new; add it to harness/token-api.json only with the owner's approval.",
  ]);
  assert.deepEqual(tokenApiGaps(approved, approved), []);
});
