---
composite_data: "./carousel.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 14
title: "Carousel"
description: "Carousel in Content first."
---

# Carousel

Slides that move left and right, one or a few at a time.

:label[In Content first]{tone="info"}

## See it live

::preview{id="carousel/live"}

## When to use it

**In Content first:** A few images people browse for pleasure, where missing some is fine. Not for anything readers must see.

- **Use it when:** A few images or items people browse for pleasure, where missing some is fine.
- **Not when:** Content people must see: most never reach the later slides.

Instead:

- [Card](./card.md): A grid shows every item at once.

::card-grid{id="anatomy-link/carousel"}

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

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Arrow keys move between slides when the carousel has focus. | undefined |

Test before you ship:

- [ ] Previous and next are buttons with names; nothing moves on its own without a pause control. undefined

## Use it in code

```bash
npx open-ds add carousel
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Carousel reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Carousel's tokens to change Carousel alone.

::token-table{component="carousel"}

Its icons (`ArrowLeft`, `ArrowRight`) also read `icon.stroke-width`, 1.5px in Content first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
