---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 7
title: "Iconography"
description: "Dense data: When icons appear and how they look."
---

# Iconography

When icons appear and how they look.

<div class="ods-specimen">
<span class="ods-item"><span class="ods-bar" style="width:var(--size-icon)"></span><span class="ods-label">size.icon</span></span>
</div>

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What do icons do? | Actions and status | Icons mark row actions and status. |
| How many icon sizes exist? | One | One size, matched to the small text. |
| What icon style? | Outline | Outline icons stay light next to dense text. |
| How big are icons next to text? | Match the text | Icons match the label so they do not outweigh it. |
| Where do icons work hardest? | Toolbars and rows | Icons work hardest in toolbars and row actions. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `size.icon` | `size.16` |

The raw values these tokens end at are on [Primitives › all kinds](../primitives/).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| An icon with no label | Icon button with a tooltip | A bare icon | Experts learn icons; the tooltip covers the first uses. |
| An action on one row or item | Icon button, ghost, compact | Button secondary in every row | Rows repeat dozens of times; a quiet icon keeps the table readable. |
