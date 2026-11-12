---
composite_data: "./field.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27
title: "Field"
description: "Field in Content first."
---

# Field

A label, control, hint and error laid out together, the same way every time.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="field/live"}

## When to use it

**In Content first:** Lays out the newsletter and search forms.

- **Use it when:** Every form control that needs a label, a hint or an error.
- **Not when:** A control that is not part of a form, such as a search box in a toolbar.

Instead:

- [Label](./label.md): The label on its own.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="vertical" note="orientation" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="field/orientation/vertical"}

**What it is for**

The label above the control.

- ✓ Most forms: easy to scan from top to bottom.
- ✕ Short settings where the label sits better beside.

**In Content first**

Newsletter and search forms: the label above.

**Because**

- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

:::panel{title="horizontal" note="orientation" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="field/orientation/horizontal"}

**What it is for**

The label beside the control.

- ✓ Settings and short controls such as switches.
- ✕ Narrow screens, or long labels.

**In Content first**

Forms are rare and short; stacking keeps the reading column.

**Because**

- [How often do people repeat actions? **Rarely**](#why-tasks-q2) · `tasks.q2`
- [What must the interface protect? **Attention on the content**](#why-human-q1) · `human.q1`
:::

:::panel{title="responsive" note="orientation" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="field/orientation/responsive"}

**What it is for**

The label above on narrow screens and beside on wide ones.

- ✓ Forms people use on phones and laptops alike.
- ✕ When one layout is simpler for everyone.

**In Content first**

One stacked layout reads the same on phones and laptops.

**Because**

- [Where do people use it? **Anywhere, on any device**](#why-scenarios-q1) · `scenarios.q1`
:::

::card-grid{id="anatomy-link/field"}

## How Content first uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label

**Not** type.caption

Caption is too faint for a label people must read.
:::
:::panel{title="An error message"}
**Use** color.status.danger and a plain sentence

**Not** Color alone

The sentence says what to fix; color only draws the eye.
:::
::::

## Why it works this way

Field looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Field, and what would move if it changed.

::reason-chain{id="field/people.q2"}

::reason-chain{id="field/tasks.q2"}

::reason-chain{id="field/human.q1"}

::reason-chain{id="field/scenarios.q1"}

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

- [ ] The label, hint and error are linked to the control, so they are read with it. undefined

## Use it in code

```bash
npx open-ds add field
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Field reads 38 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Field's tokens to change Field alone.

::token-table{component="field"}
