---
composite_data: "./collapsible.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 17
title: "Collapsible"
description: "Collapsible in Multi-brand."
---

# Collapsible

One section that opens and closes.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="collapsible/live"}

## When to use it

**In Multi-brand:** One block of extra detail on a form, such as more options. Not for frequent questions; accordion holds those.

- **Use it when:** A single block of extra detail people may want: more filters, advanced options.
- **Not when:** Several stacked sections (accordion), or content everyone needs.

Instead:

- [Accordion](./accordion.md): A stack of sections.

::card-grid{id="anatomy-link/collapsible"}

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
| undefined | Enter or Space opens and closes. | undefined |

Test before you ship:

- [ ] The trigger is a button that says whether it is open. undefined

## Use it in code

```bash
npx open-ds add collapsible
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Collapsible sets no colors, corners or shadows of its own; it takes them from the components inside it.
