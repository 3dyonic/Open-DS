---
generated: "By open-ds from the scheme. Do not edit by hand."
title: "Primitives"
description: "Every raw value in Accessible first, and what points to it."
hide_table_of_contents: true
---

# Primitives

:::intro{robot="accessible-first" stats="174 Primitives|91 In use|83 Spare"}
The raw values of Accessible first. Primitives hold the values; semantic tokens give them a job (see [Foundations](../foundations/)), and components read only the jobs. Color ramps stay whole, so some color steps wait for a use; every other primitive is read by something.
:::

## Color

<div class="odv-scards"><a class="odv-scard" href="./color"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/swatch.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/swatch-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Color</span><div class="odv-spec"><i class="odv-sw" style="background:#464646" title="color.gray.light.600"></i><i class="odv-sw" style="background:#0B4FC0" title="color.blue.light.600"></i><i class="odv-sw" style="background:#1F7A3A" title="color.green.light.600"></i><i class="odv-sw" style="background:#8A5600" title="color.amber.light.600"></i><i class="odv-sw" style="background:#981519" title="color.red.light.700"></i><i class="odv-sw" style="background:#0000008C" title="color.black.light.scrim"></i><i class="odv-sw" style="background:#0B5B55" title="color.teal.light.600"></i></div><span class="odv-scard-why">136 primitives · 53 in use</span><span class="odv-meter" role="img" aria-label="53 of 136 in use"><i style="width:39%"></i></span></span></a></div>

## Space and shape

<div class="odv-scards"><a class="odv-scard" href="./space-and-size"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/measure.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/measure-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Space and size</span><div class="odv-spec odv-spec-cols"><i style="height:3px" title="2px"></i><i style="height:5px" title="4px"></i><i style="height:10px" title="8px"></i><i style="height:15px" title="12px"></i><i style="height:20px" title="16px"></i><i style="height:25px" title="20px"></i><i style="height:30px" title="24px"></i></div><span class="odv-scard-why">17 primitives · 17 in use</span><span class="odv-meter" role="img" aria-label="17 of 17 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./shape"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/shape.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/shape-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Shape</span><div class="odv-spec"><i class="odv-shape" style="border-radius:0.25rem" title="0.25rem"></i><i class="odv-shape" style="border-radius:0.375rem" title="0.375rem"></i><i class="odv-shape" style="border-radius:0.5rem" title="0.5rem"></i></div><span class="odv-scard-why">6 primitives · 6 in use</span><span class="odv-meter" role="img" aria-label="6 of 6 in use"><i style="width:100%"></i></span></span></a></div>

## Type, motion and effects

<div class="odv-scards"><a class="odv-scard" href="./type"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/typography.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/typography-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Type</span><div class="odv-spec"><span class="odv-aa" style="font-family:&quot;Atkinson Hyperlegible&quot;, Verdana, sans-serif" title="font.family.atkinson-hyperlegible">Aa</span><span class="odv-spec-note">Atkinson Hyperlegible</span></div><span class="odv-scard-why">11 primitives · 11 in use</span><span class="odv-meter" role="img" aria-label="11 of 11 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./motion"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/motion.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/motion-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Motion</span><div class="odv-spec"><i class="odv-dot"></i><span class="odv-spec-note">200ms</span></div><span class="odv-scard-why">2 primitives · 2 in use</span><span class="odv-meter" role="img" aria-label="2 of 2 in use"><i style="width:100%"></i></span></span></a><a class="odv-scard" href="./effects"><span class="odv-scard-art"><span class="odv-robot "><img class="odv-robot-day" src="/robots/scopes/elevation.webp" alt="" loading="lazy"/><img class="odv-robot-night" src="/robots/scopes/elevation-dark.webp" alt="" loading="lazy"/></span></span><span class="odv-scard-body"><span class="odv-scard-title">Effects</span><div class="odv-spec odv-spec-lift"></div><span class="odv-scard-why">2 primitives · 2 in use</span><span class="odv-meter" role="img" aria-label="2 of 2 in use"><i style="width:100%"></i></span></span></a></div>

## Every kind

**174** primitives. **91** are used by a semantic token, a theme or a component key. **83** are not used yet.

| Kind | Primitives | Used |
| --- | --- | --- |
| [Color](./color.md) | 136 | 53 |
| [Space and size](./space-and-size.md) | 17 | 17 |
| [Shape](./shape.md) | 6 | 6 |
| [Type](./type.md) | 11 | 11 |
| [Motion](./motion.md) | 2 | 2 |
| [Effects](./effects.md) | 2 | 2 |
