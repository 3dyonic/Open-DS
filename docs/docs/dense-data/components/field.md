---
composite_data: "./field.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 27
title: "Field"
description: "Field in Dense data."
---

# Field

A label, control, hint and error laid out together, the same way every time.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="field/live"}

## When to use it

**In Dense data:** Lays out label, control and error the same way everywhere.

- **Use it when:** Every form control that needs a label, a hint or an error.
- **Not when:** A control that is not part of a form, such as a search box in a toolbar.

Instead:

- [Label](./label.md): The label on its own.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="vertical" note="orientation" label="Used in Dense data" tone="success"}
::preview{id="field/orientation/vertical"}

**What it is for**

The label above the control.

- ✓ Most forms: easy to scan from top to bottom.
- ✕ Short settings where the label sits better beside.

**In Dense data**

Forms in dialogs and sheets: the label above.

**Because**

- [What is the main task? **Scan and compare**](#why-tasks-q1) · `tasks.q1`
:::

:::panel{title="horizontal" note="orientation" label="Used in Dense data" tone="success"}
::preview{id="field/orientation/horizontal"}

**What it is for**

The label beside the control.

- ✓ Settings and short controls such as switches.
- ✕ Narrow screens, or long labels.

**In Dense data**

Settings and filter panels: switches and short controls with the label beside.

**Because**

- [How much is on one screen? **A lot**](#why-content-q2) · `content.q2`
- [How many densities exist? **Two**](#why-spacing-count) · `spacing.count`
:::

:::panel{title="responsive" note="orientation" label="Not used in Dense data" tone="neutral"}
::preview{id="field/orientation/responsive"}

**What it is for**

The label above on narrow screens and beside on wide ones.

- ✓ Forms people use on phones and laptops alike.
- ✕ When one layout is simpler for everyone.

**In Dense data**

A desk with a mouse and keyboard: there is no narrow screen to adapt to.

**Because**

- [Where do people use it? **At a desk**](#why-scenarios-q1) · `scenarios.q1`
:::

::card-grid{id="anatomy-link/field"}

## How Dense data uses it

::::grid{columns="2"}
:::panel{title="Field label or column header"}
**Use** type.label

**Not** type.heading

Headers repeat on every column; a heavy style would compete with the data.
:::
:::panel{title="An error message"}
**Use** color.status.danger with an icon

**Not** color.status.warning

Red always means fix this, and the icon says it without color.
:::
::::

## Why it works this way

Field looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Field, and what would move if it changed.

::reason-chain{id="field/tasks.q1"}

::reason-chain{id="field/content.q2"}

::reason-chain{id="field/spacing.count"}

::reason-chain{id="field/scenarios.q1"}

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

- [ ] The label, hint and error are linked to the control, so they are read with it. undefined

## Use it in code

```bash
npx open-ds add field
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Field reads 38 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Field's tokens to change Field alone.

::token-table{component="field"}
