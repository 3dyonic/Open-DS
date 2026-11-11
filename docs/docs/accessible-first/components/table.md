---
composite_data: "./table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 57
title: "Table"
description: "Table in Accessible first."
---

# Table

Rows and columns of comparable records, with headers.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="table/live"}

## When to use it

**In Accessible first:** A summary like the steps of an application, with large rows and numbers in body text. Not compact rows or small fonts.

- **Use it when:** Records people scan, sort or compare cell by cell.
- **Not when:** A grid of teasers (cards), or the shape of a relationship (chart).

Instead:

- [Data table](./data-table.md): Many records with search, filters and paging.
- [Chart](./chart.md): The shape of the numbers.

::card-grid{id="anatomy-link/table"}

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
