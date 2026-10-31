# Contributing

PRs are welcome. Keep one concern in each PR: a scheme, the grammar, a package (tokens, ui, cli, mcp), the site or the docs.

## Set up

```bash
pnpm install && uv sync --all-packages --group dev
```

```bash
pnpm --dir tokens build
```

`uv` is the Python tool for the MCP server. If you do not have it: `pip install -e mcp`.

## Checks

| Command             | What it checks                                                   |
| ------------------- | ---------------------------------------------------------------- |
| `pnpm harness`      | Every layer against the instructions and the ticket specs (fast) |
| `pnpm harness:full` | The same, with builds and every test suite                       |
| `pnpm test`         | The CLI and harness tests                                        |
| `pnpm test:package` | The CLI as a user gets it, packed and run in a fresh app         |
| `uv run pytest`     | The MCP server                                                   |
| `pnpm e2e`          | The local end-to-end run                                         |

## Change a scheme

1. Edit `schemes/<scheme>.json`. Every answer needs a `why`, and `because` links to the answers it follows from.
2. Run `pnpm --dir tokens build`, `node scripts/build-llms.mjs` and `pnpm --dir docs generate`.
3. Run `pnpm harness`.

## Propose a question

Every scope answers the same five questions (roles, how many, how defined, values, lands in). A new question must fit one of them, or come with a case for a change to the grammar. Open an issue with the question, its options and the decision it would make.

## Rules

See [AGENTS.md](AGENTS.md). Plain words, short sentences, no invented names or numbers. Work on a branch from `RC1` and open the PR into `RC1`.
