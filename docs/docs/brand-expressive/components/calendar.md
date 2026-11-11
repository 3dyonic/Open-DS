---
composite_data: "./calendar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 12
title: "Calendar"
description: "Calendar in Brand expressive."
---

# Calendar

A month grid for picking a date or a range.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="calendar/live"}

## When to use it

**In Brand expressive:** Inside a popover on an event site, when visitors pick a date near today. Not always shown in a section.

- **Use it when:** Dates near today, ranges, or when the day of the week matters.
- **Not when:** A date people know by heart, such as a birth date: typed fields are faster.

Instead:

- [Date picker](./date-picker.md): A calendar opened from a field, in a popover.
- [Input](./input.md): A known date typed in.

::card-grid{id="anatomy-link/calendar"}

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

Its icons (`ChevronDown`, `ChevronLeft`, `ChevronRight`) also read `icon.stroke-width`, 1.75px in Brand expressive: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
