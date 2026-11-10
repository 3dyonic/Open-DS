---
composite_data: "./combobox.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 18
title: "Combobox"
description: "Combobox in Accessible first."
---

# Combobox

A text field that suggests and completes matches from a known list as people type.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="combobox/live"}

## When to use it

**In Accessible first:** A long closed list, such as countries or addresses, with a label and a hint. Not a short list people can see.

- **Use it when:** A long, closed list: countries, addresses, people, tags.
- **Not when:** Searching a whole site, or a short list people can see at once.

Instead:

- [Select](./select.md): A compact closed list without typing.
- [Command](./command.md): A search-first menu of actions.

::card-grid{id="anatomy-link/combobox"}

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
| undefined | Arrow keys move through suggestions; Enter picks; Escape closes. | undefined |

Test before you ship:

- [ ] It is a combobox; the open state and the active option are announced. undefined

## Use it in code

```bash
npx open-ds add combobox
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Combobox reads 67 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Combobox's tokens to change Combobox alone.

::token-table{component="combobox"}
