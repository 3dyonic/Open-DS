---
composite_data: "./tooltip.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 63
title: "Tooltip"
description: "Tooltip in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Tooltip

A short hint on hover or focus.

:label[Left out of Accessible first]{tone="warning"} Icons never stand alone here, so no control needs a hover hint. Touch screens never hover, and optional help sits in a section a person can open. Use instead: [Collapsible](./collapsible), [Label](./label)

## See it live

::preview{robot="slumber" id="tooltip/live"}

## When to use it

- **Use it when:** A brief name or hint for a control that already has an accessible name.
- **Not when:** The only place values or important words live, or touch screens, where hover never happens.

Instead:

- [Popover](./popover.md): Opens on click and works on touch.
- [Hover card](./hover-card.md): A richer preview.

::card-grid{id="anatomy-link/tooltip"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="An icon with no label"}
**Use** Not used: always add a word

**Not** An icon button

Icons alone are guesswork.
:::
::::

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

Tooltip reads 9 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Tooltip's tokens to change Tooltip alone.

::token-table{component="tooltip"}
