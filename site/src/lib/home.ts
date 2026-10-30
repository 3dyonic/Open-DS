// Builds the data the home page shows for each scheme, from the scheme files and built tokens.
// Every label on the page is an answer, a token value or a usage example; nothing is typed in.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { answerOf, grammar, scheme, schemes, type Grammar, type Scheme } from "./schemes";

/** Short card labels for the reason groups, as in the design. */
export const REASON_LABEL: Record<string, string> = {
  business: "Product",
  people: "People",
  content: "Content",
  tasks: "Tasks",
  human: "Human factors",
  outcomes: "Outcome",
  scenarios: "Scenarios",
  team: "Team",
  brand: "Brand",
};

/** The scopes the home matrix shows, in the design's order. Every scope is on the scheme page. */
export const HOME_SCOPES = ["typography", "color", "spacing", "shape", "motion", "voice"];

/** The schemes the home tabs show, in the design's order. */
export const HOME_SCHEMES = ["dense-data", "content-first", "accessible-first", "brand-expressive"];

/** Scheme cards in the design's order. */
export const CARD_ORDER = [
  "dense-data",
  "content-first",
  "accessible-first",
  "multi-brand",
  "brand-expressive",
];

const tokensDir = join(process.cwd(), "..", "tokens", "dist");
type Node = { [k: string]: Node | string | number };
const resolved = (id: string, theme = "light"): Node =>
  JSON.parse(readFileSync(join(tokensDir, id, `${theme}.tokens.json`), "utf8"));
// The resolved files hold plain values at the leaves.
const at = (tree: Node, path: string): unknown =>
  path.split(".").reduce<unknown>((n, p) => (n as Node | undefined)?.[p], tree);
const firstTheme = (s: Scheme) => s.themes[0].id;

/** True when no other scheme gives the same answer: that is what makes this scheme itself. */
export function isLit(all: Scheme[], s: Scheme, questionId: string) {
  const option = (x: Scheme) => x.answers.find((a) => a.question === questionId)!.option;
  return all.every((o) => o.id === s.id || option(o) !== option(s));
}

/** Reason groups that scope answers cite most often weigh most. */
function weights(s: Scheme, g: Grammar) {
  const scopeIds = new Set(g.scopes.flatMap((x) => x.questions.map((q) => q.id)));
  const count = new Map<string, number>();
  for (const a of s.answers)
    if (scopeIds.has(a.question))
      for (const b of a.because) {
        const grp = b.split(".")[0];
        if (!scopeIds.has(b)) count.set(grp, (count.get(grp) ?? 0) + 1);
      }
  return count;
}

const sentence = (text: string) => text.split(/(?<=\.)\s/)[0].replace(/\.$/, "");
// Lower-case a label unless it starts with an acronym such as AA.
const lower = (t: string) => (/^[A-Z]{2}/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1));
const family = (stack: string) => stack.split(",")[0].replaceAll('"', "").trim();

export function proofData(id: string) {
  const g = grammar();
  const all = schemes();
  const s = scheme(id);
  const theme = firstTheme(s);
  const tokens = resolved(id, theme);
  const w = weights(s, g);
  const top = [...w.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k]) => k);
  const label = (q: string) => answerOf(s, g, q).option.label;
  const groupText = (grp: string) =>
    g.reasons
      .find((r) => r.id === grp)!
      .questions.map((q, i) => (i ? lower(label(q.id)) : label(q.id)))
      .join(", ");
  const rule = (sit: string) => s.usage.find((u) => u.situation === sit)!;
  return {
    id,
    name: s.name,
    reasons: [
      "business",
      "people",
      "content",
      "tasks",
      "human",
      "outcomes",
      "scenarios",
      "team",
    ].map((grp) => ({
      id: grp,
      label: REASON_LABEL[grp],
      text: groupText(grp),
      lit: top.includes(grp),
    })),
    brand: {
      text: `${label("brand.q1")}, ${lower(label("brand.q2"))}`,
      lit: top.includes("brand"),
      swatches: [
        "color.neutral.900",
        "color.neutral.500",
        "color.neutral.200",
        "color.neutral.50",
        "color.brand.600",
      ].map((p) => String(at(tokens, p))),
      display: String(at(tokens, "font.family.display")),
      fonts: [
        ...new Set(
          [at(tokens, "font.family.display"), at(tokens, "font.family.mono")].map((f) =>
            family(String(f)),
          ),
        ),
      ].join(" · "),
    },
    voice: {
      text: sentence(s.voice.summary.text),
      lit: g.scopes.find((x) => x.id === "voice")!.questions.some((q) => isLit(all, s, q.id)),
      body: String(at(tokens, "font.family.body")),
      toast: rule("success-words").example ?? "",
      error: rule("error-words").example ?? "",
    },
    methods: g.methods.map((m) => m.title),
    rows: HOME_SCOPES.map((sc) => {
      const scope = g.scopes.find((x) => x.id === sc)!;
      return {
        id: sc,
        title: sc === "voice" ? "Voice" : scope.title,
        cells: scope.questions.map((q) => ({
          id: q.id,
          question: q.text,
          label: label(q.id),
          lit: isLit(all, s, q.id),
        })),
      };
    }),
    because: `Because: ${lower(s.answers.find((a) => a.question === "tasks.q1")!.why)} ${s.answers.find((a) => a.question === "outcomes.q1")!.why}`,
  };
}
export type ProofData = ReturnType<typeof proofData>;

/** Facts for a scheme card, read from the built tokens. */
export function cardFacts(s: Scheme) {
  const t = resolved(s.id, firstTheme(s));
  const sizes = Object.keys((t.font as Node)["size"] as Node).filter(
    (k) => !k.startsWith("$"),
  ).length;
  const body = Math.round(parseFloat(String(at(t, "type.body.font-size"))) * 16);
  const target = Math.round(parseFloat(String(at(t, "size.control.default"))) * 16);
  const brands = Object.keys(s.tokens.brands).length;
  return [
    `${sizes} sizes`,
    `${body}px body`,
    brands > 1 ? `${brands} brands` : `${target}px targets`,
  ];
}

/** A 2 by 6 mark: one column per home scope; lit where the scheme differs. */
export function cardMark(s: Scheme) {
  const g = grammar();
  const all = schemes();
  return [0, 1].map((row) =>
    HOME_SCOPES.map((sc) =>
      g.scopes
        .find((x) => x.id === sc)!
        .questions.filter((_, i) => (row === 0 ? i < 3 : i >= 3))
        .some((q) => isLit(all, s, q.id)),
    ),
  );
}
