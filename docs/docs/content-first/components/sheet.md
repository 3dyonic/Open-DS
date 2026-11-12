---
composite_data: "./sheet.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 51
title: "Sheet"
description: "Sheet in Content first."
---

# Sheet

A panel that slides in from an edge.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="sheet/live"}

## When to use it

**In Content first:** The menu on a phone.

- **Use it when:** Filters, details or a secondary form while the page stays in view.
- **Not when:** A blocking decision (dialog), or a tiny confirmation.

Instead:

- [Dialog](./dialog.md): A centered blocking window.
- [Drawer](./drawer.md): The bottom panel for phones.

::card-grid{id="anatomy-link/sheet"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="A menu or dialog"}
**Use** elevation.overlay and a dimmed page

**Not** No shadow

The dimmed page focuses the reader on the dialog.
:::
::::

## Words

- Write to one person: "you", not "users".
- Short sentences with room to breathe.
- Explain why before asking for anything.
- Use: Read, Save for later, You, Next issue. Avoid: Click here, Submit, Users, Content.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Browse guides

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

Sheet reads 30 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Sheet's tokens to change Sheet alone.

::token-table{component="sheet"}

Its icons (`X`) also read `icon.stroke-width`, 1.5px in Content first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
