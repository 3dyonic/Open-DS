---
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 5
title: "Themes"
description: "Brands and modes in Multi-brand."
---

# Themes

Multi-brand ships 6 themes: aster-light, aster-dark, birch-light, birch-dark, coral-light, coral-dark. Only semantic tokens change between themes; components never do.

## How to switch

- Dark mode: add the class `dark` to `<html>`.
- Brand: set `data-brand` on `<html>` to `aster`, `birch`, `coral`.

## Brands

- **Aster** (`aster`): Calm and precise: teal, Inter, small corners.
- **Birch** (`birch`): Friendly and helpful: violet, Plus Jakarta Sans, soft corners.
- **Coral** (`coral`): Upbeat and energetic: coral orange, Poppins, pill controls.

## Key colors in each theme

The page, its main surface and text, the main action at rest and on hover, and the focus ring: the colors that show a theme at a glance. Each shows the primitive it points at, then its value.

- **Every brand**: the neutral is `slate-deep` (cool). A cool, firm gray stays out of the way of every brand's accent.

| Token | aster-light | aster-dark | birch-light | birch-dark | coral-light | coral-dark |
| --- | --- | --- | --- | --- | --- | --- |
| `color.surface.canvas` | :sample{kind="tone" value="#F8FAFC" ink="#000000"} `slate-deep.light.50` via neutral.50 · #F8FAFC | :sample{kind="tone" value="#020617" ink="#FFFFFF"} `slate-deep.dark.0` via neutral.0 · #020617 | :sample{kind="tone" value="#F8FAFC" ink="#000000"} `slate-deep.light.50` via neutral.50 · #F8FAFC | :sample{kind="tone" value="#020617" ink="#FFFFFF"} `slate-deep.dark.0` via neutral.0 · #020617 | :sample{kind="tone" value="#F8FAFC" ink="#000000"} `slate-deep.light.50` via neutral.50 · #F8FAFC | :sample{kind="tone" value="#020617" ink="#FFFFFF"} `slate-deep.dark.0` via neutral.0 · #020617 |
| `color.surface.default` | :sample{kind="tone" value="#FFFFFF" ink="#000000"} `slate-deep.light.0` via neutral.0 · #FFFFFF | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} `slate-deep.dark.50` via neutral.50 · #0F172A | :sample{kind="tone" value="#FFFFFF" ink="#000000"} `slate-deep.light.0` via neutral.0 · #FFFFFF | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} `slate-deep.dark.50` via neutral.50 · #0F172A | :sample{kind="tone" value="#FFFFFF" ink="#000000"} `slate-deep.light.0` via neutral.0 · #FFFFFF | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} `slate-deep.dark.50` via neutral.50 · #0F172A |
| `color.text.primary` | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} `slate-deep.light.900` via neutral.900 · #0F172A | :sample{kind="tone" value="#F8FAFC" ink="#000000"} `slate-deep.dark.900` via neutral.900 · #F8FAFC | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} `slate-deep.light.900` via neutral.900 · #0F172A | :sample{kind="tone" value="#F8FAFC" ink="#000000"} `slate-deep.dark.900` via neutral.900 · #F8FAFC | :sample{kind="tone" value="#0F172A" ink="#FFFFFF"} `slate-deep.light.900` via neutral.900 · #0F172A | :sample{kind="tone" value="#F8FAFC" ink="#000000"} `slate-deep.dark.900` via neutral.900 · #F8FAFC |
| `color.action.primary` | :sample{kind="tone" value="#0F766E" ink="#FFFFFF"} `teal.light.600` #0F766E | :sample{kind="tone" value="#7FCFC6" ink="#000000"} `teal.dark.600` #7FCFC6 | :sample{kind="tone" value="#6D28D9" ink="#FFFFFF"} `purple.light.600` #6D28D9 | :sample{kind="tone" value="#B79DF7" ink="#000000"} `purple.dark.600` #B79DF7 | :sample{kind="tone" value="#C2410C" ink="#FFFFFF"} `orange.light.600` #C2410C | :sample{kind="tone" value="#F7A67F" ink="#000000"} `orange.dark.600` #F7A67F |
| `color.action.primary.hover` | :sample{kind="tone" value="#015852" ink="#FFFFFF"} `teal.light.700` #015852 | :sample{kind="tone" value="#A1DCD4" ink="#000000"} `teal.dark.700` #A1DCD4 | :sample{kind="tone" value="#5212AA" ink="#FFFFFF"} `purple.light.700` #5212AA | :sample{kind="tone" value="#C9B7FC" ink="#000000"} `purple.dark.700` #C9B7FC | :sample{kind="tone" value="#942D02" ink="#FFFFFF"} `orange.light.700` #942D02 | :sample{kind="tone" value="#FCBD9F" ink="#000000"} `orange.dark.700` #FCBD9F |
| `color.border.focus` | :sample{kind="tone" value="#0F766E" ink="#FFFFFF"} `teal.light.600` #0F766E | :sample{kind="tone" value="#7FCFC6" ink="#000000"} `teal.dark.600` #7FCFC6 | :sample{kind="tone" value="#6D28D9" ink="#FFFFFF"} `purple.light.600` #6D28D9 | :sample{kind="tone" value="#B79DF7" ink="#000000"} `purple.dark.600` #B79DF7 | :sample{kind="tone" value="#C2410C" ink="#FFFFFF"} `orange.light.600` #C2410C | :sample{kind="tone" value="#F7A67F" ink="#000000"} `orange.dark.600` #F7A67F |
