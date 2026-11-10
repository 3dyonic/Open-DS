---
composite_data: "./pagination.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 42
title: "Pagination"
description: "Pagination in Dense data."
---

# Pagination

Moves between pages of results.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="pagination/live"}

## When to use it

**In Dense data:** Moves through long result sets.

- **Use it when:** A list or table split across pages.
- **Not when:** Steps of a task (progress).

Instead:

- [Progress](./progress.md): Steps of a task.
- [Table](./table.md): The rows being paged.

::card-grid{id="anatomy-link/pagination"}

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

- [ ] The current page is marked; previous and next have names. undefined

## Use it in code

```bash
npx open-ds add pagination
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Pagination reads 6 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Pagination's tokens to change Pagination alone.

::token-table{component="pagination"}
