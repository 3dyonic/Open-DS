---
composite_data: "./button-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 11
title: "Button group"
description: "Button group in Multi-brand."
---

# Button group

Related buttons joined into one control.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="button-group/live"}

## When to use it

**In Multi-brand:** A few related actions that belong together, such as previous and next. Not two primaries; one clear action per view.

- **Use it when:** A few actions that belong together, such as previous and next, or a split action.
- **Not when:** A choice that stays selected (toggle group), or unrelated actions.

Instead:

- [Toggle group](./toggle-group.md): The choice stays pressed.
- [Dropdown menu](./dropdown-menu.md): More actions than fit in a row.

::card-grid{id="anatomy-link/button-group"}

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
