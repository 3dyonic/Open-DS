---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Elevation"
description: "Brand expressive: When something rises above the page, and what separates groups."
---

# Elevation

When something rises above the page, and what separates groups.

- :sample{kind="shadow" value="var(--elevation-card)"} `elevation.card`
- :sample{kind="shadow" value="var(--elevation-overlay)"} `elevation.overlay`

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What rises above the page? | Cards too | Cards lift to feel like objects. |
| How many shadow levels exist? | Two | One shadow for cards, one for overlays. |
| What separates groups on the page? | Cards | Cards hold each offer. |
| How soft are shadows? | Pronounced | Pronounced shadows add depth. |
| Where does elevation show? | Cards, menus and dialogs | Cards, menus and dialogs rise. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to, light | Points to, dark |
| --- | --- | --- |
| `elevation.card` | `brand-expressive.theme.light.elevation.card` → `shadow.card` | `brand-expressive.theme.dark.elevation.card` → `shadow.card-dark` |
| `elevation.overlay` | `brand-expressive.theme.light.elevation.overlay` → `shadow.overlay` | `brand-expressive.theme.dark.elevation.overlay` → `shadow.overlay-dark` |

The raw values these tokens end at are on [Primitives › Effects](../primitives/effects).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| A card on the page | elevation.card (pronounced) | A flat card | Cards float to feel tactile. |
| A menu or dialog | elevation.overlay and a dimmed page | No shadow | Strong depth shows a menu or dialog sits above vivid sections. Without a shadow it blends into the color blocks. |
