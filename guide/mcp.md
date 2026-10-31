---
title: "MCP server"
description: "Connect your AI to Open DS over MCP: pick a scheme, read its answers and rules, and get the exact command to take it."
---

# MCP server

One engine: the server lives in the `open-ds` package (`cli/src/mcp.mjs`) and imports the CLI's own modules, so the CLI, the site and the MCP server answer the same way.

```bash
# stdio, for a local agent (from a checkout; after publishing: npx -y open-ds mcp)
claude mcp add --scope user open-ds -- node /path/to/Open-DS/cli/bin/open-ds.js mcp

# Streamable HTTP, the shape of the hosted server
pnpm --dir mcp start      # http://0.0.0.0:8787/mcp
claude mcp add --transport http open-ds http://localhost:8787/mcp
```

No authentication yet; the hosted server at open-ds.dev will add a key.

Every tool is read-only. Taking, initialising and adding return the exact `npx open-ds …` command and the files it writes; the agent runs it. Nothing writes to your disk from the server.

| Tool              | What it returns                                                                  |
| ----------------- | -------------------------------------------------------------------------------- |
| `list_schemes`    | Every scheme with `use_when`, `avoid_when`, example products, brands, version.   |
| `get_scheme`      | One scheme, or one part: summary, answers, usage, voice, inventory, tokens, all. |
| `get_answer`      | One answer with every option, the chosen one, why and because.                   |
| `why`             | The chain of reasons, or a component key's value in every theme.                 |
| `when_to_use`     | What to use, what not to use and why, for a situation, with the colour guidance. |
| `compare_schemes` | Two schemes side by side: shared and different answers.                          |
| `get_inventory`   | The components a scheme carries and why, and the ones it leaves out.             |
| `what_moves`      | The answers that follow from one answer, and the tokens its scope owns.          |
| `get_key`         | A component key's semantic, its value in every theme and its guidance.           |
| `get_context`     | Only the context for one target: a task, component, key, token or situation.     |
| `plan_create`     | The `npx open-ds create` command and the files it writes.                        |
| `plan_init`       | The `npx open-ds init` command, the files and the packages.                      |
| `plan_add`        | The `npx open-ds add` command with the components and packages it brings.        |

The skills come as prompts: `open-ds` (overview), `open-ds-choose`, `open-ds-build`, `open-ds-write`, `open-ds-change` and `open-ds-review`. Try: "Which Open DS scheme fits a security operations console? Take it into this project."
