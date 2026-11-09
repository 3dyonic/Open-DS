---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Spacing"
description: "Multi-brand: How space shows what belongs together."
---

# Spacing

How space shows what belongs together.

- :sample{kind="bar" value="var(--space-gap-tight)"} `space.gap.tight`
- :sample{kind="bar" value="var(--space-gap-default)"} `space.gap.default`
- :sample{kind="bar" value="var(--space-gap-group)"} `space.gap.group`
- :sample{kind="bar" value="var(--space-gap-section)"} `space.gap.section`
- :sample{kind="bar" value="var(--space-inset-control-x)"} `space.inset.control-x`
- :sample{kind="bar" value="var(--space-inset-container)"} `space.inset.container`
- :sample{kind="bar" value="var(--space-inset-cell-x)"} `space.inset.cell-x`
- :sample{kind="bar" value="var(--size-row)"} `size.row`

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which spacing roles does it need? | Gaps, insets and row heights | Account tables need a row height. |
| How many densities exist? | One | One density across brands. |
| How are spacing steps defined? | Small steps, on a 4px grid | Every brand shares one set of steps, so they sit on a 4px grid: small enough for account forms, with big ones for product pages. |
| How dense is the layout? | Comfortable | Comfortable spacing in every brand. |
| Where does spacing matter most? | Between fields | Space matters most between form fields. |

## Tokens

Each token points to another token. Values live only on primitives, below.

::::brand{id="aster" name="Aster"}
| Token | Points to |
| --- | --- |
| `space.gap.tight` | `space.8` |
| `space.gap.default` | `space.12` |
| `space.gap.group` | `space.24` |
| `space.gap.section` | `space.48` |
| `space.inset.control-x` | `space.16` |
| `space.inset.container` | `space.24` |
| `space.inset.cell-x` | `space.16` |
| `size.row` | `size.48` |
::::

::::brand{id="birch" name="Birch"}
| Token | Points to |
| --- | --- |
| `space.gap.tight` | `space.8` |
| `space.gap.default` | `space.12` |
| `space.gap.group` | `space.24` |
| `space.gap.section` | `space.48` |
| `space.inset.control-x` | `space.16` |
| `space.inset.container` | `space.24` |
| `space.inset.cell-x` | `space.16` |
| `size.row` | `size.48` |
::::

::::brand{id="coral" name="Coral"}
| Token | Points to |
| --- | --- |
| `space.gap.tight` | `space.8` |
| `space.gap.default` | `space.12` |
| `space.gap.group` | `space.24` |
| `space.gap.section` | `space.48` |
| `space.inset.control-x` | `space.16` |
| `space.inset.container` | `space.24` |
| `space.inset.cell-x` | `space.16` |
| `size.row` | `size.48` |
::::

The raw values these tokens end at are on [Primitives › Space and size](../primitives/space-and-size).

## The component spacing map

Inside a component, spacing is a step of this map. Each step is 4px × its multiplier × the scheme's rhythm, rounded to a multiple of 4px, at most 64px. In Multi-brand the rhythm is 1.5. Comfortable in every brand: panels and fields breathe; rows stay tight.

Steps that hold still stay at 4px × their multiplier in every scheme. The hairline is a fixed 2px nudge. In code, write the step's utility: `p-map-x6`, `gap-map-x2`.

| Step | Multiplier | Utility | Token and value |
| --- | --- | --- | --- |
| hairline (holds still) | fixed | `*-map-hairline` | `component-spacing-map.hairline` `space.2`: 2px |
| x1 (holds still) | ×1 | `*-map-x1` | `component-spacing-map.x1` `space.4`: 4px |
| x2 (holds still) | ×2 | `*-map-x2` | `component-spacing-map.x2` `space.8`: 8px |
| x3 | ×3 | `*-map-x3` | `component-spacing-map.x3` `space.20`: 20px |
| x4 | ×4 | `*-map-x4` | `component-spacing-map.x4` `space.24`: 24px |
| x6 | ×6 | `*-map-x6` | `component-spacing-map.x6` `space.36`: 36px |
| x8 | ×8 | `*-map-x8` | `component-spacing-map.x8` `space.48`: 48px |
| x12 | ×12 | `*-map-x12` | `component-spacing-map.x12` `space.64`: 64px |

Between things and on the page, use a role instead: `*-tight` (8px), `*-default` (12px), `*-group` (24px), `*-section` (48px), `*-control` (16px), `*-container` (24px), `*-cell` (16px). A spacing is never a number.

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Items that belong together | space.gap.default | Brand-specific spacing | Spacing is shared across brands. |
| Between page sections | space.gap.section and cards | Lines | Cards hold each offer together, so customers compare offers as units in every brand. Lines would split an offer apart. |
| Table row height | size.row (comfortable) | A compact row | Customers browse on phones, and compact rows are hard to tap in any brand. |
