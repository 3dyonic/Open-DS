---
composite_data: "./motion.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Brand expressive: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

::token-groups{id="motion"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What is motion for? | Feedback and expression | Motion carries personality. |
| How many speeds exist? | Three | Fast feedback, moderate panels, relaxed hero. |
| How is easing defined? | A spring | A spring that overshoots feels alive. |
| How fast does feedback feel? | Fast | Feedback stays fast; the personality shows in panels and hero moments, which move slower on a spring. |
| Where does motion show? | Hero and launch moments | Motion shows in hero and launch moments. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.fast` |
| `motion.duration.panels` | `duration.moderate` |
| `motion.duration.exit` | `duration.fast` |
| `motion.duration.hero` | `duration.relaxed` |
| `motion.easing.standard` | `easing.standard` |
| `motion.easing.enter` | `easing.standard` |
| `motion.easing.exit` | `easing.strong-out` |
| `motion.easing.exit-offscreen` | `easing.accelerate` |
| `motion.easing.emphasize` | `easing.spring` |

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (fast) | An instant change | Fast feedback on an ease-out. The brand's spring waits for the moments that deserve it. |
| Someone asked for less motion | Fades only; nothing moves | Full motion | Motion is part of the brand, so it shrinks to a fade instead of vanishing. Full motion is never forced on people who asked for less. |
| A panel opens | motion.duration.panels | A flat fade | Panels open on an ease-out at a moderate speed, so menus feel quick and the brand shows in its big moments. |
| The curve of any move | motion.easing.standard | A plain ease-out | An ease-out keeps every menu and button quick. The overshoot is kept for emphasis, where it feels alive and playful. |
| A hero or launch moment | motion.duration.hero | motion.duration.panels | Hero and launch moments move slowest, so every visitor sees the launch. |
