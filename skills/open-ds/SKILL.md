---
name: open-ds
description: Build UI with an Open DS scheme. Use when you pick a scheme, take one into a project, or build UI with open-ds.json.
tools:
  - when_to_use
  - get_component
  - get_context
  - check_ui
  - why
---

# Open DS

## Why

An Open DS scheme is a full design system as data. It answers a fixed set of questions and gives a reason for each answer. Tokens, components, rules and voice follow from those answers. Follow the scheme, and the UI stays consistent and explainable.

## When

- The project has `open-ds.json`, or it needs a design system.
- For one job, use its focused skill:

| Skill            | Job                                       |
| ---------------- | ----------------------------------------- |
| `open-ds-choose` | Pick a scheme and take it into a project. |
| `open-ds-build`  | Build UI in a project that uses a scheme. |
| `open-ds-write`  | Write copy in the scheme's voice.         |
| `open-ds-change` | Change a token, a component or an answer. |
| `open-ds-review` | Review UI against the scheme.             |

The MCP server serves the same five skills as prompts.

## Input

- The scheme id, from `open-ds.json` or `.open-ds/scheme.json`.
- `AGENTS.md` in the project root. It holds the rules and the voice.

## Run

1. If the project has no scheme yet, use `open-ds-choose`.
2. Read `AGENTS.md`. It holds the rules that always apply.
3. For the file you edit, call `get_context` with `file`, or run `open-ds context --file <path>`.
4. Read the booklets it returns. Ask for a section only when they do not answer.
5. Before you pick a token, a component or a variant, find its situation with `when_to_use`.
6. On the command line, use `open-ds when <scheme> <words>` for the same answer.
7. Do what the rule says. Never do what its "not" says.
8. Before you use a component, call `get_component` or run `open-ds component <scheme> <id>`.
9. Use only the variants the scheme uses. Never use a variant it marks as not used.
10. Before you use a colour, read its booklet with `get_context` or `open-ds context <scheme> <token>`.
11. Use only components in `src/components/ui` and the scheme's CSS variables.
12. Write no raw colours, sizes or spacing.
13. To change a look, change its component key, for example `--button-radius`. Do not edit the component.
14. To explain a decision, call `why` or run `open-ds why <scheme> <id>`. Quote the answer and its reason.
15. Before you finish, call `check_ui` or run `open-ds check`. Fix each finding.

## Done

- Every component, variant and token follows a rule of the scheme.
- Colour is never the only signal, and focus rings stay.
- Light and dark both work.
- The product uses one scheme only.
- `open-ds-review` finds no failures.
