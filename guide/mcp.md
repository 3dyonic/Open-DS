---
title: "MCP server"
description: "Connect your AI to Open DS over MCP \u2014 list schemes, read answers and usage rules, and deploy a scheme."
---

# MCP server

```bash
claude mcp add --scope user open-ds -- uv run --directory /path/to/Open-DS open-ds-mcp
```

| Tool           | What it does                                                                   |
| -------------- | ------------------------------------------------------------------------------ |
| `list_schemes` | Every scheme with `use_when`, `avoid_when`, example products and brands.       |
| `get_scheme`   | One scheme, or one part: summary, answers, usage, voice, tokens, all.          |
| `get_answer`   | How a scheme answers one question, with why and what it follows from.          |
| `why`          | The full chain of reasons, or a component key's value in every brand and mode. |
| `when_to_use`  | What to use, what not to use and why, for a situation.                         |
| `deploy`       | Runs the CLI to deploy a scheme into a project folder (absolute path).         |

`why`, `when_to_use` and `deploy` run the CLI, so an agent and a person get the same result. Try: "Which Open DS scheme fits an order management tool? Deploy it into this project."
