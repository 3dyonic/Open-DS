---
composite_data: "./alert-dialog.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Alert dialog"
description: "Alert dialog in Dense data."
---

# Alert dialog

A dialog that interrupts to confirm an action that cannot be undone.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="alert-dialog/live"}

## When to use it

**In Dense data:** Confirms a delete.

- **Use it when:** Deleting, cancelling or overwriting something people cannot get back, when undo is not possible.
- **Not when:** Anything that can be undone (offer undo instead), or a form or task (use a dialog).

Instead:

- [Dialog](./dialog.md): A focused task, not a confirmation.
- [Toast](./toast.md): Undo after the fact, when the action can be reversed.

::card-grid{id="anatomy-link/alert-dialog"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="Delete or remove"}
**Use** Button secondary, then confirm in a dialog with Button danger

**Not** Button primary as the first step

Deleting is rare and costly; a confirm step catches mistakes.
:::
:::panel{title="A confirmation question"}
**Use** Name the exact object and the consequence

**Not** "Are you sure?"

Acting on the wrong record is the costly mistake. Example: “Dismiss 3 alerts? This cannot be undone.”
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
| undefined | Escape cancels, the same as the safe choice. | undefined |
| undefined | Tab stays inside until people choose. | undefined |

Test before you ship:

- [ ] It is an alertdialog with a title and a description that names the consequence. undefined
- [ ] Focus starts on the safe choice, never on the destructive one. undefined

## Use it in code

```bash
npx open-ds add alert-dialog
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Alert dialog reads 25 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Alert dialog's tokens to change Alert dialog alone.

::token-table{component="alert-dialog"}
