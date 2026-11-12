---
composite_data: "./skeleton.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 53
title: "Skeleton"
description: "Skeleton in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Skeleton

Placeholder shapes that match the final layout, so the page does not jump when content arrives.

:label[Left out of Accessible first]{tone="warning"} Spinner already says the page is working. Accessible first keeps one clear way to do each thing, so a second loading state is not added. Use instead: [Spinner](./spinner)

## See it live

::preview{id="skeleton/live"}

## When to use it

- **Use it when:** Lists, cards, dashboards and tables whose shape is known.
- **Not when:** A wait with no layout (spinner), or a region that loaded empty (empty).

Instead:

- [Spinner](./spinner.md): A wait with no layout.
- [Empty](./empty.md): Loaded, with nothing to show.

::card-grid{id="anatomy-link/skeleton"}

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

- [ ] The region says it is loading; the shapes themselves are hidden from screen readers. undefined

## Use it in code

```bash
npx open-ds add skeleton
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Skeleton reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Skeleton's tokens to change Skeleton alone.

::token-table{component="skeleton"}
