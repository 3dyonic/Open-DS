---
composite_data: "./form.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 28
title: "Form"
description: "Form in Accessible first."
---

# Form

Form state and validation wired to the fields.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="form/live"}

## When to use it

**In Accessible first:** Every form that checks answers, with the error next to the field. Not errors shown by color alone.

- **Use it when:** Any form that checks answers and shows errors next to the fields.
- **Not when:** A single control that saves at once (a switch).

Instead:

- [Field](./field.md): How one control is laid out.

::card-grid{id="anatomy-link/form"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger, an icon and a sentence next to the field

**Not** Color alone

People must know what went wrong and where.
:::
:::panel{title="The words of an error"}
**Use** Say what is wrong, where, and exactly how to fix it

**Not** "Invalid input"

People must be able to fix the error without help. Example: “Enter your date of birth. For example, 27 3 1980.”
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
