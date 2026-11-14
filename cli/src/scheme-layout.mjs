// The source folder, split by scope (ADR-002 section 10). A scheme is a folder:
//   schemes/<id>/scheme.json           identity, the global answers, the primitives and the rest
//   schemes/<id>/scopes/<scope>.json   that scope's answers, usage rules, semantic tokens and shorthand
//   schemes/<id>/brands/<brand>.json   one brand's theme picks
//   schemes/<id>/components.json       the component values the scheme decides
// The grammar splits the same way: schemes/grammar.json holds the rest, schemes/grammar/scopes/<scope>.json
// each scope, and schemes/grammar/components.json the catalogue, the components and the component keys.
// A part that lives in another file is a JSON Reference in place: { "$ref": "scopes/color.json#/tokens/semantic/color" }.
// So every key keeps its place, and a join gives back the same object, key order and all.
// These functions read no files: they take and return { "<relative path>": <parsed JSON> }.

/** The file that holds the rest of a split scheme, inside its folder. */
export const SCHEME_ROOT = "scheme.json";

/** The grammar sections that go to grammar/components.json. */
const GRAMMAR_COMPONENT_SECTIONS = ["components", "component_keys", "catalogue"];

// Token tiers a scope can own as a whole: owns "component" and owns "content" name tiers, not semantic paths.
const TIER_OWNS = new Set(["component", "content"]);

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isRef = (v) => isObject(v) && Object.keys(v).length === 1 && typeof v.$ref === "string";
const escape = (key) => key.replaceAll("~", "~0").replaceAll("/", "~1");
const unescape = (part) => part.replaceAll("~1", "/").replaceAll("~0", "~");
const pointer = (parts) => `#/${parts.map(escape).join("/")}`;

/** Set value at parts inside root, making each object on the way. */
function setAt(root, parts, value) {
  let node = root;
  for (const p of parts.slice(0, -1)) node = node[p] ??= {};
  node[parts.at(-1)] = value;
}

/**
 * The scope that owns a semantic path: the scope whose owns entry is the longest leading part of the path.
 * null when no scope owns it; then it stays in scheme.json.
 */
export function semanticOwner(path, g) {
  let best = null;
  let length = -1;
  for (const scope of g.scopes)
    for (const own of scope.owns ?? []) {
      if (TIER_OWNS.has(own)) continue;
      const fits = path === own || path.startsWith(`${own}.`);
      if (fits && own.length > length) [best, length] = [scope.id, own.length];
    }
  return best;
}

/** The scope that owns a token tier ("component", "content"), or null. */
const tierOwner = (tier, g) => g.scopes.find((s) => (s.owns ?? []).includes(tier))?.id ?? null;

const scopeFile = (scope) => `scopes/${scope}.json`;

/**
 * Split a stored scheme (as its file stores it, without defaults or generated values) into its folder's
 * files. g gives the scopes, the questions and situations each owns, and the token paths each owns.
 */
export function splitScheme(stored, g) {
  const files = {};
  const root = structuredClone(stored);
  const scopeOfQuestion = new Map(g.scopes.flatMap((s) => s.questions.map((q) => [q.id, s.id])));
  const scopeOfSituation = new Map(g.scopes.flatMap((s) => (s.situations ?? []).map((id) => [id, s.id])));
  const scopeDoc = (scope) =>
    (files[scopeFile(scope)] ??= {
      description: `The ${scope} scope of ${stored.name}: its answers, its usage rules and the semantic tokens it owns. The loader joins it with scheme.json.`,
      scope,
      answers: [],
      usage: [],
    });
  for (const s of g.scopes) scopeDoc(s.id);

  root.answers = [];
  for (const a of stored.answers ?? []) {
    const scope = scopeOfQuestion.get(a.question);
    (scope ? scopeDoc(scope).answers : root.answers).push(a);
  }
  root.usage = [];
  for (const u of stored.usage ?? []) {
    const scope = scopeOfSituation.get(u.situation);
    (scope ? scopeDoc(scope).usage : root.usage).push(u);
  }

  // Semantic tokens: each subtree goes to the scope that owns its path; a reference stays in its place.
  const place = (node, parts, owner) => {
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith("$") || !isObject(child)) continue;
      const path = [...parts, key];
      const childOwner = semanticOwner(path.join("."), g);
      if (childOwner !== owner) {
        const tokenPath = ["tokens", "semantic", ...path];
        setAt(scopeDoc(childOwner).tokens ??= {}, tokenPath.slice(1), child);
        node[key] = { $ref: `${scopeFile(childOwner)}${pointer(tokenPath)}` };
      }
      place(child, path, childOwner);
    }
  };
  if (root.tokens?.semantic) place(root.tokens.semantic, [], null);

  // The content tier goes to the scope that owns it.
  const contentOwner = tierOwner("content", g);
  if (root.tokens?.content && contentOwner) {
    (scopeDoc(contentOwner).tokens ??= {}).content = root.tokens.content;
    root.tokens.content = { $ref: `${scopeFile(contentOwner)}${pointer(["tokens", "content"])}` };
  }

  // Each brand to its own file, the component values to components.json.
  for (const [brand, def] of Object.entries(root.tokens?.brands ?? {})) {
    const file = `brands/${brand}.json`;
    files[file] = {
      description: `The ${brand} brand of ${stored.name}: its theme picks in each mode. The loader joins it with scheme.json.`,
      tokens: { brands: { [brand]: def } },
    };
    root.tokens.brands[brand] = { $ref: `${file}${pointer(["tokens", "brands", brand])}` };
  }
  if (root.tokens?.component) {
    files["components.json"] = {
      description: `The component values ${stored.name} decides, where they differ from the grammar's defaults. The loader joins it with scheme.json.`,
      tokens: { component: root.tokens.component },
    };
    root.tokens.component = { $ref: `components.json${pointer(["tokens", "component"])}` };
  }

  // The shorthand of each semantic token goes with the token.
  if (root.shorthand?.tokens) {
    const rest = {};
    for (const [path, entry] of Object.entries(root.shorthand.tokens)) {
      const owner = semanticOwner(path, g);
      if (owner) (scopeDoc(owner).shorthand ??= {})[path] = entry;
      else rest[path] = entry;
    }
    root.shorthand.tokens = rest;
  }
  files[SCHEME_ROOT] = root;
  return files;
}

/** Follow one JSON Reference into files. base is the folder of the file that holds the reference. */
function follow(ref, files) {
  const [file, fragment = ""] = ref.split("#");
  if (!(file in files)) throw new Error(`A reference names ${file}, which the folder does not have. Restore the file, or save the scheme again.`);
  let node = files[file];
  for (const part of fragment.split("/").filter(Boolean).map(unescape)) {
    node = node?.[part];
    if (node === undefined) throw new Error(`${ref} does not resolve: ${file} has no ${fragment}.`);
  }
  return node;
}

/** value with every JSON Reference replaced by what it names, all the way down. */
export function resolveRefs(value, files, seen = new Set()) {
  if (isRef(value)) {
    if (seen.has(value.$ref)) throw new Error(`${value.$ref} refers back to itself.`);
    return resolveRefs(follow(value.$ref, files), files, new Set([...seen, value.$ref]));
  }
  if (Array.isArray(value)) return value.map((v) => resolveRefs(v, files, seen));
  if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveRefs(v, files, seen)]));
  return value;
}

/** Sort items by the rank of their key in order; an item whose key is not in order keeps its place, last. */
const byOrder = (items, key, order) => {
  const rank = new Map(order.map((id, i) => [id, i]));
  return items
    .map((item, i) => ({ item, i, r: rank.get(key(item)) ?? order.length }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.item);
};

/** True when a parsed scheme.json is the root of a split scheme. */
export const isSplitRoot = (root) => JSON.stringify(root?.tokens ?? {}).includes('"$ref"');

/**
 * The stored scheme a folder's files make: the inverse of splitScheme. Answers come back in the grammar's
 * question order, usage rules in its situation order, and the shorthand by token path.
 */
export function joinScheme(files, g) {
  const root = files[SCHEME_ROOT];
  if (!root) throw new Error(`A scheme folder needs ${SCHEME_ROOT}.`);
  const scheme = resolveRefs(root, files);
  const scopes = Object.entries(files)
    .filter(([path]) => path.startsWith("scopes/"))
    .map(([, doc]) => doc);
  const questionOrder = [...g.reasons, ...g.scopes].flatMap((s) => s.questions.map((q) => q.id));
  scheme.answers = byOrder([...(scheme.answers ?? []), ...scopes.flatMap((s) => s.answers ?? [])], (a) => a.question, questionOrder);
  scheme.usage = byOrder([...(scheme.usage ?? []), ...scopes.flatMap((s) => s.usage ?? [])], (u) => u.situation, g.situations.map((s) => s.id));
  if (scheme.shorthand) {
    const all = { ...scheme.shorthand.tokens, ...Object.assign({}, ...scopes.map((s) => s.shorthand ?? {})) };
    scheme.shorthand.tokens = Object.fromEntries(Object.keys(all).sort().map((k) => [k, all[k]]));
  }
  return scheme;
}

/** Split the grammar: grammar.json keeps the rest; each scope and the component sections get their own file. */
export function splitGrammar(g) {
  const files = {};
  const root = structuredClone(g);
  root.scopes = g.scopes.map((scope) => {
    const file = `grammar/scopes/${scope.id}.json`;
    files[file] = scope;
    return { $ref: file };
  });
  const components = {
    description: "The component sections of the grammar: the components, their keys and the catalogue. The loader joins them with grammar.json.",
  };
  for (const section of GRAMMAR_COMPONENT_SECTIONS)
    if (section in root) {
      components[section] = root[section];
      root[section] = { $ref: `grammar/components.json${pointer([section])}` };
    }
  files["grammar/components.json"] = components;
  files["grammar.json"] = root;
  return files;
}

/** True when a parsed grammar.json is the root of a split grammar. */
export const isSplitGrammar = (root) => Array.isArray(root?.scopes) && root.scopes.some(isRef);

/** The grammar its files make: the inverse of splitGrammar. A grammar.json with no references is the grammar itself. */
export function joinGrammar(files) {
  return resolveRefs(files["grammar.json"], files);
}
