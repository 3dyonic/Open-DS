---
composite_data: "./badge.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Badge"
description: "Badge in Content first."
---

# Badge

A short label for a status, category or count, next to what it describes.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="badge/live"}

## When to use it

**In Content first:** The topic of an article.

- **Use it when:** A state people scan for in a list or table, or a small category label.
- **Not when:** A message people must read (alert or toast), or an action (a button).

Instead:

- [Alert](./alert.md): A message, not a label.
- [Button](./button.md): Something to press.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="badge/tone/neutral"}

**What it is for**

A label with no status meaning: a category, a count, a waiting state.

- ✓ Nothing is wrong and nothing needs doing.
- ✕ The state needs attention.

**In Content first**

Saved: waiting for you; nothing is wrong.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="info" note="tone" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="badge/tone/info"}

**What it is for**

News: worth knowing, nothing to act on.

- ✓ Something is happening or coming.
- ✕ Something is wrong or nearly wrong.

**In Content first**

Topics and reading states need no news tone; status is rare.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="success" note="tone" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="badge/tone/success"}

**What it is for**

Done, healthy or paid.

- ✓ The outcome people wanted.
- ✕ A state that is only waiting.

**In Content first**

Finished: you read it to the end.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="warning" note="tone" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="badge/tone/warning"}

**What it is for**

Needs attention soon; nothing has failed yet.

- ✓ A risk people can still act on.
- ✕ Something already failed.

**In Content first**

Out of date: the facts may have changed since it was written.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
:::

:::panel{title="danger" note="tone" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="badge/tone/danger"}

**What it is for**

Failed, blocked or lost; act now.

- ✓ A real failure or loss.
- ✕ Anything that is only unusual.

**In Content first**

Nothing in an article fails; errors are calm sentences, not labels.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
:::

::card-grid{id="anatomy-link/badge"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="A status"}
**Use** Badge pill with a word

**Not** An icon alone

Status is rare, so readers never learn an icon for it. A word is clear the first time.
:::
:::panel{title="Shape of a status badge"}
**Use** radius.badge (pill)

**Not** A rectangle

Pills sit softly next to text.
:::
::::

## Why it works this way

Badge looks the way it does because of 2 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Badge, and what would move if it changed.

::reason-chain{id="badge/accessibility.count"}

::reason-chain{id="badge/voice.count"}

## Words

- Write to one person: "you", not "users".
- Short sentences with room to breathe.
- Explain why before asking for anything.
- Use: Read, Save for later, You, Next issue. Avoid: Click here, Submit, Users, Content.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Not now
- `content.action.destroy`: Remove
- `content.action.retry`: Try again
- `content.action.empty-action`: Browse guides

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
