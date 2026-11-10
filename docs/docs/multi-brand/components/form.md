---
composite_data: "./form.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 28
title: "Form"
description: "Form in Multi-brand."
---

# Form

Form state and validation wired to the fields.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="form/live"}

## When to use it

**In Multi-brand:** Validation shared by every product team.

- **Use it when:** Any form that checks answers and shows errors next to the fields.
- **Not when:** A single control that saves at once (a switch).

Instead:

- [Field](./field.md): How one control is laid out.

::card-grid{id="anatomy-link/form"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger and a sentence

**Not** The brand color

Status colors are shared, never branded.
:::
:::panel{title="The words of an error"}
**Use** Shared across brands: plain and specific

**Not** Brand tone in errors

Errors read the same in every brand, so support can help anyone. Example: “Your card was declined. Try another card or contact your bank.”
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
