# MCP

The host for the hosted Open DS MCP server. The server itself is in the `open-ds` package (`cli/src/mcp.mjs`): one engine with the CLI and the site.

```bash
pnpm --dir mcp start          # Streamable HTTP at http://0.0.0.0:8787/mcp, health at /health
PORT=3000 pnpm --dir mcp start
```

Locally, an agent can also run it over stdio from the package: `npx open-ds mcp` (or `node cli/bin/open-ds.js mcp` in this repository).

Connect Claude Code to a running server:

```bash
claude mcp add --transport http open-ds http://localhost:8787/mcp
```

No authentication yet; the hosted server will add a key.

## Tools (all read-only)

| Tool              | What it returns                                                                  |
| ----------------- | -------------------------------------------------------------------------------- |
| `list_schemes`    | Every scheme with use_when, avoid_when, example products, brands and version.    |
| `get_scheme`      | One scheme, or a part: summary, answers, usage, voice, inventory, tokens or all. |
| `get_answer`      | One answer with every option, the chosen one, why and because.                   |
| `why`             | The chain of reasons for a question, or a component key's value in every theme.  |
| `when_to_use`     | What to use, what not to use, and why, for a situation.                          |
| `compare_schemes` | Two schemes side by side: the answers they share and the ones that differ.       |
| `get_inventory`   | The components a scheme carries and why, and the ones it leaves out.             |
| `what_moves`      | The answers that follow from one answer, and the tokens its scope owns.          |
| `get_key`         | A component key's semantic and its value in every theme.                         |
| `plan_create`     | The `npx open-ds create` command and the files it writes.                        |
| `plan_init`       | The `npx open-ds init` command, the files it writes and the packages to install. |
| `plan_add`        | The `npx open-ds add` command with the components and packages it brings.        |

Nothing writes to the caller's disk: the plan tools return commands for the agent to run.

## Prompts

The skills, served as prompts: `open-ds` (overview), `open-ds-choose`, `open-ds-build`, `open-ds-write`, `open-ds-change` and `open-ds-review`.
