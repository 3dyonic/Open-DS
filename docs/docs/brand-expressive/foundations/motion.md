---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Brand expressive: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

- :sample{kind="duration" value="var(--motion-duration-feedback)"} `motion.duration.feedback`
- :sample{kind="duration" value="var(--motion-duration-panels)"} `motion.duration.panels`
- :sample{kind="duration" value="var(--motion-duration-hero)"} `motion.duration.hero`
- :sample{kind="easing" value="var(--motion-easing-standard)"} `motion.easing.standard`

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
| `motion.duration.hero` | `duration.relaxed` |
| `motion.easing.standard` | `easing.spring` |

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (fast) | An instant change | Fast feedback, on the brand's spring. An instant change drops the brand's motion. |
| Someone asked for less motion | Reduced motion | Full motion | Motion is part of the brand, so it shrinks to a fade instead of vanishing. Full motion is never forced on people who asked for less. |
