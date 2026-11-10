---
composite_data: "./aspect-ratio.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Aspect ratio"
description: "Aspect ratio in Multi-brand."
---

# Aspect ratio

Keeps an image or video at a fixed shape while the layout resizes.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="aspect-ratio/live"}

## When to use it

**In Multi-brand:** Media in cards or on product pages, held in shape while it loads. Not in empty states, which carry no brand pictures.

- **Use it when:** Media in cards, galleries and heroes that must not stretch or jump while it loads.
- **Not when:** Text content, or media that should keep its own natural shape.

Instead:

- [Skeleton](./skeleton.md): The placeholder shown while the media loads.

::card-grid{id="anatomy-link/aspect-ratio"}

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
npx open-ds add aspect-ratio
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Aspect ratio sets no colors, corners or shadows of its own; it takes them from the components inside it.
