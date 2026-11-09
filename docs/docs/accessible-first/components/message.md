---
composite_data: "./message.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38
title: "Message"
description: "Message in Accessible first."
---

# Message

One message with its author and time.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="message/live"}

## When to use it

**In Accessible first:** Conversations or comments, each with author and time. Not system status, which an alert carries.

- **Use it when:** Conversations, comments and activity feeds.
- **Not when:** Status about the system (alert or toast).

Instead:

- [Bubble](./bubble.md): A chat bubble.
- [Alert](./alert.md): A system message.

::card-grid{id="anatomy-link/message"}

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
npx open-ds add message
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Message reads 7 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Message's tokens to change Message alone.

::token-table{component="message"}
