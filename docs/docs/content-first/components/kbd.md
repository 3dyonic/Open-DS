---
composite_data: "./kbd.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 35
title: "Kbd"
description: "Kbd in Content first."
sidebar_class_name: "ods-left-out"
---

# Kbd

A keyboard key or shortcut, shown as text.

:label[Left out of Content first]{tone="warning"} Most readers visit now and then and see the interface fresh each time. Shortcuts serve repeat experts, and command is left out too. Use instead: [Button](./button)

## See it live

::preview{robot="slumber" id="kbd/live"}

## When to use it

- **Use it when:** Telling people the shortcut for an action.
- **Not when:** Decoration, or the only way to discover an action.

Instead:

- [Command](./command.md): Where shortcuts are often listed.

::card-grid{id="anatomy-link/kbd"}

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
npx open-ds add kbd
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Kbd reads 10 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Kbd's tokens to change Kbd alone.

::token-table{component="kbd"}
