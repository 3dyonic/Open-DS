---
composite_data: "./iconography.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Iconography"
description: "Multi-brand: When icons appear and how they look."
---

# Iconography

When icons appear and how they look.

::token-swatches{id="iconography"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What do icons do? | Actions, status and navigation | Icons for actions, status and navigation. |
| How many icon sizes exist? | One | One size next to text. |
| What icon style? | Outline | One outline set for every brand. |
| How big are icons next to text? | Match the text | Icons match the text. |
| Where do icons work hardest? | Navigation | Icons help most in navigation. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster" name="Aster"}
| Token | Points to |
| --- | --- |
| `size.icon` | `size.16` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to |
| --- | --- |
| `size.icon` | `size.16` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to |
| --- | --- |
| `size.icon` | `size.16` |
::::

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| An icon with no label | Not used: always add a word; a popover explains a fee | An icon button with a hover hint | On touch screens hover hints never show; a word says what will happen. |
| An action on one row or item | Button ghost with a word | An icon alone | A word says what will happen. |
