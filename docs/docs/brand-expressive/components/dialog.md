---
composite_data: "./dialog.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 23
title: "Dialog"
description: "Dialog in Brand expressive."
---

# Dialog

A window over the page that takes attention until people finish or close it.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="dialog/live"}

## When to use it

**In Brand expressive:** The waitlist form over the page.

- **Use it when:** People must decide or finish something before going back: a short form, an important choice.
- **Not when:** A short status (toast), extra detail on the page (accordion), or a side panel that should not block the page (sheet).

Instead:

- [Sheet](./sheet.md): A side panel; the page stays in view.
- [Toast](./toast.md): Does not interrupt.
- [Alert dialog](./alert-dialog.md): Confirms something that cannot be undone.

::card-grid{id="anatomy-link/dialog"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="A menu or dialog"}
**Use** elevation.overlay and a dimmed page

**Not** No shadow

Strong depth shows a menu or dialog sits above vivid sections. Without a shadow it blends into the color blocks.
:::
::::

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
| undefined | Escape closes it. | undefined |
| undefined | Tab stays inside while it is open. | undefined |

Test before you ship:

- [ ] It is a dialog with a title; the page behind is hidden from screen readers. undefined
- [ ] Focus moves in when it opens and back to the trigger when it closes. undefined

## Use it in code

```bash
npx open-ds add dialog
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Dialog reads 25 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Dialog's tokens to change Dialog alone.

::token-table{component="dialog"}
