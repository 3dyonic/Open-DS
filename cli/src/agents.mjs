// Writes the agent files that ship with a deployed scheme: AGENTS.md and the scheme section of
// the skill. They let a coding agent build UI that follows the scheme's answers and usage rules.

import { BUDGET, colorIds, READ_ONCE } from "./brief.mjs";
import { questions } from "./schemes.mjs";

const COMMANDS = [
  "open-ds why <scheme> <question-id | component-key>",
  "open-ds decisions <scheme> [question-id]",
  "open-ds when <scheme> <situation-id | words>",
  "open-ds context <scheme> <task | component | key | token | situation>",
  "open-ds add <component>",
];

/** The grammar's rules for options (OD-221), in one sentence for the agent context. */
export const optionsRule = (g) =>
  [
    g.options?.rules?.length
      ? `New options must look clearly different from their neighbours: ${g.options.rules.map((r) => r.say).join("; ")}.`
      : "",
    g.options?.used ? `And ${g.options.used.say}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

/** OD-222: what sits on a fill comes from the fill's tone, generated from the grammar. */
export const toneRule = (g) =>
  g.semantics?.tones
    ? "Text on a fill follows the fill's tone: `color.text.on-light` on a light fill, `color.text.on-dark` on a dark one, the same two colors in both modes. Each fill's tone is decided in the theme (`$extensions.open-ds.tone`). On the page's own surfaces, use `color.text.*`."
    : "";

export function agentsMd(scheme, g, { brand, components, project = false }) {
  if (project) return agentsCore(scheme, g, { brand, components });
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
          `- \`tokens/src/\`: the DTCG token source, one file per group. \`primitive/\` holds the raw options, steps only (color by hue: \`color.<hue>.light.<step>\`, \`color.<hue>.dark.<step>\`). \`theme/<brand>\` is the decision layer: each brand's picks in light and dark, on the same paths as the semantics, with a base \`@\` per concept (\`color.action.primary.@\` beside \`color.action.primary.hover\`). \`semantic/\` holds the plain keys; a brand-dependent one says \`{theme.<its path>}\`. Only semantic and component keys ship as CSS variables, and the \`@\` drops out of the name (\`--color-action-primary\`). Each folder has a README. Edit a token, then run \`npm run tokens\`. Style Dictionary (\`tokens/build.mjs\`) writes \`build/\`. ${optionsRule(g)} ${toneRule(g)}`,
          "- `src/styles/index.css`: Tailwind, the built tokens (light and dark; add the class `dark` for dark mode), the shadcn and Tailwind theme and the base styles.",
          "- `stories/`: Storybook (`npm run storybook`). `docs/`: the Docusaurus docs (`npm run docs`).",
        ]
      : [
          "- `src/styles/open-ds.css`: the semantic and component keys as CSS variables (light and dark; add the class `dark` for dark mode), shadcn variables and a Tailwind v4 theme. Import it after Tailwind.",
        ]),
    ...(brand
      ? [
          `- Brand: set \`data-brand="${brand}"\` on \`<html>\`. Other brands: ${Object.keys(scheme.tokens.brands).join(", ")}.`,
        ]
      : []),
    "- `src/components/ui/*`: the components. Each reads only component keys such as `--button-primary-background`. Change a key, not the component.",
    `- \`${project ? "scheme.json" : ".open-ds/scheme.json"}\`: the full scheme: every answer with why and because, every usage rule, the voice, the tokens.`,
    "- `open-ds.json`: what was installed.",
    "",
    "## Usage rules (when to use what)",
    "",
    "| Situation | Use | Not | Why |",
    "| --- | --- | --- | --- |",
    ...scheme.usage.map(
      (u) => `| ${sit[u.situation].title} | ${u.use} | ${u.not} | ${u.why} |`,
    ),
    "",
    "## Color: what each one is for",
    "",
    ...(g.semantics
      ? [
          g.semantics.urgency.description,
          "",
          "| Token | For | Not for |",
          "| --- | --- | --- |",
          ...g.semantics.keys.map(
            (k) =>
              `| \`${k.id}\` | ${k.intent} | ${k.not_for.map((n) => `${n.when}: \`${n.use}\``).join("; ")} |`,
          ),
          "",
          "Which text may sit on which fill: `open-ds context <scheme> <token>` (`sits_on` and `takes`).",
        ]
      : []),
    "",
    "## Voice and tone",
    "",
    scheme.voice.summary.text,
    "",
    ...scheme.voice.principles.map((p) => `- ${p.text}`),
    ...(scheme.voice.brands
      ? [
          "",
          ...Object.entries(scheme.voice.brands).map(
            ([b, v]) => `- Brand ${b}: ${v.text}`,
          ),
        ]
      : []),
    "",
    `Use: ${scheme.voice.words.use.join(", ")}. Avoid: ${scheme.voice.words.avoid.join(", ")}.`,
    "",
    "Tone per moment, with an example:",
    "",
    ...scheme.usage
      .filter((u) => sit[u.situation].scope === "voice")
      .map(
        (u) =>
          `- ${sit[u.situation].title}: ${u.use}${u.example ? ` Example: "${u.example}"` : ""}`,
      ),
    "",
    "## Use scenarios",
    "",
    ...scheme.scenarios.map((x) => `- ${x.text}`),
    "",
    "## Key decisions",
    "",
    ...scheme.answers
      .filter((a) => qs[a.question].kind === "scope")
      .map(
        (a) => `- ${qs[a.question].text} **${answer(a.question)}**. ${a.why}`,
      ),
    "",
    "## Component inventory",
    "",
    ...(scheme.inventory
      ? [
          `${scheme.inventory.in.length} of ${g.catalogue.items.length} catalogue components are in. Use only these. If none fits, follow the rule for "${sit["missing-component"]?.title ?? "missing component"}" above; never add another component without a new components answer.`,
          "",
          ...scheme.inventory.in.map((i) => `- ${i.id}: ${i.why}`),
          "",
          "Built and installed here: " +
            components
              .filter((c) => scheme.inventory.in.some((i) => i.id === c))
              .join(", "),
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

/**
 * AGENTS.md in a created project (OD-205): the read-once text and the rules that always apply,
 * within BUDGET.agents. The detail lives in context/, one booklet per component, color and task.
 */
export function agentsCore(scheme, g, { brand, components }) {
  const groups = {};
  for (const id of colorIds(g)) {
    const [, group, ...rest] = id.split(".");
    (groups[group] ??= []).push(rest.join(".") || "@");
  }
  const inventory = scheme.inventory
    ? components.filter((c) => scheme.inventory.in.some((i) => i.id === c))
    : components;
  return [
    `# AGENTS.md: ${scheme.name} design system`,
    "",
    `Open DS scheme **${scheme.name}** (${scheme.id} ${scheme.version}${brand ? `, brand ${brand}` : ""}). ${scheme.summary}`,
    `Use when: ${scheme.ai.use_when} Avoid when: ${scheme.ai.avoid_when}`,
    "",
    READ_ONCE,
    "",
    "## Never",
    "",
    "- A raw value: a hex or rgb color, a px size, a Tailwind palette class. Use a token or a component key.",
    "- A spacing as a number (p-6, gap-1.5, p-[10px]). Between things use a role (gap-section, p-container); inside a component, a map step (p-map-x6). See context/tasks/build.md, section spacing.",
    "- A component that is not listed below. If none fits, compose from these; see context/tasks/build.md.",
    "- A variant this scheme does not use. Each component's booklet says which variants it uses.",
    "- A status color one level up the urgency order to get attention.",
    "",
    `## Components (${inventory.length})`,
    "",
    inventory.join(", "),
    "",
    "## Colors",
    "",
    "One booklet each in context/colors/. By group:",
    ...Object.entries(groups).map(([k, v]) => `- color.${k}: ${v.join(", ")}`),
    "",
    "## Files",
    "",
    `- \`tokens/src/\`: the token source; edit, then \`npm run tokens\`. ${optionsRule(g)} \`scheme.json\`: every answer with why.`,
    "- `src/components/ui/`: the components; they read only component keys. `stories/`, `docs/`: Storybook and docs.",
    `- \`context/\`: the booklets and the router. Regenerate with \`npx open-ds context --write\`.${brand ? ` Brand: \`data-brand="${brand}"\` on \`<html>\`.` : ""}`,
    "",
    "## Commands",
    "",
    "- `npx open-ds check .`: check the UI and that context/ matches the scheme.",
    `- \`npx open-ds context ${scheme.id} <component | token | task> [--section <name>]\`, or \`--file <path>\`.`,
    `- \`npx open-ds why ${scheme.id} <question | key>\`: the reason behind an answer.`,
    `- \`npx open-ds decisions ${scheme.id} [question]\`: everything an answer decided, the same as the docs page Decision reference.`,
    "",
  ].join("\n");
}

export { BUDGET };
