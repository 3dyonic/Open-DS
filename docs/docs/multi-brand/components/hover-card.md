---
composite_data: "./hover-card.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 29
title: "Hover card"
description: "Hover card in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Hover card

A preview card that appears on hover or focus.

:label[Left out of Multi-brand]{tone="warning"} Hover cards need a mouse, and touch screens have no hover. Multi-brand's customers use any device. A popover opens plan details by tap. Use instead: [Popover](./popover)

## See it live

::preview{id="hover-card/live"}

## When to use it

- **Use it when:** A quick look at a person or link for people with a mouse, with the same detail reachable on click.
- **Not when:** The only way to see the content: touch screens have no hover.

Instead:

- [Popover](./popover.md): Opens on click, works on touch.
- [Tooltip](./tooltip.md): A one-line hint.

::card-grid{id="anatomy-link/hover-card"}

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
npx open-ds add hover-card
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Hover card reads 12 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Hover card's tokens to change Hover card alone.

::token-table{component="hover-card"}
