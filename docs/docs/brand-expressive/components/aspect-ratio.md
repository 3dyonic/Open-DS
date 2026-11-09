---
composite_data: "./aspect-ratio.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Aspect ratio"
description: "Aspect ratio in Brand expressive."
---

# Aspect ratio

Keeps an image or video at a fixed shape while the layout resizes.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="aspect-ratio/live"}

## When to use it

**In Brand expressive:** Keeps campaign images in shape.

- **Use it when:** Media in cards, galleries and heroes that must not stretch or jump while it loads.
- **Not when:** Text content, or media that should keep its own natural shape.

Instead:

- [Skeleton](./skeleton.md): The placeholder shown while the media loads.

::card-grid{id="anatomy-link/aspect-ratio"}

## Words

- Headlines are short and bold. Three to six words.
- Verbs that move: Join, Try, Go.
- Playful in headlines, plain in errors.
- Use: Join, Drop, Go, Love. Avoid: Synergy, Leverage, Kindly.

The labels components use, from the voice tokens:

- `content.action.commit`: Go
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Explore the drop

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add aspect-ratio
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Aspect ratio sets no colors, corners or shadows of its own; it takes them from the components inside it.
