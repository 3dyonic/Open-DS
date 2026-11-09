---
composite_data: "./accessibility.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Multi-brand: Floors the system must hold."
---

# Accessibility

Floors the system must hold.

::token-swatches{id="accessibility"}

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

::::brand{id="aster" name="Aster"}
| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `size.control.default` | `size.44` | `size.44` |
| `size.control.compact` | `size.36` | `size.36` |
| `size.control.large` | `size.44` | `size.44` |
| `opacity.disabled` | `opacity.40` | `opacity.40` |
| `color.border.focus` | `aster.theme.light.color.border.focus` → `color.teal.light.600` | `aster.theme.dark.color.border.focus` → `color.teal.dark.600` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `size.control.default` | `size.44` | `size.44` |
| `size.control.compact` | `size.36` | `size.36` |
| `size.control.large` | `size.44` | `size.44` |
| `opacity.disabled` | `opacity.40` | `opacity.40` |
| `color.border.focus` | `birch.theme.light.color.border.focus` → `color.purple.light.600` | `birch.theme.dark.color.border.focus` → `color.purple.dark.600` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `size.control.default` | `size.44` | `size.44` |
| `size.control.compact` | `size.36` | `size.36` |
| `size.control.large` | `size.44` | `size.44` |
| `opacity.disabled` | `opacity.40` | `opacity.40` |
| `color.border.focus` | `coral.theme.light.color.border.focus` → `color.orange.light.600` | `coral.theme.dark.color.border.focus` → `color.orange.dark.600` |
::::

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring (from the brand) | Removing the outline | Focus follows the brand but always shows. |
| The smallest clickable thing | size.control.default (touch) | A compact control | Customers are often on phones. |
