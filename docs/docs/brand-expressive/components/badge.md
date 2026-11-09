---
composite_data: "./badge.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Badge"
description: "Badge in Brand expressive."
---

# Badge

A short label for a status, category or count, next to what it describes.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="badge/live"}

## When to use it

**In Brand expressive:** New and limited labels.

- **Use it when:** A state people scan for in a list or table, or a small category label.
- **Not when:** A message people must read (alert or toast), or an action (a button).

Instead:

- [Alert](./alert.md): A message, not a label.
- [Button](./button.md): Something to press.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Brand expressive" tone="success"}
::preview{id="badge/tone/neutral"}

**What it is for**

A label with no status meaning: a category, a count, a waiting state.

- ✓ Nothing is wrong and nothing needs doing.
- ✕ The state needs attention.

**In Brand expressive**

New: a label, not a state to fix.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="info" note="tone" label="Not used in Brand expressive" tone="neutral"}
::preview{id="badge/tone/info"}

**What it is for**

News: worth knowing, nothing to act on.

- ✓ Something is happening or coming.
- ✕ Something is wrong or nearly wrong.

**In Brand expressive**

Campaign labels are a state or a nudge; there are no plain news labels.

**Because**

- [What is the main content? **Images and campaigns**](#why-content-q1) · `content.q1`
:::

:::panel{title="success" note="tone" label="Used in Brand expressive" tone="success"}
::preview{id="badge/tone/success"}

**What it is for**

Done, healthy or paid.

- ✓ The outcome people wanted.
- ✕ A state that is only waiting.

**In Brand expressive**

On the list: you joined and your place is saved.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="warning" note="tone" label="Used in Brand expressive" tone="success"}
::preview{id="badge/tone/warning"}

**What it is for**

Needs attention soon; nothing has failed yet.

- ✓ A risk people can still act on.
- ✕ Something already failed.

**In Brand expressive**

Almost gone: few left, act soon.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
- [Which outcome matters most? **Engagement**](#why-outcomes-q1) · `outcomes.q1`
:::

:::panel{title="danger" note="tone" label="Not used in Brand expressive" tone="neutral"}
::preview{id="badge/tone/danger"}

**What it is for**

Failed, blocked or lost; act now.

- ✓ A real failure or loss.
- ✕ Anything that is only unusual.

**In Brand expressive**

Nothing on a launch page is labeled as failed; errors are plain sentences.

**Because**

- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
:::

::card-grid{id="anatomy-link/badge"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="A status"}
**Use** Badge pill with a word

**Not** Color alone

A word keeps meaning on vivid backgrounds.
:::
:::panel{title="Shape of a status badge"}
**Use** radius.badge (pill)

**Not** A rectangle

Pills match the controls.
:::
::::

## Why it works this way

Badge looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Badge, and what would move if it changed.

::reason-chain{id="badge/accessibility.count"}

::reason-chain{id="badge/content.q1"}

::reason-chain{id="badge/outcomes.q1"}

::reason-chain{id="badge/voice.count"}

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
