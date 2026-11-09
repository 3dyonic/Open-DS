---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Themes"
description: "Brands and modes in Content first."
---

# Themes

Content first ships 2 themes: light, dark. Only semantic tokens change between themes; components never do.

## How to switch

- Dark mode: add the class `dark` to `<html>`.

## Brands

- **Content first** (`default`): The single brand: deep navy ink on warm paper, a serif for reading.

## Key colors in each theme

The page, its main surface and text, the main action at rest and on hover, and the focus ring: the colors that show a theme at a glance. Each shows the primitive it points at, then its value.

- the neutral is `stone` (warm). A warm gray is calm, like paper, for long reading.

| Token | light | dark |
| --- | --- | --- |
| `color.surface.canvas` | <span class="odv-tc"><i style="background:#FFFDF8;color:#000000">Aa</i><span><code>stone.light.50</code><small>via neutral.50 · #FFFDF8</small></span></span> | <span class="odv-tc"><i style="background:#14110D;color:#FFFFFF">Aa</i><span><code>stone.dark.0</code><small>via neutral.0 · #14110D</small></span></span> |
| `color.surface.default` | <span class="odv-tc"><i style="background:#FFFFFF;color:#000000">Aa</i><span><code>stone.light.0</code><small>via neutral.0 · #FFFFFF</small></span></span> | <span class="odv-tc"><i style="background:#1F1B16;color:#FFFFFF">Aa</i><span><code>stone.dark.50</code><small>via neutral.50 · #1F1B16</small></span></span> |
| `color.text.primary` | <span class="odv-tc"><i style="background:#1F1B16;color:#FFFFFF">Aa</i><span><code>stone.light.900</code><small>via neutral.900 · #1F1B16</small></span></span> | <span class="odv-tc"><i style="background:#FFFDF8;color:#000000">Aa</i><span><code>stone.dark.900</code><small>via neutral.900 · #FFFDF8</small></span></span> |
| `color.action.primary` | <span class="odv-tc"><i style="background:#1E3A5F;color:#FFFFFF">Aa</i><span><code>navy.light.600</code><small>#1E3A5F</small></span></span> | <span class="odv-tc"><i style="background:#8FA6C4;color:#FFFFFF">Aa</i><span><code>navy.dark.600</code><small>#8FA6C4</small></span></span> |
| `color.action.primary.hover` | <span class="odv-tc"><i style="background:#122948;color:#FFFFFF">Aa</i><span><code>navy.light.700</code><small>#122948</small></span></span> | <span class="odv-tc"><i style="background:#ACBDD5;color:#000000">Aa</i><span><code>navy.dark.700</code><small>#ACBDD5</small></span></span> |
| `color.border.focus` | <span class="odv-tc"><i style="background:#1E3A5F;color:#FFFFFF">Aa</i><span><code>navy.light.600</code><small>#1E3A5F</small></span></span> | <span class="odv-tc"><i style="background:#8FA6C4;color:#FFFFFF">Aa</i><span><code>navy.dark.600</code><small>#8FA6C4</small></span></span> |
