---
composite_data: "./select.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 49
title: "Select"
description: "Select in Multi-brand."
---

# Select

One choice from a list, in a menu.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="select/live"}

## When to use it

**In Multi-brand:** Country and plan options.

- **Use it when:** Four or more options, a known closed list, or a setting with a default.
- **Not when:** Two to five options people should see (radio group), or many flags (checkboxes).

Instead:

- [Radio group](./radio-group.md): A short list shown at once.
- [Combobox](./combobox.md): Type to find in a long list.
- [Native select](./native-select.md): The system picker.

::card-grid{id="anatomy-link/select"}

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
| undefined | Arrows move; Enter picks; Escape closes. | undefined |

Test before you ship:

- [ ] It has a visible label; the chosen value is announced. undefined

## Use it in code

```bash
npx open-ds add select
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Select reads 37 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Select's tokens to change Select alone.

::token-table{component="select"}

Its icons (`Check`, `ChevronDown`) also read `icon.stroke-width`, 1.5px in Multi-brand: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
