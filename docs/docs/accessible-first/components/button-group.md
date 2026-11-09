---
composite_data: "./button-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 11
title: "Button group"
description: "Button group in Accessible first."
---

# Button group

Related buttons joined into one control.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="button-group/live"}

## When to use it

**In Accessible first:** A few related buttons, each with a word, and at most one primary. Not unrelated actions, and never icon-only.

- **Use it when:** A few actions that belong together, such as previous and next, or a split action.
- **Not when:** A choice that stays selected (toggle group), or unrelated actions.

Instead:

- [Toggle group](./toggle-group.md): The choice stays pressed.
- [Dropdown menu](./dropdown-menu.md): More actions than fit in a row.

::card-grid{id="anatomy-link/button-group"}

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

Test before you ship:

- [ ] The buttons are a group with a name. undefined

## Use it in code

```bash
npx open-ds add button-group
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Button group reads 11 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Button group's tokens to change Button group alone.

::token-table{component="button-group"}
