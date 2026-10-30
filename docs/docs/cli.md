---
title: "CLI"
description: "The open-ds command \u2014 list schemes, explain decisions, and deploy a scheme into a project."
---

# CLI

```bash
node cli/bin/open-ds.js list
node cli/bin/open-ds.js show dense-data
node cli/bin/open-ds.js why dense-data typography.q3
node cli/bin/open-ds.js why multi-brand button/radius
node cli/bin/open-ds.js when content-first "a number in a table"
node cli/bin/open-ds.js init multi-brand --dir ./my-app --brand birch
node cli/bin/open-ds.js add dialog --dir ./my-app
```

`init` writes `src/styles/open-ds.css`, the components, `AGENTS.md`, `.claude/skills/open-ds/SKILL.md`, `.open-ds/scheme.json` and `open-ds.json`. It will not overwrite an existing scheme unless you pass `--yes`. Add `--json` to `list`, `show`, `why` and `when` for machine-readable output.

After `init`, install the packages it prints and import `src/styles/open-ds.css` after Tailwind. Dark mode: add the class `dark`. Multi-brand: set `data-brand` on `<html>`.
