---
composite_data: "./sheet.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 50
title: "Sheet"
description: "Sheet in Dense data."
---

# Sheet

A panel that slides in from an edge.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="sheet/live"}

## When to use it

**In Dense data:** Record details beside the table.

- **Use it when:** Filters, details or a secondary form while the page stays in view.
- **Not when:** A blocking decision (dialog), or a tiny confirmation.

Instead:

- [Dialog](./dialog.md): A centered blocking window.
- [Drawer](./drawer.md): The bottom panel for phones.

::card-grid{id="anatomy-link/sheet"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="A menu or dialog"}
**Use** elevation.overlay and a dimmed page for dialogs

**Not** A border only

Floating things need a shadow so they read as on top.
:::
::::

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
| undefined | Escape closes it. | undefined |

Test before you ship:

- [ ] It behaves as a dialog: named, focus moves in and back. undefined

## Use it in code

```bash
npx open-ds add sheet
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Sheet reads 26 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Sheet's tokens to change Sheet alone.

::token-table{component="sheet"}
