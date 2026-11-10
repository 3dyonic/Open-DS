---
composite_data: "./progress.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 44
title: "Progress"
description: "Progress in Brand expressive."
---

# Progress

How far a task has come.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="progress/live"}

## When to use it

**In Brand expressive:** A known amount of work, such as an upload. Not for images loading; skeleton does that.

- **Use it when:** A known amount of work: an upload, steps of a form.
- **Not when:** A wait of unknown length (spinner), or a layout placeholder (skeleton).

Instead:

- [Spinner](./spinner.md): A wait of unknown length.
- [Skeleton](./skeleton.md): Content that has not arrived.

::card-grid{id="anatomy-link/progress"}

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
