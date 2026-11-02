---
name: open-ds-choose
description: Pick an Open DS scheme and take it into a project. Use when a project has no design system, or someone asks which fits.
tools: [list_schemes, compare_schemes, get_component, plan_create, plan_init]
---

# Choose and take a scheme

## Why

The scheme decides every token, component and rule that follows. A scheme that fits the product needs few changes later.

## When

- The project has no design system yet.
- Someone asks which design system fits a product.

## Input

- What the product is: its people, its content and its main task.
- Whether you start a new design system project or add one to an existing app.

## Run

1. List the schemes with `list_schemes` or `npx open-ds list`.
2. Read the `use_when` and `avoid_when` of each scheme.
3. Pick the scheme that fits the people, the content and the main task.
4. If two schemes fit, compare them with `compare_schemes`. Read the reasons, not only the looks.
5. Check the components the product needs with `get_component`.
6. If the scheme does not carry a component, read its reason.
7. For a new design system project, call `plan_create` or run `npx open-ds create <dir> --scheme <id>`.
8. For an existing app, call `plan_init` or run `npx open-ds init <id> --dir .`.
9. Add `--brand <id>` for a multi-brand scheme.
10. Run the command yourself. The MCP server never writes to your disk.
11. Install the packages that the command prints.
12. In an existing app, import `src/styles/open-ds.css` after Tailwind.

## Done

- The command finished with no error, and `open-ds.json` exists.
- You told the person which scheme you picked, with the reasons that made it fit.
- If an answer is wrong for the product, you named it. Change it later with `open-ds-change`.
