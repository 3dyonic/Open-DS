import assert from "node:assert/strict";
import { test } from "node:test";
import { cvaVariants, layerOrderGaps, layerSharedGaps, processWords, rawLayerGaps, rawZIndexes, tokenApiGaps } from "../checks.mjs";

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

const LAYERS = { sticky: 100, backdrop: 1000, modal: 1100, dropdown: 1200, toast: 1300, tooltip: 1400 };

test("layer order: a toast below the modal and a name outside the order are found", () => {
  assert.deepEqual(layerOrderGaps("a", [{ theme: "light", values: LAYERS, extra: [] }]), []);
  const low = { ...LAYERS, toast: 1050 };
  assert.deepEqual(layerOrderGaps("a", [{ theme: "light", values: low, extra: ["overlay"] }]), [
    "a: layer.overlay is not in the order sticky < backdrop < modal < dropdown < toast < tooltip",
    "a/light: layer.toast (1050) is not above layer.dropdown (1200)",
  ]);
  assert.deepEqual(layerOrderGaps("a", [{ theme: "light", values: { ...LAYERS, modal: undefined }, extra: [] }]), ["a/light: layer.modal is not a number"]);
});

test("layer values: a scheme that stacks at other numbers is found, even in order", () => {
  const same = { a: [{ theme: "light", values: LAYERS }], b: [{ theme: "dark", values: LAYERS }] };
  assert.deepEqual(layerSharedGaps(same), []);
  const own = { ...same, c: [{ theme: "light", values: { ...LAYERS, sticky: 10 } }] };
  assert.deepEqual(layerSharedGaps(own), ["c/light: layer.sticky is 10, a has 100"]);
});

test("raw stack numbers: classes with variants, arbitrary numbers and inline styles; a layer key is not one", () => {
  const src = `cn("fixed z-50 p-2", "focus-visible:z-10 [&>*]:focus:z-20", "top-full z-[1]", "z-[var(--dialog-layer)]"); const s = { zIndex: 30 };`;
  assert.deepEqual(rawZIndexes(src), ["z-50", "z-10", "z-20", "z-[1]", "zIndex: 30"]);
  assert.deepEqual(rawLayerGaps({ "a.tsx": `"z-10"` }, { "a.tsx: z-10": "local" }), []);
  assert.deepEqual(rawLayerGaps({ "a.tsx": `"z-50"` }, { "b.tsx: z-10": "local" }), [
    "a.tsx: z-50 is a raw stack number; read the component's layer key",
    "b.tsx: z-10 is allowed as local stacking, and no component has it",
  ]);
});
