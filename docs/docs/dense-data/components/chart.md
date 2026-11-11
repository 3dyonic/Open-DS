---
composite_data: "./chart.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 15
title: "Chart"
description: "Chart in Dense data."
---

# Chart

A picture of numbers: comparison, trend, share or spread.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="chart/live"}

## When to use it

**In Dense data:** Totals over time on dashboards.

- **Use it when:** The story is a relationship in a set of numbers, not a single number.
- **Not when:** A table is clearer, the set is too small, or the chart is decoration.

Instead:

- [Table](./table.md): The numbers as rows; often needed beside the chart.

::card-grid{id="anatomy-link/chart"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.data

**Not** type.body

Mono digits line up in columns, so values compare at a glance.
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

- [ ] The same numbers are available as a table or text; color is not the only key. undefined

## Use it in code

```bash
npx open-ds add chart
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Chart reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Chart's tokens to change Chart alone.

::token-table{component="chart"}
