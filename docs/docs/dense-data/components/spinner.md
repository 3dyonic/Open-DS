---
composite_data: "./spinner.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 54
title: "Spinner"
description: "Spinner in Dense data."
---

# Spinner

A small indicator that work is in progress when the time is unknown.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="spinner/live"}

## When to use it

**In Dense data:** A wait while the record panel beside the table fetches. Not for table rows, which load with skeletons.

- **Use it when:** Fetching a panel or syncing, a wait that is not the button itself.
- **Not when:** A layout placeholder (skeleton), or known progress (progress).

Instead:

- [Skeleton](./skeleton.md): Keeps the final layout.
- [Progress](./progress.md): A known amount of work.

::card-grid{id="anatomy-link/spinner"}

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

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
