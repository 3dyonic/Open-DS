---
composite_data: "./drawer.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 24
title: "Drawer"
description: "Drawer in Content first."
sidebar_class_name: "ods-left-out"
---

# Drawer

A panel that slides up from the bottom, for phones.

:label[Left out of Content first]{tone="warning"} Content first keeps few components, covered by today's pages. Sheet already holds the phone menu, and forms are rare and short. Use instead: [Sheet](./sheet), [Dialog](./dialog)

## See it live

::preview{robot="slumber" id="drawer/live"}

## When to use it

- **Use it when:** Filters, details or a short form on a phone, while the page stays partly in view.
- **Not when:** A blocking decision (dialog), or a wide screen where a side panel fits better (sheet).

Instead:

- [Sheet](./sheet.md): Slides from an edge on wide screens.
- [Dialog](./dialog.md): A blocking decision.

::card-grid{id="anatomy-link/drawer"}

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
npx open-ds add drawer
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Drawer reads 21 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Drawer's tokens to change Drawer alone.

::token-table{component="drawer"}
