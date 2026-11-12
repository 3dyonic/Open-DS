---
composite_data: "./alert-dialog.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Alert dialog"
description: "Alert dialog in Multi-brand."
---

# Alert dialog

A dialog that interrupts to confirm an action that cannot be undone.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="alert-dialog/live"}

## When to use it

**In Multi-brand:** Cancel a plan.

- **Use it when:** Deleting, cancelling or overwriting something people cannot get back, when undo is not possible.
- **Not when:** Anything that can be undone (offer undo instead), or a form or task (use a dialog).

Instead:

- [Dialog](./dialog.md): A focused task, not a confirmation.
- [Toast](./toast.md): Undo after the fact, when the action can be reversed.

::card-grid{id="anatomy-link/alert-dialog"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="Delete or remove"}
**Use** Button secondary, then confirm with Button danger

**Not** Button primary

Confirm before destroying data.
:::
:::panel{title="A confirmation question"}
**Use** Shared across brands: plain and specific

**Not** Brand tone when something is lost

Loss is never the moment for personality. Example: “Cancel your plan? It stays active until the end of the month.”
:::
::::

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

Alert dialog reads 22 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Alert dialog's tokens to change Alert dialog alone.

::token-table{component="alert-dialog"}
