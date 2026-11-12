---
composite_data: "./spinner.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 55
title: "Spinner"
description: "Spinner in Accessible first."
---

# Spinner

A small indicator that work is in progress when the time is unknown.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="spinner/live"}

## When to use it

**In Accessible first:** Says that the page is working.

- **Use it when:** Fetching a panel or syncing, a wait that is not the button itself.
- **Not when:** A layout placeholder (skeleton), or known progress (progress).

Instead:

- [Skeleton](./skeleton.md): Keeps the final layout.
- [Progress](./progress.md): A known amount of work.

::card-grid{id="anatomy-link/spinner"}

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

Test before you ship:

- [ ] It has a name such as Loading and is announced politely. undefined

## Use it in code

```bash
npx open-ds add spinner
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Spinner reads 1 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Spinner's tokens to change Spinner alone.

::token-table{component="spinner"}

Its icons (`Loader2`) also read `icon.stroke-width`, 2px in Accessible first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
