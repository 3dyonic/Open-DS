// OD-309: a component key may read a palette step of its own scheme, with a why. The build reads that
// step from the active mode's ramp. A raw value, a step with no why and a step of a hue the scheme does
// not define still break the rule, in the scheme checks and in the gap ledger.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, grammar, loadScheme } from "../src/schemes.mjs";
import { componentLinks } from "../src/scheme-checks.mjs";
import { componentGaps } from "../src/gaps.mjs";
import { componentsInMode, themeTokens } from "../src/tokens.mjs";

const roots = assetRoots();
const g = grammar(roots);
// A copy under its own id, so the gap cache does not answer for the real scheme.
const copy = (tag, change) => {
  const s = structuredClone(loadScheme("brand-expressive", roots));
  s.id = `brand-expressive-${tag}`;
  change(s.tokens.component);
  return s;
};

test("Brand expressive's palette steps with a why pass the component-key rule", () => {
  assert.deepEqual(componentLinks(loadScheme("brand-expressive", roots)), []);
});

test("a raw hex in a component key fails the rule", () => {
  const s = copy(
    "hex",
    (c) => (c.button.secondary.background["@"].$value = "#FFCCDC"),
  );
  assert.match(
    componentLinks(s).join("\n"),
    /component\.button\.secondary\.background\.@ holds the raw value "#FFCCDC"/,
  );
});

test("a palette step with no why fails the rule and the gap ledger", () => {
  const s = copy(
    "no-why",
    (c) => delete c.tabs.trigger.background.current.$extensions,
  );
  assert.match(
    componentLinks(s).join("\n"),
    /tabs\.trigger\.background\.current reads the palette step color\.pink\.light\.200 with no why/,
  );
  const gap = componentGaps(s, g, roots).find(
    (x) => x.key === "component.tabs.trigger.background.current",
  );
  assert.equal(gap?.kind, "wrong-semantic");
});

test("a step of a hue the scheme does not define fails the rule", () => {
  const s = copy(
    "hue",
    (c) =>
      (c.tabs.trigger.background.current.$value = "{color.teal.light.200}"),
  );
  assert.match(
    componentLinks(s).join("\n"),
    /reads color\.teal\.light\.200, a hue the scheme does not define/,
  );
});

test("a palette step with a why raises no wrong-semantic gap", () => {
  const gaps = componentGaps(loadScheme("brand-expressive", roots), g, roots);
  assert.equal(
    gaps.filter(
      (x) =>
        x.kind === "wrong-semantic" && /color\.pink\./.test(x.aliases ?? ""),
    ).length,
    0,
  );
});

test("the build reads a component key's step from the active mode's ramp", () => {
  const tree = {
    a: { $value: "{color.pink.light.200}" },
    b: { $value: "{color.text.primary}" },
  };
  assert.equal(
    componentsInMode(tree, "dark").a.$value,
    "{color.pink.dark.200}",
  );
  assert.equal(
    componentsInMode(tree, "light").a.$value,
    "{color.pink.light.200}",
  );
  assert.equal(componentsInMode(tree, "dark").b.$value, "{color.text.primary}");
  const s = loadScheme("brand-expressive", roots);
  const dark = themeTokens(s, "default", "dark");
  assert.equal(
    dark.tabs.trigger.background.current.$value,
    "{color.pink.dark.200}",
  );
});
