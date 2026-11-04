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
4. In a created project: `AGENTS.md` first, then what `context/index.json` lists for the file you edit. The skills are in `.claude/skills/`.

## Rules

- Before you choose a component, variant or token, find the situation and follow its rule (`when_to_use`).
- Use only component keys and semantic tokens. Never raw values.
- Write copy in the scheme's voice.
- To explain a decision, quote the answer and its because chain (`why`).
- Before you use a color, read its booklet: `open-ds context <scheme> <token>` or `get_context`. Follow its `not_for` and what it may sit on. Pick status by real risk: info, warning, danger.
- For a task, ask for only its booklet: `get_context` with target `build` (or choose, write, change, review).
- Before you finish, run `check_ui`. Each finding names the booklet section that answers it.

## Context in a created project

A created project has a `context/` folder: the context engine's short answers, as files. Words, not values; keys by name. `open-ds context --write` writes it and `open-ds check` reports a file that no longer matches.

| Path                  | What it holds                                                                 |
| --------------------- | ----------------------------------------------------------------------------- |
| `AGENTS.md`           | The read-once text and the rules that always apply. At most 4 KB.             |
| `context/index.json`  | The router: what to load for a file (`files`), a task or a situation.         |
| `context/components/` | One booklet per component: what it is for, how this scheme uses each variant. |
| `context/colors/`     | One booklet per color: what it is for, not for, and what it may sit on.       |
| `context/tasks/`      | One booklet per task: choose, build, write, change, review.                   |

Each booklet ends with its sections, their size and the exact call, for example `get_context target=button section=keyboard`. A long section has pages. `section=all`, or `--json` on the command line, returns the full answer. Every booklet is at most 3 KB, and the booklets one file routes to at most 8 KB.

The read-once text, the same in the MCP server instructions, `AGENTS.md` and `context/README.md`:

```text
How to use Open DS
1. Start with AGENTS.md. It holds the rules that always apply.
2. For the file you edit, load what context/index.json lists, or call get_context file=<path>.
3. Each answer is short. It ends with sections you can ask for, their size and the exact call. Ask only if you need more.
4. One thing (a component, a color, a task) has sections. A long list has pages.
5. Write token names and components, never values. Every decision is an answered question: ask why before you change it.
6. Before you finish, run check_ui. Each finding names the booklet section that answers it.
```

## Files for agents

| File                         | What it is                                                 |
| ---------------------------- | ---------------------------------------------------------- |
| `llms.txt`                   | Index in the llmstxt.org format.                           |
| `llms-full.txt`              | Every scheme in one text file: answers, rules, voice.      |
| `AGENTS.md` (repo)           | How to work on this repository.                            |
| `AGENTS.md` (deployed)       | How to build UI with the deployed scheme.                  |
| `context/` (created project) | The booklets and the router, generated from the scheme.    |
| `skills/open-ds/SKILL.md`    | The overview skill.                                        |
| `skills/open-ds-*/SKILL.md`  | Five focused skills: choose, build, write, change, review. |
