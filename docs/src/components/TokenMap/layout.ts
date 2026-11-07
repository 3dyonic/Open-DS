import dagre from "@dagrejs/dagre";

// The trace's layout: dagre orders the nodes so edges cross as little as it can, then each node moves
// to its tier's column, so a column always holds one tier. Within a column the dagre order stays, and
// nodes that would overlap are pushed down.
export const NODE_WIDTH = 264;
export const NODE_HEIGHT = 80;
const COLUMN_GAP = 96;
const ROW_GAP = 12;

export type Placed = { id: string; x: number; y: number };
export type Column = { tier: string; x: number; top: number };

export function layout({
  ids,
  edges,
  tierOf,
  tiers,
}: {
  ids: string[];
  edges: { from: string; to: string }[];
  tierOf: (id: string) => string;
  tiers: string[];
}): { placed: Placed[]; columns: Column[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: ROW_GAP, ranksep: COLUMN_GAP });
  g.setDefaultEdgeLabel(() => ({}));
  for (const id of ids) g.setNode(id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  for (const e of edges) g.setEdge(e.from, e.to);
  dagre.layout(g);

  const present = tiers.filter((t) => ids.some((id) => tierOf(id) === t));
  const columnX = new Map(present.map((t, i) => [t, i * (NODE_WIDTH + COLUMN_GAP)]));
  const placed: Placed[] = [];
  for (const tier of present) {
    const inTier = ids.filter((id) => tierOf(id) === tier).sort((a, b) => g.node(a).y - g.node(b).y);
    let next = -Infinity;
    for (const id of inTier) {
      const y = Math.max(g.node(id).y - NODE_HEIGHT / 2, next);
      placed.push({ id, x: columnX.get(tier)!, y });
      next = y + NODE_HEIGHT + ROW_GAP;
    }
  }
  const top = Math.min(...placed.map((p) => p.y));
  return { placed, columns: present.map((tier) => ({ tier, x: columnX.get(tier)!, top })) };
}
