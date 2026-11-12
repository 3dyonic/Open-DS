---
composite_data: "./accessibility.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Multi-brand: Floors the system must hold."
---

# Accessibility

Floors the system must hold.

::token-groups{id="accessibility"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which states get their own visible value? | Those and pressed | Pressed for touch. |
| How many signals carry each meaning? | Two: color and word | Brand colors vary, so meaning needs a word. |
| What contrast floor do we hold? | AA | AA in every brand and mode. |
| What is the smallest target? | Touch size | Customers sign up on phones. |
| Where are the floors hardest to hold? | Brand color | Brand colors must pass in every mode. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster"}
| Token | Mode | Points to |
| --- | --- | --- |
| `size.control.default` | light | `size.44` |
| | dark | `size.44` |
| `size.control.compact` | light | `size.36` |
| | dark | `size.36` |
| `size.control.large` | light | `size.44` |
| | dark | `size.44` |
| `opacity.disabled` | light | `opacity.40` |
| | dark | `opacity.40` |
| `color.border.focus` | light | `aster.theme.light.color.border.focus` → `color.teal.light.600` |
| | dark | `aster.theme.dark.color.border.focus` → `color.teal.dark.600` |
| `focus.ring.width` | light | `border-width.2` |
| | dark | `border-width.2` |
| `focus.ring.offset` | light | `border-width.2` |
| | dark | `border-width.2` |
| `size.hit-area` | light | `size.44` |
| | dark | `size.44` |
::::

::::brand{id="birch"}
| Token | Mode | Points to |
| --- | --- | --- |
| `size.control.default` | light | `size.44` |
| | dark | `size.44` |
| `size.control.compact` | light | `size.36` |
| | dark | `size.36` |
| `size.control.large` | light | `size.44` |
| | dark | `size.44` |
| `opacity.disabled` | light | `opacity.40` |
| | dark | `opacity.40` |
| `color.border.focus` | light | `birch.theme.light.color.border.focus` → `color.purple.light.600` |
| | dark | `birch.theme.dark.color.border.focus` → `color.purple.dark.600` |
| `focus.ring.width` | light | `border-width.2` |
| | dark | `border-width.2` |
| `focus.ring.offset` | light | `border-width.2` |
| | dark | `border-width.2` |
| `size.hit-area` | light | `size.44` |
| | dark | `size.44` |
::::

::::brand{id="coral"}
| Token | Mode | Points to |
| --- | --- | --- |
| `size.control.default` | light | `size.44` |
| | dark | `size.44` |
| `size.control.compact` | light | `size.36` |
| | dark | `size.36` |
| `size.control.large` | light | `size.44` |
| | dark | `size.44` |
| `opacity.disabled` | light | `opacity.40` |
| | dark | `opacity.40` |
| `color.border.focus` | light | `coral.theme.light.color.border.focus` → `color.orange.light.600` |
| | dark | `coral.theme.dark.color.border.focus` → `color.orange.dark.600` |
| `focus.ring.width` | light | `border-width.2` |
| | dark | `border-width.2` |
| `focus.ring.offset` | light | `border-width.2` |
| | dark | `border-width.2` |
| `size.hit-area` | light | `size.44` |
| | dark | `size.44` |
::::

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring (from the brand) at focus.ring.width | Removing the outline | Focus follows the brand but always shows. |
| The smallest clickable thing | size.control.default (touch) | A compact control | Customers are often on phones. |
| Most buttons and inputs | size.control.default | size.control.compact | Customers sign up on phones, so every control fits a thumb in every brand. |
| The main action on a screen | size.control.large | A taller button for one brand | It is the same height as the default here. Brand color marks the main action. One height keeps every brand's forms the same. |
| A button inside a field | size.control.compact | size.control.default | A clear or show-password button fits inside the field in every brand. |
| A control that is not available yet | color.disabled.*, never opacity | A grey color per brand | One set of muted colors works under every brand, and the label stays readable where a fade would lose it. |
