// The five schemes, by id, for the stories.
import accessible from "../../schemes/accessible-first.json";
import expressive from "../../schemes/brand-expressive.json";
import content from "../../schemes/content-first.json";
import dense from "../../schemes/dense-data.json";
import multi from "../../schemes/multi-brand.json";

export const SCHEMES = {
  "dense-data": dense,
  "content-first": content,
  "accessible-first": accessible,
  "multi-brand": multi,
  "brand-expressive": expressive,
} as unknown as Record<string, SchemeData>;

type Status = { label: string; meaning: "neutral" | "success" | "warning" | "danger"; why: string };
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
  confirm?: { trigger: string; title: string; body: string; confirm: string; cancel: string };
  card?: { title: string; description: string; status: string; primary: string; secondary: string };
  tabs?: { label: string; content: string }[];
  menu?: { trigger: string; items: string[]; destructive: string };
  icon_action?: string;
}
export interface SchemeData {
  id: string;
  name: string;
  inventory: { in: { id: string; why: string }[]; out: { id: string; why: string }[] };
  samples: Samples;
  usage: { situation: string; use: string; not: string; why: string }[];
}
