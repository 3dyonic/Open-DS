---
composite_data: "./context-menu.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 20
title: "Context menu"
description: "Context menu in Dense data."
---

# Context menu

A menu of actions on right-click or long-press.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="context-menu/live"}

## When to use it

**In Dense data:** Right-click on a row, for experts.

- **Use it when:** Power users acting on an item in place, with the same actions also reachable elsewhere.
- **Not when:** The only way to reach an action: people who don't know to right-click never find it.

Instead:

- [Dropdown menu](./dropdown-menu.md): The same actions from a visible button.

::card-grid{id="anatomy-link/context-menu"}

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
| undefined | Shift F10 or the menu key opens it; arrows move; Escape closes. | undefined |



## Use it in code

```bash
npx open-ds add context-menu
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Context menu reads 72 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Context menu's tokens to change Context menu alone.

::token-table{component="context-menu"}

Its icons (`Check`, `ChevronRight`, `Circle`) also read `icon.stroke-width`, 1.5px in Dense data: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
