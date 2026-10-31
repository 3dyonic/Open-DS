// Reads the grammar and the five schemes from schemes/ at build time.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "..", "schemes");
const read = <T>(file: string): T => JSON.parse(readFileSync(join(dir, file), "utf8")) as T;

export interface Option {
  id: string;
  label: string;
  description?: string;
}
export interface Question {
  id: string;
  method?: "roles" | "count" | "definition" | "values" | "lands";
  text: string;
  description: string;
  options: Option[];
}
export interface Group {
  id: string;
  kind: "reason" | "scope";
  title: string;
  description: string;
  owns?: string[];
  lands_in?: string[];
  situations?: string[];
  questions: Question[];
}
export interface Method {
  id: string;
  title: string;
  description: string;
}
/** Text written from answers. follows lists the question ids it comes from. */
export interface Output {
  text: string;
  follows: string[];
}
export interface Situation {
  id: string;
  scope: string;
  title: string;
  description: string;
}
export interface Grammar {
  description: string;
  methods: Method[];
  reasons: Group[];
  scopes: Group[];
  situations: Situation[];
  component_keys: { id: string; component: string; description: string; default: string }[];
}
export interface Answer {
  question: string;
  option: string;
  why: string;
  because: string[];
}
export interface Rule {
  situation: string;
  use: string;
  not: string;
  why: string;
  because: string[];
  example?: string;
}
export interface Scheme {
  id: string;
  name: string;
  status: string;
  summary: string;
  description: string;
  ai: { use_when: string; avoid_when: string; example_products: string[] };
  scenarios: Output[];
  voice: {
    summary: Output;
    principles: Output[];
    words: { use: string[]; avoid: string[]; follows: string[] };
    brands?: Record<string, Output>;
  };
  themes: { id: string; brand: string; mode: "light" | "dark" }[];
  answers: Answer[];
  usage: Rule[];
  tokens: {
    brands: Record<string, { label: string; description: string }>;
    semantic: Record<string, unknown>;
  };
}

export const grammar = (): Grammar => read<Grammar>("grammar.json");

export const schemeIds = (): string[] =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "grammar.json")
    .map((f) => f.replace(/\.json$/, ""))
    .sort();

/** The components every scheme ships, from ui/src/components. */
export const uiComponents = (): string[] =>
  readdirSync(join(process.cwd(), "..", "ui", "src", "components"))
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""));

export const scheme = (id: string): Scheme => read<Scheme>(`${id}.json`);

export const schemes = (): Scheme[] => schemeIds().map(scheme);

/** The answer label and its question for a scheme. */
export function answerOf(s: Scheme, g: Grammar, questionId: string) {
  const q = [...g.reasons, ...g.scopes]
    .flatMap((x) => x.questions)
    .find((x) => x.id === questionId)!;
  const a = s.answers.find((x) => x.question === questionId)!;
  return { question: q, answer: a, option: q.options.find((o) => o.id === a.option)! };
}

/** Flattens a token group into rows of name and value or reference. */
export function tokenRows(
  group: unknown,
  prefix = "",
): { name: string; value: string; description?: string }[] {
  const rows: { name: string; value: string; description?: string }[] = [];
  for (const [k, v] of Object.entries(group as Record<string, unknown>)) {
    if (k.startsWith("$")) continue;
    const name = prefix ? `${prefix}.${k}` : k;
    const t = v as { $value?: unknown; $description?: string };
    if (t && typeof t === "object" && "$value" in t) {
      rows.push({
        name,
        value: typeof t.$value === "string" ? t.$value : JSON.stringify(t.$value),
        description: t.$description,
      });
    } else rows.push(...tokenRows(v, name));
  }
  return rows;
}

/** For one question, the names of the schemes that pick each option, by option id. */
export function pickedBy(questionId: string): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const s of schemes()) {
    const a = s.answers.find((x) => x.question === questionId);
    if (a) (out[a.option] ??= []).push(s.name);
  }
  return out;
}
