---
composite_data: "./skeleton.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 52
title: "Skeleton"
description: "Skeleton in Multi-brand."
---

# Skeleton

Placeholder shapes that match the final layout, so the page does not jump when content arrives.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="skeleton/live"}

## When to use it

**In Multi-brand:** Plans and orders while they load.

- **Use it when:** Lists, cards, dashboards and tables whose shape is known.
- **Not when:** A wait with no layout (spinner), or a region that loaded empty (empty).

Instead:

- [Spinner](./spinner.md): A wait with no layout.
- [Empty](./empty.md): Loaded, with nothing to show.

::card-grid{id="anatomy-link/skeleton"}

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

- [ ] The region says it is loading; the shapes themselves are hidden from screen readers. undefined

## Use it in code

```bash
npx open-ds add skeleton
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Skeleton reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Skeleton's tokens to change Skeleton alone.

::token-table{component="skeleton"}
