// Types for color-map.mjs, for the docs page that imports it.
export type Answer = { id?: string; question: string; answer: string };
export type MapNode = {
  id: string;
  tier: "primitive" | "semantic" | "component-key";
  label: string;
  value: unknown;
  type: string | null;
  description: string | null;
  theme?: boolean;
  answers?: Answer[];
  tone?: "light" | "dark";
};
export type Graph = { nodes: MapNode[]; edges: { from: string; to: string }[] };
export type Reason = { group: string; question: string; answer: string; why: string | null; because: string[] };
export type Step = { id: string; step: string; value: string };
export type Hue = { id: string; steps: Step[] };
export type ColorIndex = {
  mode: "light" | "dark";
  nodes: Map<string, MapNode>;
  readers: Map<string, string[]>;
  hues: Hue[];
};
export type Check = { met: boolean; text: string; rule: string } | null;
export type ReasonStep = { id: string; group: string; question: string; answer: string; why: string | null };
export type Selection = { hue: string; step: string; group: string | null; decision: string | null };

export function primitiveParts(id: string): { hue: string; mode: string; step: string } | null;
export function colorIndex(graph: Graph, mode: "light" | "dark"): ColorIndex;
export function plainName(id: string): string;
export function tokenName(id: string): string;
export function groupOf(id: string): string;
export function decisionsReading(index: ColorIndex, id: string): string[];
export function groupsReading(index: ColorIndex, id: string): { id: string; decisions: string[] }[];
export function componentOf(id: string): string;
export function rowLabel(id: string): string;
export function componentsShowing(index: ColorIndex, decision: string): { component: string; rows: string[] }[];
export function jobFor(index: ColorIndex, decision: string): { kind: string; needs: number; against: string } | null;
export function reasonChain(
  index: ColorIndex,
  reasons: Record<string, Reason>,
  decision: string,
): { steps: ReasonStep[]; links: { from: string; to: string }[] };
export function backgroundsOf(index: ColorIndex): { id: string; value: string }[];
export function contrastsOf(index: ColorIndex, value: string): { label: string; ratio: number }[];
export function impactOf(
  index: ColorIndex,
  id: string,
  value?: string,
): { decisions: number; components: number; checks: { decision: string; check: Check }[] };
export function selectionFor(index: ColorIndex, id: string): Selection | null;
