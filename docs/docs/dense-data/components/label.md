---
composite_data: "./label.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 35
title: "Label"
description: "Label in Dense data."
---

# Label

The visible name of a form control.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="label/live"}

## When to use it

**In Dense data:** Names every control.

- **Use it when:** Every form control.
- **Not when:** Never skipped: a placeholder is not a label.

Instead:

- [Field](./field.md): The label laid out with hint and error.

::card-grid{id="anatomy-link/label"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label

**Not** type.heading

Headers repeat on every column; a heavy style would compete with the data.
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

- [ ] The label is linked to its control and makes the hit area larger. undefined

## Use it in code

```bash
npx open-ds add label
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Label reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Label's tokens to change Label alone.

::token-table{component="label"}
