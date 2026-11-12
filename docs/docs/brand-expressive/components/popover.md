---
composite_data: "./popover.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 44
title: "Popover"
description: "Popover in Brand expressive."
---

# Popover

Rich content in a floating panel, opened by click.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="popover/live"}

## When to use it

**In Brand expressive:** A product preview that opens on tap.

- **Use it when:** Extra detail or a small control next to what it explains, on any device.
- **Not when:** A one-line hint (tooltip), or a task that should block the page (dialog).

Instead:

- [Tooltip](./tooltip.md): A one-line hint on hover.
- [Dialog](./dialog.md): A blocking task.

::card-grid{id="anatomy-link/popover"}

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
| undefined | Escape closes it and returns focus. | undefined |

Test before you ship:

- [ ] The trigger says it opens a panel and whether it is open. undefined

## Use it in code

```bash
npx open-ds add popover
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Popover reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Popover's tokens to change Popover alone.

::token-table{component="popover"}
