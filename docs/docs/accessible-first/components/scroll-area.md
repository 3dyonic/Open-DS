---
composite_data: "./scroll-area.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 48
title: "Scroll area"
description: "Scroll area in Accessible first."
---

# Scroll area

A region with its own styled scrollbars.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="scroll-area/live"}

## When to use it

**In Accessible first:** A fixed-height list or panel inside a page that still works at 200% zoom. Not the whole page.

- **Use it when:** A fixed-height list or panel inside a larger page.
- **Not when:** The whole page: let the page scroll.

Instead:

- [Message scroller](./message-scroller.md): A conversation that keeps the newest in view.

::card-grid{id="anatomy-link/scroll-area"}

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
| undefined | The region can be focused and scrolled with the keyboard. | undefined |



## Use it in code

```bash
npx open-ds add scroll-area
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Scroll area reads 7 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Scroll area's tokens to change Scroll area alone.

::token-table{component="scroll-area"}
