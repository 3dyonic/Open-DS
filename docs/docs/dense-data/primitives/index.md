---
composite_data: "./index.json"
generated: "By open-ds from the scheme. Do not edit by hand."
title: "Primitives"
description: "Every raw value in Dense data, and what points to it."
hide_table_of_contents: true
---

# Primitives

:::intro{robot="dense-data" stats="172 Primitives|90 In use|82 Spare"}
The raw values of Dense data. Primitives hold the values; semantic tokens give them a job (see [Foundations](../foundations/)), and components read only the jobs. Color ramps stay whole, so some color steps wait for a use; every other primitive is read by something.
:::

## Color

::card-grid{id="primitives/color"}

## Space and shape

::card-grid{id="primitives/space-and-shape"}

## Type, motion and effects

::card-grid{id="primitives/type-motion-and-effects"}

## Every kind

**172** primitives. **90** are used by a semantic token, a theme or a component key. **82** are not used yet.

| Kind | Primitives | Used |
| --- | --- | --- |
| [Color](./color.md) | 136 | 54 |
| [Space and size](./space-and-size.md) | 11 | 11 |
| [Shape](./shape.md) | 6 | 6 |
| [Type](./type.md) | 13 | 13 |
| [Motion](./motion.md) | 2 | 2 |
| [Effects](./effects.md) | 4 | 4 |
