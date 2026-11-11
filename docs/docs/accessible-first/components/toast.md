---
composite_data: "./toast.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 60
title: "Toast"
description: "Toast in Accessible first."
sidebar_class_name: "ods-left-out"
---

# Toast

A short message that confirms an action and goes away.

:label[Left out of Accessible first]{tone="warning"} A toast goes away. Here errors and important notes stay on the page, because people must know what went wrong and where. Use instead: [Alert](./alert)

## See it live

::preview{id="toast/live"}

## When to use it

- **Use it when:** Saved, sent, exported: something people should notice without stopping.
- **Not when:** A failure people must understand (alert or dialog), or a notice that stays (alert).

Instead:

- [Alert](./alert.md): Stays on the page.
- [Dialog](./dialog.md): Needs an answer.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="neutral" note="tone" label="Not decided yet" tone="neutral"}
::preview{id="toast/tone/neutral"}

**What it is for**

A plain confirmation.

- ✓ Something changed: cleared, copied, moved.
- ✕ Something failed.

**In Accessible first**

Not decided yet.

:::

:::panel{title="success" note="tone" label="Not decided yet" tone="neutral"}
::preview{id="toast/tone/success"}

**What it is for**

Confirms that something people care about worked.

- ✓ Exported, paid, joined.
- ✕ A routine change that needs no celebration.

**In Accessible first**

Not decided yet.

:::

:::panel{title="danger" note="tone" label="Not decided yet" tone="neutral"}
::preview{id="toast/tone/danger"}

**What it is for**

Something failed in the background.

- ✓ What failed and how to fix it, when it can wait for people's attention.
- ✕ A failure that blocks the task: use an alert or a dialog.

**In Accessible first**

Not decided yet.

:::

::card-grid{id="anatomy-link/toast"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="The words of an error"}
**Use** Say what is wrong, where, and exactly how to fix it

**Not** "Invalid input"

People must be able to fix the error without help. Example: “Enter your date of birth. For example, 27 3 1980.”
:::
:::panel{title="A success message"}
**Use** Confirm what happened and what comes next

**Not** A confirmation with no next step

People need to know the task is finished and what happens now. Example: “We have your application. We will email you within 5 working days.”
:::
::::

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
