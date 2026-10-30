// Writes the agent files that ship with a deployed scheme: AGENTS.md and the scheme section of
// the skill. They let a coding agent build UI that follows the scheme's answers and usage rules.

import { questions } from "./schemes.mjs";

const COMMANDS = [
  "open-ds why <scheme> <question-id | component-key>",
  "open-ds when <scheme> <situation-id | words>",
  "open-ds add <component>",
];

export function agentsMd(scheme, g, { brand, components }) {
  const qs = questions(g);
  const sit = Object.fromEntries(g.situations.map((s) => [s.id, s]));
  const answer = (id) => {
    const a = scheme.answers.find((x) => x.question === id);
    return qs[id].options.find((o) => o.id === a.option).label;
  };
  const lines = [
    `# AGENTS.md: ${scheme.name} design system`,
    "",
    `This project uses the Open DS scheme **${scheme.name}** (${scheme.id} ${scheme.version}${brand ? `, brand ${brand}` : ""}). ${scheme.summary}`,
    "",
    "Read this before you write UI. Follow the usage rules and the voice. Do not invent new colors, sizes or spacing: use the tokens and the components.",
    "",
    "## What it is for",
    "",
    `- Use when: ${scheme.ai.use_when}`,
    `- Avoid when: ${scheme.ai.avoid_when}`,
    "",
    "## How the files fit together",
    "",
    "- `src/styles/open-ds.css`: every token as a CSS variable (light and dark; add the class `dark` for dark mode), shadcn variables and a Tailwind v4 theme. Import it after Tailwind.",
    ...(brand ? [`- Brand: set \`data-brand="${brand}"\` on \`<html>\`. Other brands: ${Object.keys(scheme.tokens.brands).join(", ")}.`] : []),
    "- `src/components/ui/*`: the components. Each reads only component keys such as `--button-primary-background`. Change a key, not the component.",
    "- `.open-ds/scheme.json`: the full scheme: every answer with why and because, every usage rule, the voice, the tokens.",
    "- `open-ds.json`: what was installed.",
    "",
    "## Usage rules (when to use what)",
    "",
    "| Situation | Use | Not | Why |",
    "| --- | --- | --- | --- |",
    ...scheme.usage.map((u) => `| ${sit[u.situation].title} | ${u.use} | ${u.not} | ${u.why} |`),
    "",
    "## Voice and tone",
    "",
    scheme.voice.summary,
    "",
    ...scheme.voice.principles.map((p) => `- ${p}`),
    "",
    ...Object.entries(scheme.voice.tone).map(([k, v]) => `- ${k[0].toUpperCase() + k.slice(1)}: ${v}`),
    "",
    "Examples:",
    "",
    ...scheme.voice.examples.map((e) => `- ${e.context}: "${e.text}"`),
    "",
    `Use: ${scheme.voice.words.use.join(", ")}. Avoid: ${scheme.voice.words.avoid.join(", ")}.`,
    "",
    "## Key decisions",
    "",
    ...scheme.answers
      .filter((a) => qs[a.question].kind === "scope")
      .map((a) => `- ${qs[a.question].text} **${answer(a.question)}**. ${a.why}`),
    "",
    "## Components installed",
    "",
    components.join(", "),
    "",
    "## Commands",
    "",
    ...COMMANDS.map((c) => `- \`${c}\``),
    "",
  ];
  return lines.join("\n");
}

export function skillSection(scheme) {
  return [
    "",
    `## This project: ${scheme.name}`,
    "",
    scheme.summary,
    "",
    "Read `AGENTS.md` for the usage rules and the voice. Read `.open-ds/scheme.json` when you need the reason behind a decision.",
    "",
  ].join("\n");
}
