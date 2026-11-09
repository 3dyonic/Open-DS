---
composite_data: "./type.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Type"
description: "Type primitives in Content first."
---

# Type

13 primitives, 13 used.

## `font.size`

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.size.14` | 0.875rem (14px) | :sample{kind="size" value="0.875rem"} | `type.caption.font-size` (semantic) |
| `font.size.16` | 1rem (16px) | :sample{kind="size" value="1rem"} | `type.label.font-size` (semantic) |
| `font.size.18` | 1.125rem (18px) | :sample{kind="size" value="1.125rem"} | `type.body.font-size` (semantic); `type.data.font-size` (semantic) |
| `font.size.28` | 1.75rem (28px) | :sample{kind="size" value="1.75rem"} | `type.heading.font-size` (semantic) |
| `font.size.36` | 2.25rem (36px) | :sample{kind="size" value="2.25rem"} | `type.title.font-size` (semantic) |
| `font.size.44` | 2.75rem (44px) | :sample{kind="size" value="2.75rem"} | `type.display.font-size` (semantic) |

## `font.weight`

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.weight.400` | 400 | :sample{kind="weight" value="400"} | `type.body.font-weight` (semantic); `type.caption.font-weight` (semantic); `type.data.font-weight` (semantic) |
| `font.weight.600` | 600 | :sample{kind="weight" value="600"} | `type.display.font-weight` (semantic); `type.title.font-weight` (semantic); `type.heading.font-weight` (semantic); `type.label.font-weight` (semantic) |

## `font.line-height`

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.line-height.1_15` | 1.15 | :sample{kind="leading" value="1.15" note="18px"} | `type.display.line-height` (semantic); `type.title.line-height` (semantic); `type.heading.line-height` (semantic) |
| `font.line-height.1_45` | 1.45 | :sample{kind="leading" value="1.45" note="23px"} | `type.label.line-height` (semantic); `type.caption.line-height` (semantic) |
| `font.line-height.1_65` | 1.65 | :sample{kind="leading" value="1.65" note="26px"} | `type.body.line-height` (semantic); `type.data.line-height` (semantic) |

## `font.family`

::specimen{id="type/fonts"}

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.family.source-serif-4` | "Source Serif 4", Georgia, serif | :sample{kind="font" value="'Source Serif 4', Georgia, serif"} | `type.display.font-family` (every mode); `type.title.font-family` (every mode); `type.heading.font-family` (every mode); `type.body.font-family` (every mode); `type.data.font-family` (every mode) |
| `font.family.inter` | Inter, system-ui, sans-serif | :sample{kind="font" value="Inter, system-ui, sans-serif"} | `type.label.font-family` (every mode); `type.caption.font-family` (every mode) |
