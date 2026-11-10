---
composite_data: "./bubble.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Bubble"
description: "Bubble in Accessible first."
---

# Bubble

A chat message in a bubble that shows who sent it.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="bubble/live"}

## When to use it

**In Accessible first:** A back-and-forth conversation, in large text with strong contrast. Not for comments or long text.

- **Use it when:** A back-and-forth conversation between people or with an assistant.
- **Not when:** Comments on a page or long text (use a message or a card).

Instead:

- [Message](./message.md): One message with its author and time, without the bubble shape.

::card-grid{id="anatomy-link/bubble"}

## Words

- Use common words. Explain any term you must use.
- One idea per sentence. Put the action first.
- Never blame the person.
- Use: Continue, Change, Start, You. Avoid: Invalid, Utilise, Submit, Error code.

The labels components use, from the voice tokens:

- `content.action.commit`: Continue
- `content.action.cancel`: Go back
- `content.action.destroy`: Delete
- `content.action.retry`: Try again
- `content.action.empty-action`: Start a new application

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add bubble
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Bubble reads 11 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Bubble's tokens to change Bubble alone.

::token-table{component="bubble"}
