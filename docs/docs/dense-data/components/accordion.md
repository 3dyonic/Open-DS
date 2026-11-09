---
composite_data: "./accordion.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 1
title: "Accordion"
description: "Accordion in Dense data."
---

# Accordion

Stacked sections that expand and collapse without leaving the page.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="accordion/live"}

## When to use it

**In Dense data:** Optional detail on one record that analysts may skip. Not for fields they use every day, and not in the queue.

- **Use it when:** Optional detail, questions and answers, grouped content people may skip.
- **Not when:** A decision that blocks the page, a side panel, or a hint on hover.

Instead:

- [Tabs](./tabs.md): Peer views of the same thing, one at a time.
- [Collapsible](./collapsible.md): A single section, not a stack.
- [Dialog](./dialog.md): A blocking decision.

::card-grid{id="anatomy-link/accordion"}

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
| undefined | Enter or Space opens and closes the focused section. | undefined |

Test before you ship:

- [ ] Each header is a button inside a heading and says whether it is open. undefined

## Use it in code

```bash
npx open-ds add accordion
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Accordion reads 18 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Accordion's tokens to change Accordion alone.

::token-table{component="accordion"}
