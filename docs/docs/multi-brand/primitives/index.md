---
generated: "By open-ds from the scheme. Do not edit by hand."
title: "Primitives"
description: "Every raw value in Multi-brand, and what points to it."
hide_table_of_contents: true
---

# Primitives

:::intro{robot="multi-brand" stats="226 Primitives|112 In use|114 Spare"}
The raw values of Multi-brand. Primitives hold the values; semantic tokens give them a job (see [Foundations](../foundations/)), and components read only the jobs. Color ramps stay whole, so some color steps wait for a use; every other primitive is read by something.
:::

## Color

<div class="odv-scards"><a class="odv-scard" href="./color"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/swatch.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/swatch-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Color</span><div class="odv-spec"><i class="odv-sw" style="background:#4B5A6F" title="color.slate-deep.light.600"></i><i class="odv-sw" style="background:#0F766E" title="color.teal.light.600"></i><i class="odv-sw" style="background:#6D28D9" title="color.purple.light.600"></i><i class="odv-sw" style="background:#C2410C" title="color.orange.light.600"></i><i class="odv-sw" style="background:#1F7A3A" title="color.green.light.600"></i><i class="odv-sw" style="background:#8A5600" title="color.amber.light.600"></i><i class="odv-sw" style="background:#C42B2B" title="color.red.light.600"></i><i class="odv-sw" style="background:#0000008C" title="color.black.light.scrim"></i></div><span class="odv-scard-why">180 primitives · 66 in use</span><span class="odv-meter" role="img" aria-label="66 of 180 in use"><i style="width:37%"></i></span></span></a></div>

## Space and shape

<div class="odv-scards"><a class="odv-scard" href="./space-and-size"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/measure.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/measure-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Space and size</span><div class="odv-spec odv-spec-cols"><i style="height:3px" title="2px"></i><i style="height:5px" title="4px"></i><i style="height:10px" title="8px"></i><i style="height:15px" title="12px"></i><i style="height:20px" title="16px"></i><i style="height:25px" title="20px"></i><i style="height:30px" title="24px"></i></div><span class="odv-scard-why">14 primitives · 14 in use</span><span class="odv-meter" role="img" aria-label="14 of 14 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./shape"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/shape.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/shape-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Shape</span><div class="odv-spec"><i class="odv-shape" style="border-radius:0.25rem" title="0.25rem"></i><i class="odv-shape" style="border-radius:0.5rem" title="0.5rem"></i><i class="odv-shape" style="border-radius:0.75rem" title="0.75rem"></i><i class="odv-shape" style="border-radius:1rem" title="1rem"></i></div><span class="odv-scard-why">9 primitives · 9 in use</span><span class="odv-meter" role="img" aria-label="9 of 9 in use"><i style="width:100%"></i></span></span></a></div>

## Type, motion and effects

<div class="odv-scards"><a class="odv-scard" href="./type"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/typography.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/typography-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Type</span><div class="odv-spec"><span class="odv-aa" style="font-family:Inter, system-ui, sans-serif" title="font.family.inter">Aa</span><span class="odv-aa" style="font-family:&quot;Plus Jakarta Sans&quot;, system-ui, sans-serif" title="font.family.plus-jakarta-sans">Aa</span><span class="odv-spec-note">Inter · Plus Jakarta Sans</span></div><span class="odv-scard-why">15 primitives · 15 in use</span><span class="odv-meter" role="img" aria-label="15 of 15 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./motion"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/motion.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/motion-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Motion</span><div class="odv-spec"><i class="odv-dot"></i><span class="odv-spec-note">200ms · 320ms</span></div><span class="odv-scard-why">3 primitives · 3 in use</span><span class="odv-meter" role="img" aria-label="3 of 3 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./effects"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/elevation.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/elevation-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Effects</span><div class="odv-spec odv-spec-lift"><i class="odv-lift" style="box-shadow:0px 2px 8px 0px #0F172A14" title="shadow.card"></i><i class="odv-lift" style="box-shadow:0px 12px 32px 0px #0F172A29" title="shadow.overlay"></i><i class="odv-lift" style="box-shadow:0px 2px 8px 0px #00000066" title="shadow.card-dark"></i></div><span class="odv-scard-why">5 primitives · 5 in use</span><span class="odv-meter" role="img" aria-label="5 of 5 in use"><i style="width:100%"></i></span></span></a></div>

## Every kind

**226** primitives. **112** are used by a semantic token, a theme or a component key. **114** are not used yet.

| Kind | Primitives | Used |
| --- | --- | --- |
| [Color](./color.md) | 180 | 66 |
| [Space and size](./space-and-size.md) | 14 | 14 |
| [Shape](./shape.md) | 9 | 9 |
| [Type](./type.md) | 15 | 15 |
| [Motion](./motion.md) | 3 | 3 |
| [Effects](./effects.md) | 5 | 5 |
