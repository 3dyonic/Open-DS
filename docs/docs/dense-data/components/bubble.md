---
composite_data: "./bubble.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Bubble"
description: "Bubble in Dense data."
---

# Bubble

A chat message in a bubble that shows who sent it.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="bubble/live"}

## When to use it

**In Dense data:** A back-and-forth between analysts or with an assistant. Not for notes on an alert, which use a message.

- **Use it when:** A back-and-forth conversation between people or with an assistant.
- **Not when:** Comments on a page or long text (use a message or a card).

Instead:

- [Message](./message.md): One message with its author and time, without the bubble shape.

::card-grid{id="anatomy-link/bubble"}

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
npx open-ds add bubble
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Bubble reads 11 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Bubble's tokens to change Bubble alone.

::token-table{component="bubble"}
