---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Themes"
description: "Brands and modes in Brand expressive."
---

# Themes

Brand expressive ships 2 themes: light, dark. Only semantic tokens change between themes; components never do.

## How to switch

- Dark mode: add the class `dark` to `<html>`.

## Brands

- **Brand expressive** (`default`): The single brand: vivid magenta, Bricolage Grotesque display, pill controls.

## Key colors in each theme

The page, its main surface and text, the main action at rest and on hover, and the focus ring: the colors that show a theme at a glance. Each shows the primitive it points at, then its value.

- the neutral is `taupe` (warm-rosy). A warm, rosy gray sits under the vivid pink brand without competing.

| Token | light | dark |
| --- | --- | --- |
| `color.surface.canvas` | :sample{kind="tone" value="#FFF8F3" ink="#000000"} `taupe.light.50` via neutral.50 · #FFF8F3 | :sample{kind="tone" value="#120B09" ink="#FFFFFF"} `taupe.dark.0` via neutral.0 · #120B09 |
| `color.surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#000000"} `taupe.light.0` via neutral.0 · #FFFFFF | :sample{kind="tone" value="#1F1411" ink="#FFFFFF"} `taupe.dark.50` via neutral.50 · #1F1411 |
| `color.text.primary` | :sample{kind="tone" value="#1F1411" ink="#FFFFFF"} `taupe.light.900` via neutral.900 · #1F1411 | :sample{kind="tone" value="#FFF8F3" ink="#000000"} `taupe.dark.900` via neutral.900 · #FFF8F3 |
| `color.action.primary` | :sample{kind="tone" value="#D61F7A" ink="#FFFFFF"} `pink.light.600` #D61F7A | :sample{kind="tone" value="#F59ACA" ink="#000000"} `pink.dark.600` #F59ACA |
| `color.action.primary.hover` | :sample{kind="tone" value="#A6025B" ink="#FFFFFF"} `pink.light.700` #A6025B | :sample{kind="tone" value="#FBB4D8" ink="#000000"} `pink.dark.700` #FBB4D8 |
| `color.border.focus` | :sample{kind="tone" value="#D61F7A" ink="#FFFFFF"} `pink.light.600` #D61F7A | :sample{kind="tone" value="#F59ACA" ink="#000000"} `pink.dark.600` #F59ACA |
