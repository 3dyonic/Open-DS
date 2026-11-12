---
composite_data: "./separator.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 50
title: "Separator"
description: "Separator in Multi-brand."
---

# Separator

A line between groups.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="separator/live"}

## When to use it

**In Multi-brand:** Groups of settings.

- **Use it when:** Separating groups that spacing alone does not separate.
- **Not when:** Decoration between every item: spacing is quieter.

Instead:

- [Card](./card.md): A container, when groups need a boundary.

::card-grid{id="anatomy-link/separator"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="Between page sections"}
**Use** space.gap.section and cards

**Not** Lines

Cards hold each offer together, so customers compare offers as units in every brand. Lines would split an offer apart.
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

## Use it in code

```bash
npx open-ds add separator
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Separator reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Separator's tokens to change Separator alone.

::token-table{component="separator"}
