---
composite_data: "./alert-dialog.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Alert dialog"
description: "Alert dialog in Content first."
---

# Alert dialog

A dialog that interrupts to confirm an action that cannot be undone.

:label[In Content first]{tone="info"}

## See it live

::preview{id="alert-dialog/live"}

## When to use it

**In Content first:** The confirm after a delete that cannot be undone. Not for unsubscribing, which readers can undo.

- **Use it when:** Deleting, cancelling or overwriting something people cannot get back, when undo is not possible.
- **Not when:** Anything that can be undone (offer undo instead), or a form or task (use a dialog).

Instead:

- [Dialog](./dialog.md): A focused task, not a confirmation.
- [Toast](./toast.md): Undo after the fact, when the action can be reversed.

::card-grid{id="anatomy-link/alert-dialog"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="Delete or remove"}
**Use** Button secondary with the full verb, then confirm with Button danger

**Not** Button primary

Naming the verb and confirming prevents a mistake.
:::
:::panel{title="A confirmation question"}
**Use** Gentle and clear about what changes

**Not** Guilt or pressure

Readers come back when leaving felt respectful. Example: “Unsubscribe from the weekly letter? You can come back any time.”
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
