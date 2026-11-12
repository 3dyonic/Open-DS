---
composite_data: "./tooltip.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 63
title: "Tooltip"
description: "Tooltip in Content first."
sidebar_class_name: "ods-left-out"
---

# Tooltip

A short hint on hover or focus.

:label[Left out of Content first]{tone="warning"} Readers arrive on any device, and on touch screens hover hints never show. Icons always carry a visible word instead. Use instead: [Button](./button), [Label](./label)

## See it live

::preview{id="tooltip/live"}

## When to use it

- **Use it when:** A brief name or hint for a control that already has an accessible name.
- **Not when:** The only place values or important words live, or touch screens, where hover never happens.

Instead:

- [Popover](./popover.md): Opens on click and works on touch.
- [Hover card](./hover-card.md): A richer preview.

::card-grid{id="anatomy-link/tooltip"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Not used: always add a word

**Not** An icon button

Occasional visitors do not know icons.
:::
::::

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
| undefined | Escape hides it. | undefined |

Test before you ship:

- [ ] It describes its trigger and also shows on keyboard focus. undefined

## Use it in code

```bash
npx open-ds add tooltip
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Tooltip reads 12 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Tooltip's tokens to change Tooltip alone.

::token-table{component="tooltip"}
