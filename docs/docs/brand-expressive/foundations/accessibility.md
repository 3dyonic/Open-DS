---
composite_data: "./accessibility.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 9
title: "Accessibility"
description: "Brand expressive: Floors the system must hold."
---

# Accessibility

Floors the system must hold.

::token-groups{id="accessibility"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which states get their own visible value? | Those and pressed | Pressed for touch. |
| How many signals carry each meaning? | Two: color and word | Color and word. |
| What contrast floor do we hold? | AA | AA, checked on every vivid color. |
| What is the smallest target? | Touch size | Visitors come from social posts on phones. |
| Where are the floors hardest to hold? | Brand color | Vivid brand color is the hardest to keep readable. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Mode | Points to |
| --- | --- | --- |
| `size.control.default` | light | `size.52` |
| | dark | `size.52` |
| `size.control.compact` | light | `size.44` |
| | dark | `size.44` |
| `size.control.large` | light | `size.60` |
| | dark | `size.60` |
| `opacity.disabled` | light | `opacity.40` |
| | dark | `opacity.40` |
| `color.border.focus` | light | `brand-expressive.theme.light.color.border.focus` → `color.pink.light.600` |
| | dark | `brand-expressive.theme.dark.color.border.focus` → `color.pink.dark.600` |
| `focus.ring.width` | light | `border-width.3` |
| | dark | `border-width.3` |
| `focus.ring.offset` | light | `border-width.2` |
| | dark | `border-width.2` |
| `size.hit-area` | light | `size.44` |
| | dark | `size.44` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Keyboard focus | button/focus-ring at focus.ring.width | Removing the outline | Focus must show on vivid color. |
| The smallest clickable thing | size.control.default (touch) | A compact control | Most visitors arrive on phones, and a compact control is too small for a thumb. |
| Most buttons and inputs | size.control.default | size.control.compact | Most visitors arrive on phones, so every control fits a thumb. |
| The main action on a screen | size.control.large | size.control.default | The sign-up button is the one loud call to action. A bigger button wins the eye and the thumb. |
| A button inside a field | size.control.compact | A small icon button | It still fits a thumb and sits inside the pill field. |
| A control that is not available yet | color.disabled.*, never opacity | Hiding the button | Muted colors keep the layout and the label readable. The vivid color returns when the visitor can sign up. |
