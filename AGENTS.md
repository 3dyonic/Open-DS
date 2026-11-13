# AGENTS.md

How to work on the Open DS repository. For how to build UI with a deployed scheme, see the `AGENTS.md` that `open-ds init` writes into a project, and `skills/open-ds/SKILL.md`.

## What this repository is

Open DS models a design system as a finite grammar of questions. A scheme answers every question with a reason. The schemes are data; everything else is built from them.

## Layout

| Folder       | What it holds                                                                                               | Check                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `schemes/`   | `grammar.json` and the five scheme files. The source of truth.                                              | `pnpm harness`               |
| `schema/`    | JSON Schemas (draft 2020-12) for the grammar and the schemes.                                               | `pnpm harness`               |
| `tokens/`    | Style Dictionary build: CSS (each brand, light and dark), shadcn and Tailwind theme, DTCG JSON.             | `pnpm --dir tokens test`     |
| `ui/`        | Components on Radix and Tailwind v4 that read only component keys; shadcn registry.                         | `pnpm --dir ui test`         |
| `cli/`       | The `open-ds` command: list, show, why, when, init, add.                                                    | `pnpm --dir cli test`        |
| `mcp/`       | Host for the MCP server, which lives in the `open-ds` package (`cli/src/mcp.mjs`): one engine with the CLI. | `pnpm --dir mcp test`        |
| `storybook/` | Every component in every scheme, brand and mode.                                                            | `pnpm --dir storybook build` |
| `site/`      | The website, a static Next.js app.                                                                          | `pnpm --dir site build`      |
| `docs/`      | Docusaurus docs of every scheme in one site, with a scheme switcher (OD-207).                               | `pnpm --dir docs build`      |
| `guide/`     | The guide for Open DS itself: product, business, brand, CLI, MCP, agents, contributing.                     | `pnpm harness`               |
| `skills/`    | The agent skill shipped with every deployed scheme.                                                         | `pnpm harness`               |
| `harness/`   | Checks every layer against the ticket specs.                                                                | `pnpm harness:full`          |

## Rules

1. Change a scheme in `schemes/*.json`, then run `pnpm generate` and `node scripts/build-llms.mjs`. Git keeps `llms.txt` and `llms-full.txt`. Git does not keep the other generated files: the docs pages, the token build and `ui/registry.json`.
2. Every JSON object gets a `description` (or `why`) written for an agent. Every schema property gets a `description`.
3. Scope answers are words ("fast", "compact"), never raw values. Values live in tokens.
4. Components read only component keys. A component key reads a semantic token, or a palette step of its own scheme with a `why`. No raw colors, and no step of a hue the scheme does not define.
5. Light and dark ship for every brand of every scheme.
6. Plain words, short sentences. Never invent names, numbers or domains. The product name, tagline, site address and contact live only in the root `package.json` (`displayName`, `description`, `homepage`, `bugs.email`). Deploy settings (analytics IDs, hosting) never go in this repository: they live in open-ds-ops.
7. Work on a feature branch from `RC1`. Open a PR into `RC1`. Run `pnpm harness` before you push.
8. A change is done only when every line of [DONE.md](DONE.md) is true.

## Commands

```bash
pnpm install
pnpm generate         # tokens/dist, the docs pages and ui/registry.json, which git does not keep
pnpm harness          # fast checks
pnpm harness:full     # with builds and test suites
pnpm e2e              # the local end-to-end run
```
