---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 3
title: "Spacing"
description: "Accessible first: How space shows what belongs together."
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
| hairline (holds still) | fixed | `*-map-hairline` | <span class="tok">component-spacing-map.hairline</span> <span class="odv-ptok">space.2</span><span class="odv-kvsep">:</span><span class="odv-raw">2px</span> |
| x1 (holds still) | ×1 | `*-map-x1` | <span class="tok">component-spacing-map.x1</span> <span class="odv-ptok">space.4</span><span class="odv-kvsep">:</span><span class="odv-raw">4px</span> |
| x2 (holds still) | ×2 | `*-map-x2` | <span class="tok">component-spacing-map.x2</span> <span class="odv-ptok">space.8</span><span class="odv-kvsep">:</span><span class="odv-raw">8px</span> |
| x3 | ×3 | `*-map-x3` | <span class="tok">component-spacing-map.x3</span> <span class="odv-ptok">space.20</span><span class="odv-kvsep">:</span><span class="odv-raw">20px</span> |
| x4 | ×4 | `*-map-x4` | <span class="tok">component-spacing-map.x4</span> <span class="odv-ptok">space.28</span><span class="odv-kvsep">:</span><span class="odv-raw">28px</span> |
| x6 | ×6 | `*-map-x6` | <span class="tok">component-spacing-map.x6</span> <span class="odv-ptok">space.44</span><span class="odv-kvsep">:</span><span class="odv-raw">44px</span> |
| x8 | ×8 | `*-map-x8` | <span class="tok">component-spacing-map.x8</span> <span class="odv-ptok">space.56</span><span class="odv-kvsep">:</span><span class="odv-raw">56px</span> |
| x12 | ×12 | `*-map-x12` | <span class="tok">component-spacing-map.x12</span> <span class="odv-ptok">space.64</span><span class="odv-kvsep">:</span><span class="odv-raw">64px</span> |

Between things and on the page, use a role instead: `*-tight` (12px), `*-default` (16px), `*-group` (32px), `*-section` (48px), `*-control` (24px), `*-container` (24px), `*-cell` (16px). A spacing is never a number.

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Items that belong together | space.gap.default | space.gap.tight | Generous space lowers mis-taps. |
| Between page sections | space.gap.section | A thin line | Space is easy to see; thin lines are not. |
| Table row height | size.row (large) | A compact row | Large rows are easy to read and tap. |
