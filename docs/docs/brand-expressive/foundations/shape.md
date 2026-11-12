---
composite_data: "./shape.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Brand expressive: Corners and borders."
---

# Shape

Corners and borders.

::token-groups{id="shape"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which shape roles does it need? | Controls and containers | Pills everywhere; badges share the control corner. |
| How many corner sizes exist? | Two | Pill controls and large container corners. |
| How are corners set? | Fixed for the product | One brand, one set of corners. |
| What should control corners say? | Pill | Pill controls feel playful. |
| Where does shape show most? | Buttons and badges | Pill buttons are the signature shape. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `radius.control` | `brand-expressive.theme.base.radius.control` → `radius.pill` |
| `radius.badge` | `brand-expressive.theme.base.radius.badge` → `radius.pill` |
| `radius.option` | `brand-expressive.theme.base.radius.option` → `radius.20` |
| `radius.element` | `brand-expressive.theme.base.radius.element` → `radius.12` |
| `radius.surface` | `brand-expressive.theme.base.radius.surface` → `radius.24` |
| `radius.container` | `radius.surface` → `brand-expressive.theme.base.radius.surface` → `radius.24` |
| `border-width.default` | `border-width.2` |
| `border-width.focus` | `focus.ring.width` → `border-width.3` |
| `border-width.focus-offset` | `focus.ring.offset` → `border-width.2` |

The raw values these tokens end at are on [Primitives › Shape](../primitives/shape).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Corners of buttons and inputs | radius.control (pill) | Sharp corners | Pills match the brand's round, playful shapes. Sharp corners would feel corporate. |
| Shape of a status badge | radius.badge (pill) | A rectangle | Pills match the controls. |
| An option in a menu or list | radius.option | radius.control | Round options nest inside the round menu, so a menu feels as playful as the buttons. |
| Something that grows past one line | radius.element | radius.control | A pill corner breaks when a text area grows to many lines. The element corner stays round at any height. |
| Corners of cards, menus and dialogs | radius.surface | Small corners | Big round corners make cards feel like friendly objects. |
| Edges and dividers | border-width.default | A hairline | A bold edge matches the bold type and vivid color. |
| The gap around a focus ring | focus.ring.offset | A ring that touches the control | The gap keeps the ring visible on vivid fills. |
