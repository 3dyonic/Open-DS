// The engine's trace (the token map, the decision tree, the agent tools) shows the value the build
// ships, for every semantic and component token, in every scheme, brand and mode.
import { test } from "node:test";
import assert from "node:assert/strict";
import { aliasChain, tokenIndex } from "../src/lands.mjs";
import { assetRoots, loadScheme, schemeIds } from "../src/schemes.mjs";
import { flatten, resolve } from "../src/scheme-checks.mjs";
import { flatTokens, themeTokens } from "../src/tokens.mjs";

const roots = assetRoots();

test("the engine and the build give every token the same value", () => {
  const differ = [];
  let compared = 0;
  for (const id of schemeIds(roots)) {
    const scheme = loadScheme(id, roots);
    for (const brand of Object.keys(scheme.tokens.brands))
      for (const mode of ["light", "dark"]) {
        const index = tokenIndex(scheme, { brand, mode });
        const built = flatten(themeTokens({ id, tokens: scheme.tokens }, brand, mode));
        const paths = [
          ...flatTokens(scheme.tokens.semantic).map(([p]) => [p, p]),
          ...flatTokens(scheme.tokens.component).map(([p]) => [`component.${p}`, p]),
        ];
        for (const [enginePath, buildPath] of paths) {
          compared++;
          const engine = JSON.stringify(aliasChain(index, enginePath).value);
          const build = JSON.stringify(resolve(built, buildPath).value);
          if (engine !== build) differ.push(`${id}/${brand}/${mode} ${buildPath}: engine ${engine}, build ${build}`);
        }
      }
  }
  assert.ok(compared > 20000, `compared ${compared}`);
  assert.deepEqual(differ, []);
});

test("a dark badge label reads the text made for its dark fill", () => {
  const scheme = loadScheme("dense-data", roots);
  const index = tokenIndex(scheme, { brand: "default", mode: "dark" });
  const hops = aliasChain(index, "component.badge.danger.label").hops;
  assert.ok(hops.some((h) => /danger-on-dark$/.test(h)), hops.join(" → "));
});
