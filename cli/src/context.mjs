// Context on demand: one call returns only the slice an agent needs for a target, built from the
// scheme, the grammar and the built tokens. The CLI (open-ds context) and the MCP (get_context) share it.
import { guidanceFor, guidanceId } from "./guidance.mjs";
import {
  assetRoots,
  grammar,
  keyInfo,
  loadScheme,
  schemeIds,
  valuesFor,
  when,
} from "./schemes.mjs";

export const TASKS = ["choose", "build", "write", "change", "review"];

const brief = (g) =>
  (g.semantics?.keys ?? []).map((k) => ({
    id: k.id,
    intent: k.intent,
    not_for: k.not_for.map((n) => `${n.when}: use ${n.use}`),
    ...(k.pairs && { sits_on: k.pairs.on, contrast: k.pairs.contrast }),
  }));

const rules = (scheme, g) =>
  g.situations.map((x) => {
    const r = scheme.usage.find((u) => u.situation === x.id) ?? {};
    return {
      situation: x.id,
      title: x.title,
      use: r.use,
      not: r.not,
      why: r.why,
    };
  });

function task(name, scheme, g, roots) {
  const urgency = g.semantics?.urgency;
  const base = {
    target: name,
    kind: "task",
    skill: `open-ds-${name}`,
    scheme: scheme.id,
  };
  if (name === "choose")
    return {
      ...base,
      read: "Pick the scheme whose use_when fits the product and whose avoid_when does not.",
      schemes: schemeIds(roots).map((id) => {
        const s = loadScheme(id, roots);
        return { id, name: s.name, summary: s.summary, ...s.ai };
      }),
    };
  if (name === "build")
    return {
      ...base,
      read: "Find the situation and follow its rule. Read only component keys and semantic tokens. Check a semantic's not_for before you use it.",
      components: g.components.map((c) => ({
        id: c.id,
        description: c.description,
        keys: c.keys,
      })),
      rules: rules(scheme, g),
      semantics: brief(g),
      urgency,
    };
  if (name === "write")
    return {
      ...base,
      read: "Write in the scheme's voice. Use the words in content for common actions.",
      voice: scheme.voice,
      content: scheme.tokens.content,
    };
  if (name === "change")
    return {
      ...base,
      read: "Change an answer in the scheme JSON, with its why and because. Then rebuild the tokens.",
      how_to_read: g.ai?.how_to_read,
      answers: scheme.answers,
    };
  return {
    ...base,
    read: "Check each colour against its not_for and its pairs, each status against the urgency order, and each situation against its rule.",
    rules: rules(scheme, g),
    semantics: brief(g),
    urgency,
  };
}

/**
 * The context for a target in a scheme. A target is a task (choose, build, write, change, review), a
 * component (button), a component key (button/primary/background), a semantic token
 * (color.status.danger) or a situation (status-label). Null when nothing matches.
 */
export function context(
  schemeId,
  target,
  roots = assetRoots(),
  g = grammar(roots),
) {
  const scheme = loadScheme(schemeId, roots);
  if (TASKS.includes(target)) return task(target, scheme, g, roots);

  const comp = g.components.find((c) => c.id === target);
  if (comp) {
    const keys = comp.keys
      .map((k) => keyInfo(schemeId, k, roots, g))
      .filter(Boolean);
    const sems = [...new Set(keys.map((k) => k.semantic))];
    return {
      target,
      kind: "component",
      scheme: scheme.id,
      description: comp.description,
      keys: keys.map(({ guidance, ...k }) => k),
      guidance: sems.map((p) => guidanceFor(g, p)).filter(Boolean),
      rules: rules(scheme, g).filter((r) =>
        `${r.use} ${r.not}`.toLowerCase().includes(target),
      ),
    };
  }

  const key = target.includes("/") && keyInfo(schemeId, target, roots, g);
  if (key) return { target, kind: "component key", scheme: scheme.id, ...key };

  const id = guidanceId(g, target);
  if (id)
    return {
      target,
      kind: "semantic",
      scheme: scheme.id,
      guidance: guidanceFor(g, id),
      values: valuesFor(schemeId, id, roots),
      read_by: g.component_keys
        .filter((k) => k.default === id)
        .map((k) => k.id),
    };

  if (g.situations.some((x) => x.id === target)) {
    const rule = when(scheme, target, g);
    return { target, kind: "situation", scheme: scheme.id, ...rule };
  }
  return null;
}
