---
composite_data: "./switch.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 56
title: "Switch"
description: "Switch in Multi-brand."
---

# Switch

An on or off setting that applies at once, with no submit.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="switch/live"}

## When to use it

**In Multi-brand:** Account settings.

- **Use it when:** A setting that should take effect as soon as it is flipped.
- **Not when:** A choice that waits for a form (checkbox).

Instead:

- [Checkbox](./checkbox.md): Waits for the form.
- [Toggle](./toggle.md): A pressed button in a toolbar.

::card-grid{id="anatomy-link/switch"}

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
| undefined | Space flips it. | undefined |

Test before you ship:

- [ ] It is a switch with a visible label; on and off are announced. undefined

## Use it in code

```bash
npx open-ds add switch
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Switch reads 18 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Switch's tokens to change Switch alone.

::token-table{component="switch"}
