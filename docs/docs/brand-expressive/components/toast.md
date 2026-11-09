---
composite_data: "./toast.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 59
title: "Toast"
description: "Toast in Brand expressive."
---

# Toast

A short message that confirms an action and goes away.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="toast/live"}

## When to use it

**In Brand expressive:** Confirms a place on the waitlist.

- **Use it when:** Saved, sent, exported: something people should notice without stopping.
- **Not when:** A failure people must understand (alert or dialog), or a notice that stays (alert).

Instead:

- [Alert](./alert.md): Stays on the page.
- [Dialog](./dialog.md): Needs an answer.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Brand expressive" tone="success"}
::preview{id="toast/tone/neutral"}

**What it is for**

A plain confirmation.

- ✓ Something changed: cleared, copied, moved.
- ✕ Something failed.

**In Brand expressive**

A light note that something changed.

**Because**

- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
:::

:::panel{title="success" note="tone" label="Used in Brand expressive" tone="success"}
::preview{id="toast/tone/success"}

**What it is for**

Confirms that something people care about worked.

- ✓ Exported, paid, joined.
- ✕ A routine change that needs no celebration.

**In Brand expressive**

Celebrate, briefly: You're on the list. See you at launch.

**Because**

- [How does it sound? **Playful**](#why-voice-values) · `voice.values`
- [Which outcome matters most? **Engagement**](#why-outcomes-q1) · `outcomes.q1`
:::

:::panel{title="danger" note="tone" label="Used in Brand expressive" tone="success"}
::preview{id="toast/tone/danger"}

**What it is for**

Something failed in the background.

- ✓ What failed and how to fix it, when it can wait for people's attention.
- ✕ A failure that blocks the task: use an alert or a dialog.

**In Brand expressive**

Plain first, a light touch after: That didn't go through.

**Because**

- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
:::

::card-grid{id="anatomy-link/toast"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="The words of an error"}
**Use** Plain first, a light touch after

**Not** A joke before the fix

Playful copy must never hide what went wrong. Example: “That email doesn't look right. Check it and try again.”
:::
:::panel{title="A success message"}
**Use** Celebrate, briefly

**Not** A long thank-you

A short celebration is remembered. Example: “You're on the list. See you at launch.”
:::
::::

## Why it works this way

Toast looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Toast, and what would move if it changed.

::reason-chain{id="toast/voice.count"}

::reason-chain{id="toast/voice.values"}

::reason-chain{id="toast/outcomes.q1"}

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
