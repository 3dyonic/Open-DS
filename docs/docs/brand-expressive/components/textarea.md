---
composite_data: "./textarea.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 58
title: "Textarea"
description: "Textarea in Brand expressive."
---

# Textarea

A field for free text over several lines.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="textarea/live"}

## When to use it

**In Brand expressive:** A free-text answer longer than one line. Not in place of the sign-up email.

- **Use it when:** Comments, descriptions, anything longer than one line.
- **Not when:** A one-line value (input), or a known set of options.

Instead:

- [Input](./input.md): One line.

::card-grid{id="anatomy-link/textarea"}

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

- [ ] It has a visible label; a limit is announced as people type. undefined

## Use it in code

```bash
npx open-ds add textarea
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Textarea reads 21 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Textarea's tokens to change Textarea alone.

::token-table{component="textarea"}
