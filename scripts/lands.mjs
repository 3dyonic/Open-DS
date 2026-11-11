// Writes each grammar scope's lands_in from the components' own code (OD-233): every component that
// reads a token the scope owns. The harness (lands-in-traced) fails when the grammar is out of date.
import { readFileSync, writeFileSync } from "node:fs";
import { landsIn } from "../cli/src/lands.mjs";
import { grammar, loadScheme } from "../cli/src/schemes.mjs";

const SCHEMES = [
  "dense-data",
  "content-first",
  "accessible-first",
  "brand-expressive",
  "multi-brand",
];
const g = grammar();
const schemes = SCHEMES.map((id) => loadScheme(id));
const out = landsIn(schemes, g, {
  ui: new URL("../ui/src", import.meta.url).pathname,
  stories: new URL("../storybook/stories", import.meta.url).pathname,
});
// Only each scope's lands_in list changes: the rest of the file keeps its hand formatting.
let text = readFileSync(p, "utf8");
for (const sc of g.scopes) {
  sc.lands_in = out[sc.id];
  const at = text.indexOf(`"id": "${sc.id}",\n      "kind": "scope"`);
  const start = text.indexOf(`"lands_in": [`, at);
  const end = text.indexOf("]", start) + 1;
  const list = sc.lands_in.map((id) => `        "${id}"`).join(",\n");
  text = `${text.slice(0, start)}"lands_in": [\n${list}\n      ]${text.slice(end)}`;
}
if (JSON.stringify(JSON.parse(text)) !== JSON.stringify(g)) throw new Error("lands.mjs: the edited grammar does not match; nothing written.");
writeFileSync(p, text);
console.log(g.scopes.map((s) => `${s.id} ${s.lands_in.length}`).join(", "));
