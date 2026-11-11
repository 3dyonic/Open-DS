---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Themes"
description: "Brands and modes in Dense data."
---

# Themes

Dense data ships 2 themes: light, dark. Only semantic tokens change between themes; components never do.

## How to switch

- Dark mode: add the class `dark` to `<html>`.

## Brands

- **Dense data** (`default`): The single brand: precise blue on cool grey.

## Key colors in each theme

The page, its main surface and text, the main action at rest and on hover, and the focus ring: the colors that show a theme at a glance. Each shows the primitive it points at, then its value.

- the neutral is `slate` (cool). Muted color keeps attention on the data; a cool gray reads as precise.

| Token | light | dark |
| --- | --- | --- |
| `color.surface.canvas` | :sample{kind="tone" value="#F7F8FA" ink="#000000"} `slate.light.50` via neutral.50 · #F7F8FA | :sample{kind="tone" value="#0D1117" ink="#FFFFFF"} `slate.dark.0` via neutral.0 · #0D1117 |
| `color.surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#000000"} `slate.light.0` via neutral.0 · #FFFFFF | :sample{kind="tone" value="#161B23" ink="#FFFFFF"} `slate.dark.50` via neutral.50 · #161B23 |
| `color.text.primary` | :sample{kind="tone" value="#161B23" ink="#FFFFFF"} `slate.light.900` via neutral.900 · #161B23 | :sample{kind="tone" value="#F7F8FA" ink="#000000"} `slate.dark.900` via neutral.900 · #F7F8FA |
| `color.action.primary` | :sample{kind="tone" value="#4B3FD9" ink="#FFFFFF"} `violet.light.600` #4B3FD9 | :sample{kind="tone" value="#A9A3F6" ink="#000000"} `violet.dark.600` #A9A3F6 |
| `color.action.primary.hover` | :sample{kind="tone" value="#3729AA" ink="#FFFFFF"} `violet.light.700` #3729AA | :sample{kind="tone" value="#BEBBFB" ink="#000000"} `violet.dark.700` #BEBBFB |
| `color.border.focus` | :sample{kind="tone" value="#4B3FD9" ink="#FFFFFF"} `violet.light.600` #4B3FD9 | :sample{kind="tone" value="#A9A3F6" ink="#000000"} `violet.dark.600` #A9A3F6 |
