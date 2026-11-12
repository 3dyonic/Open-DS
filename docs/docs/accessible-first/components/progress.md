---
composite_data: "./progress.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 45
title: "Progress"
description: "Progress in Accessible first."
---

# Progress

How far a task has come.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="progress/live"}

## When to use it

**In Accessible first:** Shows how far through the steps a person is.

- **Use it when:** A known amount of work: an upload, steps of a form.
- **Not when:** A wait of unknown length (spinner), or a layout placeholder (skeleton).

Instead:

- [Spinner](./spinner.md): A wait of unknown length.
- [Skeleton](./skeleton.md): Content that has not arrived.

::card-grid{id="anatomy-link/progress"}

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

- [ ] It reports its value and has a name. undefined

## Use it in code

```bash
npx open-ds add progress
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Progress reads 3 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Progress's tokens to change Progress alone.

::token-table{component="progress"}
