---
composite_data: "./message-scroller.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 40
title: "Message scroller"
description: "Message scroller in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Message scroller

A scrolling list of messages that keeps the newest in view.

:label[Left out of Multi-brand]{tone="warning"} Multi-brand draws on core, content and media families, not conversation. It admits only families in its roles. Its only messages go to support through a textarea. Use instead: [Textarea](./textarea)

## See it live

::preview{robot="slumber" id="message-scroller/live"}

## When to use it

- **Use it when:** A live conversation where new messages arrive at the bottom.
- **Not when:** A static list (a scroll area).

Instead:

- [Scroll area](./scroll-area.md): A plain scrolling region.

::card-grid{id="anatomy-link/message-scroller"}

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

- [ ] New messages are announced politely without moving focus. undefined

## Use it in code

```bash
npx open-ds add message-scroller
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Message scroller reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Message scroller's tokens to change Message scroller alone.

::token-table{component="message-scroller"}
