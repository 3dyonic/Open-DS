---
composite_data: "./toggle.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 61
title: "Toggle"
description: "Toggle in Dense data."
---

# Toggle

A button that stays pressed or not.

:label[In Dense data]{tone="info"}

## See it live

::preview{id="toggle/live"}

## When to use it

**In Dense data:** One mode in the table toolbar that turns on and off. Not for settings saved at once, which use a switch.

- **Use it when:** Turning a mode or format on and off in a toolbar, such as bold.
- **Not when:** A setting saved at once (switch), or a one-off action (button).

Instead:

- [Switch](./switch.md): A setting.
- [Button](./button.md): A one-off action.
- [Toggle group](./toggle-group.md): Several toggles together.

## Variants

What each variant is for in any design system, then what Dense data decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Used in Dense data" tone="success"}
::preview{id="toggle/variant/default"}

**What it is for**

No border; the pressed state shows as a fill.

- ✓ Toolbars where toggles sit together.
- ✕ A toggle alone on a busy background.

**In Dense data**

In the table toolbar, with no border; the pressed state shows as a fill, quiet beside the data.

**Because**

- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
- [How often do people repeat actions? **Constantly**](#why-tasks-q2) · `tasks.q2`
:::

:::panel{title="outline" note="variant" label="Not used in Dense data" tone="neutral"}
::preview{id="toggle/variant/outline"}

**What it is for**

A border, so the toggle reads as a control at rest.

- ✓ A toggle that stands alone.
- ✕ A dense toolbar of many toggles.

**In Dense data**

Borders on every toggle would compete with the data.

**Because**

- [What is the main content? **Numbers and records**](#why-content-q1) · `content.q1`
:::

:::panel{title="default" note="size" label="Not used in Dense data" tone="neutral"}
::preview{id="toggle/size/default"}

**What it is for**

The normal size.

- ✓ Most toolbars.
- ✕ Very dense toolbars.

**In Dense data**

Toggles sit in the table toolbar, at the smaller size like compact buttons.

**Because**

- [How much is on one screen? **A lot**](#why-content-q2) · `content.q2`
:::

:::panel{title="sm" note="size" label="Used in Dense data" tone="success"}
::preview{id="toggle/size/sm"}

**What it is for**

A smaller toggle.

- ✓ Dense toolbars and compact panels.
- ✕ Touch screens.

**In Dense data**

The table toolbar, matching compact buttons. It still fits a mouse.

**Because**

- [How much is on one screen? **A lot**](#why-content-q2) · `content.q2`
- [What is the smallest target? **Compact, for a pointer**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="lg" note="size" label="Not used in Dense data" tone="neutral"}
::preview{id="toggle/size/lg"}

**What it is for**

A larger toggle.

- ✓ A few toggles that need to be easy to hit.
- ✕ Dense toolbars.

**In Dense data**

Controls stay small so more records fit on one screen.

**Because**

- [How much is on one screen? **A lot**](#why-content-q2) · `content.q2`
:::

::card-grid{id="anatomy-link/toggle"}

## Why it works this way

Toggle looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Toggle, and what would move if it changed.

::reason-chain{id="toggle/content.q1"}

::reason-chain{id="toggle/tasks.q2"}

::reason-chain{id="toggle/content.q2"}

::reason-chain{id="toggle/accessibility.values"}

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

| Keyboard | What happens | Not |
| --- | --- | --- |
| undefined | Space or Enter presses it. | undefined |

Test before you ship:

- [ ] It says whether it is pressed. undefined

## Use it in code

```bash
npx open-ds add toggle
```

The component reads only component keys and semantic tokens, so it follows the brand and mode on `<html>`.

## Tokens it reads

Toggle reads 23 tokens of its own, each an alias of a semantic token. Each row is one part: its own token, the semantic it aliases, and the value it ends at. Change a semantic and every component that reads it follows; override one of Toggle's tokens to change Toggle alone.

::token-table{component="toggle"}
