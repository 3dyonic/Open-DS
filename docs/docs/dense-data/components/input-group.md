---
composite_data: "./input-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 32
title: "Input group"
description: "Input group in Dense data."
---

# Input group

An input with addons inside its border: icons, text, buttons.

:label[In Dense data]{tone="info"}

## See it live

::preview{robot="slumber" id="input-group/live"}

## When to use it

**In Dense data:** Search with an icon and a clear button.

- **Use it when:** A search with an icon and a clear button, a value with a unit or currency.
- **Not when:** Controls that are separate fields (lay them out with field).

Instead:

- [Input](./input.md): A plain field.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="inline-start" note="align" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-start"}

**What it is for**

An addon before the text, on the same line: an icon or currency.

- ✓ A search icon or a unit that comes first.
- ✕ Something people press often; put it after the text.

**In Dense data**

The search icon before the text.

**Because**

- [What do icons do? **Actions and status**](#why-iconography-roles) · `iconography.roles`
:::

:::panel{title="inline-end" note="align" label="Used in Dense data" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-end"}

**What it is for**

An addon after the text: a unit, a clear button, a shortcut.

- ✓ Clear, submit or a unit that follows the value.
- ✕ A label that should be outside the field.

**In Dense data**

The clear button after the text, for searches people repeat all day.

**Because**

- [How often do people repeat actions? **Constantly**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="block-start" note="align" label="Not used in Dense data" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-start"}

**What it is for**

An addon row above the text, inside the field.

- ✓ A toolbar or a label row for a larger input.
- ✕ Single-line fields in a toolbar.

**In Dense data**

Inputs stay one line high in toolbars and filter bars.

**Because**

- [How much is on one screen? **A lot**](#why-content-q2) · `content.q2`
:::

:::panel{title="block-end" note="align" label="Not used in Dense data" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-end"}

**What it is for**

An addon row below the text, inside the field.

- ✓ A counter or actions under a larger input.
- ✕ Single-line fields in a toolbar.

**In Dense data**

Inputs stay one line high in toolbars and filter bars.

**Because**

- [How much is on one screen? **A lot**](#why-content-q2) · `content.q2`
:::

::card-grid{id="anatomy-link/input-group"}

## Why it works this way

Input group looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Input group, and what would move if it changed.

::reason-chain{id="input-group/iconography.roles"}

::reason-chain{id="input-group/tasks.q2"}

::reason-chain{id="input-group/content.q2"}

## Words

- Lead with the object, then the state: "Alert 2041 contained."
- Use numbers, not words for numbers.
- One verb per button. No "please", no exclamation marks.
- Use: Investigate, Filter, Assign, Escalated, Resolved. Avoid: Oops, Awesome, Please, Simply.

The labels components use, from the voice tokens:

- `content.action.commit`: Save
- `content.action.cancel`: Cancel
- `content.action.destroy`: Delete
- `content.action.retry`: Retry
- `content.action.empty-action`: Change filters

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
