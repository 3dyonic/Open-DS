---
name: open-ds-build
description: Build UI in a project that uses an Open DS scheme. Use when you write or edit screens, components or styles.
tools:
  - get_context
  - when_to_use
  - get_component
  - get_inventory
  - plan_add
  - find_token
  - check_ui
  - why
---

# Build UI with the scheme

## Why

Each component and variant has a decision behind it. Build with those decisions, and the screen matches the system and can explain itself.

## When

- You write or edit a screen, a component or a style.
- The project has `open-ds.json`.

## Input

- `AGENTS.md`: the rules and the voice of this scheme.
- The screen to build, and the job it does.

## Run

1. Read `AGENTS.md`. It holds the rules that always apply.
2. For the file you edit, call `get_context` with `file`, or run `open-ds context --file <path>`.
3. Read the booklets it returns. Ask for a section only when they do not answer.
4. For the whole task, call `get_context` with target `build`. It lists every situation and its rule.
5. For each choice, find its situation with `when_to_use` or `npx open-ds when <scheme> <words>`.
6. Do what the rule says. Never do what its "not" says.
7. Before you use a component, call `get_component` or run `open-ds component <scheme> <id>`.
8. Use only the variants this scheme uses, for what it says. Never use a variant marked as not used.
9. Use only components in the inventory. Check them with `get_inventory`.
10. If a component is missing, add it with `plan_add` or `npx open-ds add <component>`.
11. Do not build a look-alike of a component.
12. To find the token or key for an intent, call `find_token` or run `open-ds token <scheme> <words>`.
13. Before you use a colour, read its guidance with `get_context <token>`.
14. Use only the scheme's CSS variables and component keys. Write no raw colours, sizes or spacing.
15. To change a look, change its component key, for example `--button-radius`.
16. Build the light theme first. Then check the dark theme.
17. Write the words with `open-ds-write`.
18. To explain a decision, call `why` with the question id or the component key.
19. Before you finish, call `check_ui` with the files you changed. Fix each finding.

## Done

- Each component and variant follows its decision in `get_component`.
- `check_ui` or `open-ds check` returns no findings.
- Light and dark both work.
- You can explain each choice with its answer and reason.
- `open-ds-review` finds no failures.
