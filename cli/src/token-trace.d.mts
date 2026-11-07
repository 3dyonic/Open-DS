// Types for token-trace.mjs, for the docs' Token map page that imports it (OD-274).
export interface TokenNode {
  id: string;
  tier: "decision" | "primitive" | "theme" | "semantic" | "component-key" | "component";
  label: string;
  value: string | null;
  type: string | null;
  description: string | null;
  question?: string;
}
export interface TokenEdge {
  from: string;
  to: string;
  kind: "reference" | "decision";
  via?: string;
}
export interface TokenGraph {
  nodes: TokenNode[];
  edges: TokenEdge[];
}
export function trace(graph: TokenGraph, focus: string): { nodes: Set<string>; edges: Set<number> };
