---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Dense data: Corners and borders."
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
| Which shape roles does it need? | Controls, badges and containers | Badges sit in columns and need their own corner. |
| How many corner sizes exist? | Three | Control, badge and container corners differ. |
| How are corners set? | Fixed for the product | One brand, one fixed set of corners. |
| What should control corners say? | Slightly rounded | Small corners keep dense rows straight. |
| Where does shape show most? | Controls in dense rows | Corners show most on controls in dense rows. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `radius.control` | `dense-data.theme.base.radius.control` → `radius.2` |
| `radius.badge` | `dense-data.theme.base.radius.badge` → `radius.0` |
| `radius.option` | `dense-data.theme.base.radius.option` → `radius.0` |
| `radius.container` | `dense-data.theme.base.radius.container` → `radius.4` |
| `radius.round` | `radius.full` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `border-width.2` |
| `border-width.focus-offset` | `border-width.2` |

The raw values these tokens end at are on [Primitives › Shape](../primitives/shape).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Corners of buttons and inputs | radius.control | radius.round | Small corners keep dense rows straight. |
| Shape of a status badge | radius.badge (rectangle) | A pill | Rectangles line up in a column. |
