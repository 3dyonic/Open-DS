---
composite_data: "./message.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38
title: "Message"
description: "Message in Content first."
sidebar_class_name: "ods-left-out"
---

# Message

One message with its author and time.

:label[Left out of Content first]{tone="warning"} Readers need sections, navigation and little else. People read from start to end; actions are rare: subscribe, share, save. No comments or feeds are among them. Use instead: [Card](./card), [Alert](./alert)

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

## Use it in code

```bash
npx open-ds add message
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Message reads 7 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Message's tokens to change Message alone.

::token-table{component="message"}
