---
composite_data: "./field.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27
title: "Field"
description: "Field in Multi-brand."
---

# Field

A label, control, hint and error laid out together, the same way every time.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{id="field/live"}

## When to use it

**In Multi-brand:** Lays out every form the same way in every brand.

- **Use it when:** Every form control that needs a label, a hint or an error.
- **Not when:** A control that is not part of a form, such as a search box in a toolbar.

Instead:

- [Label](./label.md): The label on its own.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="vertical" note="orientation" label="Used in Multi-brand" tone="success"}
::preview{id="field/orientation/vertical"}

**What it is for**

The label above the control.

- ✓ Most forms: easy to scan from top to bottom.
- ✕ Short settings where the label sits better beside.

**In Multi-brand**

Sign-up and checkout forms: the label above, in every brand.

**Because**

- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
- [Where do people use it? **Anywhere, on any device**](#why-scenarios-q1) · `scenarios.q1`
:::

:::panel{title="horizontal" note="orientation" label="Not used in Multi-brand" tone="neutral"}
::preview{id="field/orientation/horizontal"}

**What it is for**

The label beside the control.

- ✓ Settings and short controls such as switches.
- ✕ Narrow screens, or long labels.

**In Multi-brand**

Customers sign up on phones: labels stay above.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="responsive" note="orientation" label="Used in Multi-brand" tone="success"}
::preview{id="field/orientation/responsive"}

**What it is for**

The label above on narrow screens and beside on wide ones.

- ✓ Forms people use on phones and laptops alike.
- ✕ When one layout is simpler for everyone.

**In Multi-brand**

Account settings: stacked on phones, label beside on laptops.

**Because**

- [Where do people use it? **Anywhere, on any device**](#why-scenarios-q1) · `scenarios.q1`
:::

::card-grid{id="anatomy-link/field"}

## How Multi-brand uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label

**Not** type.caption

Labels stay readable in every brand.
:::
:::panel{title="An error message"}
**Use** color.status.danger and a sentence

**Not** The brand color

Status colors are shared, never branded.
:::
::::

## Why it works this way

Field looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Field, and what would move if it changed.

::reason-chain{id="field/people.q2"}

::reason-chain{id="field/scenarios.q1"}

::reason-chain{id="field/accessibility.values"}

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

- [ ] The label, hint and error are linked to the control, so they are read with it. undefined

## Use it in code

```bash
npx open-ds add field
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Field reads 38 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Field's tokens to change Field alone.

::token-table{component="field"}
