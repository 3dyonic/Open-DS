---
composite_data: "./input-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 31
title: "Input group"
description: "Input group in Multi-brand."
---

# Input group

An input with addons inside its border: icons, text, buttons.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="input-group/live"}

## When to use it

**In Multi-brand:** A field with a unit or currency, or a search with an icon. Not for separate fields; field lays those out.

- **Use it when:** A search with an icon and a clear button, a value with a unit or currency.
- **Not when:** Controls that are separate fields (lay them out with field).

Instead:

- [Input](./input.md): A plain field.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="inline-start" note="align" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-start"}

**What it is for**

An addon before the text, on the same line: an icon or currency.

- ✓ A search icon or a unit that comes first.
- ✕ Something people press often; put it after the text.

**In Multi-brand**

A currency sign or a search icon before the text, from the outline set every brand shares.

**Because**

- [What icon style and stroke? **Outline**](#why-iconography-definition) · `iconography.definition`
- [What is the main content? **Forms and tasks**](#why-content-q1) · `content.q1`
:::

:::panel{title="inline-end" note="align" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-end"}

**What it is for**

An addon after the text: a unit, a clear button, a shortcut.

- ✓ Clear, submit or a unit that follows the value.
- ✕ A label that should be outside the field.

**In Multi-brand**

A unit after the value, the same in every brand.

**Because**

- [What is the main content? **Forms and tasks**](#why-content-q1) · `content.q1`
- [What do components read? **Component keys**](#why-naming-lands) · `naming.lands`
:::

:::panel{title="block-start" note="align" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-start"}

**What it is for**

An addon row above the text, inside the field.

- ✓ A toolbar or a label row for a larger input.
- ✕ Single-line fields in a toolbar.

**In Multi-brand**

Sign-up and account fields stay one line; field puts the label above, outside the input.

**Because**

- [What is the main content? **Forms and tasks**](#why-content-q1) · `content.q1`
- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

:::panel{title="block-end" note="align" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-end"}

**What it is for**

An addon row below the text, inside the field.

- ✓ A counter or actions under a larger input.
- ✕ Single-line fields in a toolbar.

**In Multi-brand**

Sign-up and account fields stay one line; field shows the hint and error below.

**Because**

- [What is the main content? **Forms and tasks**](#why-content-q1) · `content.q1`
- [What accessibility level do we commit to? **AA**](#why-people-q2) · `people.q2`
:::

::card-grid{id="anatomy-link/input-group"}

## Why it works this way

Input group looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Input group, and what would move if it changed.

::reason-chain{id="input-group/iconography.definition"}

::reason-chain{id="input-group/content.q1"}

::reason-chain{id="input-group/naming.lands"}

::reason-chain{id="input-group/people.q2"}

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

- [ ] Addon buttons have names; icons that only decorate are hidden from screen readers. undefined

## Use it in code

```bash
npx open-ds add input-group
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Input group reads 53 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Input group's tokens to change Input group alone.

::token-table{component="input-group"}
