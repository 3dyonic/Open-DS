---
composite_data: "./motion.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Multi-brand: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

::token-groups{id="motion"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What is motion for? | Feedback and guidance | Feedback and guidance through sign-up. |
| How many speeds exist? | Two | One speed for feedback, one for panels. |
| How is easing defined? | Standard ease-out | A standard ease-out across brands. |
| How fast does feedback feel? | Moderate | Moderate speed across brands. |
| Where does motion show? | State changes and panels | State changes and panels move. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster"}
| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.relaxed` |
| `motion.duration.exit` | `motion.duration.feedback` → `duration.moderate` |
| `motion.easing.standard` | `easing.standard` |
| `motion.easing.enter` | `motion.easing.standard` → `easing.standard` |
| `motion.easing.exit` | `easing.strong-out` |
| `motion.easing.exit-offscreen` | `motion.easing.exit` → `easing.strong-out` |
| `motion.easing.emphasize` | `motion.easing.standard` → `easing.standard` |
::::

::::brand{id="birch"}
| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.relaxed` |
| `motion.duration.exit` | `motion.duration.feedback` → `duration.moderate` |
| `motion.easing.standard` | `easing.standard` |
| `motion.easing.enter` | `motion.easing.standard` → `easing.standard` |
| `motion.easing.exit` | `easing.strong-out` |
| `motion.easing.exit-offscreen` | `motion.easing.exit` → `easing.strong-out` |
| `motion.easing.emphasize` | `motion.easing.standard` → `easing.standard` |
::::

::::brand{id="coral"}
| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.relaxed` |
| `motion.duration.exit` | `motion.duration.feedback` → `duration.moderate` |
| `motion.easing.standard` | `easing.standard` |
| `motion.easing.enter` | `motion.easing.standard` → `easing.standard` |
| `motion.easing.exit` | `easing.strong-out` |
| `motion.easing.exit-offscreen` | `motion.easing.exit` → `easing.strong-out` |
| `motion.easing.emphasize` | `motion.easing.standard` → `easing.standard` |
::::

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (moderate) | Brand-specific motion | Motion is shared, so one component library behaves the same in every brand. |
| Someone asked for less motion | Fades only; nothing moves | Full motion | Motion is reduced, not removed: a fade keeps the change visible, and nothing slides. |
| A panel opens | motion.duration.panels | Brand-specific motion | A relaxed open guides customers through sign-up the same way in every brand. |
| The curve of any move | motion.easing.standard | A brand-specific curve | One calm curve keeps the shared components the same in every brand. |
| A hero or launch moment | No hero motion | An intro animation for one brand | A brand-only animation would break the shared library. |
