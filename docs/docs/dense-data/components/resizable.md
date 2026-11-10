---
composite_data: "./resizable.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 46
title: "Resizable"
description: "Resizable in Dense data."
---

# Resizable

Panels people resize by dragging the line between them.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="resizable/live"}

## When to use it

**In Dense data:** Experts size the table and detail panes.

- **Use it when:** Desktop tools where people choose how much space each panel gets.
- **Not when:** Phones, or layouts with one obvious shape.

Instead:

- [Sidebar](./sidebar.md): Fixed app navigation.

::card-grid{id="anatomy-link/resizable"}

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

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
