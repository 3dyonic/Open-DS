---
composite_data: "./alert.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2
title: "Alert"
description: "Alert in Content first."
---

# Alert

A message that stays on the page with the content it is about.

:label[In Content first]{tone="info"}

## See it live

::preview{id="alert/live"}

## When to use it

**In Content first:** A note or warning inside an article.

- **Use it when:** People need to read a standing notice or how to recover, on this page, tied to what they are doing.
- **Not when:** A short confirmation that can go away by itself, or one notice for the whole site.

Instead:

- [Toast](./toast.md): Short, non-blocking, goes away.
- [Dialog](./dialog.md): Needs an answer before going on.
- Site banner: One full-width notice for the whole site.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Content first" tone="success"}
::preview{id="alert/variant/default"}

**What it is for**

A notice that stays on the page: information or a heads-up.

- ✓ A note people should read but need not fix.
- ✕ Something failed and must be fixed.

**In Content first**

A note or a warning inside an article.

**Because**

- [What is the main content? **Long-form text**](#why-content-q1) · `content.q1`
:::

:::panel{title="destructive" note="variant" label="Used in Content first" tone="success"}
::preview{id="alert/variant/destructive"}

**What it is for**

Something failed or will be lost, and people must act to recover.

- ✓ An error, with what went wrong and how to fix it.
- ✕ A plain note dressed as danger for emphasis.

**In Content first**

A failed save or sign-up: calm, take the blame, offer the way forward.

**Because**

- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
:::

::card-grid{id="anatomy-link/alert"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger and a plain sentence

**Not** Color alone

The sentence says what to fix; color only draws the eye.
:::
::::

## Why it works this way

Alert looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Alert, and what would move if it changed.

::reason-chain{id="alert/content.q1"}

::reason-chain{id="alert/accessibility.count"}

::reason-chain{id="alert/voice.count"}

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
