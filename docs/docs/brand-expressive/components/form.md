---
composite_data: "./form.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 28
title: "Form"
description: "Form in Brand expressive."
---

# Form

Form state and validation wired to the fields.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="form/live"}

## When to use it

**In Brand expressive:** The sign-up email, checked, with its error next to the field. Not for sections without a field.

- **Use it when:** Any form that checks answers and shows errors next to the fields.
- **Not when:** A single control that saves at once (a switch).

Instead:

- [Field](./field.md): How one control is laid out.

::card-grid{id="anatomy-link/form"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger and a short sentence

**Not** The brand magenta

Errors must not look like the brand.
:::
:::panel{title="The words of an error"}
**Use** Plain first, a light touch after

**Not** A joke before the fix

Playful copy must never hide what went wrong. Example: “That email doesn't look right. Check it and try again.”
:::
::::

## Words

- Headlines are short and bold. Three to six words.
- Verbs that move: Join, Try, Go.
- Playful in headlines, plain in errors.
- Use: Join, Drop, Go, Love. Avoid: Synergy, Leverage, Kindly.

The labels components use, from the voice tokens:

- `content.action.commit`: Go
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Explore the drop

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
