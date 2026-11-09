---
composite_data: "./command.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 19
title: "Command"
description: "Command in Brand expressive."
sidebar_class_name: "ods-left-out"
---

# Command

A search-first menu of actions and places, opened from the keyboard.

:label[Left out of Brand expressive]{tone="warning"} Command serves expert users who type to jump anywhere. Brand expressive serves new customers deciding if they care, who come from social posts on their phones. Use instead: [Navigation menu](./navigation-menu), [Drawer](./drawer)

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
