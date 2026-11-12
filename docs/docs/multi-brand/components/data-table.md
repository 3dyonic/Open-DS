---
composite_data: "./data-table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 21
title: "Data table"
description: "Data table in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Data table

Many records in one view, with search, filters, sorting, column choice, selection and paging.

:label[Left out of Multi-brand]{tone="warning"} Multi-brand draws on core, content and media families, not data. It avoids tools staff use all day and points those to Dense data. Use instead: [Card](./card), [Tabs](./tabs)

## See it live

::preview{id="data-table/live"}

## When to use it

- **Use it when:** People find, compare and act on many records, often in bulk.
- **Not when:** A handful of rows (a plain table), or items people browse rather than compare (cards).

Instead:

- [Table](./table.md): A few rows, no tools.
- [Card](./card.md): Items to browse, not compare.

::card-grid{id="anatomy-link/data-table"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.body

**Not** A mono font

Prices sit in sentences and offers, not in columns to compare, so a mono font adds nothing in any brand.
:::
:::panel{title="A selected row or item"}
**Use** color.surface.selected (from the brand)

**Not** A fixed blue

Selection follows the brand color.
:::
:::panel{title="Table row height"}
**Use** size.row (comfortable)

**Not** A compact row

Customers browse on phones, and compact rows are hard to tap in any brand.
:::
:::panel{title="An action on one row or item"}
**Use** Button ghost with a word

**Not** An icon alone

A word says what will happen.
:::
::::

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

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

Its icons (`ArrowDown`, `ArrowUp`, `ChevronsUpDown`, `Columns3`, `ListFilter`) also read `icon.stroke-width`, 1.5px in Multi-brand: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
