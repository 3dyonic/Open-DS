---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Accessible first: Corners and borders."
---

# Shape

Corners and borders.

- :sample{kind="radius" value="var(--radius-control)"} `radius.control`
- :sample{kind="radius" value="var(--radius-badge)"} `radius.badge`
- :sample{kind="radius" value="var(--radius-option)"} `radius.option`
- :sample{kind="radius" value="var(--radius-container)"} `radius.container`
- :sample{kind="radius" value="var(--radius-round)"} `radius.round`
- :sample{kind="line" value="var(--border-width-default)"} `border-width.default`
- :sample{kind="line" value="var(--border-width-focus)"} `border-width.focus`
- :sample{kind="line" value="var(--border-width-focus-offset)"} `border-width.focus-offset`

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which shape roles does it need? | Controls, badges and containers | Badges keep a clear rectangle. |
| How many corner sizes exist? | Three | Control, badge and container corners differ. |
| How are corners set? | Fixed for the product | One brand, one set of corners. |
| What should control corners say? | Slightly rounded | Clear, slightly rounded controls. |
| Where does shape show most? | Controls and cards | Corners show on controls and step cards. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `radius.control` | `accessible-first.theme.base.radius.control` → `radius.6` |
| `radius.badge` | `accessible-first.theme.base.radius.badge` → `radius.4` |
| `radius.option` | `accessible-first.theme.base.radius.option` → `radius.4` |
| `radius.container` | `accessible-first.theme.base.radius.container` → `radius.8` |
| `radius.round` | `radius.full` |
| `border-width.default` | `border-width.2` |
| `border-width.focus` | `border-width.3` |
| `border-width.focus-offset` | `border-width.2` |

The raw values these tokens end at are on [Primitives › Shape](../primitives/shape).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Corners of buttons and inputs | radius.control | A pill | Clear rectangles read as fields and buttons. |
| Shape of a status badge | radius.badge (rectangle) | A pill | Clear shapes with a word inside. |
