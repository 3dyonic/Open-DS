// Data access for the scheme commands. The CLI reads its assets from cli/assets when it is
// packed (pnpm --dir cli bundle), and from the repository when it runs from a checkout.

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** Where schemes, built tokens, components and skills live. */
export function assetRoots() {
  const packed = join(here, "..", "assets");
  if (existsSync(join(packed, "schemes", "grammar.json"))) {
    return {
      schemes: join(packed, "schemes"),
      tokens: join(packed, "tokens"),
      ui: join(packed, "ui"),
      skills: join(packed, "skills"),
    };
  }
  const repo = join(here, "..", "..");
  return {
    schemes: join(repo, "schemes"),
    tokens: join(repo, "tokens", "dist"),
    ui: join(repo, "ui", "src"),
    skills: join(repo, "skills"),
  };
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

export function grammar(roots = assetRoots()) {
  return readJson(join(roots.schemes, "grammar.json"));
}

export function schemeIds(roots = assetRoots()) {
  return readdirSync(roots.schemes)
    .filter((f) => f.endsWith(".json") && f !== "grammar.json")
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function loadScheme(id, roots = assetRoots()) {
  const path = join(roots.schemes, `${id}.json`);
  if (!existsSync(path)) {
    throw new Error(`No scheme called "${id}". Run "open-ds list" to see the schemes: ${schemeIds(roots).join(", ")}.`);
  }
  return readJson(path);
}

/** Every grammar question by id, with its group. */
export function questions(g = grammar()) {
  const out = {};
  for (const group of [...g.reasons, ...g.scopes]) {
    for (const q of group.questions) out[q.id] = { ...q, group: group.id, groupTitle: group.title, kind: group.kind };
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
    because: depth > 0 ? a.because.map((b) => why(scheme, b, g, depth - 1)).filter(Boolean) : [],
  };
}

/** The usage rule for a situation id, or the best match for free words. */
export function when(scheme, query, g = grammar()) {
  const sits = g.situations;
  let sit = sits.find((s) => s.id === query);
  if (!sit) {
    const words = query.toLowerCase().split(/\W+/).filter(Boolean);
    const score = (s) => words.filter((w) => `${s.id} ${s.title} ${s.description}`.toLowerCase().includes(w)).length;
    sit = [...sits].sort((x, y) => score(y) - score(x))[0];
    if (!sit || score(sit) === 0) return null;
  }
  const rule = scheme.usage.find((u) => u.situation === sit.id);
  return { situation: sit.id, title: sit.title, ...rule };
}

/** The component key, its semantic and the resolved value in each theme. */
export function keyInfo(schemeId, keyId, roots = assetRoots(), g = grammar(roots)) {
  const key = g.component_keys.find((k) => k.id === keyId);
  if (!key) return null;
  const index = readJson(join(roots.tokens, "index.json")).schemes.find((s) => s.id === schemeId);
  const values = {};
  for (const t of index.themes) {
    let node = readJson(join(roots.tokens, schemeId, `${t.id}.tokens.json`));
    for (const part of keyId.split("/")) node = node?.[part];
    values[t.id] = node;
  }
  return { key: keyId, description: key.description, semantic: key.default, values };
}
