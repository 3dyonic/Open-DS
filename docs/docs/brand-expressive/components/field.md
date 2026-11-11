---
composite_data: "./field.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27
title: "Field"
description: "Field in Brand expressive."
---

# Field

A label, control, hint and error laid out together, the same way every time.

:label[In Brand expressive]{tone="info"}

## See it live

::preview{robot="slumber" id="field/live"}

## When to use it

**In Brand expressive:** Lays out the sign-up form.

- **Use it when:** Every form control that needs a label, a hint or an error.
- **Not when:** A control that is not part of a form, such as a search box in a toolbar.

Instead:

- [Label](./label.md): The label on its own.

## Variants

What each variant is for in any design system, then what Brand expressive decided and why. Each sample is the live story with that variant set.

:::panel{title="vertical" note="orientation" label="Used in Brand expressive" tone="success"}
::preview{robot="slumber" id="field/orientation/vertical"}

**What it is for**

The label above the control.

- ✓ Most forms: easy to scan from top to bottom.
- ✕ Short settings where the label sits better beside.

**In Brand expressive**

The sign-up form: the label above the field.

**Because**

- [Where do people use it? **On the move**](#why-scenarios-q1) · `scenarios.q1`
:::

:::panel{title="horizontal" note="orientation" label="Not used in Brand expressive" tone="neutral"}
::preview{robot="slumber" id="field/orientation/horizontal"}

**What it is for**

The label beside the control.

- ✓ Settings and short controls such as switches.
- ✕ Narrow screens, or long labels.

**In Brand expressive**

Phones first: there is no room beside the field.

**Because**

- [Where do people use it? **On the move**](#why-scenarios-q1) · `scenarios.q1`
- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="responsive" note="orientation" label="Not used in Brand expressive" tone="neutral"}
::preview{robot="slumber" id="field/orientation/responsive"}

**What it is for**

The label above on narrow screens and beside on wide ones.

- ✓ Forms people use on phones and laptops alike.
- ✕ When one layout is simpler for everyone.

**In Brand expressive**

Phones first: one stacked layout.

**Because**

- [Where do people use it? **On the move**](#why-scenarios-q1) · `scenarios.q1`
:::

::card-grid{id="anatomy-link/field"}

## How Brand expressive uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label

**Not** type.caption

Labels stay readable on vivid color.
:::
:::panel{title="An error message"}
**Use** color.status.danger and a short sentence

**Not** The brand magenta

Errors must not look like the brand.
:::
::::

## Why it works this way

Field looks the way it does because of 2 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Field, and what would move if it changed.

::reason-chain{id="field/scenarios.q1"}

::reason-chain{id="field/accessibility.values"}

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

- [ ] The label, hint and error are linked to the control, so they are read with it. undefined

## Use it in code

```bash
npx open-ds add field
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Field reads 37 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Field's tokens to change Field alone.

::token-table{component="field"}
