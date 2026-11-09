---
composite_data: "./input.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 30
title: "Input"
description: "Input in Brand expressive."
---

# Input

A labeled field for a short typed value.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="input/live"}

## When to use it

**In Brand expressive:** The sign-up email.

- **Use it when:** A name, email, phone number or other one-line answer.
- **Not when:** Long text (textarea), or a closed choice (radio group, select or checkbox).

Instead:

- [Textarea](./textarea.md): Several lines.
- [Select](./select.md): A known list of options.

::card-grid{id="anatomy-link/input"}

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

- [ ] A visible label, never a placeholder as the only label. undefined

## Use it in code

```bash
npx open-ds add input
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Input reads 20 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Input's tokens to change Input alone.

::token-table{component="input"}
