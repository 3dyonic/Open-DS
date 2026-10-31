---
name: open-ds-build
description: Build UI in a project that uses an Open DS scheme. Use whenever you write or edit screens, components or styles in a project with open-ds.json.
---

# Build UI with the scheme

1. Read `AGENTS.md` first. It holds the usage rules and the voice for this scheme.
2. Before you pick a component, a variant or a token, find the situation: `npx open-ds when <scheme> <words>` or the MCP tool `when_to_use`. Do what its rule says, never what its "not" says.
3. Use only the components in `src/components/ui` and the scheme's CSS variables. No raw colours, sizes or spacing.
4. Use only components in the scheme's inventory (`get_inventory`). If you need one that is missing, say so and add it with `npx open-ds add <component>` (`plan_add`), or ask; do not build a look-alike.
5. To change how a component looks, change its component key (for example `--button-radius`), not the component file.
6. Light first: build and check the light theme, then dark.
7. Write the words with open-ds-write.
8. Before you finish, check the screen with open-ds-review.

To explain a decision, call `why` with the question id or the component key, and quote the answer and its reasons.
