// The Anatomy reference (OD-229): one component taken apart, generated from its code and its scheme.
// For each part (a data-slot in the code): the tokens it reads, and for each token the chain from
// the decision to the value: the semantic and its rule, the theme pick in light and dark with the
// scheme's reason, what else picks the same step, and the answers it follows from. A part whose value
// changes between schemes says so. The docs' Anatomy reference pages and get_component read it.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { componentApi, tokenIndex, aliasChain } from "./lands.mjs";
import { usages } from "./gaps.mjs";
import { loadScheme, schemeIds } from "./schemes.mjs";

const leaves = (o, p = []) =>
  !o || typeof o !== "object"
    ? []
    : "$value" in o
      ? [[p.join("."), o]]
      : Object.entries(o).flatMap(([k, v]) => (k[0] === "$" ? [] : leaves(v, [...p, k])));
const name = (ref) => String(ref ?? "").replace(/^\{(color\.)?|\}$/g, "");
const shown = (v) =>
  v == null
    ? ""
    : typeof v === "object"
      ? v.color
        ? `${v.offsetX ?? 0} ${v.offsetY ?? 0} ${v.blur ?? 0}, ${v.color}`
        : JSON.stringify(v)
      : String(v);

// Which scope owns a semantic's family (type.* is typography, space.* spacing), for the answers that
// set a token with no theme pick.
function ownerScope(g, semantic) {
  const head = semantic.split(".")[0];
  return [...g.scopes].find((s) => (s.owns ?? []).some((o) => o === head || semantic.startsWith(`${o}.`)));
}

/** The value of every token of one component across every scheme, by mode: does it change by scheme?
 * Memoized per component and asset root: the docs ask for it once per scheme. */
const memo = new Map();
const schemeMemo = new Map();
function byScheme(comp, roots) {
  const id0 = `${roots.ui}|${comp}`;
  if (memo.has(id0)) return memo.get(id0);
  const out = new Map();
  for (const id of schemeIds(roots)) {
    const s = schemeMemo.get(`${roots.schemes ?? roots.ui}|${id}`) ?? loadScheme(id, roots);
    schemeMemo.set(`${roots.schemes ?? roots.ui}|${id}`, s);
    for (const t of componentApi(s, comp, roots)) {
      const e = out.get(t.token) ?? { light: new Set(), dark: new Set() };
      for (const [th, v] of Object.entries(t.values)) (th.endsWith("dark") ? e.dark : e.light).add(JSON.stringify(v.value));
      out.set(t.token, e);
    }
  }
  const res = new Map([...out].map(([k, e]) => [k, e.light.size > 1 || e.dark.size > 1]));
  memo.set(id0, res);
  return res;
}

/** One component's anatomy in one scheme, for its first brand. */
export function anatomy(scheme, g, roots, comp) {
  const file = join(roots.ui, "components", `${comp}.tsx`);
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    return null;
  }
  const brand = Object.keys(scheme.tokens.brands)[0];
  const ix = { light: tokenIndex(scheme, { brand, mode: "light" }), dark: tokenIndex(scheme, { brand, mode: "dark" }) };
  const theme = scheme.tokens.brands[brand].theme;
  const rule = new Map(g.semantics.keys.map((k) => [k.id.replace(/\.@$/, ""), k]));
  const answers = Object.fromEntries(scheme.answers.map((a) => [a.question, a]));
  const questions = new Map([...g.reasons, ...g.scopes].flatMap((s) => s.questions.map((q) => [q.id, q])));
  const answerOf = (id) => {
    const a = answers[id];
    const q = questions.get(id);
    if (!a || !q) return null;
    const opt = q.options?.find((o) => o.id === a.option);
    return { question: id, text: q.text, answer: opt?.label ?? a.option, why: a.why };
  };
  const changes = byScheme(comp, roots);
  // Same step: every theme pick in this mode with the same value, so a reader sees what a change moves.
  const sharing = (mode, path, value) =>
    leaves(theme[mode] ?? {})
      .filter(([p, n]) => n.$value === value && p.replace(/\.@$/, "") !== path && !/^color\.neutral\./.test(p))
      .map(([p]) => p.replace(/\.@$/, ""));
  const pickOf = (mode, semantic) => {
    const node = leaves(theme[mode] ?? {}).find(([p]) => p.replace(/\.@$/, "") === semantic)?.[1] ??
      leaves(theme.base ?? {}).find(([p]) => p.replace(/\.@$/, "") === semantic)?.[1];
    if (!node) return null;
    const od = node.$extensions?.["open-ds"] ?? {};
    return {
      pick: name(node.$value),
      why: od.why ?? null,
      because: od.because ?? [],
      shares: sharing(mode, semantic, node.$value),
    };
  };

  const tokens = componentApi(scheme, comp, roots).filter((t) => t.own && t.aliases);
  const parts = new Map();
  for (const t of tokens) {
    const uses = usages(src, comp, t.css);
    const where = [...new Set(uses.map((u) => u.part))];
    const states = [...new Set(uses.map((u) => u.state).filter(Boolean))];
    const sem = t.aliases;
    const light = aliasChain(ix.light, t.token);
    const dark = aliasChain(ix.dark, t.token);
    const pl = pickOf("light", sem);
    const pd = pickOf("dark", sem);
    const scope = pl ? null : ownerScope(g, sem);
    const setBy = pl
      ? (pl.because ?? []).map(answerOf).filter(Boolean)
      : (scope?.questions ?? []).filter((q) => /\.(values|definition)$/.test(q.id)).map((q) => answerOf(q.id)).filter(Boolean);
    const entry = {
      key: t.token.replace(/^component\./, ""),
      css: t.css,
      semantic: sem,
      rule: rule.get(sem)?.intent ?? null,
      states,
      by_scheme: changes.get(t.token) ?? false,
      light: { value: shown(light.value), pick: pl?.pick ?? name(light.hops[1] ?? light.end), why: pl?.why ?? null },
      dark: { value: shown(dark.value), pick: pd?.pick ?? name(dark.hops[1] ?? dark.end), why: pd?.why ?? null },
      shares: pl?.shares ?? [],
      set_by: setBy,
    };
    for (const p of where.length ? where : ["root"]) {
      const part = parts.get(p) ?? { part: p, tokens: [] };
      part.tokens.push(entry);
      parts.set(p, part);
    }
  }
  const list = [...parts.values()].map((p) => ({
    ...p,
    by_scheme: p.tokens.some((t) => t.by_scheme),
    states: [...new Set(p.tokens.flatMap((t) => t.states))],
  }));
  // The root first, then the parts in the order the code names them.
  const order = [...new Set([...src.matchAll(/data-slot="([a-z0-9-]+)"/g)].map((m) => (m[1] === comp ? "root" : m[1].replace(new RegExp(`^${comp}-`), ""))))];
  list.sort((a, b) => (a.part === "root" ? -1 : b.part === "root" ? 1 : (order.indexOf(a.part) + 1 || 99) - (order.indexOf(b.part) + 1 || 99)));
  return {
    component: comp,
    scheme: scheme.id,
    brand,
    parts: list,
    by_scheme: list.filter((p) => p.by_scheme).length,
  };
}

/** One token's chain, for any path: a component key (component.dropdown-menu.item.background.highlight)
 * or a semantic (color.border.focus). The semantic and its rule, the value in light and dark, the theme
 * pick and its reason in each mode, what else picks the same step, and whether the value changes
 * between schemes. The Anatomy reference's cards read it. */
export function tokenTrace(scheme, g, roots, path) {
  const brand = Object.keys(scheme.tokens.brands)[0];
  const theme = scheme.tokens.brands[brand].theme;
  const ix = (s, mode) => tokenIndex(s, { brand: Object.keys(s.tokens.brands)[0], mode });
  const chainOf = (s, mode) => aliasChain(ix(s, mode), path);
  const light = chainOf(scheme, "light");
  const dark = chainOf(scheme, "dark");
  if (light.value == null) return null;
  const isKey = path.startsWith("component.");
  const semantic = isKey ? (light.hops[0] ?? path).replace(/\.@$/, "") : path;
  const rule = g.semantics.keys.find((k) => k.id.replace(/\.@$/, "") === semantic)?.intent ?? null;
  const pickOf = (mode) => {
    const node =
      leaves(theme[mode] ?? {}).find(([p]) => p.replace(/\.@$/, "") === semantic)?.[1] ??
      leaves(theme.base ?? {}).find(([p]) => p.replace(/\.@$/, "") === semantic)?.[1];
    if (!node) return { pick: name(mode === "light" ? light.hops.at(-1) ?? light.end : dark.hops.at(-1) ?? dark.end), why: null, shares: [] };
    const od = node.$extensions?.["open-ds"] ?? {};
    const shares = leaves(theme[mode] ?? {})
      .filter(([p, n]) => n.$value === node.$value && p.replace(/\.@$/, "") !== semantic && !/^color\.neutral\./.test(p))
      .map(([p]) => p.replace(/\.@$/, ""));
    return { pick: name(node.$value), why: od.why ?? null, because: od.because ?? [], shares };
  };
  const pl = pickOf("light");
  const pd = pickOf("dark");
  const seen = { light: new Set(), dark: new Set() };
  for (const id of schemeIds(roots)) {
    const k = `${roots.schemes ?? roots.ui}|${id}`;
    const s = schemeMemo.get(k) ?? loadScheme(id, roots);
    schemeMemo.set(k, s);
    seen.light.add(JSON.stringify(chainOf(s, "light").value));
    seen.dark.add(JSON.stringify(chainOf(s, "dark").value));
  }
  return {
    path,
    key: isKey ? path.replace(/^component\./, "") : null,
    semantic,
    rule,
    light: { value: shown(light.value), pick: pl.pick, why: pl.why },
    dark: { value: shown(dark.value), pick: pd.pick, why: pd.why },
    shares: pl.shares,
    by_scheme: seen.light.size > 1 || seen.dark.size > 1,
  };
}

/** The Anatomy reference of one component in one scheme (OD-229): one engine for the docs page,
 * open-ds anatomy and the MCP's get_anatomy. With a parts layer in the catalogue: the roles, every part
 * (its number, need, roles, and whether its value changes by scheme), and the cards that follow each
 * decision from the answer through the rule to the token. Without one: the parts the code's data-slots
 * name, with their tokens, and a note that the parts layer isn't written yet. */
export function anatomyReference(scheme, g, roots, comp) {
  const spec = g.catalogue.items.find((x) => x.id === comp)?.anatomy;
  if (!spec) {
    const a = anatomy(scheme, g, roots, comp);
    return a && { ...a, parts_layer: false, note: "No parts layer yet: these parts are the code's data-slots, not the parts people see." };
  }
  const roles = g.anatomy?.roles ?? [];
  const questions = new Map([...g.reasons, ...g.scopes].flatMap((s) => s.questions.map((q) => [q.id, { q, scope: s }])));
  const sits = Object.fromEntries(g.situations.map((s) => [s.id, s]));
  const traces = new Map();
  const tr = (p) => (traces.has(p) ? traces.get(p) : (traces.set(p, tokenTrace(scheme, g, roots, p)), traces.get(p)));
  const answerOf = (id) => {
    const a = scheme.answers.find((x) => x.question === id);
    const hit = questions.get(id);
    if (!a || !hit) return null;
    const opt = hit.q.options.find((o) => o.id === a.option);
    return { question: id, scope: hit.scope.kind === "scope" ? hit.scope.title : null, text: hit.q.text, answer: opt?.label ?? a.option, why: a.why };
  };
  const ruleOf = (id) => {
    const u = scheme.usage.find((x) => x.situation === id);
    return u && { situation: id, title: sits[id]?.title ?? id, use: u.use, not: u.not ?? null, why: u.why ?? null };
  };
  const part = (p) => {
    const tokens = (p.tokens ?? []).map(tr).filter(Boolean);
    return {
      ...(p.n && { n: p.n }),
      id: p.id,
      label: p.label,
      need: p.need,
      ...(p.note && { note: p.note }),
      no_token_yet: Boolean(p.n) && !(p.tokens ?? []).length,
      roles: p.roles ?? [],
      by_scheme: tokens.some((t) => t.by_scheme),
      tokens: p.tokens ?? [],
      ...(p.children && { children: p.children.map(part) }),
    };
  };
  return {
    component: comp,
    scheme: scheme.id,
    parts_layer: true,
    roles,
    drawing: spec.drawing,
    image: Object.fromEntries((spec.cards ?? []).filter((c) => c.image).map((c) => [c.title, c.image])),
    parts: spec.parts.map(part),
    cards: spec.cards.map((c) => ({
      title: c.title,
      parts: c.parts,
      roles: c.roles,
      ...(c.image && { image: c.image }),
      answers: c.answers.map(answerOf).filter(Boolean),
      rules: c.rules.map(ruleOf).filter(Boolean),
      tokens: c.tokens.map(tr).filter(Boolean),
    })),
  };
}

/** The reference as plain text, for open-ds anatomy. */
export function anatomyText(ref) {
  if (!ref) return "No anatomy.";
  const lines = [`${ref.component} in ${ref.scheme}: anatomy reference.`];
  if (!ref.parts_layer) {
    lines.push(ref.note, "");
    for (const p of ref.parts) lines.push(`  ${p.part}${p.by_scheme ? "  (by scheme)" : ""}: ${p.tokens.map((t) => t.semantic).join(", ")}`);
    return lines.join("\n");
  }
  const roleOf = Object.fromEntries(ref.roles.map((r) => [r.id, r.label]));
  const walk = (list, d = 0) => {
    for (const p of list) {
      lines.push(`${"  ".repeat(d + 1)}${p.n ? `${p.n}. ` : ""}${p.label} (${p.need}${p.note ? `, ${p.note}` : ""}${p.no_token_yet ? ", no token yet" : ""})${p.by_scheme ? " [by scheme]" : ""}  ${p.roles.map((r) => roleOf[r]).join(", ")}`);
      if (p.children) walk(p.children, d + 1);
    }
  };
  lines.push("", "Parts:");
  walk(ref.parts);
  for (const c of ref.cards) {
    lines.push("", `${c.parts.join(", ")}. ${c.title} (${c.roles.map((r) => roleOf[r]).join(", ")})`);
    for (const a of c.answers) lines.push(`  Answer: ${a.scope ? `${a.scope} · ` : ""}${a.text} → ${a.answer}. ${a.why}`);
    for (const u of c.rules) lines.push(`  Rule: ${u.title}: use ${u.use}.${u.not ? ` Not ${u.not}.` : ""} ${u.why ?? ""}`.trimEnd());
    for (const t of c.tokens) {
      lines.push(`  Token: ${t.semantic}${t.key ? ` → ${t.key}` : ""}  ${t.light.value}${t.dark.value !== t.light.value ? ` · dark ${t.dark.value}` : ""}${t.by_scheme ? " [by scheme]" : ""}`);
      if (t.light.why) lines.push(`    Pick: ${t.light.why}`);
      if (t.dark.why && t.dark.why !== t.light.why) lines.push(`    Dark: ${t.dark.why}`);
      if (t.shares.length) lines.push(`    Shares the step with: ${t.shares.join(", ")}`);
    }
  }
  return lines.join("\n");
}
