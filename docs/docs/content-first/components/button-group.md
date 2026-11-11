---
composite_data: "./button-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 11
title: "Button group"
description: "Button group in Content first."
sidebar_class_name: "ods-left-out"
---

# Button group

Related buttons joined into one control.

:label[Left out of Content first]{tone="warning"} Content first keeps one clear action per section, and alternatives are text links so they do not compete. Joined buttons work against that. Use instead: [Button](./button), [Pagination](./pagination)

## See it live

::preview{robot="slumber" id="button-group/live"}

## When to use it

- **Use it when:** A few actions that belong together, such as previous and next, or a split action.
- **Not when:** A choice that stays selected (toggle group), or unrelated actions.

Instead:

- [Toggle group](./toggle-group.md): The choice stays pressed.
- [Dropdown menu](./dropdown-menu.md): More actions than fit in a row.

::card-grid{id="anatomy-link/button-group"}

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
