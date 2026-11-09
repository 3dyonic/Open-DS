---
generated: "By open-ds from the scheme. Do not edit by hand."
title: "Primitives"
description: "Every raw value in Content first, and what points to it."
hide_table_of_contents: true
---

# Primitives

:::intro{robot="content-first" stats="175 Primitives|93 In use|82 Spare"}
The raw values of Content first. Primitives hold the values; semantic tokens give them a job (see [Foundations](../foundations/)), and components read only the jobs. Color ramps stay whole, so some color steps wait for a use; every other primitive is read by something.
:::

## Color

<div class="odv-scards"><a class="odv-scard" href="./color"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/swatch.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/swatch-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Color</span><div class="odv-spec"><i class="odv-sw" style="background:#61594D" title="color.stone.light.600"></i><i class="odv-sw" style="background:#1E3A5F" title="color.navy.light.600"></i><i class="odv-sw" style="background:#1F7A3A" title="color.green.light.600"></i><i class="odv-sw" style="background:#8A5600" title="color.amber.light.600"></i><i class="odv-sw" style="background:#C42B2B" title="color.red.light.600"></i><i class="odv-sw" style="background:#0000008C" title="color.black.light.scrim"></i><i class="odv-sw" style="background:#083C93" title="color.blue.light.600"></i></div><span class="odv-scard-why">136 primitives · 54 in use</span><span class="odv-meter" role="img" aria-label="54 of 136 in use"><i style="width:40%"></i></span></span></a></div>

## Space and shape

<div class="odv-scards"><a class="odv-scard" href="./space-and-size"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/measure.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/measure-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Space and size</span><div class="odv-spec odv-spec-cols"><i style="height:3px" title="2px"></i><i style="height:4px" title="4px"></i><i style="height:8px" title="8px"></i><i style="height:15px" title="16px"></i><i style="height:19px" title="20px"></i><i style="height:23px" title="24px"></i><i style="height:30px" title="32px"></i></div><span class="odv-scard-why">13 primitives · 13 in use</span><span class="odv-meter" role="img" aria-label="13 of 13 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./shape"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/shape.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/shape-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Shape</span><div class="odv-spec"><i class="odv-shape" style="border-radius:0.5rem" title="0.5rem"></i><i class="odv-shape" style="border-radius:0.75rem" title="0.75rem"></i></div><span class="odv-scard-why">6 primitives · 6 in use</span><span class="odv-meter" role="img" aria-label="6 of 6 in use"><i style="width:100%"></i></span></span></a></div>

## Type, motion and effects

<div class="odv-scards"><a class="odv-scard" href="./type"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/typography.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/typography-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Type</span><div class="odv-spec"><span class="odv-aa" style="font-family:&quot;Source Serif 4&quot;, Georgia, serif" title="font.family.source-serif-4">Aa</span><span class="odv-aa" style="font-family:Inter, system-ui, sans-serif" title="font.family.inter">Aa</span><span class="odv-spec-note">Source Serif 4 · Inter</span></div><span class="odv-scard-why">13 primitives · 13 in use</span><span class="odv-meter" role="img" aria-label="13 of 13 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./motion"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/motion.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/motion-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Motion</span><div class="odv-spec"><i class="odv-dot"></i><span class="odv-spec-note">200ms · 320ms</span></div><span class="odv-scard-why">3 primitives · 3 in use</span><span class="odv-meter" role="img" aria-label="3 of 3 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./effects"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/elevation.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/elevation-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Effects</span><div class="odv-spec odv-spec-lift"><i class="odv-lift" style="box-shadow:0px 12px 32px 0px #1F1B1629" title="shadow.overlay"></i><i class="odv-lift" style="box-shadow:0px 12px 32px 0px #00000080" title="shadow.overlay-dark"></i></div><span class="odv-scard-why">4 primitives · 4 in use</span><span class="odv-meter" role="img" aria-label="4 of 4 in use"><i style="width:100%"></i></span></span></a></div>

## Every kind

**175** primitives. **93** are used by a semantic token, a theme or a component key. **82** are not used yet.

| Kind | Primitives | Used |
| --- | --- | --- |
| [Color](./color.md) | 136 | 54 |
| [Space and size](./space-and-size.md) | 13 | 13 |
| [Shape](./shape.md) | 6 | 6 |
| [Type](./type.md) | 13 | 13 |
| [Motion](./motion.md) | 3 | 3 |
| [Effects](./effects.md) | 4 | 4 |
