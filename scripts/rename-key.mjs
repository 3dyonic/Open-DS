// Rename a component key (OD-241, OD-243): the key names its part, its property and its state, and
// links to the semantic whose rule covers that job. The old key stays one minor release as a
// deprecated alias of the new one, so a project that reads its CSS variable keeps working.
//
//   node scripts/rename-key.mjs <old-id> <new-id> [--to <semantic>] [--description "<text>"]
//
// Ids are grammar key ids (dropdown-menu/item/sunken). It edits the grammar, every scheme and the
// component's source. Run the tokens and docs builds after.
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { grammar, loadScheme, saveGrammar, saveScheme } from "../cli/src/schemes.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i < 0 ? null : args.splice(i, 2)[1]; };
const to = opt("to");
const description = opt("description");
// Product files carry no ticket keys: the deprecation text names only the replacement.
opt("ticket");
const noSource = args.includes("--no-source") && args.splice(args.indexOf("--no-source"), 1);
const [oldId, newId0] = args;
// A new id that already names a group (trigger/background when trigger/background/hover exists) is
// that group's base, @: the same CSS variable, and the group keeps its keys.
if (!oldId || !newId0) throw new Error("Usage: rename-key.mjs <old-id> <new-id> [--to <semantic>] [--description <text>]");
const read = (p) => readFileSync(ROOT + p, "utf8");
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const segs = (id) => id.split("/");
const cssVar = (id) => `--${segs(id).filter((s) => s !== "@").join("-")}`;
const tokenPath = (id) => `component.${segs(id).join(".")}`;
// How the build sees a component key: the component tree sits at the root of the token tree.
const ref = (id) => segs(id).join(".");

// Grammar: the new key beside the old, which now says what replaces it.
const g = grammar();
const entries = g.component_keys;
const newId = entries.some((e) => e.id.startsWith(`${newId0}/`) && !e.id.endsWith("/@")) ? `${newId0}/@` : newId0;
const entry = entries.find((e) => e.id === oldId);
if (!entry) throw new Error(`No key ${oldId} in the grammar.`);
if (entries.some((e) => e.id === newId)) throw new Error(`${newId} exists already.`);
const comp = g.components.find((c) => c.keys.includes(oldId));
comp.keys.splice(comp.keys.indexOf(oldId), 0, newId);
const semantic = to ?? entry.default;
// A key on the new path that is a token, not a group (button/ghost/background when the new key is
// button/ghost/background/hover), becomes that group's base, @: the same CSS variable, a new id.
const np0 = segs(newId);
const bases = [];
for (let i = 1; i < np0.length; i++) {
  const id = np0.slice(0, i).join("/");
  if (id === oldId) continue;
  const e = entries.find((x) => x.id === id);
  if (!e) continue;
  bases.push(id);
  e.id = `${id}/@`;
  const c = g.components.find((x) => x.keys.includes(id));
  c.keys[c.keys.indexOf(id)] = `${id}/@`;
}
entries.splice(entries.indexOf(entry), 0, {
  id: newId,
  component: entry.component,
  description: description ?? entry.description,
  default: semantic,
});
// The same CSS variable (background-hover → background/hover): the public surface does not change,
// so no alias is kept. An alias would define the variable as itself.
const sameVar = cssVar(oldId) === cssVar(newId);
if (sameVar) {
  entries.splice(entries.indexOf(entry), 1);
  comp.keys.splice(comp.keys.indexOf(oldId), 1);
}
entry.replaced_by = newId;
if (newId.startsWith(`${oldId}/`)) {
  // The old key becomes the base of the new group: its id gains /@ (the same CSS variable).
  comp.keys[comp.keys.indexOf(oldId)] = `${oldId}/@`;
  entry.id = `${oldId}/@`;
}
entry.description = `Deprecated: use ${newId}. ${entry.description}`;
saveGrammar(g);

// Schemes: the new token links the semantic; the old one aliases the new one, marked deprecated.
const at = (tree, path, make = false) =>
  path.reduce((n, k) => (n == null ? n : (n[k] ??= make ? {} : undefined)), tree);
for (const id of SCHEMES) {
  const s = loadScheme(id);
  const tree = s.tokens.component;
  const op = segs(oldId);
  const parent = at(tree, op.slice(0, -1));
  const was = parent?.[op.at(-1)];
  if (!was?.$value) throw new Error(`${id}: no token at ${oldId}.`);
  const np = segs(newId);
  for (const id of bases) {
    const p = segs(id);
    const up = at(tree, p.slice(0, -1));
    up[p.at(-1)] = { "@": up[p.at(-1)] };
  }
  // The new key sits under the old one (link/background → link/background/current): the old token
  // becomes the group's base, @, which ships the same CSS variable.
  const under = newId.startsWith(`${oldId}/`);
  if (under) parent[op.at(-1)] = {};
  const dest = at(tree, np.slice(0, -1), true);
  dest[np.at(-1)] = {
    $value: to ? `{${to}}` : was.$value,
    $description: description ?? was.$description,
    ...(was.$extensions && { $extensions: was.$extensions }),
  };
  if (sameVar) {
    delete parent[op.at(-1)];
    continue;
  }
  const home = under ? parent[op.at(-1)] : parent;
  home[under ? "@" : op.at(-1)] = {
    $value: `{${ref(newId)}}`,
    $description: `Deprecated: use ${tokenPath(newId)}. ${was.$description}`,
    $deprecated: `Use ${tokenPath(newId)}. Removed in the next minor release.`,
  };
  saveScheme(s);
}

if (process.env.OPS_LOG) appendFileSync(process.env.OPS_LOG, `${JSON.stringify({ op: "rename", from: oldId, id: newId0, ...(to && { to }), ...(description && { description }) })}\n`);
if (noSource) {
  console.log(`${oldId} → ${newId}: grammar and ${SCHEMES.length} schemes (source left as it is).`);
  process.exit(0);
}
// Source: the component reads the new CSS variable.
// A key filed under a shared recipe (overlay) lives in the component its id names (tooltip/…).
const own = `ui/src/components/${comp.id}.tsx`;
const file = existsSync(ROOT + own) ? own : `ui/src/components/${segs(oldId)[0]}.tsx`;
const src = read(file);
const n = src.split(`var(${cssVar(oldId)})`).length - 1;
if (!n) throw new Error(`${file} does not read var(${cssVar(oldId)}).`);
writeFileSync(ROOT + file, src.replaceAll(`var(${cssVar(oldId)})`, `var(${cssVar(newId)})`));
console.log(`${oldId} → ${newId}${to ? ` → ${to}` : ""}: grammar, ${SCHEMES.length} schemes, ${file} (${n} reads).`);
