---
composite_data: "./motion.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Content first: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

::token-groups{id="motion"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What is motion for? | Feedback and guidance | Motion confirms actions and guides between pages. |
| How many speeds exist? | Two | One speed for feedback, one for panels. |
| How is easing defined? | Standard ease-out | A standard ease-out is calm. |
| How fast does feedback feel? | Moderate | Moderate speed feels calm. |
| Where does motion show? | State changes and panels | State changes and opening panels move. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.relaxed` |
| `motion.duration.exit` | `duration.moderate` |
| `motion.easing.standard` | `easing.standard` |
| `motion.easing.enter` | `easing.standard` |
| `motion.easing.exit` | `easing.strong-out` |
| `motion.easing.exit-offscreen` | `easing.strong-out` |
| `motion.easing.emphasize` | `easing.standard` |

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (moderate) | A fast flash | Moderate speed feels calm in a slow reading flow. A fast flash feels jumpy. |
| Someone asked for less motion | Fades only; nothing moves | Reduced motion | Nothing slides or zooms for people who asked for less motion. A short fade keeps the change visible to the reader. |
| A panel opens | motion.duration.panels | An instant pop | A relaxed open guides the reader to the new panel without a jolt. |
| The curve of any move | motion.easing.standard | A bounce | A calm ease-out settles softly and never pulls the eye from the text. |
| A hero or launch moment | No hero motion: the landing stays still | An animated headline | Attention belongs to the text. A moving headline pulls the eye away from it. |
