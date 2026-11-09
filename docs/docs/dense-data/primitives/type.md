---
composite_data: "./type.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 4
title: "Type"
description: "Type primitives in Dense data."
---

# Type

13 primitives, 13 used.

## `font.size`

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.size.12` | 0.75rem (12px) | :sample{kind="size" value="0.75rem"} | `type.label.font-size` (semantic); `type.caption.font-size` (semantic) |
| `font.size.13` | 0.8125rem (13px) | :sample{kind="size" value="0.8125rem"} | `type.data.font-size` (semantic) |
| `font.size.14` | 0.875rem (14px) | :sample{kind="size" value="0.875rem"} | `type.body.font-size` (semantic) |
| `font.size.16` | 1rem (16px) | :sample{kind="size" value="1rem"} | `type.heading.font-size` (semantic) |
| `font.size.20` | 1.25rem (20px) | :sample{kind="size" value="1.25rem"} | `type.title.font-size` (semantic) |
| `font.size.24` | 1.5rem (24px) | :sample{kind="size" value="1.5rem"} | `type.display.font-size` (semantic) |

## `font.weight`

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.weight.400` | 400 | :sample{kind="weight" value="400"} | `type.body.font-weight` (semantic); `type.caption.font-weight` (semantic); `type.data.font-weight` (semantic) |
| `font.weight.500` | 500 | :sample{kind="weight" value="500"} | `type.label.font-weight` (semantic) |
| `font.weight.600` | 600 | :sample{kind="weight" value="600"} | `type.display.font-weight` (semantic); `type.title.font-weight` (semantic); `type.heading.font-weight` (semantic) |

## `font.line-height`

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.line-height.1_2` | 1.2 | :sample{kind="leading" value="1.2" note="19px"} | `type.display.line-height` (semantic); `type.title.line-height` (semantic); `type.heading.line-height` (semantic); `type.label.line-height` (semantic) |
| `font.line-height.1_45` | 1.45 | :sample{kind="leading" value="1.45" note="23px"} | `type.body.line-height` (semantic); `type.caption.line-height` (semantic); `type.data.line-height` (semantic) |

## `font.family`

::specimen{id="type/fonts"}

| Primitive | Value | Sample | Used by |
| --- | --- | --- | --- |
| `font.family.ibm-plex-sans` | "IBM Plex Sans", system-ui, sans-serif | :sample{kind="font" value="'IBM Plex Sans', system-ui, sans-serif"} | `type.display.font-family` (every mode); `type.title.font-family` (every mode); `type.heading.font-family` (every mode); `type.body.font-family` (every mode); `type.label.font-family` (every mode); `type.caption.font-family` (every mode) |
| `font.family.ibm-plex-mono` | "IBM Plex Mono", ui-monospace, monospace | :sample{kind="font" value="'IBM Plex Mono', ui-monospace, monospace"} | `type.data.font-family` (every mode) |
