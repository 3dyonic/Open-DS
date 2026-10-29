# Open DS

The display name is the `name` field in [brand.json](brand.json). Today that name is Open DS.

**Choose your design system on purpose.**

Open DS is a cited dictionary of design system decisions. Pick your answers, see the source for each, and start from a boilerplate that follows them, by hand or through your AI agent.

Think of it as a recipe book.

- A **pack** is a chapter. Purpose, color, type, space, and radius are chapters.
- A **scheme** is one question in that chapter, with allowed answers.
- A **recipe** is the set of answers you picked, each with your reason.
- A **boilerplate** is a starter someone wrote so the recipe can be used. The book does not cook the dish.

Open DS does not calculate colors or tokens. A calculation scheme is stored as data: a name, a plain description, a formula reference, parameters, sources, and trade-offs. Token files in a boilerplate use the DTCG format.

The license file is MIT until the owner decides.

## Three ways to read the book

| Surface | Who it is for | What it does |
| --- | --- | --- |
| Packs | Everyone | The dictionary. JSON only. |
| MCP server | An AI agent | Lists questions and checks a recipe. It runs no model. |
| Website | A person | Browse the catalog, pick answers, and see the check. |

There is also a validator, and a local CLI that copies a boilerplate onto your machine. The CLI package name `open-ds` is a placeholder. It is not published.

## Quick start

From a checkout of this repo.

**Validator**

```bash
uv sync --all-packages --group dev
uv run open-ds-validator check recipes/3dyonic.json
uv run open-ds-validate recipes/3dyonic.json
```

**MCP**

```bash
uv run open-ds-mcp
```

Add `--http` for a local streamable HTTP server on port 8765.

**Website**

```bash
pnpm install
pnpm --dir site dev
```

**CLI**

```bash
node cli/bin/open-ds.js init recipes/3dyonic.json --out ./my-ds
node cli/bin/open-ds.js check --dir ./my-ds
```

`add` and `diff` print a clear message. They do not change files in this preview.

## The 3dyonic recipe

`recipes/3dyonic.json` is a provisional example. `boilerplates/3dyonic/` is the starter written to follow it: DTCG tokens, CSS variables for light and dark, a Tailwind preset, and Button, Input, Card, and Badge. Structure stays apart from theme.

## Checks

An error rejects the recipe. There is no fingerprint. A warning or an info note does not reject it.

- A missing requirement is an error. The website blocks the build step.
- A discouraged pick is a warning.
- A recommendation does not raise a finding. A conditional recommendation prefills only when every `when` answer matches. If those answers are present but do not match, that option is discouraged instead. One answer of an AND list does nothing.
- Floors on the global pack always apply: contrast, resize, text spacing, target size, and confirmation for destructive, payment, and legal-commitment actions. A critical component hidden behind hover or an accordion is an error.

Badges in the builder: **Fits your purpose**, **Worth a second look**, **Your purpose needs this**. The tooltip says `Because you chose X: reason`.
