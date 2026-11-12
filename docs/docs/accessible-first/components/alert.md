---
composite_data: "./alert.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 2
title: "Alert"
description: "Alert in Accessible first."
---

# Alert

A message that stays on the page with the content it is about.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="alert/live"}

## When to use it

**In Accessible first:** Errors and important notes that stay on the page.

- **Use it when:** People need to read a standing notice or how to recover, on this page, tied to what they are doing.
- **Not when:** A short confirmation that can go away by itself, or one notice for the whole site.

Instead:

- [Toast](./toast.md): Short, non-blocking, goes away.
- [Dialog](./dialog.md): Needs an answer before going on.
- Site banner: One full-width notice for the whole site.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Accessible first" tone="success"}
::preview{id="alert/variant/default"}

**What it is for**

A notice that stays on the page: information or a heads-up.

- ✓ A note people should read but need not fix.
- ✕ Something failed and must be fixed.

**In Accessible first**

Important notes that stay on the page while people answer.

**Because**

- [Which outcome matters most? **Completion without errors**](#why-outcomes-q1) · `outcomes.q1`
- [What must the interface protect? **Low effort to understand**](#why-human-q1) · `human.q1`
:::

:::panel{title="destructive" note="variant" label="Used in Accessible first" tone="success"}
::preview{id="alert/variant/destructive"}

**What it is for**

Something failed or will be lost, and people must act to recover.

- ✓ An error, with what went wrong and how to fix it.
- ✕ A plain note dressed as danger for emphasis.

**In Accessible first**

Errors, with what went wrong, where, and exactly how to fix it, next to the field.

**Because**

- [How many signals carry each meaning? **Three: color, icon and word**](#why-accessibility-count) · `accessibility.count`
- [What is a costly mistake? **A task that fails**](#why-outcomes-q2) · `outcomes.q2`
- [How does it sound? **Plain and direct**](#why-voice-values) · `voice.values`
:::

::card-grid{id="anatomy-link/alert"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="An error message"}
**Use** color.status.danger, an icon and a sentence next to the field

**Not** Color alone

People must know what went wrong and where.
:::
::::

## Why it works this way

Alert looks the way it does because of 5 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Alert, and what would move if it changed.

::reason-chain{id="alert/outcomes.q1"}

::reason-chain{id="alert/human.q1"}

::reason-chain{id="alert/accessibility.count"}

::reason-chain{id="alert/outcomes.q2"}

::reason-chain{id="alert/voice.values"}

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
