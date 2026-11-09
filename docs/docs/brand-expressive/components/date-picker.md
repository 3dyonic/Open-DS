---
composite_data: "./date-picker.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 22
title: "Date picker"
description: "Date picker in Brand expressive."
---

# Date picker

A field-like button that opens a calendar for one date or a range.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="date-picker/live"}

## When to use it

**In Brand expressive:** On an event site, when visitors pick a date near today. Not for a date people know by heart.

- **Use it when:** Dates near today, ranges, or when the day of the week matters.
- **Not when:** A date people know by heart, such as a birth date: typed fields are faster.

Instead:

- [Calendar](./calendar.md): The calendar on its own, always shown.
- [Input](./input.md): A known date typed in.

::card-grid{id="anatomy-link/date-picker"}

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

- [ ] The button says the chosen date, not just Pick a date. undefined

## Use it in code

```bash
npx open-ds add date-picker
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Date picker reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Date picker's tokens to change Date picker alone.

::token-table{component="date-picker"}
