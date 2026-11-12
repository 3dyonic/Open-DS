---
composite_data: "./dropdown-menu.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 25
title: "Dropdown menu"
description: "Dropdown menu in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Dropdown menu

A menu of actions opened from a button.

:label[Left out of Accessible first]{tone="warning"} Every action here looks like a button people can find. Row actions are a secondary button with a word, not a menu. Use instead: [Button](./button)

## See it live

::preview{id="dropdown-menu/live"}

## When to use it

- **Use it when:** More actions than fit, or actions people use now and then.
- **Not when:** Choosing a value for a field (select), or the one main action (a button).

Instead:

- [Select](./select.md): Choosing a value.
- [Context menu](./context-menu.md): The same menu on right-click.

::card-grid{id="anatomy-link/dropdown-menu"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="A menu or dialog"}
**Use** A strong border and a dimmed page

**Not** A shadow only

The dimmed page makes the dialog obvious.
:::
:::panel{title="An action on one row or item"}
**Use** Button secondary with a word

**Not** An icon on its own

A word says what will happen.
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

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Arrows move; Enter runs; Escape closes and returns focus. | undefined |

Test before you ship:

- [ ] The trigger says it opens a menu and whether it is open. undefined

## Use it in code

```bash
npx open-ds add dropdown-menu
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Dropdown menu reads 20 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Dropdown menu's tokens to change Dropdown menu alone.

::token-table{component="dropdown-menu"}
