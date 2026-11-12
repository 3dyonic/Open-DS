---
composite_data: "./command.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19
title: "Command"
description: "Command in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Command

A search-first menu of actions and places, opened from the keyboard.

:label[Left out of Multi-brand]{tone="warning"} Command suits expert users who jump anywhere by typing, not people who visit now and then. Multi-brand's customers return now and then, and most visits last a few minutes. Use instead: [Navigation menu](./navigation-menu), [Dropdown menu](./dropdown-menu)

## See it live

::preview{id="command/live"}

## When to use it

- **Use it when:** Expert users who want to jump anywhere or run any action by typing.
- **Not when:** The only way to reach an action, or people who visit now and then.

Instead:

- [Dropdown menu](./dropdown-menu.md): A short menu from a button.
- [Combobox](./combobox.md): Picking a value for a field.

::card-grid{id="anatomy-link/command"}

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

See [Voice and tone](../voice.md) for the whole voice.

## Accessibility and keyboard

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | A shortcut opens it; arrows move; Enter runs; Escape closes. | undefined |

Test before you ship:

- [ ] Results are a list; the active result is announced. undefined

## Use it in code

```bash
npx open-ds add command
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Command reads 42 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Command's tokens to change Command alone.

::token-table{component="command"}

Its icons (`Search`) also read `icon.stroke-width`, 1.5px in Multi-brand: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
