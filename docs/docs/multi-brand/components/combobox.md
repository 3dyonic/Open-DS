---
composite_data: "./combobox.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 18
title: "Combobox"
description: "Combobox in Multi-brand."
---

# Combobox

A text field that suggests and completes matches from a known list as people type.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="combobox/live"}

## When to use it

**In Multi-brand:** A long closed list such as country, matched as the customer types. Not for plan options, a short list that select covers.

- **Use it when:** A long, closed list: countries, addresses, people, tags.
- **Not when:** Searching a whole site, or a short list people can see at once.

Instead:

- [Select](./select.md): A compact closed list without typing.
- [Command](./command.md): A search-first menu of actions.

::card-grid{id="anatomy-link/combobox"}

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

Its icons (`Check`, `ChevronDown`, `X`) also read `icon.stroke-width`, 1.5px in Multi-brand: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
