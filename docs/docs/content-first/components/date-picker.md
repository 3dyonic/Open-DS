---
composite_data: "./date-picker.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 22
title: "Date picker"
description: "Date picker in Content first."
sidebar_class_name: "ods-left-out"
---

# Date picker

A field-like button that opens a calendar for one date or a range.

:label[Left out of Content first]{tone="warning"} Readers need sections, navigation and little else. Actions are rare: subscribe, share, save. Picking a date or range is not one of them. Use instead: [Input](./input)

## See it live

::preview{id="date-picker/live"}

## When to use it

- **Use it when:** Dates near today, ranges, or when the day of the week matters.
- **Not when:** A date people know by heart, such as a birth date: typed fields are faster.

Instead:

- [Calendar](./calendar.md): The calendar on its own, always shown.
- [Input](./input.md): A known date typed in.

::card-grid{id="anatomy-link/date-picker"}

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

- [ ] The button says the chosen date, not just Pick a date. undefined

## Use it in code

```bash
npx open-ds add date-picker
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Date picker reads 2 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Date picker's tokens to change Date picker alone.

::token-table{component="date-picker"}

Its icons (`Calendar`) also read `icon.stroke-width`, 1.5px in Content first: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
