---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Dense data: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

- :sample{kind="duration" value="var(--motion-duration-feedback)"} `motion.duration.feedback`
- :sample{kind="duration" value="var(--motion-duration-panels)"} `motion.duration.panels`
- :sample{kind="easing" value="var(--motion-easing-standard)"} `motion.easing.standard`

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
| `motion.easing.standard` | `easing.standard` |

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (fast) | No transition | Fast feedback confirms the pointer without slowing experts. |
| Someone asked for less motion | No motion | A shorter version of the motion | A shorter motion still moves. When people ask for less motion, nothing moves. |
