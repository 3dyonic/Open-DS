---
composite_data: "./input-otp.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 32
title: "Input otp"
description: "Input otp in Brand expressive."
---

# Input otp

Separate boxes for a one-time code.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="input-otp/live"}

## When to use it

**In Brand expressive:** A short code sent by text or email, typed or pasted. Not for passwords or other values.

- **Use it when:** A short code sent by text or email, typed or pasted.
- **Not when:** Passwords or any value that is not a fixed-length code.

Instead:

- [Input](./input.md): Any other short value.

::card-grid{id="anatomy-link/input-otp"}

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

- [ ] Screen readers hear one field with a label, and pasting the whole code works. undefined

## Use it in code

```bash
npx open-ds add input-otp
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Input otp reads 24 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Input otp's tokens to change Input otp alone.

::token-table{component="input-otp"}
