---
composite_data: "./toast.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 60
title: "Toast"
description: "Toast in Content first."
---

# Toast

A short message that confirms an action and goes away.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="toast/live"}

## When to use it

**In Content first:** Confirms a saved article.

- **Use it when:** Saved, sent, exported: something people should notice without stopping.
- **Not when:** A failure people must understand (alert or dialog), or a notice that stays (alert).

Instead:

- [Alert](./alert.md): Stays on the page.
- [Dialog](./dialog.md): Needs an answer.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="toast/tone/neutral"}

**What it is for**

A plain confirmation.

- ✓ Something changed: cleared, copied, moved.
- ✕ Something failed.

**In Content first**

A calm note: You're all caught up.

**Because**

- [How does it sound? **Conversational**](#why-voice-values) · `voice.values`
:::

:::panel{title="success" note="tone" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="toast/tone/success"}

**What it is for**

Confirms that something people care about worked.

- ✓ Exported, paid, joined.
- ✕ A routine change that needs no celebration.

**In Content first**

Warm and brief, with what happens next.

**Because**

- [How does it sound? **Conversational**](#why-voice-values) · `voice.values`
:::

:::panel{title="danger" note="tone" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="toast/tone/danger"}

**What it is for**

Something failed in the background.

- ✓ What failed and how to fix it, when it can wait for people's attention.
- ✕ A failure that blocks the task: use an alert or a dialog.

**In Content first**

Calm and helpful: take the blame, offer the way forward.

**Because**

- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
- [How does it sound? **Conversational**](#why-voice-values) · `voice.values`
:::

::card-grid{id="anatomy-link/toast"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="The words of an error"}
**Use** Calm and helpful. Take the blame, offer the way forward.

**Not** Blaming the reader

A calm error keeps the reader's trust. Example: “We could not save your email. Check it and try again.”
:::
:::panel{title="A success message"}
**Use** Warm and brief, with what happens next

**Not** A bare "Done"

A warm close invites the reader back. Example: “You're in. The next issue arrives on Friday.”
:::
::::

## Why it works this way

Toast looks the way it does because of 2 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Toast, and what would move if it changed.

::reason-chain{id="toast/voice.values"}

::reason-chain{id="toast/voice.count"}

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
