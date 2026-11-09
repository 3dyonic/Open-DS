---
composite_data: "./collapsible.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 17
title: "Collapsible"
description: "Collapsible in Accessible first."
---

# Collapsible

One section that opens and closes.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="collapsible/live"}

## When to use it

**In Accessible first:** Optional help a person can open.

- **Use it when:** A single block of extra detail people may want: more filters, advanced options.
- **Not when:** Several stacked sections (accordion), or content everyone needs.

Instead:

- [Accordion](./accordion.md): A stack of sections.

::card-grid{id="anatomy-link/collapsible"}

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
