---
composite_data: "./avatar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Avatar"
description: "Avatar in Brand expressive."
---

# Avatar

A small image or initials that stand for a person or account.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="avatar/live"}

## When to use it

**In Brand expressive:** Faces in quotes from customers.

- **Use it when:** Showing who wrote, owns or is signed in, next to their name.
- **Not when:** The only way to tell people apart, or decoration with no person behind it.

Instead:

- [Badge](./badge.md): A status or count, not a person.

::card-grid{id="anatomy-link/avatar"}

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

- [ ] The person's name is in text nearby or in the image's alternative text; initials alone are not a name. undefined

## Use it in code

```bash
npx open-ds add avatar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Avatar reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Avatar's tokens to change Avatar alone.

::token-table{component="avatar"}
