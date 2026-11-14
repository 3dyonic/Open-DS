// The five schemes and the grammar, for the stories. The one module in Storybook that reads
// schemes/; every other file imports from here.
// The sources are folders split by scope; the CLI's layout module joins each folder back into one object.
import { joinGrammar, joinScheme } from "../../cli/src/scheme-layout.mjs";
// A scheme stores only what it decides: the grammar gives the other component values, and
// the color scales and the spacing map come from their recorded rules.
import { withDefaults } from "../../cli/src/scheme-defaults.mjs";
import { withGenerated } from "../../cli/src/scheme-generated.mjs";
import { withTypeAndSpace } from "../../cli/src/type-space-generated.mjs";

// Every JSON file under schemes/, by its path relative to schemes/: "dense-data/scopes/color.json".
const SOURCES: Record<string, unknown> = Object.fromEntries(
  Object.entries(import.meta.glob("../../schemes/**/*.json", { eager: true, import: "default" })).map(
    ([path, data]) => [path.replace(/^\.\.\/\.\.\/schemes\//, ""), data],
  ),
);
const under = (folder: string) =>
  Object.fromEntries(
    Object.entries(SOURCES)
      .filter(([path]) => path.startsWith(`${folder}/`))
      .map(([path, data]) => [path.slice(folder.length + 1), data]),
  );

const grammarJson = joinGrammar({ "grammar.json": SOURCES["grammar.json"], ...Object.fromEntries(Object.entries(under("grammar")).map(([p, d]) => [`grammar/${p}`, d])) });
export const grammar = grammarJson;
const full = (id: string) => withTypeAndSpace(withGenerated(withDefaults(joinScheme(under(id), grammarJson), grammarJson)));

export const SCHEMES = {
  "dense-data": full("dense-data"),
  "content-first": full("content-first"),
  "accessible-first": full("accessible-first"),
  "multi-brand": full("multi-brand"),
  "brand-expressive": full("brand-expressive"),
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
