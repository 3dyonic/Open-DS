---
composite_data: "./aspect-ratio.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Aspect ratio"
description: "Aspect ratio in Dense data."
---

# Aspect ratio

Keeps an image or video at a fixed shape while the layout resizes.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="aspect-ratio/live"}

## When to use it

**In Dense data:** Any image or video in a panel, so it keeps its shape while loading. Not for decorative or hero media.

- **Use it when:** Media in cards, galleries and heroes that must not stretch or jump while it loads.
- **Not when:** Text content, or media that should keep its own natural shape.

Instead:

- [Skeleton](./skeleton.md): The placeholder shown while the media loads.

::card-grid{id="anatomy-link/aspect-ratio"}

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
npx open-ds add aspect-ratio
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Aspect ratio sets no colors, corners or shadows of its own; it takes them from the components inside it.
