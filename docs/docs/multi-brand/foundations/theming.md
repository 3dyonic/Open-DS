---
composite_data: "./theming.json"
generated: "By open-ds from the scheme. Do not edit by hand."
sidebar_position: 8
title: "Theming"
description: "Multi-brand: Modes and brands."
---

# Theming

Modes and brands.

Multi-brand has **2 modes** and **3 brands**. A mode swaps the colors; corners and type stay the same in every mode. Pick a brand in the top bar to see its set.

::::brand{id="aster" name="Aster"}
::mode-preview{id="aster"}

### What a mode changes

::mode-changes{id="aster"}

### What stays the same in every mode

::mode-constants{id="aster"}


::::

::::brand{id="birch" name="Birch"}
::mode-preview{id="birch"}

### What a mode changes

::mode-changes{id="birch"}

### What stays the same in every mode

::mode-constants{id="birch"}


::::

::::brand{id="coral" name="Coral"}
::mode-preview{id="coral"}

### What a mode changes

::mode-changes{id="coral"}

### What stays the same in every mode

::mode-constants{id="coral"}


::::

## The five answers

| Question | Answer | Why |
| --- | --- | --- |
| What can a theme change? | Mode and brand | Brand and mode both change. |
| How many themes ship? | Several | Three brands in light and dark: six themes. |
| How are brands handled? | Brands as modes | Brands are theme modes over shared semantics. |
| Which modes ship? | Light and dark | Light and dark ship for every brand. |
| What changes when the theme changes? | Colors, type and shape | A brand switch changes colors, fonts and corners. |

## When to use what

| Situation | Use | Not | Why |
| --- | --- | --- | --- |
| Someone switches to dark | The dark mode of the active brand | One dark theme for all brands | Every brand ships light and dark. |
