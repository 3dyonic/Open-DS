---
composite_data: "./carousel.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 14
title: "Carousel"
description: "Carousel in Dense data."
sidebar_class_name: "ods-left-out"
---

# Carousel

Slides that move left and right, one or a few at a time.

:label[Left out of Dense data]{tone="warning"} Slides hide items, and most people never reach the later ones. Dense data's experts want many records on one screen. Use instead: [Table](./table), [Card](./card)

## See it live

::preview{id="carousel/live"}

## When to use it

- **Use it when:** A few images or items people browse for pleasure, where missing some is fine.
- **Not when:** Content people must see: most never reach the later slides.

Instead:

- [Card](./card.md): A grid shows every item at once.

::card-grid{id="anatomy-link/carousel"}

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
