---
composite_data: "./message.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38
title: "Message"
description: "Message in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Message

One message with its author and time.

:label[Left out of Multi-brand]{tone="warning"} Multi-brand draws on core, content and media families, not conversation. It admits only families in its roles. Its only messages go to support through a textarea. Use instead: [Textarea](./textarea)

## See it live

::preview{id="message/live"}

## When to use it

- **Use it when:** Conversations, comments and activity feeds.
- **Not when:** Status about the system (alert or toast).

Instead:

- [Bubble](./bubble.md): A chat bubble.
- [Alert](./alert.md): A system message.

::card-grid{id="anatomy-link/message"}

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
npx open-ds add message
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Message reads 7 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Message's tokens to change Message alone.

::token-table{component="message"}
