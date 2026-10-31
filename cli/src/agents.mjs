// Writes the agent files that ship with a deployed scheme: AGENTS.md and the scheme section of
// the skill. They let a coding agent build UI that follows the scheme's answers and usage rules.

import { questions } from "./schemes.mjs";

const COMMANDS = [
  "open-ds why <scheme> <question-id | component-key>",
  "open-ds when <scheme> <situation-id | words>",
  "open-ds add <component>",
];

export function agentsMd(scheme, g, { brand, components, project = false }) {
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
    ...(project
      ? [
          "- `tokens/src/*.tokens.json`: the DTCG token source. Edit a token here, then run `npm run tokens`. Style Dictionary (`tokens/build.mjs`) writes `build/`.",
          "- `src/styles/index.css`: Tailwind, the built tokens (light and dark; add the class `dark` for dark mode), the shadcn and Tailwind theme and the base styles.",
          "- `stories/`: Storybook (`npm run storybook`). `docs/`: the Docusaurus docs (`npm run docs`).",
        ]
      : [
          "- `src/styles/open-ds.css`: every token as a CSS variable (light and dark; add the class `dark` for dark mode), shadcn variables and a Tailwind v4 theme. Import it after Tailwind.",
        ]),
    ...(brand
      ? [`- Brand: set \`data-brand="${brand}"\` on \`<html>\`. Other brands: ${Object.keys(scheme.tokens.brands).join(", ")}.`]
      : []),
    "- `src/components/ui/*`: the components. Each reads only component keys such as `--button-primary-background`. Change a key, not the component.",
    `- \`${project ? "scheme.json" : ".open-ds/scheme.json"}\`: the full scheme: every answer with why and because, every usage rule, the voice, the tokens.`,
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
    scheme.voice.summary.text,
    "",
    ...scheme.voice.principles.map((p) => `- ${p.text}`),
    ...(scheme.voice.brands ? ["", ...Object.entries(scheme.voice.brands).map(([b, v]) => `- Brand ${b}: ${v.text}`)] : []),
    "",
    `Use: ${scheme.voice.words.use.join(", ")}. Avoid: ${scheme.voice.words.avoid.join(", ")}.`,
    "",
    "Tone per moment, with an example:",
    "",
    ...scheme.usage
      .filter((u) => sit[u.situation].scope === "voice")
      .map((u) => `- ${sit[u.situation].title}: ${u.use}${u.example ? ` Example: "${u.example}"` : ""}`),
    "",
    "## Use scenarios",
    "",
    ...scheme.scenarios.map((x) => `- ${x.text}`),
    "",
    "## Key decisions",
    "",
    ...scheme.answers
      .filter((a) => qs[a.question].kind === "scope")
      .map((a) => `- ${qs[a.question].text} **${answer(a.question)}**. ${a.why}`),
    "",
    "## Component inventory",
    "",
    ...(scheme.inventory
      ? [
          `${scheme.inventory.in.length} of ${g.catalogue.items.length} catalogue components are in. Use only these. If none fits, follow the rule for "${sit["missing-component"]?.title ?? "missing component"}" above; never add another component without a new components answer.`,
          "",
          ...scheme.inventory.in.map((i) => `- ${i.id}${components.includes(i.id) ? "" : " (not built yet)"}: ${i.why}`),
          "",
          "Built and installed here: " + components.filter((c) => scheme.inventory.in.some((i) => i.id === c)).join(", "),
        ]
      : [components.join(", ")]),
    "",
    "## Commands",
    "",
    ...COMMANDS.map((c) => `- \`${c}\``),
    "",
  ];
  return lines.join("\n");
}

export function skillSection(scheme, { project = false } = {}) {
  return [
    "",
    `## This project: ${scheme.name}`,
    "",
    scheme.summary,
    "",
    `Read \`AGENTS.md\` for the usage rules and the voice. Read \`${project ? "scheme.json" : ".open-ds/scheme.json"}\` when you need the reason behind a decision.`,
    "",
  ].join("\n");
}
