---
composite_data: "./native-select.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 40
title: "Native select"
description: "Native select in Accessible first."
---

# Native select

The browser's own select, styled.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="native-select/live"}

## When to use it

**In Accessible first:** A browser select that every assistive technology understands.

- **Use it when:** A plain closed list, especially on phones, where the system picker is best.
- **Not when:** Options that need icons or rich content (select), or a short list better shown at once (radio group).

Instead:

- [Select](./select.md): A custom menu with richer options.
- [Radio group](./radio-group.md): A short list shown at once.

::card-grid{id="anatomy-link/native-select"}

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
npx open-ds add native-select
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Native select reads 30 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Native select's tokens to change Native select alone.

::token-table{component="native-select"}
