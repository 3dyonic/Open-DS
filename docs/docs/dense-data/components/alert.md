---
composite_data: "./alert.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2
title: "Alert"
description: "Alert in Dense data."
---

# Alert

A message that stays on the page with the content it is about.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="alert/live"}

## When to use it

**In Dense data:** A problem that stays on the page.

- **Use it when:** People need to read a standing notice or how to recover, on this page, tied to what they are doing.
- **Not when:** A short confirmation that can go away by itself, or one notice for the whole site.

Instead:

- [Toast](./toast.md): Short, non-blocking, goes away.
- [Dialog](./dialog.md): Needs an answer before going on.
- Site banner: One full-width notice for the whole site.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Dense data" tone="neutral"}
::preview{id="alert/variant/default"}

**What it is for**

A notice that stays on the page: information or a heads-up.

- ✓ A note people should read but need not fix.
- ✕ Something failed and must be fixed.

**In Dense data**

Alerts here are for problems that stay on the page; news goes in a toast or a badge.

**Because**

- [What is a costly mistake? **Acting on the wrong record**](#why-outcomes-q2) · `outcomes.q2`
- [How often do people repeat actions? **Constantly**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="destructive" note="variant" label="Used in Dense data" tone="success"}
::preview{id="alert/variant/destructive"}

**What it is for**

Something failed or will be lost, and people must act to recover.

- ✓ An error, with what went wrong and how to fix it.
- ✕ A plain note dressed as danger for emphasis.

**In Dense data**

A record that was not saved or an action that failed: name the record, then the fix, with an icon.

**Because**

- [What is a costly mistake? **Acting on the wrong record**](#why-outcomes-q2) · `outcomes.q2`
- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [How does it sound? **Terse**](#why-voice-values) · `voice.values`
:::

::card-grid{id="anatomy-link/alert"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger with an icon

**Not** color.status.warning

Red always means fix this, and the icon says it without color.
:::
::::

## Why it works this way

Alert looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Alert, and what would move if it changed.

::reason-chain{id="alert/outcomes.q2"}

::reason-chain{id="alert/tasks.q2"}

::reason-chain{id="alert/accessibility.count"}

::reason-chain{id="alert/voice.values"}

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

- [ ] An error that appears after an action is announced (role alert); a standing note is not. undefined
- [ ] The tone also shows as an icon and words, never color alone. undefined

## Use it in code

```bash
npx open-ds add alert
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Alert reads 18 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Alert's tokens to change Alert alone.

::token-table{component="alert"}
