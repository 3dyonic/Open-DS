---
composite_data: "./date-picker.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 22
title: "Date picker"
description: "Date picker in Accessible first."
---

# Date picker

A field-like button that opens a calendar for one date or a range.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="date-picker/live"}

## When to use it

**In Accessible first:** A date near today, such as a health appointment. Not a birth date or other known date.

- **Use it when:** Dates near today, ranges, or when the day of the week matters.
- **Not when:** A date people know by heart, such as a birth date: typed fields are faster.

Instead:

- [Calendar](./calendar.md): The calendar on its own, always shown.
- [Input](./input.md): A known date typed in.

::card-grid{id="anatomy-link/date-picker"}

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

- [ ] The button says the chosen date, not just Pick a date. undefined

## Use it in code

```bash
npx open-ds add date-picker
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Date picker reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Date picker's tokens to change Date picker alone.

::token-table{component="date-picker"}

Its icons (`Calendar`) also read `icon.stroke-width`, 2px in Accessible first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
