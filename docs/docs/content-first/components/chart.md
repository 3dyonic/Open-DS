---
composite_data: "./chart.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 15
title: "Chart"
description: "Chart in Content first."
---

# Chart

A picture of numbers: comparison, trend, share or spread.

:label[In Content first]{tone="info"}

## See it live

::preview{id="chart/live"}

## When to use it

**In Content first:** A figure inside an article when the story is a relationship in numbers. Not as decoration.

- **Use it when:** The story is a relationship in a set of numbers, not a single number.
- **Not when:** A table is clearer, the set is too small, or the chart is decoration.

Instead:

- [Table](./table.md): The numbers as rows; often needed beside the chart.

::card-grid{id="anatomy-link/chart"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="A number in a table"}
**Use** type.body

**Not** A mono font

Tables are rare and read row by row, so digits never need to line up in columns. A mono font would break the reading voice.
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

- [ ] The same numbers are available as a table or text; color is not the only key. undefined

## Use it in code

```bash
npx open-ds add chart
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Chart reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Chart's tokens to change Chart alone.

::token-table{component="chart"}
