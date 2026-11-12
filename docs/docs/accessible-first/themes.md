---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Themes"
description: "Brands and modes in Accessible first."
---

# Themes

Accessible first ships 2 themes: light, dark. Only semantic tokens change between themes; components never do.

## How to switch

- Dark mode: add the class `dark` to `<html>`.

## Brands

- **Accessible first** (`default`): The single brand: strong blue on true neutral, high contrast everywhere.

## Key colors in each theme

The page, its main surface and text, the main action at rest and on hover, and the focus ring: the colors that show a theme at a glance. Each shows the primitive it points at, then its value.

- the neutral is `gray` (pure). A pure gray adds no hue that could lower contrast or carry a meaning.

| Token | light | dark |
| --- | --- | --- |
| `color.surface.canvas` | :sample{kind="tone" value="#F7F7F7" ink="#000000"} `gray.light.50` via neutral.50 · #F7F7F7 | :sample{kind="tone" value="#0A0A0A" ink="#FFFFFF"} `gray.dark.0` via neutral.0 · #0A0A0A |
| `color.surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#000000"} `gray.light.0` via neutral.0 · #FFFFFF | :sample{kind="tone" value="#222222" ink="#FFFFFF"} `gray.dark.100` via neutral.100 · #222222 |
| `color.text.primary` | :sample{kind="tone" value="#141414" ink="#FFFFFF"} `gray.light.900` via neutral.900 · #141414 | :sample{kind="tone" value="#F7F7F7" ink="#000000"} `gray.dark.900` via neutral.900 · #F7F7F7 |
| `color.action.primary` | :sample{kind="tone" value="#0B4FC0" ink="#FFFFFF"} `blue.light.600` #0B4FC0 | :sample{kind="tone" value="#8AB4F8" ink="#000000"} `blue.dark.600` #8AB4F8 |
| `color.action.primary.hover` | :sample{kind="tone" value="#013895" ink="#FFFFFF"} `blue.light.700` #013895 | :sample{kind="tone" value="#A7C8FC" ink="#000000"} `blue.dark.700` #A7C8FC |
| `color.border.focus` | :sample{kind="tone" value="#0B4FC0" ink="#FFFFFF"} `blue.light.600` #0B4FC0 | :sample{kind="tone" value="#A7C8FC" ink="#000000"} `blue.dark.700` #A7C8FC |
