---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Brand expressive: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

<div class="ods-specimen">
<span class="ods-item"><span class="ods-motion" style="--ods-d:var(--motion-duration-feedback)" title="Hover to play"><span></span></span><span class="ods-label">motion.duration.feedback</span></span>
<span class="ods-item"><span class="ods-motion" style="--ods-d:var(--motion-duration-panels)" title="Hover to play"><span></span></span><span class="ods-label">motion.duration.panels</span></span>
<span class="ods-item"><span class="ods-motion" style="--ods-d:var(--motion-duration-hero)" title="Hover to play"><span></span></span><span class="ods-label">motion.duration.hero</span></span>
<span class="ods-item"><span class="ods-motion" style="--ods-e:var(--motion-easing-standard)" title="Hover to play"><span></span></span><span class="ods-label">motion.easing.standard</span></span>
</div>

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
