---
composite_data: "./label.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 36
title: "Label"
description: "Label in Content first."
---

# Label

The visible name of a form control.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="label/live"}

## When to use it

**In Content first:** Names every field.

- **Use it when:** Every form control.
- **Not when:** Never skipped: a placeholder is not a label.

Instead:

- [Field](./field.md): The label laid out with hint and error.

::card-grid{id="anatomy-link/label"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label

**Not** type.caption

Caption is too faint for a label people must read.
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

- [ ] The label is linked to its control and makes the hit area larger. undefined

## Use it in code

```bash
npx open-ds add label
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Label reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Label's tokens to change Label alone.

::token-table{component="label"}
