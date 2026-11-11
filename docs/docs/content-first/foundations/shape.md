---
composite_data: "./shape.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Content first: Corners and borders."
---

# Shape

Corners and borders.

::token-swatches{id="shape"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which shape roles does it need? | Controls, badges and containers | Pill badges differ from controls. |
| How many corner sizes exist? | Three | Control, badge and container corners differ. |
| How are corners set? | Fixed for the product | One brand, one set of corners. |
| What should control corners say? | Rounded | Rounded corners feel friendly. |
| Where does shape show most? | Controls and cards | Corners show on buttons and article cards. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `radius.control` | `content-first.theme.base.radius.control` → `radius.8` |
| `radius.badge` | `content-first.theme.base.radius.badge` → `radius.pill` |
| `radius.option` | `content-first.theme.base.radius.option` → `radius.8` |
| `radius.element` | `content-first.theme.base.radius.element` → `radius.8` |
| `radius.surface` | `content-first.theme.base.radius.surface` → `radius.12` |
| `radius.container` | `radius.surface` → `content-first.theme.base.radius.surface` → `radius.12` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `border-width.2` |
| `border-width.focus-offset` | `border-width.2` |

The raw values these tokens end at are on [Primitives › Shape](../primitives/shape).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Corners of buttons and inputs | radius.control (rounded) | Sharp corners | Rounded corners match the warm reading tone. Sharp corners feel technical next to long text. |
| Shape of a status badge | radius.badge (pill) | A rectangle | Pills sit softly next to text. |
