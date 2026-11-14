// A highlighted destructive menu item draws its label on the danger tint. The label reads the danger
// text pair, picked by the tint's tone, and keeps the text floor in every scheme, brand and mode.
import { test } from "node:test";
import assert from "node:assert/strict";
import { assetRoots, loadScheme, schemeIds } from "../src/schemes.mjs";
import { flatten, resolve } from "../src/scheme-checks.mjs";
import { themeTokens } from "../src/tokens.mjs";

const roots = assetRoots();
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("a highlighted destructive label sits on the danger tint above the text floor", () => {
  const low = [];
  for (const id of schemeIds(roots)) {
    const scheme = loadScheme(id, roots);
    for (const comp of ["context-menu", "menubar"]) {
      const key = scheme.tokens.component[comp].item.label["destructive-highlight"];
      assert.equal(key.$extensions?.["open-ds"]?.on, "color.status.danger.subtle", `${id} ${comp} names its fill`);
    }
    for (const brand of Object.keys(scheme.tokens.brands))
      for (const mode of ["light", "dark"]) {
        const all = flatten(themeTokens({ id, tokens: scheme.tokens }, brand, mode));
        const fill = String(resolve(all, "color.status.danger.subtle").value).slice(0, 7);
        for (const comp of ["context-menu", "menubar"]) {
          const text = String(resolve(all, `${comp}.item.label.destructive-highlight`).value).slice(0, 7);
          const r = ratio(text, fill);
          if (r < 4.5) low.push(`${id}/${brand}/${mode} ${comp}: ${r.toFixed(2)}`);
        }
      }
  }
  assert.deepEqual(low, []);
});
