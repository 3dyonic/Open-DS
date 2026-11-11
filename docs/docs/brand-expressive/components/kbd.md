---
composite_data: "./kbd.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 35
title: "Kbd"
description: "Kbd in Brand expressive."
sidebar_class_name: "ods-left-out"
---

# Kbd

A keyboard key or shortcut, shown as text.

:label[Left out of Brand expressive]{tone="warning"} Visitors come from social posts on their phones, and they are new customers deciding if they care. A keyboard shortcut serves neither. Use instead: [Button](./button)

## See it live

::preview{robot="slumber" id="kbd/live"}

## When to use it

- **Use it when:** Telling people the shortcut for an action.
- **Not when:** Decoration, or the only way to discover an action.

Instead:

- [Command](./command.md): Where shortcuts are often listed.

::card-grid{id="anatomy-link/kbd"}

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
npx open-ds add kbd
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Kbd reads 10 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Kbd's tokens to change Kbd alone.

::token-table{component="kbd"}
