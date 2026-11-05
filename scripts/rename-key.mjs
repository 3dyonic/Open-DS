// Rename a component key (OD-241, OD-243): the key names its part, its property and its state, and
// links to the semantic whose rule covers that job. The old key stays one minor release as a
// deprecated alias of the new one, so a project that reads its CSS variable keeps working.
//
//   node scripts/rename-key.mjs <old-id> <new-id> [--to <semantic>] [--description "<text>"] [--ticket OD-241]
//
// Ids are grammar key ids (dropdown-menu/item/sunken). It edits the grammar, every scheme and the
// component's source. Run the tokens and docs builds after.
import { readFileSync, writeFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive", "multi-brand"];
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i < 0 ? null : args.splice(i, 2)[1]; };
const to = opt("to");
const description = opt("description");
const ticket = opt("ticket") ?? "OD-241";
const [oldId, newId] = args;
if (!oldId || !newId) throw new Error("Usage: rename-key.mjs <old-id> <new-id> [--to <semantic>] [--description <text>]");
const read = (p) => readFileSync(ROOT + p, "utf8");
const write = (p, o) => writeFileSync(ROOT + p, `${JSON.stringify(o, null, 2)}\n`);
const segs = (id) => id.split("/");
const cssVar = (id) => `--${segs(id).filter((s) => s !== "@").join("-")}`;
const tokenPath = (id) => `component.${segs(id).join(".")}`;
// How the build sees a component key: the component tree sits at the root of the token tree.
const ref = (id) => segs(id).join(".");

// Grammar: the new key beside the old, which now says what replaces it.
const g = JSON.parse(read("schemes/grammar.json"));
const entries = g.component_keys;
const entry = entries.find((e) => e.id === oldId);
if (!entry) throw new Error(`No key ${oldId} in the grammar.`);
if (entries.some((e) => e.id === newId)) throw new Error(`${newId} exists already.`);
const comp = g.components.find((c) => c.keys.includes(oldId));
comp.keys.splice(comp.keys.indexOf(oldId), 0, newId);
const semantic = to ?? entry.default;
entries.splice(entries.indexOf(entry), 0, {
  id: newId,
  component: entry.component,
  description: description ?? entry.description,
  default: semantic,
});
entry.replaced_by = newId;
if (newId.startsWith(`${oldId}/`)) {
  // The old key becomes the base of the new group: its id gains /@ (the same CSS variable).
  comp.keys[comp.keys.indexOf(oldId)] = `${oldId}/@`;
  entry.id = `${oldId}/@`;
}
entry.description = `Deprecated: use ${newId} (${ticket}). ${entry.description}`;
write("schemes/grammar.json", g);

// Schemes: the new token links the semantic; the old one aliases the new one, marked deprecated.
const at = (tree, path, make = false) =>
  path.reduce((n, k) => (n == null ? n : (n[k] ??= make ? {} : undefined)), tree);
for (const id of SCHEMES) {
  const s = JSON.parse(read(`schemes/${id}.json`));
  const tree = s.tokens.component;
  const op = segs(oldId);
  const parent = at(tree, op.slice(0, -1));
  const was = parent?.[op.at(-1)];
  if (!was?.$value) throw new Error(`${id}: no token at ${oldId}.`);
  const np = segs(newId);
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
  const home = under ? parent[op.at(-1)] : parent;
  home[under ? "@" : op.at(-1)] = {
    $value: `{${ref(newId)}}`,
    $description: `Deprecated: use ${tokenPath(newId)} (${ticket}). ${was.$description}`,
    $deprecated: `Use ${tokenPath(newId)}. Removed in the next minor release.`,
  };
  write(`schemes/${id}.json`, s);
}

// Source: the component reads the new CSS variable.
const file = `ui/src/components/${comp.id}.tsx`;
const src = read(file);
const n = src.split(`var(${cssVar(oldId)})`).length - 1;
if (!n) throw new Error(`${file} does not read var(${cssVar(oldId)}).`);
writeFileSync(ROOT + file, src.replaceAll(`var(${cssVar(oldId)})`, `var(${cssVar(newId)})`));
console.log(`${oldId} → ${newId}${to ? ` → ${to}` : ""}: grammar, ${SCHEMES.length} schemes, ${file} (${n} reads).`);
