---
composite_data: "./menubar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 37
title: "Menubar"
description: "Menubar in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Menubar

A row of menus, as in desktop apps.

:label[Left out of Accessible first]{tone="warning"} Menubar is for dense desktop-style tools. Accessible first avoids dense expert tools, and nobody remembers the interface from last time. Use instead: [Button](./button)

## See it live

::preview{id="menubar/live"}

## When to use it

- **Use it when:** A dense desktop-style tool with many commands grouped by menu.
- **Not when:** Website navigation (navigation menu), or phones.

Instead:

- [Navigation menu](./navigation-menu.md): Site navigation, not commands.
- [Dropdown menu](./dropdown-menu.md): One menu from one button.

::card-grid{id="anatomy-link/menubar"}

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
| undefined | Arrow keys move between and within menus; Escape closes. | undefined |



## Use it in code

```bash
npx open-ds add menubar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Menubar reads 89 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Menubar's tokens to change Menubar alone.

::token-table{component="menubar"}
