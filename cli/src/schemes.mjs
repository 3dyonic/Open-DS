// Data access for the scheme commands. The CLI reads its assets from cli/assets when it is
// packed (pnpm --dir cli bundle), and from the repository when it runs from a checkout.

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { guidanceFor } from "./guidance.mjs";
import { SCHEME_ROOT, isSplitGrammar, joinGrammar, joinScheme, splitGrammar, splitScheme } from "./scheme-layout.mjs";
import { withDefaults, withoutDefaults } from "./scheme-defaults.mjs";
import { withGenerated, withoutGenerated } from "./scheme-generated.mjs";
import { withTypeAndSpace, withoutTypeAndSpace } from "./type-space-generated.mjs";

const here = dirname(fileURLToPath(import.meta.url));

/** Where schemes, built tokens, components, stories, skills and project templates live. */
export function assetRoots() {
  const packed = join(here, "..", "assets");
  const inRepo = existsSync(join(here, "..", "..", "schemes", "grammar.json"));
  // In a checkout the repository always wins, so a leftover cli/assets bundle is never read.
  if (!inRepo && existsSync(join(packed, "schemes", "grammar.json"))) {
    return {
      schemes: join(packed, "schemes"),
      schema: join(packed, "schema"),
      tokens: join(packed, "tokens"),
      ui: join(packed, "ui"),
      skills: join(packed, "skills"),
      stories: join(packed, "stories"),
      composites: join(packed, "doc-composites"),
      docsSrc: join(packed, "docs-src"),
      templates: join(here, "..", "templates"),
    };
  }
  const repo = join(here, "..", "..");
  return {
    schemes: join(repo, "schemes"),
    schema: join(repo, "schema"),
    tokens: join(repo, "tokens", "dist"),
    ui: join(repo, "ui", "src"),
    skills: join(repo, "skills"),
    stories: join(repo, "storybook", "stories"),
    composites: join(repo, "doc-composites", "src"),
    docsSrc: join(repo, "docs", "src"),
    templates: join(here, "..", "templates"),
  };
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

/** Every JSON file under dir, parsed, by its path relative to base: { "scopes/color.json": {...} }. */
function readTree(dir, base = dir) {
  if (!existsSync(dir)) return {};
  const files = {};
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, e.name);
    if (e.isDirectory()) Object.assign(files, readTree(path, base));
    else if (e.name.endsWith(".json")) files[relative(base, path).split("\\").join("/")] = readJson(path);
  }
  return files;
}

/** Write files ({ relative path: text }) under dir. */
function writeTree(dir, files) {
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, rel)), { recursive: true });
    writeFileSync(join(dir, rel), text);
  }
}

/**
 * The grammar. It reads both layouts: one grammar.json, or grammar.json with its scopes and component
 * sections split into schemes/grammar/.
 */
export function grammar(roots = assetRoots()) {
  const root = readJson(join(roots.schemes, "grammar.json"));
  if (!isSplitGrammar(root)) return root;
  return joinGrammar({ "grammar.json": root, ...readTree(join(roots.schemes, "grammar"), roots.schemes) });
}

/** The layout a scheme is stored in: "folder" (schemes/<id>/), "file" (schemes/<id>.json) or null. A file wins. */
export function schemeLayout(id, roots = assetRoots()) {
  if (id === "grammar") return null;
  if (existsSync(join(roots.schemes, `${id}.json`))) return "file";
  if (existsSync(join(roots.schemes, id, SCHEME_ROOT))) return "folder";
  return null;
}

/** Every scheme id, in the grammar's scheme_order; a scheme it does not list comes last, by id. */
export function schemeIds(roots = assetRoots()) {
  const order = grammar(roots).scheme_order?.order ?? [];
  const rank = (id) => (order.includes(id) ? order.indexOf(id) : order.length);
  const ids = readdirSync(roots.schemes, { withFileTypes: true }).flatMap((e) => {
    if (e.isFile() && e.name.endsWith(".json") && e.name !== "grammar.json") return [e.name.replace(/\.json$/, "")];
    if (e.isDirectory() && existsSync(join(roots.schemes, e.name, SCHEME_ROOT))) return [e.name];
    return [];
  });
  return [...new Set(ids)].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

/**
 * The grammar file's one layout: two-space indents, and a list of plain values on one line
 * when that line fits in 80 characters. saveGrammar writes it, so an edit changes only its own lines.
 */
export function formatGrammar(value) {
  const plain = (v) => v === null || typeof v !== "object";
  const out = (v, indent, lead) => {
    if (plain(v)) return JSON.stringify(v);
    const inner = `${indent}  `;
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      if (v.every(plain)) {
        const line = `[${v.map((x) => JSON.stringify(x)).join(", ")}]`;
        if (lead + line.length + 1 <= 80) return line;
        return `[\n${v.map((x) => inner + JSON.stringify(x)).join(",\n")}\n${indent}]`;
      }
      return `[\n${v.map((x) => inner + out(x, inner, inner.length)).join(",\n")}\n${indent}]`;
    }
    const entries = Object.entries(v);
    if (!entries.length) return "{}";
    const lines = entries.map(([k, x]) => {
      const key = `${inner}${JSON.stringify(k)}: `;
      return key + out(x, inner, key.length);
    });
    return `{\n${lines.join(",\n")}\n${indent}}`;
  };
  return `${out(value, "", 0)}\n`;
}

/**
 * The source JSON files not in the one layout (formatGrammar): the grammar and its schemas. [] when all
 * are. Read here, so every read of schemes/ stays in this module.
 */
export function layoutGaps(roots = assetRoots()) {
  const schemas = ["grammar.schema.json", "scheme.schema.json", "overlay.schema.json"].map((f) => join(roots.schema, f));
  const split = Object.keys(readTree(join(roots.schemes, "grammar"), roots.schemes)).map((f) => join(roots.schemes, f));
  const files = [join(roots.schemes, "grammar.json"), ...split, ...schemas];
  return files.filter((f) => {
    const raw = readFileSync(f, "utf8");
    return formatGrammar(JSON.parse(raw)) !== raw;
  });
}

/** Write the grammar, split by scope. The one way to change schemes/grammar.json and schemes/grammar/. */
export function saveGrammar(g, roots = assetRoots()) {
  const files = splitGrammar(g);
  // A scope that left the grammar leaves no file behind.
  rmSync(join(roots.schemes, "grammar"), { recursive: true, force: true });
  writeTree(roots.schemes, Object.fromEntries(Object.entries(files).map(([rel, data]) => [rel, formatGrammar(data)])));
}

/** Write a scheme, by its id, as its folder split by scope. The one way to change schemes/<id>/. */
export function saveScheme(scheme, roots = assetRoots()) {
  if (!scheme?.id) throw new Error("saveScheme needs a scheme with an id. Load it with loadScheme first.");
  const g = grammar(roots);
  // The folder keeps only what the scheme decides: its own component values, and the key colors
  // and spacing rhythm, not the scales and steps they generate, and the type and spacing
  // records, not the values they generate. loadScheme fills the rest.
  const stored = withoutTypeAndSpace(withoutGenerated(withoutDefaults(scheme, g)));
  const files = splitScheme(stored, g);
  const dir = join(roots.schemes, scheme.id);
  // The folder replaces the single file, and a part that left the scheme leaves no file behind.
  rmSync(dir, { recursive: true, force: true });
  rmSync(join(roots.schemes, `${scheme.id}.json`), { force: true });
  writeTree(dir, Object.fromEntries(Object.entries(files).map(([rel, data]) => [rel, `${JSON.stringify(data, null, 2)}\n`])));
}

/**
 * Write a scheme file exactly as given, defaults and all. For a scratch copy of another checkout's
 * schemes, which its own loader then reads (open-ds compare); a scheme of this checkout
 * changes through saveScheme.
 */
export function saveStoredScheme(stored, roots) {
  if (!stored?.id) throw new Error("saveStoredScheme needs a stored scheme with an id. Read it with storedScheme first.");
  writeFileSync(join(roots.schemes, `${stored.id}.json`), `${JSON.stringify(stored)}\n`);
}

/** A scheme as its file stores it, without defaults or generated values: for the checks that guard the file. */
export function storedScheme(id, roots = assetRoots()) {
  const layout = schemeLayout(id, roots);
  if (layout === "file") return readJson(join(roots.schemes, `${id}.json`));
  if (layout === "folder") return joinScheme(readTree(join(roots.schemes, id)), grammar(roots));
  throw new Error(`No scheme called "${id}". Run "open-ds list" to see the schemes: ${schemeIds(roots).join(", ")}.`);
}

/** A scheme with its defaults and generated values. graded overrides the curve flag, for a report that builds both curves. */
export function loadScheme(id, roots = assetRoots(), { graded } = {}) {
  // The source stores only what the scheme decides; every other component key takes the grammar's default,
  // and the scales and the spacing map come from their recorded rules.
  return withTypeAndSpace(withGenerated(withDefaults(storedScheme(id, roots), grammar(roots)), { graded }));
}

/** Every grammar question by id, with its group. */
export function questions(g = grammar()) {
  // No prototype, so names like "constructor" are not mistaken for questions.
  const out = Object.create(null);
  for (const group of [...g.reasons, ...g.scopes]) {
    for (const q of group.questions)
      out[q.id] = {
        ...q,
        group: group.id,
        groupTitle: group.title,
        kind: group.kind,
      };
  }
  return out;
}

/** An answer with its question, chosen option and the chain of answers it follows from. */
export function why(scheme, questionId, g = grammar(), depth = 3) {
  const qs = questions(g);
  const q = qs[questionId];
  if (!q) return null;
  const a = scheme.answers.find((x) => x.question === questionId);
  const option = q.options.find((o) => o.id === a.option);
  return {
    question: questionId,
    text: q.text,
    answer: option.label,
    why: a.why,
    because:
      depth > 0
        ? a.because.map((b) => why(scheme, b, g, depth - 1)).filter(Boolean)
        : [],
  };
}

/** The usage rule for a situation id, or the best match for free words. */
export function when(scheme, query, g = grammar()) {
  const sits = g.situations;
  let sit = sits.find((s) => s.id === query);
  if (!sit) {
    const STOP = new Set(
      "a an the on in of or and to for with is it be do i my me how what which should can this that some something thing things".split(
        " ",
      ),
    );
    // A light stem, so "deleting" meets "delete" and "buttons" meets "button".
    const stem = (w) => w.replace(/(ings?|ed|es|s|ly|e)$/, "");
    const words = query
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 1 && !STOP.has(w))
      .map(stem)
      .filter((w) => w.length > 2);
    const score = (s) => {
      const hay = `${s.id} ${s.title} ${s.description}`
        .toLowerCase()
        .split(/\W+/)
        .map(stem);
      // A word in the id or title counts double.
      const head = `${s.id} ${s.title}`.toLowerCase().split(/\W+/).map(stem);
      return words.reduce(
        (n, w) =>
          n +
          (head.some(
            (h) => h.startsWith(w) || (w.startsWith(h) && h.length > 2),
          )
            ? 2
            : hay.includes(w)
              ? 1
              : 0),
        0,
      );
    };
    sit = [...sits].sort((x, y) => score(y) - score(x))[0];
    if (!sit || score(sit) === 0) return null;
  }
  const rule = scheme.usage.find((u) => u.situation === sit.id);
  const guidance = rule && guidanceFor(g, rule.use);
  return {
    situation: sit.id,
    title: sit.title,
    ...rule,
    ...(guidance && { guidance }),
  };
}

/** The resolved value of a token path in each theme of a scheme, from the built tokens. */
export function valuesFor(schemeId, path, roots = assetRoots()) {
  const index = readJson(join(roots.tokens, "index.json")).schemes.find(
    (s) => s.id === schemeId,
  );
  const values = {};
  for (const t of index?.themes ?? []) {
    let node = readJson(join(roots.tokens, schemeId, `${t.id}.tokens.json`));
    for (const part of path.split(/[./]/)) node = node?.[part];
    values[t.id] = node;
  }
  return values;
}

/** The component key, its semantic and the resolved value in each theme. */
export function keyInfo(
  schemeId,
  keyId,
  roots = assetRoots(),
  g = grammar(roots),
) {
  // A part with variants has a base, @: button/primary/background means button/primary/background/@.
  const key =
    g.component_keys.find((k) => k.id === keyId) ??
    g.component_keys.find((k) => k.id === `${keyId}/@`);
  if (!key) return null;
  const guidance = guidanceFor(g, key.default);
  return {
    key: key.id,
    description: key.description,
    semantic: key.default,
    values: valuesFor(schemeId, key.id, roots),
    ...(guidance && { guidance }),
  };
}

/** The focused agent skills next to the overview skill: open-ds-choose, -build, -write, -change, -review. */
export function focusedSkills(roots = assetRoots()) {
  return readdirSync(roots.skills, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith("open-ds-"))
    .map((e) => e.name)
    .sort();
}

/** The JSON Schema every loaded scheme matches (schema/scheme.schema.json): for the build's schema rule. */
export function schemeSchema(roots = assetRoots()) {
  return readJson(join(roots.schema, "scheme.schema.json"));
}

/** The JSON Schema every overlay matches (schema/overlay.schema.json): checked where an overlay enters a build. */
export function overlaySchema(roots = assetRoots()) {
  return readJson(join(roots.schema, "overlay.schema.json"));
}
