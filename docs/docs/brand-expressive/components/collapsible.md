---
composite_data: "./collapsible.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 17
title: "Collapsible"
description: "Collapsible in Brand expressive."
---

# Collapsible

One section that opens and closes.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="collapsible/live"}

## When to use it

**In Brand expressive:** One block of extra detail people may skip. Not for a section's one big idea.

- **Use it when:** A single block of extra detail people may want: more filters, advanced options.
- **Not when:** Several stacked sections (accordion), or content everyone needs.

Instead:

- [Accordion](./accordion.md): A stack of sections.

::card-grid{id="anatomy-link/collapsible"}

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
