---
composite_data: "./menubar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38
title: "Menubar"
description: "Menubar in Content first."
sidebar_class_name: "ods-left-out"
---

# Menubar

A row of menus, as in desktop apps.

:label[Left out of Content first]{tone="warning"} Menubar is for dense desktop-style tools, not website navigation or phones. Content first avoids screens with many actions, and readers arrive on phones. Use instead: [Navigation menu](./navigation-menu), [Sheet](./sheet)

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
| undefined | Arrow keys move between and within menus; Escape closes. | undefined |



## Use it in code

```bash
npx open-ds add menubar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Menubar reads 92 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Menubar's tokens to change Menubar alone.

::token-table{component="menubar"}

Its icons (`Check`, `ChevronRight`, `Circle`) also read `icon.stroke-width`, 1.5px in Content first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
