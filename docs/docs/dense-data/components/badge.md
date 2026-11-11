---
composite_data: "./badge.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Badge"
description: "Badge in Dense data."
---

# Badge

A short label for a status, category or count, next to what it describes.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="badge/live"}

## When to use it

**In Dense data:** Alert status in rows.

- **Use it when:** A state people scan for in a list or table, or a small category label.
- **Not when:** A message people must read (alert or toast), or an action (a button).

Instead:

- [Alert](./alert.md): A message, not a label.
- [Button](./button.md): Something to press.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="badge/tone/neutral"}

**What it is for**

A label with no status meaning: a category, a count, a waiting state.

- ✓ Nothing is wrong and nothing needs doing.
- ✕ The state needs attention.

**In Dense data**

New and False positive: not triaged yet, or a finished outcome that is not a failure.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="info" note="tone" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="badge/tone/info"}

**What it is for**

News: worth knowing, nothing to act on.

- ✓ Something is happening or coming.
- ✕ Something is wrong or nearly wrong.

**In Dense data**

Investigating: an analyst is on it; news, nothing to act on.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="success" note="tone" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="badge/tone/success"}

**What it is for**

Done, healthy or paid.

- ✓ The outcome people wanted.
- ✕ A state that is only waiting.

**In Dense data**

Resolved: contained and closed.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="warning" note="tone" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="badge/tone/warning"}

**What it is for**

Needs attention soon; nothing has failed yet.

- ✓ A risk people can still act on.
- ✕ Something already failed.

**In Dense data**

Escalated: needs a senior analyst soon, still containable.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="danger" note="tone" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="badge/tone/danger"}

**What it is for**

Failed, blocked or lost; act now.

- ✓ A real failure or loss.
- ✕ Anything that is only unusual.

**In Dense data**

Breach confirmed: a real loss.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

::card-grid{id="anatomy-link/badge"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="A status"}
**Use** Badge with a subtle fill, an icon and a word

**Not** A full-strength fill

Subtle fills let many statuses share one table.
:::
:::panel{title="Shape of a status badge"}
**Use** radius.badge (rectangle)

**Not** A pill

Rectangles line up in a column.
:::
::::

## Why it works this way

Badge looks the way it does because of 2 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Badge, and what would move if it changed.

::reason-chain{id="badge/accessibility.count"}

::reason-chain{id="badge/content.q1"}

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

- [ ] The status is a word; color and icon add to it, never replace it. undefined

## Use it in code

```bash
npx open-ds add badge
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Badge reads 17 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Badge's tokens to change Badge alone.

::token-table{component="badge"}
