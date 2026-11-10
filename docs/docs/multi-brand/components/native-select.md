---
composite_data: "./native-select.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 41
title: "Native select"
description: "Native select in Multi-brand."
---

# Native select

The browser's own select, styled.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="native-select/live"}

## When to use it

**In Multi-brand:** A plain closed list such as country on a phone, where the system picker is best. Not where options need rich content.

- **Use it when:** A plain closed list, especially on phones, where the system picker is best.
- **Not when:** Options that need icons or rich content (select), or a short list better shown at once (radio group).

Instead:

- [Select](./select.md): A custom menu with richer options.
- [Radio group](./radio-group.md): A short list shown at once.

::card-grid{id="anatomy-link/native-select"}

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
npx open-ds add native-select
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Native select reads 30 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Native select's tokens to change Native select alone.

::token-table{component="native-select"}
