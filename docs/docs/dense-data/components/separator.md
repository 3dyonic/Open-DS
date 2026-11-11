---
composite_data: "./separator.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 50
title: "Separator"
description: "Separator in Dense data."
---

# Separator

A line between groups.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="separator/live"}

## When to use it

**In Dense data:** Groups toolbar actions.

- **Use it when:** Separating groups that spacing alone does not separate.
- **Not when:** Decoration between every item: spacing is quieter.

Instead:

- [Card](./card.md): A container, when groups need a boundary.

::card-grid{id="anatomy-link/separator"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="Between page sections"}
**Use** space.gap.section and a hairline

**Not** A card around every section

Lines separate without taking room from the data.
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

## Use it in code

```bash
npx open-ds add separator
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Separator reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Separator's tokens to change Separator alone.

::token-table{component="separator"}
