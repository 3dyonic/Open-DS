---
composite_data: "./spacing.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Spacing"
description: "Brand expressive: How space shows what belongs together."
---

# Spacing

How space shows what belongs together.

::token-swatches{id="spacing"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which spacing roles does it need? | Gaps and insets | Few tables; no row role needed. |
| How many densities exist? | One | One generous density. |
| How are spacing steps defined? | Big, even steps | Big, even steps make big moments. |
| How dense is the layout? | Spacious | Big space makes big moments. |
| Where does spacing matter most? | Between big sections | Space works between big sections. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `space.gap.tight` | `space.8` |
| `space.gap.default` | `space.16` |
| `space.gap.group` | `space.40` |
| `space.gap.section` | `space.64` |
| `space.inset.control-x` | `space.28` |
| `space.inset.container` | `space.32` |
| `space.inset.cell-x` | `space.16` |
| `size.row` | `size.52` |

The raw values these tokens end at are on [Primitives › Space and size](../primitives/space-and-size).

## The component spacing map

Inside a component, spacing is a step of this map. Each step is 4px × its multiplier × the scheme's rhythm, rounded to a multiple of 4px, at most 64px. In Brand expressive the rhythm is 2. Spacious: big space makes big moments, so panels double their room; rows stay tight.

Steps that hold still stay at 4px × their multiplier in every scheme. The hairline is a fixed 2px nudge. In code, write the step's utility: `p-map-x6`, `gap-map-x2`.

| Step | Multiplier | Utility | Token and value |
| --- | --- | --- | --- |
| hairline (holds still) | fixed | `*-map-hairline` | component-spacing-map.hairline space.2: 2px |
| x1 (holds still) | ×1 | `*-map-x1` | component-spacing-map.x1 space.4: 4px |
| x2 (holds still) | ×2 | `*-map-x2` | component-spacing-map.x2 space.8: 8px |
| x3 | ×3 | `*-map-x3` | component-spacing-map.x3 space.24: 24px |
| x4 | ×4 | `*-map-x4` | component-spacing-map.x4 space.32: 32px |
| x6 | ×6 | `*-map-x6` | component-spacing-map.x6 space.48: 48px |
| x8 | ×8 | `*-map-x8` | component-spacing-map.x8 space.64: 64px |
| x12 | ×12 | `*-map-x12` | component-spacing-map.x12 space.64: 64px |

Between things and on the page, use a role instead: `*-tight` (8px), `*-default` (16px), `*-group` (40px), `*-section` (64px), `*-control` (28px), `*-container` (32px), `*-cell` (16px). A spacing is never a number.

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Items that belong together | space.gap.default | space.gap.tight | Air keeps big type readable. |
| Between page sections | space.gap.section and a color block | A thin line | Big space and color make each section a moment. |
| Table row height | size.row (comfortable) | A compact row | Tables are rare and short, so there is no need to fit many rows. Comfortable rows keep the brand's airy rhythm. |
