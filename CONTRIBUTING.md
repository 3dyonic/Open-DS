# Contributing

PRs are welcome. Keep one concern in each PR: a pack, the checker, the site, or docs.

Write in plain words. Short sentences.

The product name lives only in `brand.json`. Package names that say `open-ds` are placeholders.

## Install

```bash
uv sync --all-packages --group dev
pnpm install
```

`uv` is the Python tool. If you do not have it: `pip install -e validator -e mcp`.

## Before you open a PR

| Command | What it checks |
| --- | --- |
| `uv run ruff check validator mcp` | Python lint |
| `uv run pytest` | Pack, recipe, reject, and lie cases |
| `pnpm test` | The site checker and the CLI |
| `pnpm --dir site build` | The static site |

## Add a scheme or a pack

1. Add a question to a JSON file in `packs/`, or add a new pack file.
2. Give every option `why` (at most 35 words), `when_to_choose` (starts with "Choose this if" or "Choose this when", at most 25 words), `trade_offs` (1 to 3 costs, at most 15 words each), and `sources` (1 to 3 real https links). If no source backs the claim, set optional `evidence_limited` to true. The site shows the neutral tag Evidence is limited.
3. A purpose effect (`recommends`, `discourages`, `requires`) needs a `reason` of 1 to 280 characters.
4. If the answer is global, put it in `packs/global.json`. A scoped pack references it with `ref` instead of copying the options. An `overrides` entry replaces one global option.
5. Run `uv run open-ds-validator check` on a recipe that uses the new answer.
6. Optional question fields are `affects`, `feeds_into`, and `why_care` (25 words or fewer). A `feeds_into` id must exist and be backed by `requires`, `discourages`, or `recommends`. An option may point `fragment` at a file in the repo. Floors live on `packs/global.json`. See `validator/README.md`.

Do not calculate colors in the validator. Do not cite Specify. Say "DTCG format" for token files. Do not claim another tool can load them unless a test proves it.

## Add a boilerplate

Copy `boilerplates/3dyonic/` to `boilerplates/<recipe-id>/`.

- Write the tokens, CSS, and components by hand.
- Keep structure apart from theme.
- Use three token tiers: `primitive`, `semantic`, and `component`.
- Name tokens by category and property. Pair `surface` with `on-surface`.
- `manifest.json` lists each piece with `files`, `deps`, `cssVars` for light and dark, and `lockedAtInit`.
- Only the decision sections of `README.md` and `AGENTS.md` are generated. The README starts with "What this design system serves".

```bash
uv run open-ds-validator decisions recipes/<id>.json --kind readme
uv run open-ds-validator boilerplate boilerplates/<id>
```
