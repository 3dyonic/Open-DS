---
composite_data: "./toggle.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 60
title: "Toggle"
description: "Toggle in Multi-brand."
---

# Toggle

A button that stays pressed or not.

:label[In Multi-brand]{tone="info"}

## See it live

::preview{robot="slumber" id="toggle/live"}

## When to use it

**In Multi-brand:** One mode turned on or off in place. Not for account settings, which use switch, or one-off actions, which use button.

- **Use it when:** Turning a mode or format on and off in a toolbar, such as bold.
- **Not when:** A setting saved at once (switch), or a one-off action (button).

Instead:

- [Switch](./switch.md): A setting.
- [Button](./button.md): A one-off action.
- [Toggle group](./toggle-group.md): Several toggles together.

## Variants

What each variant is for in any design system, then what Multi-brand decided and why. Each sample is the live story with that variant set.

:::panel{title="default" note="variant" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="toggle/variant/default"}

**What it is for**

No border; the pressed state shows as a fill.

- ✓ Toolbars where toggles sit together.
- ✕ A toggle alone on a busy background.

**In Multi-brand**

Toggles that sit together, like monthly or yearly prices, use toggle-group.

**Because**

- [How does a component earn its place? **Its family is in the roles, so product teams find it ready**](#why-components-definition) · `components.definition`
:::

:::panel{title="outline" note="variant" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="toggle/variant/outline"}

**What it is for**

A border, so the toggle reads as a control at rest.

- ✓ A toggle that stands alone.
- ✕ A dense toolbar of many toggles.

**In Multi-brand**

A single toggle, with a border so it reads as a control in every brand.

**Because**

- [How do people recall the interface? **They see it fresh each time**](#why-human-q2) · `human.q2`
- [How are brands handled? **Brands as modes**](#why-theming-definition) · `theming.definition`
:::

:::panel{title="default" note="size" label="Used in Multi-brand" tone="success"}
::preview{robot="slumber" id="toggle/size/default"}

**What it is for**

The normal size.

- ✓ Most toolbars.
- ✕ Very dense toolbars.

**In Multi-brand**

Every toggle, at touch size: customers are often on phones.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="sm" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="toggle/size/sm"}

**What it is for**

A smaller toggle.

- ✓ Dense toolbars and compact panels.
- ✕ Touch screens.

**In Multi-brand**

Customers are often on phones: no compact controls.

**Because**

- [What is the smallest target? **Touch size**](#why-accessibility-values) · `accessibility.values`
:::

:::panel{title="lg" note="size" label="Not used in Multi-brand" tone="neutral"}
::preview{robot="slumber" id="toggle/size/lg"}

**What it is for**

A larger toggle.

- ✓ A few toggles that need to be easy to hit.
- ✕ Dense toolbars.

**In Multi-brand**

One density across brands.

**Because**

- [How many densities exist? **One**](#why-spacing-count) · `spacing.count`
:::

::card-grid{id="anatomy-link/toggle"}

## Why it works this way

Toggle looks the way it does because of 5 answers about this product. Each card is one answer, in three steps: the answer, what it decided for Toggle, and what would move if it changed.

::reason-chain{id="toggle/components.definition"}

::reason-chain{id="toggle/human.q2"}

::reason-chain{id="toggle/theming.definition"}

::reason-chain{id="toggle/accessibility.values"}

::reason-chain{id="toggle/spacing.count"}

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
