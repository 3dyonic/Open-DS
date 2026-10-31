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
  /** Set when the primitive itself points at another primitive. */
  ref?: string;
};
export type PrimitiveGroup = { id: string; title: string; why: string; items: Primitive[] };

const GROUPS: [string, string, string][] = [
  [
    "color",
    "Colour",
    "Every colour the scheme can pick from: neutrals, the brand ramp and status colours.",
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
  // A brand primitive that points at a shared one (radius.brand.control → radius.4) passes its users on.
  const brandRefs = new Map<string, string[]>();
  for (const b of Object.values(t.brands))
    for (const { path, token } of flatten(b.primitive ?? {})) {
      const r = refOf(token.$value);
      if (r) brandRefs.set(r, [...(brandRefs.get(r) ?? []), path]);
    }

  const rows = (tree: Node): Primitive[] =>
    flatten(tree).map(({ path, token }) => {
      const via = (brandRefs.get(path) ?? []).flatMap((p) => used.get(p) ?? []);
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
      };
    });

  const group = (all: Primitive[]): PrimitiveGroup[] =>
    GROUPS.map(([id, title, why]) => ({
      id,
      title,
      why,
      items: all.filter((p) => p.path.split(".")[0] === id),
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
