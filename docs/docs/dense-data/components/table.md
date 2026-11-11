---
composite_data: "./table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 57
title: "Table"
description: "Table in Dense data."
---

# Table

Rows and columns of comparable records, with headers.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="table/live"}

## When to use it

**In Dense data:** The heart of the product: rows of records.

- **Use it when:** Records people scan, sort or compare cell by cell.
- **Not when:** A grid of teasers (cards), or the shape of a relationship (chart).

Instead:

- [Data table](./data-table.md): Many records with search, filters and paging.
- [Chart](./chart.md): The shape of the numbers.

::card-grid{id="anatomy-link/table"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.data

**Not** type.body

Mono digits line up in columns, so values compare at a glance.
:::
:::panel{title="A selected row or item"}
**Use** color.surface.selected

**Not** color.action.primary as a fill

A light tint shows selection without hiding the data.
:::
:::panel{title="Table row height"}
**Use** size.row (compact)

**Not** The comfortable row

Compact rows show more records without scrolling.
:::
::::

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

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
