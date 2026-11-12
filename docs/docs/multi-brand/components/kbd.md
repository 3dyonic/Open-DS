---
composite_data: "./kbd.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 35
title: "Kbd"
description: "Kbd in Multi-brand."
---

# Kbd

A keyboard key or shortcut, shown as text.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="kbd/live"}

## When to use it

**In Multi-brand:** A shortcut shown beside an action on laptops, the action also reachable by tap. Not decoration, and never the only way in.

- **Use it when:** Telling people the shortcut for an action.
- **Not when:** Decoration, or the only way to discover an action.

Instead:

- [Command](./command.md): Where shortcuts are often listed.

::card-grid{id="anatomy-link/kbd"}

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

See [Voice and tone](../voice.md) for the whole voice.

## Use it in code

```bash
npx open-ds add kbd
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Kbd reads 10 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Kbd's tokens to change Kbd alone.

::token-table{component="kbd"}
