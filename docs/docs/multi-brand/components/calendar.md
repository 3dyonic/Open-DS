---
composite_data: "./calendar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 12
title: "Calendar"
description: "Calendar in Multi-brand."
---

# Calendar

A month grid for picking a date or a range.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="calendar/live"}

## When to use it

**In Multi-brand:** A date near today or a range, shown at once, where the day of the week matters. Not a birth date; type it.

- **Use it when:** Dates near today, ranges, or when the day of the week matters.
- **Not when:** A date people know by heart, such as a birth date: typed fields are faster.

Instead:

- [Date picker](./date-picker.md): A calendar opened from a field, in a popover.
- [Input](./input.md): A known date typed in.

::card-grid{id="anatomy-link/calendar"}

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

See [Voice and tone](../voice.md) for the whole voice.

## Accessibility and keyboard

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Arrow keys move between days; Page Up and Page Down change month. | undefined |

Test before you ship:

- [ ] It is a grid; the selected and today's dates are announced. undefined

## Use it in code

```bash
npx open-ds add calendar
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Calendar reads 35 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Calendar's tokens to change Calendar alone.

::token-table{component="calendar"}

Its icons (`ChevronDown`, `ChevronLeft`, `ChevronRight`) also read `icon.stroke-width`, 1.5px in Multi-brand: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
