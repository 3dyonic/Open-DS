---
composite_data: "./field.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27
title: "Field"
description: "Field in Accessible first."
---

# Field

A label, control, hint and error laid out together, the same way every time.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="field/live"}

## When to use it

**In Accessible first:** Label, hint and error in the same place on every question.

- **Use it when:** Every form control that needs a label, a hint or an error.
- **Not when:** A control that is not part of a form, such as a search box in a toolbar.

Instead:

- [Label](./label.md): The label on its own.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="vertical" note="orientation" label="Used in Accessible first" tone="success"}
::preview{id="field/orientation/vertical"}

**What it is for**

The label above the control.

- ✓ Most forms: easy to scan from top to bottom.
- ✕ Short settings where the label sits better beside.

**In Accessible first**

Every question: the label above the field, always visible.

**Because**

- [What accessibility level do we commit to? **AAA**](#why-people-q2) · `people.q2`
- [What is the main task? **Complete a form**](#why-tasks-q1) · `tasks.q1`
:::

:::panel{title="horizontal" note="orientation" label="Not used in Accessible first" tone="neutral"}
::preview{id="field/orientation/horizontal"}

**What it is for**

The label beside the control.

- ✓ Settings and short controls such as switches.
- ✕ Narrow screens, or long labels.

**In Accessible first**

Labels stay above the field, visible while typing and in the same place on any screen.

**Because**

- [What accessibility level do we commit to? **AAA**](#why-people-q2) · `people.q2`
:::

:::panel{title="responsive" note="orientation" label="Not used in Accessible first" tone="neutral"}
::preview{id="field/orientation/responsive"}

**What it is for**

The label above on narrow screens and beside on wide ones.

- ✓ Forms people use on phones and laptops alike.
- ✕ When one layout is simpler for everyone.

**In Accessible first**

One layout on every device, so people meet the same form every time.

**Because**

- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
- [Where do people use it? **Anywhere, on any device**](#why-scenarios-q1) · `scenarios.q1`
:::

::card-grid{id="anatomy-link/field"}

## How Accessible first uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label, above the field, always visible

**Not** A placeholder as the label

Labels must stay visible while typing.
:::
:::panel{title="An error message"}
**Use** color.status.danger, an icon and a sentence next to the field

**Not** Color alone

People must know what went wrong and where.
:::
::::

## Why it works this way

Field looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Field, and what would move if it changed.

::reason-chain{id="field/people.q2"}

::reason-chain{id="field/tasks.q1"}

::reason-chain{id="field/human.q2"}

::reason-chain{id="field/scenarios.q1"}

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

- [ ] The label, hint and error are linked to the control, so they are read with it. undefined

## Use it in code

```bash
npx open-ds add field
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Field reads 37 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Field's tokens to change Field alone.

::token-table{component="field"}
