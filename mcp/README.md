# open-ds-mcp

MCP server for Open DS. The package name is a placeholder. It runs no model.

An agent uses it to pick a scheme, deploy it into a project, and follow its decisions while it builds UI. The `deploy`, `why` and `when_to_use` tools run the `open-ds` CLI, so an agent and a person get the same result. Node.js 22 or later must be installed.

```bash
uv run open-ds-mcp
uv run open-ds-mcp --http
```

Connect it to Claude Code from a checkout of this repository:

```bash
claude mcp add open-ds -- uv run --directory /path/to/Open-DS open-ds-mcp
```

Scheme tools:

- `list_schemes`: every scheme with `use_when`, `avoid_when`, example products and brands.
- `get_scheme`: one scheme, or one part: `summary`, `answers`, `usage`, `voice`, `tokens` or `all`.
- `get_answer`: how a scheme answers one question, with why and the answers it follows from.
- `why`: the full chain of reasons for a question, or a component key's value in every brand and mode.
- `when_to_use`: what to use, what not to use, and why, for a situation id or plain words.
- `deploy`: copies tokens, components, `AGENTS.md` and the agent skill into a project. Returns the next steps.

Set `OPEN_DS_ROOT` to use another checkout, or `OPEN_DS_CLI` to use another CLI file.

Recipe tools from the first preview:

- `list_questions` returns each question's id, title, and `affects`. The title is the pack prompt.
- `get_question` returns that question's options, reasons, and sources as they are written in the packs.
- `check_recipe` calls the same Python validator the CLI uses.
