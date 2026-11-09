---
composite_data: "./sheet.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 50
title: "Sheet"
description: "Sheet in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Sheet

A panel that slides in from an edge.

:label[Left out of Accessible first]{tone="warning"} Only dialogs separate from the page here, with a dimmed page and a border. A panel sliding in from an edge adds a layer the scheme does not use. Use instead: [Dialog](./dialog), [Collapsible](./collapsible)

## See it live

::preview{id="sheet/live"}

## When to use it

- **Use it when:** Filters, details or a secondary form while the page stays in view.
- **Not when:** A blocking decision (dialog), or a tiny confirmation.

Instead:

- [Dialog](./dialog.md): A centered blocking window.
- [Drawer](./drawer.md): The bottom panel for phones.

::card-grid{id="anatomy-link/sheet"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="A menu or dialog"}
**Use** A strong border and a dimmed page

**Not** A shadow only

The dimmed page makes the dialog obvious.
:::
::::

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
