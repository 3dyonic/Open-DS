---
composite_data: "./marker.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 36
title: "Marker"
description: "Marker in Brand expressive."
sidebar_class_name: "ods-left-out"
---

# Marker

A divider or status line inside a conversation, such as a date or someone joining.

:label[Left out of Brand expressive]{tone="warning"} Brand expressive keeps only the parts in use for one action and a story, and a visit lasts a few minutes. A long conversation split into days is neither. Use instead: [Separator](./separator)

## See it live

::preview{id="marker/live"}

## When to use it

- **Use it when:** Breaking a long conversation into days or showing events in it.
- **Not when:** A message someone wrote.

Instead:

- [Message](./message.md): Something someone said.

::card-grid{id="anatomy-link/marker"}

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
npx open-ds add marker
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Marker reads 5 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Marker's tokens to change Marker alone.

::token-table{component="marker"}
