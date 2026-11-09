---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Multi-brand: Corners and borders."
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
| Which shape roles does it need? | Controls, badges and containers | Each brand sets three corners. |
| How many corner sizes exist? | Three | Control, badge and container. |
| How are corners set? | Set by each brand | Each brand sets its own corners. |
| What should control corners say? | Rounded | Rounded by default; each brand sets its own corner. |
| Where does shape show most? | Buttons and badges | Corners are the most visible brand difference. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster" name="Aster"}
| Token | Points to |
| --- | --- |
| `radius.control` | `aster.theme.base.radius.control` → `radius.4` |
| `radius.badge` | `aster.theme.base.radius.badge` → `radius.4` |
| `radius.option` | `aster.theme.base.radius.option` → `radius.4` |
| `radius.container` | `aster.theme.base.radius.container` → `radius.8` |
| `radius.round` | `radius.full` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `border-width.2` |
| `border-width.focus-offset` | `border-width.2` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to |
| --- | --- |
| `radius.control` | `birch.theme.base.radius.control` → `radius.12` |
| `radius.badge` | `birch.theme.base.radius.badge` → `radius.999` |
| `radius.option` | `birch.theme.base.radius.option` → `radius.12` |
| `radius.container` | `birch.theme.base.radius.container` → `radius.16` |
| `radius.round` | `radius.full` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `border-width.2` |
| `border-width.focus-offset` | `border-width.2` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to |
| --- | --- |
| `radius.control` | `coral.theme.base.radius.control` → `radius.999` |
| `radius.badge` | `coral.theme.base.radius.badge` → `radius.999` |
| `radius.option` | `coral.theme.base.radius.option` → `radius.16` |
| `radius.container` | `coral.theme.base.radius.container` → `radius.20` |
| `radius.round` | `radius.full` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `border-width.2` |
| `border-width.focus-offset` | `border-width.2` |
::::

The raw values these tokens end at are on [Primitives › Shape](../primitives/shape).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Corners of buttons and inputs | radius.control (set by the brand) | A hard-coded radius | Each brand sets its own corner through the theme. |
| Shape of a status badge | radius.badge (set by the brand) | A hard-coded shape | The brand sets the badge shape. |
