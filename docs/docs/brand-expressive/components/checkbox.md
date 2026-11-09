---
composite_data: "./checkbox.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 16
title: "Checkbox"
description: "Checkbox in Brand expressive."
---

# Checkbox

One or many independent on or off choices, usually sent with a form.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="checkbox/live"}

## When to use it

**In Brand expressive:** An optional extra in the sign-up form, such as a launch reminder. Not as a second action beside sign-up.

- **Use it when:** Agreeing, picking many, optional extras; the choice waits for the form.
- **Not when:** Exactly one of a short set (radio group), or a setting that applies at once (switch).

Instead:

- [Radio group](./radio-group.md): One choice only.
- [Switch](./switch.md): Applies at once.
- [Select](./select.md): Many options in a compact list.

::card-grid{id="anatomy-link/checkbox"}

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

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Space checks and unchecks. | undefined |

Test before you ship:

- [ ] Each checkbox has a visible label that is part of the hit area. undefined

## Use it in code

```bash
npx open-ds add checkbox
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Checkbox reads 12 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Checkbox's tokens to change Checkbox alone.

::token-table{component="checkbox"}
