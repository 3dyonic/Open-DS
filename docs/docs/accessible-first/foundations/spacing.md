---
composite_data: "./spacing.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Spacing"
description: "Accessible first: How space shows what belongs together."
---

# Spacing

How space shows what belongs together.

::token-groups{id="spacing"}

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which spacing roles does it need? | Gaps, insets and row heights | Large rows matter for touch and zoom. |
| How many densities exist? | One | One density; no compact mode to fail people. |
| How are spacing steps defined? | Big, even steps | Big, even steps lower effort. |
| How dense is the layout? | Spacious | Space lowers effort and mis-taps. |
| Where does spacing matter most? | Between fields | Space between fields prevents mis-taps. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `space.gap.tight` | `space.12` |
| `space.gap.default` | `space.16` |
| `space.gap.group` | `space.32` |
| `space.gap.section` | `space.48` |
| `space.inset.control-x` | `space.24` |
| `space.inset.container` | `space.24` |
| `space.inset.cell-x` | `space.16` |
| `size.row` | `size.56` |

The raw values these tokens end at are on [Primitives › Space and size](../primitives/space-and-size).

## The component spacing map

Inside a component, spacing is a step of this map. Each step is 4px × its multiplier × the scheme's rhythm, rounded to a multiple of 4px, at most 64px. In Accessible first the rhythm is 1.75. Spacious: space lowers effort and mis-taps, so components get the most room short of the brand scheme; rows stay tight.

Steps that hold still stay at 4px × their multiplier in every scheme. The hairline is a fixed 2px nudge. In code, write the step's utility: `p-map-x6`, `gap-map-x2`.

| Step | Multiplier | Utility | Token and value |
| --- | --- | --- | --- |
| hairline (holds still) | fixed | `*-map-hairline` | component-spacing-map.hairline space.2: 2px |
| x1 (holds still) | ×1 | `*-map-x1` | component-spacing-map.x1 space.4: 4px |
| x2 (holds still) | ×2 | `*-map-x2` | component-spacing-map.x2 space.8: 8px |
| x3 | ×3 | `*-map-x3` | component-spacing-map.x3 space.20: 20px |
| x4 | ×4 | `*-map-x4` | component-spacing-map.x4 space.28: 28px |
| x6 | ×6 | `*-map-x6` | component-spacing-map.x6 space.44: 44px |
| x8 | ×8 | `*-map-x8` | component-spacing-map.x8 space.56: 56px |
| x12 | ×12 | `*-map-x12` | component-spacing-map.x12 space.64: 64px |

Between things and on the page, use a role instead: `*-tight` (12px), `*-default` (16px), `*-group` (32px), `*-section` (48px), `*-control` (24px), `*-container` (24px), `*-cell` (16px). A spacing is never a number.

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Items that belong together | space.gap.default | space.gap.tight | Generous space lowers mis-taps. |
| Between page sections | space.gap.section | A thin line | Space is easy to see; thin lines are not. |
| Table row height | size.row (large) | A compact row | Large rows are easy to read and tap. |
| Parts of one item | space.gap.tight | No gap | Parts sit close enough to read as one item, with room to tell them apart at high zoom. |
| Items in a list or a form row | space.gap.default | space.gap.tight | Space between fields lowers mis-taps for people with tremor. |
| Between groups | space.gap.group | space.gap.default | A clear break shows where one group of questions ends and the next begins. |
| Inside a button or input | space.inset.control-x | Padding set by eye | Wide padding makes each button a bigger target that is easy to hit. |
| Inside a card, panel or dialog | space.inset.container | Text that touches the edge | Wide padding keeps content clear of the strong border at any zoom. |
| Inside a table cell | space.inset.cell-x | Narrow cell padding | Clear space between columns keeps values apart at high zoom. |
