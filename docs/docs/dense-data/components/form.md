---
composite_data: "./form.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 28
title: "Form"
description: "Form in Dense data."
---

# Form

Form state and validation wired to the fields.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="form/live"}

## When to use it

**In Dense data:** Keeps validation and errors the same on every record edit.

- **Use it when:** Any form that checks answers and shows errors next to the fields.
- **Not when:** A single control that saves at once (a switch).

Instead:

- [Field](./field.md): How one control is laid out.

::card-grid{id="anatomy-link/form"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger with an icon

**Not** color.status.warning

Red always means fix this, and the icon says it without color.
:::
:::panel{title="The words of an error"}
**Use** Name the record, then the fix. Flat and specific.

**Not** "Oops" or a vague apology

Experts act on the message; the record and the fix are all they need. Example: “Alert ALR-2042 not saved. Threshold must be between 0 and 100.”
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
