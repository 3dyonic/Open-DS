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
| `color.surface.canvas` | :sample{kind="tone" value="#FFFDF8" ink="#000000"} `stone.light.50` via neutral.50 · #FFFDF8 | :sample{kind="tone" value="#14110D" ink="#FFFFFF"} `stone.dark.0` via neutral.0 · #14110D |
| `color.surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#000000"} `stone.light.0` via neutral.0 · #FFFFFF | :sample{kind="tone" value="#1F1B16" ink="#FFFFFF"} `stone.dark.50` via neutral.50 · #1F1B16 |
| `color.text.primary` | :sample{kind="tone" value="#1F1B16" ink="#FFFFFF"} `stone.light.900` via neutral.900 · #1F1B16 | :sample{kind="tone" value="#FFFDF8" ink="#000000"} `stone.dark.900` via neutral.900 · #FFFDF8 |
| `color.action.primary` | :sample{kind="tone" value="#1E3A5F" ink="#FFFFFF"} `navy.light.600` #1E3A5F | :sample{kind="tone" value="#8FA6C4" ink="#FFFFFF"} `navy.dark.600` #8FA6C4 |
| `color.action.primary.hover` | :sample{kind="tone" value="#122948" ink="#FFFFFF"} `navy.light.700` #122948 | :sample{kind="tone" value="#ACBDD5" ink="#000000"} `navy.dark.700` #ACBDD5 |
| `color.border.focus` | :sample{kind="tone" value="#1E3A5F" ink="#FFFFFF"} `navy.light.600` #1E3A5F | :sample{kind="tone" value="#8FA6C4" ink="#FFFFFF"} `navy.dark.600` #8FA6C4 |
