---
composite_data: "./textarea.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 59
title: "Textarea"
description: "Textarea in Dense data."
---

# Textarea

A field for free text over several lines.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="textarea/live"}

## When to use it

**In Dense data:** Notes on an alert, for the next analyst.

- **Use it when:** Comments, descriptions, anything longer than one line.
- **Not when:** A one-line value (input), or a known set of options.

Instead:

- [Input](./input.md): One line.

::card-grid{id="anatomy-link/textarea"}

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

- [ ] It has a visible label; a limit is announced as people type. undefined

## Use it in code

```bash
npx open-ds add textarea
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Textarea reads 21 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Textarea's tokens to change Textarea alone.

::token-table{component="textarea"}
