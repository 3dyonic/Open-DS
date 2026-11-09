---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Accessible first: Floors the system must hold."
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
| Which states get their own visible value? | All, including loading | Every state, including loading, gets its own value. |
| How many signals carry each meaning? | Three: color, icon and word | Never color alone. |
| What contrast floor do we hold? | AAA for text | AAA contrast for text. |
| What is the smallest target? | Large | Large targets for tremor and touch. |
| Where are the floors hardest to hold? | Forms | Forms are where people are blocked. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `size.control.default` | `size.52` | `size.52` |
| `size.control.compact` | `size.48` | `size.48` |
| `size.control.large` | `size.52` | `size.52` |
| `opacity.disabled` | `opacity.50` | `opacity.50` |
| `color.border.focus` | `accessible-first.theme.light.color.border.focus` → `color.blue.light.600` | `accessible-first.theme.dark.color.border.focus` → `color.blue.dark.600` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring at border-width.focus, with an offset | A thin or faint outline | Focus must be seen by everyone. |
| The smallest clickable thing | size.control.default (large) | Touch-minimum size | Large targets help people with motor needs. |
