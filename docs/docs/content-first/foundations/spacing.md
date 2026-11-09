---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Spacing"
description: "Content first: How space shows what belongs together."
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
| Which spacing roles does it need? | Gaps and insets | No dense tables, so no row role. |
| How many densities exist? | One | One calm density. |
| How are spacing steps defined? | Big, even steps | Big, even steps suit long reading. |
| How dense is the layout? | Spacious | Room around the text helps reading. |
| Where does spacing matter most? | Between paragraphs | Space is spent between paragraphs and sections. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `space.gap.tight` | `space.8` |
| `space.gap.default` | `space.16` |
| `space.gap.group` | `space.32` |
| `space.gap.section` | `space.64` |
| `space.inset.control-x` | `space.20` |
| `space.inset.container` | `space.24` |
| `space.inset.cell-x` | `space.16` |
| `size.row` | `size.48` |

The raw values these tokens end at are on [Primitives › Space and size](../primitives/space-and-size).

## The component spacing map

Inside a component, spacing is a step of this map. Each step is 4px × its multiplier × the scheme's rhythm, rounded to a multiple of 4px, at most 64px. In Content first the rhythm is 1.5. Spacious: room around the text helps reading, so panels and fields breathe; rows stay tight.

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

Between things and on the page, use a role instead: `*-tight` (8px), `*-default` (16px), `*-group` (32px), `*-section` (64px), `*-control` (20px), `*-container` (24px), `*-cell` (16px). A spacing is never a number.

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Items that belong together | space.gap.default | space.gap.tight | Text needs air even inside a group. |
| Between page sections | space.gap.section, no line | A divider line | Space alone separates sections; lines add noise. |
| Table row height | size.row (comfortable) | A compact row | Rows are read, not scanned. |
