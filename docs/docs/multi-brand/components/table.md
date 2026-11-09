---
composite_data: "./table.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 56
title: "Table"
description: "Table in Multi-brand."
---

# Table

Rows and columns of comparable records, with headers.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="table/live"}

## When to use it

**In Multi-brand:** A customer's own records in the account area, such as Your subscriptions, in comfortable rows. Not as a tool for bulk work.

- **Use it when:** Records people scan, sort or compare cell by cell.
- **Not when:** A grid of teasers (cards), or the shape of a relationship (chart).

Instead:

- [Data table](./data-table.md): Many records with search, filters and paging.
- [Chart](./chart.md): The shape of the numbers.

::card-grid{id="anatomy-link/table"}

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
