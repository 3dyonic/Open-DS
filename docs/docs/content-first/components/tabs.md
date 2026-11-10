---
composite_data: "./tabs.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 57
title: "Tabs"
description: "Tabs in Content first."
---

# Tabs

Switches between views of the same thing on one page.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="tabs/live"}

## When to use it

**In Content first:** Views of the reading list, such as saved and finished. Not to move between site sections.

- **Use it when:** Related views of one object that people move between.
- **Not when:** Navigation to other pages (links), or steps of a task (progress).

Instead:

- [Accordion](./accordion.md): Stacked sections people can open together.
- [Navigation menu](./navigation-menu.md): Other pages.

::card-grid{id="anatomy-link/tabs"}

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
| undefined | Arrow keys move between tabs; Tab moves into the panel. | undefined |

Test before you ship:

- [ ] It is a tablist; the selected tab owns its panel. undefined

## Use it in code

```bash
npx open-ds add tabs
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Tabs reads 17 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Tabs's tokens to change Tabs alone.

::token-table{component="tabs"}
