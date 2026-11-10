---
composite_data: "./badge.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Badge"
description: "Badge in Accessible first."
---

# Badge

A short label for a status, category or count, next to what it describes.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="badge/live"}

## When to use it

**In Accessible first:** A status label with an icon and a word, in a clear rectangle. Not color alone, and not a pill.

- **Use it when:** A state people scan for in a list or table, or a small category label.
- **Not when:** A message people must read (alert or toast), or an action (a button).

Instead:

- [Alert](./alert.md): A message, not a label.
- [Button](./button.md): Something to press.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="badge/tone/neutral"}

**What it is for**

A label with no status meaning: a category, a count, a waiting state.

- ✓ Nothing is wrong and nothing needs doing.
- ✕ The state needs attention.

**In Accessible first**

A waiting state, such as an application saved to resume later, with an icon and a word.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [How long is one visit? **One sitting**](#why-scenarios-q2) · `scenarios.q2`
:::

:::panel{title="info" note="tone" label="Not used in Accessible first" tone="neutral"}
::preview{robot="slumber" id="badge/tone/info"}

**What it is for**

News: worth knowing, nothing to act on.

- ✓ Something is happening or coming.
- ✕ Something is wrong or nearly wrong.

**In Accessible first**

Neutral covers news with nothing to do: one clear way to do each thing.

**Because**

- [When does a component get another look? **Only when the meaning changes**](#why-components-values) · `components.values`
:::

:::panel{title="success" note="tone" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="badge/tone/success"}

**What it is for**

Done, healthy or paid.

- ✓ The outcome people wanted.
- ✕ A state that is only waiting.

**In Accessible first**

A finished task, with a filled icon and a word.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [Which outcome matters most? **Completion without errors**](#why-outcomes-q1) · `outcomes.q1`
:::

:::panel{title="warning" note="tone" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="badge/tone/warning"}

**What it is for**

Needs attention soon; nothing has failed yet.

- ✓ A risk people can still act on.
- ✕ Something already failed.

**In Accessible first**

A risk people can still fix before they finish, with an icon and a word.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is a costly mistake? **A task that fails**](#why-outcomes-q2) · `outcomes.q2`
:::

:::panel{title="danger" note="tone" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="badge/tone/danger"}

**What it is for**

Failed, blocked or lost; act now.

- ✓ A real failure or loss.
- ✕ Anything that is only unusual.

**In Accessible first**

A failure that blocks the task, with a filled icon and a word; an alert says how to fix it.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is a costly mistake? **A task that fails**](#why-outcomes-q2) · `outcomes.q2`
:::

::card-grid{id="anatomy-link/badge"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="A status"}
**Use** Badge with an icon and a word

**Not** Color alone

Status must survive no color and a screen reader.
:::
:::panel{title="Shape of a status badge"}
**Use** radius.badge (rectangle)

**Not** A pill

Clear shapes with a word inside.
:::
::::

## Why it works this way

Badge looks the way it does because of 5 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Badge, and what would move if it changed.

::reason-chain{id="badge/accessibility.count"}

::reason-chain{id="badge/scenarios.q2"}

::reason-chain{id="badge/components.values"}

::reason-chain{id="badge/outcomes.q1"}

::reason-chain{id="badge/outcomes.q2"}

## Words

- Use common words. Explain any term you must use.
- One idea per sentence. Put the action first.
- Never blame the person.
- Use: Continue, Change, Start, You. Avoid: Invalid, Utilise, Submit, Error code.

The labels components use, from the voice tokens:

- `content.action.commit`: Continue
- `content.action.cancel`: Go back
- `content.action.destroy`: Delete
- `content.action.retry`: Try again
- `content.action.empty-action`: Start a new application

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
