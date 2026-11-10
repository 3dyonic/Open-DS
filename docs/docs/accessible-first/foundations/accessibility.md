---
composite_data: "./accessibility.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Accessible first: Floors the system must hold."
---

# Accessibility

Floors the system must hold.

::token-swatches{id="accessibility"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which states get their own visible value? | All, including loading | Every state, including loading, gets its own value. |
| How many signals carry each meaning? | Three: color, icon and word | Never color alone. |
| What contrast floor do we hold? | AAA for text | AAA contrast for text. |
| What is the smallest target? | Large | Large targets for tremor and touch. |
| Where are the floors hardest to hold? | Forms | Forms are where people are blocked. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Mode | Points to |
| --- | --- | --- |
| `size.control.default` | light | `size.52` |
| | dark | `size.52` |
| `size.control.compact` | light | `size.48` |
| | dark | `size.48` |
| `size.control.large` | light | `size.52` |
| | dark | `size.52` |
| `opacity.disabled` | light | `opacity.50` |
| | dark | `opacity.50` |
| `color.border.focus` | light | `accessible-first.theme.light.color.border.focus` → `color.blue.light.600` |
| | dark | `accessible-first.theme.dark.color.border.focus` → `color.blue.dark.600` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring at border-width.focus, with an offset | A thin or faint outline | Focus must be seen by everyone. |
| The smallest clickable thing | size.control.default (large) | Touch-minimum size | Large targets help people with motor needs. |
