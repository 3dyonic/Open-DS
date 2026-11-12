---
composite_data: "./checkbox.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 16
title: "Checkbox"
description: "Checkbox in Multi-brand."
---

# Checkbox

One or many independent on or off choices, usually sent with a form.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="checkbox/live"}

## When to use it

**In Multi-brand:** Terms and preferences.

- **Use it when:** Agreeing, picking many, optional extras; the choice waits for the form.
- **Not when:** Exactly one of a short set (radio group), or a setting that applies at once (switch).

Instead:

- [Radio group](./radio-group.md): One choice only.
- [Switch](./switch.md): Applies at once.
- [Select](./select.md): Many options in a compact list.

::card-grid{id="anatomy-link/checkbox"}

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
| undefined | Space checks and unchecks. | undefined |

Test before you ship:

- [ ] Each checkbox has a visible label that is part of the hit area. undefined

## Use it in code

```bash
npx open-ds add checkbox
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Checkbox reads 15 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Checkbox's tokens to change Checkbox alone.

::token-table{component="checkbox"}

Its icons (`Check`) also read `icon.stroke-width`, 1.5px in Multi-brand: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
