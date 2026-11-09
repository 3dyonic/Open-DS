---
composite_data: "./elevation.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Elevation"
description: "Content first: When something rises above the page, and what separates groups."
---

# Elevation

When something rises above the page, and what separates groups.

::token-swatches{id="elevation"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What rises above the page? | Only what floats | Only menus and dialogs float. |
| How many shadow levels exist? | One | One shadow for floating things. |
| What separates groups on the page? | Space | Space separates groups; lines would interrupt reading. |
| How soft are shadows? | Soft | Soft shadows suit warm paper. |
| Where does elevation show? | Menus and dialogs | Menus and dialogs are the only layers. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `elevation.card` | `content-first.theme.light.elevation.card` → `shadow.none` | `content-first.theme.dark.elevation.card` → `shadow.none` |
| `elevation.overlay` | `content-first.theme.light.elevation.overlay` → `shadow.overlay` | `content-first.theme.dark.elevation.overlay` → `shadow.overlay-dark` |

The raw values these tokens end at are on [Primitives › Effects](../primitives/effects).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A card on the page | A border, no shadow | A strong shadow | Cards stay flat on the page; shadows are for floating things. |
| A menu or dialog | elevation.overlay and a dimmed page | No shadow | The dimmed page focuses the reader on the dialog. |
