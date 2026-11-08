// Types for token-trace.mjs, for the docs' Token map page that imports it (OD-274).
export interface TokenNode {
  id: string;
  tier: "primitive" | "semantic" | "component-key";
  label: string;
  value: string | null;
  type: string | null;
  description: string | null;
  /** The token's value goes through the brand theme. */
  theme?: boolean;
}
export interface TokenEdge {
  from: string;
  to: string;
}
export interface TokenGraph {
  nodes: TokenNode[];
  edges: TokenEdge[];
}
export interface TraceColumn {
  role: "primitive" | "source" | "focus" | "reader" | "component-key";
  ids: string[];
  groups?: { component: string; ids: string[] }[];
}
export interface Trace {
  focus: string;
  columns: TraceColumn[];
  edges: Set<number>;
  reads: Record<string, string>;
}
export function trace(graph: TokenGraph, focus: string): Trace | null;
export function componentOf(id: string): string;
export const OPEN_LIMIT: number;
export function groupId(component: string): string;
export function defaultOpen(graph: TokenGraph, t: Trace, limit?: number): Set<string>;
export function allOpen(t: Trace): Set<string>;
export interface VisibleGroup {
  component: string;
  id: string;
  /** The group's tokens that show: empty while it is collapsed. */
  ids: string[];
  /** How many tokens the group holds. */
  count: number;
  open: boolean;
}
export interface VisibleTrace {
  columns: (Omit<TraceColumn, "groups"> & { groups?: VisibleGroup[] })[];
  toggles: Record<string, { count: number; open: boolean }>;
  edges: TokenEdge[];
}
export function visibleTrace(graph: TokenGraph, t: Trace, open: Set<string>): VisibleTrace;
export function renderedIds(visible: VisibleTrace): string[];
export function nameOptions(
  nodes: TokenNode[],
  picked?: string[],
): { families: string[]; roles: { value: string; id?: string }[]; names: { value: string; id: string }[] };
export function namePicks(nodes: TokenNode[], id: string): string[];
