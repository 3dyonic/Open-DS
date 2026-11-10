---
composite_data: "./elevation.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Elevation"
description: "Dense data: When something rises above the page, and what separates groups."
---

# Elevation

When something rises above the page, and what separates groups.

::token-swatches{id="elevation"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What rises above the page? | Only what floats | Only menus and dialogs float; cards use lines. |
| How many shadow levels exist? | One | One shadow for everything that floats. |
| What separates groups on the page? | Lines | Thin lines guide the eye along rows. |
| How soft are shadows? | Subtle | Subtle shadows keep the grid crisp. |
| Where does elevation show? | Menus and dialogs | Menus and dialogs are the only layers. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Mode | Points to |
| --- | --- | --- |
| `elevation.card` | light | `dense-data.theme.light.elevation.card` → `shadow.none` |
| | dark | `dense-data.theme.dark.elevation.card` → `shadow.none` |
| `elevation.overlay` | light | `dense-data.theme.light.elevation.overlay` → `shadow.overlay` |
| | dark | `dense-data.theme.dark.elevation.overlay` → `shadow.overlay-dark` |

The raw values these tokens end at are on [Primitives › Effects](../primitives/effects).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A card on the page | A hairline border, no shadow | A shadow | On a busy grid, lines separate. Shadows blur the edges. |
| A menu or dialog | elevation.overlay and a dimmed page for dialogs | A border only | Floating things need a shadow so they read as on top. |
