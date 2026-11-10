---
composite_data: "./spinner.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 55
title: "Spinner"
description: "Spinner in Brand expressive."
---

# Spinner

A small indicator that work is in progress when the time is unknown.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="spinner/live"}

## When to use it

**In Brand expressive:** A wait of unknown length that is not the button itself. Not for images; skeleton does that.

- **Use it when:** Fetching a panel or syncing, a wait that is not the button itself.
- **Not when:** A layout placeholder (skeleton), or known progress (progress).

Instead:

- [Skeleton](./skeleton.md): Keeps the final layout.
- [Progress](./progress.md): A known amount of work.

::card-grid{id="anatomy-link/spinner"}

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

- [ ] It has a name such as Loading and is announced politely. undefined

## Use it in code

```bash
npx open-ds add spinner
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Spinner reads 1 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Spinner's tokens to change Spinner alone.

::token-table{component="spinner"}
