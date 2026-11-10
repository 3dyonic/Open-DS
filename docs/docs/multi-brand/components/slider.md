---
composite_data: "./slider.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 53
title: "Slider"
description: "Slider in Multi-brand."
---

# Slider

A value picked by dragging along a track, when an exact number is not needed.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="slider/live"}

## When to use it

**In Multi-brand:** A rough value where an exact number is not needed, paired with a number field. Not for picking a plan; radio-group does that.

- **Use it when:** Volume, brightness, a rough range; pair with a number field when precision matters.
- **Not when:** An exact answer people must type.

Instead:

- [Input](./input.md): An exact number.
- [Radio group](./radio-group.md): A few named choices.

::card-grid{id="anatomy-link/slider"}

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

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Arrow keys change the value; Home and End jump to the ends. | undefined |

Test before you ship:

- [ ] It has a name and announces its value. undefined

## Use it in code

```bash
npx open-ds add slider
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Slider reads 15 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Slider's tokens to change Slider alone.

::token-table{component="slider"}
