# open-ds

Design systems as answered questions.

An Open DS scheme is a whole design system written as data. It answers a fixed set of questions, gives the reason for every answer, and the tokens, components, usage rules and voice follow from those answers. This package lets you read a scheme, ask why it decided something, and take the whole system into your project as code you own.

Site: [open-ds.dev](https://open-ds.dev) · Source: [github.com/3dyonic/Open-DS](https://github.com/3dyonic/Open-DS)

## Take a whole design system

```bash
npx open-ds list
npx open-ds create my-ds --scheme dense-data
```

`create` writes a full design system project for one scheme:

| Folder                            | What it holds                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens/src/`, `tokens/build.mjs` | The DTCG token source and its Style Dictionary build: CSS for every brand in light and dark, the shadcn and Tailwind theme, and JSON. |
| `src/components/ui/`              | The scheme's components, built on shadcn/ui and Radix and themed by its tokens.                                                       |
| `stories/`                        | A Storybook of every component, with the scheme's own content.                                                                        |
| `docs/`                           | Docusaurus docs: reasons, voice, foundations, components and themes.                                                                  |
| `scheme.json`                     | Every answer with its why and because, every usage rule and the voice.                                                                |
| `AGENTS.md`, `.claude/skills/`    | What a coding agent reads before it writes UI.                                                                                        |

Then `npm install` and `npm run storybook` or `npm run docs`. The code is copied into your project: you own it.

## Add it to an existing app

```bash
npx open-ds init dense-data --dir .
npx open-ds add dialog --dir .
```

`init` copies the tokens, the components, `AGENTS.md` and the agent skill into an app. `add` brings one more component with the components and packages it needs.

## Ask why

```bash
npx open-ds show dense-data
npx open-ds why dense-data typography.definition
npx open-ds why dense-data button/primary/background
npx open-ds when dense-data "a number in a table"
npx open-ds component dense-data button
npx open-ds context dense-data button                 # short, ends with its sections
npx open-ds context dense-data button --section keyboard
```

A created project has `context/`: one short booklet per component, color and task, and a router (`context/index.json`) that says what to load for a file. `npx open-ds context --file <path>` prints that; `npx open-ds context --write` regenerates the folder.

## Check and plan

```bash
npx open-ds check .
npx open-ds copy dense-data button "Export"
npx open-ds change dense-data content.q2 moderate
npx open-ds token dense-data "border of a field with an error"
npx open-ds fit "a console where analysts triage alerts all day"
```

`check` lists raw colors and sizes, components the scheme does not carry, variants it does not use and a `context/` that no longer matches the scheme, and exits 1 when it finds any. Each finding names the booklet section that answers it. `copy` checks a label or message against the voice. `change` plans a change without making it. `token` finds the token for an intent. `fit` ranks the schemes against a product.

Add `--json` to any of these, and to `list`, `show`, `why`, `when` and `context`, for machine-readable output.

## Schemes

| Scheme             | For                                                         |
| ------------------ | ----------------------------------------------------------- |
| `dense-data`       | Security operations and data-heavy tools for daily experts. |
| `content-first`    | Long reading and publishing.                                |
| `accessible-first` | Public services that everyone must be able to use.          |
| `multi-brand`      | Several brands on one platform.                             |
| `brand-expressive` | Campaigns and launches.                                     |

The questions and answers are a starting point, not a standard: change any answer in your own scheme.

## Built on open source

[shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com), [Tailwind CSS](https://tailwindcss.com), [Style Dictionary](https://styledictionary.com), [Storybook](https://storybook.js.org), [Docusaurus](https://docusaurus.io), [TanStack Table](https://tanstack.com/table) and [Lucide](https://lucide.dev), each under its own licence.

## Licence

MIT, a [3dyonic](https://3dyonic.com) project.
