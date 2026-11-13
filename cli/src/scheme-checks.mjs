// The rules every scheme keeps (OD-292, ADR-002 step 3). Each rule takes one scheme and returns what
// breaks it, so the build, the harness and a user's project run the same rules. No file access.
import { contrast } from "./ramps.mjs";
import { paletteStep, themeTokens } from "./tokens.mjs";
import { pairsIn } from "./tones.mjs";
import { generatedProblems } from "./type-space-generated.mjs";

/** A DTCG group as { "a.b.c": token }. */
export function flatten(group, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(group ?? {})) {
    if (k.startsWith("$")) continue;
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && "$value" in v) out[path] = v;
    else if (v && typeof v === "object") Object.assign(out, flatten(v, path));
  }
  return out;
}

/** Follow {references} to a literal value: { value } or { error }. */
export function resolve(all, path, seen = new Set()) {
  if (seen.has(path)) return { error: "is part of a reference cycle" };
  const t = all[path];
  if (!t) return { error: "does not exist" };
  const m = typeof t.$value === "string" && t.$value.match(/^\{([^}]+)\}$/);
  if (!m) return { value: t.$value };
  seen.add(path);
  const r = resolve(all, m[1], seen);
  return r.error ? { error: `→ ${m[1]} ${r.error}` } : r;
}

const walk = (node, path, leaf) => {
  if (!node || typeof node !== "object") return;
  if ("$value" in node) return leaf(path, node);
  for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v, path ? `${path}.${k}` : k, leaf);
};

/** Every token resolves in every brand and mode, and each brand's light and dark themes hold the same keys. */
export function tokensResolve(scheme) {
  const problems = [];
  const t = scheme.tokens;
  for (const brand of Object.keys(t.brands)) {
    const th = t.brands[brand].theme;
    if (Object.keys(flatten(th.light)).sort().join() !== Object.keys(flatten(th.dark)).sort().join())
      problems.push(`${scheme.id}/${brand}: the light and dark themes have different keys`);
    for (const mode of ["light", "dark"]) {
      const all = flatten(themeTokens({ id: scheme.id, tokens: t }, brand, mode));
      for (const path of Object.keys(all)) {
        const r = resolve(all, path);
        if (r.error) problems.push(`${scheme.id}/${brand}/${mode}: ${path} ${r.error}`);
      }
    }
  }
  return problems;
}

/** Raw values live only on primitives: each semantic, theme and component token is a link. Returns the raw paths. */
export function rawValues(scheme) {
  const raw = [];
  const link = (path, node) => {
    if (!(typeof node.$value === "string" && /^\{[^}]+\}$/.test(node.$value))) raw.push(path);
  };
  const t = scheme.tokens;
  walk(t.semantic, "", link);
  for (const b of Object.values(t.brands)) walk(b.theme, "", link);
  walk(t.component, "", link);
  return raw;
}

/**
 * What a component key may read (OD-309): a semantic, another key, or a step of the scheme's own palette
 * with a why. A raw value, a step without a why and a step of a hue the scheme does not define break it.
 * Returns one finding per break, in words.
 */
export function componentLinks(scheme) {
  const hues = new Set(Object.keys(scheme.tokens.primitive?.color ?? {}).filter((k) => !k.startsWith("$")));
  const findings = [];
  walk(scheme.tokens.component, "", (path, node) => {
    const v = node.$value;
    if (!(typeof v === "string" && /^\{[^}]+\}$/.test(v))) {
      findings.push(`${scheme.id}: component.${path} holds the raw value ${JSON.stringify(v)}; point it at a semantic or a palette step`);
      return;
    }
    const step = paletteStep(v);
    if (!step) return;
    if (!hues.has(step.hue))
      findings.push(`${scheme.id}: component.${path} reads ${v.slice(1, -1)}, a hue the scheme does not define`);
    if (!node.$extensions?.["open-ds"]?.why)
      findings.push(`${scheme.id}: component.${path} reads the palette step ${v.slice(1, -1)} with no why`);
  });
  return findings;
}

/** Each theme pick's because names a question this scheme answers. { cited, gaps } */
export function picksCiteAnswers(scheme) {
  const answered = new Set(scheme.answers.map((a) => a.question));
  const gaps = [];
  let cited = 0;
  for (const [brand, def] of Object.entries(scheme.tokens.brands))
    for (const mode of ["base", "light", "dark"])
      walk(def.theme[mode], "", (path, node) => {
        for (const q of node.$extensions?.["open-ds"]?.because ?? []) {
          cited++;
          if (!answered.has(q)) gaps.push(`${scheme.id}/${brand}/${mode} ${path} cites ${q}, which this scheme does not answer`);
        }
      });
  return { cited, gaps };
}

/** Each spacing is a multiple of 4px, at most 64px; the component spacing map's hairline is the one exception. */
export function spacingOffGrid(scheme) {
  const gaps = [];
  const all = flatten(themeTokens({ id: scheme.id, tokens: scheme.tokens }, Object.keys(scheme.tokens.brands)[0], "light"));
  const check = (group, prefix) =>
    walk(group, prefix, (p) => {
      if (p === "component-spacing-map.hairline") return;
      const px = Math.round(parseFloat(String(resolve(all, p)?.value ?? "")) * 16 * 1000) / 1000;
      if (!(px % 4 === 0 && px <= 64)) gaps.push(`${scheme.id}: ${p} is ${px}px`);
    });
  check(scheme.tokens.semantic.space, "space");
  check(scheme.tokens.semantic["component-spacing-map"], "component-spacing-map");
  return gaps;
}

/**
 * Each contrast pair the grammar names keeps its ratio in every brand and mode (OD-222). A pair on a fill
 * that waits for a recorded fix goes in waiting, not in gaps. { pairs, gaps, waiting }
 */
export function contrastPairs(scheme, g) {
  const gaps = [];
  const waiting = new Set();
  let pairs = 0;
  for (const brand of Object.keys(scheme.tokens.brands))
    for (const mode of ["light", "dark"]) {
      const all = flatten(themeTokens({ id: scheme.id, tokens: scheme.tokens }, brand, mode));
      const hex = (p) => {
        const v = resolve(all, p).value;
        return typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : null;
      };
      for (const p of pairsIn(g, scheme, brand, mode)) {
        const [a, b] = [hex(p.key), hex(p.on)];
        if (!a || !b) continue;
        pairs++;
        const r = contrast(a, b);
        if (r >= p.contrast) continue;
        if (p.waits) waiting.add(`${scheme.id}/${brand}/${mode} ${p.on} (${p.waits.for})`);
        else gaps.push(`${scheme.id}/${brand}/${mode}: ${p.key} on ${p.on} is ${r.toFixed(2)}:1, needs ${p.contrast}:1`);
      }
    }
  return { pairs, gaps, waiting: [...waiting] };
}

/** What a compiled JSON Schema validator (Ajv) finds wrong with the scheme, one line per error. */
export function schemaFindings(scheme, validate) {
  if (validate(scheme)) return [];
  return (validate.errors ?? []).map((e) => `${scheme.id}: ${e.instancePath || "/"} ${e.message}`);
}

/**
 * Every rule for one scheme: [{ rule, findings }]. A scheme passes when every findings list is empty.
 * grammar names the contrast pairs; validate is the compiled scheme schema (schemeValidator); stored is the
 * scheme as its file holds it: with it, a type or spacing value set by hand next to its record fails.
 */
export function checkScheme(scheme, { grammar, validate, stored }) {
  const schema = { rule: "matches the scheme schema", findings: schemaFindings(scheme, validate) };
  // The other rules read the scheme's shape, so they run only on a scheme that matches the schema.
  if (schema.findings.length) return [schema];
  return [
    schema,
    { rule: "tokens resolve", findings: tokensResolve(scheme) },
    { rule: "semantics are links", findings: rawValues(scheme).map((p) => `${scheme.id}: raw value on ${p}`) },
    { rule: "component keys read semantics or own steps", findings: componentLinks(scheme) },
    { rule: "picks cite answers", findings: picksCiteAnswers(scheme).gaps },
    { rule: "spacing on the grid", findings: spacingOffGrid(scheme) },
    { rule: "contrast pairs pass", findings: contrastPairs(scheme, grammar).gaps },
    { rule: "type and spacing come from their records", findings: generatedProblems(scheme, stored) },
  ];
}
