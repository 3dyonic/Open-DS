---
composite_data: "./dropdown-menu.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 25
title: "Dropdown menu"
description: "Dropdown menu in Dense data."
---

# Dropdown menu

A menu of actions opened from a button.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="dropdown-menu/live"}

## When to use it

**In Dense data:** Row actions.

- **Use it when:** More actions than fit, or actions people use now and then.
- **Not when:** Choosing a value for a field (select), or the one main action (a button).

Instead:

- [Select](./select.md): Choosing a value.
- [Context menu](./context-menu.md): The same menu on right-click.

::card-grid{id="anatomy-link/dropdown-menu"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="A menu or dialog"}
**Use** elevation.overlay and a dimmed page for dialogs

**Not** A border only

Floating things need a shadow so they read as on top.
:::
:::panel{title="An action on one row or item"}
**Use** Icon button, ghost, compact

**Not** Button secondary in every row

Rows repeat dozens of times; a quiet icon keeps the table readable.
:::
::::

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
