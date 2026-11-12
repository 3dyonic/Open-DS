---
composite_data: "./drawer.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 24
title: "Drawer"
description: "Drawer in Multi-brand."
---

# Drawer

A panel that slides up from the bottom, for phones.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="drawer/live"}

## When to use it

**In Multi-brand:** Details or a short form on a phone, with the page partly in view. Not for blocking decisions; dialog and alert-dialog hold those.

- **Use it when:** Filters, details or a short form on a phone, while the page stays partly in view.
- **Not when:** A blocking decision (dialog), or a wide screen where a side panel fits better (sheet).

Instead:

- [Sheet](./sheet.md): Slides from an edge on wide screens.
- [Dialog](./dialog.md): A blocking decision.

::card-grid{id="anatomy-link/drawer"}

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
| undefined | Escape closes it. | undefined |

Test before you ship:

- [ ] It behaves as a dialog: named, focus moves in and back. undefined

## Use it in code

```bash
npx open-ds add drawer
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Drawer reads 24 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Drawer's tokens to change Drawer alone.

::token-table{component="drawer"}
