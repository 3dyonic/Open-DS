---
composite_data: "./shape.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Multi-brand: Corners and borders."
---

# Shape

Corners and borders.

::token-groups{id="shape"}

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
| `radius.element` | `aster.theme.base.radius.element` → `radius.4` |
| `radius.surface` | `aster.theme.base.radius.surface` → `radius.8` |
| `radius.container` | `radius.surface` → `aster.theme.base.radius.surface` → `radius.8` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `border-width.2` |
| `border-width.focus-offset` | `border-width.2` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to |
| --- | --- |
| `radius.control` | `birch.theme.base.radius.control` → `radius.12` |
| `radius.badge` | `birch.theme.base.radius.badge` → `radius.pill` |
| `radius.option` | `birch.theme.base.radius.option` → `radius.12` |
| `radius.element` | `birch.theme.base.radius.element` → `radius.12` |
| `radius.surface` | `birch.theme.base.radius.surface` → `radius.16` |
| `radius.container` | `radius.surface` → `birch.theme.base.radius.surface` → `radius.16` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `border-width.2` |
| `border-width.focus-offset` | `border-width.2` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to |
| --- | --- |
| `radius.control` | `coral.theme.base.radius.control` → `radius.pill` |
| `radius.badge` | `coral.theme.base.radius.badge` → `radius.pill` |
| `radius.option` | `coral.theme.base.radius.option` → `radius.16` |
| `radius.element` | `coral.theme.base.radius.element` → `radius.12` |
| `radius.surface` | `coral.theme.base.radius.surface` → `radius.20` |
| `radius.container` | `radius.surface` → `coral.theme.base.radius.surface` → `radius.20` |
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
| An option in a menu or list | radius.option | A hard-coded radius | (set by the brand). Each brand sets the option corner, and it nests inside that brand's menu corner. |
| Something that grows past one line | radius.element | radius.control | (set by the brand). A brand with pill controls would turn a text area into a capsule. The element corner stays sane in every brand. |
| Corners of cards, menus and dialogs | radius.surface | A hard-coded radius | (set by the brand). Each brand sets its own card corner; the role stays shared. |
| Edges and dividers | border-width.default | A brand-specific border width | One thin edge serves every brand. Color carries the brand, not line weight. |
| The gap around a focus ring | border-width.focus-offset and border-width.focus | A ring that touches the control | The gap sits around a ring of border-width.focus. The ring and its gap stay the same in every brand, so focus shows on any brand color. |
