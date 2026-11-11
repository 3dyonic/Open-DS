---
composite_data: "./native-select.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 41
title: "Native select"
description: "Native select in Brand expressive."
---

# Native select

The browser's own select, styled.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="native-select/live"}

## When to use it

**In Brand expressive:** A plain closed list on a phone, such as a size. Not for a short list better shown at once.

- **Use it when:** A plain closed list, especially on phones, where the system picker is best.
- **Not when:** Options that need icons or rich content (select), or a short list better shown at once (radio group).

Instead:

- [Select](./select.md): A custom menu with richer options.
- [Radio group](./radio-group.md): A short list shown at once.

::card-grid{id="anatomy-link/native-select"}

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
npx open-ds add native-select
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Native select reads 30 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Native select's tokens to change Native select alone.

::token-table{component="native-select"}

Its icons (`ChevronDown`) also read `icon.stroke-width`, 1.75px in Brand expressive: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
