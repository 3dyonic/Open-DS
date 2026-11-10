---
composite_data: "./pagination.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 42
title: "Pagination"
description: "Pagination in Content first."
---

# Pagination

Moves between pages of results.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="pagination/live"}

## When to use it

**In Content first:** Moves through article lists.

- **Use it when:** A list or table split across pages.
- **Not when:** Steps of a task (progress).

Instead:

- [Progress](./progress.md): Steps of a task.
- [Table](./table.md): The rows being paged.

::card-grid{id="anatomy-link/pagination"}

## Words

- Write to one person: "you", not "users".
- Short sentences with room to breathe.
- Explain why before asking for anything.
- Use: Read, Save for later, You, Next issue. Avoid: Click here, Submit, Users, Content.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Browse guides

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
