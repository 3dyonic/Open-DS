---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Shape"
description: "Brand expressive: Corners and borders."
---

# Shape

Corners and borders.

<div class="ods-specimen">
<span class="ods-item"><span class="ods-tile" style="border-radius:var(--radius-control)"></span><span class="ods-label">radius.control</span></span>
<span class="ods-item"><span class="ods-tile" style="border-radius:var(--radius-badge)"></span><span class="ods-label">radius.badge</span></span>
<span class="ods-item"><span class="ods-tile" style="border-radius:var(--radius-option)"></span><span class="ods-label">radius.option</span></span>
<span class="ods-item"><span class="ods-tile" style="border-radius:var(--radius-container)"></span><span class="ods-label">radius.container</span></span>
<span class="ods-item"><span class="ods-tile" style="border-radius:var(--radius-round)"></span><span class="ods-label">radius.round</span></span>
<span class="ods-item"><span class="ods-line" style="height:var(--border-width-default)"></span><span class="ods-label">border-width.default</span></span>
<span class="ods-item"><span class="ods-line" style="height:var(--border-width-focus)"></span><span class="ods-label">border-width.focus</span></span>
<span class="ods-item"><span class="ods-line" style="height:var(--border-width-focus-offset)"></span><span class="ods-label">border-width.focus-offset</span></span>
</div>

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| Which shape roles does it need? | Controls and containers | Pills everywhere; badges share the control corner. |
| How many corner sizes exist? | Two | Pill controls and large container corners. |
| How are corners set? | Fixed for the product | One brand, one set of corners. |
| What should control corners say? | Pill | Pill controls feel playful. |
| Where does shape show most? | Buttons and badges | Pill buttons are the signature shape. |

## Tokens

Each token points to another token. Values live only on primitives, below.

| Token | Points to |
| --- | --- |
| `radius.control` | `brand-expressive.theme.base.radius.control` → `radius.999` |
| `radius.badge` | `brand-expressive.theme.base.radius.badge` → `radius.999` |
| `radius.option` | `brand-expressive.theme.base.radius.option` → `radius.20` |
| `radius.container` | `brand-expressive.theme.base.radius.container` → `radius.24` |
| `radius.round` | `radius.full` |
| `border-width.default` | `border-width.2` |
| `border-width.focus` | `border-width.3` |
| `border-width.focus-offset` | `border-width.2` |

The raw values these tokens end at are on [Primitives › Shape](../primitives/shape).

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Corners of buttons and inputs | radius.control (pill) | Sharp corners | Pills match the brand's round, playful shapes. Sharp corners would feel corporate. |
| Shape of a status badge | radius.badge (pill) | A rectangle | Pills match the controls. |
