---
composite_data: "./marker.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 37
title: "Marker"
description: "Marker in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Marker

A divider or status line inside a conversation, such as a date or someone joining.

:label[Left out of Multi-brand]{tone="warning"} Multi-brand draws on core, content and media families, not conversation. It admits only families in its roles. Its only messages go to support through a textarea. Use instead: [Separator](./separator)

## See it live

::preview{id="marker/live"}

## When to use it

- **Use it when:** Breaking a long conversation into days or showing events in it.
- **Not when:** A message someone wrote.

Instead:

- [Message](./message.md): Something someone said.

::card-grid{id="anatomy-link/marker"}

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
npx open-ds add marker
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Marker reads 5 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Marker's tokens to change Marker alone.

::token-table{component="marker"}
