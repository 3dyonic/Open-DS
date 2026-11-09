---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Accessible first: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

- :sample{kind="duration" value="var(--motion-duration-feedback)"} `motion.duration.feedback`
- :sample{kind="duration" value="var(--motion-duration-panels)"} `motion.duration.panels`
- :sample{kind="easing" value="var(--motion-easing-standard)"} `motion.easing.standard`

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
| `motion.easing.standard` | `easing.standard` |

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (moderate) | Fast flicker | Moderate speed is easy to follow. |
| Someone asked for less motion | No motion | Reduced motion | A shorter motion still moves. When people ask for less motion, nothing moves. |
