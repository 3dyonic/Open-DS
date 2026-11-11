---
composite_data: "./table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 57
title: "Table"
description: "Table in Content first."
---

# Table

Rows and columns of comparable records, with headers.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="table/live"}

## When to use it

**In Content first:** The rare table inside an article, read row by row at a comfortable height. Not for records people scan or sort.

- **Use it when:** Records people scan, sort or compare cell by cell.
- **Not when:** A grid of teasers (cards), or the shape of a relationship (chart).

Instead:

- [Data table](./data-table.md): Many records with search, filters and paging.
- [Chart](./chart.md): The shape of the numbers.

::card-grid{id="anatomy-link/table"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.body

**Not** A mono font

Tables are rare and read row by row, so digits never need to line up in columns. A mono font would break the reading voice.
:::
:::panel{title="A selected row or item"}
**Use** color.surface.selected

**Not** Bold text only

A tint shows the choice clearly on warm paper.
:::
:::panel{title="Table row height"}
**Use** size.row (comfortable)

**Not** A compact row

Rows are read, not scanned.
:::
::::

## Words

- Write to one person: "you", not "users".
- Short sentences with room to breathe.
- Explain why before asking for anything.
- Use: Read, Save for later, You, Next issue. Avoid: Click here, Submit, Users, Content.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Browse guides

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
