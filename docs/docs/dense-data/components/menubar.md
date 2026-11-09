---
composite_data: "./menubar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 37
title: "Menubar"
description: "Menubar in Dense data."
---

# Menubar

A row of menus, as in desktop apps.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="menubar/live"}

## When to use it

**In Dense data:** Many commands grouped by menu in this desk tool. Not in place of the command palette or row menus.

- **Use it when:** A dense desktop-style tool with many commands grouped by menu.
- **Not when:** Website navigation (navigation menu), or phones.

Instead:

- [Navigation menu](./navigation-menu.md): Site navigation, not commands.
- [Dropdown menu](./dropdown-menu.md): One menu from one button.

::card-grid{id="anatomy-link/menubar"}

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
| undefined | Arrow keys move between and within menus; Escape closes. | undefined |



## Use it in code

```bash
npx open-ds add menubar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Menubar reads 89 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Menubar's tokens to change Menubar alone.

::token-table{component="menubar"}
