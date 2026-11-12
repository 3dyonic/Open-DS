---
composite_data: "./motion.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Accessible first: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

::token-groups{id="motion"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What is motion for? | Feedback only | Motion only confirms an action. |
| How many speeds exist? | One | One speed. |
| How is easing defined? | Standard ease-out | A standard ease-out is easy to follow. |
| How fast does feedback feel? | Moderate | Moderate speed is easy to follow. |
| Where does motion show? | State changes only | Only state changes move. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.moderate` |
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
| Hover and press feedback | motion.duration.feedback (moderate) | Fast flicker | Moderate speed is easy to follow. |
| Someone asked for less motion | Fades only; nothing moves | Reduced motion | Movement can make some people dizzy, so it stops. A short fade or a color change still shows that something changed. |
| A panel opens | motion.duration.panels | A long slide | A moderate open is easy to follow and shows where the panel came from. |
| The curve of any move | motion.easing.standard | A spring that overshoots | A plain ease-out is calm and clear. An overshoot can confuse and distract. |
| A hero or launch moment | No hero motion | An animated start page | Moving content distracts people with attention needs and slows the task. |
