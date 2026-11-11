---
composite_data: "./accessibility.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Dense data: Floors the system must hold."
---

# Accessibility

Floors the system must hold.

::token-groups{id="accessibility"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which states get their own visible value? | Hover, focus, disabled | Pressed reuses hover; experts do not need more. |
| How many signals carry each meaning? | Three: color, icon and word | Many statuses share one table; color alone is not enough. |
| What contrast floor do we hold? | AA | AA contrast for every text. |
| What is the smallest target? | Compact, for a pointer | Mouse and keyboard; compact targets are enough. |
| Where are the floors hardest to hold? | Dense tables | Small text and thin lines in tables need the most care. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Mode | Points to |
| --- | --- | --- |
| `size.control.default` | light | `size.32` |
| | dark | `size.32` |
| `size.control.compact` | light | `size.24` |
| | dark | `size.24` |
| `size.control.large` | light | `size.32` |
| | dark | `size.32` |
| `opacity.disabled` | light | `opacity.40` |
| | dark | `opacity.40` |
| `color.border.focus` | light | `dense-data.theme.light.color.border.focus` → `color.violet.light.600` |
| | dark | `dense-data.theme.dark.color.border.focus` → `color.violet.dark.600` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring at border-width.focus | Removing the outline | Keyboard users must always see where they are. |
| The smallest clickable thing | size.control.compact | Anything smaller | Compact still fits a mouse. Touch is not this product's input. |
| Most buttons and inputs | size.control.default | size.control.large | Buttons and inputs fit a mouse and keep toolbars short. |
| The main action on a screen | size.control.large | A taller button for the main action | It is the same height as the default here. Color and place mark the main action. One height keeps toolbar buttons in line. |
| A button inside a field | size.control.compact | size.control.default | A clear or step button fits inside the field, so the field keeps its row height. |
| A control that is not available yet | opacity.disabled | Hiding the control | A faded control stays in its place. Experts keep their bearings and see the action will come back. |
