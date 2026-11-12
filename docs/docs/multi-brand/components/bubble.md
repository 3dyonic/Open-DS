---
composite_data: "./bubble.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Bubble"
description: "Bubble in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Bubble

A chat message in a bubble that shows who sent it.

:label[Left out of Multi-brand]{tone="warning"} Multi-brand draws on core, content and media families, not conversation. It admits only families in its roles. Its only messages go to support through a textarea. Use instead: [Textarea](./textarea)

## See it live

::preview{id="bubble/live"}

## When to use it

- **Use it when:** A back-and-forth conversation between people or with an assistant.
- **Not when:** Comments on a page or long text (use a message or a card).

Instead:

- [Message](./message.md): One message with its author and time, without the bubble shape.

::card-grid{id="anatomy-link/bubble"}

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
npx open-ds add bubble
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Bubble reads 11 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Bubble's tokens to change Bubble alone.

::token-table{component="bubble"}
