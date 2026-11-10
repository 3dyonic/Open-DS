---
composite_data: "./accessibility.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Content first: Floors the system must hold."
---

# Accessibility

Floors the system must hold.

::token-swatches{id="accessibility"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which states get their own visible value? | Those and pressed | Pressed gets its own value for touch. |
| How many signals carry each meaning? | Two: color and word | Status is rare; color and a word are enough. |
| What contrast floor do we hold? | AA | AA contrast, with large text helping further. |
| What is the smallest target? | Touch size | Readers are often on phones. |
| Where are the floors hardest to hold? | Long text | Long text needs steady contrast and line length. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Mode | Points to |
| --- | --- | --- |
| `size.control.default` | light | `size.48` |
| | dark | `size.48` |
| `size.control.compact` | light | `size.40` |
| | dark | `size.40` |
| `size.control.large` | light | `size.48` |
| | dark | `size.48` |
| `opacity.disabled` | light | `opacity.40` |
| | dark | `opacity.40` |
| `color.border.focus` | light | `content-first.theme.light.color.border.focus` → `color.navy.light.600` |
| | dark | `content-first.theme.dark.color.border.focus` → `color.navy.dark.600` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring at border-width.focus | Removing the outline | Keyboard users must always see where they are. |
| The smallest clickable thing | size.control.default (touch) | A compact control | Many readers are on phones. |
