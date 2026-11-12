---
composite_data: "./avatar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Avatar"
description: "Avatar in Content first."
---

# Avatar

A small image or initials that stand for a person or account.

:label[In Content first]{tone="info"}

## See it live

::preview{id="avatar/live"}

## When to use it

**In Content first:** The author of an article.

- **Use it when:** Showing who wrote, owns or is signed in, next to their name.
- **Not when:** The only way to tell people apart, or decoration with no person behind it.

Instead:

- [Badge](./badge.md): A status or count, not a person.

::card-grid{id="anatomy-link/avatar"}

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

- [ ] The person's name is in text nearby or in the image's alternative text; initials alone are not a name. undefined

## Use it in code

```bash
npx open-ds add avatar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Avatar reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Avatar's tokens to change Avatar alone.

::token-table{component="avatar"}
