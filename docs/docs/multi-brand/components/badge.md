---
composite_data: "./badge.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Badge"
description: "Badge in Multi-brand."
---

# Badge

A short label for a status, category or count, next to what it describes.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="badge/live"}

## When to use it

**In Multi-brand:** Plan and status labels.

- **Use it when:** A state people scan for in a list or table, or a small category label.
- **Not when:** A message people must read (alert or toast), or an action (a button).

Instead:

- [Alert](./alert.md): A message, not a label.
- [Button](./button.md): Something to press.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Multi-brand" tone="success"}
::preview{id="badge/tone/neutral"}

**What it is for**

A label with no status meaning: a category, a count, a waiting state.

- ✓ Nothing is wrong and nothing needs doing.
- ✕ The state needs attention.

**In Multi-brand**

Trial: the plan works and billing has not started.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="info" note="tone" label="Used in Multi-brand" tone="success"}
::preview{id="badge/tone/info"}

**What it is for**

News: worth knowing, nothing to act on.

- ✓ Something is happening or coming.
- ✕ Something is wrong or nearly wrong.

**In Multi-brand**

Renews in 3 days: a payment is coming; nothing has gone wrong.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="success" note="tone" label="Used in Multi-brand" tone="success"}
::preview{id="badge/tone/success"}

**What it is for**

Done, healthy or paid.

- ✓ The outcome people wanted.
- ✕ A state that is only waiting.

**In Multi-brand**

Active: the plan is paid and running.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="warning" note="tone" label="Not used in Multi-brand" tone="neutral"}
::preview{id="badge/tone/warning"}

**What it is for**

Needs attention soon; nothing has failed yet.

- ✓ A risk people can still act on.
- ✕ Something already failed.

**In Multi-brand**

No plan or order state sits between running and failed; a coming renewal is news, not a warning.

**Because**

- [What is the main content? **Forms and tasks**](#why-content-q1) · `content.q1`
- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="danger" note="tone" label="Used in Multi-brand" tone="success"}
::preview{id="badge/tone/danger"}

**What it is for**

Failed, blocked or lost; act now.

- ✓ A real failure or loss.
- ✕ Anything that is only unusual.

**In Multi-brand**

Card declined: the payment failed, so the plan will stop.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
- [What is a costly mistake? **Looking off-brand**](#why-outcomes-q2) · `outcomes.q2`
:::

::card-grid{id="anatomy-link/badge"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="A status"}
**Use** Badge with a word

**Not** A brand color as status

Brand hues vary, so meaning needs a word.
:::
:::panel{title="Shape of a status badge"}
**Use** radius.badge (set by the brand)

**Not** A hard-coded shape

The brand sets the badge shape.
:::
::::

## Why it works this way

Badge looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Badge, and what would move if it changed.

::reason-chain{id="badge/accessibility.count"}

::reason-chain{id="badge/content.q1"}

::reason-chain{id="badge/outcomes.q2"}

## Words

- Shared structure: object, state, next step.
- Brand tone lives in headlines and marketing copy, not in errors.
- Errors and confirmations read the same in every brand.
- Use: Get started, Plan, Order. Avoid: Brand-specific words in errors, Jargon.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Get started

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
