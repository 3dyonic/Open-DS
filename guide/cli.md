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
node cli/bin/open-ds.js context dense-data button --section keyboard
node cli/bin/open-ds.js context --file src/components/ui/card.tsx   # in a created project
node cli/bin/open-ds.js context --write                            # in a created project
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

`init` writes `src/styles/open-ds.css`, the components, `AGENTS.md`, `.claude/skills/open-ds/SKILL.md`, `.open-ds/scheme.json` and `open-ds.json`. It will not overwrite an existing scheme unless you pass `--yes`. Add `--json` to `list`, `show`, `why` and `when` for machine-readable output. `context` prints the short context for one target as Markdown (a task, a component, a component key, a semantic token or a situation). It ends with the sections you can ask for with `--section`; a long section has pages (`--page 2`); `--json` prints the full answer. In a created project, `context --file <path>` prints the booklets `context/index.json` lists for a file, and `context --write` regenerates `context/`. `check` reports a `context/` that no longer matches the scheme, and each finding names the booklet section that answers it.

## A created project's scheme

`create` writes the scheme as three files:

| File                | Written by | What it holds                                                                                                                              |
| ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `overlay.json`      | The user   | Changed answers, picks, usage rules and tokens, each with a why and a because. Empty at first.                                             |
| `build/scheme.json` | The build  | The source joined with the overlay. Storybook, the docs, `why .` and `check` read it.                                                      |
| `open-ds.lock`      | The build  | The package and grammar versions, the source and its hash, each scope's version and hash, and the hashes of the overlay and the built file. |

Edit `overlay.json`, then run `npx open-ds build` in the project. The build checks the overlay against `schema/overlay.schema.json` and the scheme rules. It writes nothing when one fails. A changed answer moves no value: the build lists each rule, variant, pick and token that cites it. Edit an item in the overlay, or add its id to `reviewed`. `npx open-ds build --strict` exits 1 while any item is open. When `overlay.json` changes after the last build, a reader fails with "Out of date … Run: open-ds build". `npm run tokens` builds the scheme first. In a project, `.` in place of a scheme id reads `build/scheme.json`: `npx open-ds why . typography.definition`.

### Upgrade

`npx open-ds upgrade` moves the source to the installed open-ds version. It reads the old source from the open-ds version in `open-ds.lock`, from npm, and compares three things: the old source, the new source and `overlay.json`.

- A source change that the overlay does not touch applies quietly. The upgrade names the scopes it changed.
- An overlay entry on a value the source also changed is a conflict. The upgrade shows your value, the old one and the new one, and writes nothing. Run it again with `--keep <id>` to keep yours, or `--take <id>` to take the source's. `--keep all` and `--take all` decide every conflict.
- A numbered migration rewrites a renamed path in the overlay.
- A new grammar question takes the source's answer and goes on the review list.
- A scheme with its own `id` in the overlay takes source changes only with `--accept`.

In a project made before `overlay.json`, `upgrade` reads `scheme.json` and `open-ds.json`. It gets the source from the open-ds version in `package.json` (or `--from-package <version>`) and writes each difference as an overlay entry with the why "carried over from scheme.json". Those entries stay on the review list until you confirm them. The upgrade names each difference an overlay cannot hold, such as the voice. It deletes nothing: point the files that read `scheme.json` at `build/scheme.json`, then delete it.

### A package folder

`npx open-ds export --out <folder>` writes a scheme as one folder: `manifest.json`, `overlay.json`, `open-ds.lock` and `build/scheme.json`. In a project it takes the project's files, which must be built. `npx open-ds export <scheme> --out <folder>` takes a scheme as it ships, with an empty overlay.

`npx open-ds create <dir> --from <folder>` makes a project from the folder. It checks the files against the hashes in `open-ds.lock` first, and it needs the source that the lockfile names. A changed file, or another source, stops it before it writes anything.

## Tools for the skills

These commands do the steps the agent skills would otherwise judge by eye. The MCP server has the same tools.

| Command                       | MCP tool      | What it does                                                                                                               |
| ----------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `check [dir]`                 | `check_ui`    | Lists raw colors and sizes, components the scheme does not carry, and variants it does not use. Exits 1 when it finds any. |
| `copy <scheme> <kind> <text>` | `check_copy`  | Checks a label or message against the voice and the rule for its situation.                                                |
| `change <scheme> …`           | `plan_change` | Plans a change without making it: what a new answer reopens, or the contrast a new color keeps.                            |
| `token <scheme> <words>`      | `find_token`  | The tokens and component keys that fit an intent, with their guidance.                                                     |
| `fit <words>`                 | `fit_scheme`  | Ranks the schemes against a product description, with the reasons.                                                         |

After `init`, install the packages it prints and import `src/styles/open-ds.css` after Tailwind. Dark mode: add the class `dark`. Multi-brand: set `data-brand` on `<html>`.
