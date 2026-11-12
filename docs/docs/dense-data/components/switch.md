---
composite_data: "./switch.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 56
title: "Switch"
description: "Switch in Dense data."
---

# Switch

An on or off setting that applies at once, with no submit.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="switch/live"}

## When to use it

**In Dense data:** Settings that apply at once.

- **Use it when:** A setting that should take effect as soon as it is flipped.
- **Not when:** A choice that waits for a form (checkbox).

Instead:

- [Checkbox](./checkbox.md): Waits for the form.
- [Toggle](./toggle.md): A pressed button in a toolbar.

::card-grid{id="anatomy-link/switch"}

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
| undefined | Space flips it. | undefined |

Test before you ship:

- [ ] It is a switch with a visible label; on and off are announced. undefined

## Use it in code

```bash
npx open-ds add switch
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Switch reads 18 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Switch's tokens to change Switch alone.

::token-table{component="switch"}
