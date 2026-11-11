// The five schemes and the grammar, for the stories. The one module in Storybook that reads
// schemes/ (OD-289); every other file imports from here.
import accessible from "../../schemes/accessible-first.json";
import expressive from "../../schemes/brand-expressive.json";
import content from "../../schemes/content-first.json";
import dense from "../../schemes/dense-data.json";
import multi from "../../schemes/multi-brand.json";
import grammarJson from "../../schemes/grammar.json";

export const grammar = grammarJson;

export const SCHEMES = {
  "dense-data": dense,
  "content-first": content,
  "accessible-first": accessible,
  "multi-brand": multi,
  "brand-expressive": expressive,
} as unknown as Record<string, SchemeData>;

type Status = { label: string; meaning: "neutral" | "info" | "success" | "warning" | "danger"; why: string };
export interface Samples {
  screen: string;
  actions: { primary: string; secondary: string };
  statuses: Status[];
  table?: {
    caption: string;
    columns: { label: string; numeric?: boolean }[];
    rows: { cells: string[]; status: string }[];
  };
  metrics: { label: string; value: string }[];
  field: { label: string; placeholder: string; hint: string; error: string; invalid: string };
  checkbox?: string[];
  select?: { label: string; options: string[]; value: string };
  switches?: string[];
  messages?: { success: string; error: { title: string; description: string }; neutral: string };
  confirm?: { trigger: string; title: string; body: string; confirm: string; cancel: string; destroys: boolean };
  card?: { title: string; description: string; status: string; primary: string; secondary: string };
  tabs?: { label: string; content: string }[];
  menu?: { trigger: string; items: string[]; destructive: string };
  icon_action?: string;
  conversation?: {
    title: string;
    marker: string;
    messages: { author: string; time: string; text: string; mine?: boolean }[];
    attachment: { name: string; type: string; size: string };
  };
}
export interface SchemeData {
  id: string;
  name: string;
  inventory: {
    in: { id: string; why: string }[];
    out: { id: string; why: string }[];
  };
  samples: Samples;
  usage: { situation: string; use: string; not: string; why: string }[];
}
