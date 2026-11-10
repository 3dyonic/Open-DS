---
composite_data: "./menubar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 38
title: "Menubar"
description: "Menubar in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Menubar

A row of menus, as in desktop apps.

:label[Left out of Multi-brand]{tone="warning"} Menubar suits dense desktop tools, not website navigation or phones. Brand sites use navigation-menu, and customers sign up on phones. Use instead: [Navigation menu](./navigation-menu), [Dropdown menu](./dropdown-menu)

## See it live

::preview{robot="slumber" id="menubar/live"}

## When to use it

- **Use it when:** A dense desktop-style tool with many commands grouped by menu.
- **Not when:** Website navigation (navigation menu), or phones.

Instead:

- [Navigation menu](./navigation-menu.md): Site navigation, not commands.
- [Dropdown menu](./dropdown-menu.md): One menu from one button.

::card-grid{id="anatomy-link/menubar"}

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
| undefined | Arrow keys move between and within menus; Escape closes. | undefined |



## Use it in code

```bash
npx open-ds add menubar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Menubar reads 89 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Menubar's tokens to change Menubar alone.

::token-table{component="menubar"}
