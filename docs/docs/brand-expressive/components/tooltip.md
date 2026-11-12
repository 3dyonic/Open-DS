---
composite_data: "./tooltip.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 63
title: "Tooltip"
description: "Tooltip in Brand expressive."
sidebar_class_name: "ods-left-out"
---

# Tooltip

A short hint on hover or focus.

:label[Left out of Brand expressive]{tone="warning"} Visitors come from social posts on their phones, where hover hints never show. Every button has a word instead. Use instead: [Button](./button), [Popover](./popover)

## See it live

::preview{robot="slumber" id="tooltip/live"}

## When to use it

- **Use it when:** A brief name or hint for a control that already has an accessible name.
- **Not when:** The only place values or important words live, or touch screens, where hover never happens.

Instead:

- [Popover](./popover.md): Opens on click and works on touch.
- [Hover card](./hover-card.md): A richer preview.

::card-grid{id="anatomy-link/tooltip"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Not used: always add a word

**Not** An icon button with a hover hint

On phones, hover hints never show; a word says what will happen.
:::
::::

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
