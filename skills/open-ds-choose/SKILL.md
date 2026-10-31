---
name: open-ds-choose
description: Pick an Open DS scheme for a product and take it into a project. Use before a project has a design system, or when someone asks which design system fits.
---

# Choose and take a scheme

1. List the schemes: `npx open-ds list`, or the MCP tool `list_schemes`.
2. Read each scheme's `use_when` and `avoid_when`. Pick the one that fits the product: its people, content and main task.
3. If two fit, compare them: the MCP tool `compare_schemes`, or open both on open-ds.dev. Read the reasons, not only the looks.
4. Take it:
   - A new design system project: `npx open-ds create <dir> --scheme <id>` (the MCP tool `plan_create` returns the exact command and the files it writes).
   - An existing app: `npx open-ds init <id> --dir .` (`plan_init`).
   - A multi-brand scheme needs `--brand <id>`.
5. Run the command yourself. The MCP server never writes to your disk.
6. Tell the person which scheme you picked and quote the reasons that made it fit.

The questions and answers are a starting point, not a standard. If one answer is wrong for the product, say which, and change it later with open-ds-change.
