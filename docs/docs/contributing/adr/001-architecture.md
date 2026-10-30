---
title: "ADR-001: Dictionary, checker, site, boilerplates"
description: "Contributor note from the first preview: ADR-001: Dictionary, checker, site, boilerplates."
---

# ADR-001: Dictionary, checker, site, boilerplates

Status: accepted for the preview. The product name is not final.

## Decision

Open DS is one repository.

- `packs/` holds the dictionary. JSON only.
- `schema/` holds JSON Schema.
- `validator/` is a Python package. It checks recipes. It does not calculate color.
- `mcp/` is a FastMCP server with four tools.
- `site/` is a Next.js static site.
- `boilerplates/` holds starters a person wrote.
- `cli/` is a private local helper. It is not published.
- `docs/` holds contributor docs.

Python uses uv, ruff, and pytest. The site and the CLI use pnpm.

A failed check returns findings and no fingerprint.

Token files use the DTCG format. The neutral format is DTCG. CSS variables and a Tailwind preset are files in the boilerplate, not a second token format.
