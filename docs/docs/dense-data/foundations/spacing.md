---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Spacing"
description: "Dense data: How space shows what belongs together."
---

# Spacing

How space shows what belongs together.

<div class="ods-specimen">
<span class="ods-item"><span class="ods-bar" style="width:var(--space-gap-tight)"></span><span class="ods-label">space.gap.tight</span></span>
<span class="ods-item"><span class="ods-bar" style="width:var(--space-gap-default)"></span><span class="ods-label">space.gap.default</span></span>
<span class="ods-item"><span class="ods-bar" style="width:var(--space-gap-group)"></span><span class="ods-label">space.gap.group</span></span>
<span class="ods-item"><span class="ods-bar" style="width:var(--space-gap-section)"></span><span class="ods-label">space.gap.section</span></span>
<span class="ods-item"><span class="ods-bar" style="width:var(--space-inset-control-x)"></span><span class="ods-label">space.inset.control-x</span></span>
<span class="ods-item"><span class="ods-bar" style="width:var(--space-inset-container)"></span><span class="ods-label">space.inset.container</span></span>
<span class="ods-item"><span class="ods-bar" style="width:var(--space-inset-cell-x)"></span><span class="ods-label">space.inset.cell-x</span></span>
<span class="ods-item"><span class="ods-bar" style="width:var(--size-row)"></span><span class="ods-label">size.row</span></span>
</div>

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which spacing roles does it need? | Gaps, insets and row heights | Row height is a decision of its own in a table product. |
| How many densities exist? | Two | A second, denser size serves tables and toolbars. |
| How are spacing steps defined? | Small steps, on a 4px grid | Steps on a 4px grid give the small gaps dense screens need. |
| How dense is the layout? | Compact | Compact spacing shows more records. |
| Where does spacing matter most? | Rows and cells | Space is spent inside rows and cells. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `space.gap.tight` | `space.4` |
| `space.gap.default` | `space.8` |
| `space.gap.group` | `space.16` |
| `space.gap.section` | `space.24` |
| `space.inset.control-x` | `space.12` |
| `space.inset.container` | `space.16` |
| `space.inset.cell-x` | `space.12` |
| `size.row` | `size.32` |

The raw values these tokens end at are on [Primitives › Space and size](../primitives/space-and-size).

## The component spacing map

Inside a component, spacing is a step of this map. Each step is 4px × its multiplier × the scheme's rhythm, rounded to a multiple of 4px, at most 64px. In Dense data the rhythm is 1. Compact: more records fit on one screen, so components keep their tightest spacing.

Steps that hold still stay at 4px × their multiplier in every scheme. The hairline is a fixed 2px nudge. In code, write the step's utility: `p-map-x6`, `gap-map-x2`.

| Step | Multiplier | Utility | Token and value |
| --- | --- | --- | --- |
| hairline (holds still) | fixed | `*-map-hairline` | <span class="tok">component-spacing-map.hairline</span> <span class="odv-ptok">space.2</span><span class="odv-kvsep">:</span><span class="odv-raw">2px</span> |
| x1 (holds still) | ×1 | `*-map-x1` | <span class="tok">component-spacing-map.x1</span> <span class="odv-ptok">space.4</span><span class="odv-kvsep">:</span><span class="odv-raw">4px</span> |
| x2 (holds still) | ×2 | `*-map-x2` | <span class="tok">component-spacing-map.x2</span> <span class="odv-ptok">space.8</span><span class="odv-kvsep">:</span><span class="odv-raw">8px</span> |
| x3 | ×3 | `*-map-x3` | <span class="tok">component-spacing-map.x3</span> <span class="odv-ptok">space.12</span><span class="odv-kvsep">:</span><span class="odv-raw">12px</span> |
| x4 | ×4 | `*-map-x4` | <span class="tok">component-spacing-map.x4</span> <span class="odv-ptok">space.16</span><span class="odv-kvsep">:</span><span class="odv-raw">16px</span> |
| x6 | ×6 | `*-map-x6` | <span class="tok">component-spacing-map.x6</span> <span class="odv-ptok">space.24</span><span class="odv-kvsep">:</span><span class="odv-raw">24px</span> |
| x8 | ×8 | `*-map-x8` | <span class="tok">component-spacing-map.x8</span> <span class="odv-ptok">space.32</span><span class="odv-kvsep">:</span><span class="odv-raw">32px</span> |
| x12 | ×12 | `*-map-x12` | <span class="tok">component-spacing-map.x12</span> <span class="odv-ptok">space.48</span><span class="odv-kvsep">:</span><span class="odv-raw">48px</span> |

Between things and on the page, use a role instead: `*-tight` (4px), `*-default` (8px), `*-group` (16px), `*-section` (24px), `*-control` (12px), `*-container` (16px), `*-cell` (12px). A spacing is never a number.

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Items that belong together | space.gap.tight | space.gap.group | Things that belong together sit close. |
| Between page sections | space.gap.section and a hairline | A card around every section | Lines separate without taking room from the data. |
| Table row height | size.row (compact) | The comfortable row | Compact rows show more records without scrolling. |
