---
composite_data: "./shape.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Dense data: Corners and borders."
---

# Shape

Corners and borders.

::token-groups{id="shape"}

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
| `radius.element` | `dense-data.theme.base.radius.element` → `radius.2` |
| `radius.surface` | `dense-data.theme.base.radius.surface` → `radius.4` |
| `radius.container` | `radius.surface` → `dense-data.theme.base.radius.surface` → `radius.4` |
| `border-width.default` | `border-width.1` |
| `border-width.focus` | `focus.ring.width` → `border-width.2` |
| `border-width.focus-offset` | `focus.ring.offset` → `border-width.2` |

The raw values these tokens end at are on [Primitives › Shape](../primitives/shape).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Corners of buttons and inputs | radius.control | radius.round | Small corners keep dense rows straight. |
| Shape of a status badge | radius.badge (rectangle) | A pill | Rectangles line up in a column. |
| An option in a menu or list | radius.option | radius.control | Options sit square inside the menu. A long list scans as one clean column. |
| Something that grows past one line | radius.element | radius.surface | Rows and text areas keep the small control corner, so long lists stay straight. |
| Corners of cards, menus and dialogs | radius.surface | radius.control | Cards and menus get a corner just softer than controls. Panels still tile neatly on a busy screen. |
| Edges and dividers | border-width.default | A thicker border | A hairline separates rows and cards without taking room from the data. |
| The gap around a focus ring | focus.ring.offset | A ring that touches the control | The gap keeps the ring clear of the control. Keyboard users see which row has focus and act on the right one. |
