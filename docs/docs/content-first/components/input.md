---
composite_data: "./input.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 31
title: "Input"
description: "Input in Content first."
---

# Input

A labeled field for a short typed value.

:label[In Content first]{tone="info"}

## See it live

::preview{id="input/live"}

## When to use it

**In Content first:** Search and the newsletter field.

- **Use it when:** A name, email, phone number or other one-line answer.
- **Not when:** Long text (textarea), or a closed choice (radio group, select or checkbox).

Instead:

- [Textarea](./textarea.md): Several lines.
- [Select](./select.md): A known list of options.

::card-grid{id="anatomy-link/input"}

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

- [ ] A visible label, never a placeholder as the only label. undefined

## Use it in code

```bash
npx open-ds add input
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Input reads 20 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Input's tokens to change Input alone.

::token-table{component="input"}
