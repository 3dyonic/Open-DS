---
composite_data: "./slider.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 54
title: "Slider"
description: "Slider in Content first."
sidebar_class_name: "ods-left-out"
---

# Slider

A value picked by dragging along a track, when an exact number is not needed.

:label[Left out of Content first]{tone="warning"} Readers need sections, navigation and little else. Actions are rare: subscribe, share, save. Dragging a value is not one of them. Use instead: [Input](./input)

## See it live

::preview{robot="slumber" id="slider/live"}

## When to use it

- **Use it when:** Volume, brightness, a rough range; pair with a number field when precision matters.
- **Not when:** An exact answer people must type.

Instead:

- [Input](./input.md): An exact number.
- [Radio group](./radio-group.md): A few named choices.

::card-grid{id="anatomy-link/slider"}

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
| undefined | Arrow keys change the value; Home and End jump to the ends. | undefined |

Test before you ship:

- [ ] It has a name and announces its value. undefined

## Use it in code

```bash
npx open-ds add slider
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Slider reads 17 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Slider's tokens to change Slider alone.

::token-table{component="slider"}
