---
composite_data: "./toggle.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 61
title: "Toggle"
description: "Toggle in Accessible first."
---

# Toggle

A button that stays pressed or not.

:label[In Accessible first]{tone="info"}

## See it live

::preview{id="toggle/live"}

## When to use it

**In Accessible first:** Turning a mode on and off, with a word on the button. Not a form answer or a one-off action.

- **Use it when:** Turning a mode or format on and off in a toolbar, such as bold.
- **Not when:** A setting saved at once (switch), or a one-off action (button).

Instead:

- [Switch](./switch.md): A setting.
- [Button](./button.md): A one-off action.
- [Toggle group](./toggle-group.md): Several toggles together.

## Variants

What each variant is for in any design system, then what Accessible first decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Accessible first" tone="neutral"}
::preview{id="toggle/variant/default"}

**What it is for**

No border; the pressed state shows as a fill.

- ✓ Toolbars where toggles sit together.
- ✕ A toggle alone on a busy background.

**In Accessible first**

Every action looks like a control people can find, so the toggle keeps its border.

**Because**

- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
- [What separates groups on the page? **Lines**](#why-elevation-definition) · `elevation.definition`
:::

:::panel{title="outline" note="variant" label="Used in Accessible first" tone="success"}
::preview{id="toggle/variant/outline"}

**What it is for**

A border, so the toggle reads as a control at rest.

- ✓ A toggle that stands alone.
- ✕ A dense toolbar of many toggles.

**In Accessible first**

Every toggle, with a strong border and a word, so it reads as a control at any zoom.

**Because**

- [What separates groups on the page? **Lines**](#why-elevation-definition) · `elevation.definition`
- [What do icons do? **Actions and status**](#why-iconography-roles) · `iconography.roles`
:::

:::panel{title="default" note="size" label="Used in Accessible first" tone="success"}
::preview{id="toggle/size/default"}

**What it is for**

The normal size.

- ✓ Most toolbars.
- ✕ Very dense toolbars.

**In Accessible first**

Every toggle. Large targets help people with motor needs.

**Because**

- [What is the smallest target? **Large**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="sm" note="size" label="Not used in Accessible first" tone="neutral"}
::preview{id="toggle/size/sm"}

**What it is for**

A smaller toggle.

- ✓ Dense toolbars and compact panels.
- ✕ Touch screens.

**In Accessible first**

Large targets help people with motor needs; nothing smaller.

**Because**

- [What is the smallest target? **Large**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="lg" note="size" label="Not used in Accessible first" tone="neutral"}
::preview{id="toggle/size/lg"}

**What it is for**

A larger toggle.

- ✓ A few toggles that need to be easy to hit.
- ✕ Dense toolbars.

**In Accessible first**

The default size is already large for motor needs; a bigger one adds nothing.

**Because**

- [What is the smallest target? **Large**](#why-accessibility-values) · `accessibility.values`
:::

::card-grid{id="anatomy-link/toggle"}

## Why it works this way

Toggle looks the way it does because of 4 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Toggle, and what would move if it changed.

::reason-chain{id="toggle/human.q2"}

::reason-chain{id="toggle/elevation.definition"}

::reason-chain{id="toggle/iconography.roles"}

::reason-chain{id="toggle/accessibility.values"}

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
