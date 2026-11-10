---
composite_data: "./breadcrumb.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 8
title: "Breadcrumb"
description: "Breadcrumb in Brand expressive."
---

# Breadcrumb

The trail of pages above this one, so people know where they are.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="breadcrumb/live"}

## When to use it

**In Brand expressive:** On a page below a site section, the way back up to it. Not on the launch page itself.

- **Use it when:** Deep structure where people may want to go up a level.
- **Not when:** Steps of a task (progress), or the main navigation.

Instead:

- [Progress](./progress.md): Steps of a task, not where a page sits.
- [Pagination](./pagination.md): Pages of a list, not levels.

::card-grid{id="anatomy-link/breadcrumb"}

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

- [ ] It is a navigation landmark, and the current page is marked as current. undefined

## Use it in code

```bash
npx open-ds add breadcrumb
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Breadcrumb reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Breadcrumb's tokens to change Breadcrumb alone.

::token-table{component="breadcrumb"}

Its icons (`ChevronRight`, `MoreHorizontal`) also read `icon.stroke-width`, 1.75px in Brand expressive: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
