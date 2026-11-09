---
composite_data: "./skeleton.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 52
title: "Skeleton"
description: "Skeleton in Dense data."
---

# Skeleton

Placeholder shapes that match the final layout, so the page does not jump when content arrives.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="skeleton/live"}

## When to use it

**In Dense data:** Rows while a table loads.

- **Use it when:** Lists, cards, dashboards and tables whose shape is known.
- **Not when:** A wait with no layout (spinner), or a region that loaded empty (empty).

Instead:

- [Spinner](./spinner.md): A wait with no layout.
- [Empty](./empty.md): Loaded, with nothing to show.

::card-grid{id="anatomy-link/skeleton"}

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

- [ ] The region says it is loading; the shapes themselves are hidden from screen readers. undefined

## Use it in code

```bash
npx open-ds add skeleton
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Skeleton reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Skeleton's tokens to change Skeleton alone.

::token-table{component="skeleton"}
