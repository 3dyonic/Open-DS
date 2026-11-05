// Move a component key that was never released (OD-243): a new id, no deprecated alias left behind.
// For a released key use rename-key.mjs, which keeps the old CSS variable working for a minor release.
//
//   node scripts/move-key.mjs <old-id> <new-id> [--description "<text>"]
//
// Edits the grammar, every scheme and the component's source.
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? null : args.splice(i, 2)[1]; };
const description = opt("description");
const noSource = args.includes("--no-source") && args.splice(args.indexOf("--no-source"), 1);
const [oldId, newId] = args;
if (!oldId || !newId) throw new Error('Usage: move-key.mjs <old-id> <new-id> [--description "<text>"]');
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const cssVar = (id) => `--${id.split("/").filter((s) => s !== "@").join("-")}`;
const comp = oldId.split("/")[0];

const g = read("schemes/grammar.json");
const e = g.component_keys.find((x) => x.id === oldId);
if (!e) throw new Error(`No key ${oldId}.`);
if (g.component_keys.some((x) => x.id === newId)) throw new Error(`${newId} exists already.`);
e.id = newId;
if (description) e.description = description;
for (const c of g.components) c.keys = c.keys.map((k) => (k === oldId ? newId : k));
write("schemes/grammar.json", g);

for (const s of SCHEMES) {
  const sc = read(`schemes/${s}.json`);
  const from = oldId.split("/");
  const parent = from.slice(0, -1).reduce((o, k) => o?.[k], sc.tokens.component);
  const node = parent?.[from.at(-1)];
  if (!node?.$value) throw new Error(`${s}: no token at ${oldId}`);
  delete parent[from.at(-1)];
  const to = newId.split("/");
  let n = sc.tokens.component;
  for (const k of to.slice(0, -1)) n = n[k] ??= {};
  if (description) node.$description = description;
  n[to.at(-1)] = node;
  write(`schemes/${s}.json`, sc);
}

if (process.env.OPS_LOG) appendFileSync(process.env.OPS_LOG, `${JSON.stringify({ op: "move", from: oldId, id: newId, ...(description && { description }) })}\n`);
if (noSource) {
  console.log(`${oldId} → ${newId}: grammar and ${SCHEMES.length} schemes (source left as it is).`);
  process.exit(0);
}
const file = `${ROOT}ui/src/components/${comp}.tsx`;
const src = readFileSync(file, "utf8");
const re = new RegExp(`var\\(${cssVar(oldId).replace(/-/g, "\\-")}\\)`, "g");
const reads = src.match(re)?.length ?? 0;
writeFileSync(file, src.replace(re, `var(${cssVar(newId)})`));
console.log(`${oldId} → ${newId}: grammar, ${SCHEMES.length} schemes, ${comp}.tsx (${reads} reads). No alias: it was never released.`);
