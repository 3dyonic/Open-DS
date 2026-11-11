---
composite_data: "./chart.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 15
title: "Chart"
description: "Chart in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Chart

A picture of numbers: comparison, trend, share or spread.

:label[Left out of Multi-brand]{tone="warning"} Multi-brand draws on core, content and media families, not data. It admits only families in its roles. Its scenarios are signing up and managing a plan. Use instead: [Card](./card), [Badge](./badge)

## See it live

::preview{robot="slumber" id="chart/live"}

## When to use it

- **Use it when:** The story is a relationship in a set of numbers, not a single number.
- **Not when:** A table is clearer, the set is too small, or the chart is decoration.

Instead:

- [Table](./table.md): The numbers as rows; often needed beside the chart.

::card-grid{id="anatomy-link/chart"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.body

**Not** A mono font

Prices sit in sentences and offers, not in columns to compare, so a mono font adds nothing in any brand.
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

- [ ] The same numbers are available as a table or text; color is not the only key. undefined

## Use it in code

```bash
npx open-ds add chart
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Chart reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Chart's tokens to change Chart alone.

::token-table{component="chart"}
