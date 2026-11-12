---
composite_data: "./form.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 28
title: "Form"
description: "Form in Content first."
---

# Form

Form state and validation wired to the fields.

:label[In Content first]{tone="info"}

## See it live

::preview{id="form/live"}

## When to use it

**In Content first:** The newsletter and search forms, with a plain sentence that says what to fix. Not for a single control.

- **Use it when:** Any form that checks answers and shows errors next to the fields.
- **Not when:** A single control that saves at once (a switch).

Instead:

- [Field](./field.md): How one control is laid out.

::card-grid{id="anatomy-link/form"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger and a plain sentence

**Not** Color alone

The sentence says what to fix; color only draws the eye.
:::
:::panel{title="The words of an error"}
**Use** Calm and helpful. Take the blame, offer the way forward.

**Not** Blaming the reader

A calm error keeps the reader's trust. Example: “We could not save your email. Check it and try again.”
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

Test before you ship:

- [ ] Errors are announced, linked to their fields, and the first one gets focus on submit. undefined

## Use it in code

```bash
npx open-ds add form
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Form reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Form's tokens to change Form alone.

::token-table{component="form"}
