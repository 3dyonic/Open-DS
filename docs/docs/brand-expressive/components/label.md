---
composite_data: "./label.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 36
title: "Label"
description: "Label in Brand expressive."
---

# Label

The visible name of a form control.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="label/live"}

## When to use it

**In Brand expressive:** Names the field.

- **Use it when:** Every form control.
- **Not when:** Never skipped: a placeholder is not a label.

Instead:

- [Field](./field.md): The label laid out with hint and error.

::card-grid{id="anatomy-link/label"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label

**Not** type.caption

Labels stay readable on vivid color.
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

- [ ] The label is linked to its control and makes the hit area larger. undefined

## Use it in code

```bash
npx open-ds add label
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Label reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Label's tokens to change Label alone.

::token-table{component="label"}
