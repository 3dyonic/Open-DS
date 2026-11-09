---
composite_data: "./data-table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 21
title: "Data table"
description: "Data table in Content first."
sidebar_class_name: "ods-left-out"
---

# Data table

Many records in one view, with search, filters, sorting, column choice, selection and paging.

:label[Left out of Content first]{tone="warning"} Content first avoids data-heavy tools. It has no dense tables, and its rows are read, not scanned. Use instead: [Card](./card), [Pagination](./pagination)

## See it live

::preview{id="data-table/live"}

## When to use it

- **Use it when:** People find, compare and act on many records, often in bulk.
- **Not when:** A handful of rows (a plain table), or items people browse rather than compare (cards).

Instead:

- [Table](./table.md): A few rows, no tools.
- [Card](./card.md): Items to browse, not compare.

::card-grid{id="anatomy-link/data-table"}

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
:::panel{title="An action on one row or item"}
**Use** Button ghost with a word

**Not** An icon on its own

Occasional visitors need the word.
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
