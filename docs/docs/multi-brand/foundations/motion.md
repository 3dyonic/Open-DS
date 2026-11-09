---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Multi-brand: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

- :sample{kind="duration" value="var(--motion-duration-feedback)"} `motion.duration.feedback`
- :sample{kind="duration" value="var(--motion-duration-panels)"} `motion.duration.panels`
- :sample{kind="easing" value="var(--motion-easing-standard)"} `motion.easing.standard`

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

::::brand{id="aster" name="Aster"}
| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.relaxed` |
| `motion.easing.standard` | `easing.standard` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.relaxed` |
| `motion.easing.standard` | `easing.standard` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to |
| --- | --- |
| `motion.duration.feedback` | `duration.moderate` |
| `motion.duration.panels` | `duration.relaxed` |
| `motion.easing.standard` | `easing.standard` |
::::

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (moderate) | Brand-specific motion | Motion is shared, so one component library behaves the same in every brand. |
| Someone asked for less motion | Reduced motion | Full motion | Motion is reduced, not removed: a fade keeps the change visible, and nothing slides. |
