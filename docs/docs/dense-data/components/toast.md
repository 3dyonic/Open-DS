---
composite_data: "./toast.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 59
title: "Toast"
description: "Toast in Dense data."
---

# Toast

A short message that confirms an action and goes away.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="toast/live"}

## When to use it

**In Dense data:** Confirms a saved change.

- **Use it when:** Saved, sent, exported: something people should notice without stopping.
- **Not when:** A failure people must understand (alert or dialog), or a notice that stays (alert).

Instead:

- [Alert](./alert.md): Stays on the page.
- [Dialog](./dialog.md): Needs an answer.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Dense data" tone="success"}
::preview{id="toast/tone/neutral"}

**What it is for**

A plain confirmation.

- ✓ Something changed: cleared, copied, moved.
- ✕ Something failed.

**In Dense data**

A plain confirmation: Filters cleared.

**Because**

- [How does it sound? **Terse**](#why-voice-values) · `voice.values`
:::

:::panel{title="success" note="tone" label="Used in Dense data" tone="success"}
::preview{id="toast/tone/success"}

**What it is for**

Confirms that something people care about worked.

- ✓ Exported, paid, joined.
- ✕ A routine change that needs no celebration.

**In Dense data**

A short confirmation with the count: 12 alerts exported.

**Because**

- [How does it sound? **Terse**](#why-voice-values) · `voice.values`
- [How often do people repeat actions? **Constantly**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="danger" note="tone" label="Used in Dense data" tone="success"}
::preview{id="toast/tone/danger"}

**What it is for**

Something failed in the background.

- ✓ What failed and how to fix it, when it can wait for people's attention.
- ✕ A failure that blocks the task: use an alert or a dialog.

**In Dense data**

A background failure: name the record, then the fix.

**Because**

- [How does it sound? **Terse**](#why-voice-values) · `voice.values`
- [Where do the words matter most? **Errors and empty states**](#why-voice-lands) · `voice.lands`
- [What is a costly mistake? **Acting on the wrong record**](#why-outcomes-q2) · `outcomes.q2`
:::

::card-grid{id="anatomy-link/toast"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="The words of an error"}
**Use** Name the record, then the fix. Flat and specific.

**Not** "Oops" or a vague apology

Experts act on the message; the record and the fix are all they need. Example: “Alert ALR-2042 not saved. Threshold must be between 0 and 100.”
:::
:::panel{title="A success message"}
**Use** A short confirmation with the count

**Not** Celebration

Confirm and get out of the way; the next task is waiting. Example: “12 alerts exported.”
:::
::::

## Why it works this way

Toast looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Toast, and what would move if it changed.

::reason-chain{id="toast/voice.values"}

::reason-chain{id="toast/tasks.q2"}

::reason-chain{id="toast/voice.lands"}

::reason-chain{id="toast/outcomes.q2"}

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

Test before you ship:

- [ ] It is announced politely without taking focus, and stays long enough to read. undefined
- [ ] Nothing people must act on lives only in a toast. undefined

## Use it in code

```bash
npx open-ds add toast
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Toast reads 17 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Toast's tokens to change Toast alone.

::token-table{component="toast"}
