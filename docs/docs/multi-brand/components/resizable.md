---
composite_data: "./resizable.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 47
title: "Resizable"
description: "Resizable in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Resizable

Panels people resize by dragging the line between them.

:label[Left out of Multi-brand]{tone="warning"} Resizable suits desktop tools where people size panels, not phones. Multi-brand avoids tools staff use all day, and customers sign up on phones. Use instead: [Sidebar](./sidebar), [Sheet](./sheet)

## See it live

::preview{robot="slumber" id="resizable/live"}

## When to use it

- **Use it when:** Desktop tools where people choose how much space each panel gets.
- **Not when:** Phones, or layouts with one obvious shape.

Instead:

- [Sidebar](./sidebar.md): Fixed app navigation.

::card-grid{id="anatomy-link/resizable"}

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

## Accessibility and keyboard

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | The handle can be focused and moved with arrow keys. | undefined |



## Use it in code

```bash
npx open-ds add resizable
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Resizable reads 11 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Resizable's tokens to change Resizable alone.

::token-table{component="resizable"}
