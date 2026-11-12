---
composite_data: "./navigation-menu.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 42
title: "Navigation menu"
description: "Navigation menu in Dense data."
sidebar_class_name: "ods-left-out"
---

# Navigation menu

Site navigation with links and panels.

:label[Left out of Dense data]{tone="warning"} Navigation menu is for the sections of a website. Dense data avoids public sites, and its app navigation stays open all shift in a sidebar. Use instead: [Sidebar](./sidebar), [Tabs](./tabs)

## See it live

::preview{id="navigation-menu/live"}

## When to use it

- **Use it when:** The main sections of a website, sometimes with a panel of sub-links.
- **Not when:** App navigation that stays open (sidebar), or actions (dropdown menu).

Instead:

- [Sidebar](./sidebar.md): App navigation that stays open.
- [Tabs](./tabs.md): Views of one thing.

::card-grid{id="anatomy-link/navigation-menu"}

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

Test before you ship:

- [ ] It is a navigation landmark; the current page is marked. undefined

## Use it in code

```bash
npx open-ds add navigation-menu
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Navigation menu reads 60 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Navigation menu's tokens to change Navigation menu alone.

::token-table{component="navigation-menu"}

Its icons (`ChevronDown`) also read `icon.stroke-width`, 1.5px in Dense data: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
