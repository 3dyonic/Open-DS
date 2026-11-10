---
composite_data: "./dropdown-menu.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 25
title: "Dropdown menu"
description: "Dropdown menu in Content first."
---

# Dropdown menu

A menu of actions opened from a button.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="dropdown-menu/live"}

## When to use it

**In Content first:** A short menu of rare actions on a guide, such as save and share. Not for the one main action.

- **Use it when:** More actions than fit, or actions people use now and then.
- **Not when:** Choosing a value for a field (select), or the one main action (a button).

Instead:

- [Select](./select.md): Choosing a value.
- [Context menu](./context-menu.md): The same menu on right-click.

::card-grid{id="anatomy-link/dropdown-menu"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="A menu or dialog"}
**Use** elevation.overlay and a dimmed page

**Not** No shadow

The dimmed page focuses the reader on the dialog.
:::
:::panel{title="An action on one row or item"}
**Use** Button ghost with a word

**Not** An icon on its own

Occasional visitors need the word.
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
