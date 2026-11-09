---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 6
title: "Motion"
description: "Content first: What moves, why and how fast."
---

# Motion

What moves, why and how fast.

<div class="ods-specimen">
<span class="ods-item"><span class="ods-motion" style="--ods-d:var(--motion-duration-feedback)" title="Hover to play"><span></span></span><span class="ods-label">motion.duration.feedback</span></span>
<span class="ods-item"><span class="ods-motion" style="--ods-d:var(--motion-duration-panels)" title="Hover to play"><span></span></span><span class="ods-label">motion.duration.panels</span></span>
<span class="ods-item"><span class="ods-motion" style="--ods-e:var(--motion-easing-standard)" title="Hover to play"><span></span></span><span class="ods-label">motion.easing.standard</span></span>
</div>

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
| `motion.easing.standard` | `easing.standard` |

The raw values these tokens end at are on [Primitives › Motion](../primitives/motion).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Hover and press feedback | motion.duration.feedback (moderate) | A fast flash | Moderate speed feels calm in a slow reading flow. A fast flash feels jumpy. |
| Someone asked for less motion | No motion | Reduced motion | A shorter motion still moves. When people ask for less motion, nothing moves. |
