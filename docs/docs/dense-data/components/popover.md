---
composite_data: "./popover.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 44
title: "Popover"
description: "Popover in Dense data."
---

# Popover

Rich content in a floating panel, opened by click.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="popover/live"}

## When to use it

**In Dense data:** Filters next to the column.

- **Use it when:** Extra detail or a small control next to what it explains, on any device.
- **Not when:** A one-line hint (tooltip), or a task that should block the page (dialog).

Instead:

- [Tooltip](./tooltip.md): A one-line hint on hover.
- [Dialog](./dialog.md): A blocking task.

::card-grid{id="anatomy-link/popover"}

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

See [Voice and tone](../voice.md) for the whole voice.

## Accessibility and keyboard

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Escape closes it and returns focus. | undefined |

Test before you ship:

- [ ] The trigger says it opens a panel and whether it is open. undefined

## Use it in code

```bash
npx open-ds add popover
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Popover reads 13 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Popover's tokens to change Popover alone.

::token-table{component="popover"}
