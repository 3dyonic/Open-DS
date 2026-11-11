---
composite_data: "./table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 57
title: "Table"
description: "Table in Brand expressive."
---

# Table

Rows and columns of comparable records, with headers.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="table/live"}

## When to use it

**In Brand expressive:** A rare line-up people compare cell by cell, with comfortable rows. Not as the story of a section.

- **Use it when:** Records people scan, sort or compare cell by cell.
- **Not when:** A grid of teasers (cards), or the shape of a relationship (chart).

Instead:

- [Data table](./data-table.md): Many records with search, filters and paging.
- [Chart](./chart.md): The shape of the numbers.

::card-grid{id="anatomy-link/table"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.body

**Not** A mono font

Tables are rare and never compared column by column, so mono digits add nothing. The brand font keeps the voice.
:::
:::panel{title="A selected row or item"}
**Use** color.surface.selected (brand tint)

**Not** Grey

Selection carries the brand.
:::
:::panel{title="Table row height"}
**Use** size.row (comfortable)

**Not** A compact row

Tables are rare and short, so there is no need to fit many rows. Comfortable rows keep the brand's airy rhythm.
:::
::::

## Words

- Headlines are short and bold. Three to six words.
- Verbs that move: Join, Try, Go.
- Playful in headlines, plain in errors.
- Use: Join, Drop, Go, Love. Avoid: Synergy, Leverage, Kindly.

The labels components use, from the voice tokens:

- `content.action.commit`: Go
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Explore the drop

See [Voice and tone](../voice.md) for the whole voice.

## Accessibility and keyboard

Test before you ship:

- [ ] It has a caption and header cells, so each cell is read with its header. undefined

## Use it in code

```bash
npx open-ds add table
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Table reads 15 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Table's tokens to change Table alone.

::token-table{component="table"}
