#!/usr/bin/env node
// Writes llms.txt (an index in the llmstxt.org format) and llms-full.txt (every scheme as plain
// text) at the repository root, from schemes/*.json. With --check, fails if they are out of date.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_URL = "https://raw.githubusercontent.com/3dyonic/Open-DS/RC1";

export function buildLlms(repo) {
  const read = (p) => JSON.parse(readFileSync(join(repo, p), "utf8"));
  const g = read("schemes/grammar.json");
  const ids = readdirSync(join(repo, "schemes"))
    .filter((f) => f.endsWith(".json") && f !== "grammar.json")
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  const schemes = ids.map((id) => read(`schemes/${id}.json`));
  const qs = Object.fromEntries(
    [...g.reasons, ...g.scopes].flatMap((x) =>
      x.questions.map((q) => [q.id, q]),
    ),
  );
  const sits = Object.fromEntries(g.situations.map((s) => [s.id, s]));

  const index = [
    "# Open DS",
    "",
    "> Open DS is a finite grammar for design systems. A scheme is one full set of answers to it, each with a reason. A scheme deploys as a full design system: Style Dictionary tokens (light and dark), shadcn-style components on component keys, Storybook, docs, AGENTS.md, an agent skill and an MCP server.",
    "",
    "Pick a scheme by its use_when and avoid_when. Deploy it with the CLI (`open-ds init <scheme>`) or the MCP tool `deploy`. While building UI, follow the scheme's usage rules (`when_to_use`) and voice; explain decisions with `why`.",
    "",
    "## Schemes",
    "",
    ...schemes.map(
      (s) =>
        `- [${s.name}](${REPO_URL}/schemes/${s.id}.json): id ${s.id}. ${s.summary} Use when: ${s.ai.use_when}`,
    ),
    "",
    "## Grammar and formats",
    "",
    `- [Grammar](${REPO_URL}/schemes/grammar.json): ${g.reasons.length} reason groups, ${g.scopes.length} scopes (each answers the same ${g.methods.length} method questions: ${g.methods.map((m) => m.title.toLowerCase()).join(", ")}), ${Object.keys(qs).length} questions, ${g.situations.length} situations, ${g.component_keys.length} component keys`,
    `- [Scheme JSON Schema](${REPO_URL}/schema/scheme.schema.json): the scheme format, every property described`,
    `- [Grammar JSON Schema](${REPO_URL}/schema/grammar.schema.json): the grammar format`,
    "",
    "## Tools",
    "",
    `- [CLI](${REPO_URL}/cli/README.md): list, show, why, when, init, add`,
    `- [MCP server](${REPO_URL}/mcp/README.md): list_schemes, get_scheme, get_answer, why, when_to_use, deploy`,
    `- [Agent skill](${REPO_URL}/skills/open-ds/SKILL.md): how an agent picks, deploys and follows a scheme`,
    `- [AGENTS.md](${REPO_URL}/AGENTS.md): how to work on this repository`,
    "",
    "## Optional",
    "",
    `- [llms-full.txt](${REPO_URL}/llms-full.txt): every scheme in one file: answers with reasons, usage rules, voice`,
    "",
  ].join("\n");

  const full = [
    "# Open DS: every scheme in full",
    "",
    "> Generated from schemes/*.json. Each scheme lists its answers (question: answer. why), its usage rules (situation: use; not; why) and its voice.",
    "",
    ...schemes.flatMap((s) => {
      const answer = (a) =>
        qs[a.question].options.find((o) => o.id === a.option).label;
      return [
        `## ${s.name} (${s.id})`,
        "",
        s.description,
        "",
        `Use when: ${s.ai.use_when}`,
        `Avoid when: ${s.ai.avoid_when}`,
        `Themes: ${s.themes.map((t) => t.id).join(", ")}`,
        "",
        "### Answers",
        "",
        ...s.answers.map(
          (a) =>
            `- ${a.question} ${qs[a.question].text} ${answer(a)}. ${a.why}${a.because.length ? ` (because ${a.because.join(", ")})` : ""}`,
        ),
        "",
        "### Usage rules",
        "",
        ...s.usage.map(
          (u) =>
            `- ${sits[u.situation].title} (${u.situation}): use ${u.use}; not ${u.not}; ${u.why}${u.example ? ` Example: "${u.example}"` : ""}`,
        ),
        "",
        "### Voice and tone",
        "",
        `${s.voice.summary.text} (follows ${s.voice.summary.follows.join(", ")})`,
        ...s.voice.principles.map(
          (p) => `- ${p.text} (follows ${p.follows.join(", ")})`,
        ),
        `Use: ${s.voice.words.use.join(", ")}. Avoid: ${s.voice.words.avoid.join(", ")}.`,
        "The tone per moment is in the usage rules of the voice situations above.",
        "",
        "### Use scenarios",
        "",
        ...s.scenarios.map(
          (x) => `- ${x.text} (follows ${x.follows.join(", ")})`,
        ),
        "",
      ];
    }),
  ].join("\n");

  return { "llms.txt": index, "llms-full.txt": full };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
  const out = buildLlms(repo);
  const check = process.argv.includes("--check");
  const stale = Object.entries(out).filter(
    ([f, t]) =>
      !existsSync(join(repo, f)) || readFileSync(join(repo, f), "utf8") !== t,
  );
  if (check) {
    if (stale.length) {
      console.error(
        `Out of date: ${stale.map(([f]) => f).join(", ")}. Run: node scripts/build-llms.mjs`,
      );
      process.exit(1);
    }
    console.log("llms files are current.");
  } else {
    for (const [f, t] of Object.entries(out)) writeFileSync(join(repo, f), t);
    console.log("Wrote llms.txt and llms-full.txt.");
  }
}
