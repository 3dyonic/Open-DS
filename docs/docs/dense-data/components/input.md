---
composite_data: "./input.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 31
title: "Input"
description: "Input in Dense data."
---

# Input

A labeled field for a short typed value.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="input/live"}

## When to use it

**In Dense data:** Search and edit fields.

- **Use it when:** A name, email, phone number or other one-line answer.
- **Not when:** Long text (textarea), or a closed choice (radio group, select or checkbox).

Instead:

- [Textarea](./textarea.md): Several lines.
- [Select](./select.md): A known list of options.

::card-grid{id="anatomy-link/input"}

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

- [ ] A visible label, never a placeholder as the only label. undefined

## Use it in code

```bash
npx open-ds add input
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Input reads 20 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Input's tokens to change Input alone.

::token-table{component="input"}
