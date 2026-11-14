# Contributing

PRs are welcome. Keep one concern in each PR: a scheme, the grammar, a package (tokens, ui, cli, mcp), the site or the docs.

## Set up

```bash
pnpm install
```

```bash
pnpm generate
```

`pnpm generate` writes the tokens, the docs pages and the shadcn registry from the schemes. Git does not keep these files. The harness and the docs build write them first.

## Checks

| Command               | What it checks                                                   |
| --------------------- | ---------------------------------------------------------------- |
| `pnpm harness`        | Every layer against the instructions and the ticket specs (fast) |
| `pnpm harness:full`   | The same, with builds and every test suite                       |
| `pnpm test`           | The CLI and harness tests                                        |
| `pnpm test:package`   | The CLI as a user gets it, packed and run in a fresh app         |
| `pnpm --dir mcp test` | The MCP server                                                   |
| `pnpm e2e`            | The local end-to-end run                                         |

## Change a scheme

1. Change a scheme with `saveScheme` from `cli/src/schemes.mjs`; it writes `schemes/<scheme>/`, one file per scope. Every answer needs a `why`, and `because` links to the answers it follows from.
2. Run `pnpm generate` and `node scripts/build-llms.mjs`. Commit `llms.txt` and `llms-full.txt`; the other generated files stay out of git.
3. Run `pnpm harness`.

## Propose a question

Every scope answers the same five questions (roles, how many, how defined, values, lands in). A new question must fit one of them, or come with a case for a change to the grammar. Open an issue with the question, its options and the decision it would make.

## Rules

See [AGENTS.md](AGENTS.md). A change is done only when every line of [DONE.md](DONE.md) is true. Plain words, short sentences, no invented names or numbers. Work on a branch from `RC1` and open the PR into `RC1`.
