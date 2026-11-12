// Quality gate, simulated component pairs (OD-298): the pairs a component draws, read from its source,
// resolved on base and candidate, and flagged when a side moves past a tier, a WCAG level drops or the
// difference falls below the floor.
import { test } from "node:test";
import assert from "node:assert/strict";
import { componentPairRows, componentPairsSheet, relative } from "../src/quality/criteria/component-pairs.mjs";
import { componentPairsOf, pairsOfSource } from "../src/quality/component-pairs.mjs";
import { DEFAULT_PARAMS, paramsFrom } from "../src/quality/params.mjs";
import { compareSnapshots } from "../src/quality/scorecard.mjs";
import { cleanUi, fixtureScheme, snapshotOf, valueOf } from "./quality-fixture.mjs";

const P = DEFAULT_PARAMS;
const SOURCE = `
const button = cva("rounded focus-visible:ring-[color:var(--button-focus-ring)] border-[var(--button-border)] text-[length:var(--button-size)]", {
  variants: {
    variant: {
      solid: "bg-[var(--button-background)] text-[var(--button-label)] hover:bg-[var(--button-background-hover)]",
      ghost: "text-[var(--button-label)]",
    },
  },
});`;

// The fixture with a button whose keys read the fixture's semantics.
function withButton() {
  const s = fixtureScheme();
  s.tokens.component.button = {
    background: { "@": { $value: "{color.surface.default}" }, hover: { $value: "{color.surface.raised}" } },
    label: { $value: "{color.text.primary}" },
    border: { $value: "{color.surface.sunken}" },
    "focus-ring": { $value: "{color.action.primary.@}" },
  };
  // A key with variants keeps its base at "@": --button-background and --button-background-hover.
  return s;
}
const snap = (s) => snapshotOf(s, { ui: { ...cleanUi(), pairs: pairsOfSource("button", SOURCE) } });

test("the pairs a component draws: text on its fill per state, ghost text on the page, border and ring on the page", () => {
  assert.deepEqual(
    pairsOfSource("button", SOURCE).map((p) => `${p.state} ${p.role} ${p.fg} on ${p.bg ?? "page"}`),
    [
      "focus-visible focus button-focus-ring on page",
      "rest border button-border on page",
      "rest text button-label on button-background",
      "hover text button-label on button-background-hover",
      "rest text button-label on page",
    ],
  );
  // only component files count
  assert.equal(componentPairsOf([{ file: "ui/src/lib/x.tsx", text: SOURCE }]).length, 0);
  assert.equal(componentPairsOf([{ file: "ui/src/components/button.tsx", text: SOURCE }]).length, 5);
});

test("unchanged colors flag nothing, and every pair resolves in both themes", () => {
  const rows = componentPairRows(snap(withButton()), snap(withButton()), P);
  assert.equal(rows.length, 10);
  assert.equal(rows.filter((r) => r.flagged).length, 0);
  for (const r of relative(snap(withButton()), snap(withButton()), P)) assert.equal(r.value, 0, r.id);
});

test("dimmer dark text drops a WCAG level on 3 pairs and flags the component", () => {
  const s = withButton();
  s.tokens.brands.default.theme.dark.color.text.primary.$value = "{color.gray.dark.300}";
  const r = relative(snap(withButton()), snap(s), P);
  assert.equal(valueOf(r, "component-pairs.level-drops"), 3);
  // the dark hover pair also falls to ΔE 0.098, under the 0.1 floor
  assert.equal(valueOf(r, "component-pairs.difference-shrunk"), 1);
  assert.equal(valueOf(r, "component-pairs.moved"), 3);
  assert.deepEqual(r.find((m) => m.id === "component-pairs.flagged-components").details, ["button"]);
  assert.ok(compareSnapshots(snap(withButton()), snap(s)).failed.includes("component-pairs.level-drops"));
  // with a higher floor the same change also shrinks the difference below it
  assert.equal(valueOf(relative(snap(withButton()), snap(s), paramsFrom({ componentPairs: { minDifference: 0.5 } })), "component-pairs.difference-shrunk"), 3);
});

test("a fill that moves into the review tier is flagged with no level drop", () => {
  const s = withButton();
  s.tokens.brands.default.theme.light.color.surface.default.$value = "{color.gray.light.50}";
  const rows = componentPairRows(snap(withButton()), snap(s), P).filter((x) => x.flagged);
  assert.deepEqual(
    rows.map((x) => [x.theme, x.state, x.role, x.tier, x.levelDrop, x.shrunk]),
    [["light", "rest", "text", "review", false, false]],
  );
});

test("the review sheet lists only the flagged pairs, with hex swatches before and after", () => {
  const s = withButton();
  s.tokens.brands.default.theme.light.color.surface.default.$value = "{color.gray.light.50}";
  const rows = componentPairRows(snap(withButton()), snap(s), P);
  const sheet = componentPairsSheet(rows, { base: "base", candidate: "candidate" });
  assert.match(sheet, /1 of 10 pairs are flagged, in 1 components/);
  assert.match(sheet, /## button/);
  assert.match(sheet, /\| fixture\/light \| rest \| text: `--button-label` on `--button-background` \| `#161B23` on `#FFFFFF` \| `#161B23` on `#F7F8FA` \| 17\.\d\d → 16\.\d\d \|/);
  assert.equal((sheet.match(/^\| fixture/gm) ?? []).length, 1);
  assert.match(componentPairsSheet([], { base: "a", candidate: "b" }), /No pair is flagged\./);
});
