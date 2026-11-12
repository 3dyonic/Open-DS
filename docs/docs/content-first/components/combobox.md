---
composite_data: "./combobox.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 18
title: "Combobox"
description: "Combobox in Content first."
sidebar_class_name: "ods-left-out"
---

# Combobox

A text field that suggests and completes matches from a known list as people type.

:label[Left out of Content first]{tone="warning"} Readers need sections, navigation and little else. Actions are rare: subscribe, share, save. The catalogue rules combobox out for searching a whole site; search is a plain input. Use instead: [Input](./input)

## See it live

::preview{robot="slumber" id="combobox/live"}

## When to use it

- **Use it when:** A long, closed list: countries, addresses, people, tags.
- **Not when:** Searching a whole site, or a short list people can see at once.

Instead:

- [Select](./select.md): A compact closed list without typing.
- [Command](./command.md): A search-first menu of actions.

::card-grid{id="anatomy-link/combobox"}

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
| undefined | Arrow keys move through suggestions; Enter picks; Escape closes. | undefined |

Test before you ship:

- [ ] It is a combobox; the open state and the active option are announced. undefined

## Use it in code

```bash
npx open-ds add combobox
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Combobox reads 71 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Combobox's tokens to change Combobox alone.

::token-table{component="combobox"}

Its icons (`Check`, `ChevronDown`, `X`) also read `icon.stroke-width`, 1.5px in Content first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
