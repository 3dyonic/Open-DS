---
composite_data: "./hover-card.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 29
title: "Hover card"
description: "Hover card in Dense data."
---

# Hover card

A preview card that appears on hover or focus.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="hover-card/live"}

## When to use it

**In Dense data:** A quick look at an asset or user on hover, also reachable on click. Never the only way to see it.

- **Use it when:** A quick look at a person or link for people with a mouse, with the same detail reachable on click.
- **Not when:** The only way to see the content: touch screens have no hover.

Instead:

- [Popover](./popover.md): Opens on click, works on touch.
- [Tooltip](./tooltip.md): A one-line hint.

::card-grid{id="anatomy-link/hover-card"}

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
npx open-ds add hover-card
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Hover card reads 9 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Hover card's tokens to change Hover card alone.

::token-table{component="hover-card"}
