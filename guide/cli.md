---
title: "CLI"
description: "The open-ds command \u2014 list schemes, explain decisions, and deploy a scheme into a project."
---

# CLI

```bash
node cli/bin/open-ds.js list
node cli/bin/open-ds.js show dense-data
node cli/bin/open-ds.js why dense-data typography.definition
node cli/bin/open-ds.js why multi-brand button/radius
node cli/bin/open-ds.js when content-first "a number in a table"
node cli/bin/open-ds.js context dense-data color.status.danger
node cli/bin/open-ds.js context dense-data review
node cli/bin/open-ds.js component dense-data button
node cli/bin/open-ds.js check ./my-app
node cli/bin/open-ds.js copy dense-data button "Export"
node cli/bin/open-ds.js change dense-data content.q2 moderate
node cli/bin/open-ds.js change dense-data --token color.violet.light.600 "#5B4FE8"
node cli/bin/open-ds.js token dense-data "border of a field with an error"
node cli/bin/open-ds.js fit "a console where analysts triage alerts all day"
node cli/bin/open-ds.js init multi-brand --dir ./my-app --brand birch
node cli/bin/open-ds.js add dialog --dir ./my-app
```

`init` writes `src/styles/open-ds.css`, the components, `AGENTS.md`, `.claude/skills/open-ds/SKILL.md`, `.open-ds/scheme.json` and `open-ds.json`. It will not overwrite an existing scheme unless you pass `--yes`. Add `--json` to `list`, `show`, `why` and `when` for machine-readable output. `context` always prints JSON: only the slice one target needs (a task, a component, a component key, a semantic token or a situation).

## Tools for the skills

These commands do the steps the agent skills would otherwise judge by eye (OD-202). The MCP server has the same tools.

| Command                       | MCP tool      | What it does                                                                                                                |
| ----------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `check [dir]`                 | `check_ui`    | Lists raw colours and sizes, components the scheme does not carry, and variants it does not use. Exits 1 when it finds any. |
| `copy <scheme> <kind> <text>` | `check_copy`  | Checks a label or message against the voice and the rule for its situation.                                                 |
| `change <scheme> …`           | `plan_change` | Plans a change without making it: what a new answer reopens, or the contrast a new colour keeps.                            |
| `token <scheme> <words>`      | `find_token`  | The tokens and component keys that fit an intent, with their guidance.                                                      |
| `fit <words>`                 | `fit_scheme`  | Ranks the schemes against a product description, with the reasons.                                                          |

After `init`, install the packages it prints and import `src/styles/open-ds.css` after Tailwind. Dark mode: add the class `dark`. Multi-brand: set `data-brand` on `<html>`.
