# open-ds-mcp

MCP server for the decision dictionary. The package name is a placeholder.

The server lists Purpose and the core decisions, and it checks a recipe. It runs no model. There is no `build_tokens` tool. Open DS does not calculate. Every value comes from a hand-written option in the packs.

```bash
uv run open-ds-mcp
uv run open-ds-mcp --http
```

Tools:

- `list_questions` returns each question's id, title, and `affects`. The title is the pack prompt.
- `get_question` returns that question's options, reasons, and sources as they are written in the packs.
- `check_recipe` calls the same Python validator the CLI uses.
