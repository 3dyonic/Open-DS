---
composite_data: "./navigation-menu.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 42
title: "Navigation menu"
description: "Navigation menu in Brand expressive."
---

# Navigation menu

Site navigation with links and panels.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="navigation-menu/live"}

## When to use it

**In Brand expressive:** The site sections.

- **Use it when:** The main sections of a website, sometimes with a panel of sub-links.
- **Not when:** App navigation that stays open (sidebar), or actions (dropdown menu).

Instead:

- [Sidebar](./sidebar.md): App navigation that stays open.
- [Tabs](./tabs.md): Views of one thing.

::card-grid{id="anatomy-link/navigation-menu"}

## Words

- Headlines are short and bold. Three to six words.
- Verbs that move: Join, Try, Go.
- Playful in headlines, plain in errors.
- Use: Join, Drop, Go, Love. Avoid: Synergy, Leverage, Kindly.

The labels components use, from the voice tokens:

- `content.action.commit`: Go
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Explore the drop

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

Navigation menu reads 57 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Navigation menu's tokens to change Navigation menu alone.

::token-table{component="navigation-menu"}
