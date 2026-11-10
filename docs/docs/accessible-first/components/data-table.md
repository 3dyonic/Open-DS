---
composite_data: "./data-table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 21
title: "Data table"
description: "Data table in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Data table

Many records in one view, with search, filters, sorting, column choice, selection and paging.

:label[Left out of Accessible first]{tone="warning"} Data table is for finding and acting on many records, often in bulk. Accessible first avoids dense expert tools, and its one density has no compact mode. Use instead: [Card](./card)

## See it live

::preview{robot="slumber" id="data-table/live"}

## When to use it

- **Use it when:** People find, compare and act on many records, often in bulk.
- **Not when:** A handful of rows (a plain table), or items people browse rather than compare (cards).

Instead:

- [Table](./table.md): A few rows, no tools.
- [Card](./card.md): Items to browse, not compare.

::card-grid{id="anatomy-link/data-table"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.body

**Not** A small or mono font

Every number must be readable at large size.
:::
:::panel{title="A selected row or item"}
**Use** color.surface.selected and a check icon

**Not** Color alone

Selection never relies on color alone.
:::
:::panel{title="Table row height"}
**Use** size.row (large)

**Not** A compact row

Large rows are easy to read and tap.
:::
:::panel{title="An action on one row or item"}
**Use** Button secondary with a word

**Not** An icon on its own

A word says what will happen.
:::
::::

## Words

- Use common words. Explain any term you must use.
- One idea per sentence. Put the action first.
- Never blame the person.
- Use: Continue, Change, Start, You. Avoid: Invalid, Utilise, Submit, Error code.

The labels components use, from the voice tokens:

- `content.action.commit`: Continue
- `content.action.cancel`: Go back
- `content.action.destroy`: Delete
- `content.action.retry`: Try again
- `content.action.empty-action`: Start a new application

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
