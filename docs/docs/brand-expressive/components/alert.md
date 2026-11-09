---
composite_data: "./alert.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2
title: "Alert"
description: "Alert in Brand expressive."
---

# Alert

A message that stays on the page with the content it is about.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{id="alert/live"}

## When to use it

**In Brand expressive:** A sign-up that did not go through, and how to recover, on the page. Not for confirmations; toast does that.

- **Use it when:** People need to read a standing notice or how to recover, on this page, tied to what they are doing.
- **Not when:** A short confirmation that can go away by itself, or one notice for the whole site.

Instead:

- [Toast](./toast.md): Short, non-blocking, goes away.
- [Dialog](./dialog.md): Needs an answer before going on.
- Site banner: One full-width notice for the whole site.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Brand expressive" tone="neutral"}
::preview{id="alert/variant/default"}

**What it is for**

A notice that stays on the page: information or a heads-up.

- ✓ A note people should read but need not fix.
- ✕ Something failed and must be fixed.

**In Brand expressive**

Alerts here only report a sign-up that did not go through; confirmations go in a toast.

**Because**

- [How often do people repeat actions? **Rarely**](#why-tasks-q2) · `tasks.q2`
- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
:::

:::panel{title="destructive" note="variant" label="Used in Brand expressive" tone="success"}
::preview{id="alert/variant/destructive"}

**What it is for**

Something failed or will be lost, and people must act to recover.

- ✓ An error, with what went wrong and how to fix it.
- ✕ A plain note dressed as danger for emphasis.

**In Brand expressive**

A sign-up that did not go through: plain first, then how to recover, with a word beside the color.

**Because**

- [How many tones does it use? **One per moment**](#why-voice-count) · `voice.count`
- [How many signals carry each meaning? **Two: color and word**](#why-accessibility-count) · `accessibility.count`
- [What is a costly mistake? **Looking off-brand**](#why-outcomes-q2) · `outcomes.q2`
:::

::card-grid{id="anatomy-link/alert"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger and a short sentence

**Not** The brand magenta

Errors must not look like the brand.
:::
::::

## Why it works this way

Alert looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Alert, and what would move if it changed.

::reason-chain{id="alert/tasks.q2"}

::reason-chain{id="alert/voice.count"}

::reason-chain{id="alert/accessibility.count"}

::reason-chain{id="alert/outcomes.q2"}

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
