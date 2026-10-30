# AGENTS.md

How to work on the Open DS repository. For how to build UI with a deployed scheme, see the `AGENTS.md` that `open-ds init` writes into a project, and `skills/open-ds/SKILL.md`.

## What this repository is

Open DS models a design system as a finite grammar of questions. A scheme answers every question with a reason. The schemes are data; everything else is built from them.

## Layout

| Folder | What it holds | Check |
| --- | --- | --- |
| `schemes/` | `grammar.json` and the five scheme files. The source of truth. | `pnpm harness` |
| `schema/` | JSON Schemas (draft 2020-12) for the grammar, schemes and the first-preview packs. | `pnpm harness` |
| `tokens/` | Style Dictionary build: CSS (each brand, light and dark), shadcn and Tailwind theme, DTCG JSON. | `pnpm --dir tokens test` |
| `ui/` | Components on Radix and Tailwind v4 that read only component keys; shadcn registry. | `pnpm --dir ui test` |
| `cli/` | The `open-ds` command: list, show, why, when, init, add. | `pnpm --dir cli test` |
| `mcp/` | FastMCP server; deploy, why and when run the CLI. | `uv run pytest` |
| `storybook/` | Every component in every scheme, brand and mode. | `pnpm --dir storybook build` |
| `site/` | The website, a static Next.js app. | `pnpm --dir site build` |
| `docs/` | Docusaurus docs: product, business, brand, grammar, schemes, agents. | `pnpm --dir docs build` |
| `skills/` | The agent skill shipped with every deployed scheme. | `pnpm harness` |
| `harness/` | Checks every layer against Yonatan's instructions and the ticket specs. | `pnpm harness:full` |
| `packs/`, `recipes/`, `validator/`, `boilerplates/`, `fragments/` | The first preview (recipe model). Kept; the CLI still runs its commands. | `uv run pytest` |

## Rules

1. Change a scheme in `schemes/*.json`, then run `pnpm --dir tokens build`, `node scripts/build-llms.mjs` and `pnpm --dir docs generate`.
2. Every JSON object gets a `description` (or `why`) written for an agent. Every schema property gets a `description`.
3. Scope answers are words ("fast", "compact"), never raw values. Values live in tokens.
4. Components read only component keys and semantic variables. No raw colors.
5. Light and dark ship for every brand of every scheme.
6. Plain words, short sentences. Never invent names, numbers or domains. The product name lives only in `brand.json`.
7. Work on a feature branch from `RC1`. Open a PR into `RC1`. Run `pnpm harness` before you push.

## Commands

```bash
pnpm install && uv sync --all-packages --group dev
pnpm --dir tokens build   # the CLI, site and Storybook read tokens/dist
pnpm harness          # fast checks
pnpm harness:full     # with builds and test suites
pnpm e2e              # the local end-to-end run
```
