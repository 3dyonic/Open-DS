---
composite_data: "./avatar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Avatar"
description: "Avatar in Dense data."
---

# Avatar

A small image or initials that stand for a person or account.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="avatar/live"}

## When to use it

**In Dense data:** Next to a user's name when assigning an alert or picking a user. Not without the name beside it, and not as decoration.

- **Use it when:** Showing who wrote, owns or is signed in, next to their name.
- **Not when:** The only way to tell people apart, or decoration with no person behind it.

Instead:

- [Badge](./badge.md): A status or count, not a person.

::card-grid{id="anatomy-link/avatar"}

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

- [ ] The person's name is in text nearby or in the image's alternative text; initials alone are not a name. undefined

## Use it in code

```bash
npx open-ds add avatar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Avatar reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Avatar's tokens to change Avatar alone.

::token-table{component="avatar"}
