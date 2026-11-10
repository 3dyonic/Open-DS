---
composite_data: "./select.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 49
title: "Select"
description: "Select in Dense data."
---

# Select

One choice from a list, in a menu.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="select/live"}

## When to use it

**In Dense data:** Picks one value in filters and forms.

- **Use it when:** Four or more options, a known closed list, or a setting with a default.
- **Not when:** Two to five options people should see (radio group), or many flags (checkboxes).

Instead:

- [Radio group](./radio-group.md): A short list shown at once.
- [Combobox](./combobox.md): Type to find in a long list.
- [Native select](./native-select.md): The system picker.

::card-grid{id="anatomy-link/select"}

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
| undefined | Arrows move; Enter picks; Escape closes. | undefined |

Test before you ship:

- [ ] It has a visible label; the chosen value is announced. undefined

## Use it in code

```bash
npx open-ds add select
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Select reads 37 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Select's tokens to change Select alone.

::token-table{component="select"}
