---
composite_data: "./breadcrumb.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 8
title: "Breadcrumb"
description: "Breadcrumb in Accessible first."
---

# Breadcrumb

The trail of pages above this one, so people know where they are.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="breadcrumb/live"}

## When to use it

**In Accessible first:** Shows where a person is in the service.

- **Use it when:** Deep structure where people may want to go up a level.
- **Not when:** Steps of a task (progress), or the main navigation.

Instead:

- [Progress](./progress.md): Steps of a task, not where a page sits.
- [Pagination](./pagination.md): Pages of a list, not levels.

::card-grid{id="anatomy-link/breadcrumb"}

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

- [ ] It is a navigation landmark, and the current page is marked as current. undefined

## Use it in code

```bash
npx open-ds add breadcrumb
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Breadcrumb reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Breadcrumb's tokens to change Breadcrumb alone.

::token-table{component="breadcrumb"}
