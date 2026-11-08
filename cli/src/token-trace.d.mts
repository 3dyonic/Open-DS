// Types for token-trace.mjs, for the docs' Token map page that imports it (OD-274).
export interface TokenNode {
  id: string;
  tier: "primitive" | "semantic" | "component-key";
  label: string;
  value: string | null;
  type: string | null;
  /** The token's own $description. */
  description: string | null;
  /** The token's value goes through the brand theme. */
  theme?: boolean;
  /** The grammar answers a semantic token's pick records. */
  answers?: { question: string; answer: string }[];
  /** The tone a semantic fill records: the text on it follows it. */
  tone?: "light" | "dark";
  /** What a primitive means, in words. No scheme holds it yet. */
  meaning?: string;
}
export interface TokenEdge {
  from: string;
  to: string;
}
export interface TokenGraph {
  nodes: TokenNode[];
  edges: TokenEdge[];
}
export interface Scope {
  id: string;
  title: string;
  owns: string[];
}
export interface Word {
  key: string;
  id: string;
  family: string;
  familyLabel: string;
  step: string;
}
export interface MapIndex {
  mode: string;
  byId: Map<string, TokenNode>;
  words: Map<string, Word>;
  wordOfId: Map<string, string>;
  scopes: (Scope & { keys: string[] })[];
  semanticReaders: (id: string) => string[];
}
export interface MapPath {
  scope?: string;
  family?: string;
  step?: string;
  group?: string;
  decision?: string;
}
export interface MapColumn {
  level: "scope" | "scale" | "step" | "word" | "group" | "decision" | "where";
  ids: string[];
  open: string | null;
  hidden?: number;
}
export interface Family {
  id: string;
  label: string;
  keys: string[];
  swatch: string | null;
}
export interface Group {
  id: string;
  label: string;
  decisions: string[];
}
export interface ComponentReads {
  component: string;
  label: string;
  rows: { id: string; label: string }[];
}
export interface SearchEntry {
  id: string;
  kind: "Value" | "Token" | "Component";
  label: string;
  detail: string;
  text: string;
}
export const UNUSED: { id: string; title: string };
export const UNSCOPED: { id: string; title: string };
export const COMPONENT_LIMIT: number;
export function plainName(part: string): string;
export function wordKey(id: string, mode: string): string | null;
export function componentOf(id: string): string;
export function rowLabel(id: string): string;
export function tokenName(id: string): string;
export function groupOf(id: string): { id: string; label: string };
export function mapIndex(graph: TokenGraph, options: { scopes: Scope[]; mode: string }): MapIndex;
export function familiesIn(index: MapIndex, scopeId: string): Family[] | null;
export function stepsIn(index: MapIndex, path: { scope?: string; family?: string }): string[];
export function stepLabel(index: MapIndex, step: { key: string; family?: string }): string;
export function groupsOf(index: MapIndex, key: string): Group[];
export function directReaders(index: MapIndex, id: string): string[];
export function componentsReading(index: MapIndex, id: string): ComponentReads[];
export function cleanPath(index: MapIndex, path?: MapPath): MapPath;
export function columnsFor(index: MapIndex, path: MapPath, options?: { more?: boolean }): MapColumn[];
export function pathTo(index: MapIndex, id: string): { path: MapPath; more: boolean; row: string | null } | null;
export function searchEntries(index: MapIndex): SearchEntry[];
export function search(entries: SearchEntry[], query: string, limit?: number): { matches: SearchEntry[]; total: number };
