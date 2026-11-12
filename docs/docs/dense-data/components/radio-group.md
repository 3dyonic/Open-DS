---
composite_data: "./radio-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 46
title: "Radio group"
description: "Radio group in Dense data."
---

# Radio group

One choice from a short list shown at once.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="radio-group/live"}

## When to use it

**In Dense data:** Picks one of two or three options, all visible at once.

- **Use it when:** Two to about five options where the answer is one of them.
- **Not when:** Many options (select), many answers (checkboxes), or a setting that applies at once (switch).

Instead:

- [Checkbox](./checkbox.md): More than one may be true.
- [Select](./select.md): The list is long.

::card-grid{id="anatomy-link/radio-group"}

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
| undefined | Arrow keys move the choice; Tab leaves the group. | undefined |

Test before you ship:

- [ ] The options are a group with a question as its name. undefined

## Use it in code

```bash
npx open-ds add radio-group
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Radio group reads 19 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Radio group's tokens to change Radio group alone.

::token-table{component="radio-group"}

Its icons (`Circle`) also read `icon.stroke-width`, 1.5px in Dense data: one rule gives every Lucide icon the scheme's stroke. See [Icon](./icon.md).
