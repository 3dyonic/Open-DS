---
composite_data: "./elevation.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Elevation"
description: "Multi-brand: When something rises above the page, and what separates groups."
---

# Elevation

When something rises above the page, and what separates groups.

::token-groups{id="elevation"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What rises above the page? | Cards too | Cards lift slightly to group offers. |
| How many shadow levels exist? | Two | One shadow for cards, one for overlays. |
| What separates groups on the page? | Cards | Cards group plans and offers. |
| How soft are shadows? | Soft | Soft shadows fit every brand. |
| Where does elevation show? | Cards, menus and dialogs | Cards, menus and dialogs rise. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster"}
| Token | Mode | Points to |
| --- | --- | --- |
| `elevation.card` | light | `aster.theme.light.elevation.card` → `shadow.card` |
| | dark | `aster.theme.dark.elevation.card` → `shadow.card-dark` |
| `elevation.overlay` | light | `aster.theme.light.elevation.overlay` → `shadow.overlay` |
| | dark | `aster.theme.dark.elevation.overlay` → `shadow.overlay-dark` |
::::

::::brand{id="birch"}
| Token | Mode | Points to |
| --- | --- | --- |
| `elevation.card` | light | `birch.theme.light.elevation.card` → `shadow.card` |
| | dark | `birch.theme.dark.elevation.card` → `shadow.card-dark` |
| `elevation.overlay` | light | `birch.theme.light.elevation.overlay` → `shadow.overlay` |
| | dark | `birch.theme.dark.elevation.overlay` → `shadow.overlay-dark` |
::::

::::brand{id="coral"}
| Token | Mode | Points to |
| --- | --- | --- |
| `elevation.card` | light | `coral.theme.light.elevation.card` → `shadow.card` |
| | dark | `coral.theme.dark.elevation.card` → `shadow.card-dark` |
| `elevation.overlay` | light | `coral.theme.light.elevation.overlay` → `shadow.overlay` |
| | dark | `coral.theme.dark.elevation.overlay` → `shadow.overlay-dark` |
::::

The raw values these tokens end at are on [Primitives › Effects](../primitives/effects).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A card on the page | elevation.card | A border only | Cards lift slightly to group offers. |
| A menu or dialog | elevation.overlay and a dimmed page | No shadow | The shadow shows a menu or dialog floats above the page. Without it, it blends into the cards. |
