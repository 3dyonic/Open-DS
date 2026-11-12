---
composite_data: "./pagination.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 43
title: "Pagination"
description: "Pagination in Accessible first."
---

# Pagination

Moves between pages of results.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="pagination/live"}

## When to use it

**In Accessible first:** A long list or table split across pages, with large targets. Not for the steps of a form.

- **Use it when:** A list or table split across pages.
- **Not when:** Steps of a task (progress).

Instead:

- [Progress](./progress.md): Steps of a task.
- [Table](./table.md): The rows being paged.

::card-grid{id="anatomy-link/pagination"}

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

- [ ] The current page is marked; previous and next have names. undefined

## Use it in code

```bash
npx open-ds add pagination
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Pagination reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Pagination's tokens to change Pagination alone.

::token-table{component="pagination"}

Its icons (`ChevronLeft`, `ChevronRight`, `MoreHorizontal`) also read `icon.stroke-width`, 2px in Accessible first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
