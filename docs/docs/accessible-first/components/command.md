---
composite_data: "./command.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19
title: "Command"
description: "Command in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Command

A search-first menu of actions and places, opened from the keyboard.

:label[Left out of Accessible first]{tone="warning"} Command is for expert users who jump anywhere by typing. Here people do this once or twice a year and nobody remembers the interface. Use instead: [Button](./button)

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

Its icons (`Search`) also read `icon.stroke-width`, 2px in Accessible first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
