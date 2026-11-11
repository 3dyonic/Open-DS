---
composite_data: "./accordion.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1
title: "Accordion"
description: "Accordion in Content first."
---

# Accordion

Stacked sections that expand and collapse without leaving the page.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="accordion/live"}

## When to use it

**In Content first:** Questions and answers in guides.

- **Use it when:** Optional detail, questions and answers, grouped content people may skip.
- **Not when:** A decision that blocks the page, a side panel, or a hint on hover.

Instead:

- [Tabs](./tabs.md): Peer views of the same thing, one at a time.
- [Collapsible](./collapsible.md): A single section, not a stack.
- [Dialog](./dialog.md): A blocking decision.

::card-grid{id="anatomy-link/accordion"}

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
| undefined | Enter or Space opens and closes the focused section. | undefined |

Test before you ship:

- [ ] Each header is a button inside a heading and says whether it is open. undefined

## Use it in code

```bash
npx open-ds add accordion
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Accordion reads 18 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Accordion's tokens to change Accordion alone.

::token-table{component="accordion"}

Its icons (`ChevronDown`) also read `icon.stroke-width`, 1.5px in Content first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
