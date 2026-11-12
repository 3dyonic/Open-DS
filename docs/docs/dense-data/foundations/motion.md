---
composite_data: "./motion.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Dense data: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

::token-groups{id="motion"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What is motion for? | Feedback only | Motion confirms an action; nothing else moves. |
| How many speeds exist? | One | One speed is enough for feedback. |
| How is easing defined? | Standard ease-out | A standard ease-out never draws attention. |
| How fast does feedback feel? | Fast | Fast feedback keeps up with experts. |
| Where does motion show? | State changes only | Only state changes move. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.fast` |
| `motion.duration.panels` | `duration.fast` |
| `motion.duration.exit` | `motion.duration.feedback` → `duration.fast` |
| `motion.easing.standard` | `easing.standard` |
| `motion.easing.enter` | `motion.easing.standard` → `easing.standard` |
| `motion.easing.exit` | `easing.strong-out` |
| `motion.easing.exit-offscreen` | `motion.easing.exit` → `easing.strong-out` |
| `motion.easing.emphasize` | `motion.easing.standard` → `easing.standard` |

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (fast) | No transition | Fast feedback confirms the pointer without slowing experts. |
| Someone asked for less motion | Fades only; nothing moves | A shorter version of the motion | Movement stops when people ask for less motion. A short fade still confirms a change without moving anything. |
| A panel opens | motion.duration.panels | A slow slide-in | Panels open at the feedback speed, so experts never wait for a menu. |
| The curve of any move | motion.easing.standard | A spring or a bounce | A plain ease-out starts fast and settles quietly. Nothing pulls the eye from the data. |
| A hero or launch moment | No hero motion | An intro animation | Analysts open the tool to work for a whole shift. An intro would cost time on every visit. |
