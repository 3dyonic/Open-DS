---
composite_data: "./kbd.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 34
title: "Kbd"
description: "Kbd in Dense data."
---

# Kbd

A keyboard key or shortcut, shown as text.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="kbd/live"}

## When to use it

**In Dense data:** Shows the shortcuts experts learn.

- **Use it when:** Telling people the shortcut for an action.
- **Not when:** Decoration, or the only way to discover an action.

Instead:

- [Command](./command.md): Where shortcuts are often listed.

::card-grid{id="anatomy-link/kbd"}

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
npx open-ds add kbd
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Kbd reads 10 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Kbd's tokens to change Kbd alone.

::token-table{component="kbd"}
