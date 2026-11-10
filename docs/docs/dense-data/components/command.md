---
composite_data: "./command.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19
title: "Command"
description: "Command in Dense data."
---

# Command

A search-first menu of actions and places, opened from the keyboard.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="command/live"}

## When to use it

**In Dense data:** Keyboard-first jump to any record or action.

- **Use it when:** Expert users who want to jump anywhere or run any action by typing.
- **Not when:** The only way to reach an action, or people who visit now and then.

Instead:

- [Dropdown menu](./dropdown-menu.md): A short menu from a button.
- [Combobox](./combobox.md): Picking a value for a field.

::card-grid{id="anatomy-link/command"}

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
