// The token map's navigation (OD-274): the primitives are the scheme's words, and the semantic tokens
// are decisions that read them. The map opens from a grammar scope to a primitive (through its family
// when the scope's primitives form families), then to the semantic groups and the decisions that read
// it, then to the component tokens that read a decision. No Node imports, so the docs page runs the
// same code in the browser.

/** The scope that holds the primitives no semantic token reads. */
export const UNUSED = { id: "unused", title: "Not used yet" };

/** The scope that holds the primitives a semantic reads but no grammar scope owns. */
export const UNSCOPED = { id: "unscoped", title: "Not in a scope" };

/** How many components "Where you see it" shows before its "more" node. */
export const COMPONENT_LIMIT = 4;

const MODES = ["light", "dark"];

// A path a scope owns: the token itself or anything under it.
const owned = (path, own) => path === own || path.startsWith(`${own}.`);

const byName = (a, b) => a.localeCompare(b, "en", { numeric: true });

/** Plain words for a name part: "border-width" is "Border width". */
export const plainName = (part) => {
  const words = String(part).replace(/[-_.]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

/**
 * A primitive's id without its mode: color.blue.light.600 is color.blue.600 in light mode, and the
 * dark ramp's primitives belong to dark mode only (null in light). A primitive with no mode in its id
 * keeps its id.
 */
export function wordKey(id, mode) {
  const parts = String(id).split(".");
  const inner = parts.slice(1, -1);
  if (inner.some((p) => MODES.includes(p) && p !== mode)) return null;
  return parts.filter((p, i) => !(i > 0 && i < parts.length - 1 && p === mode)).join(".");
}

// A word's id in any mode, as a word key: color.blue.dark.600 and color.blue.light.600 are color.blue.600.
const anyModeKey = (id) => {
  const parts = String(id).split(".");
  return parts.filter((p, i) => !(i > 0 && i < parts.length - 1 && MODES.includes(p))).join(".");
};

/** The component a component token belongs to: component.button.height is button's. */
export const componentOf = (id) => id.replace(/^component\./, "").split(".")[0];

/** A component token's row label: component.button.focus-ring-color is "focus ring color". */
export const rowLabel = (id) =>
  id
    .replace(/^component\.[^.]+\./, "")
    .replace(/\.@$/, "")
    .replace(/[-.]+/g, " ")
    .trim();

/** A token's name as the map writes it: color.action.primary.@ is color.action.primary. */
export const tokenName = (id) => id.replace(/\.@$/, "");

/**
 * The semantic group a decision belongs to: color.border.focus is in "color.border" (Border); every
 * other kind is grouped by its first part (size.control.default is in "size", Size).
 */
export function groupOf(id) {
  const parts = id.split(".");
  const at = parts[0] === "color" && parts.length > 2 ? 2 : 1;
  return { id: parts.slice(0, at).join("."), label: plainName(parts[at - 1]) };
}

// The family of a word key: color.blue.600 is in color.blue (blue); a two-part key is in its first
// part (size.48 is in size).
function familyOf(key) {
  const parts = key.split(".");
  if (parts.length >= 3) return { id: parts.slice(0, -1).join("."), label: parts.slice(1, -1).join(" ") };
  return { id: parts[0], label: parts[0] };
}

const push = (map, key, value) => {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
};

/**
 * The map's index of one graph (token-graph.mjs) in one mode: { mode, byId, words, scopes, ... }.
 * words maps each word key to { key, id, family, familyLabel, step }: every primitive of this mode,
 * and each primitive of the other mode that a semantic reads in this one, under its own id. scopes lists the grammar's
 * scopes ([{ id, title, owns }]) that hold words, in their order, then UNSCOPED and UNUSED when they
 * hold any: a word belongs to every scope that owns a semantic token that reads it, directly or
 * through other semantics; a word no semantic reads is UNUSED.
 */
export function mapIndex(graph, { scopes, mode }) {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const into = new Map();
  const out = new Map();
  for (const e of graph.edges) {
    push(into, e.to, e.from);
    push(out, e.from, e.to);
  }
  const tier = (id) => byId.get(id)?.tier;

  const words = new Map();
  const wordOfId = new Map();
  for (const n of graph.nodes) {
    if (n.tier !== "primitive") continue;
    // The other mode's primitive is a word of this mode only when a semantic reads it here (text
    // that sits on a light fill in either mode), under its own id.
    const key = wordKey(n.id, mode) ?? ((out.get(n.id) ?? []).some((r) => tier(r) === "semantic") ? n.id : null);
    if (!key) continue;
    const family = familyOf(key);
    words.set(key, { key, id: n.id, family: family.id, familyLabel: family.label, step: key.split(".").at(-1) });
    wordOfId.set(n.id, key);
  }

  // The semantic tokens that read a token, directly or through other semantic tokens.
  const readersMemo = new Map();
  const semanticReaders = (id) => {
    if (readersMemo.has(id)) return readersMemo.get(id);
    const seen = new Set();
    const queue = [id];
    while (queue.length) {
      for (const r of out.get(queue.shift()) ?? [])
        if (tier(r) === "semantic" && !seen.has(r)) {
          seen.add(r);
          queue.push(r);
        }
    }
    const list = [...seen].sort(byName);
    readersMemo.set(id, list);
    return list;
  };

  const held = new Map();
  for (const word of words.values()) {
    const readers = semanticReaders(word.id);
    let ids = scopes.filter((s) => readers.some((r) => s.owns.some((o) => owned(r, o)))).map((s) => s.id);
    // A word only semantics outside every scope read (a spacing map) goes where its own name belongs.
    if (readers.length && !ids.length) ids = scopes.filter((s) => s.owns.some((o) => owned(word.key, o))).map((s) => s.id);
    if (!readers.length) ids = [UNUSED.id];
    else if (!ids.length) ids = [UNSCOPED.id];
    for (const id of ids) push(held, id, word.key);
  }
  const scopeList = [...scopes, { ...UNSCOPED, owns: [] }, { ...UNUSED, owns: [] }]
    .filter((s) => held.has(s.id))
    .map((s) => ({ id: s.id, title: s.title, owns: s.owns, keys: held.get(s.id).sort(byName) }));

  return { mode, byId, into, out, words, wordOfId, scopes: scopeList, semanticReaders };
}

const scopeById = (index, id) => index.scopes.find((s) => s.id === id);

/**
 * The families of a scope's words, or null when its words form none (every key has two parts or
 * fewer). [{ id, label, keys, swatch }]: swatch is the key of the family's 600 step, or its middle
 * step, for a color family; else null.
 */
export function familiesIn(index, scopeId) {
  const scope = scopeById(index, scopeId);
  if (!scope || !scope.keys.some((k) => k.split(".").length >= 3)) return null;
  const families = new Map();
  for (const key of scope.keys) {
    const word = index.words.get(key);
    if (!families.has(word.family)) families.set(word.family, { id: word.family, label: word.familyLabel, keys: [] });
    families.get(word.family).keys.push(key);
  }
  return [...families.values()]
    .sort((a, b) => byName(a.label, b.label))
    .map((f) => {
      const isColor = index.byId.get(index.words.get(f.keys[0]).id)?.type === "color";
      const swatch = isColor ? (f.keys.find((k) => k.endsWith(".600")) ?? f.keys[Math.floor((f.keys.length - 1) / 2)]) : null;
      return { ...f, swatch };
    });
}

/** The word keys of a scope's step column: the open family's, or every word of a scope without families. */
export function stepsIn(index, { scope, family }) {
  const keys = scopeById(index, scope)?.keys ?? [];
  return family ? keys.filter((k) => index.words.get(k).family === family) : keys;
}

/** A step's label: the last part of its key in a scope with families, else the whole key. */
export const stepLabel = (index, { key, family }) => (family ? index.words.get(key).step : key);

/**
 * The semantic groups that read a word, directly or through other semantics:
 * [{ id, label, decisions }], by label; decisions are the semantic token ids, by name.
 */
export function groupsOf(index, key) {
  const word = index.words.get(key);
  if (!word) return [];
  const groups = new Map();
  for (const id of index.semanticReaders(word.id)) {
    const g = groupOf(id);
    if (!groups.has(g.id)) groups.set(g.id, { ...g, decisions: [] });
    groups.get(g.id).decisions.push(id);
  }
  return [...groups.values()].sort((a, b) => byName(a.label, b.label));
}

/** The semantic tokens that read a token directly, by name. */
export const directReaders = (index, id) =>
  (index.out.get(id) ?? []).filter((r) => index.byId.get(r)?.tier === "semantic").sort(byName);

/**
 * The components that read a semantic token: [{ component, label, rows: [{ id, label }] }], by
 * component name. A row is a component token that reads it, or reads such a token (a deprecated key,
 * OD-241).
 */
export function componentsReading(index, id) {
  const keys = new Set();
  const queue = [id];
  while (queue.length) {
    for (const r of index.out.get(queue.shift()) ?? [])
      if (index.byId.get(r)?.tier === "component-key" && !keys.has(r)) {
        keys.add(r);
        queue.push(r);
      }
  }
  const byComponent = new Map();
  for (const k of [...keys].sort(byName)) push(byComponent, componentOf(k), k);
  return [...byComponent.keys()].sort(byName).map((component) => ({
    component,
    label: plainName(component),
    rows: byComponent.get(component).map((k) => ({ id: k, label: rowLabel(k) })),
  }));
}

/**
 * The part of a path that holds in this index: { scope, family?, step?, group?, decision? }, cut at
 * the first part that no longer exists (a mode switch can drop a decision that reads another word).
 */
export function cleanPath(index, path = {}) {
  const out = {};
  const scope = scopeById(index, path.scope);
  if (!scope) return out;
  out.scope = scope.id;
  const families = familiesIn(index, scope.id);
  if (families) {
    if (!families.some((f) => f.id === path.family)) return out;
    out.family = path.family;
  }
  if (!stepsIn(index, out).includes(path.step)) return out;
  out.step = path.step;
  const group = groupsOf(index, path.step).find((g) => g.id === path.group);
  if (!group) return out;
  out.group = group.id;
  if (group.decisions.includes(path.decision)) out.decision = path.decision;
  return out;
}

/**
 * The columns a path opens, left to right: [{ level, ids, open }]. level is scope, scale, step, word,
 * group, decision or where; open is the column's open id (null when none). A scope without families
 * has no scale column. The where column lists component names: the first COMPONENT_LIMIT, or all when
 * more is true; hidden is how many it leaves out.
 */
export function columnsFor(index, rawPath, { more = false } = {}) {
  const path = cleanPath(index, rawPath);
  const columns = [{ level: "scope", ids: index.scopes.map((s) => s.id), open: path.scope ?? null }];
  if (!path.scope) return columns;
  const families = familiesIn(index, path.scope);
  if (families) {
    columns.push({ level: "scale", ids: families.map((f) => f.id), open: path.family ?? null });
    if (!path.family) return columns;
  }
  columns.push({ level: "step", ids: stepsIn(index, path), open: path.step ?? null });
  if (!path.step) return columns;
  columns.push({ level: "word", ids: [path.step], open: path.step });
  const groups = groupsOf(index, path.step);
  if (!groups.length) return columns;
  columns.push({ level: "group", ids: groups.map((g) => g.id), open: path.group ?? null });
  if (!path.group) return columns;
  const group = groups.find((g) => g.id === path.group);
  columns.push({ level: "decision", ids: group.decisions, open: path.decision ?? null });
  if (!path.decision) return columns;
  const components = componentsReading(index, path.decision).map((c) => c.component);
  if (!components.length) return columns;
  const shown = more ? components : components.slice(0, COMPONENT_LIMIT);
  columns.push({ level: "where", ids: shown, open: null, hidden: components.length - shown.length });
  return columns;
}

// The primitives a token's value comes from, nearest first.
function primitivesOf(index, id) {
  const seen = new Set([id]);
  const queue = [id];
  const found = [];
  while (queue.length) {
    for (const from of index.into.get(queue.shift()) ?? []) {
      if (seen.has(from)) continue;
      seen.add(from);
      if (index.byId.get(from)?.tier === "primitive") found.push(from);
      else queue.push(from);
    }
  }
  return found;
}

// The path to a word, in the first scope that holds it and owns the decision, when one is named.
function pathToWord(index, key, decision) {
  const word = index.words.get(key);
  if (!word) return null;
  const holding = index.scopes.filter((s) => s.keys.includes(key));
  const scope = (decision && holding.find((s) => s.owns.some((o) => owned(decision, o)))) ?? holding[0];
  if (!scope) return null;
  const path = { scope: scope.id };
  if (familiesIn(index, scope.id)) path.family = word.family;
  path.step = key;
  return path;
}

/**
 * The path that opens a token, for ?focus= and the search: { path, more, row }. A primitive (its id
 * in either mode, or its word key) opens its step; a semantic token opens its first primitive's step
 * and selects the token as the decision; a component token selects the semantic token it reads, with
 * more set when its component is past the first COMPONENT_LIMIT, and row set to it. Null for an id
 * the map cannot open.
 */
export function pathTo(index, id) {
  const node = index.byId.get(id);
  if (!node || node.tier === "primitive") {
    const key = index.words.has(id) ? id : anyModeKey(id);
    const path = pathToWord(index, key);
    return path ? { path, more: false, row: null } : null;
  }
  if (node.tier === "component-key") {
    const semantic = [...readsOfKey(index, id)].find((r) => index.byId.get(r)?.tier === "semantic");
    const opened = semantic && pathTo(index, semantic);
    if (!opened) return null;
    const names = componentsReading(index, semantic).map((c) => c.component);
    return { ...opened, more: names.indexOf(componentOf(id)) >= COMPONENT_LIMIT, row: id };
  }
  for (const primitive of primitivesOf(index, id)) {
    const key = index.wordOfId.get(primitive);
    const path = key && pathToWord(index, key, id);
    if (path) return { path: { ...path, group: groupOf(id).id, decision: id }, more: false, row: null };
  }
  return null;
}

// The tokens a component token reads, nearest first, through other component tokens.
function readsOfKey(index, id) {
  const order = [];
  const seen = new Set([id]);
  const queue = [id];
  while (queue.length) {
    for (const from of index.into.get(queue.shift()) ?? []) {
      if (seen.has(from)) continue;
      seen.add(from);
      order.push(from);
      if (index.byId.get(from)?.tier === "component-key") queue.push(from);
    }
  }
  return order;
}

/**
 * What the search finds: [{ id, kind, label, detail, text }] for every word (Value), semantic token
 * (Token) and component token that reads a semantic token (Component). text is what a query matches.
 */
export function searchEntries(index) {
  const entries = [];
  for (const word of index.words.values()) {
    const value = index.byId.get(word.id)?.value ?? "";
    entries.push({ id: word.id, kind: "Value", label: word.key, detail: value, text: `${word.key} ${word.id} ${value}` });
  }
  for (const n of index.byId.values()) {
    if (n.tier === "semantic")
      entries.push({
        id: n.id,
        kind: "Token",
        label: tokenName(n.id),
        detail: n.description ?? "",
        text: `${n.id} ${n.description ?? ""}`,
      });
    else if (n.tier === "component-key" && readsOfKey(index, n.id).some((r) => index.byId.get(r)?.tier === "semantic"))
      entries.push({
        id: n.id,
        kind: "Component",
        label: `${componentOf(n.id)} · ${rowLabel(n.id)}`,
        detail: tokenName(n.id),
        text: `${componentOf(n.id)} ${rowLabel(n.id)} ${n.id}`,
      });
  }
  return entries.map((e) => ({ ...e, text: e.text.toLowerCase() }));
}

/**
 * The entries that hold every word of a query, best first: a label that starts with the query, then
 * one that holds it, then the rest; tokens before values before components. { matches, total }: the first limit matches, and how many match.
 */
export function search(entries, query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return { matches: [], total: 0 };
  const words = q.split(/\s+/);
  const rank = (e) => {
    const label = e.label.toLowerCase();
    return label.startsWith(q) ? 0 : label.includes(q) ? 1 : 2;
  };
  const kinds = ["Token", "Value", "Component"];
  const found = entries
    .filter((e) => words.every((w) => e.text.includes(w)))
    .map((e) => ({ e, r: rank(e), k: kinds.indexOf(e.kind) }))
    .sort((a, b) => a.r - b.r || a.k - b.k || a.e.label.length - b.e.label.length || byName(a.e.label, b.e.label))
    .map(({ e }) => e);
  return { matches: found.slice(0, limit), total: found.length };
}
