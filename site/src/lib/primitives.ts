// A scheme's primitives (option tokens) and the semantic tokens (decision tokens) that use them.
import { scheme } from "@/lib/schemes";

type Node = Record<string, unknown>;
export type Primitive = {
  path: string;
  value: string;
  type: string;
  description?: string;
  /** Semantic tokens that point at it, with the mode each lives in. */
  usedBy: { path: string; mode: string }[];
  /** Set when the primitive itself points at another primitive (a role pointing at the palette). */
  ref?: string;
  /** Other primitives that point at this one. */
  pointedBy: string[];
};
export type PrimitiveGroup = { id: string; title: string; why: string; items: Primitive[] };

const GROUPS: [string, string, string][] = [
  ["palette", "Colour palette", "Raw hues, step by step. The only place colour values are typed."],
  [
    "color",
    "Colour roles",
    "Neutral, brand and status ramps. Each step points at the palette, so changing a brand colour means repointing its role.",
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

function flatten(node: Node, prefix: string[] = []): { path: string; token: Node }[] {
  return Object.entries(node).flatMap(([k, v]) => {
    if (k.startsWith("$") || !v || typeof v !== "object") return [];
    const p = [...prefix, k];
    return isToken(v) ? [{ path: p.join("."), token: v }] : flatten(v as Node, p);
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
    brands: Record<string, { label?: string; primitive?: Node }>;
    semantic: Record<string, Node>;
  };

  // Every reference from a semantic token, by the primitive it points at.
  const used = new Map<string, { path: string; mode: string }[]>();
  for (const [mode, tree] of Object.entries(t.semantic)) {
    for (const { path, token } of flatten(tree)) {
      const r = refOf(token.$value);
      if (r) used.set(r, [...(used.get(r) ?? []), { path, mode }]);
    }
  }
  // A primitive that points at another (color.brand.600 → color.violet.600, radius.brand.control
  // → radius.4) passes its users on.
  const primRefs = new Map<string, string[]>();
  for (const tree of [t.primitive, ...Object.values(t.brands).map((b) => b.primitive ?? {})])
    for (const { path, token } of flatten(tree)) {
      const r = refOf(token.$value);
      if (r) primRefs.set(r, [...(primRefs.get(r) ?? []), path]);
    }

  const rows = (tree: Node): Primitive[] =>
    flatten(tree).map(({ path, token }) => {
      const pointedBy = [...new Set(primRefs.get(path) ?? [])];
      const via = pointedBy.flatMap((p) => used.get(p) ?? []);
      const usedBy = [...(used.get(path) ?? []), ...via];
      return {
        path,
        value: show(token.$value),
        type: String(token.$type ?? ""),
        description: token.$description as string | undefined,
        usedBy: usedBy.filter(
          (u, i) => usedBy.findIndex((x) => x.path === u.path && x.mode === u.mode) === i,
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
      // Colour splits in two: raw palette values, and roles that point at them.
      items: all.filter((p) =>
        id === "palette"
          ? p.path.startsWith("color.") && !p.ref
          : id === "color"
            ? p.path.startsWith("color.") && !!p.ref
            : p.path.split(".")[0] === id,
      ),
    })).filter((g) => g.items.length);

  const brandIds = Object.keys(t.brands);
  return {
    scheme: { id: s.id, name: s.name },
    shared: group(rows(t.primitive)),
    brands: brandIds.map((b) => ({
      id: b,
      label: t.brands[b].label ?? b,
      groups: group(rows(t.brands[b].primitive ?? {})),
    })),
    multiBrand: brandIds.length > 1,
  };
}

export type PrimitivesPage = ReturnType<typeof primitivesPage>;
