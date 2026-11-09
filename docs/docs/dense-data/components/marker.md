---
composite_data: "./marker.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 36
title: "Marker"
description: "Marker in Dense data."
---

# Marker

A divider or status line inside a conversation, such as a date or someone joining.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="marker/live"}

## When to use it

**In Dense data:** A date or event line in a long thread of notes on an alert. Not for a note someone wrote.

- **Use it when:** Breaking a long conversation into days or showing events in it.
- **Not when:** A message someone wrote.

Instead:

- [Message](./message.md): Something someone said.

::card-grid{id="anatomy-link/marker"}

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
npx open-ds add marker
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Marker reads 5 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Marker's tokens to change Marker alone.

::token-table{component="marker"}
