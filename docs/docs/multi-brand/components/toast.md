---
composite_data: "./toast.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 60
title: "Toast"
description: "Toast in Multi-brand."
---

# Toast

A short message that confirms an action and goes away.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="toast/live"}

## When to use it

**In Multi-brand:** Confirms a saved change.

- **Use it when:** Saved, sent, exported: something people should notice without stopping.
- **Not when:** A failure people must understand (alert or dialog), or a notice that stays (alert).

Instead:

- [Alert](./alert.md): Stays on the page.
- [Dialog](./dialog.md): Needs an answer.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="toast/tone/neutral"}

**What it is for**

A plain confirmation.

- ✓ Something changed: cleared, copied, moved.
- ✕ Something failed.

**In Multi-brand**

A shared line with brand words.

**Because**

- [How is the voice defined? **A shared core, brand tone on top**](#why-voice-definition) · `voice.definition`
:::

:::panel{title="success" note="tone" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="toast/tone/success"}

**What it is for**

Confirms that something people care about worked.

- ✓ Exported, paid, joined.
- ✕ A routine change that needs no celebration.

**In Multi-brand**

Brand tone allowed: Aster calm, Birch friendly, Coral upbeat.

**Because**

- [How many tones does it use? **One per brand**](#why-voice-count) · `voice.count`
:::

:::panel{title="danger" note="tone" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="toast/tone/danger"}

**What it is for**

Something failed in the background.

- ✓ What failed and how to fix it, when it can wait for people's attention.
- ✕ A failure that blocks the task: use an alert or a dialog.

**In Multi-brand**

Shared across brands: plain and specific.

**Because**

- [How is the voice defined? **A shared core, brand tone on top**](#why-voice-definition) · `voice.definition`
- [How does it sound? **Plain and direct**](#why-voice-values) · `voice.values`
:::

::card-grid{id="anatomy-link/toast"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="The words of an error"}
**Use** Shared across brands: plain and specific

**Not** Brand tone in errors

Errors read the same in every brand, so support can help anyone. Example: “Your card was declined. Try another card or contact your bank.”
:::
:::panel{title="A success message"}
**Use** Brand tone allowed: Aster calm, Birch friendly, Coral upbeat

**Not** The same flat line in every brand

Success is a safe moment for brand tone. Example: “Aster: Your plan is active. · Birch: You're all set! · Coral: Let's go, your plan is live.”
:::
::::

## Why it works this way

Toast looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Toast, and what would move if it changed.

::reason-chain{id="toast/voice.definition"}

::reason-chain{id="toast/voice.count"}

::reason-chain{id="toast/voice.values"}

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
