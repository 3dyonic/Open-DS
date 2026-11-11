---
composite_data: "./context-menu.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 20
title: "Context menu"
description: "Context menu in Multi-brand."
sidebar_class_name: "ods-left-out"
---

# Context menu

A menu of actions on right-click or long-press.

:label[Left out of Multi-brand]{tone="warning"} Right-click menus suit power users, and people who don't know to right-click never find them. Multi-brand's customers see it fresh each time. Plan actions sit in a visible menu. Use instead: [Dropdown menu](./dropdown-menu)

## See it live

::preview{robot="slumber" id="context-menu/live"}

## When to use it

- **Use it when:** Power users acting on an item in place, with the same actions also reachable elsewhere.
- **Not when:** The only way to reach an action: people who don't know to right-click never find it.

Instead:

- [Dropdown menu](./dropdown-menu.md): The same actions from a visible button.

::card-grid{id="anatomy-link/context-menu"}

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
| undefined | Shift F10 or the menu key opens it; arrows move; Escape closes. | undefined |



## Use it in code

```bash
npx open-ds add context-menu
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Context menu reads 72 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Context menu's tokens to change Context menu alone.

::token-table{component="context-menu"}

Its icons (`Check`, `ChevronRight`, `Circle`) also read `icon.stroke-width`, 1.5px in Multi-brand: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
