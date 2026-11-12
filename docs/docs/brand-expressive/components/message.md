---
composite_data: "./message.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 39
title: "Message"
description: "Message in Brand expressive."
---

# Message

One message with its author and time.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="message/live"}

## When to use it

**In Brand expressive:** A customer quote with its author, beside the avatar. Not for system status; toast and alert do that.

- **Use it when:** Conversations, comments and activity feeds.
- **Not when:** Status about the system (alert or toast).

Instead:

- [Bubble](./bubble.md): A chat bubble.
- [Alert](./alert.md): A system message.

::card-grid{id="anatomy-link/message"}

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

## Use it in code

```bash
npx open-ds add message
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Message reads 7 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Message's tokens to change Message alone.

::token-table{component="message"}
