---
composite_data: "./message-scroller.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 39
title: "Message scroller"
description: "Message scroller in Brand expressive."
sidebar_class_name: "ods-left-out"
---

# Message scroller

A scrolling list of messages that keeps the newest in view.

:label[Left out of Brand expressive]{tone="warning"} Brand expressive keeps only the parts in use for one action and a story, not a part for one campaign. A live conversation is neither. Use instead: [Card](./card)

## See it live

::preview{id="message-scroller/live"}

## When to use it

- **Use it when:** A live conversation where new messages arrive at the bottom.
- **Not when:** A static list (a scroll area).

Instead:

- [Scroll area](./scroll-area.md): A plain scrolling region.

::card-grid{id="anatomy-link/message-scroller"}

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

## Accessibility and keyboard

Test before you ship:

- [ ] New messages are announced politely without moving focus. undefined

## Use it in code

```bash
npx open-ds add message-scroller
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Message scroller reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Message scroller's tokens to change Message scroller alone.

::token-table{component="message-scroller"}
