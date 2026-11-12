// Resolved values and their chains, for the quality gate (OD-298). Pure: the caller passes the token
// tree of one brand and mode (built by the ref's own themeTokens), so the same code reads any ref.

const REF = /^\{([^}]+)\}$/;
const INNER_REF = /\{([^}]+)\}/g;
const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

/** Every token in a tree as Map(dotted path → token). */
export function flatMap(tree, prefix = [], out = new Map()) {
  for (const [k, v] of Object.entries(tree ?? {})) {
    if (k.startsWith("$") || !isObject(v)) continue;
    const p = [...prefix, k];
    if ("$value" in v) out.set(p.join("."), v);
    else flatMap(v, p, out);
  }
  return out;
}

/** A token name as people read it: the base step "@" drops out. */
export const shortName = (path) => path.replace(/\.@$/, "");

/** A theme hop as the scheme names it: "<brand>.theme.light.radius.control" is "theme.radius.control". */
export const themeHop = (path) => path.replace(/^[^.]+\.theme\.(base|light|dark)\./, "theme.");

/**
 * Follow a token's references to its value: { hops, end, value, error }. hops are the paths passed
 * through, theme hops named as the scheme names them. A composite value (a shadow, a gradient) has its
 * inner references resolved too, so two values compare by what they paint.
 */
export function follow(all, path) {
  const hops = [];
  const seen = new Set();
  let p = path;
  for (;;) {
    if (seen.has(p)) return { hops, end: p, value: null, error: "is part of a reference cycle" };
    seen.add(p);
    const token = all.get(p);
    if (!token) return { hops, end: p, value: null, error: `${p} does not exist` };
    const m = typeof token.$value === "string" && token.$value.match(REF);
    if (!m) return { hops, end: themeHop(p), value: deep(all, token.$value, seen) };
    hops.push(themeHop(m[1]));
    p = m[1];
  }
}

function deep(all, value, seen) {
  if (typeof value === "string")
    return value.replace(INNER_REF, (whole, ref) => {
      if (seen.has(ref)) return whole;
      const r = follow(all, ref);
      return r.error ? whole : typeof r.value === "string" ? r.value : JSON.stringify(r.value);
    });
  if (Array.isArray(value)) return value.map((v) => deep(all, v, seen));
  if (isObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deep(all, v, seen)]));
  return value;
}

/**
 * The resolved semantic values of one brand and mode, and the chain of each: { values: { token: value },
 * chains: { token: { hops, end } }, errors: [text] }. paths are the tree paths to resolve; names maps a
 * tree path to the name the snapshot uses.
 */
export function resolveTree(tree, paths, names = (p) => shortName(p)) {
  const all = flatMap(tree);
  const values = {};
  const chains = {};
  const errors = [];
  for (const p of paths) {
    const r = follow(all, p);
    const name = names(p);
    if (r.error) errors.push(`${name} ${r.error}`);
    values[name] = r.value;
    chains[name] = { hops: r.hops, end: r.end };
  }
  return { values, chains, errors };
}

/** A length in px: rem at 16px, px, a unitless 0, and a pill (calc(infinity …)) as Infinity. null otherwise. */
export function px(value) {
  if (typeof value === "number") return value === 0 ? 0 : null;
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (/infinity/.test(v)) return Infinity;
  const m = v.match(/^(-?\d*\.?\d+)(rem|px)?$/);
  if (!m) return null;
  if (!m[2]) return Number(m[1]) === 0 ? 0 : null;
  return m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1]);
}

/** A duration in ms, or null. */
export function ms(value) {
  const m = typeof value === "string" && value.trim().match(/^(\d*\.?\d+)(ms|s)$/);
  if (!m) return null;
  return m[2] === "s" ? Number(m[1]) * 1000 : Number(m[1]);
}

/** The #RRGGBB part of a color value, or null (an alpha color or a gradient is not measured). */
export const hex6 = (value) => (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : null);

/** Whether a scale step's value is the one its name says: space.12 is 0.75rem, line-height.1_15 is 1.15. */
export function namedStep(path, value) {
  const step = path.split(".").at(-1);
  if (!/^\d+(_\d+)?$/.test(step)) return false;
  const n = Number(step.replace("_", "."));
  if (typeof value === "number") return value === n || (path.startsWith("opacity.") && value === n / 100);
  const p = px(value);
  return p !== null && Math.abs(p - n) < 1e-6;
}
