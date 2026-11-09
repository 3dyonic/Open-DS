---
composite_data: "./label.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 35
title: "Label"
description: "Label in Accessible first."
---

# Label

The visible name of a form control.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="label/live"}

## When to use it

**In Accessible first:** Names every control.

- **Use it when:** Every form control.
- **Not when:** Never skipped: a placeholder is not a label.

Instead:

- [Field](./field.md): The label laid out with hint and error.

::card-grid{id="anatomy-link/label"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label, above the field, always visible

**Not** A placeholder as the label

Labels must stay visible while typing.
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

- [ ] The label is linked to its control and makes the hit area larger. undefined

## Use it in code

```bash
npx open-ds add label
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Label reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Label's tokens to change Label alone.

::token-table{component="label"}
