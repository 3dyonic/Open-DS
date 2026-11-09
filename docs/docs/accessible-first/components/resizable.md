---
composite_data: "./resizable.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 46
title: "Resizable"
description: "Resizable in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Resizable

Panels people resize by dragging the line between them.

:label[Left out of Accessible first]{tone="warning"} Resizing means dragging panels in desktop tools. The scheme avoids widgets that need drag or precise pointing, and avoids dense expert tools. Use instead: [Card](./card)

## See it live

::preview{id="resizable/live"}

## When to use it

- **Use it when:** Desktop tools where people choose how much space each panel gets.
- **Not when:** Phones, or layouts with one obvious shape.

Instead:

- [Sidebar](./sidebar.md): Fixed app navigation.

::card-grid{id="anatomy-link/resizable"}

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
