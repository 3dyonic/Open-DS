// Writes each grammar scope's lands_in from the components' own code (OD-233): every component that
// reads a token the scope owns. The harness (lands-in-traced) fails when the grammar is out of date.
import { landsIn } from "../cli/src/lands.mjs";
import { grammar, loadScheme, saveGrammar, schemeIds } from "../cli/src/schemes.mjs";

const g = grammar();
const schemes = schemeIds().map((id) => loadScheme(id));
const out = landsIn(schemes, g, {
  ui: new URL("../ui/src", import.meta.url).pathname,
  stories: new URL("../storybook/stories", import.meta.url).pathname,
});
for (const sc of g.scopes) sc.lands_in = out[sc.id];
// saveGrammar writes the grammar's one layout, so only the lands_in lists change.
saveGrammar(g);
console.log(g.scopes.map((s) => `${s.id} ${s.lands_in.length}`).join(", "));
