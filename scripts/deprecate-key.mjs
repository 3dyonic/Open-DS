// Deprecate a component key whose job moved to a key of another kind (OD-243): the old key keeps its
// own value for one minor release, so a project that reads it keeps working, and says what replaces it.
// Use rename-key.mjs instead when the new key does the same job (it aliases the old to the new).
//
//   node scripts/deprecate-key.mjs <old-id> --by <new-id> [--ticket OD-243]
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i < 0 ? null : args.splice(i, 2)[1]; };
const by = opt("by");
const ticket = opt("ticket") ?? "OD-243";
const [id] = args;
if (!id || !by) throw new Error("Usage: deprecate-key.mjs <old-id> --by <new-id>");
const read = (p) => JSON.parse(readFileSync(ROOT + p, "utf8"));
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);

const g = read("schemes/grammar.json");
const e = g.component_keys.find((x) => x.id === id);
if (!e) throw new Error(`No key ${id}.`);
if (!g.component_keys.some((x) => x.id === by)) throw new Error(`No key ${by}; add it first.`);
e.replaced_by = by;
if (!e.description.startsWith("Deprecated")) e.description = `Deprecated: use ${by} (${ticket}). ${e.description}`;
write("schemes/grammar.json", g);
for (const s of SCHEMES) {
  const sc = read(`schemes/${s}.json`);
  const n = id.split("/").reduce((o, k) => o?.[k], sc.tokens.component);
  if (!n?.$value) throw new Error(`${s}: no token at ${id}`);
  n.$description = e.description;
  n.$deprecated = `Use component.${by.replaceAll("/", ".")}. Removed in the next minor release.`;
  write(`schemes/${s}.json`, sc);
}
if (process.env.OPS_LOG) appendFileSync(process.env.OPS_LOG, `${JSON.stringify({ op: "deprecate", id, by })}\n`);
console.log(`${id}: deprecated, replaced by ${by}; it keeps its own value until the next minor release.`);
