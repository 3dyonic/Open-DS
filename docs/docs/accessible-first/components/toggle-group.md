---
composite_data: "./toggle-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 62
title: "Toggle group"
description: "Toggle group in Accessible first."
---

# Toggle group

A set of toggles where one or many stay pressed.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="toggle-group/live"}

## When to use it

**In Accessible first:** Switching a view between a few options, each with a word. Not a form answer, which uses a radio group.

- **Use it when:** Switching a view or a mode between a few options, such as list and grid.
- **Not when:** A form answer (radio group), or actions (button group).

Instead:

- [Radio group](./radio-group.md): An answer in a form.
- [Button group](./button-group.md): Actions, not a pressed choice.

::card-grid{id="anatomy-link/toggle-group"}

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
| undefined | Arrow keys move between toggles. | undefined |

Test before you ship:

- [ ] It is a group with a name; each toggle says whether it is pressed. undefined

## Use it in code

```bash
npx open-ds add toggle-group
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Toggle group reads 5 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Toggle group's tokens to change Toggle group alone.

::token-table{component="toggle-group"}
