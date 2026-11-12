---
composite_data: "./kbd.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 35
title: "Kbd"
description: "Kbd in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Kbd

A keyboard key or shortcut, shown as text.

:label[Left out of Accessible first]{tone="warning"} Kbd tells people the shortcut for an action. Here people do this once or twice a year, and nobody remembers the interface from last time. Use instead: [Label](./label)

## See it live

::preview{id="kbd/live"}

## When to use it

- **Use it when:** Telling people the shortcut for an action.
- **Not when:** Decoration, or the only way to discover an action.

Instead:

- [Command](./command.md): Where shortcuts are often listed.

::card-grid{id="anatomy-link/kbd"}

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
npx open-ds add kbd
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Kbd reads 10 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Kbd's tokens to change Kbd alone.

::token-table{component="kbd"}
