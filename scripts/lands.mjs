// Writes each grammar scope's lands_in from the components' own code (OD-233): every component that
// reads a token the scope owns. The harness (lands-in-traced) fails when the grammar is out of date.
import { readFileSync, writeFileSync } from "node:fs";
import { landsIn } from "../cli/src/lands.mjs";

const SCHEMES = [
  "dense-data",
  "content-first",
  "accessible-first",
  "brand-expressive",
  "multi-brand",
];
const p = new URL("../schemes/grammar.json", import.meta.url);
const g = JSON.parse(readFileSync(p, "utf8"));
const schemes = SCHEMES.map((id) =>
  JSON.parse(
    readFileSync(new URL(`../schemes/${id}.json`, import.meta.url), "utf8"),
  ),
);
const out = landsIn(schemes, g, {
  ui: new URL("../ui/src", import.meta.url).pathname,
  stories: new URL("../storybook/stories", import.meta.url).pathname,
});
for (const sc of g.scopes) sc.lands_in = out[sc.id];
writeFileSync(p, JSON.stringify(g, null, 2) + "\n");
console.log(g.scopes.map((s) => `${s.id} ${s.lands_in.length}`).join(", "));
