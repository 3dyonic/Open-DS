// Add a component key (OD-229, OD-243): a part that read another component's key or the system
// directly gets one of its own, linked to the semantic whose rule covers its job.
//
//   node scripts/add-key.mjs <id> --to <semantic> --description "<text>"
//
// It edits the grammar and every scheme. The component's source then reads var(--<id with - for />).
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? null : args.splice(i, 2)[1]; };
const to = opt("to");
const description = opt("description");
const [id] = args;
if (!id || !to || !description) throw new Error('Usage: add-key.mjs <id> --to <semantic> --description "<text>"');
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const comp = id.split("/")[0];

const g = read("schemes/grammar.json");
if (g.component_keys.some((e) => e.id === id)) throw new Error(`${id} exists already.`);
const c = g.components.find((x) => x.id === comp);
if (!c) throw new Error(`No component ${comp} in the grammar.`);
c.keys.push(id);
const last = g.component_keys.map((e) => e.component).lastIndexOf(comp);
g.component_keys.splice(last + 1, 0, { id, component: comp, description, default: to });
write("schemes/grammar.json", g);

for (const s of SCHEMES) {
  const sc = read(`schemes/${s}.json`);
  const path = id.split("/");
  let n = sc.tokens.component;
  for (const k of path.slice(0, -1)) n = n[k] ??= {};
  if (n[path.at(-1)]?.$value) throw new Error(`${s}: a token is at ${id} already.`);
  n[path.at(-1)] = { $value: `{${to}}`, $description: description };
  write(`schemes/${s}.json`, sc);
}
console.log(`${id} → ${to}: grammar and ${SCHEMES.length} schemes. Read it as var(--${id.split("/").filter((x) => x !== "@").join("-")}).`);
