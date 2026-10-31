// A scheme's primitives (option tokens) and the semantic tokens (decision tokens) that use them.
import { scheme } from "@/lib/schemes";

type Node = Record<string, unknown>;
export type Primitive = {
  path: string;
  value: string;
  type: string;
  description?: string;
  /** Semantic tokens that reach it (through a brand's theme for brand-dependent keys), with the mode and brand. */
  usedBy: { path: string; mode: string; brand?: string }[];
  /** Set when the primitive itself points at another primitive (a hue's @ pointing at a step). */
  ref?: string;
  /** Other primitives that point at this one. */
  pointedBy: string[];
};
export type PrimitiveGroup = { id: string; title: string; why: string; items: Primitive[] };

const GROUPS: [string, string, string][] = [
  [
    "color",
    "Colour",
    "Raw hues. Each has a light ramp and a dark ramp (the same steps, tuned for dark backgrounds). Steps only: each brand theme picks from these and decides its own base (@).",
  ],
  ["font", "Type", "Font families, sizes, weights and line heights."],
  ["space", "Space", "The spacing steps gaps and insets pick from."],
  ["size", "Size", "Heights of controls, rows and targets."],
  ["radius", "Corners", "Corner options."],
  ["border-width", "Borders", "Line widths."],
  ["shadow", "Shadows", "Raw shadows that elevation picks from."],
  ["duration", "Duration", "How long motion takes."],
  ["easing", "Easing", "The curves motion follows."],
  ["opacity", "Opacity", "See-through steps."],
];

const isToken = (o: unknown): o is Node => !!o && typeof o === "object" && "$value" in (o as Node);

function flatten(
  node: Node,
  prefix: string[] = [],
  type?: string,
): { path: string; token: Node }[] {
  // A group's $type is inherited by its tokens (DTCG).
  const inherited = (node.$type as string | undefined) ?? type;
  return Object.entries(node).flatMap(([k, v]) => {
    if (k.startsWith("$") || !v || typeof v !== "object") return [];
    const p = [...prefix, k];
    return isToken(v)
      ? [{ path: p.join("."), token: { $type: inherited, ...(v as Node) } }]
      : flatten(v as Node, p, inherited);
  });
}

const show = (v: unknown): string => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") {
    const s = v as Record<string, string>;
    if ("offsetY" in s) return `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`;
    if (Array.isArray(v)) return v.join(", ");
    return JSON.stringify(v);
  }
  return String(v);
};
const refOf = (v: unknown) =>
  typeof v === "string" && /^\{.+\}$/.test(v) ? v.slice(1, -1) : undefined;

export function primitivesPage(schemeId: string) {
  const s = scheme(schemeId);
  const t = s.tokens as unknown as {
    primitive: Node;
    brands: Record<string, { label?: string; theme: Record<string, Node | string> }>;
    semantic: Node;
  };
  const brandIds = Object.keys(t.brands);
  const multi = brandIds.length > 1;

  // Which semantic keys say {theme.<path>}, and which point straight at a primitive.
  const byThemeKey = new Map<string, string[]>();
  const used = new Map<string, { path: string; mode: string; brand?: string }[]>();
  const add = (prim: string, u: { path: string; mode: string; brand?: string }) =>
    used.set(prim, [...(used.get(prim) ?? []), u]);
  for (const { path, token } of flatten(t.semantic)) {
    const r = refOf(token.$value);
    if (!r) continue;
    if (r.startsWith("theme."))
      byThemeKey.set(r.slice(6), [...(byThemeKey.get(r.slice(6)) ?? []), path]);
    else add(r, { path, mode: "base" });
  }
  // Each brand's theme picks a primitive per path (the semantic's own path, with a base @ per
  // concept); the semantic keys that read that path use it.
  for (const b of brandIds)
    for (const part of ["base", "light", "dark"]) {
      const tree = t.brands[b].theme[part];
      if (!tree || typeof tree !== "object") continue;
      for (const { path: key, token: tok } of flatten(tree as Node)) {
        const r = refOf(tok.$value);
        if (!r) continue;
        for (const path of byThemeKey.get(key) ?? [])
          add(r, { path, mode: part, ...(multi && { brand: t.brands[b].label ?? b }) });
      }
    }
  // A primitive that points at another passes its users on.
  const primRefs = new Map<string, string[]>();
  for (const { path, token } of flatten(t.primitive)) {
    const r = refOf(token.$value);
    if (r) primRefs.set(r, [...(primRefs.get(r) ?? []), path]);
  }

  // The value a reference ends at, so a primitive that points at another draws its swatch.
  const byPath = new Map(flatten(t.primitive).map(({ path, token }) => [path, token]));
  const resolve = (v: unknown, depth = 0): unknown => {
    const r = refOf(v);
    const next = r && byPath.get(r);
    return next && depth < 10 ? resolve(next.$value, depth + 1) : v;
  };

  const rows = (tree: Node): Primitive[] =>
    flatten(tree).map(({ path, token }) => {
      const pointedBy = [...new Set(primRefs.get(path) ?? [])];
      const via = pointedBy.flatMap((p) => used.get(p) ?? []);
      const usedBy = [...(used.get(path) ?? []), ...via];
      return {
        path,
        value: show(resolve(token.$value)),
        type: String(token.$type ?? ""),
        description: token.$description as string | undefined,
        usedBy: usedBy.filter(
          (u, i) =>
            usedBy.findIndex(
              (x) => x.path === u.path && x.mode === u.mode && x.brand === u.brand,
            ) === i,
        ),
        ref: refOf(token.$value),
        pointedBy,
      };
    });

  const group = (all: Primitive[]): PrimitiveGroup[] =>
    GROUPS.map(([id, title, why]) => ({
      id,
      title,
      why,
      items: all.filter((p) => p.path.split(".")[0] === id),
    })).filter((g) => g.items.length);

  // Every primitive is shared; brands differ only in what their themes pick.
  return {
    scheme: { id: s.id, name: s.name },
    shared: group(rows(t.primitive)),
    brands: [] as { id: string; label: string; groups: PrimitiveGroup[] }[],
    multiBrand: false,
    themes: brandIds.map((b) => ({ id: b, label: t.brands[b].label ?? b })),
  };
}

export type PrimitivesPage = ReturnType<typeof primitivesPage>;
