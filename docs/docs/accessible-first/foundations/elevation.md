---
composite_data: "./elevation.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Elevation"
description: "Accessible first: When something rises above the page, and what separates groups."
---

# Elevation

When something rises above the page, and what separates groups.

::token-swatches{id="elevation"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What rises above the page? | Nothing | Flat is easier to read at high zoom. |
| How many shadow levels exist? | None | No shadows. |
| What separates groups on the page? | Lines | Strong borders separate groups at any zoom. |
| How soft are shadows? | No shadows | No shadows; borders do the work. |
| Where does elevation show? | Dialogs only | Only dialogs separate, with a dimmed page and a border. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `elevation.card` | `accessible-first.theme.light.elevation.card` → `shadow.none` | `accessible-first.theme.dark.elevation.card` → `shadow.none` |
| `elevation.overlay` | `accessible-first.theme.light.elevation.overlay` → `shadow.none` | `accessible-first.theme.dark.elevation.overlay` → `shadow.none` |

The raw values these tokens end at are on [Primitives › Effects](../primitives/effects).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A card on the page | A strong border, no shadow | A shadow | Shadows are hard to see; borders are not. |
| A menu or dialog | A strong border and a dimmed page | A shadow only | The dimmed page makes the dialog obvious. |
