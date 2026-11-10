---
composite_data: "./textarea.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 58
title: "Textarea"
description: "Textarea in Accessible first."
---

# Textarea

A field for free text over several lines.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="textarea/live"}

## When to use it

**In Accessible first:** Longer answers.

- **Use it when:** Comments, descriptions, anything longer than one line.
- **Not when:** A one-line value (input), or a known set of options.

Instead:

- [Input](./input.md): One line.

::card-grid{id="anatomy-link/textarea"}

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

- [ ] It has a visible label; a limit is announced as people type. undefined

## Use it in code

```bash
npx open-ds add textarea
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Textarea reads 21 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Textarea's tokens to change Textarea alone.

::token-table{component="textarea"}
