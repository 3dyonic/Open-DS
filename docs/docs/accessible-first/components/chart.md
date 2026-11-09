---
composite_data: "./chart.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 15
title: "Chart"
description: "Chart in Accessible first."
---

# Chart

A picture of numbers: comparison, trend, share or spread.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="chart/live"}

## When to use it

**In Accessible first:** A relationship in a set of numbers, with the numbers also as a table. Not decoration, and never color alone.

- **Use it when:** The story is a relationship in a set of numbers, not a single number.
- **Not when:** A table is clearer, the set is too small, or the chart is decoration.

Instead:

- [Table](./table.md): The numbers as rows; often needed beside the chart.

::card-grid{id="anatomy-link/chart"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.body

**Not** A small or mono font

Every number must be readable at large size.
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

- [ ] The same numbers are available as a table or text; color is not the only key. undefined

## Use it in code

```bash
npx open-ds add chart
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Chart reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Chart's tokens to change Chart alone.

::token-table{component="chart"}
