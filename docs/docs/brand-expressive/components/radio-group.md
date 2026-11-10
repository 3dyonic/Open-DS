---
composite_data: "./radio-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 46
title: "Radio group"
description: "Radio group in Brand expressive."
---

# Radio group

One choice from a short list shown at once.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="radio-group/live"}

## When to use it

**In Brand expressive:** One answer from two to five options in a form. Not as a second action beside sign-up.

- **Use it when:** Two to about five options where the answer is one of them.
- **Not when:** Many options (select), many answers (checkboxes), or a setting that applies at once (switch).

Instead:

- [Checkbox](./checkbox.md): More than one may be true.
- [Select](./select.md): The list is long.

::card-grid{id="anatomy-link/radio-group"}

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
| undefined | Arrow keys move the choice; Tab leaves the group. | undefined |

Test before you ship:

- [ ] The options are a group with a question as its name. undefined

## Use it in code

```bash
npx open-ds add radio-group
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Radio group reads 16 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Radio group's tokens to change Radio group alone.

::token-table{component="radio-group"}
