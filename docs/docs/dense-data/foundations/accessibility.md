---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Dense data: Floors the system must hold."
---

# Accessibility

Floors the system must hold.

- :sample{kind="bar" value="var(--size-control-default)"} `size.control.default`
- :sample{kind="bar" value="var(--size-control-compact)"} `size.control.compact`
- :sample{kind="bar" value="var(--size-control-large)"} `size.control.large`
- :sample{kind="opacity" value="var(--opacity-disabled)"} `opacity.disabled`
- :sample{kind="color" value="var(--color-border-focus)"} `color.border.focus`

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

| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `size.control.default` | `size.32` | `size.32` |
| `size.control.compact` | `size.24` | `size.24` |
| `size.control.large` | `size.32` | `size.32` |
| `opacity.disabled` | `opacity.40` | `opacity.40` |
| `color.border.focus` | `dense-data.theme.light.color.border.focus` → `color.violet.light.600` | `dense-data.theme.dark.color.border.focus` → `color.violet.dark.600` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring at border-width.focus | Removing the outline | Keyboard users must always see where they are. |
| The smallest clickable thing | size.control.compact | Anything smaller | Compact still fits a mouse. Touch is not this product's input. |
