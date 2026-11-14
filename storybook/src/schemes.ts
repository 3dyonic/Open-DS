// The five schemes and the grammar, for the stories. The one module in Storybook that reads
// schemes/; every other file imports from here.
import accessible from "../../schemes/accessible-first.json";
import expressive from "../../schemes/brand-expressive.json";
import content from "../../schemes/content-first.json";
import dense from "../../schemes/dense-data.json";
import multi from "../../schemes/multi-brand.json";
import grammarJson from "../../schemes/grammar.json";
// A scheme file stores only what it decides: the grammar gives the other component values, and
// the color scales and the spacing map come from their recorded rules.
import { withDefaults } from "../../cli/src/scheme-defaults.mjs";
import { withGenerated } from "../../cli/src/scheme-generated.mjs";
import { withTypeAndSpace } from "../../cli/src/type-space-generated.mjs";

export const grammar = grammarJson;
const full = (s: unknown) => withTypeAndSpace(withGenerated(withDefaults(s, grammarJson)));

export const SCHEMES = {
  "dense-data": full(dense),
  "content-first": full(content),
  "accessible-first": full(accessible),
  "multi-brand": full(multi),
  "brand-expressive": full(expressive),
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
  field: { label: string; placeholder: string; hint: string; error: string; invalid: string; value?: string };
  choices?: { label: string; description: string; illustrative?: ("label" | "description")[] }[];
  search?: { placeholder: string; query: string; total: string; results: string; none: string };
  chart?: { series: string[]; ticks: string[]; point: { label: string; values: string[] } };
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
