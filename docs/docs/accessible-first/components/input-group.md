---
composite_data: "./input-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 31
title: "Input group"
description: "Input group in Accessible first."
---

# Input group

An input with addons inside its border: icons, text, buttons.

:label[In Accessible first]{tone="info"}

## See it live

::preview{robot="slumber" id="input-group/live"}

## When to use it

**In Accessible first:** A value with a unit or currency, with the label still above the field. Not for separate fields.

- **Use it when:** A search with an icon and a clear button, a value with a unit or currency.
- **Not when:** Controls that are separate fields (lay them out with field).

Instead:

- [Input](./input.md): A plain field.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="inline-start" note="align" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-start"}

**What it is for**

An addon before the text, on the same line: an icon or currency.

- ✓ A search icon or a unit that comes first.
- ✕ Something people press often; put it after the text.

**In Accessible first**

A currency sign before the amount, with the label still above the field.

**Because**

- [What accessibility level do we commit to? **AAA**](#why-people-q2) · `people.q2`
- [What is the main task? **Complete a form**](#why-tasks-q1) · `tasks.q1`
:::

:::panel{title="inline-end" note="align" label="Used in Accessible first" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-end"}

**What it is for**

An addon after the text: a unit, a clear button, a shortcut.

- ✓ Clear, submit or a unit that follows the value.
- ✕ A label that should be outside the field.

**In Accessible first**

A unit after the value, as a word people can read, with the label still above the field.

**Because**

- [What accessibility level do we commit to? **AAA**](#why-people-q2) · `people.q2`
- [What do icons do? **Actions and status**](#why-iconography-roles) · `iconography.roles`
:::

:::panel{title="block-start" note="align" label="Not used in Accessible first" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-start"}

**What it is for**

An addon row above the text, inside the field.

- ✓ A toolbar or a label row for a larger input.
- ✕ Single-line fields in a toolbar.

**In Accessible first**

The label stays above the field, outside it, always visible.

**Because**

- [What accessibility level do we commit to? **AAA**](#why-people-q2) · `people.q2`
:::

:::panel{title="block-end" note="align" label="Not used in Accessible first" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-end"}

**What it is for**

An addon row below the text, inside the field.

- ✓ A counter or actions under a larger input.
- ✕ Single-line fields in a toolbar.

**In Accessible first**

Hints and errors sit in the field layout, in the same place on every question.

**Because**

- [What accessibility level do we commit to? **AAA**](#why-people-q2) · `people.q2`
- [Which kinds of copy does it need? **Labels, messages and help**](#why-voice-roles) · `voice.roles`
:::

::card-grid{id="anatomy-link/input-group"}

## Why it works this way

Input group looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Input group, and what would move if it changed.

::reason-chain{id="input-group/people.q2"}

::reason-chain{id="input-group/tasks.q1"}

::reason-chain{id="input-group/iconography.roles"}

::reason-chain{id="input-group/voice.roles"}

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

- [ ] Addon buttons have names; icons that only decorate are hidden from screen readers. undefined

## Use it in code

```bash
npx open-ds add input-group
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Input group reads 53 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Input group's tokens to change Input group alone.

::token-table{component="input-group"}
