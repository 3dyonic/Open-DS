// Link a component key to another semantic (OD-243): the key keeps its name and CSS variable, and
// follows the semantic whose rule covers its job. Edits the grammar's default and every scheme.
//
//   node scripts/link-key.mjs <id> --to <semantic> [--description "<text>"]
//
// Ids are grammar key ids (menubar/trigger/radius). Run the tokens and docs builds after.
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { grammar, loadScheme, saveGrammar, saveScheme } from "../cli/src/schemes.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? null : args.splice(i, 2)[1]; };
const to = opt("to");
const description = opt("description");
const [id] = args;
if (!id || !to) throw new Error('Usage: link-key.mjs <id> --to <semantic> [--description "<text>"]');
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);

const g = grammar();
const e = g.component_keys.find((x) => x.id === id);
if (!e) throw new Error(`No key ${id} in the grammar.`);
if (e.replaced_by) throw new Error(`${id} is deprecated; link ${e.replaced_by} instead.`);
const from = e.default;
e.default = to;
if (description) e.description = description;
saveGrammar(g);

for (const s of SCHEMES) {
  const sc = loadScheme(s);
  const n = id.split("/").reduce((o, k) => o?.[k], sc.tokens.component);
  if (!n?.$value) throw new Error(`${s}: no token at component.${id.replaceAll("/", ".")}`);
  n.$value = `{${to}}`;
  if (description) n.$description = description;
  saveScheme(sc);
}
if (process.env.OPS_LOG) appendFileSync(process.env.OPS_LOG, `${JSON.stringify({ op: "link", id, to, ...(description && { description }) })}\n`);
console.log(`${id}: ${from} → ${to}, grammar and ${SCHEMES.length} schemes.`);
