---
name: open-ds
description: Build UI with an Open DS scheme. Use when you pick a design system, deploy one into a project, or write UI in a project that has open-ds.json.
---

# Open DS

An Open DS scheme is a full design system as data. It answers a fixed set of questions (the grammar) and gives the reason for each answer. Tokens, components, usage rules and voice follow from those answers.

## Pick a scheme

1. Run `open-ds list`, or call the MCP tool `list_schemes`.
2. Read `ai.use_when` and `ai.avoid_when` of each scheme. Pick the one that fits the product.
3. If two fit, read `scenarios` in each scheme. Pick the closest one.

## Deploy it

- CLI: `open-ds init <scheme> --dir <project>`. Add `--brand <id>` for a multi-brand scheme.
- MCP: call `deploy` with the scheme id and the project folder. It runs the same CLI.
- Then install the packages that the command prints. Import `src/styles/open-ds.css` after Tailwind.

## Build UI in a project that uses a scheme

1. Read `AGENTS.md`. It holds the usage rules and the voice.
2. Before you choose a token, a component or a variant, find the situation: `open-ds when <scheme> <words>` or the MCP tool `when_to_use`. Do what the rule says. Do not do what its "not" says.
3. Use only the components in `src/components/ui` and the CSS variables in `src/styles/open-ds.css`. Do not write raw colors, sizes or spacing.
4. To change how a component looks, change a component key (for example `--button-radius`). Do not edit the component.
5. Write copy in the scheme's voice. Read the usage rules of the voice situations (button-label, error-words, success-words, empty-words, confirm-words, first-visit): each gives the tone, a rule and an example.
6. To explain a decision, run `open-ds why <scheme> <question-id>` or call `why`. Quote the answer and its reasons.

## Do not

- Do not mix two schemes in one product.
- Do not use color alone to show meaning.
- Do not remove focus rings.
