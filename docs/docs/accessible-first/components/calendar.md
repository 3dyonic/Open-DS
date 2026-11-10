---
composite_data: "./calendar.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 12
title: "Calendar"
description: "Calendar in Accessible first."
---

# Calendar

A month grid for picking a date or a range.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="calendar/live"}

## When to use it

**In Accessible first:** Dates near today, such as a health appointment. Not a date people know by heart, like a birth date.

- **Use it when:** Dates near today, ranges, or when the day of the week matters.
- **Not when:** A date people know by heart, such as a birth date: typed fields are faster.

Instead:

- [Date picker](./date-picker.md): A calendar opened from a field, in a popover.
- [Input](./input.md): A known date typed in.

::card-grid{id="anatomy-link/calendar"}

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
