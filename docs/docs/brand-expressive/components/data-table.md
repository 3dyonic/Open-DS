---
composite_data: "./data-table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 21
title: "Data table"
description: "Data table in Brand expressive."
sidebar_class_name: "ods-left-out"
---

# Data table

Many records in one view, with search, filters, sorting, column choice, selection and paging.

:label[Left out of Brand expressive]{tone="warning"} Brand expressive avoids tools people use for hours. Data table is for acting on many records in bulk; here people browse and explore the story. Use instead: [Card](./card)

## See it live

::preview{id="data-table/live"}

## When to use it

- **Use it when:** People find, compare and act on many records, often in bulk.
- **Not when:** A handful of rows (a plain table), or items people browse rather than compare (cards).

Instead:

- [Table](./table.md): A few rows, no tools.
- [Card](./card.md): Items to browse, not compare.

::card-grid{id="anatomy-link/data-table"}

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
:::panel{title="An action on one row or item"}
**Use** Button ghost with a word

**Not** An icon alone

Visitors come rarely, so they never learn an icon. A word says what will happen.
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

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Every tool and row action is reachable by keyboard. | undefined |

Test before you ship:

- [ ] It stays a real table with headers; sorting and selection are announced. undefined

## Use it in code

```bash
npx open-ds add data-table
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Data table reads 13 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Data table's tokens to change Data table alone.

::token-table{component="data-table"}
