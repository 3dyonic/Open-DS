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

1. Call `get_context build`, or run `open-ds context <scheme> build`.
2. Read `AGENTS.md`.
3. For each choice, find its situation with `when_to_use` or `npx open-ds when <scheme> <words>`.
4. Do what the rule says. Never do what its "not" says.
5. Before you use a component, call `get_component` or run `open-ds component <scheme> <id>`.
6. Use only the variants this scheme uses, for what it says. Never use a variant marked as not used.
7. Use only components in the inventory. Check them with `get_inventory`.
8. If a component is missing, add it with `plan_add` or `npx open-ds add <component>`.
9. Do not build a look-alike of a component.
10. To find the token or key for an intent, call `find_token` or run `open-ds token <scheme> <words>`.
11. Before you use a colour, read its guidance with `get_context <token>`.
12. Use only the scheme's CSS variables and component keys. Write no raw colours, sizes or spacing.
13. To change a look, change its component key, for example `--button-radius`.
14. Build the light theme first. Then check the dark theme.
15. Write the words with `open-ds-write`.
16. To explain a decision, call `why` with the question id or the component key.
17. Before you finish, call `check_ui` with the files you changed. Fix each finding.

## Done

- Each component and variant follows its decision in `get_component`.
- `check_ui` or `open-ds check` returns no findings.
- Light and dark both work.
- You can explain each choice with its answer and reason.
- `open-ds-review` finds no failures.
