---
sidebar_position: 1
title: "For agents"
description: "How an AI agent should read and use Open DS \u2014 the files, the order, and the rules."
---

# For agents

Open DS is built so an agent can use it without guessing.

## Read in this order

1. `/llms.txt`: a short index of everything.
2. `schemes/grammar.json`: the questions, situations and component keys. Every object has a `description`.
3. `schemes/<scheme>.json`: answers with `why` and `because`, `usage` rules, `voice`, and `ai.use_when` / `ai.avoid_when`.
4. In a deployed project: `AGENTS.md`, `.claude/skills/open-ds/SKILL.md` (the overview) and the five focused skills next to it.

## Rules

- Before you choose a component, variant or token, find the situation and follow its rule (`when_to_use`).
- Use only component keys and semantic tokens. Never raw values.
- Write copy in the scheme's voice.
- To explain a decision, quote the answer and its because chain (`why`).
- Before you use a colour, read its guidance: `open-ds context <scheme> <token>` or `get_context`. Follow its `not_for` and its pairs. Pick status by real risk: info, warning, danger.
- For a task, ask for only its slice: `get_context build` (or choose, write, change, review).

## Files for agents

| File                        | What it is                                                 |
| --------------------------- | ---------------------------------------------------------- |
| `llms.txt`                  | Index in the llmstxt.org format.                           |
| `llms-full.txt`             | Every scheme in one text file: answers, rules, voice.      |
| `AGENTS.md` (repo)          | How to work on this repository.                            |
| `AGENTS.md` (deployed)      | How to build UI with the deployed scheme.                  |
| `skills/open-ds/SKILL.md`   | The overview skill.                                        |
| `skills/open-ds-*/SKILL.md` | Five focused skills: choose, build, write, change, review. |
