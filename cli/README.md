# CLI

The `open-ds` command. It lists the schemes, explains their decisions, and deploys one into a project.

```bash
node cli/bin/open-ds.js list
node cli/bin/open-ds.js show dense-data
node cli/bin/open-ds.js why dense-data typography.definition
node cli/bin/open-ds.js why multi-brand button/radius
node cli/bin/open-ds.js when content-first "a number in a table"
node cli/bin/open-ds.js init multi-brand --dir ../my-app --brand birch
node cli/bin/open-ds.js add dialog --dir ../my-app
```

`init` writes into the project:

| Path | What it is |
| --- | --- |
| `src/styles/open-ds.css` | Tokens (every brand in light and dark), the shadcn theme and base styles. |
| `src/components/ui/*.tsx` | The 14 components. You own the code once it is copied. |
| `src/lib/utils.ts` | The `cn` helper. |
| `AGENTS.md` | Usage rules, voice and key decisions, for coding agents. |
| `.claude/skills/open-ds/SKILL.md` | The agent skill. |
| `.open-ds/scheme.json`, `.open-ds/tokens/*` | The full scheme and the resolved tokens. |
| `open-ds.json` | What was installed, with a short hash for each file. |

Add `--json` to `list`, `show`, `why` and `when` for machine-readable output. The MCP server calls this CLI.

The package is private until the name is final. `pnpm --dir cli pack` bundles the schemes, tokens, components and skill into `cli/assets` and shows what the package would hold.

