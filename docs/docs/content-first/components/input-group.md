---
composite_data: "./input-group.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 31
title: "Input group"
description: "Input group in Content first."
---

# Input group

An input with addons inside its border: icons, text, buttons.

:label[In Content first]{tone="info"}

## See it live

::preview{robot="slumber" id="input-group/live"}

## When to use it

**In Content first:** The search field, with a clear button and any icon beside a visible word. Not for separate fields.

- **Use it when:** A search with an icon and a clear button, a value with a unit or currency.
- **Not when:** Controls that are separate fields (lay them out with field).

Instead:

- [Input](./input.md): A plain field.

## Variants

What each variant is for in any design system, then what Content first decided and why. Each sample is the live story with that variant set.

:::panel{title="inline-start" note="align" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-start"}

**What it is for**

An addon before the text, on the same line: an icon or currency.

- ✓ A search icon or a unit that comes first.
- ✕ Something people press often; put it after the text.

**In Content first**

The search icon before the text, with the visible label above the field.

**Because**

- [What do icons do? **Actions, status and navigation**](#why-iconography-roles) · `iconography.roles`
- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
:::

:::panel{title="inline-end" note="align" label="Used in Content first" tone="success"}
::preview{robot="slumber" id="input-group/align/inline-end"}

**What it is for**

An addon after the text: a unit, a clear button, a shortcut.

- ✓ Clear, submit or a unit that follows the value.
- ✕ A label that should be outside the field.

**In Content first**

The clear button after the text, with a word: occasional visitors do not know icons.

**Because**

- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
:::

:::panel{title="block-start" note="align" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-start"}

**What it is for**

An addon row above the text, inside the field.

- ✓ A toolbar or a label row for a larger input.
- ✕ Single-line fields in a toolbar.

**In Content first**

Search is one line, and forms are rare and short.

**Because**

- [How often do people repeat actions? **Rarely**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="block-end" note="align" label="Not used in Content first" tone="neutral"}
::preview{robot="slumber" id="input-group/align/block-end"}

**What it is for**

An addon row below the text, inside the field.

- ✓ A counter or actions under a larger input.
- ✕ Single-line fields in a toolbar.

**In Content first**

Search is one line, and forms are rare and short.

**Because**

- [How often do people repeat actions? **Rarely**](#why-tasks-q2) · `tasks.q2`
:::

::card-grid{id="anatomy-link/input-group"}

## Why it works this way

Input group looks the way it does because of 3 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Input group, and what would move if it changed.

::reason-chain{id="input-group/iconography.roles"}

::reason-chain{id="input-group/human.q2"}

::reason-chain{id="input-group/tasks.q2"}

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

- [ ] Addon buttons have names; icons that only decorate are hidden from screen readers. undefined

## Use it in code

```bash
npx open-ds add input-group
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Input group reads 53 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Input group's tokens to change Input group alone.

::token-table{component="input-group"}
